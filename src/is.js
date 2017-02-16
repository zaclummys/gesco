var toString = Object.prototype.toString;

module.exports = function is (entry) {
    return toString.call(entry);
};