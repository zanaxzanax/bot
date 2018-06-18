import {PAYMENT_METHOD} from "../test";

export class WithdrawalService implements IWithdrawalService {

    constructor(private app: IApp) {

    }

    createWithdrawal(user_id: number, method: PAYMENT_METHOD, user_account: string, amount: number): Promise<IWithdrawalModel> {
        const options: any = {user_id, amount, user_account};
        return Promise.resolve(null);
        // .then(() => this.app.appService.getUserById(user_id))
        // .then((user: any) => {
        //     if (user.balance < amount) {
        //         throw 'Недостаточно средств';
        //     }
        // })
        // .then(() => {
        //     const wallet: Wallet = this.app.walletsHolder.getWalletByMethod(method);
        //     options['wallet_account'] = wallet.account;
        //     options['wallet_method'] = wallet.method;
        // })
        // .then(() => this.app.mongoService.getNextId('withdrawal').then((id: number) => {
        //     options['id'] = id;
        // }))
        // .then(() => new MODELS.withdrawal(options).save())
        // .then((doc: any) => {
        //     const withdrawal: Withdrawal = new Withdrawal(doc);
        //     this.app.withdrawals.push(withdrawal);
        //     return withdrawal;
        // });
    }
}