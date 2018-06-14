
export class WithdrawalModel implements IWithdrawalModel {

    id: number;
    userId: number;
    created: number;
    amount: number;
    userAccount: string;
    wallet: IWalletModel;

    constructor(private doc: IWithdrawalDoc) {
        this.id = doc.id;
        this.userId = doc.user_id;
        this.amount = doc.amount;
        // TODO привести к виду без 7
        this.userAccount = doc.user_account;
        this.created = Number(doc.created);
        this.wallet = global.app.paymentService.getWalletByAccount(doc.wallet_account);
        this._startWithdrawal();
    }

    private _startWithdrawal() {
        Promise.resolve()
            .then(() => this.wallet.isWithdrawalExists(this))
            .then((exist: boolean) => {
                if (!exist) {
                    return this.wallet.process(this);
                }
            })
            .then(() => {

            })
            .catch((e) => {
                console.error(e);
            });
    }
}
