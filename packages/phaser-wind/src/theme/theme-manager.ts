import {
  defaultLightTheme,
  type BaseThemeConfig,
  type DefaultThemeTokens,
} from './theme-config';

/**
 * Global theme manager for Phaser Wind
 * Handles theme registration, switching, and token resolution
 */
class ThemeManagerClass {
  private currentTheme: BaseThemeConfig = defaultLightTheme;
  private registeredThemes: Map<string, BaseThemeConfig> = new Map();
  private listeners: Array<(theme: BaseThemeConfig) => void> = [];

  /**
   * Initialize the theme manager with a default theme
   */
  init<T extends BaseThemeConfig>(theme: T): void {
    this.currentTheme = theme;
    this.registerTheme('default', theme);
  }

  /**
   * Register a named theme
   */
  registerTheme<T extends BaseThemeConfig>(name: string, theme: T): void {
    this.registeredThemes.set(name, theme);
  }

  /**
   * Switch to a registered theme by name
   */
  setTheme(name: string): void {
    const theme = this.registeredThemes.get(name);
    if (!theme) {
      // eslint-disable-next-line no-console
      console.warn(
        `[Phaser Wind] Theme "${name}" not found. Available themes: ${Array.from(this.registeredThemes.keys()).join(', ')}`
      );
      return;
    }

    this.currentTheme = theme;
    this.notifyListeners();
  }

  /**
   * Set theme directly with object
   */
  setThemeObject<T extends BaseThemeConfig>(theme: T): void {
    this.currentTheme = theme;
    this.notifyListeners();
  }

  /**
   * Get the current theme
   */
  getCurrentTheme(): BaseThemeConfig {
    return this.currentTheme;
  }

  /**
   * Get a specific token from the current theme
   */
  getToken(key: string): string | undefined {
    const value = this.currentTheme[key];
    return typeof value === 'string' ? value : undefined;
  }

  /**
   * Check if a token exists in the current theme
   */
  hasToken(key: string): boolean {
    return key in this.currentTheme;
  }

  /**
   * Listen for theme changes
   */
  onThemeChange(listener: (theme: BaseThemeConfig) => void): () => void {
    this.listeners.push(listener);

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Get all registered theme names
   */
  getRegisteredThemes(): string[] {
    return Array.from(this.registeredThemes.keys());
  }

  /**
   * Create a new theme based on the current one with overrides
   */
  extendCurrentTheme<T extends BaseThemeConfig>(
    overrides: Partial<T>
  ): BaseThemeConfig {
    return { ...this.currentTheme, ...overrides };
  }

  /**
   * Reset to default theme
   */
  reset(): void {
    const defaultTheme = this.registeredThemes.get('default');
    if (defaultTheme) {
      this.currentTheme = defaultTheme;
      this.notifyListeners();
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentTheme));
  }
}

// Export singleton instance
export const ThemeManager = new ThemeManagerClass();

// Type helper for creating themes with proper typing
export const createTheme = <T extends BaseThemeConfig>(theme: T): T => theme;

// Type helper for theme configuration
export type ThemeConfig<T extends BaseThemeConfig = DefaultThemeTokens> = T;
