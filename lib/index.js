function simple(args) {
    return args.toString();
}
function memoized(fn, cache, cleanup, options) {
    const { timeout = 0, hot = true, discardUndefined = false, resolver = simple } = options;
    return function (...args) {
        const now = Date.now();
        const key = resolver(args);
        function cleanupCallback() {
            delete cache[key];
            delete cleanup[key];
        }
        if (!(key in cache)) {
            const returnValue = fn.apply(null, arguments);
            if (!discardUndefined || typeof returnValue !== 'undefined') {
                cache[key] = returnValue;
                cleanup[key] = setTimeout(cleanupCallback, timeout);
            }
        }
        else if (hot) {
            const oldCleanupCallback = cleanup[key];
            if (oldCleanupCallback !== undefined) {
                clearTimeout(oldCleanupCallback);
            }
            cleanup[key] = setTimeout(cleanupCallback, timeout);
        }
        return cache[key];
    };
}
function timedMemoize(a, b) {
    if (typeof a === 'function') {
        // Memoized function value
        const fn = a;
        const options = b || {};
        const cache = {};
        const cleanup = {};
        return memoized(fn, cache, cleanup, options);
    }
    else if (typeof a === 'object' || arguments.length === 0) {
        // Memoized key-value pairs
        const options = a || {};
        const cache = {};
        const cleanup = {};
        return memoized((x, y) => y, cache, cleanup, Object.assign({}, options, { resolver: (args) => args[0].toString(), discardUndefined: true }));
    }
    else {
        throw new Error('Invalid arguments');
    }
}
export default timedMemoize;
//# sourceMappingURL=index.js.map