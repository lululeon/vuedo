// NOTE!! This file MUST be built first, and then incorporated into the webpack build pipeline (see vue.config.js) ...
// ...in order to spit out the actual /service-worker.js !!

/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable no-useless-escape */

/*
import idb from 'idb';

function createDB() {
  idb.open('vuedodb', 1, function(upgradeDB) {
    var store = upgradeDB.createObjectStore('tasks', {
      keyPath: 'id'
    });
    store.put({id: 123, name: 'coke', price: 10.99, quantity: 200});
    store.put({id: 321, name: 'pepsi', price: 8.99, quantity: 100});
    store.put({id: 222, name: 'water', price: 11.99, quantity: 300});
  });
}

function readDB() {
  idb.open('tasks', 1).then(function(db) {
    var tx = db.transaction(['tasks'], 'readonly');
    var store = tx.objectStore('tasks');
    return store.getAll();
  }).then(function(items) {
    // Use beverage data
    items.forEach(item => console.log("found:", item))
  });
}

self.addEventListener('activate', function(event) {
  event.waitUntil(
    createDB()
  );
});
*/

/* eslint-enable no-useless-escape */
/* eslint-enable no-undef */
/* eslint-enable no-console */

