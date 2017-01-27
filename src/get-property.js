const isObject = require('./is-object');
const isArray = require('./is-array');
const hasProperty = require('./has-property');

module.exports = function getProperty (object, path) {
    var property, offset;

    if (isObject(object) === false) {
        throw new TypeError('first argument must be object');
    }

    if (isArray(path) === false) {
        throw new TypeError('path must be array');
    }

    if (hasProperty(object, path) === false) {
        return;
    }

    for (offset = 0; offset < path.length; offset++) {
        property = String(path[offset]);
        object = Object(object);

        object = object[property];
    }

    return object;
};