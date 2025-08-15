import { Plugins } from 'phaser';

import {
  createFontSize,
  FontSizeApi,
  createSpacing,
  type SpacingApi,
} from '../core';
import { createColor, type Color } from '../core/color';
import { createRadius, type RadiusApi } from '../core/radius';
import {
  BaseThemeConfig,
  defaultDarkTheme,
  defaultLightTheme,
  ThemeOverride,
} from '../theme';

export const PHASER_WIND_KEY: string = 'pw';

/**
 * Plugin configuration data type.
 *
 * @typedef {Object} PhaserWindPluginData
 * @property {BaseThemeConfig} [theme] - Custom theme created using createTheme(). If not provided,
 *   the default light theme will be used
 * @property {boolean} [darkMode=false] - When true, uses the default dark theme. Only takes effect
 *   if no custom theme is provided
 */
export type PhaserWindPluginData<T = ThemeOverride> = {
  theme?: T;
  darkMode?: boolean;
};
/**
 * Phaser Wind Plugin class that manages theme configuration
 * @extends Plugins.BasePlugin
 */
export class PhaserWindPlugin<
  T extends BaseThemeConfig,
> extends Plugins.BasePlugin {
  private colorInstance: Color<T['colors']> | null = null;
  private fontSizeInstance: FontSizeApi<T['fontSizes']> | null = null;
  private spacingInstance: SpacingApi<T['spacing']> | null = null;
  private radiusInstance: RadiusApi<T['radius']> | null = null;

  /** Current theme configuration */
  private theme: T & BaseThemeConfig;

  /**
   * Creates an instance of PhaserWindPlugin
   * @param pluginManager - Phaser plugin manager instance
   */
  constructor(pluginManager: Plugins.PluginManager) {
    super(pluginManager);

    this.theme = defaultLightTheme as T & BaseThemeConfig;
  }

  /**
   * Initializes the plugin with theme configuration
   * @param theme - Custom theme configuration
   * @param darkMode - Whether to use dark mode theme when no custom theme provided
   * @example
   * ```typescript
   * const game = new Phaser.Game({
   *   plugins: {
   *     global: [
   *       {
   *         key: PHASER_WIND_KEY,
   *         plugin: PhaserWindPlugin,
   *         mapping: PHASER_WIND_KEY,
   *         data: { theme: defaultLightTheme }
   *       },
   *     ],
   *   },
   * });
   * ```
   */
  override init({ theme, darkMode = false }: PhaserWindPluginData<T>): void {
    if (!theme) {
      this.theme = darkMode
        ? (defaultDarkTheme as T & BaseThemeConfig)
        : (defaultLightTheme as T & BaseThemeConfig);
      return;
    }

    this.theme = theme as T & BaseThemeConfig;

    this.colorInstance = createColor<T['colors']>(
      this.theme.colors as T['colors']
    );
    this.fontSizeInstance = createFontSize<T['fontSizes']>(
      this.theme.fontSizes as T['fontSizes']
    );
    this.spacingInstance = createSpacing<T['spacing']>(
      this.theme.spacing as T['spacing']
    );
    this.radiusInstance = createRadius<T['radius']>(
      this.theme.radius as T['radius']
    );
  }

  /**
   * Returns the current theme configuration
   * @returns Current BaseThemeConfig
   */
  public getTheme(): T & BaseThemeConfig {
    return this.theme;
  }

  public get color(): Color<T['colors']> {
    return this.colorInstance as Color<T['colors']>;
  }

  public get fontSize(): FontSizeApi<T['fontSizes']> {
    return this.fontSizeInstance as FontSizeApi<T['fontSizes']>;
  }

  public get spacing(): SpacingApi<T['spacing']> {
    return this.spacingInstance as SpacingApi<T['spacing']>;
  }

  public get radius(): RadiusApi<T['radius']> {
    return this.radiusInstance as RadiusApi<T['radius']>;
  }
}
