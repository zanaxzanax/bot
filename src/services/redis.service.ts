import {UserInfo} from "../models";
import {ContextMessageUpdate} from "telegraf";

export class RedisService implements IRedisService {

    constructor(private  app: IApp) {
    }

    saveUserInfo(userInfo: IUserInfo): Promise<any> {
        return Promise.resolve()
            .then(() => this.app.redis.client.hgetallAsync(`users:${userInfo.id}`)
                .then((user: string) => {
                    if (user) {
                        return userInfo;
                    } else {
                        return this.app.redis.client.hmsetAsync(`users:${userInfo.id}`, userInfo.toJSON())
                            .then(() => userInfo);
                    }
                }));
    }


    saveUserFromContext(ctx: ContextMessageUpdate): Promise<IUserInfo> {

        const chat: any = ctx.chat;
        const user: any = ctx.from;
        const chatId: number = chat.id;

        const userInfo = new UserInfo({
            ...user,
            chat_id: chatId
        });

        return this.app.redisService.saveUserInfo(userInfo);
    }

    checkInitLinks(): Promise<any> {
        const config: IConfig = this.app.getConfig();
        return Promise.all(
            config.chances.reduce((result: any[], chance: number) => {
                config.bets.forEach((bet: number) => {
                    result.push(this._checkInitLink(bet, chance));
                });
                return result;
            }, [])
        );
    }

    private _checkInitLink(bet: number, chance: number) {
        return this.app.redis.client.lrangeAsync(`links:${bet}:${chance}`, 0, 1).then((results: string[]) => {
            if (results.length === 0) {
                return this.app.gameService.createInitialLink(bet, chance);
            }
        })
    }
}