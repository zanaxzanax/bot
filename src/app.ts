import {EventEmitter} from 'events';
import {Redis} from './redis';
import {
    ErrorService,
    GameService,
    MongoService,
    PaymentService,
    RandomService,
    RedisService,
    TestService,
    UtilsService,
    WithdrawalService
} from './services';
import {Queue, UserInfo} from './models';
import {Bot} from './bot';
import {log} from './logger';
import {Mongo} from './mongo';

const config: IConfig = require('./config/config.json');

export class App extends EventEmitter implements IApp {

    redis: IRedis;
    mongo: IMongo;
    redisService: IRedisService;
    gameService: IGameService;
    randomService: IRandomService;
    paymentService: IPaymentService;
    withdrawalService: IWithdrawalService;
    errorService: IErrorService;
    utilsService: IUtilsService;
    mongoService: IMongoService;
    testService: ITestService;
    bot: IBot;
    log: any;
    queue: IQueue<ILink>;

    admin: IUserInfo;

    private _started: boolean = false;

    constructor() {
        super();
        this.queue = new Queue();
        this.redis = new Redis(this);
        this.mongo = new Mongo(this);
        this.redisService = new RedisService(this);
        this.gameService = new GameService(this);
        this.mongoService = new MongoService(this);
        this.randomService = new RandomService(this);
        this.paymentService = new PaymentService(this);
        this.withdrawalService = new WithdrawalService(this);
        this.errorService = new ErrorService(this);
        this.utilsService = new UtilsService(this);
        this.testService = new TestService(this);
        this.admin = new UserInfo(config.adminUserInfo);
        this.bot = new Bot(this);
        this.log = log;
        this._bindEvents();
    }

    start(): Promise<any> {
        return Promise.resolve()
        // .then(() => this.redis.start())
            .then(() => this.mongo.start())
            //.then(() => this.redisService.saveUserInfo(this.admin))
            // .then(() => this.redisService.checkInitLinks())
            //  .then(() => this.bot.start())
            //   .then(() => {
            //       const old = this.bot.client.handleUpdates;
            //       this.bot.client.handleUpdates = (updates) => {
            //           console.log(JSON.stringify(updates));
            //           return old.apply(this.bot.client, [updates]);
            //       }
            //   })
            .then(() => {
                this._started = true;
                this.log.info('started');
            }, (err: any) => this.stop(err));
    }

    stop(err?: any): Promise<any> {
        return Promise.resolve()
        //     .then(() => this.bot.stop())
        //     .then(() => this.redis.stop())
            .then(() => this.mongo.stop())
            .then(() => {
                this._started = false;
                if (err) {
                    this.log.error(err);
                }
            });
    }

    getConfig(): IConfig {
        return {
            ...config,
            MONGO_URL: process.env.MONGO_URL
        };
    }

    isStarted(): boolean {
        return this._started;
    }

    private _bindEvents(): void {
        this.on('error', (err) => this.stop(err));
    }
}
