import {CallbackQuery} from 'telegram-typings';
import * as Scene from 'telegraf/scenes/base';
import {Markup} from 'telegraf/markup'; import {Extra} from 'telegraf/markup';
import {CHANCES} from '../../../app';

export const game = new Scene('game');
game.enter((ctx: Context) => {

    const rows: string[] = [
        `Шанс:`
    ];

    let chanceButtons: any[] = global.app.getConfig().chances.map((bet: number) => Markup.callbackButton(`${bet}%`, `${bet}`));

    chanceButtons = global.app.utilsService.chunkArray(chanceButtons, 2);

    // TODO ограничить участие, если бабок мало

    const extra = Extra.markup(
        Markup.inlineKeyboard([
            ...chanceButtons,
            [
                Markup.callbackButton(ctx.lang.backButtonText, 'back')
            ]
        ])
    );

    return ctx.reply(rows.join('\n'), extra);
});

game.on('callback_query', (ctx: Context) => {
    const query: CallbackQuery = ctx.update.callback_query;
    switch (query.data) {
        case 'back':
            return ctx.scene.enter('main');
        default:
            const chance: number = Number(query.data);
            return ctx.scene.enter('game:bet', {chance});
    }
});
