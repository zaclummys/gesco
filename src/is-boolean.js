const is = require('./is');

module.exports = function isBoolean (entry) {
    return is(entry) == '[object Boolean]';
};
