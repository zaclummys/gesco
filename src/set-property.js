const isObject = require('./is-object');
const isArray = require('./is-array');
const getProperty = require('./get-property');
const arrayLast = require('./array-last');

module.exports = function setProperty (object, path, value) {
    var parentProperty, basePropertyKey;

    if (isArray(path) === false) {
        throw new TypeError('path must be array');
    }

    if (path.length === 1) {
        parentProperty = object;
        basePropertyKey = path[0];
    } else {
        parentProperty = getProperty(object, path.slice(0, -1));
        basePropertyKey = arrayLast(path);
    }

    if (isObject(parentProperty) === false) {
        throw new Error('top-level property must be object');
    }

    if (basePropertyKey == null) {
        throw new Error('base property key is null');
    }

    parentProperty[basePropertyKey] = value;
};