const DELIMITER = require('./delimiter');
const isArray = require('./is-array');
const isPathValid = require('./is-path-valid');

module.exports = function toPathString (path) {
    if (isPathValid(path)) {
        return isArray(path) ? path.join(DELIMITER) : path;
    }
};
