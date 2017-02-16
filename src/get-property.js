const property = require('./property');

module.exports = function getProperty (object, path) {
    return property(object, path, function (parentProperty, basePropertyName) {
        if(parentProperty instanceof Object) {
            return parentProperty[basePropertyName];
        }
        else {
            return;
        }
    });
};
