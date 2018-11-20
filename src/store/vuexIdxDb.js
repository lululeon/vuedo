/* eslint-disable */
// import VuexPersistence from 'vuex-persist';
import localforage from 'localforage';
import localforageGetItems from 'localforage-getitems';

const idxDbVersion = 1.0; // todo: move to an env var

//tasks only for now
export const taskPersistenceService = localforage.createInstance({
  key: "vdu_tasks",
  name: "vuedo", //database name
  // driver: localforage.INDEXEDDB, // default driver anyway
  version : idxDbVersion,
  storeName : 'mainstore' // think "table" name. Should be alphanumeric, with underscores. This is the name of the object store
});

//see https://codepen.io/thgreasi/pen/ojYKeE?editors=1111
taskPersistenceService.setDriver([
  localforage.INDEXEDDB,
  localforage.WEBSQL,
  localforage.LOCALSTORAGE
])
.then(() => {
  console.log('************ database ready!! **************');
  // taskPersistenceService.setItem('testkey', 'testvalue', function() {
  //   console.log('Using:' + taskPersistenceService.driver());
  // });
})
.catch(error => {
  console.log('woooops!!!', error);
});

export default {
  taskPersistenceService
}


// function createDB() {
//   idb.open('vuedodb', idxDbVersion, function(upgradeDB) {
//     var store = upgradeDB.createObjectStore('tasks', {
//       keyPath: 'id'
//     });
//     store.put({id: 123, name: 'coke', price: 10.99, quantity: 200});
//     store.put({id: 321, name: 'pepsi', price: 8.99, quantity: 100});
//     store.put({id: 222, name: 'water', price: 11.99, quantity: 300});
//   });
// }

// export const vuexTaskPersistence = new VuexPersistence({
//   storage: localforage,
//   asyncStorage: true, //localforage is an async lib
//   reducer: (state) => ({
//     tasks: state.tasks
//   }),
//   filter: (mutation) => {
//     taskMutationsOfInterest.includes(mutation);
//   }
// })

/* eslint-enable */