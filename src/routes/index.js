import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

// main views
import Tasks from '@/views/Tasks.vue';

// sub components
import InputForm from '@/components/InputForm.vue';
import UploadWidget from '@/components/UploadWidget.vue';
import Logs from '@/components/Logs.vue';
import Spheres from '@/components/Spheres.vue';
import Wins from '@/components/Wins.vue';
import Analytics from '@/components/Analytics.vue';

//rem: setting path to '' implies the default component/view.
const routes = [
  { path: '/tasks', alias: '/', component: Tasks, children: [
    { path: 'add', component: InputForm },
    { path: 'dataport', component: UploadWidget } //todo: build dataport view with upload, download etc functionality for datasourcing.
  ] },
  { path: '/logs', component: Logs },
  { path: '/logs/:taskid', component: Logs },
  { path: '/spheres', component: Spheres },
  { path: '/wins', component: Wins },
  { path: '/analytics', component: Analytics }
];

const router = new VueRouter({
  routes,
  mode: 'history'
});

export default router;