import {QiwiWallet} from './qiwi-wallet.model';
import {PAYMENT_METHOD} from "../../test";

export * from './wallet.model';

export const WALLETS = {
    [PAYMENT_METHOD.qiwi]: QiwiWallet
};
