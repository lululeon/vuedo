<template>
    <div class="card taskform">
        <div class="card-content">
            <div class="field">
              <label class="label">What do you need to do?</label>
              <div class="control has-icons-left has-icons-right">
                  <input class="input" @focus="showNotifErrDescription=false" :class="{'is-danger' : showNotifErrDescription}" type="text" :placeholder="placeholder" v-model="newtask.description" />
                  <span class="icon is-small is-left">
                  <i class="fas fa-list-alt"></i>
                  </span>
                  <span class="icon is-small is-right" v-if="showNotifErrDescription">
                  <i class="fas fa-exclamation-triangle"></i>
                  </span>
              </div>  
              <p class="help is-success" v-if="showNotifOKDescription">Great!</p>
              <p class="help is-danger" v-if="showNotifErrDescription">Do not leave blank - please enter a task description</p>
            </div>
            <div class="field">
              <label class="label">How would you like to measure your activity?</label>
              <div class="select">
                <select v-model="newtask.metric.uomId">
                  <option v-for="uom in uomOptions" :key="uom.value" :value="uom.value">{{ uom.label }}</option>
                </select>
              </div>
            </div>
            <div class="field">
              <label class="label">What timeframe is appropriate for measuring your progress?</label>
              <div class="select">
                <select v-model="newtask.metric.timeframe">
                  <option v-for="tf in timeframes" :key="tf" :value="tf">{{ tf }}</option>
                </select>
              </div>
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
      showNotifOKDescription: false,
      showNotifErrDescription: false
    }
  },
  watch: {
    nextId: function (newNextId) { // f(new,old){...}
      this.setBlankTask(newNextId);
    }
  },
  methods: {
    saveTask() {
      if(this.newtask.description === '' || this.newtask.description === this.placeholder) {
        this.showNotifErrDescription = true;
        return;
      }
      this.$emit('saveNewTask', this.newtask);
      this.clearInputPanel();
    },
    clearInputPanel() {
      this.showNotifOKDescription = false;
      this.showNotifErrDescription = false;
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
        metric: { uomId: 'none:count', timeframe: 'daily' },
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
