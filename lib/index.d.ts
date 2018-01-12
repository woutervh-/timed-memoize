export interface Options {
    timeout?: number;
    hot?: boolean;
    discardUndefined?: boolean;
    resolver?: (args: any[]) => string;
}
declare function timedMemoize<T, F extends () => T>(func: F, options?: Options): F;
declare function timedMemoize<T>(options?: Options): (key: string, value?: T) => T | undefined;
export default timedMemoize;
