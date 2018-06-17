<template>
  <article class="task">
    <header class="task-header">
      <EditableText class="task-header-title" :content="tasktitle" @updated="onUpdateDescription" />
      <span  class="ministatus" v-if="!expanded">{{ runningTotal }} {{ metric }} {{ thisTimeframeText }} </span>
      <div class="task-header-ctrlbtn">
        <a @click="decrement" aria-label="decrement count">
          <span class="icon"><font-awesome-icon :icon="['fas', 'minus']" /></span>
        </a>
      </div>
      <div class="task-header-ctrlbtn">
        <a @click="increment" aria-label="increment count">
          <span class="icon"><font-awesome-icon :icon="['fas', 'plus']" /></span>
        </a>
      </div>
      <div class="task-header-ctrlbtn expander" v-if="!expanded">
        <a @click="expand" aria-label="expand">
          <span class="icon"><font-awesome-icon :icon="['fas', 'caret-up']" /></span>
        </a>
      </div>
      <div class="task-header-ctrlbtn expander" v-if="expanded">
        <a @click="collapse" aria-label="collapse">
          <span class="icon"><font-awesome-icon :icon="['fas', 'caret-down']" /></span>
        </a>
      </div>
    </header>
    <div class="task-body" v-if="expanded">
      <div class="task-meta-cells">
        <div class="task-meta-cell small"><span>id</span><span>{{ task.id }}</span></div>
        <div class="task-meta-cell large" :class="{'is-active': editingTargets}" @click="editTargets"><span>target</span><span>{{ task.metric.measureTarget }} {{ metric }} {{ timeframe }}</span></div>
        <div class="task-meta-cell"><span>step size</span><span>{{ task.metric.stepSize }} {{ stepSizeMetricLabel }}</span></div>
        <div class="task-value-cell" :class="runningTotalStyling" ><span>running total</span><span>{{ runningTotal }} {{ metric }} {{ thisTimeframeText }} </span></div>
      </div>
    </div>
    <div class="task-footer buttons" v-if="expanded">
      <button class="button primary is-danger is-outlined" @click="deleteTask">
        <span class="icon"><font-awesome-icon :icon="['fas', 'trash-alt']" /></span>
      </button>
    </div>
    <modal v-if="editingTargets"/>
  </article>
</template>

<script>
import mathjs from 'mathjs';
import moment from 'moment';
import uomList from '../data/uom';
import EditableText from './elements/EditableText';
import Modal from './Modal';


export default {
  name: 'Task',
  components: {
    EditableText,
    Modal
  },
  props: {
    task: {
      type: Object,
      required: true
    },
    currentTimeframe: {
      type: Object,
      required: true
    },
    onDelete: {
      type: Function,
      required: true
    }
  },

  data() {
    return {
      expanded: false,
      editingTargets: false
    };
  },

  methods: {
    deleteTask() {
      this.onDelete(this.task.id);
      //todo: prompt to delete measures as well.
    },
    onUpdateDescription(updDescr) {
      if(updDescr !== this.tasktitle ) {
        //update if changed
        const updTask = this.task;
        updTask.description = updDescr;
        this.$store.commit('updateTask', updTask);
      }
    },
    editTargets() {
      this.editingTargets = true;
    },
    expand() {
      this.expanded = true;
    },
    collapse() {
      this.expanded = false;
    },
    increment() {
      const taskId = this.task.id;
      const timestamp = moment().format();
      const value = this.task.metric.stepSize * uomList[this.task.metric.uomId].uomMultiplier; //stepSize x metric.uomMultiplier
      const targetReached = (value >= this.task.measureTarget) ? true : false;
      const logItem = { taskId, timestamp, value, targetReached };
      this.$store.commit('newExecutionLog', logItem);
    },
    decrement() {
      if(this.runningTotal === 0) {
        return;
      }
      this.$store.commit('undoExecutionLogByTaskId', this.task.id);
    },
    getUomAttr(id, attr) {
      if(!uomList[id]) return '';
      const val = uomList[id][attr];
      return val || '';
    }
  },

  computed: {
    tasktitle() {
      return (this.task.description);
    },
    executionLog() { //executionLog for THIS task only
      if(!this.$store.state.executionLog) return [];
      return this.$store.state.executionLog.filter(execItem => {
        return (execItem.taskId === this.task.id);
      });
    },
    filteredLogs() { //executionLog for THIS task only, filtered down to current timeframe
      return this.executionLog.filter(execItem => {
        return moment(execItem.timestamp).isAfter(this.currentTimeframe.start);
      });
    },
    value() {
      return this.filteredLogs.reduce((accumulator, nextItem) => {
        return (accumulator + nextItem.value);
      }, 0);
    },
    runningTotal() {
      return mathjs.round(this.value / uomList[this.task.metric.uomId].uomMultiplier, 2);
    },
    metric() {
      return this.getUomAttr(this.task.metric.uomId, 'uomShorthand');
    },
    stepSizeMetricLabel() {
      const value = this.task.metric.stepSize;
      if ((value === 1) || (value === '1')) {
        return this.getUomAttr(this.task.metric.uomId, 'uomSingular');
      } else {
        return this.getUomAttr(this.task.metric.uomId, 'uomLabel');
      }
    },
    timeframe() {
      return this.currentTimeframe.freqLabel;
    },
    thisTimeframeText() {
      return this.currentTimeframe.immediacyLabel;
    },
    runningTotalStyling() {
      const rt = this.runningTotal; //display units, not raw units.
      const target = this.task.metric.measureTarget; //display units, not raw units.
      if(rt > 0) {
        if(rt < target) {
          return 'progressing';
        }
        return 'achieving';
      }
      return '';
    }
  },

  mounted() {
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
  margin-bottom: 0.5rem;
}
.task-header-title {
  flex-grow: 2;
  font-size: 1.75rem;
}
.task-header-ctrlbtn {
  font-size: 1.5rem;
  border-radius: 0.3rem;
  margin: 0.2rem;
  background-color: #fff;
}
.ministatus {
  background-color: #9E9E9E;
  padding: 0.5rem;
  border-radius: 0.3rem;
  margin: 0.2rem;
  color: #fff;
}
.task-body {
  margin-bottom: 0.5rem;
}
.task-meta-cells {
  display:flex;
  padding: 0.2rem;
  border-radius: 0.3rem;
  background-color: #cecece;
}
.task-meta-cell, .task-value-cell {
  text-align: center;
  width: 100px;
  margin: 0.15rem;
  display: flex;
  flex-direction: column;
  /*border: 1px solid #eee;*/
  border-radius: 0.3rem;
  background-color: #fff;
}
.task-meta-cell.small {
  width: 50px;
}
.task-meta-cell.large {
  width: 150px;
}
.task-value-cell {
  width: 200px;
  color: #fff;
  background-color: #9e9e9e;
}
.task-value-cell.achieving {
  background-color: #8bc34a;
}
.task-value-cell.progressing {
  background-color: #dca500;
}
.task-value-cell.behind { /* not used yet */
  background-color: #f44336;
}
.task-meta-cell span, .task-value-cell span {
    padding: 0.5rem;
}
.task-meta-cell>span:first-child {
  background-color: #f3f3f3;
  border-radius: 0.2rem 0.2rem 0 0;
  font-weight: bold;
}
.task-value-cell>span:first-child {
  background-color: #3e3e3e;
  border-radius: 0.2rem 0.2rem 0 0;
}
.task-header-ctrlbtn.expander {
  background-color: #ffdd57;
}
.task-header-ctrlbtn>a {
  color: #717171;
  display: inline-block;
  padding:0.5rem;
}
.task-header-ctrlbtn>a .icon {
  display: grid; /* force centered, square tiles */
  font-size: small;
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
    margin:0;
    border-radius: 0;
  }
  .ministatus {
    width:100%;
  }
  .task-meta-cell, .task-meta-cell.small, .task-meta-cell.large,
  .task-value-cell {
    flex-direction: row;
    width: 100%;
    margin:0;
    border-radius:0;
  }
  .task-meta-cell span, .task-value-cell span {
    flex-basis: 0;
    flex-grow: 1;
  }
  .task-meta-cell>span:first-child, .task-value-cell>span:first-child {
    border-radius: 0.2rem 0 0 0.2rem;
  }
}
</style>
