import * as Scene from 'telegraf/scenes/base';
import {Markup} from 'telegraf/markup'; import {Extra} from 'telegraf/markup';
import {UserSchemeInterface} from '../../../../../mongo/schemes/index';

const changeText: string = '✏️' + ' Сменить';
const nickNameText: string = 'псевдоним';
const backText: string = '⬅️' + ' Назад';

export const settings_nickname = new Scene('settings:nickname');
settings_nickname.enter((ctx) => {
    const userId: number = ctx.from.id;
    return global.app.appService.getUserById(userId).then((user: UserSchemeInterface) => {
        const hasNick: boolean = !!user.nickname;
        const text = hasNick ? `Ваш текущий ${nickNameText}: ${user.nickname}`
            : `Вы пока не установили ${nickNameText}`;
        const markup = Extra.markup(
            Markup.inlineKeyboard([
                [Markup.callbackButton(changeText, 'change')],
                [Markup.callbackButton(backText, 'back')]
            ])
        );
        return ctx.reply(text, markup);
    });
});

settings_nickname.on('callback_query', (ctx) => {
    const data: string = ctx.update.callback_query.data;
    switch (data) {
        case 'back':
            return ctx.scene.enter('settings');
        case 'change':
            return ctx.scene.enter('settings:nickname:change');
        default:
            break
    }
});
