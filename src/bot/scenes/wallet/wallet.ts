import {CallbackQuery} from 'telegram-typings';
import * as Markup from 'telegraf/markup';
import * as Extra from 'telegraf/extra';
import {SceneFabric} from '../../scene-fabric';

export const wallet = SceneFabric('wallet');

wallet.enter((ctx: Context) => {

    const rows: string[] = [
        `Баланс: ${ctx.session.user.balance.toFixed(2)} RUB`
    ];

    const extra = Extra.markup(
        Markup.inlineKeyboard([
            [
                Markup.callbackButton(ctx.lang.replenishmentButtonText, 'in'),
                Markup.callbackButton(ctx.lang.withdrawalButtonText, 'out'),
                Markup.callbackButton(ctx.lang.historyButtonText, 'history'),
            ],
            [
                Markup.callbackButton(ctx.lang.backButtonText, 'back')
            ]
        ])
    );

    return ctx.reply(rows.join('\n'), extra);
});

wallet.on('callback_query', (ctx) => {
    const query: CallbackQuery = ctx.update.callback_query;
    switch (query.data) {
        case 'in':
            return ctx.scene.enter('wallet:payment');
        case 'out':
            return ctx.scene.enter('wallet:withdrawal');
        case 'history':
            return ctx.scene.enter('wallet:history');
        case 'back':
            return ctx.scene.enter('main');
        default:
            break;
    }
});
