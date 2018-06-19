<template>
  <div class="modal">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title"><slot name="title"/></p>
        <button class="delete" @click="$emit('close')" aria-label="close"></button>
      </header>
      <section class="modal-card-body">
        <slot name="content" />
      </section>
      <footer class="modal-card-foot level">
        <div class="level-right">
          <button class="button is-success">Save changes</button>
          <button class="button">Cancel</button>
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

