<template>
  <div id="tasks-view">
    <router-view></router-view>
    <TaskList/>
  </div>
</template>

<script>
import TaskList from '@/components/TaskList';
export default {
  name: 'Tasks',
  components: {
    TaskList
  },
  mounted() {
    this.$eventHub.on('hideUploadWidget',() => { 
      this.backToCurrentTasksView();
    });
    this.$eventHub.on('hideInputForm',() => { 
      this.backToCurrentTasksView();
    });
  },
  methods: {
    backToCurrentTasksView() {
      this.$router.push('/tasks'); //head back to main tasks view after import
    }
  }
}
</script>




