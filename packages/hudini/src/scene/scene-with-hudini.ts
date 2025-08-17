import { BaseThemeConfig, SceneWithPhaserWind } from 'phaser-wind';

import { HudiniPlugin } from '../plugin/plugin';

export abstract class SceneWithHudini<
  T extends BaseThemeConfig = BaseThemeConfig,
> extends SceneWithPhaserWind<T> {
  /**
   *
   * @param config The scene key or scene specific configuration settings.
   */
  constructor(config?: string | Phaser.Types.Scenes.SettingsConfig) {
    super(config);
  }

  public hudini!: HudiniPlugin<T>;
}
