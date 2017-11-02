export interface Options {
    timeout?: number;
    hot?: boolean;
    discardUndefined?: boolean;
    resolver?: (args: any[]) => string;
}

function simple(args: any[]): string {
    return args.toString();
}

function memoized<T>(fn: (...args: any[]) => T, cache: {[key: string]: T}, cleanup: {[key: string]: number | undefined}, options: Options): (...args: any[]) => T {
    const {timeout = 0, hot = true, discardUndefined = false, resolver = simple} = options;

    return function (...args: any[]) {
        const now = Date.now();
        const key = resolver(args);

        function cleanupCallback() {
            delete cache[key];
            delete cleanup[key];
        }

        if (!(key in cache)) {
            const returnValue = fn.apply(null, arguments) as T;
            if (!discardUndefined || typeof returnValue !== 'undefined') {
                cache[key] = returnValue;
                cleanup[key] = setTimeout(cleanupCallback, timeout);
            }
        } else if (hot) {
            const oldCleanupCallback = cleanup[key];
            if (oldCleanupCallback !== undefined) {
                clearTimeout(oldCleanupCallback);
            }
            cleanup[key] = setTimeout(cleanupCallback, timeout);
        }

        return cache[key];
    };
}

function timedMemoize<T>(a: ((...args: any[]) => T), b?: Options): (...args: any[]) => T;

function timedMemoize<T>(a?: Options): (...args: any[]) => T | undefined;

function timedMemoize<T>(a?: ((...args: any[]) => T) | Options, b?: Options): (...args: any[]) => T | undefined {
    if (typeof a === 'function') {
        // Memoized function value
        const fn = a;
        const options = b || {};
        const cache: {[key: string]: T} = {};
        const cleanup: {[key: string]: number | undefined} = {};
        return memoized(fn, cache, cleanup, options);
    } else if (typeof a === 'object' || arguments.length === 0) {
        // Memoized key-value pairs
        const options = a || {};
        const cache: {[key: string]: T | undefined} = {};
        const cleanup: {[key: string]: number | undefined} = {};
        return memoized((x: any, y: T) => y, cache, cleanup, {...options, resolver: (args) => args[0].toString(), discardUndefined: true});
    } else {
        throw new Error('Invalid arguments');
    }
}

export default timedMemoize;
