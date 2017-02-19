var slice = Array.prototype.slice;

module.exports = function args (args, begin) {
    return slice.call(args, begin);
};
