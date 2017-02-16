const DELIMITER = require('./delimiter');
const isString = require('./is-string');
const isPathValid = require('./is-path-valid');

module.exports =  function toPathArray (path) {
    if (isPathValid(path)) {
        return isString(path) ? path.split(DELIMITER) : path;
    }
};
