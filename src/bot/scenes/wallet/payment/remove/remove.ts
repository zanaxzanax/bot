import {CallbackQuery} from 'telegram-typings';
import * as Scene from 'telegraf/scenes/base';
import {Markup} from 'telegraf/markup'; import {Extra} from 'telegraf/markup';

export const wallet_payment_remove = new Scene('wallet:payment:remove');
wallet_payment_remove.enter((ctx: Context) => {

    const existPaymentId: number = ctx.scene.state.existPaymentId;

    const rows: string[] = [
        `Вы уверены что хотите удалить платеж #${existPaymentId}?`,
        `Если вы уже произвели оплату по его реквизитам, зачисления средств не произойдет`
    ];

    const extra = Extra.markup(
        Markup.inlineKeyboard([
            [
                Markup.callbackButton(ctx.lang.yesButtonText, 'yes'),
                Markup.callbackButton(ctx.lang.noButtonText, 'no')
            ],
            [
                Markup.callbackButton(ctx.lang.backButtonText, 'back')
            ]
        ])
    );

    return ctx.reply(rows.join('\n'), extra);
});

wallet_payment_remove.on('callback_query', (ctx: Context) => {
    const query: CallbackQuery = ctx.update.callback_query;
    switch (query.data) {
        case 'back':
            return ctx.scene.enter('wallet:payment');
        case 'yes':
            const existPaymentId: number = ctx.scene.state.existPaymentId;
            if (existPaymentId) {
                const rows: string[] = [
                    `Платеж #${existPaymentId} удален`,
                ];
                const extra = Extra.markup(
                    Markup.inlineKeyboard([
                        [
                            Markup.callbackButton(ctx.lang.backButtonText, 'back')
                        ]
                    ])
                );
                return global.app.paymentService.removePayment(existPaymentId).then(() =>
                    ctx.reply(rows.join('\n'), extra));
            } else {
                throw 'не найден existPaymentId';
            }
        case 'no':
            return ctx.scene.enter('wallet:payment');
        default:
            break;
    }
});
