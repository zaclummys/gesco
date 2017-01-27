const isObject = require('./is-object');
const isFunction = require('./is-function');
const forEach = require('./for-each');

module.exports = function map (object, callback, scope) {
    if (isObject(object) === false) {
        throw new TypeError('first argument must be object');
    }

    if (isFunction(callback) === false) {
        throw new TypeError('callback must be function');
    }

    var output = {};

    forEach(object, function (value, key) {
        output[key] = callback.call(this, value, key, object);
    }, scope);

    return output;
};