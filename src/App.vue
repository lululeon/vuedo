<template>
  <div id="app">
    <div class="container">
      <div class="content">
        <h1>Vue<span class="has-text-info">do</span></h1>
        <p class="slogan">The magical art of execution </p>
        <p>Executing the <span class="template-type">{{ dayTemplateType }}</span> template for <span class="curdate">{{ currentDay }}</span></p>
        <div id="task-list">
          <TaskList/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
