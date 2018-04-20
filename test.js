
Vue.component('thing', { //hypenated names is best practice
  data() {
    return {
      value: true
    };
  },

  template: `
  <button @click="toggleValue">Toggle!</button>
  `,

  methods: {
    toggleValue() {
      this.value = !this.value;
      console.log(this.value);
    }
  }
});
