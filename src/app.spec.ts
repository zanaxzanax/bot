import {App} from './app';
//import {beforeAll, describe, test} from 'jest';
import {Link, UserInfo} from './models';

let app: App;

beforeAll(() => {
    app = new App();
    return app.start();
});


function getContext(id: number, balance?: number): any {
    return {
        chat: {
            id,
            first_name: 'Виктор',
            last_name: 'Аннасхе',
            type: 'private'
        },
        from: {
            id,
            is_bot: false,
            first_name: 'Виктор',
            last_name: 'Аннасхе',
            language_code: 'ru-RU',
            balance
        }
    };
}

function saveUserFromContext(ctx: any): Promise<UserInfo> {

    const chat: any = ctx.chat;
    const user: any = ctx.from;
    const chatId: number = chat.id;

    const userInfo = new UserInfo({
        ...user,
        chat_id: chatId
    });

    return app.redisService.saveUserInfo(userInfo);
}

function joinPlayer(): Promise<Link> {
    return Promise.resolve()
        .then(() => saveUserFromContext(getContext(Date.now(), 100)))
        .then((userInfo: UserInfo) => app.gameService.joinPlayer(userInfo, 10, 20));
}

describe('chain', () => {

    test('flush db', () => {
        return app.redis.client.flushallAsync();
    });

    test('flush db1', () => {
        return app.stop();
    });

    test('asd', () => {
        return Promise.resolve()
            .then(() => saveUserFromContext(getContext(123, 100)))
            .then(() => saveUserFromContext(getContext(123, 90)));
    });

    test('join parallel player', () => {
        return Promise.all([
            joinPlayer(),
            // joinPlayer(),
            // joinPlayer(),
            // joinPlayer(),
            // joinPlayer(),
            // joinPlayer(),
            // joinPlayer(),
            // joinPlayer()
        ]).catch((e) => {
            console.error(e);
        }).then((res) => {
            console.log(res);
        });
    });

});
