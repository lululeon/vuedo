<template>
  <div>
    <span class="targettext" spellcheck="false" @click="trackEdits" contenteditable="true" @input="handleInput" @blur="cancel">
    </span>
    <button v-if="!editing" class="button is-text edithint">
      <span class="icon"><font-awesome-icon :icon="['fas', 'pencil-alt']" /></span>
    </button>
    <button v-if="editing && valid" class="button is-text has-text-success" @mousedown="save">
      <span class="icon"><font-awesome-icon :icon="['fas', 'check']" /></span>
    </button>
  </div>
</template>

<script>
export default {
  name:'EditableText',
  props: {
    'content': { type: String }, //not gonna bind to the editable text, cos contenteditable has issues with moving cursor to end of textfield.
  },
  data() {
    return ({
      updatedText: this.content,
      editing: false,
      valid: true
    })
  },
  watch: {
    content: function (newContent) { // f(new,old){...}
      this.setContent(newContent);
    }
  },
  mounted() {
    // workaround: use direct setting of dom element to circumvent browser cursor placement issues that occur with regular binding.
    this.setContent(this.content);
  },
  methods: {
    setContent(theContent) {
      this.$el.children[0].innerText = theContent;
    },
    trackEdits(evt) {
      //MDN: If you call HTMLElement.focus() from a mousedown event handler,
      // you must call event.preventDefault() to keep the focus from leaving the HTMLElement.
      evt.preventDefault();
      this.editing = true;
      this.$el.children[0].focus();
    },
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
      //user moved away without explicitly saving: revert edits
      this.editing = false;
      this.$el.children[0].innerText = this.content;
      this.$emit('cancelled');
    },
    save() {
      // note: used mousedown to get here instead of click:
      // blur interferes with click evts as the latter happens only after the mouse is released; by then blur has stolen the evt :-)
      this.editing = false;
      this.$emit('updated', this.updatedText);
    }
  }
}
</script>


<style scoped>
button {
  display: initial;
  margin-left: 0.5rem;
}
button.edithint {
  opacity: 0;
}
span:hover {
  cursor: pointer;
}
span[contenteditable=true]:focus {
  color: #209cee;
  cursor: initial;
  outline: none;
}
span:hover + button.edithint {
  opacity: 0.5;
}
</style>