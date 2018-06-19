import {
    wallet,
    // wallet_history,
    // wallet_history_payment,
    // wallet_payment,
    // wallet_payment_qiwi,
    // wallet_payment_remove,
    // wallet_withdrawal,
    // wallet_withdrawal_qiwi
} from './wallet';
import {main} from './main';
import {game, game_bet, game_bet_play} from './game';
// import {
//     settings,
//     settings_nickname,
//     settings_nickname_change,
//     settings_wallets,
//     settings_wallets_add
// } from './settings/index';

import {superWizard} from './wizard'
import {GameWizard} from './game-wizard'

export const SCENES: any[] = [
    game, game_bet, game_bet_play,
     wallet,
    superWizard,
    GameWizard,
    // wallet_history,
    // wallet_payment,
    // wallet_payment_qiwi,
    // wallet_payment_remove,
    // wallet_history_payment,
    // wallet_withdrawal,
    // wallet_withdrawal_qiwi,
    // settings,
    // settings_nickname,
    // settings_wallets,
    // settings_wallets_add,
    // settings_nickname_change,
    main
];
