import type { Scene } from 'phaser';
import type { BaseThemeConfig } from 'phaser-wind';

import { HUDINI_KEY, HudiniPlugin } from '../plugin/plugin';

/**
 * Accessor for the Hudini plugin from within a Phaser scene.
 *
 * Preferred over {@link SceneWithHudini} (inheritance) and over module
 * augmentation of `Phaser.Scene`, because it:
 * - Composes with any existing base scene (no forced inheritance).
 * - Keeps the theme type explicit at the call site (no silent `any`).
 * - Doesn't rely on non-null assertions that lie about lifecycle.
 *
 * Call it inside `create()` / `update()` (after the plugin has been installed).
 *
 * @typeParam T - The theme config type. Pass your `ThemeType` to get
 *   type-narrowed access to your custom tokens (through `hudini.pw`).
 * @param scene - The Phaser scene instance.
 * @returns The Hudini plugin instance bound to the given theme type.
 *
 * @example
 * ```ts
 * import { withHudini } from 'hudini';
 * import type { ThemeType } from './theme';
 *
 * class MyScene extends Phaser.Scene {
 *   create() {
 *     const hudini = withHudini<ThemeType>(this);
 *     const pw = hudini.pw;
 *     this.cameras.main.setBackgroundColor(pw.color.rgb('background'));
 *   }
 * }
 * ```
 */
export const withHudini = <T extends BaseThemeConfig = BaseThemeConfig>(
  scene: Scene
): HudiniPlugin<T> =>
  scene.plugins.get(HUDINI_KEY) as unknown as HudiniPlugin<T>;
