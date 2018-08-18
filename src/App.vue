<template>
  <div id="app">
    <Navbar/>
    <div class="view-wrapper container is-fluid">
      <router-view>
      </router-view>
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
import Navbar from './components/Navbar';

export default {
  name: 'app',
  store,
  components: {
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

<style lang="scss">
@import '@/css/main.scss';
</style>

