import {CallbackQuery} from 'telegram-typings';
import * as Scene from 'telegraf/scenes/base';
import {Extra, Markup} from 'telegraf/markup';

export const wallet_withdrawal = new Scene('wallet:withdrawal');

wallet_withdrawal.enter((ctx: Context) => {

    const extra = Extra.markup(
        Markup.inlineKeyboard([
            ...global.app.paymentService.getPaymentVariants().map((variant: IPaymentVariant) => [
                Markup.callbackButton(variant.displayName, variant.method)
            ]),
            [
                Markup.callbackButton(ctx.lang.backButtonText, 'back')
            ]
        ])
    );

    const rows: string[] = [
        `Выберите способ вывода`
    ];

    return ctx.reply(rows.join('\n'), extra);
});

wallet_withdrawal.on('callback_query', (ctx: Context) => {
    const query: CallbackQuery = ctx.update.callback_query;
    const founded: IPaymentVariant = global.app.paymentService.getPaymentVariants().find((variant: IPaymentVariant) =>
        variant.method === query.data);
    if (founded) {
        ctx.scene.enter(`wallet:withdrawal:${query.data}`);
    } else {
        // TODO retry;
    }
});
