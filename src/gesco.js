(function (root, factory) {
  if (typeof exports === 'object' && typeof module === 'object') {
    module.exports = factory()
  } else if (typeof define === 'function' && define.amd) {
    define([], factory)
  } else if (typeof exports === 'object') {
    exports.Gesco = factory()
  } else {
    root.Gesco = factory()
  }
})(this, function () {
	'use strict';

	var DELIMITER = '.';

	function is(entry) {
	    return Object.prototype.toString.call(entry);
	};

	function isArray (entry) {
		return "[object Array]" == is(entry);
	};

	function isObject (entry) {
		return "[object Object]" == is(entry);
	};

	function isFunction (entry) {
	    return "[object Function]" == is(entry);
	};

	function isString (entry) {
	    return "[object String]" == is(entry);
	};

	function arrayLast (array) {
		if (isArray(array) == false) {
	        throw new TypeError("first argument must be array");
	    }

	    return array[array.length -1];
	}

	function forEach(object, callback, scope) {
		if (isObject(object) == false) {
	    	throw new TypeError('first argument must be object');
	    }

	    if (isFunction(callback) == false) {
	    	throw new TypeError('callback must be function');
	    }

	    for(var key in object) {
	    	if(object.hasOwnProperty(key)) {
	    		callback.call(scope, object[key], key, object);
	    	}
	    }
	}

	function map (object, callback, scope) {
		if (isObject(object) == false) {
	    	throw new TypeError('first argument must be object');
	    }

	    if (isFunction(callback) == false) {
	    	throw new TypeError('callback must be function');
	    }

	    var output = {};

	    forEach(object, function (value, key) {
	    	output[key] = callback.call(this, value, key, object);
	    }, scope);

	    return output;
	}

	function hasProperty (object, path) {
		var property, offset;

		if(isObject(object) == false) {
	    	throw new TypeError('first argument must be object');
	    }

	    if(isArray(path) == false) {
	    	throw new TypeError('path must be array');
	    }

	    for(offset = 0; offset < path.length; offset++) {

	    	property = String(path[offset]);
	    	object = Object(object);

	    	if(property in object) {
	    		object = object[property];
	    	}
	    	else {
	    		return false;
	    	}
	    }

	    return true;
	}	

	function getProperty (object, path) {
		var property, offset;

		if(isObject(object) == false) {
	    	throw new TypeError('first argument must be object');
	    }

	    if(isArray(path) == false) {
	    	throw new TypeError('path must be array');
	    }

	    if(hasProperty(object, path) == false) {
	    	return;
	    }

	   	for(offset = 0; offset < path.length; offset++) {
	    	property = String(path[offset]);
	    	object = Object(object);

	    	object = object[property];
	    }

	    return object;
	};

	function setProperty (object, path, value) {
		var parentProperty, basePropertyKey;

		if(isArray(path) == false) {
	    	throw new TypeError('path must be array');
	    }

		if(path.length === 1) {
			parentProperty = object;
			basePropertyKey = path;	
		}	
		else {
			parentProperty = getProperty(object, path.slice(0, -1));
			basePropertyKey = arrayLast(path);			
		}

		if(isObject(parentProperty) == false) {
			throw new Error('top-level property must be object');
		}

		if(basePropertyKey == null) {
			throw new Error('base property key is null');
		}

		parentProperty[basePropertyKey] = value;
	}



	function pathIsValid (path) {
		if (path == null || path.length == 0) {
	        throw new TypeError("path is null");
	    }

	    if(isString(path) == false && isArray(path) == false) {
	   		throw new TypeError('path must be string or array');
	    }

	    if(isArray(path)) {
	    	var isValid = path.every(function (piece) {
	    		return isString(piece) && piece.includes(DELIMITER) === false;
	    	});

	    }
	    else {
	    	var isValid = path.includes(DELIMITER + DELIMITER) === false;
	    }

    	if(isValid) {
    		return true;
    	}
    	else {
    		throw new Error('path error');
    	}
	}

	function pathToArray (path) {
		if(pathIsValid(path)) {
			return isString(path) ? path.split(DELIMITER) : path;
		}
	}

	function pathToString (path) {
		if(pathIsValid(path)) {
			return isArray(path) ? path.join(DELIMITER) : path;
		}			
	}

	function isPathMatched (pathBase, pathCheck) {
		var pathBase = pathToArray(pathBase);
		var pathCheck = pathToArray(pathCheck);

	    return pathBase.every(function (piece, index) {
	    	return piece === pathCheck[index];
	    });
	};

	function search (object, matchingCallback, checkingCallback) {
		if (isObject(object) == false) {
	    	throw new TypeError('first argument must be object');
	    }

	   	if (isFunction(matchingCallback) == false) {
	    	throw new TypeError('matching callback must be function');
	    }

	    if (isFunction(checkingCallback) == false) {
	    	throw new TypeError('checking callback must be function');
	    }

		forEach(object, function (value, key) {
			if(checkingCallback(key)) {
				matchingCallback(value, key, object);
			}
		});
	}

	function args (args, slice) {
		return Array.prototype.slice.call(args, slice);
	}

	function Gesco () {
		var exports = {};

		var data = {};
		var observers = {};

		function callback (fn) {
			return fn.apply(exports, args(arguments, 1));
		}

		function createComputer (path, observerPath, computer) {
			return function (value) {
				setProperty(data, pathToArray(path), callback(computer, value, pathToString(path), pathToString(observerPath)));				
			};
		}

		function addComputer (path, observerPath, computer) {
			var path, pathArray, observerPath, computer;

			if(arguments.length === 2) {
				computer = observerPath;
				observerPath = path;
			}

			path = pathToString(path);
			observerPath = pathToString(observerPath);

			if(!isFunction(computer)) {
				throw new TypeError('computer must be function');
			}

			getObserversList(observerPath).push(createComputer(path, observerPath, computer));
		}

		function hasObserversList (path) {
			return pathToString(path) in observers;
		}

		function getObserversList (path) {
			var path = pathToString(path);

			if(hasObserversList(path) == false) {
				observers[path] = [];
			}

			return observers[path];
		}

		function addObserver (path) {
			var path = pathToString(path);
			var observers = args(arguments, 1);
			var observersList = getObserversList(path);

			observers.forEach(function (observer) {
				if(isFunction(observer)) {
					observersList.push(observer);
				}
				else {
					throw new TypeError('observer must be function');					
				}
			});
		}

		function emitChanges (path) {
			var pathArray = pathToArray(path);

			search(observers, function (observersMatched, observersMatchedPath) {

				observersMatched.forEach(function (observer) {
					callback(observer, get(observersMatchedPath), observersMatchedPath);
				});
			}, isPathMatched.bind(null, pathArray));
		}

		/* MAIN */
		function emit (path, emitCallback) {
			if(emitCallback) {
				if(isFunction(emitCallback)) {
					callback(emitCallback, get(path));

					emitChanges(path);
				}
				else {
					throw new TypeError('callback must be function');
				}
			}
			else {
				emitChanges(path);
			}
		}

		function get (path) {
			if(path === undefined) {
				return data;
			}

			return getProperty(data, pathToArray(path));
		}

		function set (path, value, observer) {
			if(isObject(path)) {
				return map(path, function (value, key) {
					return set(key, value);
				});
			}

			var path = pathToArray(path);
			
			if(observer) {
				addObserver(path, observer);
			}

			setProperty(data, path, value);

			emitChanges(path);

			return value;
		}

		function toString () {
			return JSON.stringify(data);
		}

		exports.get = get;
		exports.set = set;
		exports.observe = addObserver;
		exports.compute = addComputer;
		exports.emit = emit;
		exports.toString = toString;

		return exports;
	}

	return Gesco;
});