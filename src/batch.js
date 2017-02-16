const isFunction = require('./is-function');

module.exports = function batch (singleCallback, batchCallback, args, thisArg) {
    if(!isFunction(batchCallback)) {
        throw new TypeError();
    }

    if(!isFunction(singleCallback)) {
        throw new TypeError();
    }

    if(args == null) {
        throw new TypeError();
    }

    var callback = args.length > 1 ? singleCallback : batchCallback;

    return callback.apply(thisArg, args);
};
