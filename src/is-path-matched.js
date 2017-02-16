const toPathArray = require('./to-path-array');

module.exports = function isPathMatched (pathOne, pathTwo) {
    pathOne = toPathArray(pathOne);
    pathTwo = toPathArray(pathTwo);

    return pathOne.every((piece, index) => piece === pathTwo[index]);
};
