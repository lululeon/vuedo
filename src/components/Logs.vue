<template>
  <div>
    <h1>Measurement Logs</h1>
    <ul>
      <li v-for="(exec,idx) in execLogs" :key="idx">
        <div class="log" :class="{'reached':exec.targetReached}">
          <p v-if="exec.note"><font-awesome-icon icon="quote-left"/>{{ exec.note }}<font-awesome-icon icon="quote-right"/></p>
          <pre><font color="red">{{ exec.taskId }}</font> {{ exec.timestamp }} <font color="blue">{{ exec.value }}</font> TargetReached: {{ exec.targetReached }}</pre>
        </div>
      </li>
    </ul>
    <h1>Sentiment Logs</h1>
    <ul>
      <li v-for="(sentiment,idx) in senLogs" :key="idx">
        <div class="log">
          <pre>{{ sentiment.taskId }} {{ sentiment.timestamp }} Value {{ sentiment.value }} TargetReached: {{ sentiment.targetReached }}</pre>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name:'Logs',
  data() {
    return {
      listEverything: true,
      execLogs: [],
      senLogs: []
    }
  },
  mounted() {
    if(this.$route.params.taskid) {
      this.execLogs = this.executionLog.filter((log) => {
        return log.taskId === this.$route.params.taskid;
      });
      this.senLogs = this.sentimentLog.filter((log) => {
        return log.taskId === this.$route.params.taskid;
      });
    } else {
      this.execLogs = [...this.executionLog];
      this.senLogs = [...this.sentimentLog];
    }
  },
  computed: {
    ...mapState(['executionLog','sentimentLog'])
  }
}
</script>

<style lang="scss" scoped>
li .log {
  margin: 0.5em;
  padding: 0.5em;
  border: 1px solid #ddd;
  p {
    font-size: 1.5em;
  }
  pre {
    background-color: #fff;
  }
  .reached {
    background-color: aquamarine;
  }
}
</style>
