interface IPaymentDoc {
    id: number;
    user_id: number;
    status?: string;
    amount?: number;
    wallet_account: string;
    wallet_method: string;
    created: number;
}

interface IPaymentModel {
    id: number;
    userId: number;
    method: string;
    created: any;
}

interface IWalletDescription {
    method: string;
    displayName: string;
    description: string;
    account: string;

    [key: string]: any;
}