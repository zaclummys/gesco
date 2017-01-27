const isArray = require('./is-array');

module.exports = function(entry) {
    return isArray(entry) ? entry : [entry];
};