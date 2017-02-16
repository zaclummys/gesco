const isArray = require('./is-array');

module.exports = function arrayLast (array) {
    if (!isArray(array)) {
        throw new TypeError();
    }

    return array[array.length - 1];
};
