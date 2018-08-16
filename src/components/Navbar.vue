<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <router-link to="/">
        <h1 class="navbar-item logotext">Vue<span class="has-text-info">do</span></h1>
      </router-link>
      <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div class="navbar-menu">
      <div class="navbar-start">
        <span class="navbar-item curdate">{{ currentDay }}</span>
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link" href="/documentation/overview/start/">
            Docs
          </a>
          <div class="navbar-dropdown is-boxed">
            <a class="navbar-item" href="/documentation/overview/start/">
              Overview
            </a>
            <a class="navbar-item" href="https://bulma.io/documentation/modifiers/syntax/">
              Modifiers
            </a>
            <a class="navbar-item" href="https://bulma.io/documentation/columns/basics/">
              Columns
            </a>
            <a class="navbar-item" href="https://bulma.io/documentation/layout/container/">
              Layout
            </a>
            <a class="navbar-item" href="https://bulma.io/documentation/form/general/">
              Form
            </a>
            <hr class="navbar-divider">
            <a class="navbar-item" href="https://bulma.io/documentation/elements/box/">
              Elements
            </a>
            <a class="navbar-item is-active" href="https://bulma.io/documentation/components/breadcrumb/">
              Components
            </a>
          </div>
        </div>
      </div>
      <div class="navbar-end">
        <EditableText :content="username" @updated="updateUsername" class="navbar-item username"/>
      </div>
    </div>
  </nav>
</template>

<script>
import moment from 'moment';
import { mapState } from 'vuex';
import EditableText from './elements/EditableText';


export default {
  name:'Navbar',
  components: {
    EditableText
  },
  computed: {
    ...mapState(['username']),
    currentDay() {
      return moment().format("MMM Do YYYY");
    }
  },
  methods: {
    updateUsername(updName) {
      //check changed and valid, then:
      if (updName === this.username) return; //nothing changed
      if (updName.trim() === '') return; //not valid
      this.$store.commit('updateUsername', updName);
    },
  }
}
</script>

<style>
.navbar-item.logotext {
  font-size: 3rem;
}
.navbar-item.username {
  font-size: 1.5rem;
  font-weight: 700;
}
</style>
