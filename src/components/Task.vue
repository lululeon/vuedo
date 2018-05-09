<template>
  <article class="task">
    <header class="task-header">
      <p class="task-header-title">
        {{task.description}}
      </p>
      <div class="task-measure" :class="{'has-background-success' : count > 0}">
          <a href="#" class="task-measure-count" aria-label="current count">{{count}}</a>
      </div>
      <div class="task-measure has-background-info">
        <a class="task-measure-addcount" @click="incrementCount" aria-label="increment count">+</a>
      </div>
    </header>
    <div class="task-body">
      <p>Task ID: <span class="task-meta-detail-id" aria-label="task id">{{task.id}}</span></p>
      <p>metadata / info to go here.</p>
    </div>
    <div class="task-footer">
      <button class="button primary is-medium is-warning"><span class="icon"><i class="fas fa-edit"></i></span>Edit</button>
      <button class="button primary is-medium is-danger" @click="deleteTask"><span class="icon"><i class="fas fa-trash-alt"></i></span>Delete</button>
    </div>
  </article>  
</template>

<script>
export default {
  name: 'Task',
  components: {
  },
  props: {
    task: {
      type: Object
    },
    onDelete: {
      type: Function
    }
  },

  data() {
    return {
      count: this.task.count
    };
  },

  methods: {
    deleteTask() {
      this.onDelete(this.task.id);
      //todo: prompt to delete measures as well.
    },
    incrementCount() {
      this.count += 1;
    }
  }
}
</script>