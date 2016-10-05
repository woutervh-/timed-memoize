import shallowEqual from 'shallowequal';
import timedMemoize from '../src/index';

const calls = [[], []];
let counter = 0;
function myFunction(x, y) {
    calls[0].push(x);
    calls[1].push(y);
    return counter++;
}

const myFunctionMemoized = timedMemoize(myFunction, {resolver: args => args[0]});
const returnValues = [
    myFunctionMemoized(1, 2),
    myFunctionMemoized(1, 3),
    myFunctionMemoized(2, 2)
];

if (!shallowEqual(calls[0], [1, 2])
    || !shallowEqual(calls[1], [2, 2])
    || !shallowEqual(returnValues, [0, 0, 1])) {
    throw new Error('Test failed.');
}
