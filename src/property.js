const isObject = require('./is-object');
const isArray = require('./is-array');
const arrayLast = require('./array-last');
const isFunction = require('./is-function');

function pick (object, path) {
    if (!isArray(path)) {
        throw new TypeError();
    }

    var pathLength = path.length, property, offset;

    for (offset = 0; offset < pathLength; offset++) {
        property = path[offset];

        if (object && property in object) {
            object = object[property];
        } else {
            return undefined;
        }
    }

    return object;
}

module.exports = function property (object, path, callback) {
    var parentProperty, basePropertyName;

    if (!isObject(object)) {
        throw new TypeError('first argument must be object');
    }

    if (!isArray(path)) {
        throw new TypeError('path must be array');
    }

    if (!isFunction(callback)) {
        throw new TypeError('callback must be function');
    }

    if (path.length === 1) {
        parentProperty = object;
        basePropertyName = path[0];
    }
    else {
        parentProperty = pick(object, path.slice(0, -1));
        basePropertyName = arrayLast(path);
    }

    if (basePropertyName == null) {
        throw new TypeError('base property name must not be null');
    }

    return callback(parentProperty, basePropertyName);
};
