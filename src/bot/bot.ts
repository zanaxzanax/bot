import * as Stage from 'telegraf/stage';
import {SCENES} from './scenes';
import lang from '../lang/lang';
import * as Telegraf from "telegraf/telegraf";
import {EventEmitter} from "events";

// export const client = new Telegraf(process.env.BOT_TOKEN);

const session = require('telegraf/session');

const setLang = () => (ctx, next) => {
    ctx.lang = lang(ctx.from.language_code);
    return next(ctx);
};

const setApp = (app: IApp) => (ctx: Context, next) => {
    ctx.app = app;
    return next(ctx);
};

const setUser = () => (ctx: Context, next) => ctx.app.redisService.saveUserFromContext(ctx).then(() => next(ctx));


export class Bot implements IBot {

    client: any;

    constructor(private app: IApp) {

    }

    start(): Promise<any> {

        if (!this.client) {
            this.client = new Telegraf(process.env.BOT_TOKEN);

            const stage = new Stage();
            SCENES.forEach((scene: any) => stage.register(scene));

            this.client.use(session());
            this.client.use(setApp(this.app));
            this.client.use(setLang());
            this.client.use(setUser());
            this.client.use(stage.middleware());

            this.client.start((ctx: any) => ctx.scene.enter('main'));


            (this.client as any).catch((err) => {
                this.app.emit('error', err);
            });
        }

        return Promise.resolve(this.client.startPolling());
    }

    stop(): Promise<any> {
        return Promise.resolve(this.client.stop());
    }
}
