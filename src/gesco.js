'use strict';

const isFunction = require('./is-function');
const isObject = require('./is-object');

const args = require('./args');

const map = require('./map');
const search = require('./search');

const setProperty = require('./set-property');
const getProperty = require('./get-property');

const getCallbackList = require('./get-callback-list');

const toPathArray = require('./to-path-array');
const toPathString = require('./to-path-string');
const isPathMatched = require('./is-path-matched');
const pushCallback = require('./push-callback');
const callArgument = require('./call-argument');

const hook = require('./hook');

function Gesco () {
    var exports = {};

    var data = {};
    var observers = {};
    var computers = {};

    function getObserversList (path) {
        return getCallbackList(observers, path);
    }

    function getComputersList (path) {
        return getCallbackList(computers, path);
    }

    function call (callback) {
        if(isFunction(callback) === false) {
            throw new TypeError('callback must be function');
        }

        return callback.apply(exports, args(arguments, 1));
    }

    function createComputer (path, observerPath, computer) {
        return function () {
            setProperty(data, toPathArray(path), call(computer, get(observerPath), toPathString(path), toPathString(observerPath)));
        };
    }

    function createObserver (path, observer) {
        return function () {
            call(observer, get(path), toPathString(path));
        };
    }

    function addObserver (path) {
        var observers = args(arguments, 1);

        path = toPathString(path);

        pushCallback(getObserversList(path), observers.map(createObserver.bind(null, path)));
    }

    function addComputer (path, observerPath, computer) {
        path = toPathString(path);

        if (arguments.length === 2) {
            computer = observerPath;
            observerPath = path;
        }

        observerPath = toPathString(observerPath);

        if(isFunction(computer) === false) {
            throw new TypeError('computer must be function');
        }

        pushCallback(getComputersList(observerPath), createComputer(path, observerPath, computer));
    }


    function emitChanges (object, path) {
        var pathArray = toPathArray(path), matchingCallback = isPathMatched.bind(null, pathArray);

        search(object, function (matched) {
            matched.forEach(callArgument);
        }, matchingCallback);
    }

    function emit (path, callback) {
        path = toPathArray(path);

        if (callback) {
            if (isFunction(callback)) {
                call(callback, get(path), path);
            }
            else {
                throw new TypeError('callback must be function');
            }
        }

        emitChanges(computers, path);
        emitChanges(observers, path);
    }

    function get (path) {
        if (path === undefined) {
            return data;
        }

        return getProperty(data, toPathArray(path));
    }

    function set (path, value, observer, silence) {
        if (isObject(path)) {
            return map(path, (value, key) => set(key, value));
        }

        path = toPathArray(path);

        if (observer) {
            addObserver(path, observer);
        }

        setProperty(data, path, value);

        if(silence !== true) {
            emit(path);
        }

        return value;
    }

    function toString () {
        return JSON.stringify(data);
    }

    hook('get', get, exports);
    hook('set', set, exports);
    hook('observe', addObserver, exports);
    hook('compute', addComputer, exports);
    hook('emit', emit, exports);
    hook('toString', toString, exports);

    return exports;
}

module.exports = Gesco;
module.exports.default = Gesco;