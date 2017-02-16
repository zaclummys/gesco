const property = require('./property');

module.exports = function deleteProperty (object, path) {
    property(object, path, function (parentProperty, basePropertyKey) {
        delete parentProperty[basePropertyKey];
    });
};
