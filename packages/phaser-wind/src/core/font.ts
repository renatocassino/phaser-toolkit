/* eslint-disable no-magic-numbers */
import { ThemeManager } from '../theme/theme-manager';

import { FontSize, type FontSizeKey } from './font-size';

/**
 * Font picker for accessing theme fonts and font families
 */
export const Font = {
  /**
   * Get font size in pixels
   * @param key - Font size key (e.g., 'sm', 'lg', '2xl')
   * @returns Font size in pixels
   */
  size: (key: FontSizeKey): number => {
    return FontSize.px(key);
  },

  /**
   * Get font size and family combined in CSS format
   * @param size - Font size key (e.g., 'sm', 'lg', '2xl')
   * @param family - Font family key (e.g., 'primary', 'display') or full path
   * @returns Font string in format "16px 'Arial'"
   */
  format: ({ size, family }: { size: FontSizeKey; family: string }): string => {
    return `${FontSize.px(size)}px '${Font.family(family)}'`;
  },

  /**
   * Get font family from theme
   * @param key - Font key (e.g., 'primary', 'display') or full path (e.g., 'fonts.primary')
   * @returns Font family string
   */
  family: (key: string): string => {
    // Check if it's a theme token (with or without fonts. prefix)
    const fontPath = key.includes('.') ? key : `fonts.${key}`;

    const themeValue = ThemeManager.getToken(fontPath);
    if (themeValue && typeof themeValue === 'string') {
      return themeValue;
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
  },

  /**
   * Get all available font tokens from current theme
   * @returns Array of font token keys
   */
  getAvailableFonts: (): string[] => {
    const theme = ThemeManager.getCurrentTheme();
    if (theme.fonts && typeof theme.fonts === 'object') {
      return Object.keys(theme.fonts);
    }
    return [];
  },
} as const;

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
