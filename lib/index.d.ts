export interface Options {
    timeout?: number;
    hot?: boolean;
    discardUndefined?: boolean;
    resolver?: (args: any[]) => string;
}
declare function timedMemoize<T>(a: ((...args: any[]) => T), b?: Options): (...args: any[]) => T;
declare function timedMemoize<T>(a?: Options): (...args: any[]) => T | undefined;
export default timedMemoize;
