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
      <div class="task-meta-cells">
        <div class="task-meta-cell"><span>id</span><span>{{ task.id }}</span></div>
        <div class="task-meta-cell"><span>target</span><span>{{ task.metric.measureTarget }}</span></div>
        <div class="task-meta-cell"><span>metric</span><span>{{ this.getUomAttr(task.metric.uomId, 'uomShorthand') }}</span></div>
        <div class="task-meta-cell"><span>timeframe</span><span>{{ task.metric.timeframe }}</span></div>
        <div class="task-meta-cell"><span>step size</span><span>{{ task.metric.stepSize }}</span></div>
      </div>
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
import uomList from '../data/uom';

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
    },
    getUomAttr(id, attr) {
      if(!uomList[id]) return '';
      const val = uomList[id][attr];
      return val || '';
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
  align-items: center;
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
  margin: 0.5rem 0;
}
.task-meta-cells {
  display:flex;
}
.task-meta-cell {
  text-align: center;
  width: 100px;
  margin: 0.15rem;
  display: flex;
  flex-direction: column;
  border: 1px solid #eee;
  border-radius: 0.3rem;
}
.task-meta-cell span {
    padding: 0.5rem;
}
.task-meta-cell>span:first-child {
  background-color: #f3f3f3;
  border-radius: 0.2rem 0.2rem 0 0;
}
a.task-measure-count, a.task-measure-addcount {
  color: #717171;
  display: inline-block;
  padding:1rem;
}
.task-footer .button {
  border-width: 2px;
}

@media screen and (max-width: 450px) { /*when width gets less than this...*/
  .task-header {
    flex-wrap: wrap;
  }
  .task-header-title {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
    width: 100%;
    padding: 0.25rem;
  }
  .task-meta-cells {
    flex-direction: column;
  }
  .task-meta-cell {
    flex-direction: row;
    width: 100%;
  }
  .task-meta-cell span {
    flex-basis: 0;
    flex-grow: 1;
  }
}
</style>
