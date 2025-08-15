/* eslint-disable no-magic-numbers */
import type { BaseThemeConfig } from '../theme';

import {
  createFontSize,
  type FontSizeApi,
  type FontSizeKey,
  type FontSizeMap,
} from './font-size';

// Default font family map (matches defaultLightTheme)
export const fontMap = {
  primary: 'Inter, system-ui, sans-serif',
  secondary: 'Roboto, Arial, sans-serif',
  monospace: 'Fira Code, Consolas, monospace',
  display: 'Poppins, Inter, sans-serif',
} as const;

export type FontKey = keyof typeof fontMap;
export type FontMap = Record<FontKey | string, string>;

export type FontApi<
  TFonts extends FontMap | undefined,
  TFontSizes extends FontSizeMap | undefined,
> = {
  size: (
    key:
      | FontSizeKey
      | (TFontSizes extends FontSizeMap ? keyof TFontSizes : never)
  ) => number;
  format: (args: {
    size:
      | FontSizeKey
      | (TFontSizes extends FontSizeMap ? keyof TFontSizes : never);
    family: FontKey | (TFonts extends FontMap ? keyof TFonts : never);
  }) => string;
  family: (
    key: FontKey | (TFonts extends FontMap ? keyof TFonts : never)
  ) => string;
  getAvailableFonts: () => string[];
};

export const createFont = <
  TFonts extends FontMap | undefined = BaseThemeConfig['fonts'],
  TFontSizes extends FontSizeMap | undefined = BaseThemeConfig['fontSizes'],
>(
  fonts?: TFonts,
  fontSizes?: TFontSizes
): FontApi<TFonts, TFontSizes> => {
  const map: FontMap = {
    ...fontMap,
    ...(fonts as FontMap | undefined),
  } as FontMap;

  const fontSizeApi: FontSizeApi<TFontSizes> = createFontSize<TFontSizes>(
    fontSizes as TFontSizes
  );

  const getFamily = (key: string): string => {
    if (key.includes('.')) {
      const [, short] = key.split('.');
      if (short && typeof map[short] === 'string') {
        return map[short] as string;
      }
    }
    return typeof map[key] === 'string' ? (map[key] as string) : key;
  };

  return {
    size: (
      key:
        | FontSizeKey
        | (TFontSizes extends FontSizeMap ? keyof TFontSizes : never)
    ): number => {
      return fontSizeApi.px(key) ?? 0;
    },
    format: ({ size, family }): string => {
      const sizePx = fontSizeApi.px(size) ?? 0;
      return `${sizePx}px '${getFamily(family as string)}'`;
    },
    family: (
      key: FontKey | (TFonts extends FontMap ? keyof TFonts : never)
    ): string => getFamily(key as string),
    getAvailableFonts: (): string[] => {
      return Array.from(
        new Set([...(Object.keys(fontMap) as string[]), ...Object.keys(map)])
      );
    },
  };
};

/**
 * Typography picker for accessing complete typography styles from theme
 */
export class TypographyPicker {
  /**
   * Get complete typography style from theme
   * @param key - Typography key (e.g., 'heading', 'body') or full path
   * @returns Typography style object
   */
  static style(): {
    fontSize?: string;
    fontFamily?: string;
    fontWeight?: number | string;
    lineHeight?: number | string;
    letterSpacing?: number | string;
  } {
    // Deprecated: previously resolved via ThemeManager.
    // This class remains for backwards-compat in type surface but does no resolution now.
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
    // Deprecated: no-op placeholder without ThemeManager
    return [];
  }

  // Removed resolver implementation; kept for binary compatibility in d.ts
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
  static config(): {
    blur?: number;
    offsetX?: number;
    offsetY?: number;
    color?: string;
    alpha?: number;
  } {
    // Check if it's a theme token (with or without effects. prefix)
    // Deprecated: no-op placeholder without ThemeManager
    return {};
  }

  /**
   * Get all available effect tokens from current theme
   * @returns Array of effect token keys
   */
  static getAvailableEffects(): string[] {
    // Deprecated: no-op placeholder without ThemeManager
    return [];
  }
}
