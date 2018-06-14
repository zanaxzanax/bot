import {CallbackQuery, User} from 'telegram-typings';
import * as Scene from 'telegraf/scenes/base';
import {Extra, Markup} from 'telegraf/markup';

export const wallet_payment = new Scene('wallet:payment');

wallet_payment.enter((ctx: Context) => {

    const rows: string[] = [
        `Выберите способ пополнения`
    ];

    const extra = Extra.markup(
        Markup.inlineKeyboard([
            ...global.app.paymentService.getPaymentVariants().map((variant: IPaymentVariant) => [
                Markup.callbackButton(variant.displayName, variant.method)
            ]),
            [
                Markup.callbackButton(ctx.lang.deleteButtonText, 'back')
            ]
        ])
    );

    return ctx.reply(rows.join('\n'), extra);
});

wallet_payment.on('callback_query', (ctx) => {
    const query: CallbackQuery = ctx.update.callback_query;
    const user: User = ctx.from;
    const userId: number = user.id;
    switch (query.data) {
        case 'back':
            return ctx.scene.enter('wallet');
        case 'delete':
            return ctx.scene.enter('wallet:payment:remove', {
                existPaymentId: ctx.session.existPaymentId
            });
        default:
            const method: string = query.data;
            const exist: IPaymentModel = global.app.paymentService.getUserPendingPaymentByMethod(userId, method);
            if (exist) {
                const rows: string[] = [
                    `Вы уже имеете ожидающий оплаты запрос на пополнение:`,
                    `${exist.toString()}`
                ];
                ctx.session.existPaymentId = exist.id;
                const extra = Extra.markup(
                    Markup.inlineKeyboard([
                        [
                            Markup.callbackButton(ctx.lang.deleteButtonText, 'delete')
                        ],
                        [
                            Markup.callbackButton(ctx.lang.backButtonText, 'back')
                        ]
                    ])
                );
                return ctx.reply(rows.join('\n'), extra);
            } else {
                return ctx.scene.enter(`wallet:payment:${method}`);
            }
    }
});
