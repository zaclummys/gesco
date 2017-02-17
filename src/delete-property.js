const property = require('./property');

module.exports = function deleteProperty (obj, path) {
    property(obj, path, function (parentProperty, basePropertyName) {
        delete parentProperty[basePropertyName];
    });
};
