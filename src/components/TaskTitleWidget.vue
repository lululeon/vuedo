<template>
    <EditableText class="task-header-title" :content="tasktitle" @updated="save" />
    <!--
      :editing="editing" @clicked="makeEditable" 
      @cancelled="cancel" 
    <button v-if="!editing" class="button is-text edithint">
      <span class="icon"><font-awesome-icon :icon="['fas', 'pencil-alt']" /></span>
    </button>
    <button v-if="editing && valid" class="button is-text has-text-success" @click="save">
      <span class="icon"><font-awesome-icon :icon="['fas', 'check']" /></span>
    </button>
    <button v-if="editing && !valid" class="button is-text is-danger">
      <span class="icon"><font-awesome-icon :icon="['fas', 'ban']" /></span>
    </button>
    <button v-if="editing" class="button is-text" @click="cancel">
      <span class="icon"><font-awesome-icon :icon="['fas', 'ban']" /></span>
    </button>
    -->
</template>

<script>
import EditableText from './elements/EditableText';

export default {
  name: 'TaskTitleWidget',
  components: {
    EditableText
  },
  props: {
    'tasktitle': { type: String, required: true }
  },
  methods: {
    save(updatedDescription) {
      if(updatedDescription !== this.tasktitle ) {
        //update if changed
        this.$emit('description', updatedDescription);
      }
    }
  },
}
</script>


