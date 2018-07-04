import {ELEMENT_STATUS, ElementModel} from "../models/element.model";
import {IElementDoc} from "../mongo/schemes";
import {ContextError} from "../errors";

export class GameService implements IGameService {

    constructor(private  app: IApp) {

    }

    test(userInfo: IUserInfo, bet: number, chance: number): Promise<IElement[]> {
        const limit: number = 2;
        return Promise.resolve()
            .then(() => this.app.mongoService.getDocs('element', {
                $or: [{
                    bet,
                    chance,
                    status: ELEMENT_STATUS.pending,
                    taken: {$lt: this._getLimitedDate()},
                    players: {$elemMatch: {id: {$ne: userInfo.id}}}
                }, {
                    bet,
                    chance,
                    status: ELEMENT_STATUS.pending,
                    taken: {$lt: this._getLimitedDate()},
                    players: {$size: 0}
                }]
            }, limit))
            .then((docs: IElementDoc[]) => {
                console.log('docs.length', docs.length);
                docs.forEach((doc) => {
                    doc.taken = Date.now();
                });
                return Promise.all(docs.map(doc => doc.save()));
            })
            .then((docs: IElementDoc[]) => {
                const elements: IElement[] = docs.map((doc: IElementDoc) => new ElementModel(doc));
                let promise: Promise<IElement[]> = Promise.resolve([]);
                for (let i = 0; i < limit; i++) {
                    promise = promise.then((result) => {
                        if (elements[i]) {
                            result.push(elements[i]);
                            return result;
                        } else {
                            return this._createElement(bet, chance).then((element: IElement) => {
                                result.push(element);
                                return result;
                            });
                        }
                    });
                }
                return promise;
            });
    }

    join(userInfo: IUserInfo, id: number): Promise<IElement> {
        return this.app.mongoService.getDoc('element', {
            id
        }).then((doc: IElementDoc) => {

            if (!doc) {
                throw new ContextError('not found');
            }

            const element: IElement = new ElementModel(doc);
            if (!element.isPending()) {
                throw new ContextError('not pending');
            }

            console.log(userInfo);

            element.join(userInfo.toPlayerInfo());

            let promise: Promise<any>;
            let result: Promise<any> = this.app.mongoService.updateDoc('element', {id: element.id}, element);

            if (element.isDone()) {

                userInfo.balance -= element.bet;

                if (element.isShortLink()) {
                    promise = Promise.resolve()
                        .then(() => this._getLastResolved(element.bet, element.chance))
                        .then((element: ElementModel) =>
                            this.app.mongoService.updateDoc('user', {id: element.loser.id},
                                {balance: {$inc: element.bet}}));

                } else {
                    const ids: number [] = element.players.map((player: IPlayer) => player.id)
                        .filter((id: number) => id !== userInfo.id);
                    promise = this.app.mongoService.updateDocs('user', {id: {$in: ids}}, {
                        balance: {$inc: element.bet / (element.players.length - 1)}
                    });
                }
                result = Promise.all([
                    this.app.mongoService.updateDoc('user', {id: userInfo.id}, {balance: userInfo.balance}),
                    promise,
                    result
                ]);
            }

            return result.then(() => element);
        });
    }

    private _getLastResolved(bet: number, chance: number): Promise<IElement> {
        return this.app.mongoService.getDoc('element', {
            bet,
            chance,
            status: ELEMENT_STATUS.done,
            //players: {$elemMatch: {id: {$ne: userInfo.id}}}
        }, {
            sort: {
                created: -1
            }
        }).then((doc: IElementDoc) => doc ? new ElementModel(doc) : null);
    }

    private _createElement(bet: number, chance: number): Promise<IElement> {
        return Promise.resolve()
            .then(() => this.app.mongoService.getNextId('element'))
            .then((id: number) => {

                return this.app.randomService.getLinkHash(id, chance).then((hash: string) => {

                    const md5: string = this.app.randomService.getMD5(hash);
                    const encryptedHash: string = this.app.randomService.encrypt(hash);
                    const status: string = ELEMENT_STATUS.pending;

                    return this.app.mongoService.updateDoc('element', {id}, {
                        id,
                        bet,
                        chance,
                        md5,
                        status,
                        hash/*: encryptedHash*/,
                        players: []
                    }).then((elementDoc: IElementDoc) => new ElementModel(elementDoc));
                });
            });
    }

    private _getLimitedDate(): number {
        console.log(Date.now() - 60000);
        return Date.now() - 60000;
    }
}
