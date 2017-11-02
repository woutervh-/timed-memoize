export interface Options {
    timeout?: number;
    hot?: boolean;
    discardUndefined?: boolean;
    resolver?: (args: any[]) => string;
}
export default function timedMemoize<T>(a?: ((...args: any[]) => T) | Options, b?: Options): (...args: any[]) => T;
