import { Plugins } from 'phaser';
import {
  BaseThemeConfig,
  defaultDarkTheme,
  defaultLightTheme,
  PHASER_WIND_KEY,
  PhaserWindPlugin,
  ThemeOverride,
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
  /**
   * The mapping key for the PhaserWind plugin
   * @internal
   * @deprecated Do not modify this value unless you know what you're doing.
   * Changing this value can break the plugin's functionality.
   */
  private phaserWindMappingKey: string = PHASER_WIND_KEY;

  /**
   * Creates an instance of HudiniPlugin
   * @param pluginManager - Phaser plugin manager instance
   */
  constructor(pluginManager: Plugins.PluginManager) {
    super(pluginManager);
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
  override init({
    theme,
    darkMode = false,
    /**
     * @internal
     * @deprecated Do not modify this value unless you know what you're doing.
     * Changing this value can break the plugin's functionality.
     */
    phaserWindMappingKey = PHASER_WIND_KEY,
  }: HudiniPluginData<T>): void {
    this.phaserWindMappingKey = phaserWindMappingKey;

    // If the phaser-wind plugin is not installed, install it
    if (!this.pluginManager.get(PHASER_WIND_KEY)) {
      const chosenTheme =
        theme ?? (darkMode ? defaultDarkTheme : defaultLightTheme);

      this.pluginManager.install(
        PHASER_WIND_KEY,
        PhaserWindPlugin,
        true,
        phaserWindMappingKey,
        {
          theme: chosenTheme,
          darkMode,
        }
      );
    }
  }

  /**
   * Returns the PhaserWind plugin instance
   * @returns PhaserWind plugin instance
   */
  public get pw(): PhaserWindPlugin<T> {
    return this.pluginManager.get(
      this.phaserWindMappingKey
    ) as PhaserWindPlugin<T>;
  }
}
