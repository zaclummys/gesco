/* gesco v1.2.2 | (c) 2017 by Isaac Ferreira */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Gesco"] = factory();
	else
		root["Gesco"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(1);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/*    MISC    */
	var _hook = __webpack_require__(2);

	/*  IS UTILS  */
	var isFunction = __webpack_require__(3);
	var isObject = __webpack_require__(5);
	var isBoolean = __webpack_require__(6);

	/*    PROPERTY UTILS    */
	var setProperty = __webpack_require__(7);
	var getProperty = __webpack_require__(11);
	var deleteProperty = __webpack_require__(12);

	/*    PATH UTILS    */
	var toPathArray = __webpack_require__(13);
	var toPathString = __webpack_require__(17);
	var isPathMatched = __webpack_require__(18);
	var isPathEqual = __webpack_require__(19);

	/*    ARGUMENTS UTILS    */
	var args = __webpack_require__(20);
	var batch = __webpack_require__(21);

	/*    ARRAY UTILS    */
	var wrap = __webpack_require__(22);
	var search = __webpack_require__(23);

	/*    OBJECT UTILS    */
	var forOwn = __webpack_require__(24);

	function Gesco() {
	    var exports = {};

	    var data = {},
	        computers = [],
	        observers = [];

	    /*  UTILS   */
	    function hook(key, value) {
	        _hook(key, value, exports);
	    }

	    function call(callback) {
	        if (!isFunction(callback)) {
	            throw new TypeError();
	        }

	        return callback.apply(exports, args(arguments, 1));
	    }

	    /*    GET    */
	    function get(path) {
	        if (arguments.length === 0) {
	            return data;
	        }

	        return getProperty(data, toPathArray(path));
	    }

	    /*    EMIT    */
	    function emitChanges(arr, path, excludeFn) {
	        search(arr,
	        // successFn
	        function (item) {
	            item.callback();
	        },
	        // matchFn
	        function (item) {
	            return isPathMatched(path, item.from);
	        }, excludeFn);
	    }

	    function emitChangesToComputers(path, excludeFn) {
	        emitChanges(computers, path, excludeFn);
	    }

	    function emitChangesToObsevers(path, excludeFn) {
	        emitChanges(observers, path, excludeFn);
	    }

	    function singleEmit(path, callback, excludeComputerFn, excludeObserverFn) {
	        path = toPathString(path);

	        if (excludeComputerFn && !isFunction(excludeComputerFn)) {
	            throw new TypeError('excludeComputerFn must be function');
	        }

	        if (excludeObserverFn && !isFunction(excludeObserverFn)) {
	            throw new TypeError('excludeObserverFn must be function');
	        }

	        if (callback) {
	            if (!isFunction(callback)) {
	                throw new TypeError('callback must be function');
	            }

	            call(callback, get(path), path);
	        }

	        emitChangesToComputers(path, excludeComputerFn);
	        emitChangesToObsevers(path, excludeObserverFn);
	    }

	    function batchEmit(obj) {
	        if (!isObject(obj)) {
	            throw new TypeError('batch method called on non-object');
	        }

	        forOwn(obj, function (callback, path) {
	            var callable = isFunction(callback);

	            if (callback === true || callable) {
	                singleEmit(path, callable && callback);
	            }
	        });
	    }

	    function emit() {
	        batch(singleEmit, batchEmit, arguments);

	        return exports;
	    }

	    /*    SET    */
	    function singleSet(path, value) {
	        var silent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

	        if (!isBoolean(silent)) {
	            throw new TypeError('silent must be boolean');
	        }

	        path = toPathString(path);

	        var pathArray = toPathArray(path);

	        if (hasComputerLinked(path)) {
	            throw new Error('computed property must not be set directly');
	        }

	        setProperty(data, pathArray, value);

	        if (silent !== true) {
	            emit(path);
	        }
	    }

	    function batchSet(obj) {
	        if (!isObject(obj)) {
	            throw new TypeError('batch method called on non-object');
	        }

	        forOwn(obj, function (value, path) {
	            singleSet(path, value);
	        });
	    }

	    function set() {
	        batch(singleSet, batchSet, arguments);

	        return exports;
	    }

	    /*    COMPUTE    */
	    function hasComputer(toPath, fromPath) {
	        toPath = toPathString(toPath);

	        if (fromPath) {
	            fromPath = toPathString(fromPath);
	        }

	        return computers.some(function (computer) {
	            if (fromPath) {
	                return computer.to === toPath && computer.from === fromPath;
	            } else {
	                return computer.to === toPath;
	            }
	        });
	    }

	    function hasComputerLinked(path) {
	        path = toPathString(path);

	        return computers.some(function (computer) {
	            return computer.to === path && computer.from !== path;
	        });
	    }

	    function wrapComputer(toPath, fromPath, computer) {
	        toPath = toPathString(toPath);
	        fromPath = toPathString(fromPath);

	        var pathArray = toPathArray(toPath);

	        return {
	            to: toPath,
	            from: fromPath,
	            callback: function callback() {
	                var valueComputed = call(computer, get(fromPath), toPath, fromPath);

	                setProperty(data, pathArray, valueComputed, true);

	                if (!isPathEqual(toPath, fromPath)) {
	                    emit(toPath);
	                }
	            }
	        };
	    }

	    function singleCompute(toPath, fromPath, computer) {
	        if (arguments.length === 2) {
	            computer = fromPath;
	            fromPath = toPath;
	        }

	        toPath = toPathString(toPath);
	        fromPath = toPathString(fromPath);

	        if (!isFunction(computer)) {
	            throw new TypeError('computer must be function');
	        }

	        if (hasComputer(toPath)) {
	            throw new Error('this path has already been computed: ' + toPath);
	        }

	        computers.push(wrapComputer(toPath, fromPath, computer));
	    }

	    function batchCompute(obj) {
	        if (!isObject(obj)) {
	            throw new TypeError('batch method called on non-object');
	        }

	        forOwn(obj, function (value, fromPath) {
	            if (isFunction(value)) {
	                singleCompute(fromPath, value);
	            } else if (isObject(value)) {
	                forOwn(value, function (computer, toPath) {
	                    singleCompute(toPath, fromPath, computer);
	                });
	            } else {
	                throw new TypeError();
	            }
	        });
	    }

	    function compute() {
	        batch(singleCompute, batchCompute, arguments);

	        return exports;
	    }

	    /*    OBSERVE    */
	    function wrapObserver(path, observer) {
	        path = toPathString(path);

	        return {
	            to: path,
	            from: path,
	            callback: function callback() {
	                call(observer, get(path), path);
	            }
	        };
	    }

	    function pushObserver(path, observer) {
	        if (!isFunction(observer)) {
	            throw new TypeError('observer must be function');
	        }

	        observers.push(wrapObserver(path, observer));
	    }

	    function singleObserve(path, observers) {
	        path = toPathString(path);

	        wrap(observers).forEach(function (observer) {
	            pushObserver(path, observer);
	        });
	    }

	    function batchObserve(obj) {
	        if (!isObject(obj)) {
	            throw new TypeError('batch method called on non-object');
	        }

	        forOwn(obj, function (observers, path) {
	            singleObserve.apply(null, wrap(path).concat(observers));
	        });
	    }

	    function observe() {
	        batch(singleObserve, batchObserve, arguments);

	        return exports;
	    }

	    /*    LINK    */
	    function singleLink(toPath, fromPath) {
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

	    function batchLink(obj) {
	        if (!isObject(obj)) {
	            throw new TypeError('batch method called on non-object');
	        }

	        forOwn(obj, function (paths, fromPath) {
	            wrap(paths).forEach(function (toPath) {
	                singleLink(toPath, fromPath);
	            });
	        });
	    }

	    function link() {
	        batch(singleLink, batchLink, arguments);

	        return exports;
	    }

	    /*    DELETE    */
	    function singleDelete(path) {
	        var silent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

	        if (!isBoolean(silent)) {
	            throw new TypeError('silent must be boolean');
	        }

	        deleteProperty(data, toPathArray(path));

	        if (silent !== true) {
	            emit(path);
	        }
	    }

	    function batchDelete(obj) {
	        if (!isObject(obj)) {
	            throw new TypeError('batch method called on non-object');
	        }

	        forOwn(obj, function (silent, path) {
	            singleDelete(path, silent);
	        });
	    }

	    function _delete() {
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

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	var defineProperty = Object.defineProperty;

	module.exports = function hook(key, value, obj, configurable) {
	    defineProperty(obj, key, {
	        value: value,
	        configurable: !!configurable
	    });
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var is = __webpack_require__(4);

	module.exports = function isFunction(entry) {
	    return is(entry) === '[object Function]';
	};

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

	var toString = Object.prototype.toString;

	module.exports = function is(entry) {
	    return toString.call(entry);
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var is = __webpack_require__(4);

	module.exports = function isObject(entry) {
	    return is(entry) === '[object Object]';
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var is = __webpack_require__(4);

	module.exports = function isBoolean(entry) {
	    return is(entry) == '[object Boolean]';
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var property = __webpack_require__(8);

	module.exports = function setProperty(object, path, value, ignoreError) {
	    property(object, path, function (parentProperty, basePropertyName) {
	        if (parentProperty instanceof Object) {
	            parentProperty[basePropertyName] = value;
	        } else {
	            if (!ignoreError) {
	                throw new TypeError('top-level property must be object');
	            }
	        }
	    });
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isObject = __webpack_require__(5);
	var isArray = __webpack_require__(9);
	var arrayLast = __webpack_require__(10);
	var isFunction = __webpack_require__(3);

	function pick(object, path) {
	    if (!isArray(path)) {
	        throw new TypeError();
	    }

	    var pathLength = path.length,
	        property,
	        offset;

	    for (offset = 0; offset < pathLength; offset++) {
	        property = path[offset];

	        if (object && property in object) {
	            object = object[property];
	        } else {
	            return undefined;
	        }
	    }

	    return object;
	}

	module.exports = function property(object, path, callback) {
	    var parentProperty, basePropertyName;

	    if (!isObject(object)) {
	        throw new TypeError('first argument must be object');
	    }

	    if (!isArray(path)) {
	        throw new TypeError('path must be array');
	    }

	    if (!isFunction(callback)) {
	        throw new TypeError('callback must be function');
	    }

	    if (path.length === 1) {
	        parentProperty = object;
	        basePropertyName = path[0];
	    } else {
	        parentProperty = pick(object, path.slice(0, -1));
	        basePropertyName = arrayLast(path);
	    }

	    if (basePropertyName == null) {
	        throw new TypeError('base property name must not be null');
	    }

	    return callback(parentProperty, basePropertyName);
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var is = __webpack_require__(4);

	module.exports = function isArray(entry) {
	    return is(entry) === '[object Array]';
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isArray = __webpack_require__(9);

	module.exports = function arrayLast(arr) {
	    if (!isArray(arr)) {
	        throw new TypeError();
	    }

	    return arr[arr.length - 1];
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var property = __webpack_require__(8);

	module.exports = function getProperty(obj, path) {
	    return property(obj, path, function (parentProperty, basePropertyName) {
	        if (parentProperty instanceof Object) {
	            return parentProperty[basePropertyName];
	        } else {
	            return;
	        }
	    });
	};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var property = __webpack_require__(8);

	module.exports = function deleteProperty(obj, path) {
	    property(obj, path, function (parentProperty, basePropertyName) {
	        delete parentProperty[basePropertyName];
	    });
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var DELIMITER = __webpack_require__(14);
	var isString = __webpack_require__(15);
	var isPathValid = __webpack_require__(16);

	module.exports = function toPathArray(path) {
	    if (isPathValid(path)) {
	        return isString(path) ? path.split(DELIMITER) : path;
	    }
	};

/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';

	module.exports = '.';

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var is = __webpack_require__(4);

	module.exports = function isString(entry) {
	    return is(entry) === '[object String]';
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var DELIMITER = __webpack_require__(14);
	var isString = __webpack_require__(15);
	var isArray = __webpack_require__(9);

	var WHITESPACE = /\s/g;

	function isPathValidString(str, isPiece) {
	    if (!isString(str)) {
	        throw new TypeError('path is not valid');
	    }

	    if (WHITESPACE.test(str) === true) {
	        throw new Error('path must no have whitespaces');
	    }

	    return str.includes(isPiece ? DELIMITER : DELIMITER + DELIMITER) === false;
	}

	module.exports = function isPathValid(path) {
	    var isValid;

	    if (path == null || path.length === 0) {
	        throw new TypeError('path must not be null');
	    }

	    if (isString(path)) {
	        path = path.split(DELIMITER);
	    }

	    if (isArray(path)) {
	        isValid = path.every(function (piece) {
	            return piece && isPathValidString(piece, true);
	        });
	    }

	    if (isValid) {
	        return true;
	    } else {
	        throw new Error('path error');
	    }
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var DELIMITER = __webpack_require__(14);
	var isArray = __webpack_require__(9);
	var isPathValid = __webpack_require__(16);

	module.exports = function toPathString(path) {
	    if (isPathValid(path)) {
	        return isArray(path) ? path.join(DELIMITER) : path;
	    }
	};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var toPathArray = __webpack_require__(13);

	module.exports = function isPathMatched(pathOne, pathTwo) {
	    pathOne = toPathArray(pathOne);
	    pathTwo = toPathArray(pathTwo);

	    return pathOne.every(function (piece, index) {
	        return piece === pathTwo[index];
	    });
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var toPathString = __webpack_require__(17);

	module.exports = function isPathEqual(pathOne, pathTwo) {
	    return toPathString(pathOne) === toPathString(pathTwo);
	};

/***/ },
/* 20 */
/***/ function(module, exports) {

	"use strict";

	var slice = Array.prototype.slice;

	module.exports = function args(args, begin) {
	    return slice.call(args, begin);
	};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isFunction = __webpack_require__(3);
	var isObject = __webpack_require__(5);

	module.exports = function batch(singleCallback, batchCallback, args, thisArg) {
	    if (!isFunction(batchCallback)) {
	        throw new TypeError();
	    }

	    if (!isFunction(singleCallback)) {
	        throw new TypeError();
	    }

	    if (args == null || args.length === 0) {
	        throw new Error('no arguments');
	    }

	    var callback = args.length === 1 && isObject(args[0]) ? batchCallback : singleCallback;

	    return callback.apply(thisArg, args);
	};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isArray = __webpack_require__(9);

	module.exports = function wrap(entry) {
	    if (entry == null) {
	        return [];
	    }

	    return isArray(entry) ? entry : [entry];
	};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isFunction = __webpack_require__(3);
	var isArray = __webpack_require__(9);

	module.exports = function search(arr, successFn, matchFn, excludeFn) {
	    if (!isArray(arr)) {
	        throw new TypeError();
	    }

	    if (!isFunction(successFn)) {
	        throw new TypeError();
	    }

	    if (!isFunction(matchFn)) {
	        throw new TypeError();
	    }

	    var hasExcludeFn = !!excludeFn;

	    if (hasExcludeFn && !isFunction(excludeFn)) {
	        throw new TypeError();
	    }

	    arr.forEach(function (item) {
	        if (matchFn(item) && (hasExcludeFn && excludeFn(item)) === false) {
	            successFn(item);
	        }
	    });
	};

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var forIn = __webpack_require__(25);
	var has = __webpack_require__(26);
	var isFunction = __webpack_require__(3);

	module.exports = function forOwn(object, callback, thisArg) {
	    if (!isFunction(callback)) {
	        throw new TypeError('callback must be function');
	    }

	    forIn(object, function (value, key) {
	        if (has(object, key)) {
	            return callback.call(this, value, key, object);
	        }
	    }, thisArg);
	};

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isFunction = __webpack_require__(3);

	module.exports = function forIn(object, callback, thisArg) {
	    if (!isFunction(callback)) {
	        throw new TypeError('callback must be function');
	    }

	    for (var key in object) {
	        if (callback.call(thisArg, object[key], key, object) === false) {
	            break;
	        }
	    }
	};

/***/ },
/* 26 */
/***/ function(module, exports) {

	"use strict";

	var hasOwnProperty = Object.prototype.hasOwnProperty;

	module.exports = function (object, property) {
	    return hasOwnProperty.call(object, property);
	};

/***/ }
/******/ ])
});
;
