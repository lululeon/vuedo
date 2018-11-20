<template>
  <div>
    <article class="notification tile is-child" v-if="showEmptyListNotif">
      <p class="title">Get going!</p>
      <p class="subtitle">You don't seem to have anything to do!! Let's change that:</p>
      <div class="level">
        <div class="level-left">
          <button class="button level-item is-info" @click="addTask">
            <span class="icon">
              <font-awesome-icon :icon="['fas', 'plus']" />
            </span>
            <span>Add a task!</span>
          </button>
          <button class="button level-item" @click="loadTasks">
            <span class="icon">
              <font-awesome-icon :icon="['fas', 'file']" />
            </span>
            <span>Upload tasks from a file</span>
          </button>
        </div>
      </div>
    </article>
    <div class="iconbar" v-if="!showEmptyListNotif && showActionIcons">
      <button class="button is-small is-info" @click="addTask">
        <span class="icon">
          <font-awesome-icon :icon="['fas', 'plus']" />
        </span>
      </button>
      <button class="button is-small is-info" @click="loadTasks">
        <span class="icon">
          <font-awesome-icon :icon="['fas', 'file']" />
        </span>
      </button>
      <a id="downloadlink" download="vuedo.json" :href="downloadDataset">
        <button class="button is-small is-info">
          <span class="icon">
            <font-awesome-icon :icon="['fas', 'download']" />
          </span>
        </button>
      </a>
    </div>
    <transition-group name="taskpop" tag="div" class="tasklist">
      <Task v-for="task in tasks" 
        :key="task.id" 
        :task="task"
        :currentTimeframe="currentTimeframes[task.metric.timeframe]"
        @editTargets="BeginEditTargets(task)"
        @deleteTask="BeginDeleteTask(task)"/>
    </transition-group>
    <TaskModal :modal-type="modalType" :task="modalTask" @close="closePopup" :showModal="showModal"/>
  </div>
</template>

<script>
import moment from 'moment';
import jsonbeautify from 'json-beautify';
import { mapState } from 'vuex';
import Task from './Task.vue';
import { timeframesList } from '../data/timeframes';
import TaskModal from './TaskModal';

export default {
  name: 'TaskList',
  components: {
    Task,
    TaskModal
  },
  data() {
    //in components, you must RETURN the data object
    return {
      showModal: false,
      modalType: '',
      modalTask: {}, //the task for which the modal dialog is opened
      currentTimeframes: {}
    }
  },
  mounted() {
  },
  methods: {
    addTask() {
      this.$router.push('tasks/add');
    },
    loadTasks() {
      this.$router.push('tasks/dataport');
    },
    deleteTask(taskId) {
      this.$store.commit('deleteTask', taskId);
    },
    updateTimeframes() {
      const dayStart = moment().startOf('day');
      const dayEnd = moment().endOf('day');
      const weekStart = moment().startOf('isoWeek'); //ISO standard first weekday is Monday
      const weekEnd = moment().endOf('isoWeek');
      const monthStart = moment().startOf('month');
      const monthEnd = moment().endOf('month');
      const timeframes = timeframesList;
      timeframes['tf:daily'].start = dayStart;
      timeframes['tf:daily'].end = dayEnd;
      timeframes['tf:weekly'].start = weekStart;
      timeframes['tf:weekly'].end = weekEnd;
      timeframes['tf:monthly'].start = monthStart;
      timeframes['tf:monthly'].end = monthEnd;
      this.currentTimeframes = timeframes;     
    },
    //========================= Task Modal interactions ======================
    BeginDeleteTask(modalTask) {
      this.modalTask = modalTask;
      this.modalType = 'deleteTask',
      this.openPopup();
    },
    BeginEditTargets(modalTask) {
      this.modalTask = modalTask;
      this.modalType = 'editTargets',
      this.openPopup();
    },
    openPopup() {
      this.showModal = true;
    },
    closePopup(){
      this.showModal = false;
    },
  },
  created() {
    this.updateTimeframes();
  },
  computed: {
    ...mapState(['username','tasks','goals','executionLog','sentimentLog']),
    showActionIcons() {
      //show only when there are no tasks AND user is not in the middle of adding or uploading tasks.
      const path = this.$route.path;
      if ((path !== '/tasks/add') && (path !== '/tasks/dataport')) {
        return true;
      } else {
        return false;
      }
    },
    showEmptyListNotif(){
      return (this.showActionIcons && this.tasks.length < 1);
    },
    downloadDataset() {
      if(!this.tasks) return '';

      const dataset = {
        username: this.username,
        tasks: this.tasks,
        goals: this.goals,
        executionLog: this.executionLog,
        sentimentLog: this.sentimentLog
      };

      // let jsonstr = JSON.stringify(dataset).split(',').join(',\r\n');
      const jsonstr = jsonbeautify(dataset, null, 2, 100);
      const responseBuffer = "data:text/json;charset=utf-8," + encodeURIComponent(jsonstr);
      return responseBuffer;
    }
  }
}
</script>

<style lang="scss" scoped>
/* >>> bulma overrides */
.title {
  font-size: 1.2rem;
}
.subtitle {
  font-size: 1.1rem;
}
/* <<< end bulma override */
.iconbar {
  display: flex;
  flex-wrap: nowrap;
  .button:not(:last-child) {
    margin-right: 0.25em;
  }
}
.tasklist {
  display: flex;
  flex-direction: column-reverse;
}
.taskpop-enter-active {
  animation: pop 0.25s;
}
.taskpop-leave-active {
  animation: popreverse 0.5s; /* reverse; IE10 wld not anim correctly*/
}
@keyframes pop {
  0% {
    transform: scale(0.9) translateY(-5%);
  }
  90% {
    transform: scale(1.02);    
  }
  100% {
    transform: scale(1) translateY(0%);
  }
}
@keyframes popreverse {
  0% {
    transform: scale(1);
  }
  10% {
    transform: scale(1.02);
    opacity: 0.5;   
  }
  100% {
    transform: scale(0.7);
    opacity: 0;
  }
}
</style>