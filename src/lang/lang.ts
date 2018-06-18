const exclusion: string[] = ['constructor', 'children', 'window', 'undefined'];
const json: any = require('./lang.json');
const DEFAULT_LANG: string = 'ru-RU';

export const EMOJI: any = {
    wallet: '💰',
    back: '⬅️',
    settings: '⚙️',
    play: '🎲',
};

function translate(property: string, LANG: string): string {
    const fieldValue: any = json[property];
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
                    return 'ℹ️' + ` ${translate('help', LANG)}`;
                case 'walletButtonText':
                    return EMOJI.wallet + ` ${translate('wallet', LANG)}`;
                case 'deleteButtonText':
                    return '🗑️' + ` ${translate('delete', LANG)}`;
                case 'yesButtonText':
                    return '👍' + ` ${translate('yes', LANG)}`;
                case 'noButtonText':
                    return '👎️' + ` ${translate('no', LANG)}`;
                case 'readyButtonText':
                    return '👌️' + ` ${translate('iHavePaid', LANG)}`;
                case 'recheckButtonText':
                    return '🔄' + ` ${translate('recheck', LANG)}`;
                case 'replenishmentButtonText':
                    return '👛' + ` ${translate('replenishment', LANG)}`;
                case 'withdrawalButtonText':
                    return '💸' + ` ${translate('withdrawal', LANG)}`;
                case 'prevButtonText':
                    return EMOJI.back + ` ${translate('prev', LANG)}`;
                case 'nextButtonText':
                    return '➡️' + ` ${translate('next', LANG)}`;
                case 'historyButtonText':
                    return '📇' + ` ${translate('history', LANG)}`;
                default:
                    break
            }

            return translate(property, LANG);
        }
    });
};

export default lang;
