import { taskPersistenceService } from './vuexIdxDb';

export const setState = (state) => {
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

export const getState = (fetchKey) => {
  if(fetchKey) {
    return taskPersistenceService.getItem(fetchKey);
  } else {
    return taskPersistenceService.getItem(''); //blank key => get everything
  }
}

export const deleteState = (deletionKey) => {
  if(deletionKey) {
    return taskPersistenceService.removeItem(deletionKey);
  } else {
    return taskPersistenceService.removeItem(''); // blank key => everything
  }
}

export const mapToPersistedState = (state) => {
  //handle tasks only for now
  return ({ tasks: state.tasks });
};
