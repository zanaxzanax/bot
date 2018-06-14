import * as request from 'request-promise-native';
import * as moment from 'moment';
import {Moment} from 'moment';
import {WalletModel} from './wallet.model';
import * as _ from 'lodash';

enum OPERATION_TYPE {
    ALL = 'ALL',
    IN = 'IN',
    OUT = 'OUT',
    QIWI_CARD = 'QIWI_CARD',
}

const CurrencyCode = {
    '643': 'RUB',
    '840': 'USD',
    '978': 'EUR',
};

export class QiwiWallet extends WalletModel {

    account: string;
    method: string;
    description: string;
    displayName: string;
    ready: boolean;

    constructor(private options: IWalletDescription) {
        super();
        this.method = options.method;
        this.account = options.account;
        this.description = options.description;
        this.displayName = options.displayName;
    }

    getInstruction(payment: IPaymentModel): string {
        return `Отправьте бабки на номер +${this.account} с КОММЕНТАРИЕМ ${payment.id}`
    }

    getAccountFormat(): string {
        return '70000000000 (первая цифра - международный код страны), например, 79991234567';
    }

    isValidAccount(account: string): boolean {
        return /([+]?\d{1,2}[.-\s]?)?(\d{3}[.-]?){2}\d{4}/i.test(account);
    }

    isPaymentsExists(payments: IPaymentModel[]): Promise<IPaymentReadyCheckResult[]> {

        payments = _.sortBy(payments, 'created');

        return this._getPayments(moment.utc(payments[0].created)).then((paymentsResponse: IPaymentsResponse) => {
            return payments.map((payment: IPaymentModel) => {
                const result: IPaymentReadyCheckResult = {
                    paymentId: payment.id,
                    userId: payment.userId,
                    ready: false,
                    description: `Платеж не найден`,
                };
                const paymentIdString: string = String(payment.id);
                const founded: IPaymentsResponseItem = paymentsResponse.data.find((paymentItem: IPaymentsResponseItem) =>
                    paymentItem.comment === paymentIdString);
                if (!founded) {
                    return result;
                } else {
                    result.ready = true;
                    result.description =
                        `Пополнение на сумму ${founded.sum.amount.toFixed(2)} ${CurrencyCode[founded.sum.currency]}`;
                    result.amount = founded.sum.amount;
                    return result;
                }
            });
        });
    }

    isWithdrawalExists(withdrawal: IWithdrawalModel): Promise<boolean> {
        const paymentIdString: string = String(withdrawal.id);
        return this._getPayments(moment.utc(withdrawal.created), true).then((payments: IPaymentsResponse) => {
            const founded: IPaymentsResponseItem =
                payments.data.find((paymentItem: IPaymentsResponseItem) => paymentItem.comment === paymentIdString);
            return !!founded;
        });
    }

    validate(): Promise<any> {

        const contractInfoEnabled: boolean = true;
        const authInfoEnabled: boolean = false;
        const userInfoEnabled: boolean = false;

        return request.get('https://edge.qiwi.com/person-profile/v1/profile/current', {
            qs: {
                contractInfoEnabled,
                authInfoEnabled,
                userInfoEnabled
            },
            json: true,
            auth: {
                bearer: this.options.token
            }
        }).then((response: {
            contractInfo: IContractInfo
        }) => {
            this.ready = !response.contractInfo.blocked;
        });
    }

    process(withdrawal: IWithdrawalModel): Promise<boolean> {

        const id: string = `${Date.now()}`;
        const sum: IAmountCurrencyPaar = {
            amount: withdrawal.amount,
            currency: '643'
        };
        const paymentMethod: IPaymentMethod = {
            type: 'Account',
            accountId: '643'
        };
        const fields: any = {
            account: withdrawal.userAccount
        };
        const comment: string = `${withdrawal.id}`;

        return request.post('https://edge.qiwi.com/sinap/api/v2/terms/99/payments', {
            body: {
                id,
                sum,
                paymentMethod,
                fields,
                comment
            },
            json: true,
            auth: {
                bearer: this.options.token
            }
        }).then((response: IWithdrawalResponse) => {
            console.log(response);
            return true;
        });
    }

    private _getPayments(from: Moment, out: boolean = false): Promise<IPaymentsResponse> {

        //     const now: Moment = moment.utc(this.payment.created);

        const telephone: string = this.account;
        const rows: number = 10;
        const operation: OPERATION_TYPE = out ? OPERATION_TYPE.OUT : OPERATION_TYPE.IN;
        //const sources: any; // ну нах
        const startDate: string = from.format();
        const endDate: string = from.clone().add(100, 'day').format();

        console.log('startDate', startDate, 'endDate', endDate);

        const url: string = `https://edge.qiwi.com/payment-history/v2/persons/${telephone}/payments`;
        console.log(url);

        return request.get(url, {
            qs: {
                rows,
                operation,
                startDate,
                endDate
            },
            json: true,
            auth: {
                bearer: this.options.token
            }
        }).then((response: IPaymentsResponse) => response);
    }
}