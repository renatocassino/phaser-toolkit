import type { Scene } from 'phaser';

import { PHASER_WIND_KEY, PhaserWindPlugin } from '../plugin/plugin';
import { BaseThemeConfig } from '../theme';

/**
 * Accessor for the Phaser Wind plugin from within a Phaser scene.
 *
 * Preferred over {@link SceneWithPhaserWind} (inheritance) and over module
 * augmentation of `Phaser.Scene`, because it:
 * - Composes with any existing base scene (no forced inheritance).
 * - Keeps the theme type explicit at the call site (no silent `any`).
 * - Doesn't rely on non-null assertions that lie about lifecycle.
 *
 * Call it inside `create()` / `update()` (after the plugin has been installed).
 *
 * @typeParam T - The theme config type. Pass your `ThemeType` to get
 *   type-narrowed access to your custom tokens.
 * @param scene - The Phaser scene instance.
 * @returns The Phaser Wind plugin instance bound to the given theme type.
 *
 * @example
 * ```ts
 * import { withPhaserWind } from 'phaser-wind';
 * import type { ThemeType } from './theme';
 *
 * class MyScene extends Phaser.Scene {
 *   create() {
 *     const pw = withPhaserWind<ThemeType>(this);
 *     this.cameras.main.setBackgroundColor(pw.color.rgb('background'));
 *   }
 * }
 * ```
 */
export const withPhaserWind = <T extends BaseThemeConfig = BaseThemeConfig>(
  scene: Scene
): PhaserWindPlugin<T> =>
  scene.plugins.get(PHASER_WIND_KEY) as unknown as PhaserWindPlugin<T>;
