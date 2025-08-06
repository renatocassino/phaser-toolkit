import {
  type BaseThemeConfig,
  type DefaultThemeStructure,
  defaultLightTheme,
} from './theme-config';

/**
 * Global theme manager for Phaser Wind
 * Handles theme registration, switching, and token resolution with nested object support
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
   * Get a nested token using dot notation (e.g., 'colors.primary', 'fonts.display')
   * @param path - The path to the token (e.g., 'colors.primary')
   * @returns The resolved token value
   */
  getToken(path: string): unknown {
    return this.getNestedValue(this.currentTheme, path);
  }

  /**
   * Check if a nested token exists using dot notation
   * @param path - The path to check (e.g., 'colors.primary')
   * @returns True if the token exists
   */
  hasToken(path: string): boolean {
    return this.getNestedValue(this.currentTheme, path) !== undefined;
  }

  /**
   * Get a token with type safety for specific namespaces
   */
  getColorToken(key: string): string | undefined {
    const value = this.getToken(`colors.${key}`);
    return typeof value === 'string' ? value : undefined;
  }

  /**
   * Get a font token
   */
  getFontToken(key: string): string | undefined {
    const value = this.getToken(`fonts.${key}`);
    return typeof value === 'string' ? value : undefined;
  }

  /**
   * Get a spacing token
   */
  getSpacingToken(key: string): number | undefined {
    const value = this.getToken(`spacing.${key}`);
    return typeof value === 'number' ? value : undefined;
  }

  /**
   * Get a typography token
   */
  getTypographyToken(key: string): unknown {
    return this.getToken(`typography.${key}`);
  }

  /**
   * Get an effect token
   */
  getEffectToken(key: string): unknown {
    return this.getToken(`effects.${key}`);
  }

  /**
   * Resolve a theme reference (e.g., 'colors.primary' -> actual color value)
   * This allows theme tokens to reference other theme tokens
   */
  resolveToken(value: string): unknown {
    if (typeof value === 'string' && value.includes('.')) {
      // Check if it's a theme reference
      const resolved = this.getToken(value);
      if (resolved !== undefined) {
        // Recursively resolve in case of nested references
        return typeof resolved === 'string' && resolved.includes('.')
          ? this.resolveToken(resolved)
          : resolved;
      }
    }
    return value;
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

// Export singleton instance
export const ThemeManager = new ThemeManagerClass();

// Type helper for creating themes with proper typing
export const createTheme = <T extends BaseThemeConfig>(theme: T): T => theme;

// Type helper for theme configuration
export type ThemeConfig<T extends BaseThemeConfig = DefaultThemeStructure> = T;
