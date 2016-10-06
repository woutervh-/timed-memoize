import Heap from 'heap';

function compare(a, b) {
    return a.absoluteTime - b.absoluteTime;
}

let currentTime = 0;
let runner;
const heap = new Heap(compare);
const heapItemMap = {};

function executeTasks() {
    while (heap.size() >= 1) {
        const {id, cleared, callback, absoluteTime} = heap.pop();
        currentTime = absoluteTime;
        if (!cleared) {
            callback();
            delete heapItemMap[id];
        }
    }
    runner = null;
}

let counter = 0;
(function (global) {
    const originalTimeout = global.setTimeout;
    global.setTimeout = function (callback, timeout) {
        const heapItem = {absoluteTime: timeout + currentTime, callback, cleared: false, id: counter};
        heap.push(heapItem);
        heapItemMap[counter] = heapItem;
        if (!runner) {
            runner = originalTimeout(executeTasks, 0);
        }
        return counter++;
    };
    global.clearTimeout = function (id) {
        if (id in heapItemMap) {
            heapItemMap[id].cleared = true;
            delete heapItemMap[id];
        }
    }
})(Function('return this')());

const startTime = Date.now();
Date.now = function () {
    return startTime + currentTime;
};
