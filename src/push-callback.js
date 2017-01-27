const isArray = require('./is-array');
const isFunction = require('./is-function');
const wrap = require('./wrap');

module.exports = function pushCallback (list, callbacks) {
    if(isArray(list) === false) {
        throw new TypeError('list must be array');
    }

    wrap(callbacks).forEach(function (callback) {
        if (isFunction(callback)) {
            list.push(callback);
        }
        else {
            throw new TypeError('callback must be function');
        }
    });
};