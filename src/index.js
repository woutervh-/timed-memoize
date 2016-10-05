export default function timedMemoize(fn, options = {}) {
    const {timeout = 0, hot = true} = options;
    const cachedResult = {};
    const last = {};
    const cleanup = {};

    return function () {
        const now = +Date.now();
        const key = [...arguments];

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
    }
}
