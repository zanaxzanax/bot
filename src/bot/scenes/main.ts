import * as Scene from 'telegraf/scenes/base';
import {Extra} from 'telegraf/extra';
import {Markup} from 'telegraf/markup';

const settingsText: string = '⚙️' + ' Настройки';
const walletText: string = '💰' + ' Кошелек';
const playButtonText: string = '🎲' + ' Играть';
const helpText: string = 'ℹ️' + ' Помощь';

export const main = new Scene('main');
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

main.hears(walletText, (ctx) => ctx.scene.enter('wallet'));
main.hears(settingsText, (ctx) => ctx.scene.enter('settings'));
main.hears(playButtonText, (ctx) => ctx.scene.enter('game'));
