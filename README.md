# timed-memoize
Timed memoize.

[npm-image]: https://img.shields.io/npm/v/timed-memoize.svg
[npm-url]: https://npmjs.org/package/timed-memoize
[downloads-image]: https://img.shields.io/npm/dm/timed-memoize.svg

[![npm][npm-image]][npm-url] [![downloads][downloads-image]][npm-url]

## Basic usage

```js
import memoize from 'timed-memoize';

// Memoize function return values
const memoizedFunction = memoize(myFunction [, options]);
memoizedFunction('foo');

 // Memoize using a global cache
memoize(key, value [, options]);
memoize(key);
```

Tiny library that wraps a function to memoize its return values when given specific arguments.
Return values are cached on a per-arguments basis.
This means that if you call the function with different arguments, then the cache will be missed and a new value will be computed with those arguments (see examples below).
Optionally you can specify how to resolve the arguments to a key that is used internally to cache return values.

It is also possible to memoize key/value pairs using a global cache.

Works in browsers and Node.js.

## Options

### Memoizing functions

* `fn` (required):
Function whose return values to memoize.
* `options` (default: `{}`):
    An object with the following options:
    * `timeout` (default: `0`):
    The amount of time in milliseconds to keep the function's return value in cache for.
    * `hot` (default: `true`):
    If enabled, keeps track of when the last call to the function was made (with the arguments supplied); it then makes sure the cache is kept for an additional `timeout` amount of time.
    This helps keeping the cache alive for frequently used values.
    * `resolver` (default: `args => args`):
    A function that accepts a single array and transforms it into a key.
    The returned key can be anything that can be used as a key in standard JavaScript objects.
 
### Memoizing key/value pairs
 
* `key` (required):
Key to store the value for in the global cache.
It can be anything that can be used as a key in standard JavaScript objects.
* `value` (required):
Value to store in the global.
* `options` (default: `{}`):
    An object with the following options:
    * `timeout` (default: `0`):
    The amount of time in milliseconds to keep the function's return value in cache for.
    * `hot` (default: `true`):
    If enabled, keeps track of when the last call to the function was made (with the arguments supplied); it then makes sure the cache is kept for an additional `timeout` amount of time.
    This helps keeping the cache alive for frequently used values.

### Retrieving memoized key/value pairs

* `key` (required):
Key to retrieve the value for from the global cache.
It can be anything that can be used as a key in standard JavaScript objects.

## Examples

```js
import memoize from 'timed-memoize';

function myHeavyComputation(x) {
    console.log(`Computing the square root of ${x}...`)
    return Math.sqrt(x * x);
}

// Caches immediately, even when called synchronously.
const myHeavyComputationMemoized = memoize(myHeavyComputation, {timeout: 500, hot: false});
console.log(myHeavyComputationMemoized(1)); // 1, cache miss
console.log(myHeavyComputationMemoized(4)); // 2, cache miss
console.log(myHeavyComputationMemoized(1)); // 1, cache hit

// Cold cache.
// Any values returned by the underlying function are forgotten after 500ms.
setTimeout(() => console.log(myHeavyComputationMemoized(9)), 0); // 3, cache miss
setTimeout(() => console.log(myHeavyComputationMemoized(9)), 300); // 3, cache hit
setTimeout(() => console.log(myHeavyComputationMemoized(9)), 600); // 3, cache miss

// Hot cache.
// Any values returned by the underlying function are forgotten after 500ms.
// If the function is called again with the same arguments, the timer is reset. 
const myHotAndHeavyComputation = memoize(myHeavyComputation, {timeout: 500, hot: true});
setTimeout(() => console.log(myHotAndHeavyComputation(16)), 0); // 4, cache miss
setTimeout(() => console.log(myHotAndHeavyComputation(16)), 300); // 4, cache hit
setTimeout(() => console.log(myHotAndHeavyComputation(16)), 600); // 4, cache hit
setTimeout(() => console.log(myHotAndHeavyComputation(16)), 1200); // 4, cache miss

// Cache with custom resolver.
// Resolver is used to remember return values from past calls.
function mySideEffect(x, y) {
    console.log(y);
    return x + 1;
}
const mySideEffectWithUnimportantArguments = memoize(mySideEffect, {resolver: args => args[0]});
console.log(mySideEffectWithUnimportantArguments(1, 'foo')); // 2, cache miss
console.log(mySideEffectWithUnimportantArguments(1, 'bar')); // 2, cache hit

// Storing and retrieving key/value pairs
memoize('foo', 'bar');
memoize('baz', 'qux', {timeout: 100});
console.log(memoize('foo')); // bar
console.log(memoize('baz')); // qux
setTimeout(() => console.log(memoize('foo')), 50); // undefined
setTimeout(() => console.log(memoize('baz')), 50); // qux
```

## Installation

```bash
npm install --save timed-memoize
```
