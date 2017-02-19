const is = require('./is');

module.exports =  function isArray (entry) {
    return is(entry) === '[object Array]';
};
