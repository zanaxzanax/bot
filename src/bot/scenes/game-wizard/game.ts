import * as Extra from "telegraf/extra";
import {CallbackQuery} from "telegram-typings";
import {game_bet} from "../game/bet/bet";

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
            //return ctx.scene.enter('game:bet', {chance});
            console.log('HERE');
            ctx.reply('hueply');
            return ctx.wizard.next();
    }
});
const stepHandler2 = new Composer();

stepHandler2.on('callback_query', (ctx: Context) => {
    console.log('stepHandler2');
    const query: CallbackQuery = ctx.update.callback_query;
    switch (query.data) {
        case 'back':
            return ctx.scene.enter('game');
        default:
            //const bet: number = Number(query.data);
            //const chance: number = Number(ctx.scene.state.chance);
            ctx.scene.state.bet = Number(query.data);
           // return ctx.scene.enter('game:bet:play', {bet, chance});
            return ctx.wizard.next();
    }
});

export const GameWizard = new WizardScene('game-wizard',
    (ctx) => {
        const rows: string[] = [
            `Шанс:`
        ];

        let chanceButtons: any[] = ctx.app.getConfig().chances
            .map((bet: number) => Markup.callbackButton(`${bet}%`, `${bet}`));

        chanceButtons = ctx.app.utilsService.chunkArray(chanceButtons, 2);

        const extra = Extra.markup(
            Markup.inlineKeyboard([
                ...chanceButtons,
                [
                    Markup.callbackButton(ctx.lang.backButtonText, 'back')
                ]
            ])
        );



         ctx.reply(rows.join('\n'), extra)/*.then(() => ctx.wizard.next())*/;
        return ctx.wizard.next();
    },
    stepHandler,
    (ctx) => {
        const chance: number = ctx.scene.state.chance;

        const rows: string[] = [
            `Шанс проиграть: ${chance}`,
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

        return ctx.reply(rows.join('\n'), extra)/*.then(() => ctx.wizard.next());*/
    },
    stepHandler2,
    (ctx) => {
        ctx.reply('Step 4');
        return ctx.wizard.next()
    },
    (ctx) => {
        ctx.reply('Done');
        return ctx.scene.leave()
    }
);