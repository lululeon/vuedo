<template>
  <div>
    <label class="label">Change your targets:</label>
    <div class="horizontalform">
      <p class="control has-icons-left targetbox">
        <!-- <input class="input" @focus="errTarget=false" :class="{'error': errTarget}" type="text" v-model="target" /> -->
        <max2dpInput class="input" @focus="errTarget=false" :class="{'error': errTarget}" type="text" v-model.lazy="target" /> 
        <span class="icon is-small is-left" v-if="linkedEdits">
          <font-awesome-icon :icon="['fas', 'link']" />
        </span>
      </p>
      <div class="control has-icons-left">
        <div class="select">
          <select v-model="uomid" @change="metricChanged">
            <option v-for="uom in uomOptions" :key="uom.value" :value="uom.value">{{ uom.label }}</option>
          </select>
          <span class="icon is-small is-left" v-if="linkedEdits">
            <font-awesome-icon :icon="['fas', 'link']" />
          </span>
        </div>
      </div>
      <div class="control has-icons-left">
        <div class="select">
          <select v-model="timeframe" @change="timeframeChanged">
            <option v-for="tf in timeframeOptions" :key="tf.value" :value="tf.value">{{ tf.label }}</option>
          </select>
        </div>
        <span class="icon is-small is-left" v-if="linkedEdits">
          <font-awesome-icon :icon="['fas', 'link']" />
        </span>
      </div>
      <button class="button is-warning" @click="toggleLinkage">
        <span class="icon is-small is-right" v-if="linkedEdits">
          <font-awesome-icon :icon="['fas', 'unlink']" />
        </span>
        <span v-if="linkedEdits">un-link</span>
        <span class="icon is-small is-right" v-if="!linkedEdits">
          <font-awesome-icon :icon="['fas', 'link']" />
        </span>
        <span v-if="!linkedEdits">link</span>
      </button>
    </div>
    <small>Note: you can only change the metric to one of a similar type.</small><br/>
    <small v-if="uomid === 'none:count'">Dimensionless metrics like 'count' cannot be changed to anything else.</small>
  </div>
</template>

<script>
import { uomList, uomListAsSelectOptions } from '../data/uom';
import { timeframesList, timeframesListAsSelectOptions } from '../data/timeframes';
import { getStatus } from '../utils/status';
//import { toTwoDecimalPlaces } from '../utils/filters';
import max2dpInput from './elements/MaxTwoDecimalPlacesInput';

export default {
  name:'EditTargetsForm',
  props: {
    task: { type: Object, required: true },
    runningTotal: { type: Number }
  },
  components: {
    max2dpInput
  },
  data() {
    return {
      linkedEdits: true, //whether the timeframe and target will change in sync
      uomid: this.task.metric.uomId,
      timeframe: this.task.metric.timeframe,
      target: this.task.metric.measureTarget,
      step: this.task.metric.stepSize,

      //for tracking changes
      prevTimeframe: this.task.metric.timeframe,
      prevUom: this.task.metric.uomId,
      prevTarget: this.task.metric.measureTarget,

      //for error highlighting
      errTarget:false
    };
  },
  methods: {
    toggleLinkage() {
      this.linkedEdits = !this.linkedEdits;
    },
    timeframeChanged() {
      if (this.linkedEdits) {
        // new target = previous target / [(previous timeframe multiplier) / (newly-chosen timeframe multiplier)]
        const tfOrig = timeframesList[this.prevTimeframe].tfmultiplier;
        const tfNew = timeframesList[this.timeframe].tfmultiplier;
        this.prevTimeframe = this.timeframe;
        this.prevTarget = this.target;
        this.target = this.target / (tfOrig/tfNew);
      }
    },
    metricChanged() {
      if (this.linkedEdits) {
        // new target = previous target / [(newly-chosen metric multiplier) / (previous metric multiplier)]
        const uomOrig = uomList[this.prevUom].uomMultiplier;
        const uomNew = uomList[this.uomid].uomMultiplier;
        this.prevUom = this.uomid;
        this.prevTarget = this.target;
        this.target = this.target / (uomNew/uomOrig);
        this.step = this.step / (uomNew/uomOrig);
      }
    },
    applyEdits() {
      //validate
      if (this.uomid.trim() === '') {
        this.errTarget = true;
        return;
      }
      //update task metrics
      const updTask = { 
        ...this.task, 
        metric: {
          uomId : this.uomid,
          timeframe : this.timeframe,
          measureTarget : this.target,
          stepSize: this.step,
        }
      };
      this.$store.commit('updatedTask', updTask);
      this.$eventHub.emit('modalcomplete');
    }
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
  },
  mounted() {
    //TODO: all eventHub-mediated signalling with modal should be extract to a mixin.
    this.$eventHub.on('modalconfirm', (channel) => {
      if (channel === 'task.targetsEdited') {
        this.applyEdits();
      }
    });
  }
}
</script>

<style lang="scss" scoped>
@import '../css/main.scss';
.targetbox {
  flex-basis: 20%;
  max-width: 20%;
  min-width: 90px;
}
.horizontalform {
  width: 100%;
  display: flex;
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
