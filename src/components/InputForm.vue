<template>
    <div class="card taskform">
        <div class="card-content">
            <div class="field">
              <label class="label">What do you need to do?</label>
              <div class="control has-icons-left has-icons-right">
                  <input class="input" @focus="showDescriptionErr=false" :class="{'is-danger' : showDescriptionErr}" type="text" :placeholder="placeholder" v-model="newtask.description" />
                  <span class="icon is-small is-left">
                  <i class="fas fa-list-alt"></i>
                  </span>
                  <span class="icon is-small is-right" v-if="showDescriptionErr">
                  <i class="fas fa-exclamation-triangle"></i>
                  </span>
              </div>  
              <p class="help is-danger" v-if="showDescriptionErr">Do not leave blank - please enter a task description</p>
            </div>
            <div class="field">
              <label class="label">What timeframe is appropriate for measuring your progress?</label>
              <div class="select">
                <select v-model="newtask.metricTimeframe">
                  <option v-for="tf in timeframes" :key="tf" :value="tf">{{ tf }}</option>
                </select>
              </div>
            </div>
            <div class="field">
              <label class="label">How would you like to measure your activity?</label>
              <div class="select">
                <select v-model="newtask.metricUomId">
                  <option v-for="uom in uomOptions" :key="uom.value" :value="uom.value">{{ uom.label }}</option>
                </select>
              </div>
            </div>
            <div class="field">
              <label class="label">Set a goal: What's your ideal target? </label>
              <div class="control has-icons-right">
                  <input class="input" @focus="showMeasureTargetErr=false" :class="{'is-danger' : showMeasureTargetErr}" type="text" v-model="newtask.metricMeasureTarget" />
                  <span class="icon is-small is-right" v-if="showMeasureTargetErr">
                  <i class="fas fa-exclamation-triangle"></i>
                  </span>
              </div>  
              <p class="help is-danger" v-if="showMeasureTargetErr">Do not leave blank - Please enter a target value</p>
            </div>
        </div>
        <div class="card-content level-right">
            <button class="level-item button" @click="$emit('hideInputForm')">
                <span class="icon">
                <i class="fas fa-ban"></i>
                </span>
                <span>Cancel task addition</span>
            </button>
            <button class="level-item button has-background-info" @click="saveTask">
                <span class="icon">
                <i class="fas fa-save"></i>
                </span>
                <span>Save</span>
            </button>
        </div>
    </div>
</template>

<script>
import uomList from '../data/uom';

export default {
  name: 'InputForm',
  components: {
  },
  props: {
    nextId: {
      type: Number
    }
  },
  data() {
    return {
      placeholder: "example: practice piano",
      timeframes: ['daily','weekly','monthly'],
      newtask: {},
      showMeasureTargetErr: false,
      showDescriptionErr: false
    }
  },
  watch: {
    nextId: function (newNextId) { // f(new,old){...}
      this.setBlankTask(newNextId);
    }
  },
  methods: {
    saveTask() {
      if(this.newtask.description.trim() === '' || this.newtask.description === this.placeholder) {
        this.showDescriptionErr = true;
        return;
      }
      const target = parseFloat(this.newtask.metricMeasureTarget);
      if(isNaN(target)) {
        this.showMeasureTargetErr = true;
        return;
      }
      this.$emit('saveNewTask', { 
        id: this.newtask.id,
        description: this.newtask.description,
        count: this.newtask.count,
        metric: {
          timeframe: this.newtask.metricTimeframe,
          uomId: this.newtask.metricUomId,
          measureTarget: target
        }
      });
      this.clearInputPanel();
    },
    clearInputPanel() {
      this.showDescriptionErr = false;
      this.showMeasureTargetErr = false;
    },
    deleteTask(taskId) {
      let idx = this.tasks.findIndex((task)=>{
        return (task.id == taskId);
      });
      this.tasks.splice(idx, 1);
    },
    setBlankTask(newNextId) {
      this.newtask = {
        id: newNextId || this.nextId, //first time, get from props; thereafter from watched prop changes.
        description: '',
        //nested objs don't work well with vue 2way binding
        //metric: { uomId: 'none:count', timeframe: 'daily', measureTarget: 1 },
        metricTimeframe: 'daily',
        metricUomId: 'none:count',
        metricMeasureTarget: 1,
        count: 0,
        targetReached: false
      };
    },
    hide() {
        this.prop.onHideForm();
    }
  },
  computed: {
    uomOptions() {
      const options = [];
      Object.keys(uomList).forEach((k) => {
        options.push({ value:k, label:uomList[k].uomLabel });
      });
      return options;
    }
  },
  mounted() {
    this.setBlankTask();
  }
}
</script>

<style scoped>
.taskform {
    background-color: #fcdd57;
}
</style>
