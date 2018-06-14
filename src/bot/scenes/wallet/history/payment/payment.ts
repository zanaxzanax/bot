import {CallbackQuery, User} from 'telegram-typings';
import * as Scene from 'telegraf/scenes/base';
import * as moment from 'moment';
import {PaymentSchemeInterface} from '../../../../../../mongo/schemes/index';
import {Markup} from 'telegraf/markup'; import {Extra} from 'telegraf/markup';

interface ProcessedResult {
    text: string,
    options: object
}

const processResult = (ctx: Context, user: User, result: PagedResult): ProcessedResult => {
    const data: PaymentSchemeInterface[] = result.data;
    const rows: string[] = data.map((item: PaymentSchemeInterface) =>
        `${moment.utc(item.created).locale(user.language_code).format('LLL [UTC]')} #${item.id} ${item.status}`);
    if (!data.length) {
        rows.unshift(`Нет записей`);
    } else {
        rows.unshift(`Список последних платежей`);
    }
    const text: string = rows.join('\n');
    let options: object = null;
    // TODO кнопка чекнуть оплату
    if (result.prev || result.next) {
        const keyboard: any[] = [];
        if (result.prev) {
            keyboard.push(Markup.callbackButton(ctx.lang.prevButtonText, result.prev));
        }
        if (result.next) {
            keyboard.push(Markup.callbackButton(ctx.lang.nextButtonText, result.next));
        }
        options = Extra.markup(Markup.inlineKeyboard([
            keyboard,
            [Markup.callbackButton(ctx.lang.backButtonText, 'back')]
        ]));
    }
    return {text, options};
};

const replyByPage = (ctx: Context, page: number, initial: boolean = false): Promise<any> => {
    const user: User = ctx.from;
    const userId: number = user.id;
    return global.app.paymentService.getPayments(userId, page).then((result: PagedResult) => {
        const processedResult: ProcessedResult = processResult(ctx, user, result);
        const func = !initial ? ctx.editMessageText : ctx.reply;
        return func(processedResult.text, processedResult.options);
    });
};

export const wallet_history_payment = new Scene('wallet:history:payment');
wallet_history_payment.enter((ctx) => replyByPage(ctx, 0, true));

wallet_history_payment.on('callback_query', (ctx: Context) => {
    const query: CallbackQuery = ctx.update.callback_query;
    switch (query.data) {
        case 'back':
            return ctx.scene.enter('wallet:history');
        default:
            const page: number = Number(query.data);
            return replyByPage(ctx, page);
    }
});
