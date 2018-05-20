<template>
  <article class="task">
    <header class="task-header">
      <span class="task-header-title">
        {{task.description}}
      </span>
      <div class="task-measure stats" :class="{'measure-positive' : count > 0}">
          <a href="#" class="task-measure-count" aria-label="current count">{{ count }}</a>
      </div>
      <div class="task-measure counter">
        <a class="task-measure-addcount" @click="increment" aria-label="increment count">+</a>
      </div>
    </header>
    <div class="task-body">
      <div class="task-meta-cells">
        <div class="task-meta-cell"><span>id</span><span>{{ task.id }}</span></div>
        <div class="task-meta-cell"><span>target</span><span>{{ task.metric.measureTarget }}</span></div>
        <div class="task-meta-cell"><span>metric</span><span>{{ metric }}</span></div>
        <div class="task-meta-cell"><span>timeframe</span><span>{{ timeframe }}</span></div>
        <div class="task-meta-cell"><span>step size</span><span>{{ task.metric.stepSize }}</span></div>
        <div class="task-value-cell"><span>running total</span><span>{{ runningTotal }} {{ metric }} {{ thisTimeframeText }} </span></div>
      </div>
    </div>
    <div class="task-footer buttons">
      <button class="button primary is-warning is-outlined">
        <span class="icon"><font-awesome-icon :icon="['fas', 'edit']" /></span>
      </button>
      <button class="button primary is-danger is-outlined" @click="deleteTask">
        <span class="icon"><font-awesome-icon :icon="['fas', 'trash-alt']" /></span>
      </button>
    </div>
  </article>
</template>

<script>
import uomList from '../data/uom';
import mathjs from 'mathjs';
import timeframes from '../data/timeframes';

export default {
  name: 'Task',
  components: {
  },
  props: {
    task: {
      type: Object
    },
    executionLog: {
      type: Array
    },
    onDelete: {
      type: Function
    }
  },

  data() {
    return {
      count: this.task.count || 0,
      value: 0
    };
  },

  methods: {
    deleteTask() {
      this.onDelete(this.task.id);
      //todo: prompt to delete measures as well.
    },
    increment() {
      // ----- { taskId: 1, timestamp:'yyyy-mm-ddThh:mm:ss', value: 2, targetReached: false } ----
      // timestamp
      // count
      this.count += 1;
      // raw value to be stored: value = stepSize x metric.uomMultiplier
      this.value += this.task.metric.stepSize * uomList[this.task.metric.uomId].uomMultiplier;
      // targetReached
    },
    getUomAttr(id, attr) {
      if(!uomList[id]) return '';
      const val = uomList[id][attr];
      return val || '';
    }
  },

  computed: {
    runningTotal() {
      return mathjs.round(this.value / uomList[this.task.metric.uomId].uomMultiplier, 2);
    },
    metric() {
      return this.getUomAttr(this.task.metric.uomId, 'uomShorthand')
    },
    timeframe() {
      return timeframes[this.task.metric.timeframe];
    },
    thisTimeframeText() {
      const tf = timeframes[this.task.metric.timeframe];
      if(tf === timeframes['tf:daily']) {
        return 'today';
      } else if(tf === timeframes['tf:weekly']) {
        return 'this week';
      }
      return 'this month';
    }
  },

  mounted() {
    if(this.executionLog.length > 1) {
      this.executionLog.sort((a, b) => {
        const datetimestringA = a.timestamp.toLowerCase();
        const datetimestringB = b.timestamp.toLowerCase();
        //MDN: If compareFunction(a, b) is less than 0, sort a to an index lower than b, i.e. a comes first. Hence '>' => reverse sort.
        if (datetimestringA > datetimestringB) {
          return -1;
        }
        return 1;
      });
    }
    this.value = (this.executionLog[0]) ? this.executionLog[0].value : 0;
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
.task-meta-cell, .task-value-cell {
  text-align: center;
  width: 100px;
  margin: 0.15rem;
  display: flex;
  flex-direction: column;
  border: 1px solid #eee;
  border-radius: 0.3rem;
}
.task-value-cell {
  width: 200px;
  color: #fff;
  background-color: #209cee;
}
.task-meta-cell span, .task-value-cell span {
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
  .task-meta-cell, .task-value-cell {
    flex-direction: row;
    width: 100%;
  }
  .task-meta-cell span, .task-value-cell span {
    flex-basis: 0;
    flex-grow: 1;
  }
}
</style>
