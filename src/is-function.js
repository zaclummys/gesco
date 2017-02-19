const is = require('./is');

module.exports = function isFunction (entry) {
    return is(entry) === '[object Function]';
};
