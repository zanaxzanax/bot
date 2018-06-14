import {MODELS} from '../../../../../../mongo/models/index';
import {User} from 'telegram-typings';
import * as Scene from 'telegraf/scenes/base';
import {Markup} from 'telegraf/markup'; import {Extra} from 'telegraf/markup';

const nickNameText: string = 'псевдоним';
const backText: string = '⬅️' + ' Назад';

const markup = Extra.markup(
    Markup.inlineKeyboard([
        Markup.callbackButton(backText, 'back'),
    ])
);

export const sanitize = (text: string): string => {
    const split: string[] = text.split(/\s/);
    return split.find((str: string) => !!str) || '';
};

export const validate = (pretend: string): string => {
    const minLength: number = 3;
    const maxLength: number = 12;
    if (pretend.length < 3) {
        return `Минимум - ${minLength} символа`;
    } else if (pretend.length > maxLength) {
        return `Максимум - ${maxLength} символов`;
    }
    return '';
};

export const settings_nickname_change = new Scene('settings:nickname:change');
settings_nickname_change.enter((ctx) => {
    const text: string = `Укажите Ваш новый ${nickNameText} в ответном сообщении`;
    return ctx.reply(text, markup);
});

settings_nickname_change.on('callback_query', (ctx) => {
    const data: string = ctx.update.callback_query.data;
    switch (data) {
        case 'back':
            return ctx.scene.enter('settings:nickname');
        default:
            break
    }
});

settings_nickname_change.on('text', (ctx) => {

    const user: User = ctx.from;
    const userId: number = user.id;
    const text: string = ctx.update.message.text;

    const pretend: string = sanitize(text);
    const error: string = validate(pretend);

    if (!error) {
        const replyText: string = `Изменено, Ваш новый ${nickNameText}: ${pretend}`;
        return MODELS.user.updateOne({id: userId}, {nickname: pretend})
            .then(() => {
                global.app.appService.dropUserInfo(ctx);
                return ctx.reply(replyText, markup);
            });
    } else {
        return ctx.reply(error, markup);
    }
});
