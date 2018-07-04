import {IUserDoc} from "../mongo/schemes";
import {UserInfo} from "../models";

export class TestService implements ITestService {

    constructor(private app: IApp) {

    }

    getFakeUserInfo(balance: number, id?: number): Promise<IUserInfo> {
        const obj: any = {
            id: id || Date.now(),
            is_bot: false,
            first_name: 'Виктор',
            last_name: 'Аннасхе',
            language_code: 'ru-RU',
            nickname: 'nickname'
        };
        return Promise.resolve()
            .then(() => this.app.mongoService.updateDoc('user',{id: obj.id}, obj))
            .then(() => this.app.mongoService.updateDoc('user', {id: obj.id}, {balance}))
            .then((userDoc: IUserDoc) => new UserInfo(userDoc));
    }
}
