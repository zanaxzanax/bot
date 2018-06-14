import {EventEmitter} from 'events';
import {RedisClient} from 'redis';

const redis = require('redis-promisify');

export class Redis extends EventEmitter implements IRedis {

    client: RedisClient | any;

    constructor() {
        super();
    }

    start(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.client = redis.createClient();
            this.client.on('error', (err) => {
                reject();
                this.emit('error', err);
            });
            this.client.on('ready', resolve);
        });
    }

    stop(): Promise<any> {
        return Promise.resolve()
            .then(() => {
                this.client.end(true);
            });
    }
}
