import { PhaserWindPlugin } from '../plugin/plugin';
import { BaseThemeConfig } from '../theme';

export abstract class SceneWithPhaserWind<
  T extends BaseThemeConfig = BaseThemeConfig,
> extends Phaser.Scene {
  /**
   *
   * @param config The scene key or scene specific configuration settings.
   */
  constructor(config?: string | Phaser.Types.Scenes.SettingsConfig) {
    super(config);
  }

  public pw!: PhaserWindPlugin<T>;
}
