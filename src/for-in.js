const isFunction = require('./is-function');

module.exports = function forIn(object, callback, thisArg) {
    if(!isFunction(callback)) {
        throw new TypeError('callback must be function');
    }

    for (var key in object) {
        if (callback.call(thisArg, object[key], key, object) === false) {
            break;
        }
    }
};
