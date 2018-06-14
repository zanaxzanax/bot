
export class PaymentModel implements IPaymentModel {

    id: number;
    userId: number;
    created: number;
    method: string;
    wallet: IWalletModel;

    constructor(private doc: IPaymentDoc) {
        this.id = doc.id;
        this.userId = doc.user_id;
        this.created = Number(doc.created);
        this.method = doc.wallet_method;
        this.wallet = global.app.paymentService.getWalletByAccount(doc.wallet_account);
    }

    getInstruction(): string {
        return this.wallet.getInstruction(this);
    }

    checkStatus(silent: boolean = false): Promise<IPaymentReadyCheckResult> {
        return this.wallet.isPaymentsExists([this]).then((results: IPaymentReadyCheckResult[]) =>
            global.app.paymentService.processPaymentReadyCheckResult(results[0], silent));
    }

    toString(): string {

        const rows: string[] = [
            `Платеж #${this.id}`,
            `${this.getInstruction()}`
        ];

        return rows.join('\n');
    }
}
