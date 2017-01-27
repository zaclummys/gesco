const toPathArray = require('./to-path-array');

module.exports = function isPathMatched (pathBase, pathCheck) {
    pathBase = toPathArray(pathBase);
    pathCheck = toPathArray(pathCheck);

    return pathBase.every(function (piece, index) {
        return piece === pathCheck[index];
    });
};