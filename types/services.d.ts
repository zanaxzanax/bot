interface IPaymentService {
    wallets: IWalletModel[];

    getPaymentVariants(): IPaymentVariant[];

    getWalletByAccount(account: string): IWalletModel;

    processPaymentReadyCheckResult(result: IPaymentReadyCheckResult,
                                   silent?: boolean): Promise<IPaymentReadyCheckResult>;

    getWalletByMethod(method: any): IWalletModel;

    getUserPendingPaymentByMethod(user: IUserInfo): Promise<IPaymentModel>;

    removePayment(user: IUserInfo): Promise<any>;

    createPayment(user: IUserInfo, method: any): Promise<IPaymentModel>;

}

interface IRedisService {
    saveUserInfo(userInfo: IUserInfo): Promise<IUserInfo>;
    saveUserField(userInfo: IUserInfo, field: string, value: string): Promise<IUserInfo>;

    checkInitLinks(): Promise<any>;

    saveUserFromContext(ctx: any): Promise<IUserInfo>;
}

interface IGameService {
    joinPlayer(...args): Promise<ILink>;

    createInitialLink(bet: number, chance: number): Promise<any>;
}

interface IRandomService {
    encrypt(text: string): string;

    decrypt(text: string): string;

    getLinkHash(chance: number): Promise<string>;

    getMD5(str: string): string;
}

interface IErrorService {
    process(err: Error, extra?: any): any;
}

interface IUtilsService {
    chunkArray(myArray, chunk_size): any[];

    sanitize(text: string): string;

    validate(pretend: string): string;
}