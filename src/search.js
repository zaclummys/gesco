const isObject = require('./is-object');
const isFunction = require('./is-function');
const forEach = require('./for-each');

module.exports = function search (object, matchingCallback, checkingCallback) {
    if (isObject(object) === false) {
        throw new TypeError('first argument must be object');
    }

    if (isFunction(matchingCallback) === false) {
        throw new TypeError('matching callback must be function');
    }

    if (isFunction(checkingCallback) === false) {
        throw new TypeError('checking callback must be function');
    }

    forEach(object, function (value, key) {
        if (checkingCallback(key)) {
            matchingCallback(value, key, object);
        }
    });
};