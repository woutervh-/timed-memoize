import memoize from '../lib-es5/index';

const memory = memoize({timeout: -1});

memory('foo', 0xF00);
if (memory('foo') !== 0xF00) {
    throw new Error('Test failed.');
}

setTimeout(() => {
    if (memory('foo') !== 0xF00) {
        throw new Error('Test failed.');
    }
}, 50000);
