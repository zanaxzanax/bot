

export class Queue<T> implements IQueue<T> {

    items: IQueueItem[] = [];
    private _process: boolean = false;

    push(func: (...args) => Promise<T>, ...args): Promise<T> {
        let resolve: any;
        let reject: any;
        const promise: Promise<T> = new Promise((res, rej) => {
            resolve = res;
            reject = rej;
        });
        this.items.push({func, args, resolve, reject});
        if (!this._process) {
            this._start();
        }
        return promise;
    }

    private _start() {
        const item: IQueueItem = this.items.shift();
        if (item) {
            this._process = true;
            item.func.apply(null, item.args).then(item.resolve, item.reject).then(() => this._start());
        } else {
            this._process = false;
        }
    }
}