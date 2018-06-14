interface IRedis {
    client: any;

    start(): Promise<any>;

    stop(): Promise<any>;

    on(event: string | symbol, listener: (...args: any[]) => void): this;
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
}

interface IApp {
    redis: IRedis;
    redisService: IRedisService;
    gameService: IGameService;
    randomService: IRandomService;
    paymentService: IPaymentService;
    bot: any;
    log: any;
    admin: IUserInfo;

    start(): Promise<any>;

    stop(err: any): Promise<any>;

    getConfig(): IConfig
}