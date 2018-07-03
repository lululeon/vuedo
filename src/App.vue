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
import Vue from 'vue';
import moment from 'moment';

// >>> global event bus:
import EventHub from 'vue-event-hub';
Vue.use(EventHub);
// <<<

// >>> fontawesome setup for vue.js
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import fontawesome from '@fortawesome/fontawesome';
import solid from '@fortawesome/fontawesome-free-solid';
fontawesome.library.add(solid); // Use any icon from the Solid style
Vue.component('font-awesome-icon', FontAwesomeIcon); // Use the icon component anywhere in the app
// <<<

// >>> vuex
import { store } from '@/store/store';
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
