const isArray = require('./is-array');

module.exports = function arrayLast (arr) {
    if (!isArray(arr)) {
        throw new TypeError();
    }

    return arr[arr.length - 1];
};
