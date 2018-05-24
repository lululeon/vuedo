<template>
  <div>
    <div class="level">
      <div class="level-left">
        <button class="button level-item is-info" @click="loadTasks">
          <span class="icon">
            <font-awesome-icon :icon="['fas', 'file']" />
          </span>
          <span>Upload your own tasks!</span>
        </button>
        <button class="button level-item is-primary" @click="addTask">
          <span class="icon">
            <font-awesome-icon :icon="['fas', 'plus']" />
          </span>
          <span>Add task</span>
        </button>
        <a id="downloadlink" download="vuedo.json" :href="downloadDataset">
          <button class="button level-item is-warning">
            <span class="icon">
              <font-awesome-icon :icon="['fas', 'download']" />
            </span>
            <span>Download your data</span>
          </button>
        </a>
      </div>
    </div>
    <InputForm
      :nextId="nextId" 
      @saveNewTask="saveTask"
      @hideInputForm="hideInputForm" 
      v-if="showInputForm"/>
    <transition-group name="taskpop" tag="div" class="tasklist">
      <Task v-for="task in tasks" 
        :key="task.id" 
        :task="task" 
        :executionLog="getExecutionLog(task.id)" 
        :currentTimeframe="currentTimeframes[task.metric.timeframe]"
        :onDelete="deleteTask" />
    </transition-group>
    <UploadWidget 
      v-if="showUploadWidget"
      @hideUploadWidget="hideUploadWidget"
      @uploadReady="populateDataStore" />
  </div>
</template>

<script>
import moment from 'moment';
import jsonbeautify from 'json-beautify';
import { mapState } from 'vuex'
import Task from './Task.vue';
import InputForm from './InputForm';
import UploadWidget from './UploadWidget';
import timeframes from '../data/timeframes';

export default {
  name: 'TaskList',
  components: {
      Task,
      InputForm,
      UploadWidget
  },
  data() {
    //in components, you must RETURN the data object
    return {
      /*
      tasks: [
        { id: 1, description: 'Jazz practice', targetReached: false, 
          metric: {
            timeframe: 'tf:daily',
            uomId: 'time:hour',
            measureTarget: 3,
            stepSize: 1 // default
          }
        },
        { id: 2, description: 'Strength training at gym', targetReached: false,
          metric: {
            timeframe: 'tf:monthly',
            uomId: 'none:count',
            measureTarget: 8,
            stepSize: 1 // default
          }
        },
        { id: 3, description: 'meditation practice', targetReached: false,
          metric: {
            timeframe: 'tf:weekly',
            uomId: 'time:minute',
            measureTarget: 60,
            stepSize: 15 // default
          }
       }
      ],
      goals: [
        { id: 1, name: 'Learn to be happy in life!'}
      ],
      executionLog: [
        { taskId: 1, timestamp:'2018-05-19T14:00:03', value: 2, targetReached: false },
        { taskId: 2, timestamp:'2018-05-19T10:00:05', value: 1, targetReached: false },
        { taskId: 2, timestamp:'2018-05-20T17:37:02', value: 2, targetReached: false },
        { taskId: 1, timestamp:'2018-05-21T18:11:12', value: 4, targetReached: true },
        { taskId: 2, timestamp:'2018-05-22T09:02:00', value: 3, targetReached: true }
      ],
      sentimentLog: [
        { goalId: 1, timestamp:'2018-01-29T12:00:00', anxiety:4, happiness:5, achieving:true }
      ],
      */
      nextId: 1,
      showInputForm:false,
      showUploadWidget:false,
      currentTimeframes: {}
    }
  },

  methods: {
    addTask() {
      this.showInputForm = true;
    },
    loadTasks() {
      this.showUploadWidget = true;
    },
    hideInputForm() {
      this.showInputForm = false;
    },
    hideUploadWidget() {
      this.showUploadWidget = false;
    },
    saveTask(taskToSave) {
      this.tasks.push(taskToSave);
      this.nextId += 1;
    },
    deleteTask(taskId) {
      let idx = this.tasks.findIndex((task)=>{
        return (task.id == taskId);
      });
      this.tasks.splice(idx, 1);
    },
    getExecutionLog(taskId) {
      if(!this.$store.executionLog) return [];
      return this.$store.executionLog.filter(execItem => {
        return (execItem.taskId === taskId);
      });
    },
    updateTimeframes() {
      const dayStart = moment().startOf('day');
      const dayEnd = moment().endOf('day');
      const weekStart = moment().startOf('isoWeek'); //ISO standard first weekday is Monday
      const weekEnd = moment().endOf('isoWeek');
      const monthStart = moment().startOf('month');
      const monthEnd = moment().endOf('month');
      timeframes['tf:daily'].start = dayStart;
      timeframes['tf:daily'].end = dayEnd;
      timeframes['tf:weekly'].start = weekStart;
      timeframes['tf:weekly'].end = weekEnd;
      timeframes['tf:monthly'].start = monthStart;
      timeframes['tf:monthly'].end = monthEnd;
      this.currentTimeframes = timeframes;     
    },
    populateDataStore(uploadDataObj) {
      //load the data: TODO: load to store
      this.$store.commit('initialize', uploadDataObj);
      this.hideUploadWidget();
      console.log(this.tasks);

      //initialize id generation
      // this.nextId = 1 + this.tasks.reduce((accumulator, nextItem) => {
      //   return Math.max(nextItem.id, accumulator);
      // }, 0);
      this.nextId = 1 + this.$store.getters.tasks.reduce((accumulator, nextItem) => {
        return Math.max(nextItem.id, accumulator);
      }, 0);

      //set up the clock!
      //setInterval(this.checkTime, 3000); //every 3 secs
    }
  },

  created() {
    this.updateTimeframes();
  },

  mounted() {
  },

  computed: {
    ...mapState(['tasks']),
    downloadDataset() {
      if(!this.tasks) return '';

      const dataset = {
        tasks: this.tasks,
        goals: this.goals,
        executionLog: this.executionLog,
        sentimentLog: this.sentimentLog
      };

      // let jsonstr = JSON.stringify(dataset).split(',').join(',\r\n');
      const jsonstr = jsonbeautify(dataset, null, 2, 100);
      const responseBuffer = "data:text/json;charset=utf-8," + encodeURIComponent(jsonstr);
      return responseBuffer;
    }
  }
}
</script>

<style scoped>
.tasklist {
  display: flex;
  flex-direction: column-reverse;
}
.taskpop-enter-active {
  animation: pop 0.25s;
}
.taskpop-leave-active {
  animation: pop 0.5s reverse;
}
@keyframes pop {
  0% {
    background-color: none;
    transform: scale(0.9) translateY(-5%);
  }
  90% {
    background-color: #fcdd57;
    transform: scale(1.02);    
  }
  100% {
    background-color: none;
    transform: scale(1) translateY(0%);
  }
}
</style>