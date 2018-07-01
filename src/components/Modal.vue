<template>
  <div class="modal">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <span class="modal-card-title"><slot name="title"/></span>
        <button class="delete is-medium" @click="$emit('close')" aria-label="close"></button>
      </header>
      <section class="modal-card-body">
        <slot name="content" />
      </section>
      <footer class="modal-card-foot level">
        <div class="level-right">
          <button class="button is-primary">Save changes</button>
          <button class="button" @click="$emit('close')">Cancel</button>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name:'Modal',
  props: {
    'title': { type: String }
  }
}
</script>

<style lang="scss" scoped>
@import '../../node_modules/bulma/bulma.sass';
.modal-card-title {
  white-space: nowrap; 
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  width: 65%;
}
.modal-card-head > button.delete {
  background-color: $danger;
}
</style>


