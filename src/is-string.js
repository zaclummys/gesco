const is = require('./is');

module.exports = function isString (entry) {
    return is(entry) === '[object String]';
};