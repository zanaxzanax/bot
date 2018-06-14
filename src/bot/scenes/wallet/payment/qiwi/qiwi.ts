import * as Scene from 'telegraf/scenes/base';
import {Stage} from 'telegraf/stage';
import {CallbackQuery, User} from 'telegram-typings';
import {Payment} from '../../../../../../models/index';
import {PAYMENT_METHOD} from '../../../../../../test';
import {Markup} from 'telegraf/markup'; import {Extra} from 'telegraf/markup';

const paymentMethod: string = PAYMENT_METHOD.qiwi;

export const wallet_payment_qiwi = new Scene('wallet:payment:qiwi');
wallet_payment_qiwi.enter((ctx: Context) => {
    const user: User = ctx.from;
    return global.app.paymentService.createPayment(user.id, paymentMethod)
        .then((payment: Payment) => {

            const rows: string[] = [
                `Создан запрос на пополнение #${payment.id}`,
                `Для пополнения кошелька выполните следующие действия:`,
                `${payment.getInstruction()} и нажмите кнопку "${ctx.lang.readyButtonText}"`
            ];

            const extra = Extra.markup(
                Markup.inlineKeyboard([
                    [Markup.callbackButton(ctx.lang.readyButtonText, payment.id)],
                    [Markup.callbackButton(ctx.lang.backButtonText, 'back')]
                ])
            );

            return ctx.reply(rows.join('\n'), extra);
        });
});

wallet_payment_qiwi.on('callback_query', (ctx: Context) => {
    const query: CallbackQuery = ctx.update.callback_query;
    switch (query.data) {
        case 'back':
            return ctx.scene.enter('wallet:payment');
        default:
            const paymentId: number = Number(query.data);
            return global.app.paymentService.isPaymentReady(paymentId).then((result: IPaymentReadyCheckResult) => {
                const extra = Extra.markup(
                    Markup.inlineKeyboard([
                        [Markup.callbackButton(ctx.lang.readyButtonText, 'back')]
                    ])
                );
                if (!result.ready) {
                    extra.reply_markup.inline_keyboard
                        .unshift([Markup.callbackButton(ctx.lang.recheckButtonText, paymentId)]);
                }
                return ctx.reply(result.description, extra);
            });
    }
});
