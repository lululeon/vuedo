<template>
  <article class="task">
    <header class="task-header">
      <EditableText class="task-header-title" :content="tasktitle" @updated="onUpdateDescription" />
      <div class="header-group">
        <transition name="latepop" tag="span">
          <span  class="task-status" :class="status" v-if="!expanded">{{ runningTotal }} {{ metric }} {{ thisTimeframeText }} </span>
        </transition>
        <Timer v-if="isTimeable" @logtime="logElapsedTime"/>
      </div>
      <div class="header-group">
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
          <a @click="$emit('deleteTask')" aria-label="delete">
            <span class="icon"><font-awesome-icon :icon="['fas', 'trash-alt']" /></span>
          </a>
        </div>
      </div>
    </header>
    <transition name="slide-down">
      <div class="task-body" v-if="expanded">
        <div class="task-meta-cells">
          <div class="task-meta-cell small">
            <span>id</span>
            <span><router-link :to="measuresUrl">{{ task.id | truncateUUID }}</router-link></span>
          </div>
          <div class="task-meta-cell large">
            <span>target</span>
            <span @click="$emit('editTargets')">
              {{ task.metric.measureTarget | toTwoDecimalPlaces }} {{ metric }} {{ timeframe }}
              <a class="icon"><font-awesome-icon :icon="['fas', 'pencil-alt']" /></a>
            </span>
          </div>
          <div class="task-meta-cell large"><span>step size</span><span>{{ task.metric.stepSize | toTwoDecimalPlaces }} {{ stepSizeMetricLabel }}</span></div>
          <div class="task-value-cell" :class="status" >
            <span>running total</span>
            <span>{{ runningTotal | toTwoDecimalPlaces }} {{ metric }} {{ thisTimeframeText }} </span>
          </div>
        </div>
      </div>
    </transition>
  </article>
</template>

<script>
import mathjs from 'mathjs';
import moment from 'moment';
import { uomList, isTimeMetric } from '../data/uom';
import { getStatus } from '../utils/status.js';
import { toTwoDecimalPlaces } from '../utils/filters';
import EditableText from './elements/EditableText';
import Timer from './Timer';


export default {
  name: 'Task',
  components: {
    EditableText,
    Timer
  },
  props: {
    task: {
      type: Object,
      required: true
    },
    currentTimeframe: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      expanded: false
    };
  },

  filters: {
    toTwoDecimalPlaces,
    truncateUUID(uuidstr) {
      return uuidstr.substr(0, uuidstr.indexOf('-'));
    }
  },

  methods: {
    // ============================== CRUD methods =========================
    onUpdateDescription(updDescr) {
      if(updDescr !== this.tasktitle ) {
        //update if changed
        const updTask = this.task;
        updTask.description = updDescr;
        this.$store.commit('updateTask', updTask);
      }
    },
    //task tracking / atomic modifiers
    increment() {
      const taskId = this.task.id;
      const timestamp = moment().format();
      const value = this.task.metric.stepSize * uomList[this.task.metric.uomId].uomMultiplier; //stepSize x metric.uomMultiplier
      //const targetReached = (value >= this.task.measureTarget) ? true : false;
      const targetReached = (value >= this.task.metric.measureTarget) ? true : false;
      const logItem = { taskId, timestamp, value, targetReached };
      this.$store.commit('newExecutionLog', logItem);
    },
    decrement() {
      if(this.runningTotal === 0) {
        return;
      }
      this.$store.commit('undoExecutionLogByTaskId', this.task.id);
    },
    logElapsedTime(elapsedTime) {
      const taskId = this.task.id;
      const timestamp = moment().format();
      //standard uom for time-based metrics is hour, so:
      let { elapsedHours, elapsedMinutes, elapsedSeconds } = elapsedTime;
      const totalHours = elapsedHours + (elapsedMinutes/60) + (elapsedSeconds/3600);
      const targetHours = this.task.metric.measureTarget * uomList[this.task.metric.uomId].uomMultiplier; //amt x metric.uomMultiplier
      const targetReached = (totalHours >= targetHours) ? true : false;
      const logItem = { taskId, timestamp, value:totalHours, targetReached };
      this.$store.commit('newExecutionLog', logItem);
    },

    // ===================== UI / UX minor interactions  ====================
    expand() {
      this.expanded = true;
    },
    collapse() {
      this.expanded = false;
    },

    // ======================== Miscellaneous utils ========================
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
    measuresUrl(){
      return `/logs/${this.task.id}`;
    },
    filteredLogs() { //executionLog for THIS task only, filtered down to current timeframe
      if(!this.$store.state.executionLog) return [];
      return this.$store.state.executionLog.filter(execItem => {
        const filtCriterion1 = (execItem.taskId === this.task.id);
        const filtCriterion2 = moment(execItem.timestamp).isAfter(this.currentTimeframe.start);
        return filtCriterion1 && filtCriterion2;
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
    status() {
      const rt = this.runningTotal; //display units, not raw units.
      const target = this.task.metric.measureTarget; //display units, not raw units.
      return getStatus(rt,target);
    },
    isTimeable() {
      return isTimeMetric(this.task.metric.uomId);
    }
  },
  mounted() {
  }
}
</script>

<style lang="scss" scoped>
@import '../css/main.scss';
.task {
  margin: 0.8rem 0;
  border-radius: 0.3rem;
  background-color: $light;
}
/* =================== TASK HEADER =================== */
.task-header {
  display: flex;
  flex-wrap:wrap;
  align-items: center;
  background-color: $light;
  border-radius: 0.3rem;
  padding: 1rem;

  & > .header-group {
    display: flex;
    flex-wrap:wrap;

    .task-status {
      @extend .task-status;
      padding: 0.5rem;
      border-radius: 0.3rem;
      margin: 0.2rem;
      color: $white;
      opacity: 1;
    }

    @media screen and (max-width: 450px) {
      .timer, .task-status {
        width: 100%;
      }
    }
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

/* =================== TASK BODY =================== */
/* animations */
.latepop-enter-active {
  animation: latepop 1s;
}
.latepop-leave-active {
  animation: latepop 0.4s reverse;
}
@keyframes latepop {
  0% { opacity: 0; }
  30% { opacity: 0; }
  100% { opacity: 1; }
}
.slide-down-enter-active {
  animation: slide 0.4s;
}
.slide-down-leave-active {
  animation: slide 0.5s reverse;
}
@keyframes slide {
  0% {
    transform: translateY(-20%);
  }
  60% {
    transform: translateY(0%);
  }
  100% {
    transform: translateY(0%);
  }
}
/* end animations */
.task-body {
  margin-bottom: 0.5rem;
  padding: 0 0.5rem;
}
.task-meta-cells {
  display:flex;
  padding: 0.2rem;
  border-radius: 0.3rem;
  background-color: $light;
  @media screen and (max-width: 750px) {
    flex-direction: column-reverse; /*put timer and status at top*/
    margin:0;
    border-radius: 0;
  }
  /*
  @media screen and (max-width: 460px) {
    .timer {
      font-size: 1rem;
    }
  }
  @media screen and (max-width: 420px) {
    .timer {
      flex-direction: column;
      padding: 0.15em;
    }
  }
  */
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
  min-width: 150px;
  flex: 0 1 auto;
  color: $white;
  span {
    padding: 0.5rem;
    &:first-child {
      background-color: $grey-dark;
      border-radius: 0.2rem 0.2rem 0 0;
    }
  }
  &.not-started { @extend .not-started; }
  &.failing { @extend .failing; }
  &.slacking { @extend .slacking; }
  &.achieving { @extend .achieving; }
  &.achieved { @extend .achieved; }
  &.exceeding { @extend .exceeding; }

  @media screen and (max-width: 750px) {
    flex-direction: row;
    width: 100%;
    margin:0;
    border-radius:0;
    & span {
      &:first-child {
        border-radius:0;
      }
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
    flex: 1 2 auto; /* shrink more rapidly */
  }
  span {
    padding: 0.5rem;
    &>a.icon {
      opacity: 0;
      color: $grey-light;
    }
    &:hover {
      cursor: pointer;
      &>a.icon {
        opacity: 0.8;
      }
    }
    &:first-child {
      border-radius: 0.2rem 0.2rem 0 0;
      font-weight: bold;
    }
  }
  @media screen and (max-width: 750px) {
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
