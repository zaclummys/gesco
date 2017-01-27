module.exports = function hook (key, value, exports) {
    Object.defineProperty(exports, key, {
        value: value
    });
};