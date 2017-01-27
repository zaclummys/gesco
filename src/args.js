module.exports = function args (args, slice) {
    return Array.prototype.slice.call(args, slice);
};