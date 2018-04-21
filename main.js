Vue.component('task', { //hypenated names is best practice
  props: {
    task: {
      type: Object
    },
    executions: {
      default: 0,
      type: Number
    },
    onDelete: {
      type: Function
    }
  },

  data() {
    return {
      isVisible: true
    };
  },

  template: `
  <article class="task">
    <div class="task-meta">
      <header class="task-meta-header">
        <p class="task-meta-header-title">
          {{task.description}}
        </p>
      </header>
      <div class="task-meta-detail">
        <span class="task-meta-detail-id" aria-label="task id">{{task.id}}</span>
      </div>
      <footer class="task-meta-footer">
        <button class="button primary is-medium"><span class="icon"><i class="fas fa-save"></i></span>Save</button>
        <button class="button primary is-medium"><span class="icon"><i class="fas fa-edit"></i></span>Edit</button>
        <button class="button primary is-medium" @click="deleteTask"><span class="icon"><i class="fas fa-trash-alt"></i></span>Delete</button>
      </footer>
    </div>
    <div class="task-measure">
      <a href="#" class="task-measure-count" aria-label="current count">{{task.count}}</a>
    </div>
    <div class="task-measure">
      <a href="#" class="task-measure-addcount" aria-label="increment count">+</a>
    </div>
  </article>
  `,

  methods: {
    deleteTask() {
      //this.isVisible = false;
      this.onDelete(this.task.id);
    }
  }
});


Vue.component('task-list', { //hyphenated names is best practice

  template: `
  <div>
    <button class="button" @click="addTask">
      <span class="icon">
        <i class="fas fa-plus"></i>
      </span>
      Add task
    </button>
    <div class="card" v-if="showInputForm">
      <div class="card-header">
        <div class="card-header-title">Add a new task</div>
      </div>
      <div class="card-content">
        <form>
          <input type="text" name="description" v-model="newtask.description"/>
        </form>
      </div>
      <div class="card-footer">
        <button class="button has-background-info" @click="saveTask">
          <span class="icon">
            <i class="fas fa-save"></i>
          </span>
          Save
        </button>
      </div>
    </div>
    <div>
      <task v-for="task in tasks" :key="task.id" :task="task" :onDelete="deleteTask"></task>
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
      showInputForm:false
    }
  },

  methods: {
    addTask() {
      this.showInputForm = true;
    },
    saveTask() {
      this.tasks.push(this.newtask);
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
