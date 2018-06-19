<template>
<div>
  <div class="field">
    <label class="label">What timeframe is appropriate for measuring your progress?</label>
<!--     <div class="select">
      <select v-model="newtask.metricTimeframe">
        <option v-for="(tf, idx) in timeframeOptions" :key="tf.value" :selected="idx === 1 ? 'selected' : ''" :value="tf.value">{{ tf.label }}</option>
      </select>
    </div> -->
  </div>
  <div class="field">
    <label class="label">How would you like to measure your activity?</label>
    <!--
    <div class="select">
      <select v-model="newtask.metricUomId">
        <option v-for="(uom, idx) in uomOptions" :key="uom.value" :selected="idx === 1 ? 'selected' : ''" :value="uom.value">{{ uom.label }}</option>
      </select>
    </div>
    -->
  </div>
</div>
</template>

<script>
// import uomList from '../data/uom';
// import timeframesList from '../data/timeframes';
// const defaultUOMId = 'none:count';
// const defaultTimeFrameCode = 'tf:daily';

export default {
  name:'EditTargetsForm'
}
</script>

<style lang="scss" scoped>

</style>
