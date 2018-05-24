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
    }
  },
  getters: {
    tasks (state) {
      return state.tasks;
    }
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
