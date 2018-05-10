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
      <Task v-for="task in tasks" :key="task.id" :task="task" :onDelete="deleteTask" ></Task>
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
            timeWindow: 'day', //target per day|week|month|quarter|year
            uomId: 'time:hour',
            measureTarget: 3,
            stepSize: 1 // default
          }
        },
        { id: 2, description: 'Strength training', count:1, targetReached: false,
          metric: {
            timeWindow: 'week', //target per day|week|month|quarter|year
            uomId: 'none:count',
            measureTarget: 3,
            stepSize: 1 // default
          }
       }
      ],
      measures: [
        { taskId: 1, timestamp:'2018-01-29', value: 2, targetReached: false },
        { taskId: 2, timestamp:'2018-01-29', value: 1, targetReached: false },
        { taskId: 2, timestamp:'2018-01-30', value: 2, targetReached: false },
        { taskId: 1, timestamp:'2018-01-31', value: 4, targetReached: true },
        { taskId: 2, timestamp:'2018-01-31', value: 3, targetReached: true }
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