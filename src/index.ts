type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

export interface Options {
    timeout?: number;
    hot?: boolean;
    discardUndefined?: boolean;
    one?: boolean;
    proactive?: boolean;
    resolver?: (args: any[]) => string;
}

function simple(args: any[]): string {
    return args.toString();
}

function argsNotEquals(args1: any[], args2: any[]) {
    return args1.some((arg, index) => arg !== args2[index]);
}

function memoized<F extends (...args: any[]) => any>(fn: F, options: Options): F {
    const { timeout = 0, hot = true, discardUndefined = false, resolver = simple, one = false, proactive = true } = options;
    const actualResolver = one ? () => 'key' : resolver;
    const cache: { [Key: string]: ReturnType<F> | undefined } = {};
    const cleanup: { [Key: string]: number | undefined } = {};
    let lastArgs: any[] | undefined = undefined;
    // TODO: cleanup in case of non-proactive.

    return function (...args: any[]) {
        const key = actualResolver(args);

        function cleanupCallback() {
            lastArgs = undefined;
            delete cache[key];
            delete cleanup[key];
        }

        if (!(key in cache) || one && (lastArgs === undefined || argsNotEquals(args, lastArgs))) {
            const returnValue = fn.apply(null, args) as ReturnType<F>;
            if (!discardUndefined || returnValue !== undefined) {
                cache[key] = returnValue;
                if (timeout >= 0) {
                    if (proactive) {
                        cleanup[key] = setTimeout(cleanupCallback, timeout);
                    } else {
                        cleanup[key] = Date.now() + timeout;
                    }
                }
            }
        } else if (hot) {
            const oldCleanup = cleanup[key];
            if (oldCleanup !== undefined && proactive) {
                clearTimeout(oldCleanup);
            }
            if (timeout >= 0) {
                if (proactive) {
                    cleanup[key] = setTimeout(cleanupCallback, timeout);
                } else {
                    cleanup[key] = Date.now() + timeout;
                }
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
        return memoized(fn, options);
    } else if (typeof a === 'object' || arguments.length === 0) {
        // Memoized key-value pairs
        const options = a || {};
        return memoized((x: string, y?: T) => y, { ...options, resolver: (args) => args[0].toString(), discardUndefined: true });
    } else {
        throw new Error('Invalid arguments');
    }
}

export default timedMemoize;
