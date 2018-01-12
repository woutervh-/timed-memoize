import shallowEqual from 'shallowequal';
import throwError from './throw-error';
import memoize from '../lib-es5/index';

const calls = [[], []];
const counters = [0, 0];
function myFunction(i, x) {
    calls[i].push(x);
    return counters[i]++;
}

const myFunctionMemoized = memoize(myFunction, {timeout: 500, hot: false});

const promises = [[], []];
const timeouts = [0, 300, 600, 900, 1200];
for (let i = 0; i < 5; i++) {
    promises[0].push(new Promise(resolve =>
        setTimeout(() => resolve(myFunctionMemoized(0, 1)), timeouts[i])
    ));
    promises[1].push(new Promise(resolve =>
        setTimeout(() => resolve(myFunctionMemoized(1, i)), timeouts[i])
    ));
}

// For index 0
// 0: call is made, result is memoized
// 300: memoized result returned
// 600: call is made, result is memoized
// 900: memoized result returned
// 1200: call is made, result is memoized

// For index 1
// 0: call is made, result is memoized
// 300: call is made, result is memoized
// 600: call is made, result is memoized
// 900: call is made, result is memoized
// 1200: call is made, result is memoized

Promise.all([Promise.all(promises[0]), Promise.all(promises[1])]).then(returnValues => {
    if (!shallowEqual(calls[0], [1, 1, 1])
        || !shallowEqual(calls[1], [0, 1, 2, 3, 4])
        || !shallowEqual(returnValues[0], [0, 0, 1, 1, 2])
        || !shallowEqual(returnValues[1], [0, 1, 2, 3, 4])) {
        throw new Error('Test failed.');
    }
}).catch(throwError);
