<template>
  <input
    ref="inputbox"
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
    this.updateValue(this.value);
  },
  methods: {
    //based on: https://vuejs.org/v2/guide/migration.html#Two-Way-Filters-replaced
    //rem: the @input evt is what helps the parent component bind to this via v-model directive.
    updateValue(newvalue) {
      //on each keystroke, validate input and round if ness.
      if (isNaN(newvalue)) {
        this.$emit('input', 0); //default
      } else {
        this.$emit('input', toTwoDecimalPlaces(newvalue));
      }
    },
    formatValue() {
      this.$refs.inputbox.value = toTwoDecimalPlaces(this.value);
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