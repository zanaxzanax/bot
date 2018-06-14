import {App} from "../app";
import * as _ from 'lodash';
import {PAYMENT_METHOD} from "../test";

export class PaymentService implements IPaymentService {

    validWallets: IWalletModel[] = [];
    wallets: IWalletModel[] = [];

    constructor(private app: App) {

    }

    getPaymentVariants(): IPaymentVariant[] {
        return _.uniqBy(this.validWallets.map((wallet: IWalletModel) => ({
            method: wallet.method,
            displayName: wallet.displayName,
            description: wallet.description
        })), 'method');
    }

    getWalletByMethod(method: PAYMENT_METHOD, all: boolean = false): IWalletModel {
        const wallets: IWalletModel[] = all ? this.wallets : this.validWallets;
        const founded: IWalletModel = wallets.find((wallet: IWalletModel) => wallet.method === method);
        if (!founded) {
            throw 'no ready wallet'
        }
        return founded;
    }

    getWalletByAccount(account: string): IWalletModel {
        const founded: IWalletModel = this.validWallets.find((wallet: IWalletModel) => wallet.account === account);
        if (!founded) {
            throw 'no founded wallet'
        }
        return founded;
    }

    processPaymentReadyCheckResult(result: IPaymentReadyCheckResult,
                                   silent?: boolean): Promise<IPaymentReadyCheckResult> {
        const status: string = 'ok';
        const amount: number = result.amount;

        if (result.ready) {
            // return Promise.all([MODELS.payment.updateOne({
            //     id: result.paymentId
            // }, {
            //     $set: {status, amount}
            // }), MODELS.user.findOneAndUpdate({
            //     id: result.userId
            // }, {
            //     $inc: {balance: amount}
            // }, {new: true}).then((user: any) => {
            //     if (!silent) {
            //         this._notify(user, result);
            //     }
            // })]).then(() => {
            //
            //     const founded = this.app.payments.find((payment: Payment) => payment.id === result.paymentId);
            //     if (founded) {
            //         this.app.payments.splice(this.app.payments.indexOf(founded), 1);
            //     }
            //
            //     return result;
            // });
        } else {
            return Promise.resolve(result);
        }
    }
}
