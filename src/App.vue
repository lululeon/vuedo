<template>
  <div id="app">
    <div class="container">
      <div class="content">
        <Navbar/>
        <div class="tabs">
          <ul>
            <li :class="{'is-active': selectedTab === 'tasks'}" @click="selectTab('tasks')"><router-link to="/">Tasks</router-link></li>
            <li :class="{'is-active': selectedTab === 'domains'}" @click="selectTab('domains')"><router-link to="domains">Domains</router-link></li>
            <li :class="{'is-active': selectedTab === 'wins'}" @click="selectTab('wins')"><router-link to="wins">Wins</router-link></li>
            <li :class="{'is-active': selectedTab === 'analytics'}" @click="selectTab('analytics')"><router-link to="analytics">Analytics</router-link></li>
          </ul>
        </div>
        <div id="task-list">
          <router-view>
            <TaskList/>
          </router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import EventHub from 'vue-event-hub';
Vue.use(EventHub);

// >>> fontawesome setup for vue.js
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import fontawesome from '@fortawesome/fontawesome';
import solid from '@fortawesome/fontawesome-free-solid';
fontawesome.library.add(solid); // Use any icon from the Solid style
Vue.component('font-awesome-icon', FontAwesomeIcon); // Use the icon component anywhere in the app
// <<<

import { store } from '@/store/store'; //vuex
import TaskList from './components/TaskList';
import Navbar from './components/Navbar';

export default {
  name: 'app',
  store,
  components: {
    TaskList,
    Navbar
  },
  data() {
    return {
      dayTemplateType: "Daily",
      selectedTab: 'tasks'
    }
  },
  methods: {
    selectTab(tabName) {
      this.selectedTab = tabName;
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

<style scoped>
/* override weird bulma gaps */
.tabs ul {
  margin-left: 0; 
}
.content li + li {
  margin-top: 0;
}
</style>
