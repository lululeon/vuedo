<template>
<div class="timer">
  <div class="timer-digits">
    <span class="timer-digits-hrs">{{ elapsedHours | zeroPad }}</span>
    <span class="timer-digits-sep">:</span>
    <span class="timer-digits-mins">{{ elapsedMinutes | zeroPad }}</span>
    <span class="timer-digits-sep">:</span>
    <span class="timer-digits-secs">{{ elapsedSeconds | zeroPad }}</span>
  </div>
  <!--  THE BUTTONS  -->
  <div class="timer-buttons buttons has-addons">
    <!--  START BUTTON    -->
    <button class="button is-dark is-small timer-btn timer-btn-start">
      <span class="icon">
        <font-awesome-icon :icon="['fas', 'play-circle']" />
      </span>
    </button>
    
    <!--   PAUSE BUTTON   -->
    <button class="button is-dark is-small timer-btn timer-btn-stop"> 
      <span class="icon">
        <font-awesome-icon :icon="['fas', 'pause-circle']" />
      </span>
    </button>
    
    <!--  RESET BUTTON   -->
    <button class="button is-dark is-small timer-btn timer-btn-reset">
      <span class="icon">
        <font-awesome-icon :icon="['fas', 'undo']" />
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
      elapsedHours: 0,
      elapsedMinutes: 0,
      elapsedSeconds: 0
    }
  },
  filters: {
    zeroPad(value) {
      if (!value || isNaN(value)) return '00';
      const stringval = value.toString();
      stringval.padStart(2, '0'); //width of 2 chars
      return stringval;
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
  background-color: hsl(0, 0%, 21%); 

  & > .timer-digits {
    .timer-digits-hrs,
    .timer-digits-mins,
    .timer-digits-secs {
      color: #9e9e9e;
    }
  }

  & > .timer-buttons {
    &.buttons {
      flex-wrap: nowrap;
    }
  }
}
</style>

