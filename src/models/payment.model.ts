import {Moment} from "moment";
import * as moment from "moment/moment";

export class PaymentModel implements IPaymentModel {

    id: number;
    userId: number;
    method: string;
    created: Moment;

    constructor(private doc: IPaymentDoc, private wallet: IWalletModel) {
        this.id = doc.id;
        this.userId = doc.user_id;
        this.method = doc.wallet_method;
        this.created = moment.utc(doc.created);
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
