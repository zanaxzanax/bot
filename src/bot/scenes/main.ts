import * as Markup from 'telegraf/markup';
import * as Extra from 'telegraf/extra';
import {SceneFabric} from '../scene-fabric';

export const main: any = SceneFabric('main');

main.enter((ctx: Context) => {

    const markup = Extra.markup(
        Markup.keyboard([
            [
                Markup.button(ctx.lang.playButtonText),
                Markup.button(ctx.lang.walletButtonText)
            ],
            [
                Markup.button(ctx.lang.settingsButtonText),
                Markup.button(ctx.lang.helpButtonText)
            ]
        ])
    );

    const nickname: string = ctx.session.user.nickname;

    let welcomeText: string = 'Welcome';
    if (nickname) {
        welcomeText += `, ${nickname}`;
    }
    return ctx.reply(welcomeText, markup);
});

