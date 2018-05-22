<template>
  <div id="app">
    <div class="container">
      <div class="content">
        <h1>Vue<span class="has-text-info">do</span></h1>
        <p class="slogan">The magical art of execution | <span class="curdate">{{ currentDay }}</span> </p>
        <p>day start [ {{ dayStart }} ] week start [ {{ weekStart }} ] month start [ {{ monthStart }} ]</p>
        <div id="task-list">
          <TaskList/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// >>> fontawesome setup for vue.js
import Vue from 'vue'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import fontawesome from '@fortawesome/fontawesome'
import solid from '@fortawesome/fontawesome-free-solid'
fontawesome.library.add(solid) // Use any icon from the Solid style
Vue.component('font-awesome-icon', FontAwesomeIcon) // Use the icon component anywhere in the app
// <<<
import moment from 'moment';
import TaskList from './components/TaskList.vue';

export default {
  name: 'app',
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
    },
    dayStart() {
      return moment().startOf('day').format('llll'); 
    },
    weekStart() {
      return moment().startOf('week').format('llll'); 
    },
    monthStart() {
      return moment().startOf('month').format('llll'); 
    }
  }
}
</script>

<style lang="sass">
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
