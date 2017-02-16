const isString = require('./is-string');
const args = require('./args');

const EXPRESSION =  new RegExp('%s', 'g');

module.exports = function eprintf (template) {
    if(!isString(template)) {
        throw new TypeError();
    }

    var strings = args(arguments, 1), offset = 0;

    if(strings.length !== template.match(EXPRESSION).length) {
        throw new Error('args length error');
    }

    return template.replace(/%s/g, function () {
        return String(strings[offset++]);
    });
};
