import {Document} from 'mongoose';

export interface IElementDoc extends Document {
    id: number;
    chance: number;
    bet: number;
    players: IPlayer[];
    loser: IPlayer;
    status: string;
    hash: string;
    md5: string;
    created?: any;
    taken?: any;
}

export const ElementScheme = {
    id: {
        type: Number,
        required: true
    },
    chance: {
        type: Number,
        required: true,
    },
    bet: {
        type: Number,
        required: true
    },
    players: {
        type: Array,
        required: true,
    },
    loser: {
        type: Object,
        required: false
    },
    hash: {
        type: String,
        required: true
    },
    md5: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: false,
        default: 'pending'
    },
    taken: {
        type: Date,
        required: false,
        default: Date.now
    },
    created: {
        type: Date,
        required: false,
        default: Date.now
    }
};
