import {Telegraf} from 'telegraf';
import * as Stage from 'telegraf/stage';
import {SCENES} from './scenes';
import lang from '../lang/lang';

export const bot = new Telegraf(process.env.BOT_TOKEN);

const session = require('telegraf/session');

const setLang = () => {
    return (ctx, next) => {
        ctx.lang = lang(ctx.from.language_code);
        return next(ctx);
    }
};

const setUser = () => (ctx, next) => global.app.redisService.saveUserFromContext(ctx).then(() => next(ctx));

const stage = new Stage();
SCENES.forEach((scene: any) => stage.register(scene));

bot.use(session());
bot.use(setLang());
bot.use(setUser());
bot.use(stage.middleware());

bot.start((ctx: any) => ctx.scene.enter('main'));
//
// bot.catch((err) => {
//     console.error('Ooops', err);
// });
