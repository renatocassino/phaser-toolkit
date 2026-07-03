import { PhaserWindPlugin } from '../plugin/plugin';
import { BaseThemeConfig } from '../theme';

/**
 * @deprecated Use {@link withPhaserWind} instead.
 *
 * Forces single inheritance, which conflicts with any user-defined `BaseScene`
 * or other libraries that ship their own scene base class. It also relies on a
 * non-null assertion (`pw!`) that lies to TypeScript about when the plugin is
 * available — touching `this.pw` before the plugin mounts throws at runtime.
 *
 * Prefer the `withPhaserWind(scene)` accessor:
 *
 * ```ts
 * import { withPhaserWind } from 'phaser-wind';
 * import type { ThemeType } from './theme';
 *
 * class MyScene extends Phaser.Scene {
 *   create() {
 *     const pw = withPhaserWind<ThemeType>(this);
 *   }
 * }
 * ```
 *
 * Kept exported to avoid breaking existing consumers.
 */
export abstract class SceneWithPhaserWind<
  T extends BaseThemeConfig = BaseThemeConfig,
> extends Phaser.Scene {
  /**
   * @param config The scene key or scene specific configuration settings.
   */
  constructor(config?: string | Phaser.Types.Scenes.SettingsConfig) {
    super(config);
  }

  public pw!: PhaserWindPlugin<T>;
}
