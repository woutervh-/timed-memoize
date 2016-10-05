// Helps with throwing error because promises swallow errors.

export default function throwError(error) {
    setTimeout(() => {
        throw error;
    }, 0);
}
