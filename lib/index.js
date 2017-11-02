var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
function simple(args) {
    return args.toString();
}
function memoized(fn, cache, cleanup, options) {
    var _a = options.timeout, timeout = _a === void 0 ? 0 : _a, _b = options.hot, hot = _b === void 0 ? true : _b, _c = options.discardUndefined, discardUndefined = _c === void 0 ? false : _c, _d = options.resolver, resolver = _d === void 0 ? simple : _d;
    return function () {
        var now = Date.now();
        var key = resolver(Array.from(arguments));
        function cleanupCallback() {
            delete cache[key];
            delete cleanup[key];
        }
        if (!(key in cache)) {
            var returnValue = fn.apply(null, arguments);
            if (!discardUndefined || typeof returnValue !== 'undefined') {
                cache[key] = returnValue;
                cleanup[key] = setTimeout(cleanupCallback, timeout);
            }
        }
        else if (hot) {
            clearTimeout(cleanup[key]);
            cleanup[key] = setTimeout(cleanupCallback, timeout);
        }
        return cache[key];
    };
}
export default function timedMemoize(a, b) {
    if (typeof a === 'function') {
        // Memoized function value
        var fn = a;
        var options = b || {};
        var cache = {};
        var cleanup = {};
        return memoized(fn, cache, cleanup, options);
    }
    else if (typeof a === 'object' || arguments.length === 0) {
        // Memoized key-value pairs
        var options = a || {};
        var cache = {};
        var cleanup = {};
        return memoized(function (x, y) { return y; }, cache, cleanup, __assign({}, options, { resolver: function (args) { return args[0].toString(); }, discardUndefined: true }));
    }
    else {
        throw new Error('Invalid arguments');
    }
}
//# sourceMappingURL=index.js.map