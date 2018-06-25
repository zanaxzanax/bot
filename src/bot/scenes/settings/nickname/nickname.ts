import * as Markup from 'telegraf/markup';
import * as Extra from 'telegraf/extra';
import * as Composer from 'telegraf/composer';
import * as WizardScene from 'telegraf/scenes/wizard';

const nickNameText: string = 'псевдоним';

const stepHandler2 = new Composer();
stepHandler2.on('callback_query', (ctx) => {
    const data: string = ctx.update.callback_query.data;
    switch (data) {
        case 'back':
            return ctx.scene.enter('settings');
        case 'change':
            const text: string = `Укажите Ваш новый ${nickNameText} в ответном сообщении`;
            return ctx.reply(text).then(() => ctx.wizard.next());
        default:
            break
    }
});

const stepHandler3 = new Composer();
stepHandler3.on('text', (ctx: Context) => {

    const user: IUserInfo = ctx.session.user;
    const text: string = ctx.update.message.text;

    const pretend: string = ctx.app.utilsService.sanitize(text);
    const error: string = ctx.app.utilsService.validate(pretend);

    if (!error) {
        ctx.app.redisService.saveUserField(user, 'nickname', pretend).then(() => {
            const replyText: string = `Изменено, Ваш новый ${nickNameText}: ${pretend}`;
            return ctx.reply(replyText).then(() => ctx.scene.leave());
        });
    } else {
        return ctx.reply(error);
    }
});

export const settings_nickname = new WizardScene('settings:nickname',
    (ctx) => {
        const user: IUserInfo = ctx.session.user;
        const hasNick: boolean = !!user.nickname;
        const text = hasNick ? `Ваш текущий ${nickNameText}: ${user.nickname}`
            : `Вы пока не установили ${nickNameText}`;
        const markup = Extra.markup(
            Markup.inlineKeyboard([
                [Markup.callbackButton(ctx.lang.changeButtonText, 'change')],
                [Markup.callbackButton(ctx.lang.backButtonText, 'back')]
            ])
        );
        return ctx.reply(text, markup).then(() => ctx.wizard.next());
    },
    stepHandler2,
    stepHandler3
);
