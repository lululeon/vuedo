<template>
    <div class="card">
        <div class="card-header">
            <div class="card-header-title title has-background-warning">Add a new task</div>
        </div>
        <div class="card-content">
            <form>
                <div class="field">
                <label class="label">What do you need to do?</label>
                <div class="control has-icons-left has-icons-right">
                    <input class="input" :class="{'is-danger' : showNotifErrDescription}" type="text" :placeholder="placeholder" v-model="newtask.description" />
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
                <div class="control">
                    <label class="checkbox">
                    <input type="checkbox">
                    This is a timed task.
                    </label>
                </div>
                </div>
            </form>
        </div>
        <div class="card-content level-right">
            <button class="level-item button" @click="$emit('hideInputForm')">
                <span class="icon">
                <i class="fas fa-ban"></i>
                </span>
                Cancel task addition
            </button>
            <button class="level-item button has-background-info" @click="saveTask">
                <span class="icon">
                <i class="fas fa-save"></i>
                </span>
                Save
            </button>
        </div>
    </div>
</template>

<script>
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
      newtask: {},
      showNotifOKDescription: false,
      showNotifErrDescription: false
    }
  },
  watch: {
    nextId: function (newNextId, oldNextId) {
      this.setBlankTask(newNextId);
    }
  },
  methods: {
    saveTask() {
      if(this.newtask.description === '' || this.newtask.description === this.placeholder) {
        this.showNotifErrDescription = true;
        return;
      }
      //this.nextId += 1;
      //this.tasks.push(this.newtask);
      this.$emit('saveNewTask', this.newtask);
      this.clearInputPanel();
    },
    clearInputPanel() {
      //this.setBlankTask();
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
        timed: false,
        count: 0,
        targetReached: false
      };
    },
    hide() {
        this.prop.onHideForm();
    }
  },
  mounted() {
    this.setBlankTask();
  },
}
</script>

<style>

</style>
