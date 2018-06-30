export const getStatus = function (runningTotal, target) { //args must be in display units, not raw units
  const failingLimit = 0.2*target;
  const slackingLimit = 0.4*target;
  const progressingLimit = 0.75*target;
  const achievingLimit = 0.95*target;
  const achievedLimit = target;
  const exceedingLimit = 1.1*target;
  if (runningTotal > 0) {
    if (runningTotal < failingLimit) {
      return 'failing';
    }
    if (runningTotal < slackingLimit) {
      return 'slacking';
    }
    if (runningTotal < progressingLimit) {
      return 'progressing';
    }
    if (runningTotal < achievingLimit) {
      return 'achieving';
    }
    if (runningTotal < achievedLimit) {
      return 'achieved';
    }
    if( runningTotal > exceedingLimit) {
      return 'exceeding';
    }
    return 'achieved';
  }
  return 'not-started';
}

export default {
  getStatus
}