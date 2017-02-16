/*    MISC    */
const _hook = require('./hook');

/*  IS UTILS  */
const isFunction = require('./is-function');
const isObject = require('./is-object');
const isArray = require('./is-array');

/*    PROPERTY UTILS    */
const setProperty = require('./set-property');
const getProperty = require('./get-property');
const deleteProperty = require('./delete-property');

/*    PATH UTILS    */
const toPathArray = require('./to-path-array');
const toPathString = require('./to-path-string');
const isPathMatched = require('./is-path-matched');
const isPathEqual = require('./is-path-equal');

/*    ARGUMENTS UTILS    */
const args = require('./args');
const batch = require('./batch');

/*    ARRAY UTILS    */
const wrap = require('./wrap');

/*    OBJECT UTILS    */
const forOwn = require('./for-own');

function Gesco () {
    var exports = {};

    var data = {}, computers = [], observers = [];

    /*  UTILS   */
    function hook (key, value) {
        _hook(key, value, exports);
    }

    function call (callback) {
        if (!isFunction(callback)) {
            throw new TypeError();
        }

        return callback.apply(exports, args(arguments, 1));
    }


    /*    GET    */
    function get (path) {
        if(arguments.length === 0) {
            return data;
        }

        return getProperty(data, toPathArray(path));
    }


    /*    EMIT    */
    function emitChanges (arr, path, matchFn, excludeFn) {
        path = toPathString(path);

        if(!isArray(arr)) {
            throw new TypeError();
        }

        if(!isFunction(matchFn)) {
            throw new TypeError();
        }

        if(excludeFn && !isFunction(excludeFn)) {
            throw new TypeError();
        }

        arr.forEach(function (item) {
            if(matchFn(item, path)) {
                if(excludeFn && excludeFn(item, path)) {
                    return;
                }

                item.callback();
            }
        });
    }

    function genericMatchFn (item, path) {
        return isPathMatched(path, item.from);
    }

    function emitChangesToComputers (path, excludeFn) {
        emitChanges(computers, path, genericMatchFn, excludeFn);
    }

    function emitChangesToObsevers (path, excludeFn) {
        emitChanges(observers, path, genericMatchFn, excludeFn);
    }
 
    function emit (path, callback, excludeComputerFn, excludeObserverFn) {
        path = wrap(path).map(toPathString);

        var pathValue = path.map(get);

        if(excludeComputerFn && !isFunction(excludeComputerFn)) {
            throw new TypeError('excludeComputerFn must be function');
        }

        if(excludeObserverFn && !isFunction(excludeObserverFn)) {
            throw new TypeError('excludeObserverFn must be function');
        }

        if(callback) {
            if(!isFunction(callback)) {
                throw new TypeError('callback must be function');
            }

            call.apply(null, [callback].concat(pathValue).concat(path));
        }

        path.forEach(function (currentPath) {
            emitChangesToComputers(currentPath, excludeComputerFn);
            emitChangesToObsevers(currentPath, excludeObserverFn);            
        });

        return exports;
    }

    /*    SET    */
    function singleSet (path, value, silent = false) {
        path = toPathString(path);

        var pathArray = toPathArray(path);

        if(hasComputerLinked(path)) {
            throw new Error('computed property must not be set directly');
        }

        setProperty(data, pathArray, value);

        if(silent === false) {
            emit(path);
        }
    }

    function batchSet (obj) {
        if(!isObject(obj)) {
            throw new TypeError('batch method called on non-object');
        }

        forOwn(obj, function (value, path) {
            singleSet(path, value);
        });
    }

    function set () {
        batch(singleSet, batchSet, arguments);
        return exports;
    }


    /*    COMPUTE    */
    function hasComputer (toPath, fromPath) {
        toPath = toPathString(toPath);

        if(fromPath) {
            fromPath = toPathString(fromPath);
        }

        return computers.some(function (computer) {
            if(fromPath) {
                return computer.to === toPath && computer.from === fromPath;
            }
            else {
                return computer.to === toPath;
            }
        });
    }

    function hasComputerLinked (path) {
        path = toPathString(path);

        return computers.some(function (computer) {
            return computer.to === path && computer.from !== path;
        });
    }

    function wrapComputer (toPath, fromPath, computer) {
        toPath = toPathString(toPath);
        fromPath = toPathString(fromPath);

        var pathArray = toPathArray(toPath);

        return {
            to: toPath,
            from: fromPath,
            callback: function () {
                var valueComputed = call(computer, get(fromPath), toPath, fromPath);

                setProperty(data, pathArray, valueComputed, true);

                if(!isPathEqual(toPath, fromPath)) {
                    emit(toPath);
                }
            }
        };        
    }

    function singleCompute (toPath, fromPath, computer) {
        if (arguments.length === 2) {
            computer = fromPath;
            fromPath = toPath;
        }

        toPath = toPathString(toPath);
        fromPath = toPathString(fromPath);

        if(!isFunction(computer)) {
            throw new TypeError('computer must be function');
        }

        if(hasComputer(toPath)) {
            throw new Error('this path has already been computed: ' + toPath);
        }

        computers.push(wrapComputer(toPath, fromPath, computer));
    }

    function batchCompute (obj) {
        if(!isObject(obj)) {
            throw new TypeError('batch method called on non-object');
        }

        forOwn(obj, function (value, fromPath) {
            if(isFunction(value)) {
                singleCompute(fromPath, value);
            }
            else if(isObject(value)) {
                forOwn(value, function (computer, toPath) {
                    singleCompute(toPath, fromPath, computer);
                });
            }
            else {
                throw new TypeError();
            }
        });        
    }

    function compute () {
        batch(singleCompute, batchCompute, arguments);
    }


    /*    OBSERVE    */
    function wrapObserver (path, observer) {
        path = toPathString(path);

        return {
            to: path,
            from: path,
            callback: function () {
                call(observer, get(path), path);
            }
        };
    }

    function pushObserver (path, observer) {
        if(!isFunction(observer)) {
            throw new TypeError('observer must be function');
        }

        observers.push(wrapObserver(path, observer));
    }

    function singleObserve (path, observers) {
        path = toPathString(path);

        wrap(observers).forEach(function (observer) {
            pushObserver(path, observer);
        });
    }

    function batchObserve (obj) {
        if(!isObject(obj)) {
            throw new TypeError('batch method called on non-object');
        }

        forOwn(obj, function (observers, path) {
            singleObserve.apply(null, wrap(path).concat(observers));
        });
    }

    function observe () {
        batch(singleObserve, batchObserve, arguments);
    }


    /*    LINK    */
    function singleLink (toPath, fromPath) {
        toPath = toPathString(toPath);
        fromPath = toPathString(fromPath);

        if (isPathEqual(toPath, fromPath)) {
            throw new Error('equal paths must not be linked');
        }

        if (hasComputer(toPath, fromPath)) {
            throw new Error('these paths has already been linked');
        }

        if (hasComputer(fromPath, toPath)) {
            throw new Error('two-way linking is not allowed');
        }

        singleCompute(toPath, fromPath, function (value) {
            return value;
        });
    }

    function batchLink (obj) {
        if(!isObject(obj)) {
            throw new TypeError('batch method called on non-object');
        }

        forOwn(obj, function (paths, fromPath) {
            wrap(paths).forEach(function (toPath) {
                singleLink(toPath, fromPath);
            });
        });        
    }

    function link () {
        batch(singleLink, batchLink, arguments);

        return exports;
    }


    /*    DELETE    */
    function singleDelete (path, silent = false) {
        deleteProperty(data, toPathArray(path));

        if(silent === false) {
            emit(path);
        }
    }

    function batchDelete (deletes) {
        wrap(deletes).forEach(singleDelete);
    }

    function _delete () {
        batch(singleDelete, batchDelete, arguments);
    }


    /*  EXTRAS  */
    function toString() {
        return JSON.stringify(data);
    }

    hook('get', get);
    hook('emit', emit);
    hook('set', set);
    hook('compute', compute);
    hook('observe', observe);
    hook('delete', _delete);
    hook('link', link);
    hook('toString', toString);

    return exports;
}

Gesco.path = {
    toArray: toPathArray,
    toString: toPathString,
    isEqual: isPathEqual,
    isMatched: isPathMatched
};

module.exports = Gesco;