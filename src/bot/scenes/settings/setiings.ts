import * as Scene from 'telegraf/scenes/base';
import * as Markup from 'telegraf/markup';
import * as Extra from 'telegraf/extra';

const walletsText: string = `💰` + ' Кошельки';

export const settings = new Scene('settings');
settings.enter((ctx: Context) => {
    const markup = Extra.markup(
        Markup.inlineKeyboard([
            [
                Markup.callbackButton(ctx.lang.nicknameButtonText, 'nickname'),
                Markup.callbackButton(walletsText, 'wallets')
            ],
            [Markup.callbackButton(ctx.lang.backButtonText, 'back')]
        ])
    );
    return ctx.reply(ctx.lang.settings, markup);
});

settings.on('callback_query', (ctx) => {
    const data: string = ctx.update.callback_query.data;
    switch (data) {
        case 'back':
            return ctx.scene.enter('main');
        case 'nickname':
            return ctx.scene.enter('settings:nickname');
        case 'wallets':
            return ctx.scene.enter('settings:wallets');
        default:
            break
    }
});
