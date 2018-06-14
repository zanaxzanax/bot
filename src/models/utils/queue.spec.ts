import {Queue} from './queue';

let queue: Queue<any>;

beforeAll(() => {
    queue = new Queue();
});

describe('queue', () => {
    test('push()', () => {
        queue.push(() => new Promise((resolve, reject) => setTimeout(resolve, 1000))).then(() => console.log('1000'));
        queue.push(() => new Promise((resolve, reject) => setTimeout(resolve, 1000))).then(() => console.log('100'));
        queue.push(() => new Promise((resolve, reject) => setTimeout(resolve, 1000))).then(() => console.log('10'));
        queue.push(() => new Promise((resolve, reject) => setTimeout(reject, 500))).catch(() => console.log('500'));
        return queue.push(() => new Promise((resolve, reject) => setTimeout(resolve, 700)))
            .then(() => console.log('700'));
    });
});
