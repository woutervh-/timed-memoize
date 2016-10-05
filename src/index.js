function simple(args) {
    return args;
}

const globalCache = {};
const globalLast = {};
const globalCleanup = {};

function memoized(fn, cache, last, cleanup, options) {
    const {timeout = 0, hot = true, resolver = simple} = options;

    return function () {
        const now = +Date.now();
        const key = resolver([...arguments]);

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

export default function timedMemoize(a, b) {
    if (typeof a === 'function') {
        // Memoized function value
        const fn = a;
        const options = b || {};
        const cache = {};
        const last = {};
        const cleanup = {};
        return memoized(fn, cache, last, cleanup, options);
    } else if (typeof a === 'object' || arguments.length === 0) {
        const options = a || {};
        const cache = {};
        const last = {};
        const cleanup = {};
        return memoized((x, y) => y, cache, last, cleanup, {...options, resolver: args => args[0]});
    } else {
        throw new Error('Invalid arguments');
    }
}
