export const uomList = {
    // dimensionless metrics
    'none:count': {
        uomShorthand: 'times',
        uomLabel: 'Counts',
        uomSingular: 'Count',
        uomBaseUnit: 'none:count',
        uomMultiplier: 1
    },
    // time metrics
    'time:minute' : { 
        uomShorthand: 'mins',
        uomLabel: 'Minutes',
        uomSingular: 'Minute',
        uomBaseUnit: 'time:hour',
        uomMultiplier: 0.01666666666
    },
    'time:hour' : { 
        uomShorthand: 'hrs.',
        uomLabel: 'Hours', 
        uomSingular: 'Hour',
        uomBaseUnit: 'time:hour',
        uomMultiplier: 1
    },
    // distance metrics
    'distance:mile' : {
        uomShorthand: 'mi.',
        uomLabel: 'Miles', 
        uomSingular: 'Mile',
        uomBaseUnit: 'distance:meter',
        uomMultiplier: 1609.34
    },
    'distance:kilometer' : { 
        uomShorthand: 'km',
        uomLabel: 'Kilometers', 
        uomSingular: 'Kilometer',
        uomBaseUnit: 'distance:meter',
        uomMultiplier: 1000
    },
    'distance:meter' : { 
        uomShorthand: 'm',
        uomLabel: 'Meters', 
        uomSingular: 'Meter',
        uomBaseUnit: 'distance:meter',
        uomMultiplier: 1
    },
    // weight metrics
    'weight:kilogram' : { 
        uomShorthand: 'kg',
        uomLabel: 'Kilograms', 
        uomSingular: 'Kilogram',
        uomBaseUnit: 'weight:kilogram',
        uomMultiplier: 1
    },
    // monetary units
    'money:gbp' : {
        uomShorthand: 'GBP',
        uomLabel: 'Pounds Sterling (£)', 
        uomSingular: 'Pound (£)',
        uomBaseUnit: 'money:usd',
        uomMultiplier: 1.35 //TODO: override with realtime rate day of.
    },
    'money:euro' : {
        uomShorthand: 'EUR',
        uomLabel: 'Euros (€)',
        uomSingular: 'Euro (€)',
        uomBaseUnit: 'money:usd',
        uomMultiplier: 1.19 //TODO: override with realtime rate day of.
    },
    'money:cad' : {
        uomShorthand: 'CAD',
        uomLabel: 'Canadian Dollars ($)', 
        uomSingular: 'Dollar ($CAD)',
        uomBaseUnit: 'money:usd',
        uomMultiplier: 0.78 //TODO: override with realtime rate day of.
    },
    'money:usd' : {
        uomShorthand: 'USD',
        uomLabel: 'US Dollars ($)', 
        uomSingular: 'Dollar ($USD)',
        uomBaseUnit: 'money:usd',
        uomMultiplier: 1
    }
};

export const uomListAsSelectOptions = function() {
  const options = [];
  Object.keys(uomList).forEach((k) => {
    options.push({ value:k, label:uomList[k].uomLabel });
  });
  return options;
};

export const getMetricPrefix = function(uomId) {
  if((typeof uomId) === 'string') {
    const prefix = uomId.substr(0, uomId.indexOf(':') === -1 ? uomId.length : uomId.indexOf(':'));
    return prefix;
  } else {
    return '';
  }
}

export const isTimeMetric = function(uomId) {
  return (getMetricPrefix(uomId) === 'time');
}

export const isDistanceMetric = function(uomId) {
  return (getMetricPrefix(uomId) === 'distance');
}

export const isMonetaryMetric = function(uomId) {
  return (getMetricPrefix(uomId) === 'money');
}

export const isDimensionlessMetric = function(uomId) {
  return (getMetricPrefix(uomId) === 'money');
}

export default {
  uomList,
  uomListAsSelectOptions,
  getMetricPrefix,
  isTimeMetric,
  isDistanceMetric,
  isMonetaryMetric,
  isDimensionlessMetric
}
