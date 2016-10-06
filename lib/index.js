'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = timedMemoize;
function simple(args) {
    return args;
}

function memoized(fn, cache, last, cleanup, options) {
    var _options$timeout = options.timeout;
    var timeout = _options$timeout === undefined ? 0 : _options$timeout;
    var _options$hot = options.hot;
    var hot = _options$hot === undefined ? true : _options$hot;
    var _options$resolver = options.resolver;
    var resolver = _options$resolver === undefined ? simple : _options$resolver;


    return function () {
        var now = +Date.now();
        var key = resolver([].concat(Array.prototype.slice.call(arguments)));

        function cleanupCallback() {
            delete cache[key];
            delete last[key];
            delete cleanup[key];
        }

        if (!(key in cache)) {
            cache[key] = fn.apply(null, arguments);
            last[key] = now;
            cleanup[key] = setTimeout(cleanupCallback, timeout);
        } else if (hot) {
            clearTimeout(cleanup[key]);
            cleanup[key] = setTimeout(cleanupCallback, timeout);
        }

        return cache[key];
    };
}

function timedMemoize(a, b) {
    if (typeof a === 'function') {
        // Memoized function value
        var fn = a;
        var options = b || {};
        var cache = {};
        var last = {};
        var cleanup = {};
        return memoized(fn, cache, last, cleanup, options);
    } else if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) === 'object' || arguments.length === 0) {
        var _options = a || {};
        var _cache = {};
        var _last = {};
        var _cleanup = {};
        return memoized(function (x, y) {
            return y;
        }, _cache, _last, _cleanup, _extends({}, _options, { resolver: function resolver(args) {
                return args[0];
            } }));
    } else {
        throw new Error('Invalid arguments');
    }
}