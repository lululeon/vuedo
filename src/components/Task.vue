<template>
  <article class="task">
    <header class="task-header">
      <EditableText class="task-header-title" :content="tasktitle" @updated="onUpdateDescription" />
      <span  class="ministatus" :class="runningTotalStyling" v-if="!expanded">{{ runningTotal }} {{ metric }} {{ thisTimeframeText }} </span>
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
      <div class="task-header-ctrlbtn deleter">
        <a @click="deleteTask" aria-label="delete">
          <span class="icon"><font-awesome-icon :icon="['fas', 'trash-alt']" /></span>
        </a>
      </div>
    </header>
    <div class="task-body" v-if="expanded">
      <div class="task-meta-cells">
        <div class="task-meta-cell small"><span>id</span><span>{{ task.id }}</span></div>
        <div class="task-meta-cell large" :class="{'is-active': editingTargets}" @click="editTargets"><span>target</span><span>{{ task.metric.measureTarget }} {{ metric }} {{ timeframe }}</span></div>
        <div class="task-meta-cell large"><span>step size</span><span>{{ task.metric.stepSize }} {{ stepSizeMetricLabel }}</span></div>
        <div class="task-value-cell" :class="runningTotalStyling" ><span>running total</span><span>{{ runningTotal }} {{ metric }} {{ thisTimeframeText }} </span></div>
      </div>
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
      const failingLimit = 0.2*target;
      const slackingLimit = 0.4*target;
      const progressingLimit = 0.75*target;
      const achievingLimit = 0.95*target;
      const achievedLimit = target;
      const exceedingLimit = 1.1*target;
      if (rt > 0) {
        if (rt < failingLimit) {
          return 'failing';
        }
        if (rt < slackingLimit) {
          return 'slacking';
        }
        if (rt < progressingLimit) {
          return 'progressing';
        }
        if (rt < achievingLimit) {
          return 'achieving';
        }
        if (rt < achievedLimit) {
          return 'achieved';
        }
        if( rt > exceedingLimit) {
          return 'exceeding';
        }
        return 'achieved';
      }
      return 'notstarted';
    }
  },
  mounted() {
  }
}
</script>

<style lang="scss" scoped>
@import './node_modules/bulma/bulma.sass';

/* progress and status colors - may move to a more central location later */
$status-notstarted: $danger;
$status-failing: #ff583b;
$status-slacking:#ff800f;
$status-progressing: #ffc107;
$status-achieving: #bfc22c;
$status-achieved: #8bc34a;
$status-exceeding: $turquoise;

.notstarted {
  background-color: $status-notstarted;
}
.failing {
  background-color: $status-failing;
}
.slacking {
  background-color: $status-slacking;
}
.progressing {
  background-color: $status-progressing;
}
.achieving {
  background-color: $status-achieving;
}
.achieved {
  background-color: $status-achieved;
}
.exceeding {
  background-color: $status-exceeding;
}

.task {
  margin: 0.8rem 0;
  border-radius: 0.3rem;
  background-color: $light;
}
/* =================== TASK HEADER =================== */
.task-header {
  display: flex;
  align-items: center;
  background-color: $light;
  border-radius: 0.3rem;
  padding: 1rem;
  @media screen and (max-width: 450px) {
    flex-wrap: wrap;
  }
}
.task-header-title {
  flex-grow: 2;
  font-size: 1.75rem;
  @media screen and (max-width: 450px) {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
    width: 100%;
    padding: 0.25rem;
  }
}
.task-header-ctrlbtn {
  font-size: 1.5rem;
  border-radius: 0.3rem;
  margin: 0.2rem;
  background-color: $white;
  &.deleter>a {
    color: $danger;
  }
  &>a {
    color: $grey;
    display: inline-block;
    padding:0.5rem;
  }
  &>a .icon {
    display: grid; /* force centered, square tiles */
    font-size: small;
  }
}
.ministatus {
  padding: 0.5rem;
  border-radius: 0.3rem;
  margin: 0.2rem;
  color: $white;
  &.notstarted { @extend .notstarted; }
  &.failing { @extend .failing; }
  &.slacking { @extend .slacking; }
  &.achieving { @extend .achieving; }
  &.achieved { @extend .achieved; }
  &.exceeding { @extend .exceeding; }
  @media screen and (max-width: 450px) {
    width: 100%;
  }
}
/* =================== TASK BODY =================== */
.task-body {
  margin: 0.5rem 0;
  padding: 0 0.5rem;
}
.task-meta-cells {
  display:flex;
  padding: 0.2rem;
  border-radius: 0.3rem;
  background-color: $light;
  @media screen and (max-width: 450px) {
    flex-direction: column;
    margin:0;
    border-radius: 0;
  }
}
.task-meta-cell, .task-value-cell {
  text-align: center;
  width: 100px;
  margin: 0.15rem;
  display: flex;
  flex-direction: column;
  border-radius: 0.3rem;
}
.task-value-cell {
  width: 200px;
  color: $white;
  span {
    padding: 0.5rem;
    &:first-child {
      background-color: $grey-dark;
      border-radius: 0.2rem 0.2rem 0 0;
    }
  }
  &.notstarted { @extend .notstarted; }
  &.failing { @extend .failing; }
  &.slacking { @extend .slacking; }
  &.achieving { @extend .achieving; }
  &.achieved { @extend .achieved; }
  &.exceeding { @extend .exceeding; }

  @media screen and (max-width: 450px) {
    flex-direction: row;
    width: 100%;
    margin:0;
    border-radius:0;
    & span {
      flex-basis: 0;
      flex-grow: 1;
    }
  }
}
.task-meta-cell {
  background-color: $white;
  &.small {
    min-width: 50px;
  }
  &.large {
    min-width: 150px;
    flex: 1 1 auto;
  }
  span {
    padding: 0.5rem;
    &:first-child {
      border-radius: 0.2rem 0.2rem 0 0;
      font-weight: bold;
    }
  }
  @media screen and (max-width: 450px) {
    flex-direction: row;
    width: 100%;
    margin:0;
    border-radius:0;
    & span {
      flex-basis: 0;
      flex-grow: 1;
      &:first-child {
        border-radius: 0;
      }
    }
  }
}
</style>
