const DELIMITER = require('./delimiter');
const isString = require('./is-string');
const isArray = require('./is-array');

module.exports = function isPathValid (path) {
    var isValid;

    if (path == null || path.length === 0) {
        throw new TypeError('path is null');
    }

    if (isArray(path)) {
        isValid = path.every(function (piece) {
            return isString(piece) && piece.includes(DELIMITER) === false;
        });
    }
    else if(isString(path)) {
        isValid = path.includes(DELIMITER + DELIMITER) === false;
    }
    else {
        throw new TypeError('path must be string or array');
    }

    if (isValid) {
        return true;
    } else {
        throw new Error('path error');
    }
};