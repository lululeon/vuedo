<template>
  <div>
    <h1>Measurement Logs</h1>
    <ul>
      <li v-for="(exec,idx) in execLogs" :key="idx">
        Task {{ exec.taskId }} {{ exec.timestamp }} Value {{ exec.value }} TargetReached: {{ exec.targetReached }}
      </li>
    </ul>
    <h1>Sentiment Logs</h1>
    <ul>
      <li v-for="(sentiment,idx) in senLogs" :key="idx">
        Task {{ sentiment.taskId }} {{ sentiment.timestamp }} Value {{ sentiment.value }} TargetReached: {{ sentiment.targetReached }}
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
