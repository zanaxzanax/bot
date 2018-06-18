import {App} from '../app';
import * as jest from 'jest';
import {RedisClient} from "redis";
const updates = require('./updates.json');
let app: App;

beforeAll(() => {
    app = new App();
    return app.start();
});

describe('chain', () => {

    test('Юзер нажал Старт', () => {
       return app.bot.client.handleUpdates([updates.start]);
    });



});
