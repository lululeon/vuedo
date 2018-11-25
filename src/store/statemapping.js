import _kebabCase from 'lodash/kebabCase';
import {
  profilePersistenceService,
  taskPersistenceService,
  execlogPersistenceService } from './vuexIdxDb';

export const setPersistedState = (state) => {
  //TODO: detect changes only!
  const persistedState = mapToPersistedState(state);
  const taskPromises = [];
  const execlogPromises = [];
  return profilePersistenceService.setItem(
    _kebabCase(persistedState.profile.username), //can't have spaces in key
    persistedState.profile
  )
  .then(() => {
    persistedState.tasks.forEach(task => {
      taskPromises.push(taskPersistenceService.setItem(task.id, task));
    });
    return Promise.all(taskPromises); 
  })
  .then(() => {
    persistedState.executionLog.forEach(execlog => {
      execlogPromises.push(execlogPersistenceService.setItem(execlog.timestamp, execlog));
    });
    return Promise.all(execlogPromises);
  });
};

export const getPersistedState = () => {
  const persistedState = {};
  return profilePersistenceService.getItems().then(profiles => {
    persistedState.username = Object.values(profiles)[0].username || ''; //temp, till FE catches up with profile obj
    return taskPersistenceService.getItems();
  })
  .then(tasks => {
    persistedState.tasks = Object.values(tasks);
    return execlogPersistenceService.getItems();
  })
  .then(execlogs => {
    persistedState.executionLog = Object.values(execlogs);
    console.log('persistedState:', persistedState); // eslint-disable-line no-console
    return persistedState;
  });
}

/* ================== granular actions ====================== */
export const setPersistedProfile = (state) => {
  const persistedState = mapToPersistedState(state);
  return profilePersistenceService.setItem(
    _kebabCase(persistedState.profile.username), 
    persistedState.profile
  );
}
export const deletePersistedTask = (deletionKey) => {
  return taskPersistenceService.removeItem(deletionKey);
}

export const deletePersistedProfile = () => {
  return profilePersistenceService.clear();
}

export const deletePersistedExecLogs = () => {
  return execlogPersistenceService.clear();
}

export const deletePersistedState = () => {
  return profilePersistenceService.clear()
  .then(() => {
    return taskPersistenceService.clear();
  })
  .then(() => {
    return execlogPersistenceService.clear();
  });
}

export const mapToPersistedState = (state) => {
  return ({ 
    profile: { username: state.username },
    tasks: state.tasks,
    executionLog: state.executionLog
  });
};
