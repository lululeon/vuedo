import { register } from 'register-service-worker';

/* eslint-disable no-console */
// rem to create corresponding .env in prod
if (process.env.NODE_ENV === 'production') {
  console.log("==================== PRODUCTION ========================");
  // >>>
  // while cribbing from vue-cli generated registerServiceWorker.js file ... 
  // ... we not that we didn't name the sw file this, and swSrc in vue.config.js will be used instead, so:
  // register(`${process.env.BASE_URL}service-worker.js`, {
  register(`${process.env.BASE_URL}serviceworker.js`, {
  // <<<
    ready() {
      console.log('App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB');
    },
    cached() {
      console.log('Content has been cached for offline use.');
    },
    updated() {
      console.log('New content is available; please refresh.');
    },
    offline() {
      console.log('No internet connection found. App is running in offline mode.');
    },
    error(error) {
      console.error('Error during service worker registration:', error);
    },
  });
} else {
  //mock behaviour of sw
  register(`/serviceworker.js`, {
    // <<<
      ready() {
        console.log('App is being served from cache by a service worker.\n' +
          'For more details, visit https://goo.gl/AFskqB');
      },
      cached() {
        console.log('Content has been cached for offline use.');
      },
      updated() {
        console.log('New content is available; please refresh.');
      },
      offline() {
        console.log('No internet connection found. App is running in offline mode.');
      },
      error(error) {
        console.error('Error during service worker registration:', error);
      },
    });

}
/* eslint-enable no-console */