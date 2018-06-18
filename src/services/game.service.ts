import {Link, linkStatuses} from '../models';
import * as _ from 'lodash';

export class GameService implements IGameService {

    constructor(private  app: IApp) {

    }

    joinPlayer(...args): Promise<ILink> {
        return this.app.queue.push(this._joinPlayer.bind(this), ...args);
    }

    createInitialLink(bet: number, chance: number): Promise<any> {
        return this._createLink(this.app.admin, bet, chance, null, {
            status: linkStatuses.done,
            loser: this.app.admin.toPlayerInfo()
        });
    }

    private _joinPlayer(userInfo: IUserInfo, bet: number, chance: number): Promise<ILink> {
        if (bet > userInfo.balance) {
            return Promise.reject(new Error('low balance'));
        }
        return Promise.resolve()
            .then(() => this._getLink(userInfo, bet, chance))
            .then((link: ILink) => {
                link.join(userInfo.toPlayerInfo());
                const multi = this.app.redis.client.multi();
                if (link.isDone()) {
                    userInfo.balance -= bet;
                    if (link.isShortLink()) {
                        const prevLink: ILink = link.getPrevLink();
                        multi.hset(`users:${userInfo.id}`, `balance`, String(userInfo.balance))
                            .hincrby(`users:${prevLink.loser.id}`, `balance`, bet);
                    } else {
                        link.players.forEach((player: IPlayer) => {
                            if (player.id === userInfo.id) {
                                multi.hset(`users:${userInfo.id}`, `balance`, userInfo.balance as any)
                            } else {
                                multi.hincrby(`users:${player.id}`, `balance`, bet / (link.players.length - 1))
                            }
                        });
                    }
                }
                return multi.lset(`links:${bet}:${chance}`, 0, JSON.stringify(link))
                    .execAsync().then(() => link);
            });
    }

    private _buildLink(curLinkJSON: LinkDocInterface, prevLink: ILink): ILink {
        const result: ILink = new Link(curLinkJSON);
        if (prevLink) {
            result.prevLink = prevLink;
            result.loserPosition = this._getLinkLoserPosition(prevLink.hash);
        }
        return result;
    }

    private _getLink(userInfo: IUserInfo, bet: number, chance: number): Promise<ILink> {
        return Promise.resolve()
            .then(() => this.app.redis.client.lrangeAsync(`links:${bet}:${chance}`, 0, 1))
            .then((results: any) => {
                const lastLink: ILink = results.length === 2 ?
                    this._buildLink(JSON.parse(results[0]), this._buildLink(JSON.parse(results[1]), null)) :
                    this._buildLink(JSON.parse(results[0]), null);
                if (lastLink.isDone()) {
                    return this._createLink(userInfo, bet, chance, lastLink);
                } else {
                    return lastLink;
                }
            });
    }

    private _createLink(userInfo: IUserInfo, bet: number, chance: number, prevLink: ILink, options?: any): Promise<ILink> {
        return Promise.all([
            this.app.redis.client.incrAsync('links:id'),
            this.app.randomService.getLinkHash(chance),
        ]).then((results: any[]) => {

            const id: number = results[0];
            const hash: string = results[1];

            const md5: string = this.app.randomService.getMD5(hash);
            const encryptedHash: string = this.app.randomService.encrypt(hash);
            const status: string = linkStatuses.pending;

            const link: ILink = this._buildLink(_.extend(
                {
                    id,
                    hash: encryptedHash,
                    bet,
                    chance,
                    md5,
                    status,
                    players: [userInfo.toPlayerInfo()]
                },
                options
            ), prevLink);

            return this.app.redis.client
                .lpushAsync(`links:${bet}:${chance}`, JSON.stringify(link))
                .then(() => link);
        });
    }

    private _getLinkLoserPosition(encryptedHash: string): number {
        const regExp: RegExp = /\[(\d+)\]/;
        const decryptedHash: string = this.app.randomService.decrypt(encryptedHash);
        return Number(regExp.exec(decryptedHash)[1]);
    }
}
