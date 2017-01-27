const isObject = require('./is-object');
const isArray = require('./is-array');

module.exports = function hasProperty (object, path) {
    var property, offset;

    if (isObject(object) === false) {
        throw new TypeError('first argument must be object');
    }

    if (isArray(path) === false) {
        throw new TypeError('path must be array');
    }

    for (offset = 0; offset < path.length; offset++) {
        property = String(path[offset]);
        object = Object(object);

        if (property in object) {
            object = object[property];
        } else {
            return false;
        }
    }

    return true;
};