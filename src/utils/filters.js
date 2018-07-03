export const toTwoDecimalPlaces = function (value) {
  return Math.round((value + 0.0001) * 100) / 100;
}

export default {
  toTwoDecimalPlaces
}
