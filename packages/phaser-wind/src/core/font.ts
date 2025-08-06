/* eslint-disable no-magic-numbers */
import { ThemeManager } from '../theme/theme-manager';

/**
 * Font picker for accessing theme fonts and font families
 */
export class Font {
  /**
   * Get font family from theme
   * @param key - Font key (e.g., 'primary', 'display') or full path (e.g., 'fonts.primary')
   * @returns Font family string
   */
  static family(key: string): string {
    // Check if it's a theme token (with or without fonts. prefix)
    const fontPath = key.includes('.') ? key : `fonts.${key}`;

    if (ThemeManager.hasToken(fontPath)) {
      const themeValue = ThemeManager.getToken(fontPath);
      if (themeValue && typeof themeValue === 'string') {
        return themeValue;
      }
    }

    // Fallback: check if it's a direct theme token (backwards compatibility)
    if (ThemeManager.hasToken(key)) {
      const themeValue = ThemeManager.getToken(key);
      if (themeValue && typeof themeValue === 'string') {
        return themeValue;
      }
    }

    // Fallback to the key itself if not found in theme
    return key;
  }

  /**
   * Get all available font tokens from current theme
   * @returns Array of font token keys
   */
  static getAvailableFonts(): string[] {
    const theme = ThemeManager.getCurrentTheme();
    if (theme.fonts && typeof theme.fonts === 'object') {
      return Object.keys(theme.fonts);
    }
    return [];
  }
}

/**
 * Spacing picker for accessing theme spacing values
 */
export class SpacingPicker {
  /**
   * Get spacing value in pixels from theme
   * @param key - Spacing key (e.g., 'sm', 'lg') or full path (e.g., 'spacing.md')
   * @returns Spacing value in pixels
   */
  static px(key: string): number {
    // Check if it's a theme token (with or without spacing. prefix)
    const spacingPath = key.includes('.') ? key : `spacing.${key}`;

    if (ThemeManager.hasToken(spacingPath)) {
      const themeValue = ThemeManager.getToken(spacingPath);
      if (themeValue && typeof themeValue === 'number') {
        return themeValue;
      }
    }

    // Fallback: check if it's a direct theme token (backwards compatibility)
    if (ThemeManager.hasToken(key)) {
      const themeValue = ThemeManager.getToken(key);
      if (themeValue && typeof themeValue === 'number') {
        return themeValue;
      }
    }

    // Default fallback values
    const defaultSpacing: Record<string, number> = {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      '2xl': 48,
      '3xl': 64,
      '4xl': 96,
    };

    return defaultSpacing[key] ?? 16; // Default to 16px
  }

  /**
   * Get all available spacing tokens from current theme
   * @returns Array of spacing token keys
   */
  static getAvailableSpacing(): string[] {
    const theme = ThemeManager.getCurrentTheme();
    if (theme.spacing && typeof theme.spacing === 'object') {
      return Object.keys(theme.spacing);
    }
    return [];
  }
}

/**
 * Typography picker for accessing complete typography styles from theme
 */
export class TypographyPicker {
  /**
   * Get complete typography style from theme
   * @param key - Typography key (e.g., 'heading', 'body') or full path
   * @returns Typography style object
   */
  static style(key: string): {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: number | string;
    lineHeight?: number | string;
    letterSpacing?: number | string;
  } {
    // Check if it's a theme token (with or without typography. prefix)
    const typographyPath = key.includes('.') ? key : `typography.${key}`;

    if (ThemeManager.hasToken(typographyPath)) {
      const themeValue = ThemeManager.getToken(typographyPath);
      if (themeValue && typeof themeValue === 'object') {
        // Resolve any theme references in the typography object
        const resolved = this.resolveTypographyReferences(
          themeValue as Record<string, unknown>
        );
        return resolved;
      }
    }

    // Fallback: check if it's a direct theme token
    if (ThemeManager.hasToken(key)) {
      const themeValue = ThemeManager.getToken(key);
      if (themeValue && typeof themeValue === 'object') {
        const resolved = this.resolveTypographyReferences(
          themeValue as Record<string, unknown>
        );
        return resolved;
      }
    }

    // Return empty object if not found
    return {};
  }

  /**
   * Get Phaser-compatible text style from typography token
   * @param key - Typography key
   * @returns Object compatible with Phaser text styles
   */
  static phaserStyle(key: string): {
    fontSize?: string;
    fontFamily?: string;
    fontStyle: string;
  } {
    const style = this.style(key);

    const result: {
      fontSize?: string;
      fontFamily?: string;
      fontStyle: string;
    } = {
      fontStyle:
        style.fontWeight && Number(style.fontWeight) >= 600 ? 'bold' : 'normal',
    };

    if (style.fontSize) {
      result.fontSize = style.fontSize;
    }
    if (style.fontFamily) {
      result.fontFamily = style.fontFamily;
    }

    return result;
  }

  /**
   * Get all available typography tokens from current theme
   * @returns Array of typography token keys
   */
  static getAvailableTypography(): string[] {
    const theme = ThemeManager.getCurrentTheme();
    if (theme.typography && typeof theme.typography === 'object') {
      return Object.keys(theme.typography);
    }
    return [];
  }

  /**
   * Resolve theme references in typography objects
   * @param typographyObject - Typography style object
   * @returns Resolved typography object
   */
  private static resolveTypographyReferences(
    typographyObject: Record<string, unknown>
  ): Record<string, unknown> {
    const resolved = { ...typographyObject };

    // Resolve fontSize if it's a theme reference
    if (resolved['fontSize'] && typeof resolved['fontSize'] === 'string') {
      if (resolved['fontSize'].includes('.')) {
        resolved['fontSize'] = ThemeManager.resolveToken(resolved['fontSize']);
      }
    }

    // Resolve fontFamily if it's a theme reference
    if (resolved['fontFamily'] && typeof resolved['fontFamily'] === 'string') {
      if (resolved['fontFamily'].includes('.')) {
        resolved['fontFamily'] = ThemeManager.resolveToken(
          resolved['fontFamily']
        );
      }
    }

    return resolved;
  }
}

/**
 * Effect picker for accessing theme effects like shadows
 */
export class EffectPicker {
  /**
   * Get effect configuration from theme
   * @param key - Effect key (e.g., 'shadow-md') or full path
   * @returns Effect configuration object
   */
  static config(key: string): {
    blur?: number;
    offsetX?: number;
    offsetY?: number;
    color?: string;
    alpha?: number;
  } {
    // Check if it's a theme token (with or without effects. prefix)
    const effectPath = key.includes('.') ? key : `effects.${key}`;

    if (ThemeManager.hasToken(effectPath)) {
      const themeValue = ThemeManager.getToken(effectPath);
      if (themeValue && typeof themeValue === 'object') {
        // Resolve color references
        const resolved = { ...themeValue };
        if ('color' in resolved && typeof resolved.color === 'string') {
          resolved.color = ThemeManager.resolveToken(resolved.color);
        }
        return resolved;
      }
    }

    return {};
  }

  /**
   * Get all available effect tokens from current theme
   * @returns Array of effect token keys
   */
  static getAvailableEffects(): string[] {
    const theme = ThemeManager.getCurrentTheme();
    if (theme.effects && typeof theme.effects === 'object') {
      return Object.keys(theme.effects);
    }
    return [];
  }
}
