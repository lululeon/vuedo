import localforage from 'localforage';
import localforageGetItems from 'localforage-getitems'; // eslint-disable-line no-unused-vars

const idxDbVersion = 1.0; // todo: move to an env var

export const profilePersistenceService = localforage.createInstance({
  name: "vuedo",
  version : idxDbVersion,
  storeName : 'profile'
});
export const taskPersistenceService = localforage.createInstance({
  // key: "vdu_tasks",
  name: "vuedo", //database name
  version : idxDbVersion,
  storeName : 'tasks' //alphanumeric, underscores.
});
export const execlogPersistenceService = localforage.createInstance({
  name: "vuedo",
  version : idxDbVersion,
  storeName : 'execlog'
});


//see https://codepen.io/thgreasi/pen/ojYKeE?editors=1111
profilePersistenceService.setDriver([
  localforage.INDEXEDDB,
  localforage.WEBSQL,
  localforage.LOCALSTORAGE
])
.catch(error => {
  //TODO: proper logging framework
  console.log('woooops!!!', error); // eslint-disable-line no-console
});
taskPersistenceService.setDriver([
  localforage.INDEXEDDB,
  localforage.WEBSQL, // fallback
  localforage.LOCALSTORAGE // fallback
])
.catch(error => {
  //TODO: proper logging framework
  console.log('woooops!!!', error); // eslint-disable-line no-console
});
execlogPersistenceService.setDriver([
  localforage.INDEXEDDB,
  localforage.WEBSQL,
  localforage.LOCALSTORAGE
])
.catch(error => {
  //TODO: proper logging framework
  console.log('woooops!!!', error); // eslint-disable-line no-console
});



export default {
  profilePersistenceService,
  taskPersistenceService,
  execlogPersistenceService
}