import {IElementDoc} from "../mongo/schemes";

export enum ELEMENT_STATUS {
    pending = 'pending',
    allow = 'allow',
    done = 'done',
}

export class ElementModel implements IElement {

    id: number;
    bet: number;
    chance: number;
    md5: string;
    status: string;
    hash: string;
    players: IPlayer[];
    loser: IPlayer;

    loserPosition: number;

    constructor(elementDoc: IElementDoc) {
        this.id = elementDoc.id;
        this.bet = elementDoc.bet;
        this.chance = elementDoc.chance;
        this.md5 = elementDoc.md5;
        this.status = elementDoc.status;
        this.hash = elementDoc.hash;
        this.players = elementDoc.players;
        this.loser = elementDoc.loser;
    }

    isDone(): boolean {
        return this.status === ELEMENT_STATUS.done;
    }

    isAllow(): boolean {
        return this.status === ELEMENT_STATUS.allow;
    }

    isPending(): boolean {
        return this.status === ELEMENT_STATUS.pending;
    }

    isShortLink(): boolean {
        return this.players.length === 1;
    }

    join(player: IPlayer): void {
        // if (!this.players.find((p) => p.id === player.id)) {
        //     this.players.push(player);
        // }
        const loserIndex: number = this.loserPosition;
        if (this.players.length - 1 === loserIndex) {
            this.status = ELEMENT_STATUS.done;
            this.loser = this.players[this.players.length - 1];
        } else {
            this.status = ELEMENT_STATUS.allow;
        }
    }

}
