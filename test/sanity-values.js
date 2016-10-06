import memoize from '../src/index';

const shortMemory = memoize();
const longMemory = memoize({timeout: 100, hot: false});

if (typeof shortMemory('foo') !== 'undefined') {
    throw new Error('Test failed.');
}
shortMemory('foo', 0xF00);
if (shortMemory('foo') !== 0xF00) {
    throw new Error('Test failed.');
}

setTimeout(() => {
    if (typeof shortMemory('foo') !== 'undefined') {
        throw new Error('Test failed.');
    }
}, 0);

setTimeout(() => {
    longMemory('foo', 'baz');

    setTimeout(() => {
        if (longMemory('foo') !== 'baz') {
            throw new Error('Test failed.');
        }
    }, 50);

    setTimeout(() => {
        if (typeof longMemory('foo') !== 'undefined') {
            throw new Error('Test failed.');
        }
    }, 150);
}, 50);
