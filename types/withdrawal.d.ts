interface IWithdrawalDoc {
    id: number;
    user_id: number;
    status?: string;
    amount: number;
    user_account: string;
    wallet_account: string;
    wallet_method: string;
    created?: any;
}

interface IWithdrawalModel {
    id: number;
    userId: number;
    created: number;
    amount: number;
    userAccount: string;
    wallet: IWalletModel;
}

interface IWithdrawalService {
    createWithdrawal(user_id: number, method: any, user_account: string, amount: number): Promise<IWithdrawalModel>;
}