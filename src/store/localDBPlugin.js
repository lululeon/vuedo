import PouchDB from 'pouchdb';

const taskMutationsOfInterest = [
  'import',
  'newTask',
  'updatedTask',
  'deleteTask',
  'updateUsername',
  'newExecutionLog',
  'undoExecutionLogByTaskId'
];

const ofInterest = (mutation) => {
  return taskMutationsOfInterest.includes(mutation);
};

const db = new PouchDB('vdo-local', {
  //revs_limit: 1, //bad! worst value u cld set. leave this alone for now...
  auto_compaction: true
});
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

// -------- task handling --------------
const addPersistedTask = (task) => {
  return db.put(Object.assign({}, { _id: task.id}, task));
}
const updatePersistedTask = (task) => {
  return db.get(task.id)
  .then(taskToUpdate => {
    console.log('got back the item we want to update:', taskToUpdate); // eslint-disable-line no-console
    taskToUpdate.description = task.description;
    taskToUpdate.targetReached = task.targetReached;
    taskToUpdate.metric = task.metric;
    return db.put(taskToUpdate);
  });
}

const deletePersistedTask = (taskId) => {
  return db.get(taskId)
  .then(task => {
    console.log('got back the item we want to delete:', task); // eslint-disable-line no-console
    return db.remove(task);
  });
}
// const deletePersistedState = () => {
//   // return profilePersistenceService.clear()
//   // .then(() => {
//   db.remove(todo);
//   return taskPersistenceService.clear();
//   // })
//   // .then(() => {
//   //   return execlogPersistenceService.clear();
//   // });
// }

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
        //net new tasks: these will be assigned a revision that needs to be pushed back to vuex
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

// custom store plugin
export const vuexPlugin = (store) => {
  store.subscribe((mutation, state) => {
    if (ofInterest(mutation.type)) {
      // if(mutation.type === 'import') {
      //   this.deletePersistedState()
      //   .then(() => {
      //     this.setPersistedState(state);
      //   })
      //   .catch(err => console.warn('failed to persist imported state', err)); //eslint-disable-line no-console
      // } else 
      if (mutation.type === 'newTask') {
        addPersistedTask(mutation.payload)
        .then(result => {
          console.log('Add new task result:', result); //eslint-disable-line no-console
        })
        .catch(err => console.warn('failed to add new task', err)); //eslint-disable-line no-console
      }
      else if (mutation.type === 'updatedTask') {
        updatePersistedTask(mutation.payload)
        .then(result => {
          console.log('Updated task result:', result); //eslint-disable-line no-console
        })
        .catch(err => console.warn('failed to update task', err)); //eslint-disable-line no-console
      }
      else if (mutation.type === 'deleteTask') {
        //TODO: more granular handling
        //TODO: the payload is literally the id. should stick to homogenous/sensible payload shapes...
        // deletePersistedExecLogs()
        // .then(() => {
          deletePersistedTask(mutation.payload)
          .then(result => {
            console.log('Deletion Result:', result); //eslint-disable-line no-console
          })
          .catch(err => console.warn('failed to delete persisted task', err)); //eslint-disable-line no-console
        // })
        // .then(() => {
        //   setPersistedState(state);
        // })
        // .catch(err => console.warn('failed to delete persisted task', err)); //eslint-disable-line no-console
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
      } else {
        // TODO: less monolithic handling of additive changes
        setPersistedState(state).catch(err => console.warn('failed to persist state', err)); //eslint-disable-line no-console
      }
    }
  });
}


// custom Vue plugin (not Store plugin)
export const LocalDB = {
  install(Vue) {
    if(Vue.$eventHub)
    
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
