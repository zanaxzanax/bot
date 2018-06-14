
interface IWalletModel {

    account: string;
    method: string;
    ready: boolean;
    displayName: string;
    description: string;

    getInstruction(payment: IPaymentModel): string;

    validate(): Promise<boolean>;

    isPaymentsExists(payments: IPaymentModel[]): Promise<IPaymentReadyCheckResult[]>;

    isWithdrawalExists(withdrawal: IWithdrawalModel): Promise<boolean>;

    getAccountFormat(): string;

    isValidAccount(account: string): boolean;

    process(withdrawal: IWithdrawalModel): Promise<any>;
}