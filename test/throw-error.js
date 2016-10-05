export default function throwError(error) {
    setTimeout(() => {
        throw error;
    }, 0);
}
