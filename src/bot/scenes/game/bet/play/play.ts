import * as Scene from 'telegraf/scenes/base';
import {Markup} from 'telegraf/markup'; import {Extra} from 'telegraf/extra';
import {CallbackQuery} from 'telegram-typings';

export const game_bet_play = new Scene('game:bet:play');

game_bet_play.enter((ctx: Context) => {

    const user: IUserInfo = ctx.session.user;
    const chance: number = ctx.scene.state.chance;
    const bet: number = ctx.scene.state.bet;

    const rows: string[] = [
        `Шанс проиграть: ${ctx.scene.state.chance}%`,
        `Ставка: ${ctx.scene.state.bet} RUB`
    ];

    const extra = Extra.markup(
        Markup.inlineKeyboard([
            [
                Markup.callbackButton(ctx.lang.backButtonText, 'back')
            ]
        ])
    );

    return ctx.app.gameService.joinPlayer(user, chance, bet)
        .then(
            (link: ILink) => ctx.reply(link.toString(), extra),
            (err) => ctx.app.errorService.process.call(ctx, err, extra)
        );
});

game_bet_play.on('callback_query', (ctx: Context) => {
    const query: CallbackQuery = ctx.update.callback_query;
    switch (query.data) {
        case 'back':
            return ctx.scene.enter('game');
        default:
        // const chance: number = Number(query.data);
        // return ctx.scene.enter('game:bet', {chance});
    }
});
