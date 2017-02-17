const DELIMITER = require('./delimiter');
const isString = require('./is-string');
const isArray = require('./is-array');

const WHITESPACE  = /\s/g;

function isPathValidString (str, isPiece) {
    if(!isString(str)) {
        throw new TypeError('path is not valid');
    }

    if(WHITESPACE.test(str) === true) {
        throw new Error('path must no have whitespaces');
    }

    return str.includes(isPiece ? DELIMITER : DELIMITER + DELIMITER) === false;
}

module.exports = function isPathValid (path) {
    var isValid;

    if (path == null || path.length === 0) {
        throw new TypeError('path must not be null');
    }

    if(isString(path)) {
        path = path.split(DELIMITER);
    }

    if (isArray(path)) {
        isValid = path.every(function (piece) {
            return piece && isPathValidString(piece, true);
        });
    }

    if (isValid) {
        return true;
    } else {
        throw new Error('path error');
    }
};
