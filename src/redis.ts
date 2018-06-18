import {RedisClient} from 'redis';

const redis = require('redis-promisify');

export class Redis implements IRedis {

    client: RedisClient | any;

    constructor(private app: IApp) {

    }

    start(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.client = redis.createClient();
            this.client.on('error', reject);
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
