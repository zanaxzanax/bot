import * as Scene from 'telegraf/scenes/base';
import {Markup} from 'telegraf/markup'; import {Extra} from 'telegraf/markup';
import {UserSchemeInterface, UserWalletSchemeInterface} from '../../../../../mongo/schemes/index';
import {MODELS} from '../../../../../mongo/models/index';
import {Wallet} from '../../../../../models/wallets/index';

const addText: string = '➕' + ' Добавить';
const deleteText: string = '🗑️' + ' Удалить';
const backText: string = '⬅️' + ' Назад';
const prevText: string = '⬅️';
const nextText: string = '➡️';

const replyByWallets: any = (ctx, wallets, index, initial: boolean = false): Promise<any> => {
    const hasWallets: boolean = !!wallets.length;
    const markup = Extra.markup(
        Markup.inlineKeyboard([
            [Markup.callbackButton(addText, 'add')],
            [Markup.callbackButton(backText, 'back')]
        ])
    );
    if (!hasWallets) {
        const text: string = 'У вас нет кошельков';
        return ctx.reply(text, markup);
    } else {
        const walletId: any = wallets[index];

        if (!walletId) {
            throw 'Кошелек не найден';
        }

        return MODELS.userWallet.findOne({id: walletId}).then((walletDoc: UserWalletSchemeInterface) => {
            ctx.scene.state.walletId = walletId;
            const wallet: Wallet = global.app.walletsHolder.getWalletByMethod(walletDoc.method, true);
            if (!wallet) {
                //TODO
            }
            const rows: string[] = [
                `Ваши существующие кошельки:`,
                `${wallet.displayName}: ${walletDoc.account}`
            ];
            const actions: any[] = [Markup.callbackButton(deleteText, 'delete')];
            if (index > 0) {
                ctx.scene.state.prev = index - 1;
                actions.unshift(Markup.callbackButton(prevText, 'prev'));
            }
            if (index < wallets.length - 1) {
                ctx.scene.state.next = index + 1;
                actions.push(Markup.callbackButton(nextText, 'next'));
            }
            const markupExtended = Extra.markup(
                Markup.inlineKeyboard([
                    [...actions],
                    [
                        Markup.callbackButton(backText, 'back'),
                        Markup.callbackButton(addText, 'add')
                    ]
                ])
            );
            if (!initial) {
                return ctx.editMessageText(rows.join('\n'), markupExtended);
            } else {
                return ctx.reply(rows.join('\n'), markupExtended);
            }
        });
    }
};

export const settings_wallets = new Scene('settings:wallets');
settings_wallets.enter((ctx) => {
    const userId: number = ctx.from.id;
    return global.app.appService.getUserById(userId).then((user: UserSchemeInterface) =>
        replyByWallets(ctx, user.wallets, 0, true));
});

settings_wallets.on('callback_query', (ctx) => {

    const userId: number = ctx.from.id;
    const data: string = ctx.update.callback_query.data;

    switch (data) {
        case 'back':
            return ctx.scene.enter('settings');
        case 'add':
            return ctx.scene.enter('settings:wallets:add');
        case 'prev':
        case 'next':
            const index: number = data === 'prev' ? ctx.scene.state.prev : ctx.scene.state.next;
            return global.app.appService.getUserById(userId)
                .then((user: UserSchemeInterface) => replyByWallets(ctx, user.wallets, index));
        case 'delete':
            const walletId: number = ctx.scene.state.walletId;
            return global.app.appService.deleteUserWallet(userId, walletId).then(() => ctx.scene.reenter());
        default:
            break
    }
});
