import {CallbackQuery} from 'telegram-typings';
import * as Scene from 'telegraf/scenes/base';
import {Markup} from 'telegraf/markup'; import {Extra} from 'telegraf/extra';

export const game_bet = new Scene('game:bet');
game_bet.enter((ctx: Context) => {

    const chance: number = ctx.scene.state.chance;

    const rows: string[] = [
        `Шанс проиграть: ${chance}`,
        `Ставка:`
    ];

    let betsButtons: any[] = ctx.app.getConfig().bets
        .map((bet: number) => Markup.callbackButton(`${bet} RUB`, `${bet}`));

    betsButtons = ctx.app.utilsService.chunkArray(betsButtons, 2);

    const extra = Extra.markup(
        Markup.inlineKeyboard([
            ...betsButtons,
            [
                Markup.callbackButton(ctx.lang.backButtonText, 'back')
            ]
        ])
    );

    return ctx.reply(rows.join('\n'), extra);
});

game_bet.on('callback_query', (ctx: Context) => {
    const query: CallbackQuery = ctx.update.callback_query;
    switch (query.data) {
        case 'back':
            return ctx.scene.enter('game');
        default:
            const bet: number = Number(query.data);
            const chance: number = Number(ctx.scene.state.chance);
            return ctx.scene.enter('game:bet:play', {bet, chance});
    }
});
