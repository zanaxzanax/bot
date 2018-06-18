import * as BaseScene from 'telegraf/scenes/base';
import {EMOJI} from "../lang/lang";

export const SceneFabric = (id, options?) => {
    const scene = new BaseScene(id, options);
    scene.hears(EMOJI.wallet, (ctx) => ctx.scene.enter('wallet'));
    scene.hears(EMOJI.settings, (ctx) => ctx.scene.enter('settings'));
    scene.hears(EMOJI.play, (ctx) => ctx.scene.enter('game'));
    return scene;
};
