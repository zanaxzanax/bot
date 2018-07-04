import {Document} from 'mongoose';

export interface IUserDoc extends Document {
    id: number;
    balance: number;
    is_bot: boolean;
    first_name: string;
    last_name: string;
    nickname?: string;
    language_code: string;
    wallets?: number[];
    created?: number;
}

export const UserScheme = {
    id: {
        type: Number,
        required: true,
    },
    balance: {
        type: Number,
        required: false,
        default: 0
    },
    is_bot: {
        type: Boolean,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    nickname: {
        type: String,
        required: false
    },
    wallets: {
        type: Array,
        required: false,
        default: []
    },
    language_code: {
        type: String,
        required: false
    },
    created: {
        type: Date,
        required: false,
        default: Date.now
    }
};
