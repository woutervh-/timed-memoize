"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = timedMemoize;
function timedMemoize(fn) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var _options$timeout = options.timeout;
    var timeout = _options$timeout === undefined ? 0 : _options$timeout;
    var _options$hot = options.hot;
    var hot = _options$hot === undefined ? true : _options$hot;

    var cachedResult = {};
    var last = {};
    var cleanup = {};

    return function () {
        var now = +Date.now();
        var key = [].concat(Array.prototype.slice.call(arguments));

        function cleanupCallback() {
            delete cachedResult[key];
            delete last[key];
            delete cleanup[key];
        }

        if (!(key in cachedResult)) {
            cachedResult[key] = fn.apply(null, arguments);
            last[key] = now;
            cleanup[key] = setTimeout(cleanupCallback, timeout);
        } else if (hot) {
            clearTimeout(cleanup[key]);
            cleanup[key] = setTimeout(cleanupCallback, timeout);
        }

        return cachedResult[key];
    };
}