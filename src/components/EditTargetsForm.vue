<template>
  <div>
    <label class="label">Change how you measure progress:</label>
    <div class="field is-horizontal">
      <p class="control has-icons-right targetbox">
        <input class="input" type="text" v-model="target" />
        <span class="icon is-small is-right" v-if="linkedEdits">
          <font-awesome-icon :icon="['fas', 'link']" />
        </span>
      </p>
      <div class="select">
        <select v-model="uomid">
          <option v-for="uom in uomOptions" :key="uom.value" :value="uom.value">{{ uom.label }}</option>
        </select>
      </div>
      <div class="control has-icons-left">
        <div class="select">
          <select v-model="timeframe">
            <option v-for="tf in timeframeOptions" :key="tf.value" :value="tf.value">{{ tf.label }}</option>
          </select>
        </div>
        <span class="icon is-small is-left" v-if="linkedEdits">
          <font-awesome-icon :icon="['fas', 'link']" />
        </span>
      </div>
      <button class="button is-warning">
        <span class="icon is-small is-right" v-if="linkedEdits">
          <font-awesome-icon :icon="['fas', 'unlink']" />
        </span>
        <span>un-link</span>
      </button>
    </div>
    <small>Note: you can only change the metric to one of a similar type.</small><br/>
    <small v-if="uomid === 'none:count'">Dimensionless metrics like 'count' cannot be changed to anything else.</small>
  </div>
</template>

<script>
import { uomListAsSelectOptions } from '../data/uom';
import { timeframesListAsSelectOptions } from '../data/timeframes';
import { getStatus } from '../utils/status.js';

export default {
  name:'EditTargetsForm',
  props: {
    task: { type: Object, required: true },
    runningTotal: { type: Number }
  },
  data() {
    return {
      linkedEdits: true, //whether the timeframe and target will change in sync
      uomid: this.task.metric.uomId,
      timeframe: this.task.metric.timeframe,
      target: this.task.metric.measureTarget
    };
  },
  computed: {
    uomOptions() {
      //filter down to similar uoms only:
      const uomprefix = /(.+:)/.exec(this.uomid)[0];
      return uomListAsSelectOptions().filter((uom) => uom.value.startsWith(uomprefix));
    },
    timeframeOptions() {
      return timeframesListAsSelectOptions();
    },
    status() {
      return getStatus(this.runningTotal, this.target);
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../css/main.scss';
.targetbox {
  flex-basis: 20%;
  max-width: 20%;
}
.field.is-horizontal {
  width: 100%;
  & > * {
    margin: 0 0.25rem;
    &:first-child {
      margin-left: 0;
    }
    &:last-child {
      margin-right: 0;
    }
  }
}
.control.has-icons-right,
.control.has-icons-left {
  .icon {
    color: $warning;
  }
}
</style>
