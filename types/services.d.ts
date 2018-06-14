import {ContextMessageUpdate} from "telegraf";

interface IPaymentService {
    validWallets: IWalletModel[];
    getPaymentVariants(): IPaymentVariant[];
    getWalletByAccount(account: string): IWalletModel;
    processPaymentReadyCheckResult(result: IPaymentReadyCheckResult,
                                   silent?: boolean): Promise<IPaymentReadyCheckResult>;
    getWalletByMethod(method: any, all: boolean): IWalletModel;
}

interface IRedisService {
    saveUserInfo(userInfo: IUserInfo): Promise<any>;
    checkInitLinks(): Promise<any>;
    saveUserFromContext(ctx: ContextMessageUpdate): Promise<IUserInfo>;
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