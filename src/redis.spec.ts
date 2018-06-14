// import {RandomService} from './new/services/random.service';
// import {User} from 'telegram-typings';
// import {Queue} from './new/models/utils/queue';
//
// const redis = require('redis-promisify');
//
// interface LinkDocInterface {
//     id: number;
//     hash: string;
//     bet: number;
//     chance: number;
//     // prev:
//     md5: string;
//     status: string;
//     players: PlayerInterface[];
//     loser: PlayerInterface;
// }
//
// interface UserDocInterface {
//     id: string;
//     is_bot: string;
//     first_name: string;
//     last_name: string;
//     language_code: string;
//     chat_id: string;
//     balance: string;
//     nickname: string;
// }
//
// interface UserContextInfo {
//     id: number;
//     nickname: string;
//     first_name: string;
//     last_name: string;
//     language_code: string;
//     balance: number;
//     toPlayerInfo: () => PlayerInterface;
//     getName: () => string;
// }
//
// interface PlayerInterface {
//     id: number;
//     nickname: string;
// }
//
// export class UserInfo implements UserContextInfo {
//
//     id: number;
//     nickname: string;
//     first_name: string;
//     last_name: string;
//     language_code: string;
//     balance: number;
//
//     constructor(userDocInterface: UserDocInterface) {
//         this.id = Number(userDocInterface.id);
//         this.balance = Number(userDocInterface.balance || 0);
//         this.nickname = userDocInterface.nickname;
//         this.first_name = userDocInterface.first_name;
//         this.last_name = userDocInterface.last_name;
//         this.language_code = userDocInterface.language_code;
//     }
//
//     toPlayerInfo(): PlayerInterface {
//         return {
//             id: this.id,
//             nickname: this.nickname || this.getName()
//         }
//     }
//
//     getName(): string {
//         return `${this.first_name} ${this.last_name}`;
//     }
// }
//
// function getContext(id: number, balance?: number): any {
//     return {
//         chat: {
//             id,
//             first_name: 'Виктор',
//             last_name: 'Аннасхе',
//             type: 'private'
//         },
//         from: {
//             id,
//             is_bot: false,
//             first_name: 'Виктор',
//             last_name: 'Аннасхе',
//             language_code: 'ru-RU',
//             balance
//         }
//     };
// }
//
// const context = {
//     chat: {
//         id: 214697709,
//         first_name: 'Виктор',
//         last_name: 'Аннасхе',
//         type: 'private'
//     },
//     from: {
//         id: 214697709,
//         is_bot: false,
//         first_name: 'Виктор',
//         last_name: 'Аннасхе',
//         language_code: 'ru-RU'
//     }
// };
//
// class Link {
//
//     id: number;
//     bet: number;
//     chance: number;
//     md5: string;
//     status: string;
//     hash: string;
//     players: PlayerInterface[];
//     loser: PlayerInterface;
//
//     constructor(linkDocInterface: LinkDocInterface) {
//         this.id = linkDocInterface.id;
//         this.bet = linkDocInterface.bet;
//         this.chance = linkDocInterface.chance;
//         this.md5 = linkDocInterface.md5;
//         this.status = linkDocInterface.status;
//         this.hash = linkDocInterface.hash;
//         this.players = linkDocInterface.players;
//         this.loser = linkDocInterface.loser;
//     }
//
//     isDone(): boolean {
//         return this.status === 'done';
//     }
//
//     isShortLink(): boolean {
//         return this.players.length === 1;
//     }
//
//     join(player: PlayerInterface) {
//         if (!this.players.find((p) => p.id === player.id)) {
//             this.players.push(player);
//         }
//         const loserIndex: number = this._getLinkLoserPosition(this.hash);
//         console.log('loserIndex', loserIndex);
//         if (this.players.length - 1 === loserIndex) {
//             this.status = 'done';
//             this.loser = this.players[this.players.length - 1];
//         }
//     }
//
//     private _getLinkLoserPosition(encryptedHash: string): number {
//         const regExp: RegExp = /\[(\d+)\]/;
//         const decryptedHash: string = randomService.decrypt(encryptedHash);
//         return Number(regExp.exec(decryptedHash)[1]);
//     }
//
//     // toJSON(): any {
//     //     return {
//     //         id: this.id,
//     //         bet: this.bet,
//     //         chance: this.chance,
//     //         md5: this.md5,
//     //         status: this.status,
//     //         hash: this.hash,
//     //         players: this.players,
//     //         loser: this.loser,
//     //     }
//     // }
// }
//
// let client, randomService;
// let queue: Queue<Link>;
//
// function checkHashes(chance: number): Promise<string> {
//     const limit: number = 20;
//     return client.lrangeAsync(`hashes:${chance}`, 0, limit).then((results: string[]) => {
//         console.log(results);
//         if (results.length < limit) {
//             return Promise.all(Array.from({length: limit - results.length})
//                 .map(() => randomService.getLinkHash(chance)))
//                 .then((hashes: string[]) => {
//                     const multi: any = client.multi();
//                     hashes.forEach((hash: string) => {
//                         multi.lpush(`hashes:${chance}`, JSON.stringify({
//                             hash: randomService.encrypt(hash),
//                             md5: randomService.getMD5(hash),
//                         }));
//                     });
//                     return multi.execAsync();
//                 });
//         }
//     });
// }
//
// function getHash(chance: number): Promise<any> {
//     return randomService.getLinkHash(chance).then((hash: string) => {
//         return Promise.resolve()
//             .then(() => client.lpopAsync(`hashes:${chance}`))
//             .then((result: string) => {
//                 const hashItem: any = JSON.parse(result);
//                 return client.multi()
//                     .lpush(`used-hashes:${chance}`, JSON.stringify(hashItem))
//                     .rpush(`hashes:${chance}`, JSON.stringify({
//                         hash: randomService.encrypt(hash),
//                         md5: randomService.getMD5(hash)
//                     })).execAsync();
//             });
//     });
// }
//
// function createLink(userInfo: UserInfo, bet: number, chance: number): Promise<Link> {
//     console.log('createLink');
//     return Promise.all([
//         client.incrAsync('links:id'),
//         randomService.getLinkHash(chance),
//     ]).then((results: any[]) => {
//         const id: number = results[0];
//         const hash: string = results[1];
//
//
//         const md5: string = randomService.getMD5(hash);
//         const encryptedHash: string = randomService.encrypt(hash);
//         const status: string = 'pending';
//
//
//         return client.multi()
//             .lpush(`links:${bet}:${chance}`, JSON.stringify({
//                 id,
//                 hash: encryptedHash,
//                 bet,
//                 chance,
//                 md5,
//                 status,
//                 players: [userInfo.toPlayerInfo()]
//             }))
//             .lrange(`links:${bet}:${chance}`, 0, 0).execAsync()
//             .then((res: any[]) => {
//                 console.log(res);
//                 return new Link(JSON.parse(res[1][0]));
//             });
//     });
// }
//
// function getLink(userInfo: UserInfo, bet: number, chance: number): Promise<Link> {
//     console.log('getLink');
//     return Promise.resolve()
//         .then(() => client.lrangeAsync(`links:${bet}:${chance}`, 0, 0))
//         .then((results: any) => {
//             if (results && results[0]) {
//                 const parsed: LinkDocInterface = JSON.parse(results[0]);
//                 const link: Link = new Link(parsed);
//                 if (link.isDone()) {
//                     return createLink(userInfo, bet, chance);
//                 } else {
//                     return link;
//                 }
//             } else {
//                 return createLink(userInfo, bet, chance);
//             }
//         });
// }
//
// //
// // function getLinkLoserPosition(encryptedHash: string): number {
// //     const regExp: RegExp = /\[(\d+)\]/;
// //     const decryptedHash: string = randomService.decrypt(encryptedHash);
// //     return Number(regExp.exec(decryptedHash)[1]);
// // }
//
// function getPrevLink(bet: number, chance: number): Promise<Link> {
//     return client.lrangeAsync(`links:${bet}:${chance}`, 1, 1).then((results: string[]) =>
//         results && results[0] ? new Link(JSON.parse(results[0])) : null);
// }
//
// function join(userInfo: UserInfo, bet: number, chance: number): Promise<Link> {
//     console.log('join', userInfo.id, bet, userInfo.balance);
//     if (bet > userInfo.balance) {
//         return Promise.reject(new Error('low balance'));
//     }
//     return Promise.resolve()
//         .then(() => getLink(userInfo, bet, chance))
//         .then((link: Link) => {
//             link.join(userInfo.toPlayerInfo());
//             if (link.isDone()) {
//                 userInfo.balance -= bet;
//                 const multi = client.multi();
//                 if (link.isShortLink()) {
//                     console.log('HERE');
//                     return getPrevLink(bet, chance).then((prevLink: Link) => {
//                         if (prevLink) {
//                             console.log('no prev link');
//                             userInfo.balance += bet;
//                             multi.hset(`users:${userInfo.id}`, `balance`, String(userInfo.balance))
//                         } else {
//                             console.log('set prev loser');
//                             multi.hset(`users:${userInfo.id}`, `balance`, String(userInfo.balance))
//                                 .hincrby(`users:${prevLink.loser.id}`, `balance`, bet);
//                         }
//                         return multi.lset(`links:${bet}:${chance}`, 0, JSON.stringify(link))
//                             .execAsync().then(() => link);
//                     });
//                 } else {
//                     link.players.forEach((player: PlayerInterface) => {
//                         if (player.id === userInfo.id) {
//                             multi.hset(`users:${userInfo.id}`, `balance`, userInfo.balance as any)
//                         } else {
//                             multi.hincrby(`users:${player.id}`, `balance`, bet / (link.players.length - 1))
//                         }
//                     });
//                     return multi.lset(`links:${bet}:${chance}`, 0, JSON.stringify(link))
//                         .execAsync().then(() => link);
//                 }
//             } else {
//                 return client.multi()
//                     .lset(`links:${bet}:${chance}`, 0, JSON.stringify(link))
//                     .execAsync().then(() => link);
//             }
//         });
// }
//
// function saveUserFromContext(ctx: any): Promise<UserInfo> {
//
//     const chat: any = ctx.chat;
//     const user: any = ctx.from;
//     const chatId: number = chat.id;
//
//     return client.multi()
//         .hmset(`users:${user.id}`, {
//             ...user,
//             chat_id: chatId
//         })
//         .hgetall(`users:${user.id}`).execAsync()
//         .then((result: any) => new UserInfo(result[1]));
// }
//
// function joinPlayer(): Promise<Link> {
//     return queue.push(_joinPlayer);
// }
//
// function _joinPlayer(): Promise<Link> {
//     return Promise.resolve()
//         .then(() => saveUserFromContext(getContext(Date.now(), 100)))
//         .then((userInfo: UserInfo) => join(userInfo, 10, 20));
// }
//
// beforeAll(() => {
//     randomService = new RandomService(null);
//     queue = new Queue();
//     client = redis.createClient();
//     client.on('error', (err) => {
//         console.log('Error ' + err);
//     });
// });
//
// describe('chain', () => {
//
//
//     // test('getContext', () => {
//     //     return getPrevLink(10, 10).then((results) => {
//     //         console.log(results);
//     //     })
//     // });
//
//     test('get prev', () => {
//         return client.lrangeAsync(`links:10:20`, 2, 2).then((results: any[]) => {
//             console.log(results);
//         })
//     });
//
//     test('get chain', () => {
//         return client.lrangeAsync(`links:10:20`, 0, 0).then((keys: any) => {
//             console.log(keys);
//
//
//         })
//     });
//
//     test('save user context info', () => {
//         return saveUserFromContext(context).then((result: UserInfo) => {
//             console.log(result.getName());
//         }, (e) => {
//             console.error(e);
//         })
//     });
//
//
//     test('set money 100', () => {
//         return Promise.resolve()
//             .then(() => saveUserFromContext(context))
//             .then((userInfo: UserInfo) => {
//                 return client.multi()
//                     .hmset(`users:${userInfo.id}`, {
//                         balance: 100
//                     })
//                     .hgetall(`users:${userInfo.id}`).execAsync()
//                     .then((result: any) => new UserInfo(result[1]));
//             }).then((result) => {
//                 console.log(result);
//             }, (e) => {
//                 console.error(e);
//             });
//     });
//     //
//     // test('join player', () => {
//     //     return Promise.resolve()
//     //         .then(() => saveUserFromContext(getContext(Date.now(), 100)))
//     //         .then((userInfo: UserInfo) => join(userInfo, 10, 100))
//     //         .then((link: Link) => {
//     //             console.log(link);
//     //         }, (e) => {
//     //             console.error(e);
//     //         });
//     // });
//
//     test('join parallel player', () => {
//         return Promise.all([
//             joinPlayer(),
//             joinPlayer(),
//             joinPlayer(),
//             joinPlayer(),
//             joinPlayer(),
//             joinPlayer(),
//             joinPlayer(),
//             joinPlayer()
//         ]).catch((e) => {
//             console.error(e);
//         }).then((res) => {
//             console.log(res);
//         });
//     });
//
//     test('checkHashes', () => {
//         return checkHashes(20);
//     });
//
//     test('get hash', () => {
//         return getHash(20).then((res: any) => {
//             console.log(res)
//         });
//     });
//
//     test('list', () => {
//         return client.rpushAsync(['frameworks', 'angularjs', 'backbone']).then((reply) => {
//             console.log(reply);
//         });
//     });
//
//     test('sets', () => {
//         return client.saddAsync(['tags', 'angularjs', 'backbonejs', 'emberjs']).then((reply) => {
//             console.log(reply);
//         });
//     });
//
//     test('hmset', () => {
//         return client.hmsetAsync('key', {
//             hui: 'hui'
//         })
//             .then((reply) => {
//                 console.log(reply);
//             });
//     });
//
//     test('incrAsync', () => {
//         return client.incrAsync('key')
//             .then((reply) => {
//                 console.log(reply);
//             });
//     });
//
//
// });
