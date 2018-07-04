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

//
// interface IGameService {
//     joinPlayer(...args): Promise<ILink>;
//
//     createInitialLink(bet: number, chance: number): Promise<any>;
// }

interface IGameService {
    test(userInfo: IUserInfo, bet: number, chance: number): Promise<IElement[]>;

    join(userInfo: IUserInfo, id: number): Promise<IElement>;
}

interface IMongoService {

    updateDoc(modelName: string, conditions: any, options: any): Promise<any>;

    updateDocs(modelName: string, conditions: any, options: any): Promise<any[]>;

    getNextId(modelName: string): Promise<number>;

    getDocs(modelName: string, options: any, limit?: number): Promise<any[]>;

    getDoc(modelName: string, options: any, projection?: any): Promise<any>;
}

interface IRandomService {
    encrypt(text: string): string;

    decrypt(text: string): string;

    getLinkHash(id: number, chance: number): Promise<string>;

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

interface ITestService {
    getFakeUserInfo(balance: number, id?: number): Promise<IUserInfo>;
}