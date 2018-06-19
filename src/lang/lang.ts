const exclusion: string[] = ['constructor', 'children', 'window', 'undefined'];
const json: any = require('./lang.json');
const DEFAULT_LANG: string = 'ru-RU';

export const EMOJI: any = {
    wallet: '💰',
    back: '⬅️',
    next: '➡️',
    settings: '⚙️',
    play: '🎲',
    help: 'ℹ️',
    delete: '🗑️',
    yes: 'yes',
    no: 'no',
    ok: '👌️',
    replenishment: '👛',
    withdrawal: '💸',
    history: '📇',
    recheck: '🔄',
};

function translate(property: string, LANG: string): string {
    const fieldValue: any = json[property];
    if (!fieldValue) {
        return property;
    }
    return fieldValue[LANG] ? fieldValue[LANG] : fieldValue[DEFAULT_LANG] ? fieldValue[DEFAULT_LANG] : property;
}

const lang: any = (LANG: string) => {
    return new Proxy({}, {
        get: (object: any, property: string): any => {
            if (exclusion.indexOf(property) !== -1) {
                return;
            }
            switch (property) {
                case 'backButtonText':
                    return EMOJI.back + ` ${translate('back', LANG)}`;
                case 'settingsButtonText':
                    return EMOJI.settings + ` ${translate('settings', LANG)}`;
                case 'playButtonText':
                    return EMOJI.play + ` ${translate('play', LANG)}`;
                case 'helpButtonText':
                    return EMOJI.help + ` ${translate('help', LANG)}`;
                case 'walletButtonText':
                    return EMOJI.wallet + ` ${translate('wallet', LANG)}`;
                case 'deleteButtonText':
                    return EMOJI.delete + ` ${translate('delete', LANG)}`;
                case 'yesButtonText':
                    return EMOJI.yes + ` ${translate('yes', LANG)}`;
                case 'noButtonText':
                    return EMOJI.no + ` ${translate('no', LANG)}`;
                case 'readyButtonText':
                    return EMOJI.ok + ` ${translate('iHavePaid', LANG)}`;
                case 'recheckButtonText':
                    return EMOJI.recheck + ` ${translate('recheck', LANG)}`;
                case 'replenishmentButtonText':
                    return EMOJI.replenishment + ` ${translate('replenishment', LANG)}`;
                case 'withdrawalButtonText':
                    return EMOJI.withdrawal + ` ${translate('withdrawal', LANG)}`;
                case 'prevButtonText':
                    return EMOJI.back + ` ${translate('prev', LANG)}`;
                case 'nextButtonText':
                    return EMOJI.next + ` ${translate('next', LANG)}`;
                case 'historyButtonText':
                    return EMOJI.history + ` ${translate('history', LANG)}`;
                default:
                    break
            }

            return translate(property, LANG);
        }
    });
};

export default lang;
