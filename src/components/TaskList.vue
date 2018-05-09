<template>
  <div>
    <div class="level">
      <button class="button" v-show="!showInputForm" @click="addTask">
        <span class="icon">
          <i class="fas fa-plus"></i>
        </span>
        Add task
      </button>
    </div>
    <div class="card" v-if="showInputForm">
      <div class="card-header">
        <div class="card-header-title title has-background-warning">Add a new task</div>
      </div>
      <div class="card-content">
        <form>
          <div class="field">
            <label class="label">What do you need to do?</label>
            <div class="control has-icons-left has-icons-right">
              <input class="input" :class="{'is-danger' : showNotifErrDescription}" type="text" :placeholder="placeholder" v-model="newtask.description">
              <span class="icon is-small is-left">
                <i class="fas fa-list-alt"></i>
              </span>
              <span class="icon is-small is-right" v-if="showNotifErrDescription">
                <i class="fas fa-exclamation-triangle"></i>
              </span>
            </div>  
            <p class="help is-success" v-if="showNotifOKDescription">Great!</p>
            <p class="help is-danger" v-if="showNotifErrDescription">Do not leave blank - please enter a task description</p>
          </div>
          <div class="field">
            <div class="control">
              <label class="checkbox">
                <input type="checkbox">
                This is a timed task.
              </label>
            </div>
          </div>
        </form>
      </div>
      <div class="card-content level-right">
        <button class="level-item button" v-show="showInputForm"  @click="showInputForm=false">
          <span class="icon">
            <i class="fas fa-ban"></i>
          </span>
          Cancel task addition
        </button>
        <button class="level-item button has-background-info" @click="saveTask">
          <span class="icon">
            <i class="fas fa-save"></i>
          </span>
          Save
        </button>
      </div>
    </div>
    <div>
      <Task v-for="task in tasks" :key="task.id" :task="task" :onDelete="deleteTask" ></Task>
    </div>
    <p>
      <a id="downloadlink" download="vuedo.json" :href="downloadDataset">Save your vuedo list</a>.
    </p>
  </div>
</template>

<script>
import Task from './Task.vue' 

export default {
  name: 'TaskList',
  components: {
      Task
  },
  data() {
    //in components, you must RETURN the data object
    return {
      tasks: [
        { id: 1, description: 'Jazz practice', timed:'true', count:2, targetReached: false, 
          metric: {
            timeWindow: 'day', //target per day|week|month|quarter|year
            uomId: 'time:hour',
            measureTarget: 3,
            stepSize: 1 // default
          }
        },
        { id: 2, description: 'Strength training', timed:'false', count:1, targetReached: false,
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
      newtask: {},
      showInputForm:false,
      placeholder: "example: practice piano",
      showNotifOKDescription: false,
      showNotifErrDescription: false
    }
  },

  methods: {
    addTask() {
      this.clearInputPanel();
      this.showInputForm = true;
    },
    saveTask() {
      if(this.newtask.description === '' || this.newtask.description === this.placeholder) {
        this.showNotifErrDescription = true;
        return;
      }
      this.tasks.push(this.newtask);
      this.nextId += 1;
      this.clearInputPanel();
    },
    clearInputPanel() {
      this.setBlankTask();
      this.showNotifOKDescription = false;
      this.showNotifErrDescription = false;
    },
    deleteTask(taskId) {
      let idx = this.tasks.findIndex((task)=>{
        return (task.id == taskId);
      });
      this.tasks.splice(idx, 1);
    },
    setBlankTask() {
      this.newtask = {
        id: this.nextId,
        description: '',
        timed: false,
        count: 0,
        targetReached: false
      };
      console.log(" ***** blank task created with id:", this.nextId);
      console.log(" ***", this.newtask);
    }
  },

  mounted() {
    //initialize id generation
    this.nextId = 1 + this.tasks.reduce((accumulator, nextItem) => {
      return Math.max(nextItem.id, accumulator);
    }, 0);
    //set up next task
    this.setBlankTask();
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
