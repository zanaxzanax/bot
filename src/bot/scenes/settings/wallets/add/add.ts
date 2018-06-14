import * as Scene from 'telegraf/scenes/base';
import {Markup} from 'telegraf/markup'; import {Extra} from 'telegraf/markup';
import {Wallet} from '../../../../../../models/wallets/index';
import {UserWalletSchemeInterface} from '../../../../../../mongo/schemes/index';

const backText: string = '⬅️' + ' Назад';

export const settings_wallets_add = new Scene('settings:wallets:add');
settings_wallets_add.enter((ctx) => {

    const rows: string[] = [`Выберите возможный вариант`];

    const extra = Extra.markup(Markup.inlineKeyboard([
        ...global.app.walletsHolder.getPaymentVariants().map((variant: IPaymentVariant) => ([{
            text: variant.displayName,
            callback_data: variant.method
        }])),
        [Markup.callbackButton(backText, 'back')]
    ]));

    return ctx.reply(rows.join('\n'), extra);
});

const replyByMethod: any = (ctx, method: string): Promise<any> => {
    const wallet: Wallet = global.app.walletsHolder.getWalletByMethod(method, true);
    const extra = Extra.markup(Markup.inlineKeyboard([
        [Markup.callbackButton(backText, 'back')]
    ]));
    const rows: string[] = [
        `Пришлите реквизиты своего ${wallet.displayName} кошелька в формате:`,
        wallet.getAccountFormat()
    ];
    ctx.scene.state.method = method;
    return ctx.reply(rows.join('\n'), extra);
};

settings_wallets_add.on('callback_query', (ctx) => {

    const data: string = ctx.update.callback_query.data;

    switch (data) {
        case 'back':
            return ctx.scene.enter('settings:wallets');
        default:
            return replyByMethod(ctx, data);
    }
});

settings_wallets_add.on('text', (ctx) => {

    const userId: number = ctx.from.id;
    const text: string = ctx.update.message.text;
    const method: string = ctx.scene.state.method;

    if (!method) {
        return ctx.scene.reenter();
    }

    const wallet: Wallet = global.app.walletsHolder.getWalletByMethod(method, true);

    if (wallet.isValidAccount(text)) {
        const options: any = {
            user_id: userId,
            account: text,
            method
        };
        return global.app.appService.addWalletToUser(userId, options).then((doc: UserWalletSchemeInterface) => {
            const extra = Extra.markup(Markup.inlineKeyboard([
                [Markup.callbackButton(backText, 'back')]
            ]));
            const rows: string[] = [
                `Добавлен ${wallet.displayName} аккаунт:`,
                `${doc.account}`,
            ];
            return ctx.reply(rows.join('\n'), extra);
        });
    } else {
        return replyByMethod(ctx, method);
    }
});
