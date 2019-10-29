import name from './data/datasetList.json';
import _ from 'lodash';
import YAML from 'json2yaml';

let schemas = {};

function map(obj, name) {
    schemas[name] = {type: 'object', required: Object.keys(obj), properties: {}};
    Object.keys(obj).forEach(key => {
        let val = obj[key];
        if (key === 'curatorialUnits' && val !== []) {
            console.log(val);
        }
        if (_.isArray(val) && _.isObject(val[0])) {
            let mergedObj = _.merge({}, ...val);
            map(mergedObj, key);
            schemas[name].properties[key] = {
                description: 'TODO',
                type: 'array',
                items: {
                    '$ref': '#/components/schemas/' + key
                }
            }
        } else if (!_.isArray(val) && _.isObject(val)) {
            schemas[name].properties[key] = {
                '$ref': '#/components/schemas/' + key
            }
            map(val, key);
        } else {
            let firstVal = _.isArray(val) ? val[0] : val;
            schemas[name].properties[key] = {
                description: 'TODO',
                type: guessType(firstVal, key),
                example: firstVal
            }
        }
    });
}
map(name, 'DatasetListResult')
//let results = _.merge({}, ...name.results);
// let contacts = _.merge(...mergedDataset.contacts);

console.log(YAML.stringify(schemas));
// console.log(JSON.stringify(schemas, null, 2));

// Object.keys(merged).sort().forEach(key => {
//     console.log(`${key}: ${guessType(merged[key], key)}`)
// });

function guessType(val, key) {
    if (typeof val === 'undefined') return 'string'

    if (_.isArray(val)) {
        return `[${guessType(val[0])}]`
    }

    if (typeof val === 'string') return 'string'
    if (typeof val === 'number') return 'integer'
    if (typeof val === 'boolean') return 'boolean'
    if (typeof val === 'object') return 'object'
    return 'string'
}
