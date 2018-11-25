import { taskPersistenceService, profilePersistenceService } from './vuexIdxDb';

export const setPersistedState = (state) => {
  const persistedState = mapToPersistedState(state);
  const taskPromises = [];
  return profilePersistenceService.setItem(
    persistedState.profile.username, 
    persistedState.profile
  )
  .then(() => {
    persistedState.tasks.forEach(task => {
      //TODO: detect changes only!
      taskPromises.push(taskPersistenceService.setItem(task.id, task));
    });
    return Promise.all(taskPromises); 
  });
};

export const getPersistedState = () => {
  const persistedState = {};
  return profilePersistenceService.getItems().then(profiles => {
    persistedState.username = Object.values(profiles)[0].username; //temp, till FE catches up with profile obj
    return taskPersistenceService.getItems();
  })
  .then(tasks => {
    persistedState.tasks = Object.values(tasks);
    console.log('persistedState:', persistedState); // eslint-disable-line no-console
    return persistedState;
  });
}

export const deletePersistedState = (deletionKey) => {
  if(deletionKey) {
    return taskPersistenceService.removeItem(deletionKey);
  } else {
    return taskPersistenceService.clear();
  }
}

export const mapToPersistedState = (state) => {
  return ({ 
    tasks: state.tasks,
    profile: { username: state.username }
  });
};
