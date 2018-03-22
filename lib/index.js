(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["simple-proxy-store"] = factory();
	else
		root["simple-proxy-store"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.index = mod.exports;
  }
})(this, function (exports) {
  (function (global, factory) {
    if (true) {
      !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else if (typeof exports !== "undefined") {
      factory(exports);
    } else {
      var mod = {
        exports: {}
      };
      factory(mod.exports);
      global.index = mod.exports;
    }
  })(this, function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
      value: true
    });

    var _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    }

    var ROOT_SUBSCRIBERS_KEY = 'root';

    /**
     * create store which can be later passed eg. to React provider
     *
     * @public
     * @param store
     * @param middlewares
     */
    var createStore = exports.createStore = function createStore(store) {
      var storeKeys = Object.keys(store);

      var subscribers = _defineProperty({}, ROOT_SUBSCRIBERS_KEY, []);

      var proxyStore = null;

      /**
       * adds subscriber to chanel, if it needed create chanel
       *
       * @param storeKey
       * @param subscriber
       */
      var addSubscriberAndOrCreateSubscribeChanel = function addSubscriberAndOrCreateSubscribeChanel(storeKey) {
        var subscriber = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        if (!(storeKey in subscribers)) subscribers[storeKey] = [];

        if (subscriber) subscribers[storeKey].push(subscriber);
      };

      /**
       * subscribe to chanel. Can be used with es6+ decorator (@) syntax
       *
       * @param storeKeys {array<string>}
       * @returns {function(*=)}
       */
      var subscribe = function subscribe() {
        var storeKeys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        return function (subscriber) {
          if (storeKeys.length) storeKeys.forEach(function (storeKey) {
            return addSubscriberAndOrCreateSubscribeChanel(storeKey, subscriber);
          });else addSubscriberAndOrCreateSubscribeChanel(ROOT_SUBSCRIBERS_KEY, subscriber);
        };
      };

      /**
       * runs subscribers for one chanel
       *
       * @private
       * @param proxy
       * @param key
       * @param value
       * @param storeObjectKey
       * @param oldValue
       */
      var runSubscribers = function runSubscribers(_ref) {
        var proxy = _ref.proxy,
            key = _ref.key,
            value = _ref.value,
            storeObjectKey = _ref.storeObjectKey,
            oldValue = _ref.oldValue;

        var subscribersToRun = subscribers[storeObjectKey];

        if (subscribersToRun && subscribersToRun.length) subscribersToRun.forEach(function (subscriber) {
          return subscriber({ key: key, value: value, oldValue: oldValue, proxy: proxy, storeObjectKey: storeObjectKey });
        });
      };

      /**
       * runs subscribers for root chanel (all store changes)
       *
       * @param args
       */
      var runRootSubscribers = function runRootSubscribers() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        subscribers[ROOT_SUBSCRIBERS_KEY].forEach(function (subscriber) {
          return subscriber(_extends({}, args));
        });
      };

      proxyStore = storeKeys.map(function (storeObjectKey) {
        var target = store[storeObjectKey];

        var proxyDefinition = {
          set: function set(currentTarget, key, value) {
            if (key.startsWith('__')) {
              currentTarget[key] = value;
              return true;
            }

            var data = {
              proxy: proxyStore[storeObjectKey].proxy,
              key: key,
              value: value,
              storeObjectKey: storeObjectKey,
              oldValue: currentTarget[key]
            };

            runSubscribers(data);
            runRootSubscribers(data);

            currentTarget[key] = value;

            return true;
          }
        };

        return _defineProperty({}, storeObjectKey, {
          proxy: new Proxy(target, proxyDefinition),
          target: target
        });
      }).reduce(function (acc, value) {
        return _extends({}, acc, value);
      }, {});

      return {
        get store() {
          return storeKeys.map(function (storeKey) {
            return _defineProperty({}, storeKey, proxyStore[storeKey].proxy);
          }).reduce(function (acc, value) {
            return _extends({}, acc, value);
          }, {});
        },
        subscribe: subscribe
      };
    };
  });
});

/***/ })
/******/ ]);
});