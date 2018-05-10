<template>
  <article class="task">
    <header class="task-header">
      <span class="task-header-title">
        {{task.description}}
      </span>
      <div class="task-measure stats" :class="{'measure-positive' : count > 0}">
          <a href="#" class="task-measure-count" aria-label="current count">{{count}}</a>
      </div>
      <div class="task-measure counter">
        <a class="task-measure-addcount" @click="incrementCount" aria-label="increment count">+</a>
      </div>
    </header>
    <div class="task-body">
      <p>Task ID: <span class="task-meta-detail-id" aria-label="task id">{{task.id}}</span></p>
      <p>metadata / info to go here.</p>
    </div>
    <div class="task-footer buttons">
      <button class="button primary is-warning is-outlined">
        <span class="icon"><i class="fas fa-edit"></i></span>
      </button>
      <button class="button primary is-danger is-outlined" @click="deleteTask">
        <span class="icon"><i class="fas fa-trash-alt"></i></span>
      </button>
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

<style scoped>
.task {
  border: 1px solid #eee;
  padding: 1rem;
  margin: 0.8rem 0;
  border-radius: 0.3rem;
}
.task-header {
  display: flex;
  background-color: #f3f3f3;
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
  background-color: #fff;
}
.task-measure.stats {
  background-color: #dee7ec;
}
.task-measure.stats.measure-positive {
  background-color: #fafafa;
}
.task-body {
  padding: 1rem;
}
a.task-meta-id {
  color: grey;
}
a.task-measure-count, a.task-measure-addcount {
  color: #717171;
  display: inline-block;
  padding:1rem;
}
.task-footer .button {
  border-width: 2px;
}
</style>
