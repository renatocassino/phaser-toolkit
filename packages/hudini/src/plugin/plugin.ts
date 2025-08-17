import { Plugins } from 'phaser';
import {
  BaseThemeConfig,
  defaultLightTheme,
  ThemeOverride
} from 'phaser-wind';

export const HUDINI_KEY: string = 'hudini';

/**
 * Plugin configuration data type.
 *
 * @typedef {Object} HudiniPluginData
 * @property {BaseThemeConfig} [theme] - Custom theme created using createTheme(). If not provided,
 *   the default light theme will be used
 * @property {boolean} [darkMode=false] - When true, uses the default dark theme. Only takes effect
 *   if no custom theme is provided
 */
export type HudiniPluginData<T = ThemeOverride> = {
  theme?: T;
  darkMode?: boolean;
  phaserWindMappingKey?: string; // default is 'pw'
};

/**
 * Phaser Wind Plugin class that manages theme configuration
 * @extends Plugins.BasePlugin
 */
export class HudiniPlugin<
  T extends BaseThemeConfig,
> extends Plugins.BasePlugin {
  private themeInstance: T & BaseThemeConfig;
  // private phaserWindMappingKey: string;

  /** Current theme configuration */
  // private theme: T & BaseThemeConfig;

  /**
   * Creates an instance of HudiniPlugin
   * @param pluginManager - Phaser plugin manager instance
   */
  constructor(pluginManager: Plugins.PluginManager) {
    super(pluginManager);

    this.themeInstance = defaultLightTheme as T & BaseThemeConfig;
    // this.phaserWindMappingKey = 'pw';
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
   *         key: HUDINI_KEY,
   *         plugin: HudiniPlugin,
   *         mapping: HUDINI_KEY,
   *         data: { theme: defaultLightTheme,  }
   *       },
   *     ],
   *   },
   * });
   * ```
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // override init({
  // theme,
  // darkMode = false,
  // phaserWindMappingKey = 'pw',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // }: HudiniPluginData<T>): void {
  // if (!theme) {
  //   this.theme = darkMode
  //     ? (defaultDarkTheme as T & BaseThemeConfig)
  //     : (defaultLightTheme as T & BaseThemeConfig);
  //   return;
  // } else {
  //   this.theme = theme as T & BaseThemeConfig;
  // }

  // this.phaserWindMappingKey = phaserWindMappingKey;

  // this.themeInstance = {
  //   ...this.themeInstance,
  //   ...this.theme,
  // } as T & BaseThemeConfig;
}

  /**
   * Returns the current theme configuration
   * @returns Current BaseThemeConfig
   */
  // publsic getTheme(): T & BaseThemeConfig {
  // return this.theme;
  // }

  // public get pw(): T & BaseThemeConfig {
  //   return this.themeInstance;
  // }
}
