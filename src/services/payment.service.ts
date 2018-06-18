import * as _ from 'lodash';
import {PAYMENT_METHOD, PAYMENT_STATUS} from "../test";
import {PaymentModel, WALLETS} from "../models";

export class PaymentService implements IPaymentService {

    wallets: IWalletModel[] = [];

    constructor(private app: IApp) {
        this.wallets = this.app.getConfig().wallets.map((description: IWalletDescription) => {
            if (WALLETS[description.method]) {
                return new WALLETS[description.method](description);
            }
        }).filter((wallet: IWalletModel) => !!wallet);
    }

    getUserPendingPaymentByMethod(user: IUserInfo): Promise<IPaymentModel> {
        return this.app.redis.client.lrangeAsync(`payments:${user.id}`, 0, 1).then((result: string[]) => {
            if (result.length) {
                const doc: IPaymentDoc = JSON.parse(result[0]);
                return new PaymentModel(doc, this.app.paymentService.getWalletByAccount(doc.wallet_account));
            }
        });
    }

    getPaymentVariants(): IPaymentVariant[] {
        return _.uniqBy(this.wallets.map((wallet: IWalletModel) => ({
            method: wallet.method,
            displayName: wallet.displayName,
            description: wallet.description
        })), 'method');
    }

    getWalletByMethod(method: PAYMENT_METHOD): IWalletModel {
        return this.wallets.find((wallet: IWalletModel) => wallet.method === method);
    }

    getWalletByAccount(account: string): IWalletModel {
        return this.wallets.find((wallet: IWalletModel) => wallet.account === account);
    }

    createPayment(user: IUserInfo, method: PAYMENT_METHOD): Promise<IPaymentModel> {
        return Promise.resolve()
            .then(() => this.app.redis.client.incrAsync('payments:id'))
            .then((id: number) => {
                const wallet: IWalletModel = this.app.paymentService.getWalletByMethod(method);
                const doc: IPaymentDoc = {
                    id,
                    user_id: user.id,
                    status: PAYMENT_STATUS.pending,
                    amount: 0,
                    wallet_account: wallet.account,
                    wallet_method: wallet.method,
                    created: Date.now()
                };
                const payment: IPaymentModel = new PaymentModel(doc, this.getWalletByAccount(doc.wallet_account));
                return this.app.redis.client
                    .lpushAsync(`payments:${user.id}`, JSON.stringify(payment)).then(() => payment);
            });
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

    removePayment(user: IUserInfo): Promise<any> {
        return this.app.redis.client
            .lpopAsync(`payments:${user.id}`);
    }
}
