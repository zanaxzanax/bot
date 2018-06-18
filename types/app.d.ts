interface IRedis {
    client: any;

    start(): Promise<any>;

    stop(): Promise<any>;
}

interface ILink {
    id: number;
    bet: number;
    chance: number;
    md5: string;
    status: string;
    hash: string;
    prevLink: ILink;
    loserPosition: number;
    players: IPlayer[];
    loser: IPlayer;

    isDone(): boolean;

    isShortLink(): boolean;

    join(player: IPlayer): void;

    toJSON(): LinkDocInterface;

    getPrevLink(): ILink;

    toString(): string;
}

interface IApp {
    redis: IRedis;
    redisService: IRedisService;
    gameService: IGameService;
    randomService: IRandomService;
    paymentService: IPaymentService;
    withdrawalService: IWithdrawalService;
    errorService: IErrorService;
    utilsService: IUtilsService;
    bot: any;
    log: any;
    admin: IUserInfo;
    queue: IQueue<ILink>;

    start(): Promise<any>;

    stop(err: any): Promise<any>;

    getConfig(): IConfig;

    emit(event: string | symbol, ...args: any[]): boolean;
}

interface IBot {
    client: any;

    start(): Promise<any>;

    stop(): Promise<any>;
}