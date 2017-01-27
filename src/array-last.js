const isArray = require('./is-array');

module.exports = function arrayLast (array) {
    if (isArray(array) === false) {
        throw new TypeError('first argument must be array');
    }

    return array[array.length - 1];
};