import { taskPersistenceService } from './vuexIdxDb';

export const setPersistedState = (state) => {
  const persistedState = mapToPersistedState(state);
  const promises = [];
  return new Promise((resolve, reject) => {
    persistedState.tasks.forEach(task => {
      //TODO: detect changes only!
      promises.push(taskPersistenceService.setItem(task.id, task));
    });

    Promise.all(promises)
    .then(result => {
      resolve(result);
    })
    .catch(error => {
      reject(error);
    })
  });
};

export const getPersistedState = (fetchKey) => {
  if(fetchKey) {
    return taskPersistenceService.getItem(fetchKey);
  } else {
    return taskPersistenceService.getItems().then(resultObj => {
      return Promise.resolve(Object.values(resultObj));
    });
  }
}

export const deletePersistedState = (deletionKey) => {
  if(deletionKey) {
    return taskPersistenceService.removeItem(deletionKey);
  } else {
    return taskPersistenceService.clear();
  }
}

export const mapToPersistedState = (state) => {
  //handle tasks only for now
  return ({ tasks: state.tasks });
};
