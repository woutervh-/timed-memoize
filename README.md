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

// Memoize using key/value pairs
const memory = memoize([options]);
memory(key, value [, options]);
memory(key);
```

Tiny library that wraps a function to memoize its return values when given specific arguments.
Return values are cached on a per-arguments basis.
This means that if you call the function with different arguments, then the cache will be missed and a new value will be computed with those arguments (see examples below).
Optionally you can specify how to resolve the arguments to a key that is used internally to cache return values.

It is also possible to memoize key/value pairs using a cache.

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
 
 Returns a function that can be invoked like the underlying function, but returns cached results.
 
### Memoizing key/value pairs
 
* `options` (default: `{}`):
    An object with the following options:
    * `timeout` (default: `0`):
    The amount of time in milliseconds to keep the function's return value in cache for.
    * `hot` (default: `true`):
    If enabled, keeps track of when the last call to the function was made (with the arguments supplied); it then makes sure the cache is kept for an additional `timeout` amount of time.
    This helps keeping the cache alive for frequently used values.

Returns a function that can be used to set key/value pairs, and can return the cached values.

```js
const memory = memoize(options);
```
*is equivalent to*
```js
const memory = memoize((x, y) => y, {...options, resolver: args => args[0]});
```

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
const memory = memoize({timeout: 50, hot: false});
memory('foo', 'bar');
console.log(memory('foo')); // bar
setTimeout(() => console.log(memory('foo')), 25); // bar
setTimeout(() => console.log(memory('foo')), 75); // undefined
```

## Installation

```bash
npm install --save timed-memoize
```
