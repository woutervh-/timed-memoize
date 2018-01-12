export interface Options {
    timeout?: number;
    hot?: boolean;
    discardUndefined?: boolean;
    resolver?: (args: any[]) => string;
}

function simple(args: any[]): string {
    return args.toString();
}

function memoized<T, F extends (...args: any[]) => T>(fn: F, cache: {[key: string]: T}, cleanup: {[key: string]: number | undefined}, options: Options): F {
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
    } as F;
}

function timedMemoize<T, F extends (...args: any[]) => T>(func: F, options?: Options): F;

function timedMemoize<T>(options?: Options): (key: string, value?: T) => T | undefined;

function timedMemoize<T, F extends (...args: any[]) => T>(a?: F | Options, b?: Options): F | ((key: string, value?: T) => T | undefined) {
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
        return memoized((x: string, y?: T) => y, cache, cleanup, {...options, resolver: (args) => args[0].toString(), discardUndefined: true});
    } else {
        throw new Error('Invalid arguments');
    }
}

export default timedMemoize;
