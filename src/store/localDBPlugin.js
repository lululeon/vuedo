import PouchDB from 'pouchdb';

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

const db = new PouchDB('vdo-local');
const couchUser = process.env.VUE_APP_COUCH_USER;
const couchPass = process.env.VUE_APP_COUCH_PASS;
const couchHost = process.env.VUE_APP_COUCH_HOST;
const remoteCouch = `http://${couchUser}:${couchPass}@${couchHost}/testtasks`;

const syncError = () => {
  console.error('data-sync-error'); // eslint-disable-line no-console
}

const syncDatabases = () => {
  var opts = {live: true};
  db.replicate.to(remoteCouch, opts, syncError);
  db.replicate.from(remoteCouch, opts, syncError);
}

const mapToPersistedState = (state) => {
  return ({ 
    profile: { username: state.username },
    tasks: state.tasks,
    executionLog: state.executionLog
  });
}

const getPersistedState = () => {
  const persistedState = {};
  return db.allDocs({include_docs: true, descending: true})
  .then(result => {
    persistedState.tasks = result.rows.map(task => task.doc);
    console.log('pouchdb fetch all tasks', persistedState.tasks); // eslint-disable-line no-console
    return persistedState;
  })
  .catch(error => {
    console.log('woops... getPersistedState failed', error); // eslint-disable-line no-console
  });
  
  // return profilePersistenceService.getItems().then(profiles => {
  //   persistedState.username = Object.values(profiles)[0].username || ''; //temp, till FE catches up with profile obj
  //   return taskPersistenceService.getItems();
  // })
  // .then(tasks => {
  //   persistedState.tasks = Object.values(tasks);
  //   return execlogPersistenceService.getItems();
  // })
  // .then(execlogs => {
  //   persistedState.executionLog = Object.values(execlogs);
  //   console.log('persistedState:', persistedState); // eslint-disable-line no-console
  //   return persistedState;
  // });
}

const setPersistedState = (state) => {
  const persistedState = mapToPersistedState(state);
  const taskPromises = [];
  // const execlogPromises = [];
  // return profilePersistenceService.setItem(
  //   _kebabCase(persistedState.profile.username), //can't have spaces in key
  //   persistedState.profile
  // )
  // .then(() => {
    persistedState.tasks.forEach(task => {
      if(!task._id) {
        taskPromises.push(db.put(Object.assign({}, { _id: task.id}, task)));
      } else {
        taskPromises.push(db.put(task));
      }
    });
    return Promise.all(taskPromises); 
  // })
  // .then(() => {
  //   persistedState.executionLog.forEach(execlog => {
  //     execlogPromises.push(execlogPersistenceService.setItem(execlog.timestamp, execlog));
  //   });
  //   return Promise.all(execlogPromises);
  // });
}

export const vuexPlugin = (store) => {
  store.subscribe((mutation, state) => {
    if (ofInterest(mutation.type)) {
      // if(mutation.type === 'import') {
      //   this.deletePersistedState()
      //   .then(() => {
      //     this.setPersistedState(state);
      //   })
      //   .catch(err => console.warn('failed to persist imported state', err)); //eslint-disable-line no-console
      // } 
      // else if(mutation.type === 'deleteTask') {
      //   //TODO: more granular handling
      //   //TODO: the payload is literally the id. should stick to homogenous/sensible payload shapes...
      //   deletePersistedExecLogs()
      //   .then(() => {
      //     return deletePersistedTask(mutation.payload);
      //   })
      //   .then(() => {
      //     setPersistedState(state);
      //   })
      //   .catch(err => console.warn('failed to delete persisted task', err)); //eslint-disable-line no-console
      // } else if(mutation.type === 'undoExecutionLogByTaskId') {
      //   deletePersistedExecLogs()
      //   .then(() => {
      //     setPersistedState(state);
      //   })
      //   .catch(err => console.warn('failed to handle persistence for [undoExecutionLogByTaskId] mutation', err)); //eslint-disable-line no-console
      // } else if (mutation.type === 'updateUsername') {
      //   deletePersistedProfile()
      //   .then(() => {
      //     setPersistedProfile(state);
      //   })
      //   .catch(err => console.warn('failed to handle persistence for [updateUsername] mutation', err)); //eslint-disable-line no-console
      // } else {
        //TODO: less monolithic handling of additive changes
        setPersistedState(state).catch(err => console.warn('failed to persist state', err)); //eslint-disable-line no-console
      // }
    }
  });
}


// custom Vue plugin (not Store plugin)
export const LocalDB = {
  install(Vue) {
    db.changes({
      since: 'now',
      live: true
    }).on('change', () => {
      console.log('database changed!'); // eslint-disable-line no-console
    });

    if (remoteCouch) {
      syncDatabases();
    }

    const persistenceInterface = {
      db,
      mapToPersistedState,
      getPersistedState,
      setPersistedState
    }

    Object.defineProperty(Vue.prototype, '$localdb', {
      get: function() {
        return persistenceInterface;
      }
    });
  }
};
