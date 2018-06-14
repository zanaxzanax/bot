
interface IAmountCurrencyPaar {
    amount: number;
    currency: string;
}

interface IPaymentMethod {
    type: string;
    accountId: string;
}

interface IPaymentsResponseItem {
    txnId: number;
    personId: number;
    date: string;
    errorCode: number;
    error: string;
    status: string;
    type: string;
    statusText: string;
    trmTxnId: string;
    account: string;
    sum: IAmountCurrencyPaar;
    commission: IAmountCurrencyPaar;
    total: IAmountCurrencyPaar;
    provider: any;
    source: any;
    comment: string;
    currencyRate: number;
    extras: any;
    chequeReady: boolean;
    bankDocumentAvailable: boolean;
    bankDocumentReady: boolean;
    repeatPaymentEnabled: boolean;
    favoritePaymentEnabled: boolean;
    regularPaymentEnabled: boolean;
}

interface IPaymentsResponse {
    data: IPaymentsResponseItem[];
    nextTxnId: string;
    nextTxnDate: string;
}

interface IContractInfo {
    contractId: number;
    creationDate: string;
    features: any[];
    identificationInfo: {
        bankAlias: string;
        identificationLevel: string;
    };
    blocked: boolean;
}

interface IWithdrawalResponse {
    id: string;
    terms: string;
    fields: any;
    sum: IAmountCurrencyPaar;
    source: string;
    comment: string;
    transaction: {
        id: string;
        state: {
            code: string;
        }
    }
}
