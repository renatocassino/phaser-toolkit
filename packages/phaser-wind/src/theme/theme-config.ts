/* eslint-disable max-lines */
/* eslint-disable sonarjs/no-duplicate-string */
import {
  fontSizeMap,
  type FontSizeMap,
} from '../core/font-size';
import { radiusMap, type RadiusMap } from '../core/radius';
import { spacingMap } from '../core/spacing';

import {
  type ColorConfig,
  type EffectConfig,
  type FontConfig,
  type SpacingConfig,
  type TypographyConfig,
} from './type';

/**
 * Theme override type - allows partial configuration for theming.
 * This type enables customization of the default theme by overriding existing values
 * and adding new custom tokens.
 * 
 * @typedef {Object} ThemeOverride
 * @property {Partial<FontConfig>} [fonts] - Font family configurations that can override default fonts
 *   or add new font definitions
 * @property {Partial<FontSizeMap> & Record<string,number>} [fontSizes] - Font size tokens that can override
 *   default sizes or add new custom sizes
 * @property {Partial<ColorConfig>} [colors] - Color tokens that can override default colors or add new
 *   color definitions using color tokens or hex values
 * @property {Partial<SpacingConfig>} [spacing] - Spacing scale tokens that can override default spacing
 *   values or add new spacing definitions
 * @property {Partial<TypographyConfig>} [typography] - Typography style tokens that can override default
 *   text styles or add new typography variants
 * @property {Partial<EffectConfig>} [effects] - Visual effect tokens like shadows that can override
 *   defaults or add new effects
 * @property {Partial<RadiusMap> & Record<string,number>} [radius] - Border radius tokens that can override
 *   default radius values or add new radius sizes
 * @property {Record<string,unknown>} [custom] - Additional custom theme tokens that can be used for
 *   specific needs
 */
export type ThemeOverride = {
  fonts?: Partial<FontConfig>;
  fontSizes?: Partial<FontSizeMap> & { [key: string]: number };
  colors?: Partial<ColorConfig>;
  spacing?: Partial<SpacingConfig>;
  typography?: Partial<TypographyConfig>;
  effects?: Partial<EffectConfig>;
  radius?: Partial<RadiusMap> & { [key: string]: number };
  custom?: { [key: string]: unknown };
};

/**
 * Base theme configuration structure
 * Supports nested objects for organized design tokens
 */
export type BaseThemeConfig = {
  fonts?: FontConfig;
  fontSizes?: FontSizeMap & {
    [key: string]: number;
  };
  colors?: ColorConfig;
  spacing?: SpacingConfig;
  typography?: TypographyConfig;
  effects?: EffectConfig;
  radius?: RadiusMap & {
    [key: string]: number;
  };
  custom?: {
    [key: string]: unknown;
  };
};

/**
 * Example theme configurations with structured design tokens
 */
export const defaultLightTheme: BaseThemeConfig = {
  fonts: {
    primary: 'Inter, system-ui, sans-serif',
    secondary: 'Roboto, Arial, sans-serif',
    monospace: 'Fira Code, Consolas, monospace',
    display: 'Poppins, Inter, sans-serif',
  },
  fontSizes: { ...fontSizeMap },
  colors: {
    // Primary colors
    primary: 'blue-600',
    secondary: 'gray-600',

    // Semantic colors
    success: 'green-500',
    warning: 'yellow-500',
    error: 'red-500',
    info: 'blue-400',

    // Background colors
    background: 'white',

    // Text colors
    text: 'gray-900',

    // UI elements
    shadow: 'black',
    overlay: 'black',
  },
  spacing: { ...spacingMap },
  typography: {
    heading: {
      fontSize: '2xl',
      fontFamily: 'fonts.display',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    'heading-large': {
      fontSize: '4xl',
      fontFamily: 'fonts.display',
      fontWeight: 700,
      lineHeight: 1.1,
    },
    body: {
      fontSize: 'base',
      fontFamily: 'fonts.primary',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    caption: {
      fontSize: 'sm',
      fontFamily: 'fonts.primary',
      fontWeight: 400,
      lineHeight: 1.4,
    },
  },
  // TODO: Check this implementation
  effects: {
    'shadow-sm': {
      blur: 2,
      offsetY: 1,
      color: 'colors.shadow',
      alpha: 0.05,
    },
    'shadow-md': {
      blur: 4,
      offsetY: 2,
      color: 'colors.shadow',
      alpha: 0.1,
    },
    'shadow-lg': {
      blur: 8,
      offsetY: 4,
      color: 'colors.shadow',
      alpha: 0.1,
    },
  },
  custom: {},
};

export const defaultDarkTheme: BaseThemeConfig = {
  fonts: {
    primary: 'Inter, system-ui, sans-serif',
    secondary: 'Roboto, Arial, sans-serif',
    monospace: 'Fira Code, Consolas, monospace',
    display: 'Poppins, Inter, sans-serif',
  },
  fontSizes: { ...fontSizeMap },
  radius: { ...radiusMap },
  colors: {
    // Primary colors
    primary: 'blue-400',
    secondary: 'gray-400',

    // Semantic colors
    success: 'green-400',
    warning: 'yellow-400',
    error: 'red-400',
    info: 'blue-300',

    // Background colors
    background: 'gray-900',

    // Text colors
    text: 'white',

    // UI elements
    shadow: 'black',
    overlay: 'black',
  },
  spacing: { ...spacingMap },
  typography: {
    heading: {
      fontSize: '2xl',
      fontFamily: 'fonts.display',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    'heading-large': {
      fontSize: '4xl',
      fontFamily: 'fonts.display',
      fontWeight: 700,
      lineHeight: 1.1,
    },
    body: {
      fontSize: 'base',
      fontFamily: 'fonts.primary',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    caption: {
      fontSize: 'sm',
      fontFamily: 'fonts.primary',
      fontWeight: 400,
      lineHeight: 1.4,
    },
  },
  effects: {
    'shadow-sm': {
      blur: 2,
      offsetY: 1,
      color: 'colors.shadow',
      alpha: 0.1,
    },
    'shadow-md': {
      blur: 4,
      offsetY: 2,
      color: 'colors.shadow',
      alpha: 0.15,
    },
    'shadow-lg': {
      blur: 8,
      offsetY: 4,
      color: 'colors.shadow',
      alpha: 0.2,
    },
  },
  custom: {},
};

/**
 * Type helper to create strongly-typed custom themes
 */
export type CreateTheme<T extends BaseThemeConfig> = T;

/**
 * Type helper to extract theme token keys
 */
export type ThemeTokenKeys<T extends BaseThemeConfig> = keyof T;
