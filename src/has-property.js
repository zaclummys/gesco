const property = require('./property');

module.exports = function getProperty (object, path) {
    return property(object, path, function (parentProperty, basePropertyName) {
        return undefined !== parentProperty[basePropertyName];
    });
};
