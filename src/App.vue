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

// // >>> fontawesome setup for vue.js
// import fontawesome from '@fortawesome/fontawesome';
// import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
// import solid from '@fortawesome/fontawesome-free-solid';
// //for the other styles (and pro, if u have licence), import items individually:
// import { faCommentAlt, faCommentDots } from '@fortawesome/free-regular-svg-icons';
// fontawesome.library.add(solid); // Use any icon from the Solid style
// fontawesome.library.add(faCommentAlt); // Use any icon from the Regular style
// // <<<


// >>> updated fontawesom setup for vue.js
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons'; // 'fas' icons
import { faCommentDots, faCommentAlt, faCheckCircle, faTimesCircle} from '@fortawesome/free-regular-svg-icons'; //'far' icons
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { getPersistedState } from './store/statemapping';
library.add(fas, faCommentDots, faCommentAlt, faCheckCircle, faTimesCircle);
Vue.component('font-awesome-icon', FontAwesomeIcon); // Use anywhere
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
      dayTemplateType: "Daily"
    }
  },
  methods: {
  },
  mounted() {
    if (!this.$store.initialized) {
      getPersistedState()
      .then(persistedState => {
        console.log('*** this is what was fetched from indexeddb:', persistedState); //eslint-disable-line no-console
        this.$store.commit('initialize', persistedState);
      })
      .catch(error => {
        // TODO handle properly / ui msg
        // TODO distinguish no cache from existing cache unable to load
        console.log('could not load from cache:', error); // eslint-disable-line no-console
      });
    }
  }
}
</script>

<style lang="scss">
@import '@/css/main.scss';
</style>

