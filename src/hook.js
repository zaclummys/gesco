var defineProperty = Object.defineProperty;

module.exports = function hook (key, value, obj, configurable) {
    defineProperty(obj, key, {
        value: value,
        configurable: !!configurable
    });
};
