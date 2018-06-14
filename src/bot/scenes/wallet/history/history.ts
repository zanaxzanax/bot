import {CallbackQuery} from 'telegram-typings';
import * as Scene from 'telegraf/scenes/base';
import {Markup} from 'telegraf/markup'; import {Extra} from 'telegraf/markup';

export const wallet_history = new Scene('wallet:history');
wallet_history.enter((ctx: Context) => {

    const rows: string[] = [
        `Выберите тип платежа`
    ];

    const extra = Extra.markup(
        Markup.inlineKeyboard([
            Markup.callbackButton(ctx.lang.replenishmentButtonText, 'in'),
            Markup.callbackButton(ctx.lang.withdrawalButtonText, 'out'),
        ])
    );

    return ctx.reply(rows.join('\n'), extra);
});

wallet_history.on('callback_query', (ctx: Context) => {
    const query: CallbackQuery = ctx.update.callback_query;
    switch (query.data) {
        case 'in':
            return ctx.scene.enter('wallet:history:payment');
        case 'out':
            return ctx.scene.enter('wallet:history:withdrawal');
        default:
            break;
    }
});
