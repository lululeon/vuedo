<template>
  <modal :class="{'is-active': showModal}" @close="$emit('close')" :task-id="task.id" :channel="modalChannel">
    <template slot="title">{{ task.description }}</template>
    <template slot="content-raw">{{ modalContentRaw }}</template>
    <template :is="modalContentComponent" :task=task slot="content-component"/>
  </modal>
</template>

<script>
import Modal from './Modal';
import EditTargetsForm from './EditTargetsForm';

export default {
  name: 'TaskModal',
  components: {
    Modal,
    EditTargetsForm
  },
  props: {
    task: {
      type: Object,
      required: true
    },
    modalType: {
      type: String,
      required: true
    },
    showModal: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      modalChannel: '',
      modalContentComponent: '',
      modalContentRaw: '',
      modalActionLabel: 'OK'
    }
  },
  mounted() {
    //TODO: all eventHub-mediated signalling with modal should be extract to a mixin.
    //directly handle non-component based modal interactions:
    this.$eventHub.on('modalconfirm', (channel, taskId) => {
      if (channel === 'task.deleted' && taskId === this.task.id) {
        this.$store.commit('deleteTask', taskId);
        this.$eventHub.emit('modalcomplete');
      }
    });
  },
  watch: {
    showModal: function (nextShow) { // f(new,old){...}
      if(nextShow) {
        if (this.modalType === 'editTargets') {
          this.modalChannel = 'task.targetsEdited',
          this.modalContentComponent = 'EditTargetsForm';
          this.modalContentRaw = '';
          this.modalActionLabel = 'Save Edits';
        } else if (this.modalType === 'deleteTask') {
          this.modalChannel = 'task.deleted',
          this.modalContentComponent = '',
          this.modalContentRaw = `Are you sure you want to delete this task including all of the logged measures for this task?`;
          this.modalActionLabel = "Confirm";
        }
      } else {
        this.closePopup();
      }
    }
  },
  methods: {
    closePopup(){
      this.modalChannel = '',
      this.modalContentComponent = '';
      this.modalActionLabel = 'OK';
    },
  }
}
</script>

