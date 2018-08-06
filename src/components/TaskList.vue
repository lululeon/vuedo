<template>
  <div>
    <div class="level">
      <div class="level-left">
        <EditableText :content="username" @updated="updateUsername" class="username"/>
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
    <UploadWidget 
      v-if="showUploadWidget"
      @hideUploadWidget="hideUploadWidget"
      @uploadReady="populateDataStore" />
    <InputForm
      :nextId="nextId" 
      @saveNewTask="saveTask"
      @hideInputForm="hideInputForm" 
      v-if="showInputForm"/>
    <transition-group name="taskpop" tag="div" class="tasklist">
      <Task v-for="task in tasks" 
        :key="task.id" 
        :task="task"
        :currentTimeframe="currentTimeframes[task.metric.timeframe]"
        @editTargets="BeginEditTargets(task)"
        @deleteTask="BeginDeleteTask(task)" />
    </transition-group>
    <TaskModal :modal-type="modalType" :task="modalTask" @close="closePopup" :showModal="showModal"/>
  </div>
</template>

<script>
import moment from 'moment';
import jsonbeautify from 'json-beautify';
import { mapState } from 'vuex';
import Task from './Task.vue';
import InputForm from './InputForm';
import UploadWidget from './UploadWidget';
import EditableText from './elements/EditableText';
import { timeframesList } from '../data/timeframes';
import TaskModal from './TaskModal';

export default {
  name: 'TaskList',
  components: {
    Task,
    InputForm,
    UploadWidget,
    EditableText,
    TaskModal
  },
  data() {
    //in components, you must RETURN the data object
    return {
      nextId: 1,
      showInputForm:false,
      showUploadWidget:false,
      showModal: false,
      modalType: '',
      modalTask: {}, //the task for which the modal dialog is opened
      currentTimeframes: {}
    }
  },

  methods: {
    addTask() {
      this.showInputForm = true;
      this.hideUploadWidget();
    },
    loadTasks() {
      this.showUploadWidget = true;
      this.hideInputForm();
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
      this.$store.commit('deleteTask', taskId);
    },
    updateUsername(updName) {
      //check changed and valid, then:
      if (updName === this.username) return; //nothing changed
      if (updName.trim() === '') return; //not valid
      this.$store.commit('updateUsername', updName);
    },
    updateTimeframes() {
      const dayStart = moment().startOf('day');
      const dayEnd = moment().endOf('day');
      const weekStart = moment().startOf('isoWeek'); //ISO standard first weekday is Monday
      const weekEnd = moment().endOf('isoWeek');
      const monthStart = moment().startOf('month');
      const monthEnd = moment().endOf('month');
      const timeframes = timeframesList;
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

      //TODO: fix with proper uuids or somesuch
      this.nextId = 1 + this.tasks.reduce((accumulator, nextItem) => {
        return Math.max(nextItem.id, accumulator);
      }, 0);

      //set up the clock!
      //setInterval(this.checkTime, 3000); //every 3 secs
    },

    //========================= Task Modal interactions ======================
    BeginDeleteTask(modalTask) {
      this.modalTask = modalTask;
      this.modalType = 'deleteTask',
      this.openPopup();
    },
    BeginEditTargets(modalTask) {
      this.modalTask = modalTask;
      this.modalType = 'editTargets',
      this.openPopup();
    },
    openPopup() {
      this.showModal = true;
    },
    closePopup(){
      this.showModal = false;
    },
  },

  created() {
    this.updateTimeframes();
  },

  mounted() {
  },

  computed: {
    ...mapState(['username','tasks','goals','executionLog','sentimentLog']),
    downloadDataset() {
      if(!this.tasks) return '';

      const dataset = {
        username: this.username,
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
.username {
  font-size: 2em;
}
.tasklist {
  display: flex;
  flex-direction: column-reverse;
}
.taskpop-enter-active {
  animation: pop 0.25s;
}
.taskpop-leave-active {
  animation: popreverse 0.5s; /* reverse; IE10 wld not anim correctly*/
}
@keyframes pop {
  0% {
    transform: scale(0.9) translateY(-5%);
  }
  90% {
    transform: scale(1.02);    
  }
  100% {
    transform: scale(1) translateY(0%);
  }
}
@keyframes popreverse {
  0% {
    transform: scale(1);
  }
  10% {
    transform: scale(1.02);
    opacity: 0.5;   
  }
  100% {
    transform: scale(0.7);
    opacity: 0;
  }
}

</style>