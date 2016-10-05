# timed-memoize
Timed memoize.

[npm-image]: https://img.shields.io/npm/v/timed-memoize.svg
[npm-url]: https://npmjs.org/package/timed-memoize
[downloads-image]: https://img.shields.io/npm/dm/timed-memoize.svg

[![npm][npm-image]][npm-url] [![downloads][downloads-image]][npm-url]

```js
import timedMemoize from 'timed-memoize';
// ...
const memoizedFunction = timedMemoize(myFunction [, options]); 
```

Tiny library that wraps a function to memoize its return values when given specific arguments.
Return values are cached on a per-arguments basis.
This means that if you call the function with different arguments, then the cache will be missed and a new value will be computed with those arguments (see examples below).  

Works in browsers and Node.js.

## Options
* `timeout`: the amount of time in milliseconds to keep the function's return value in cache for.
* `hot`: if enabled, keeps track of when the last call to the function was made (with the arguments supplied); it then makes sure the cache is kept for an additional `timeout` amount of time. This helps keeping the cache alive for frequently used values.

## Examples

```js
import timedMemoize from 'timed-memoize';

function myHeavyComputation(x) {
    console.log(`Computing the square root of ${x}...`)
    return Math.sqrt(x * x);
}

const myHeavyComputationMemoized = timedMemoize(myHeavyComputation, {timeout: 500, hot: false});
console.log(myHeavyComputationMemoized(1)); // 1, cache miss
console.log(myHeavyComputationMemoized(4)); // 2, cache miss
console.log(myHeavyComputationMemoized(1)); // 1, cache hit

// ...

setTimeout(() => console.log(myHeavyComputationMemoized(9)), 0); // 3, cache miss
setTimeout(() => console.log(myHeavyComputationMemoized(9)), 300); // 3, cache hit
setTimeout(() => console.log(myHeavyComputationMemoized(9)), 600); // 3, cache miss

// ...

const myHotAndHeavyComputation = timedMemoize(myHeavyComputation, {timeout: 500, hot: true});
setTimeout(() => console.log(myHotAndHeavyComputation(9)), 0); // 3, cache miss
setTimeout(() => console.log(myHotAndHeavyComputation(9)), 300); // 3, cache hit
setTimeout(() => console.log(myHotAndHeavyComputation(9)), 600); // 3, cache hit
setTimeout(() => console.log(myHotAndHeavyComputation(9)), 1200); // 3, cache miss
```

## Installation

```bash
npm install --save timed-memoize
```
