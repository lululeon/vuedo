<template>
  <nav class="navbar is-transparent is-fixed-top" role="navigation" aria-label="main navigation">
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
        <div class="navbar-item has-dropdown is-hoverable">
          <router-link class="navbar-item" to="/tasks">Tasks</router-link>
          <div class="navbar-dropdown is-boxed">
            <router-link class="navbar-item" to="/tasks">Current Tasks</router-link>
            <router-link class="navbar-item" to="/tasks/add">Add a task</router-link>
            <hr class="navbar-divider">
            <router-link class="navbar-item" to="/tasks/dataport">Import/Export Data</router-link>
            <!--
            <a class="navbar-item">
              Export/Download Tasks
            </a>
            -->
          </div>
        </div>
        <router-link class="navbar-item" to="/logs">Raw Logs</router-link>
        <router-link class="navbar-item" to="/spheres">Spheres</router-link>
        <router-link class="navbar-item" to="/wins">Wins</router-link>
        <router-link class="navbar-item" to="/analytics">Analytics</router-link>
      </div>
      <div class="navbar-end">
        <span class="navbar-item">{{ currentDay }}</span>
        <EditableText :content="username" @updated="updateUsername" class="navbar-item username"/>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapState } from 'vuex';
import moment from 'moment';
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

<style lang="scss">
nav.navbar.is-transparent.is-fixed-top {
    border-bottom: 1px solid #eee;
    box-shadow: 2px 2px 3px 0px #eee;
}
.navbar-menu {
    margin-top: 0.5em;
}
.navbar-item {
  &.logotext {
    font-size: 2em;
    font-weight: 700;
    margin-left: 36px; /*bulma fluid container margins are this */
    margin-bottom: 0;
  }
  &.username {
    font-weight: 700;
  }
}
</style>
