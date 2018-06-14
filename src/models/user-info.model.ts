
export class UserInfo implements IUserInfo {

    id: number;
    nickname: string;
    first_name: string;
    last_name: string;
    language_code: string;
    balance: number;
    chat_id: number;
    is_bot: boolean;

    constructor(userDocInterface: UserDocInterface) {
        this.id = Number(userDocInterface.id);
        this.chat_id = Number(userDocInterface.chat_id);
        this.is_bot = userDocInterface.is_bot === 'true';
        this.balance = Number(userDocInterface.balance || 0);
        this.nickname = userDocInterface.nickname;
        this.first_name = userDocInterface.first_name;
        this.last_name = userDocInterface.last_name;
        this.language_code = userDocInterface.language_code;
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

    toJSON(): any {
        return {
            id: this.id,
            balance: this.balance,
            nickname: this.nickname || '',
            first_name: this.first_name,
            last_name: this.last_name,
            language_code: this.language_code,
            chat_id: this.chat_id
        };
    }

}
