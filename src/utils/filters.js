export const toTwoDecimalPlaces = function (value) {
  let to2dp = Number.parseFloat(value).toFixed(2); //toFixed yields a *STRING* !
  to2dp = Number(to2dp);
  if (Number.isNaN(to2dp)) {
    return 0;
  }
  if (Number.isInteger(to2dp)) { //because nums like 5.00 pass the isInteger test.
    return Math.trunc(to2dp);
  }
  return to2dp; //float to 2dp.
}

export default {
  toTwoDecimalPlaces
}
