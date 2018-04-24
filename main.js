Vue.component('task', { //hypenated names is best practice
  props: {
    task: {
      type: Object
    },
    onDelete: {
      type: Function
    }
  },

  data() {
    return {
      count: this.task.count
    };
  },

  template: `
  <article class="task">
    <header class="task-header">
      <p class="task-header-title">
        {{task.description}}
      </p>
      <div class="task-measure" :class="{'has-background-success' : count > 0}">
          <a href="#" class="task-measure-count" aria-label="current count">{{count}}</a>
      </div>
      <div class="task-measure has-background-info">
        <a class="task-measure-addcount" @click="incrementCount" aria-label="increment count">+</a>
      </div>
    </header>
    <div class="task-body">
      <p>Task ID: <span class="task-meta-detail-id" aria-label="task id">{{task.id}}</span></p>
      <p>metadata / info to go here.</p>
    </div>
    <div class="task-footer">
      <button class="button primary is-medium is-warning"><span class="icon"><i class="fas fa-edit"></i></span>Edit</button>
      <button class="button primary is-medium is-danger" @click="deleteTask"><span class="icon"><i class="fas fa-trash-alt"></i></span>Delete</button>
    </div>
  </article>
  `,

  methods: {
    deleteTask() {
      this.onDelete(this.task.id);
      //todo: prompt to delete measures as well.
    },
    incrementCount() {
      this.count += 1;
    }
  }
});


Vue.component('task-list', { //hyphenated names is best practice

  template: `
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
      <task v-for="task in tasks" :key="task.id" :task="task" :onDelete="deleteTask" ></task>
    </div>
    <p>
      <a id="downloadlink" download="vuedo.json" :href="downloadDataset">Save your vuedo list</a>.
    </p>
  </div>
  `,

  data() {
    //in components, you must RETURN the data object
    return {
      tasks: [
        { id: 1, description: 'Jazz practice', timed:'true', count:2, targetReached: false, 
          metric: {
            timeWindow: 'day', //day|week|month|quarter|year
            uom: 'hour', //all UOMs... lb, kilo, miles, km, minutes, etc... incl. custom
            measureTarget: 4
          }
        },
        { id: 2, description: 'Math practice', timed:'true', count:3, targetReached: false },
        { id: 3, description: 'do laundry', count:1, targetReached: true },
        { id: 4,  description: 'Make a new connection', count:2, targetReached: false },
        { id: 5, description: 'write letter', timed:'true', count:1, targetReached: true }
      ],

      measures: [
        { taskId: 1, timestamp:'2018-01-15', value: 2, targetReached: false },
        { taskId: 1, timestamp:'2018-01-31', value: 4, targetReached: false }
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
});
