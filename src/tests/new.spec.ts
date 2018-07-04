import {App} from '../app';
//import {beforeAll, describe, test} from 'jest';
import {RedisClient} from "redis";
/// <reference path="../node_modules/@types/jest/index.d.ts" />

let app: App;

beforeAll(() => {
    app = new App();
    return app.start().then(() => {
        //
    });
});

describe('chain', () => {

    test('get', () => {
        return Promise.resolve()
            .then(() => app.testService.getFakeUserInfo(100, Date.now()))
            .then((userInfo: any) => app.gameService.test(userInfo, 10, 10))
            .then((result) => console.log(result));
    });

    test('join', () => {
        return Promise.resolve()
            .then(() => app.testService.getFakeUserInfo(100, 123))
            .then((userInfo: any) => app.gameService.join(userInfo, 2))
            .then((result) => console.log(result));
    });
});
