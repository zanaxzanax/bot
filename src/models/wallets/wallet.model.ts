

export abstract class WalletModel implements IWalletModel {

    abstract account: string;
    abstract method: string;
    abstract ready: boolean;
    abstract displayName: string;
    abstract description: string;

    abstract getInstruction(payment: IPaymentModel): string;

    abstract validate(): Promise<boolean>;

    abstract isPaymentsExists(payments: IPaymentModel[]): Promise<IPaymentReadyCheckResult[]>;

    abstract isWithdrawalExists(withdrawal: IWithdrawalModel): Promise<boolean>;

    abstract getAccountFormat(): string;

    abstract isValidAccount(account: string): boolean;

    abstract process(withdrawal: IWithdrawalModel): Promise<any>;
}
