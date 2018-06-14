import * as Scene from 'telegraf/scenes/base';
import {Stage} from 'telegraf/stage';
import {CallbackQuery, Update, User} from 'telegram-typings';
import {PAYMENT_METHOD} from "../../../../../test";


const paymentMethod: string = PAYMENT_METHOD.qiwi;

const getStandartText = (wallet: IWalletModel): string => {
    const rows: string[] = [
        `Пришлите реквизиты своего ${wallet.displayName} кошелька в формате:`,
        wallet.getAccountFormat(),
        `Через пробел укажите сумму вывода`
    ];
    return rows.join('\n');
};

export const wallet_withdrawal_qiwi = new Scene('wallet:withdrawal:qiwi');
wallet_withdrawal_qiwi.enter((ctx: any) => {
    //const user: User = ctx.from;
    const wallet: IWalletModel = global.app.paymentService.getWalletByMethod(paymentMethod, true);
    // TODO кошелек может меняться
    ctx.reply(getStandartText(wallet));
});
//
// qiwiWithdrawal.on('text', (ctx) => {
//     console.log(ctx.update);
// });

wallet_withdrawal_qiwi.on('message', (ctx, next) => {
    const user: User = ctx.from;
    const userId: number = user.id;
    const update: Update = ctx.update;
    const wallet: IWalletModel = global.app.paymentService.getWalletByMethod(paymentMethod, true);

    const split: string[] = update.message.text.split(' ');
    const accountPart: string = split[0];
    const amountPart: string = (split[1] || '').replace(/,/, '.');
    const amount: number = Number(amountPart);

    console.log(ctx.update);

    if (!accountPart || !amountPart || !wallet.isValidAccount(accountPart) || !amount) {
        //console.log('reply');
        //ctx.reply(getStandartText(wallet));
        next();
        return;
    }

    global.app.withdrawalService.createWithdrawal(userId, paymentMethod, accountPart, amount)
        .then((withdrawal: IWithdrawalModel) => {
            const rows: string[] = [
                `Создан запрос на вывод средств #${withdrawal.id}`,
                `Вы получите уведомление`
            ];
            ctx.reply(rows.join('\n'));
        })
        .catch((e) => {
            // TODO
            console.error(e);
            ctx.reply(`Невозможно организовать вывод средств`);
        });
});

wallet_withdrawal_qiwi.on('callback_query', (ctx) => {
    const query: CallbackQuery = ctx.update.callback_query;
    const paymentId: number = Number(query.data);
});
