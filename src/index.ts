export interface Options {
    timeout?: number;
    hot?: boolean;
    discardUndefined?: boolean;
    resolver?: (args: any[]) => string;
}

function simple(args: any[]): string {
    return args.toString();
}

function memoized<T>(fn: (...args: any[]) => T, cache: {[key: string]: T}, cleanup: {[key: string]: number}, options: Options): () => T {
    const {timeout = 0, hot = true, discardUndefined = false, resolver = simple} = options;

    return function () {
        const now = Date.now();
        const key = resolver(Array.from(arguments));

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
            clearTimeout(cleanup[key]);
            cleanup[key] = setTimeout(cleanupCallback, timeout);
        }

        return cache[key];
    };
}

export default function timedMemoize<T>(a?: ((...args: any[]) => T) | Options, b?: Options): () => T {
    if (typeof a === 'function') {
        // Memoized function value
        const fn = a;
        const options = b || {};
        const cache: {[key: string]: T} = {};
        const cleanup: {[key: string]: number} = {};
        return memoized(fn, cache, cleanup, options);
    } else if (typeof a === 'object' || arguments.length === 0) {
        // Memoized key-value pairs
        const options = a || {};
        const cache: {[key: string]: T} = {};
        const cleanup: {[key: string]: number} = {};
        return memoized((x: any, y: T) => y, cache, cleanup, {...options, resolver: (args) => args[0].toString(), discardUndefined: true});
    } else {
        throw new Error('Invalid arguments');
    }
}
