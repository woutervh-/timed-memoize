import shallowEqual from 'shallowequal';
import throwError from './throw-error';
import memoize from '../lib/es5/index';

const calls = [];
let counter = 0;
function myFunction(x) {
    calls.push(x);
    return counter++;
}

const myFunctionMemoized = memoize(myFunction, {timeout: 500, hot: true});

const promises = [];
const timeouts = [0, 300, 600, 1200, 1500];
for (let i = 0; i < 5; i++) {
    promises.push(new Promise(resolve =>
        setTimeout(() => resolve(myFunctionMemoized(1)), timeouts[i])
    ));
}

// 0: call is made, result is memoized
// 300: memoized result returned
// 600: memoized result returned
// 1200: call is made, result is memoized
// 1500: memoized result returned

Promise.all(promises).then(returnValues => {
    if (!shallowEqual(calls, [1, 1])
        || !shallowEqual(returnValues, [0, 0, 0, 1, 1])) {
        throw new Error('Test failed.');
    }
}).catch(throwError);
