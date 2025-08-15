import { Plugins } from 'phaser';

import { Color } from '../core/color';
import { BaseThemeConfig, defaultDarkTheme, defaultLightTheme } from '../theme';

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
export type PhaserWindPluginData = {
  theme?: BaseThemeConfig;
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
   */
  override init({ theme, darkMode = false }: PhaserWindPluginData): void {
    if (!theme) {
      // @ts-ignore
      this.theme = darkMode
        ? defaultDarkTheme
        : (defaultLightTheme as T & BaseThemeConfig);
      return;
    }

    this.theme = theme as T & BaseThemeConfig;
  }

  /**
   * Returns the current theme configuration
   * @returns Current BaseThemeConfig
   */
  public getTheme(): T & BaseThemeConfig {
    return this.theme;
  }

  public get color(): Color<T['colors']> {
    if (!this.colorInstance) {
      this.colorInstance = new Color<T['colors']>(
        this.theme.colors as T['colors']
      );
    }

    return this.colorInstance;
  }

  /**
   * Get a nested token using dot notation (e.g., 'colors.primary', 'fonts.display')
   * @param path - The path to the token (e.g., 'colors.primary')
   * @returns The resolved token value
   */
  // @ts-ignore
  private getToken(path: string): unknown {
    return this.getNestedValue(this.theme, path);
  }

  /**
   * Helper method to get nested values using dot notation
   * @param obj - The object to search in
   * @param path - The dot notation path (e.g., 'colors.primary')
   * @returns The value at the path or undefined
   */
  private getNestedValue(obj: unknown, path: string): unknown {
    return path.split('.').reduce((current, key) => {
      return current && typeof current === 'object'
        ? (current as Record<string, unknown>)[key]
        : undefined;
    }, obj);
  }
}
