const property = require('./property');

module.exports = function setProperty (object, path, value, ignoreError = false) {
    property(object, path, function (parentProperty, basePropertyName) {
        if(parentProperty instanceof Object) {
            parentProperty[basePropertyName] = value;
        }
        else {
            if(ignoreError === false) {
                throw new TypeError('top-level property must be object');
            }
        }
    });
};
