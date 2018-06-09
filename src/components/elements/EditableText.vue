<template>
  <div>
    <span spellcheck="false" @click="editable = true" :contenteditable="editable" @input="handleInput" @blur="cancel">
    </span>
    <button v-if="!editable" class="button is-text edithint">
      <span class="icon"><font-awesome-icon :icon="['fas', 'pencil-alt']" /></span>
    </button>
    <button v-if="editable && valid" class="button is-text has-text-success" @mousedown="save">
      <span class="icon"><font-awesome-icon :icon="['fas', 'check']" /></span>
    </button>
    <button v-if="editable" class="button is-text" @click="cancel">
      <span class="icon"><font-awesome-icon :icon="['fas', 'ban']" /></span>
    </button>
  </div>
</template>

<script>
export default {
  name:'EditableText',
  props: {
    'content': { type: String }, //not gonna bind to the editable text, cos contenteditable has issues with moving to end of textfield.
  },
  data() {
    return ({
      editable: false,
      updatedText: this.content,
      valid: true
    })
  },
  mounted() {
    // workaround: use direct setting of dom element to circumvent browser cursor placement issues that occur with regular binding.
    this.$el.children[0].innerText = this.content;
  },
  methods: {
    handleInput(event) {
      const currentText = event.target.innerText;
      if (currentText.trim() === '') {
        this.updatedText = this.content; //discard edits, just in case
        this.valid = false;
      } else {
        this.updatedText = currentText;
        this.valid = true;
      }
      this.$emit('changed', currentText); //for any interested subscribers
    },
    cancel() {
      if (this.editable) {
        //user moved away without explicitly saving: revert edits
        this.editable = false;
        this.$el.children[0].innerText = this.content;
        this.$emit('cancelled');
      }
    },
    save() {
      // note: used mousedown to get here instead of click:
      // blur interferes with click evts as the latter happens only after the mouse is released; by then blur has stolen the evt :-)
      this.editable = false;
      this.$emit('updated', this.updatedText);
    }
  }
}
</script>


<style scoped>
button.edithint {
  display: initial;
  opacity: 0;
}
span:hover {
  cursor: pointer;
}
span[contenteditable=true] {
  color: #209cee;
  padding: 0 0.5rem;
  cursor: initial;
}
span:hover + button {
  opacity: 0.5;
}
</style>