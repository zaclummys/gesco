const toPathString = require('./to-path-string');

module.exports = function isPathEqual (pathOne, pathTwo) {
    return toPathString(pathOne) === toPathString(pathTwo);
};
