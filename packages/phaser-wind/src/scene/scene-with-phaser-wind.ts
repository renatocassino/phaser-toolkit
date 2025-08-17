import { PHASER_WIND_KEY, PhaserWindPlugin } from '../plugin/plugin';
import { BaseThemeConfig } from '../theme';

export abstract class SceneWithPhaserWind<T extends BaseThemeConfig = BaseThemeConfig> extends Phaser.Scene {
    get pw(): PhaserWindPlugin<T> {
        return this.plugins.get(PHASER_WIND_KEY) as PhaserWindPlugin<T>;
    }
}
