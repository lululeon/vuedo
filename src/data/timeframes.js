export const timeframesList = {
    'tf:daily' : {
      name: 'Daily',
      immediacyLabel: 'today', //eg 3 times today
      freqLabel: 'a day' //eg 3 times a day
    },
    'tf:weekly' : {
      name: 'Weekly',
      immediacyLabel: 'this week',
      freqLabel: 'a week'
    },
    'tf:monthly' : {
      name: 'Monthly',
      immediacyLabel: 'this month',
      freqLabel: 'a month'
    }
};

export const timeframesListAsSelectOptions = function() {
  const options = [];
  Object.keys(timeframesList).forEach((k) => {
    options.push({ value:k, label:timeframesList[k].name });
  });
  return options;
};

export default {
  timeframesList,
  timeframesListAsSelectOptions
};