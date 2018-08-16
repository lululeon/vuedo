<template>
<div class="timer">
  <div class="timer-digits">
    <span class="timer-digits-hrs" :class="{'active': elapsedHours > 0}" >{{ elapsedHours | zeroPad }}</span>
    <span class="timer-digits-sep">:</span>
    <span class="timer-digits-mins" :class="{'active': elapsedMinutes > 0}">{{ elapsedMinutes | zeroPad }}</span>
    <span class="timer-digits-sep">:</span>
    <span class="timer-digits-secs" :class="{'active': elapsedSeconds > 0}">{{ elapsedSeconds | zeroPad }}</span>
  </div>
  <!--  THE BUTTONS  -->
  <div class="timer-buttons buttons has-addons">
    <!--  START / PAUSE TOGGLE    -->
    <button class="button  is-dark is-small timer-btn timer-btn-start" v-if="paused" @click="startTimer">
      <span class="icon">
        <font-awesome-icon :icon="['fas', 'play-circle']" />
      </span>
    </button>   
    <button class="button  is-dark is-small timer-btn timer-btn-stop" v-else @click="pauseTimer"> 
      <span class="icon">
        <font-awesome-icon :icon="['fas', 'pause-circle']" />
      </span>
    </button>
    
    <!--  RESET BUTTON   -->
    <button class="button  is-dark is-small timer-btn timer-btn-reset" @click="resetTimer">
      <span class="icon">
        <font-awesome-icon :icon="['fas', 'undo']" />
      </span>
    </button>

    <!--  SAVE BUTTON   -->
    <button class="button  is-dark is-small timer-btn timer-btn-save" @click="saveElapsedTime">
      <span class="icon">
        <font-awesome-icon :icon="['fas', 'check-circle']" />
      </span>
    </button>

  </div>
  </div>
</template>


<script>
export default {
  name: 'Timer',
  data() {
    return {
      timerRef: undefined,
      paused: true, //if paused, we want to show the start (play) icon
      ticks: 0,      
      elapsedHours: 0,
      elapsedMinutes: 0,
      elapsedSeconds: 0
    }
  },
  filters: {
    zeroPad(value) {
      if (!value || isNaN(value)) return '00';
      let stringval = value.toString();
      stringval = stringval.padStart(2, '0'); //width of 2 chars
      //console.log(stringval); //eslint-disable-line
      return stringval;
    }
  },
  methods: {
    startTimer() {
      if(!this.timerRef) {
        this.timerRef = setInterval(() => this.tick(), 1000);
      }
      this.paused = false;
    },
    pauseTimer() {
      this.paused = true;
    },
    resetTimer() {
      this.ticks = 0;
      if (this.paused) {
        //if timer was paused and THEN reset triggered, user likely wants to restart everything.
        this.clearTimer();
      }
    },
    saveElapsedTime() {
      if(this.ticks > 0) {//log time only if there's logged time
        this.$emit('logtime', {
          elapsedHours: this.elapsedHours,
          elapsedMinutes: this.elapsedMinutes,
          elapsedSeconds: this.elapsedSeconds
        });
      }
      this.clearTimer();
    },
    clearTimer() {
      if (this.timerRef) {
        this.timerRef = clearInterval(this.timerRef); //returns undefined
      }
      this.ticks = 0;
      this.elapsedHours = 0;
      this.elapsedMinutes = 0;
      this.elapsedSeconds = 0;
      this.paused = true;
    },
    tick() {
      if (this.paused) return;
      this.ticks += 1;
      this.elapsedHours = Math.trunc(this.ticks / 3600);
      let remainder = this.ticks % 3600;
      this.elapsedMinutes = Math.trunc(remainder / 60);
      this.elapsedSeconds = remainder % 60;
    }
  }
}
</script>

<style lang="scss">
.timer {
  display: flex;
  align-content: center;
  padding: 0.085em 0.08em 0.085em 0.3em;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;


  /* from task-header-ctrlbtn */
  font-size: 1.5rem;
  border-radius: 0.3rem;
  margin: 0.2rem;
  background-color: #363636;

  & > .timer-digits {
    .timer-digits-hrs,
    .timer-digits-mins,
    .timer-digits-secs {
      color: #666;
    }
    .active {
      color: #fff;
    }
  }

  & > .timer-buttons {
    &.buttons {
      flex-wrap: nowrap;
      button:hover {
        color: #209ced;
      }
    }
  }
}
</style>

