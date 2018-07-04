import {IUserDoc} from "../mongo/schemes";

export class UserInfo implements IUserInfo {

    id: number;
    nickname: string;
    first_name: string;
    last_name: string;
    language_code: string;
    balance: number;
    // chat_id: number;
    is_bot: boolean;

    constructor(userDoc: IUserDoc) {
        this.id = Number(userDoc.id);
        // this.chat_id = Number(userDocInterface.chat_id);
        this.is_bot = userDoc.is_bot;
        this.balance = userDoc.balance;
        this.nickname = userDoc.nickname;
        this.first_name = userDoc.first_name;
        this.last_name = userDoc.last_name;
        this.language_code = userDoc.language_code;
    }

    toPlayerInfo(): IPlayer {
        return {
            id: this.id,
            nickname: this.nickname || this.getName()
        }
    }

    getName(): string {
        return `${this.first_name} ${this.last_name}`;
    }

    // toJSON(): any {
    //     return {
    //         id: this.id,
    //         balance: this.balance,
    //         nickname: this.nickname || '',
    //         first_name: this.first_name,
    //         last_name: this.last_name,
    //         language_code: this.language_code,
    //     };
    // }

}
