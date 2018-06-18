export enum linkStatuses {
    pending = 'pending',
    done = 'done',
}

export class Link implements ILink {

    id: number;
    bet: number;
    chance: number;
    md5: string;
    status: string;
    hash: string;
    players: IPlayer[];
    loser: IPlayer;

    private _prevLink: Link = null;
    private _loserPosition: number;

    constructor(linkDocInterface: LinkDocInterface) {
        this.id = linkDocInterface.id;
        this.bet = linkDocInterface.bet;
        this.chance = linkDocInterface.chance;
        this.md5 = linkDocInterface.md5;
        this.status = linkDocInterface.status;
        this.hash = linkDocInterface.hash;
        this.players = linkDocInterface.players;
        this.loser = linkDocInterface.loser;
    }

    isDone(): boolean {
        return this.status === linkStatuses.done;
    }

    isShortLink(): boolean {
        return this.players.length === 1;
    }

    join(player: IPlayer): void {
        if (!this.players.find((p) => p.id === player.id)) {
            this.players.push(player);
        }
        const loserIndex: number = this._loserPosition;
        if (this.players.length - 1 === loserIndex) {
            this.status = linkStatuses.done;
            this.loser = this.players[this.players.length - 1];
        }
    }

    toJSON(): LinkDocInterface {
        return {
            id: this.id,
            prevId: this._prevLink ? this._prevLink.id : null,
            bet: this.bet,
            chance: this.chance,
            md5: this.md5,
            status: this.status,
            hash: this.hash,
            players: this.players,
            loser: this.loser,
        }
    }

    set prevLink(link: Link) {
        this._prevLink = link;
    }

    set loserPosition(loserPosition: number) {
        this._loserPosition = loserPosition;
    }

    getPrevLink(): Link {
        return this._prevLink;
    }

    toString(): string {

        const rows: string[] = [
            `#${this.id}`,
            `Шанс: ${this.chance}%`,
            `Ставка: ${this.bet}`,
            `Игроки:`,
            `${this.players.map((player: IPlayer) => `${player.nickname || player.id}`).join('\n')}`
        ];

        return rows.join('\n');
    }

}
