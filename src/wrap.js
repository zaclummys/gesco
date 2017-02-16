const isArray = require('./is-array');

module.exports = function wrap(entry) {
    if(entry == null) {
        return [];
    }

    return isArray(entry) ? entry : [entry];
};
