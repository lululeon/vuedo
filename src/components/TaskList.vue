<template>
  <div>
    <div class="level">
      <button class="button" v-show="!showInputForm" @click="addTask">
        <span class="icon">
          <i class="fas fa-plus"></i>
        </span>
        <span>Add task</span>
      </button>
    </div>
    <InputForm
      :nextId="nextId" 
      @saveNewTask="saveTask"
      @hideInputForm="hideInputForm" 
      v-if="showInputForm"/>
    <transition-group name="taskpop" tag="div" class="tasklist">
      <Task v-for="task in tasks" :key="task.id" :task="task" :executionLog="getExecutionLog(task.id)" :onDelete="deleteTask" ></Task>
    </transition-group>
    <p>
      <a id="downloadlink" download="vuedo.json" :href="downloadDataset">Save your vuedo list</a>.
    </p>
  </div>
</template>

<script>
import Task from './Task.vue'
import InputForm from './InputForm.vue'

export default {
  name: 'TaskList',
  components: {
      Task,
      InputForm
  },
  data() {
    //in components, you must RETURN the data object
    return {
      tasks: [
        { id: 1, description: 'Jazz practice', count:2, targetReached: false, 
          metric: {
            timeframe: 'tf:daily',
            uomId: 'time:hour',
            measureTarget: 3,
            stepSize: 1 // default
          }
        },
        { id: 2, description: 'Strength training', count:1, targetReached: false,
          metric: {
            timeframe: 'tf:weekly',
            uomId: 'none:count',
            measureTarget: 3,
            stepSize: 1 // default
          }
        },
        { id: 3, description: 'meditation practice', count:0, targetReached: false,
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
        { taskId: 1, timestamp:'2018-01-29', value: 2, targetReached: false },
        { taskId: 2, timestamp:'2018-01-29', value: 1, targetReached: false },
        { taskId: 2, timestamp:'2018-01-30', value: 2, targetReached: false },
        { taskId: 1, timestamp:'2018-01-31', value: 4, targetReached: true },
        { taskId: 2, timestamp:'2018-01-31', value: 3, targetReached: true }
      ],
      sentimentLog: [
        { goalId: 1, timestamp:'2018-01-29T12:00:00', anxiety:4, happiness:5, achieving:true }
      ],
      nextId: 1,
      showInputForm:false
    }
  },

  methods: {
    addTask() {
      this.showInputForm = true;
    },
    hideInputForm() {
      this.showInputForm = false;
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
      return this.executionLog.filter(execItem => {
        return (execItem.taskId === taskId);
      });
    }
  },

  mounted() {
    //initialize id generation
    this.nextId = 1 + this.tasks.reduce((accumulator, nextItem) => {
      return Math.max(nextItem.id, accumulator);
    }, 0);
  },

  computed: {
    downloadDataset() {
      var buffer = "data:text/json;charset=utf-8," + 
        encodeURIComponent(JSON.stringify(this.tasks).split(',').join(',\r\n'));
        return buffer;
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