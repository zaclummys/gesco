const isFunction = require('./is-function');
const isArray = require('./is-array');

module.exports = function search (arr, successFn, matchFn, excludeFn) {
    if(!isArray(arr)) {
        throw new TypeError();
    }

    if(!isFunction(successFn)) {
        throw new TypeError();
    }

    if(!isFunction(matchFn)) {
        throw new TypeError();
    }

    var hasExcludeFn = !!excludeFn;

    if(hasExcludeFn && !isFunction(excludeFn)) {
        throw new TypeError();
    }

    arr.forEach(function (item) {
        if(matchFn(item) && (hasExcludeFn && excludeFn(item)) === false) {
            successFn(item);
        }
    });
};
