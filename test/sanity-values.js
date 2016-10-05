import memoize from '../src/index';

memoize('foo', 'bar');
if (memoize('foo') !== 'bar') {
    throw new Error('Test failed.');
}

setTimeout(() => {
    if (typeof memoize('foo') !== 'undefined') {
        throw new Error('Test failed.');
    }
}, 0);

setTimeout(() => {
    memoize('foo', 'baz', {timeout: 100});

    setTimeout(() => {
        if (memoize('foo') !== 'baz') {
            throw new Error('Test failed.');
        }
    }, 50);

    setTimeout(() => {
        if (typeof memoize('foo') !== 'undefined') {
            throw new Error('Test failed.');
        }
    }, 150);
}, 50);
