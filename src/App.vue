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
.task {
  border: 1px solid #eee;
  padding: 1rem;
  margin: 0.8rem 0;
  border-radius: 0.3rem;
}
.task-header {
  display: flex;
  background-color: #e3eff9;
  border-radius: 0.3rem;
  padding: 1rem;

}
.task-header-title {
  flex-grow: 2;
  font-size: 1.75rem;
}
.task-measure {
  font-size: 1.5rem;
  border-radius: 0.3rem;
  margin: 0.2rem;
  background-color: grey;
}
.task-body {
  padding: 1rem;
}
/*a, a:hover, a:active, a:link { text-decoration: none; }*/
.button .icon:first-child:last-child { margin: inherit; } /*bulma fix*/
a.task-meta-id {
  color: grey;
}
a.task-measure-count, a.task-measure-addcount {
  color: white;
  display: inline-block;
  padding:1rem;
}
.curdate, .template-type {
  font-weight: bold;
}

</style>
