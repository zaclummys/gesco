const is = require('./is');

module.exports = function isObject (entry) {
    return is(entry) === '[object Object]';
};
