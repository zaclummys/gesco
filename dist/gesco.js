/* gesco v1.1 | (c) 2017 by Isaac Ferreira */
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

	var isFunction = __webpack_require__(2);
	var isObject = __webpack_require__(4);

	var args = __webpack_require__(5);

	var map = __webpack_require__(6);
	var search = __webpack_require__(8);

	var setProperty = __webpack_require__(9);
	var getProperty = __webpack_require__(11);

	var getCallbackList = __webpack_require__(14);

	var toPathArray = __webpack_require__(19);
	var toPathString = __webpack_require__(15);
	var isPathMatched = __webpack_require__(20);
	var pushCallback = __webpack_require__(21);
	var callArgument = __webpack_require__(23);

	var hook = __webpack_require__(24);

	function Gesco() {
	    var exports = {};

	    var data = {};
	    var observers = {};
	    var computers = {};

	    function getObserversList(path) {
	        return getCallbackList(observers, path);
	    }

	    function getComputersList(path) {
	        return getCallbackList(computers, path);
	    }

	    function call(callback) {
	        if (isFunction(callback) === false) {
	            throw new TypeError('callback must be function');
	        }

	        return callback.apply(exports, args(arguments, 1));
	    }

	    function createComputer(path, observerPath, computer) {
	        return function () {
	            setProperty(data, toPathArray(path), call(computer, get(observerPath), toPathString(path), toPathString(observerPath)));
	        };
	    }

	    function createObserver(path, observer) {
	        return function () {
	            call(observer, get(path), toPathString(path));
	        };
	    }

	    function addObserver(path) {
	        var observers = args(arguments, 1);

	        path = toPathString(path);

	        pushCallback(getObserversList(path), observers.map(createObserver.bind(null, path)));
	    }

	    function addComputer(path, observerPath, computer) {
	        path = toPathString(path);

	        if (arguments.length === 2) {
	            computer = observerPath;
	            observerPath = path;
	        }

	        observerPath = toPathString(observerPath);

	        if (isFunction(computer) === false) {
	            throw new TypeError('computer must be function');
	        }

	        pushCallback(getComputersList(observerPath), createComputer(path, observerPath, computer));
	    }

	    function emitChanges(object, path) {
	        var pathArray = toPathArray(path),
	            matchingCallback = isPathMatched.bind(null, pathArray);

	        search(object, function (matched) {
	            matched.forEach(callArgument);
	        }, matchingCallback);
	    }

	    function emit(path, callback) {
	        path = toPathArray(path);

	        if (callback) {
	            if (isFunction(callback)) {
	                call(callback, get(path), path);
	            } else {
	                throw new TypeError('callback must be function');
	            }
	        }

	        emitChanges(computers, path);
	        emitChanges(observers, path);
	    }

	    function get(path) {
	        if (path === undefined) {
	            return data;
	        }

	        return getProperty(data, toPathArray(path));
	    }

	    function set(path, value, observer, silence) {
	        if (isObject(path)) {
	            return map(path, function (value, key) {
	                return set(key, value);
	            });
	        }

	        path = toPathArray(path);

	        if (observer) {
	            addObserver(path, observer);
	        }

	        setProperty(data, path, value);

	        if (silence !== true) {
	            emit(path);
	        }

	        return value;
	    }

	    function toString() {
	        return JSON.stringify(data);
	    }

	    hook('get', get, exports);
	    hook('set', set, exports);
	    hook('observe', addObserver, exports);
	    hook('compute', addComputer, exports);
	    hook('emit', emit, exports);
	    hook('toString', toString, exports);

	    hook('computers', computers, exports);

	    return exports;
	}

	module.exports = Gesco;
	module.exports.default = Gesco;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var is = __webpack_require__(3);

	module.exports = function isFunction(entry) {
	    return is(entry) === '[object Function]';
	};

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function is(entry) {
	    return Object.prototype.toString.call(entry);
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var is = __webpack_require__(3);

	module.exports = function isObject(entry) {
	    return is(entry) === '[object Object]';
	};

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function args(args, slice) {
	    return Array.prototype.slice.call(args, slice);
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isObject = __webpack_require__(4);
	var isFunction = __webpack_require__(2);
	var forEach = __webpack_require__(7);

	module.exports = function map(object, callback, scope) {
	    if (isObject(object) === false) {
	        throw new TypeError('first argument must be object');
	    }

	    if (isFunction(callback) === false) {
	        throw new TypeError('callback must be function');
	    }

	    var output = {};

	    forEach(object, function (value, key) {
	        output[key] = callback.call(this, value, key, object);
	    }, scope);

	    return output;
	};

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isObject = __webpack_require__(4);
	var isFunction = __webpack_require__(2);

	module.exports = function forEach(object, callback, scope) {
	    if (isObject(object) === false) {
	        throw new TypeError('first argument must be object');
	    }

	    if (isFunction(callback) === false) {
	        throw new TypeError('callback must be function');
	    }

	    for (var key in object) {
	        if (object.hasOwnProperty(key)) {
	            callback.call(scope, object[key], key, object);
	        }
	    }
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isObject = __webpack_require__(4);
	var isFunction = __webpack_require__(2);
	var forEach = __webpack_require__(7);

	module.exports = function search(object, matchingCallback, checkingCallback) {
	    if (isObject(object) === false) {
	        throw new TypeError('first argument must be object');
	    }

	    if (isFunction(matchingCallback) === false) {
	        throw new TypeError('matching callback must be function');
	    }

	    if (isFunction(checkingCallback) === false) {
	        throw new TypeError('checking callback must be function');
	    }

	    forEach(object, function (value, key) {
	        if (checkingCallback(key)) {
	            matchingCallback(value, key, object);
	        }
	    });
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isObject = __webpack_require__(4);
	var isArray = __webpack_require__(10);
	var getProperty = __webpack_require__(11);
	var arrayLast = __webpack_require__(13);

	module.exports = function setProperty(object, path, value) {
	    var parentProperty, basePropertyKey;

	    if (isArray(path) === false) {
	        throw new TypeError('path must be array');
	    }

	    if (path.length === 1) {
	        parentProperty = object;
	        basePropertyKey = path[0];
	    } else {
	        parentProperty = getProperty(object, path.slice(0, -1));
	        basePropertyKey = arrayLast(path);
	    }

	    if (isObject(parentProperty) === false) {
	        throw new Error('top-level property must be object');
	    }

	    if (basePropertyKey == null) {
	        throw new Error('base property key is null');
	    }

	    parentProperty[basePropertyKey] = value;
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var is = __webpack_require__(3);
	module.exports = function isArray(entry) {
	    return is(entry) === '[object Array]';
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isObject = __webpack_require__(4);
	var isArray = __webpack_require__(10);
	var hasProperty = __webpack_require__(12);

	module.exports = function getProperty(object, path) {
	    var property, offset;

	    if (isObject(object) === false) {
	        throw new TypeError('first argument must be object');
	    }

	    if (isArray(path) === false) {
	        throw new TypeError('path must be array');
	    }

	    if (hasProperty(object, path) === false) {
	        return;
	    }

	    for (offset = 0; offset < path.length; offset++) {
	        property = String(path[offset]);
	        object = Object(object);

	        object = object[property];
	    }

	    return object;
	};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isObject = __webpack_require__(4);
	var isArray = __webpack_require__(10);

	module.exports = function hasProperty(object, path) {
	    var property, offset;

	    if (isObject(object) === false) {
	        throw new TypeError('first argument must be object');
	    }

	    if (isArray(path) === false) {
	        throw new TypeError('path must be array');
	    }

	    for (offset = 0; offset < path.length; offset++) {
	        property = String(path[offset]);
	        object = Object(object);

	        if (property in object) {
	            object = object[property];
	        } else {
	            return false;
	        }
	    }

	    return true;
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isArray = __webpack_require__(10);

	module.exports = function arrayLast(array) {
	    if (isArray(array) === false) {
	        throw new TypeError('first argument must be array');
	    }

	    return array[array.length - 1];
	};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var setProperty = __webpack_require__(9);
	var getProperty = __webpack_require__(11);
	var hasProperty = __webpack_require__(12);
	var toPathString = __webpack_require__(15);

	module.exports = function getCallbackList(object, path) {
	    path = [toPathString(path)];

	    if (hasProperty(object, path) === false) {
	        setProperty(object, path, []);
	    }

	    return getProperty(object, path);
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var DELIMITER = __webpack_require__(16);
	var isArray = __webpack_require__(10);
	var isPathValid = __webpack_require__(17);

	module.exports = function toPathString(path) {
	    if (isPathValid(path)) {
	        return isArray(path) ? path.join(DELIMITER) : path;
	    }
	};

/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict';

	module.exports = '.';

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var DELIMITER = __webpack_require__(16);
	var isString = __webpack_require__(18);
	var isArray = __webpack_require__(10);

	module.exports = function isPathValid(path) {
	    var isValid;

	    if (path == null || path.length === 0) {
	        throw new TypeError('path is null');
	    }

	    if (isArray(path)) {
	        isValid = path.every(function (piece) {
	            return isString(piece) && piece.includes(DELIMITER) === false;
	        });
	    } else if (isString(path)) {
	        isValid = path.includes(DELIMITER + DELIMITER) === false;
	    } else {
	        throw new TypeError('path must be string or array');
	    }

	    if (isValid) {
	        return true;
	    } else {
	        throw new Error('path error');
	    }
	};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var is = __webpack_require__(3);

	module.exports = function isString(entry) {
	    return is(entry) === '[object String]';
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var DELIMITER = __webpack_require__(16);
	var isString = __webpack_require__(18);
	var isPathValid = __webpack_require__(17);

	module.exports = function toPathArray(path) {
	    if (isPathValid(path)) {
	        return isString(path) ? path.split(DELIMITER) : path;
	    }
	};

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var toPathArray = __webpack_require__(19);

	module.exports = function isPathMatched(pathBase, pathCheck) {
	    pathBase = toPathArray(pathBase);
	    pathCheck = toPathArray(pathCheck);

	    return pathBase.every(function (piece, index) {
	        return piece === pathCheck[index];
	    });
	};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isArray = __webpack_require__(10);
	var isFunction = __webpack_require__(2);
	var wrap = __webpack_require__(22);

	module.exports = function pushCallback(list, callbacks) {
	    if (isArray(list) === false) {
	        throw new TypeError('list must be array');
	    }

	    wrap(callbacks).forEach(function (callback) {
	        if (isFunction(callback)) {
	            list.push(callback);
	        } else {
	            throw new TypeError('callback must be function');
	        }
	    });
	};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isArray = __webpack_require__(10);

	module.exports = function (entry) {
	    return isArray(entry) ? entry : [entry];
	};

/***/ },
/* 23 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function callArgument(argument) {
	    argument();
	};

/***/ },
/* 24 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function hook(key, value, exports) {
	    Object.defineProperty(exports, key, {
	        value: value
	    });
	};

/***/ }
/******/ ])
});
;