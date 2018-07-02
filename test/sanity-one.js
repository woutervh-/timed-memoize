import memoize from '../lib/es5/index';

let calls = 0;
const computation = (value) => {
    calls += 1;
    return Math.sqrt(value);
};
const memory = memoize(computation, {timeout: -1, one: true});

if (memory(16) !== 4) {
    throw new Error('Test failed.');
}
if (memory(16) !== 4) {
    throw new Error('Test failed.');
}
if (calls !== 1) {
    throw new Error('Test failed.');
}

if (memory(25) !== 5) {
    throw new Error('Test failed.');
}
if (memory(25) !== 5) {
    throw new Error('Test failed.');
}
if (calls !== 2) {
    throw new Error('Test failed.');
}

setTimeout(() => {
    if (memory(25) !== 5) {
        throw new Error('Test failed.');
    }
    if (calls !== 2) {
        throw new Error('Test failed.');
    }
}, 50000);
