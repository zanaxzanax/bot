import {EventEmitter} from 'events';
import {Redis} from './redis';
import {GameService, PaymentService, RandomService, RedisService} from './services';
import {UserInfo} from './models';
import {bot} from './bot';
import {log} from './logger';

const config: IConfig = require('./config/config.json');

export class App extends EventEmitter implements IApp {

    redis: IRedis;
    redisService: IRedisService;
    gameService: IGameService;
    randomService: IRandomService;
    paymentService: IPaymentService;
    bot: any;
    log: any;

    admin: IUserInfo;

    private _started: boolean = false;

    constructor() {
        super();
        this.redis = new Redis();
        this.redisService = new RedisService(this);
        this.gameService = new GameService(this);
        this.randomService = new RandomService(this);
        this.paymentService = new PaymentService(this);
        this.admin = new UserInfo(config.adminUserInfo);
        this.bot = bot;
        this.log = log;
    }

    start(): Promise<any> {
        if (this._started) {
            return Promise.resolve();
        }
        return Promise.resolve()
            .then(() => this.redis.start())
            .then(() => this.redisService.saveUserInfo(this.admin))
            .then(() => this.redisService.checkInitLinks())
            .then(() => this.bot.startPolling())
            .then(() => this._bindEvents())
            .then(() => {
                this._started = true;
                this.log.info('asdasd');
            });
    }

    stop(err: any): Promise<any> {
        if (!this._started) {
            return Promise.resolve();
        }
        return Promise.resolve()
            .then(() => this.bot.stop())
            .then(() => this.redis.stop())
            .then(() => {
                this._started = false;
                this.log.error(err);
            });
    }

    getConfig(): IConfig {
        return config;
    }

    private _bindEvents(): void {
        this.redis.on('error', (err) => this.stop(err));
    }
}
