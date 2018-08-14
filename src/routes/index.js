import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

// developed components
import TaskList from '@/components/TaskList.vue';
import Domains from '@/components/Domains.vue';
import Wins from '@/components/Wins.vue';
import Analytics from '@/components/Analytics.vue';

const routes = [
  { path: '/', component: TaskList },
  { path: '/domains', component: Domains },
  { path: '/wins', component: Wins },
  { path: '/analytics', component: Analytics }
];

const router = new VueRouter({
  routes,
  mode: 'history'
});

export default router;