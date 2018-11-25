import { 
  setPersistedState, 
  deletePersistedState,
  deletePersistedExecLogs, 
  deletePersistedTask,
  deletePersistedProfile,
  setPersistedProfile
} from './statemapping';

const taskMutationsOfInterest = [
  'import',
  'addTask',
  'updateTask',
  'deleteTask',
  'updateUsername',
  'newExecutionLog',
  'undoExecutionLogByTaskId'
];

const ofInterest = (mutation) => {
  return taskMutationsOfInterest.includes(mutation);
};

// vuex plugin. see https://vuex.vuejs.org/guide/plugins.html
export const persistencePlugin = (store) => {
  store.subscribe((mutation, state) => {
    if (ofInterest(mutation.type)) {
      if(mutation.type === 'import') {
        deletePersistedState()
        .then(() => {
          setPersistedState(state);
        })
        .catch(err => console.warn('failed to persist imported state', err)); //eslint-disable-line no-console
      } else if(mutation.type === 'deleteTask') {
        //TODO: more granular handling
        //TODO: the payload is literally the id. should stick to homogenous/sensible payload shapes...
        deletePersistedExecLogs()
        .then(() => {
          return deletePersistedTask(mutation.payload);
        })
        .then(() => {
          setPersistedState(state);
        })
        .catch(err => console.warn('failed to delete persisted task', err)); //eslint-disable-line no-console
      } else if(mutation.type === 'undoExecutionLogByTaskId') {
        deletePersistedExecLogs()
        .then(() => {
          setPersistedState(state);
        })
        .catch(err => console.warn('failed to handle persistence for [undoExecutionLogByTaskId] mutation', err)); //eslint-disable-line no-console
      } else if (mutation.type === 'updateUsername') {
        deletePersistedProfile()
        .then(() => {
          setPersistedProfile(state);
        })
        .catch(err => console.warn('failed to handle persistence for [updateUsername] mutation', err)); //eslint-disable-line no-console
      } else {
        //TODO: less monolithic handling of additive changes
        setPersistedState(state).catch(err => console.warn('failed to persist state', err)); //eslint-disable-line no-console
      }
    }
  });
};
