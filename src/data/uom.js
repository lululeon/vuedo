export default {
    // dimensionless metrics
    'none:count': {
        uomShorthand: 'x',
        uomLabel: 'Counts',
        uomBaseUnit: 'none:count',
        uomMultiplier: 1
    },
    // time metrics
    // 'time:day' : {
    //     uomShorthand: 'd',
    //     uomLabel: 'Days',
    //     uomBaseUnit: 'time:hour',
    //     uomMultiplier: 24
    // },
    'time:minute' : { 
        uomShorthand: 'mins',
        uomLabel: 'Minutes',
        uomBaseUnit: 'time:hour',
        uomMultiplier: 0.01666666666
    },
    'time:hour' : { 
        uomShorthand: 'hrs.',
        uomLabel: 'Hours', 
        uomBaseUnit: 'time:hour',
        uomMultiplier: 1
    },
    // distance metrics
    'distance:mile' : {
        uomShorthand: 'mi.',
        uomLabel: 'Miles', 
        uomBaseUnit: 'distance:meter',
        uomMultiplier: 1609.34
    },
    'distance:kilometer' : { 
        uomShorthand: 'km',
        uomLabel: 'Kilometers', 
        uomBaseUnit: 'distance:meter',
        uomMultiplier: 1000
    },
    'distance:meter' : { 
        uomShorthand: 'm',
        uomLabel: 'Meters', 
        uomBaseUnit: 'distance:meter',
        uomMultiplier: 1
    },
    // weight metrics
    // 'weight:stone' : { 
    //     uomShorthand: 'st.',
    //     uomLabel: 'Stone', 
    //     uomBaseUnit: 'weight:kilogram',
    //     uomMultiplier: 6.35029
    // },
    // 'weight:pound' : {
    //     uomShorthand: 'lb',
    //     uomLabel: 'Pounds', 
    //     uomBaseUnit: 'weight:kilogram',
    //     uomMultiplier: 0.453592
    // },
    // 'weight:ounce' : { 
    //     uomShorthand: 'lb',
    //     uomLabel: 'Ounces', 
    //     uomBaseUnit: 'weight:kilogram',
    //     uomMultiplier: 0.0283495
    // },
    'weight:kilogram' : { 
        uomShorthand: 'kg',
        uomLabel: 'Kilograms', 
        uomBaseUnit: 'weight:kilogram',
        uomMultiplier: 1
    },
    // monetary units
    'money:gbp' : {
        uomShorthand: 'GBP',
        uomLabel: 'Pounds Sterling (£)', 
        uomBaseUnit: 'money:usd',
        uomMultiplier: 1.35 //TODO: override with realtime rate day of.
    },
    'money:euro' : {
        uomShorthand: 'EUR',
        uomLabel: 'Euros (€)', 
        uomBaseUnit: 'money:usd',
        uomMultiplier: 1.19 //TODO: override with realtime rate day of.
    },
    'money:cad' : {
        uomShorthand: 'CAD',
        uomLabel: 'Canadian Dollars ($)', 
        uomBaseUnit: 'money:usd',
        uomMultiplier: 0.78 //TODO: override with realtime rate day of.
    },
    'money:usd' : {
        uomShorthand: 'USD',
        uomLabel: 'US Dollars ($)', 
        uomBaseUnit: 'money:usd',
        uomMultiplier: 1
    }
};