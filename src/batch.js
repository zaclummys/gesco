const isFunction = require('./is-function');
const isObject = require('./is-object');

module.exports = function batch (singleCallback, batchCallback, args, thisArg) {
    if(!isFunction(batchCallback)) {
        throw new TypeError();
    }

    if(!isFunction(singleCallback)) {
        throw new TypeError();
    }

    if(args == null || args.length === 0) {
        throw new Error('no arguments');
    }

    var callback = args.length === 1 && isObject(args[0]) ? batchCallback : singleCallback;

    return callback.apply(thisArg, args);
};
