import { setState, deleteState } from './statemapping';

const taskMutationsOfInterest = [
  'initialize',
  'addTask',
  'updateTask',
  'deleteTask'
];

const ofInterest = (mutation) => {
  return taskMutationsOfInterest.includes(mutation);
};

// vuex plugin. see https://vuex.vuejs.org/guide/plugins.html
export const persistencePlugin = (store) => {
  store.subscribe((mutation, state) => {
    console.log('************here!!! mutation is', mutation); //eslint-disable-line
    if (ofInterest(mutation.type)) {
      if(mutation.type !== 'deleteTask') {
        //TODO: less monolithic handling of additive changes
        setState(state).catch(err => console.warn('failed to persist state', err)); //eslint-disable-line no-console
      } else {
        //TODO: the payload is literally the id. should stick to homogenous/sensible payload shapes...
        deleteState(mutation.payload).catch(err => console.warn('failed to persist state', err)); //eslint-disable-line no-console
      }
    }
  });
};
