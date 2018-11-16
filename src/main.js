import Vue from 'vue';
import App from './App.vue';
import router from '@/routes/index.js';
import './registerServiceWorker'; //without importing this, the serviceworker code DOES NOT MAKE IT INTO THE WEBPACK BUILD PIPELINE!!!

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
