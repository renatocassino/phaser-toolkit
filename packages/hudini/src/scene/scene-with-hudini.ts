import { BaseThemeConfig, SceneWithPhaserWind } from 'phaser-wind';

import { HudiniPlugin } from '../plugin/plugin';

/**
 * @deprecated Use {@link withHudini} instead.
 *
 * Forces single inheritance, which conflicts with any user-defined `BaseScene`
 * or other libraries that ship their own scene base class. It also relies on a
 * non-null assertion (`hudini!`) that lies to TypeScript about when the plugin
 * is available — touching `this.hudini` before the plugin mounts throws at
 * runtime.
 *
 * Prefer the `withHudini(scene)` accessor:
 *
 * ```ts
 * import { withHudini } from 'hudini';
 * import type { ThemeType } from './theme';
 *
 * class MyScene extends Phaser.Scene {
 *   create() {
 *     const hudini = withHudini<ThemeType>(this);
 *   }
 * }
 * ```
 *
 * Kept exported to avoid breaking existing consumers.
 */
export abstract class SceneWithHudini<
  T extends BaseThemeConfig = BaseThemeConfig,
> extends SceneWithPhaserWind<T> {
  /**
   * @param config The scene key or scene specific configuration settings.
   */
  constructor(config?: string | Phaser.Types.Scenes.SettingsConfig) {
    super(config);
  }

  public hudini!: HudiniPlugin<T>;
}
