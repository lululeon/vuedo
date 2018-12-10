import dotenv from 'dotenv';
dotenv.config();

import Vue from 'vue';
import App from './App.vue';
import router from '@/routes/index.js';

// general service working for cacheing assets etc
import './registerServiceWorker'; //without importing this, the serviceworker code DOES NOT MAKE IT INTO THE WEBPACK BUILD PIPELINE!!!

Vue.config.productionTip = false;

// --- Rem: all Vue.use() calls must occur BEFORE new Vue(), below ---
new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
