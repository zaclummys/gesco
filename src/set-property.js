const property = require('./property');

module.exports = function setProperty (object, path, value, ignoreError) {
    property(object, path, function (parentProperty, basePropertyName) {
        if(parentProperty instanceof Object) {
            parentProperty[basePropertyName] = value;
        }
        else {
            if(!ignoreError) {
                throw new TypeError('top-level property must be object');
            }
        }
    });
};
