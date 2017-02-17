const property = require('./property');

module.exports = function getProperty (obj, path) {
    return property(obj, path, function (parentProperty, basePropertyName) {
        if(parentProperty instanceof Object) {
            return parentProperty[basePropertyName];
        }
        else {
            return;
        }
    });
};
