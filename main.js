Vue.component('task', { //hypenated names is best practice
  props: {
    taskName: {
      type: String
    },
    executions: {
      default: 0,
      type: Number
    },
  },

  data() {
    return {
      isVisible: true
    };
  },

  template: `
  <article class="task" v-show="isVisible">
    <header class="task-header">
      <p class="task-header-title">
        {{taskName}}
      </p>
      <a href="#" class="task-header-executions" aria-label="total number of executions">
        {{executions}}
      </a>
    </header>
    <div class="task-meta">
    </div>
    <footer class="task-footer">
      <button class="button primary is-medium"><span class="icon"><i class="fas fa-save"></i></span>Save</button>
      <button class="button primary is-medium"><span class="icon"><i class="fas fa-edit"></i></span>Edit</button>
      <button class="button primary is-medium" @click="deleteTask"><span class="icon"><i class="fas fa-trash-alt"></i></span>Delete</button>
    </footer>
  </article>
  `,

  methods: {
    deleteTask() {
      this.isVisible = false;
      console.log(this.isVisible);
    }
  }
});


Vue.component('task-list', { //hyphenated names is best practice

  template: `
  <div>
    <button class="button has-background-info" @click="addTask">
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
      <task v-for="task in tasks" :key="task.id" :taskName="task.description"></task>
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
        { id: 1, description: 'Go to the store', timed:'true', completed: false },
        { id: 2, description: 'tidy up', timed:'true', completed: false },
        { id: 3, description: 'do laundry', completed: true },
        { id: 4,  description: 'study vue', completed: false },
        { id: 5, description: 'write letter', timed:'true', completed: true }
      ],
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
    setBlankTask() {
      this.newtask = {
        description: '',
        timed: false,
        completed: false
      };
    }
  },

  mounted() {
    this.setBlankTask();
    console.log("***", this.newtask);
  },

  computed: {
    downloadDataset() {
      var buffer = "data:text/json;charset=utf-8," + 
        encodeURIComponent(JSON.stringify(this.tasks).split(',').join(',\r\n'));
        return buffer;
    }
  }
});
