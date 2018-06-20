export interface Options {
    timeout?: number;
    hot?: boolean;
    discardUndefined?: boolean;
    one?: boolean;
    resolver?: (args: any[]) => string;
}

function simple(args: any[]): string {
    return args.toString();
}

function argsNotEquals(args1: any[], args2: any[]) {
    return args1.some((arg, index) => arg !== args2[index]);
}

function memoized<T, F extends (...args: any[]) => T>(fn: F, cache: { [Key: string]: T }, cleanup: { [Key: string]: number | undefined }, options: Options): F {
    const { timeout = 0, hot = true, discardUndefined = false, resolver = simple, one = false } = options;
    const actualResolver = one ? () => 'key' : resolver;
    let lastArgs: any[] | undefined = undefined;

    return function (...args: any[]) {
        const key = actualResolver(args);

        function cleanupCallback() {
            lastArgs = undefined;
            delete cache[key];
            delete cleanup[key];
        }

        if (!(key in cache) || one && (lastArgs === undefined || argsNotEquals(args, lastArgs))) {
            const returnValue = fn.apply(null, arguments) as T;
            if (!discardUndefined || typeof returnValue !== 'undefined') {
                cache[key] = returnValue;
                if (timeout >= 0) {
                    cleanup[key] = setTimeout(cleanupCallback, timeout);
                }
            }
        } else if (hot) {
            const oldCleanupCallback = cleanup[key];
            if (oldCleanupCallback !== undefined) {
                clearTimeout(oldCleanupCallback);
            }
            if (timeout >= 0) {
                cleanup[key] = setTimeout(cleanupCallback, timeout);
            }
        }

        lastArgs = args;

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
        const cache: { [Key: string]: T } = {};
        const cleanup: { [Key: string]: number | undefined } = {};
        return memoized(fn, cache, cleanup, options);
    } else if (typeof a === 'object' || arguments.length === 0) {
        // Memoized key-value pairs
        const options = a || {};
        const cache: { [Key: string]: T | undefined } = {};
        const cleanup: { [Key: string]: number | undefined } = {};
        return memoized((x: string, y?: T) => y, cache, cleanup, { ...options, resolver: (args) => args[0].toString(), discardUndefined: true });
    } else {
        throw new Error('Invalid arguments');
    }
}

export default timedMemoize;
