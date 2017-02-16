const forIn = require('./for-in');
const has = require('./has');
const isFunction = require('./is-function');

module.exports = function forOwn(object, callback, thisArg) {
    if(!isFunction(callback)) {
        throw new TypeError('callback must be function');
    }

    forIn(object, function(value, key) {
        if (has(object, key)) {
            return callback.call(this, value, key, object);
        }
    }, thisArg);
};
