const isObject = require('./is-object');
const isFunction = require('./is-function');

module.exports = function forEach (object, callback, scope) {
    if (isObject(object) === false) {
        throw new TypeError('first argument must be object');
    }

    if (isFunction(callback) === false) {
        throw new TypeError('callback must be function');
    }

    for (var key in object) {
        if (object.hasOwnProperty(key)) {
            callback.call(scope, object[key], key, object);
        }
    }
};