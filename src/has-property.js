const property = require('./property');

module.exports = function getProperty (obj, path) {
    return property(obj, path, function (parentProperty, basePropertyName) {
        return undefined !== parentProperty[basePropertyName];
    });
};
