<template>
  <input
    v-bind:value="value"
    v-on:input="updateValue($event.target.value)"
    v-on:focus="selectAll"
    v-on:blur="formatValue" />
</template>

<script>
import { toTwoDecimalPlaces } from '../../utils/filters';

export default({
  name: 'max2dpInput',
  props: {
    value: {
      type: Number,
      default: 0
    }
  },
  mounted() {
    this.formatValue();
  },
  methods: {
    //based on: https://vuejs.org/v2/guide/migration.html#Two-Way-Filters-replaced
    updateValue(value) {
      //on each keystroke, validate input and round if ness.
      if (isNaN(value)) {
        this.$emit('input', 1); //safe fallback
      } else {
        this.$emit('input', toTwoDecimalPlaces(value));
      }
    },
    formatValue() {
      this.$refs.input.value = toTwoDecimalPlaces(this.value)
    },
    selectAll: function (event) {
      // Workaround for Safari bug
      // http://stackoverflow.com/questions/1269722/selecting-text-on-focus-using-jquery-not-working-in-safari-and-chrome
      setTimeout(function () {
        event.target.select()
      }, 0)
    }
  }
})
</script>