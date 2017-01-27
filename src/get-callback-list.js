const setProperty = require('./set-property');
const getProperty = require('./get-property');
const hasProperty = require('./has-property');
const toPathString = require('./to-path-string');

module.exports = function getCallbackList (object, path) {
    path = [toPathString(path)];

    if (hasProperty(object, path) === false) {
        setProperty(object, path, []);
    }

    return getProperty(object, path);
};