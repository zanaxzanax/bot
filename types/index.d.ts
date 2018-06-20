/// <reference path="../node_modules/@types/mongoose/index.d.ts" />
/// <reference path="../node_modules/@types/node/index.d.ts" />
/// <reference path="../node_modules/@types/request/index.d.ts" />
/// <reference path="../node_modules/@types/jest/index.d.ts" />
/// <reference path="../node_modules/@types/lodash/index.d.ts" />
/// <reference path="../node_modules/@types/express/index.d.ts" />
/// <reference path="../node_modules/@types/redis/index.d.ts" />
/// <reference path="./qiwi.d.ts" />
/// <reference path="./payment.d.ts" />
/// <reference path="./withdrawal.d.ts" />
/// <reference path="./services.d.ts" />
/// <reference path="./app.d.ts" />

interface GameServiceInterface {
    join: any;
}

interface IQueue<T> {
    items: IQueueItem[];

    push: (func: (...args) => Promise<T>, ...args) => Promise<T>
}

declare namespace NodeJS {
    export interface Global {
        app: IApp;
    }
}

interface Message {
    reply: (...args: any[]) => any;
}

interface IConfig {
    chances: number[];
    bets: number[];
    adminUserInfo: UserDocInterface;
    wallets: IWalletDescription[]
}

interface IPaymentVariant {
    method: string;
    displayName: string;
    description: string;
}

interface IPaymentReadyCheckResult {
    paymentId: number;
    userId: number;
    ready: boolean;
    description: string;
    amount?: number;
}

interface PagedResult {
    prev: number;
    next: number;
    count: number;
    limit: number;
    data: any[];
}

interface IPlayer {
    id: number;
    nickname: string;
}

interface IQueueItem {
    func: (...args) => Promise<any>;
    args: any[],
    resolve: any;
    reject: any;
}

interface LinkDocInterface {
    id: number;
    prevId: number;
    hash: string;
    bet: number;
    chance: number;
    // prev:
    md5: string;
    status: string;
    players: IPlayer[];
    loser?: IPlayer;
}


interface UserDocInterface {
    id: string;
    is_bot: string;
    first_name: string;
    last_name: string;
    language_code: string;
    chat_id: string;
    balance: string;
    nickname: string;
}

interface IUserInfo {
    id: number;
    nickname: string;
    first_name: string;
    last_name: string;
    language_code: string;
    balance: number;
    toPlayerInfo: () => IPlayer;
    toJSON: () => any;
    getName: () => string;
}

interface Context {
    session: { user: IUserInfo };
    wizard: any;
    chat: any;
    from: any;
    reply: any;
    scene: {
        state: any;
        enter: any;
        reenter: any;
        leave: any;
    };
    update: any;
    editMessageText: any;
    app: IApp;
    lang: {
        backButtonText: string;
        playButtonText: string;
        settingsButtonText: string;
        helpButtonText: string;
        walletButtonText: string;
        deleteButtonText: string;
        yesButtonText: string;
        noButtonText: string;
        readyButtonText: string;
        recheckButtonText: string;
        replenishmentButtonText: string;
        withdrawalButtonText: string;
        prevButtonText: string;
        nextButtonText: string;
        historyButtonText: string;
        [keys: string]: string
    };
}
