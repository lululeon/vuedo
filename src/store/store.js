import Vue from 'vue';
import Vuex from 'vuex';
import uuidv1 from 'uuid/v1';
// import { persistencePlugin } from './persistencePlugin';
import { vuexPlugin } from './localDBPlugin';

Vue.use(Vuex);

const overwriteStore = (state, importPayload) => {
  //cannot mutate root obj; breaks reactivity... so doing properties one by one...
  state.username = importPayload.username || 'anonymous';
  state.goals = importPayload.goals || [];
  state.tasks = importPayload.tasks || [];
  state.executionLog = importPayload.executionLog || [];
  state.sentimentLog = importPayload.sentimentLog || [];

  //descending order of events necessary for chronology-based logic:
  if (state.executionLog.length > 1) {
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
  if (state.sentimentLog.length > 1) {
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
}

export const store = new Vuex.Store({
  state: {
    initialized: false,
    username: 'anonymous',
    goals: [],
    tasks: [],
    executionLog: [],
    sentimentLog: []
  },
  mutations: {
    initialize(state, persistedState) {
      overwriteStore(state, persistedState);
      Vue.set(state, 'initialized', true);
    },
    import(state, importPayload) {
      overwriteStore(state, importPayload);
    },
    updateUsername(state, updatedName) {
      Vue.set(state, 'username', updatedName);
    },
    newTask(state, newTask) {
      const tasks = state.tasks;
      Vue.set(state, 'tasks', [...tasks, newTask]);
    },
    updatedTask(state, updatedTask) {
      let tasks = state.tasks;
      for (let i = 0; i < tasks.length; i++) {
        const curTask = tasks[i];
        if (curTask.id === updatedTask.id) {
          //update item and exit loop
          tasks.splice(i, 1, updatedTask);
          break;
        }
      }
      Vue.set(state, 'tasks', tasks);
    },
    newExecutionLog(state, logItem) {
      Vue.set(state, 'executionLog', [logItem, ...state.executionLog]); //preserve descending order (latest at top)
    },
    undoExecutionLogByTaskId(state, taskId) { //because of ordering, this should find the latest first
      let logList = state.executionLog;
      for (let i = 0; i < logList.length; i++) {
        const logItem = logList[i];
        if (logItem.taskId === taskId) {
          //delete item and exit loop
          logList.splice(i, 1);
          break;
        }
      }
      Vue.set(state, 'executionLog', logList);
    },
    deleteTask(state, taskId) {
      const taskList = state.tasks;
      const idx = taskList.findIndex((task)=>{
        return (task.id == taskId);
      });
      taskList.splice(idx, 1);
      const logList = state.executionLog.filter((logItem) => logItem.taskId != taskId);

      //persist deletes
      Vue.set(state, 'tasks', taskList);
      Vue.set(state, 'executionLog', logList);
    }
  },
  actions: { //see: https://vuex.vuejs.org/guide/actions.html
    addTask({commit}, newTask) {
      const finalizedTask = Object.assign({}, newTask, {id: uuidv1(), entityType: 'task' });
      commit('newTask', finalizedTask);
    },
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
  },
  plugins: [vuexPlugin]
});

export default {
  store
}