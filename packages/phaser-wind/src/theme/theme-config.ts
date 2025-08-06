/* eslint-disable max-lines */
/* eslint-disable sonarjs/no-duplicate-string */
import type { ColorToken } from '../core/color';
import {
  fontSizeMap,
  type FontSizeKey,
  type FontSizeMap,
} from '../core/font-size';
import { radiusMap, type RadiusMap } from '../core/radius';
import { spacingMap } from '../core/spacing';

/**
 * Font configuration structure
 */
export type FontConfig = {
  [key: string]: string;
};

/**
 * Color configuration structure
 */
export type ColorConfig = {
  [key: string]: ColorToken | string;
};

/**
 * Spacing configuration structure (following Tailwind spacing scale)
 */
export type SpacingConfig = {
  [key: string]: number;
};

/**
 * Typography configuration structure
 */
export type TypographyConfig = {
  [key: string]: {
    fontSize: FontSizeKey | string;
    fontFamily?: string;
    fontWeight?: number | string;
    lineHeight?: number | string;
    letterSpacing?: number | string;
  };
};

/**
 * Shadow/Effect configuration structure
 */
export type EffectConfig = {
  [key: string]: {
    blur?: number;
    offsetX?: number;
    offsetY?: number;
    color?: ColorToken | string;
    alpha?: number;
  };
};

/**
 * Theme override type - allows partial configuration for theming
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
