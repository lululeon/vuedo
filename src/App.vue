<template>
  <div id="app">
    <div class="container">
      <div class="content">
        <h1>Vue<span class="has-text-info">do</span></h1>
        <p class="slogan">The magical art of execution | <span class="curdate">{{ currentDay }}</span> </p>
        <div id="task-list">
          <TaskList/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import moment from 'moment';

// >>> fontawesome setup for vue.js
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import fontawesome from '@fortawesome/fontawesome'
import solid from '@fortawesome/fontawesome-free-solid'
fontawesome.library.add(solid) // Use any icon from the Solid style
Vue.component('font-awesome-icon', FontAwesomeIcon) // Use the icon component anywhere in the app
// <<<

// >>> vuex
import Vuex from 'vuex';
Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    goals: [],
    tasks: [],
    executionLog: [],
    sentimentLog: []
  },
  mutations: {
    // increment (state) {
    //   state.count++
    // }
    initialize (state, initPayload) {
      //cannot mutate root obj; breaks reactivity... so doing properties one by one...
      state.goals = initPayload.goals;
      state.tasks = initPayload.tasks;
      state.executionLog = initPayload.executionLog;
      state.sentimentLog = initPayload.sentimentLog;

      //descending order of events necessary for chronology-based logic:
      if(state.executionLog.length > 1) {
        state.executionLog.sort((a, b) => {
          const datetimestringA = a.timestamp.toLowerCase();
          const datetimestringB = b.timestamp.toLowerCase();
          //MDN: If compareFunction(a, b) is less than 0, sort a to an index lower than b, i.e. a comes first. Hence '>' => reverse sort.
          if (datetimestringA > datetimestringB) {
            return -1;
          }
          return 1;
        });
      }
      if(state.sentimentLog.length > 1) {
        state.sentimentLog.sort((a, b) => {
          const datetimestringA = a.timestamp.toLowerCase();
          const datetimestringB = b.timestamp.toLowerCase();
          //MDN: If compareFunction(a, b) is less than 0, sort a to an index lower than b, i.e. a comes first. Hence '>' => reverse sort.
          if (datetimestringA > datetimestringB) {
            return -1;
          }
          return 1;
        });
      }
    },
    updateTask (state, updatedTask) {
      let tasks = state.tasks;
      for(let i=0; i<tasks.length; i++){
        const curTask = tasks[i];
        if (curTask.id === updatedTask.id) {
          //update item and exit loop
          tasks.splice(i, 1, updatedTask);
          break;
        }
      }
      Vue.set(state, 'tasks', tasks);
    },
    newExecutionLog (state, logItem) {
      Vue.set(state, 'executionLog', [logItem, ...state.executionLog]); //preserve descending order (latest at top)
    },
    undoExecutionLogByTaskId (state, taskId) { //because of ordering, this should find the latest first
      let logList = state.executionLog;
      for(let i=0; i<logList.length; i++){
        const logItem = logList[i];
        if (logItem.taskId === taskId) {
          //delete item and exit loop
          logList.splice(i, 1);
          break;
        }
      }
      Vue.set(state, 'executionLog', logList);
    }
  },
  getters: {
    // goals (state) {
    //   return state.goals;
    // },
    // tasks (state) {
    //   return state.tasks;
    // },
    // executionLog (state) {
    //   return state.executionLog;
    // },
    // sentimentLog (state) {
    //   return state.sentimentLog;
    // }
  }
});
// <<<
import TaskList from './components/TaskList.vue';

export default {
  name: 'app',
  store,
  components: {
    TaskList
  },
  data() {
    return {
      dayTemplateType: "Daily"
    }
  },
  methods: {
  },
  computed: {
    currentDay() {
      return moment().format("MMM Do YYYY");
    }
  }
}
</script>

<style lang="sass">
@import url('https://fonts.googleapis.com/css?family=Nunito:400,700');
$family-primary: 'Nunito';
@import '../node_modules/bulma/bulma.sass';
</style>

<style>
.container {
  padding: 3rem;
}
.curdate, .template-type {
  font-weight: bold;
}

</style>
