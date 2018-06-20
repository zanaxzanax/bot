import * as Extra from "telegraf/extra";
import {CallbackQuery} from "telegram-typings";

const Composer = require('telegraf/composer');
const Markup = require('telegraf/markup');
const WizardScene = require('telegraf/scenes/wizard');

const stepHandler = new Composer();

stepHandler.on('callback_query', (ctx: Context) => {
    console.log('stepHandler');
    const query: CallbackQuery = ctx.update.callback_query;
    switch (query.data) {
        case 'back':
            return ctx.scene.enter('main');
        default:
            //const chance: number = Number(query.data);
            ctx.scene.state.chance = Number(query.data);

            const rows: string[] = [
                `Шанс проиграть: ${ctx.scene.state.chance}`,
                `Ставка:`
            ];

            let betsButtons: any[] = ctx.app.getConfig().bets
                .map((bet: number) => Markup.callbackButton(`${bet} RUB`, `${bet}`));

            betsButtons = ctx.app.utilsService.chunkArray(betsButtons, 2);

            const extra = Extra.markup(
                Markup.inlineKeyboard([
                    ...betsButtons,
                    [
                        Markup.callbackButton(ctx.lang.backButtonText, 'back')
                    ]
                ])
            );

            return ctx.reply(rows.join('\n'), extra).then(() => ctx.wizard.next());
        //  return ctx.wizard.next();
    }
});
const stepHandler2 = new Composer();

stepHandler2.on('callback_query', (ctx: Context) => {

    const query: CallbackQuery = ctx.update.callback_query;
    console.log('stepHandler2', query.data);
    switch (query.data) {
        case 'back':
            return ctx.scene.enter('game');
        default:
            // const bet: number = Number(query.data);
            // const chance: number = Number(ctx.scene.state.chance);
            ctx.scene.state.bet = Number(query.data);

            const user: IUserInfo = ctx.session.user;
            const chance: number = ctx.scene.state.chance;
            const bet: number = ctx.scene.state.bet;

            const extra = Extra.markup(
                Markup.inlineKeyboard([
                    [
                        Markup.callbackButton(ctx.lang.backButtonText, 'back')
                    ]
                ])
            );

            return ctx.app.gameService.joinPlayer(user, chance, bet)
                .then(
                    (link: ILink) => ctx.reply(link.toString(), extra),
                    (err) => ctx.app.errorService.process.call(ctx, err, extra)
                ).then(() => ctx.scene.leave());
    }
});

export const GameWizard = new WizardScene('game-wizard',
    (ctx) => {
        const rows: string[] = [
            `Шанс:`
        ];

        let chanceButtons: any[] = ctx.app.getConfig().chances
            .map((chance: number) => Markup.callbackButton(`${chance}%`, `${chance}`));

        chanceButtons = ctx.app.utilsService.chunkArray(chanceButtons, 2);

        const extra = Extra.markup(
            Markup.inlineKeyboard([
                ...chanceButtons,
                [
                    Markup.callbackButton(ctx.lang.backButtonText, 'back')
                ]
            ])
        );

        return ctx.reply(rows.join('\n'), extra).then(() => ctx.wizard.next());
    },
    stepHandler,
    stepHandler2/*
    (ctx) => {
        ctx.reply('Step 4');
        return ctx.wizard.next()
    },
    (ctx) => {
        ctx.reply('Done');
        return ctx.scene.leave()
    }*/
);