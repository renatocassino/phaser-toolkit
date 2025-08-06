/* eslint-disable max-lines */
/* eslint-disable sonarjs/no-duplicate-string */
import type { ColorToken } from '../core/color';
import {
  fontSizeMap,
  type FontSizeKey,
  type FontSizeMap,
} from '../core/font-size';
import { spacingMap, type SpacingMap } from '../core/spacing';

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
 * Base theme configuration structure
 * Supports nested objects for organized design tokens
 */
export type BaseThemeConfig = {
  fonts?: FontConfig;
  colors?: ColorConfig;
  spacing?: SpacingConfig;
  typography?: TypographyConfig;
  effects?: EffectConfig;
  // Allow additional custom categories
  custom: {
    [key: string]: unknown;
  };
};

/**
 * Default theme structure following design system best practices
 */
export type DefaultThemeStructure = {
  fonts: {
    primary: string;
    secondary: string;
    monospace: string;
    display: string;
  };
  fontSizes: FontSizeMap;
  colors: {
    // Primary colors
    primary: ColorToken;
    secondary: ColorToken;
    accent: ColorToken;

    // Semantic colors
    success: ColorToken;
    warning: ColorToken;
    error: ColorToken;
    info: ColorToken;

    // Background colors
    background: ColorToken;
    'background-secondary': ColorToken;
    'background-panel': ColorToken;
    'background-modal': ColorToken;

    // Text colors
    text: ColorToken;
    'text-secondary': ColorToken;
    'text-muted': ColorToken;
    'text-inverse': ColorToken;

    // Border colors
    border: ColorToken;
    'border-light': ColorToken;
    'border-focus': ColorToken;

    // Button variants
    'button-primary': ColorToken;
    'button-secondary': ColorToken;
    'button-danger': ColorToken;

    // UI elements
    shadow: ColorToken;
    overlay: ColorToken;
  };
  spacing: SpacingMap;
  typography: {
    heading: {
      fontSize: FontSizeKey;
      fontFamily: string;
      fontWeight: number;
      lineHeight: number;
    };
    'heading-large': {
      fontSize: FontSizeKey;
      fontFamily: string;
      fontWeight: number;
      lineHeight: number;
    };
    body: {
      fontSize: FontSizeKey;
      fontFamily: string;
      fontWeight: number;
      lineHeight: number;
    };
    caption: {
      fontSize: FontSizeKey;
      fontFamily: string;
      fontWeight: number;
      lineHeight: number;
    };
  };
  effects: {
    'shadow-sm': {
      blur: number;
      offsetY: number;
      color: string;
      alpha: number;
    };
    'shadow-md': {
      blur: number;
      offsetY: number;
      color: string;
      alpha: number;
    };
    'shadow-lg': {
      blur: number;
      offsetY: number;
      color: string;
      alpha: number;
    };
  };
  custom: {
    [key: string]: unknown;
  };
};

/**
 * Example theme configurations with structured design tokens
 */
export const defaultLightTheme: DefaultThemeStructure = {
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
    accent: 'purple-500',

    // Semantic colors
    success: 'green-500',
    warning: 'yellow-500',
    error: 'red-500',
    info: 'blue-400',

    // Background colors
    background: 'white',
    'background-secondary': 'gray-50',
    'background-panel': 'gray-100',
    'background-modal': 'white',

    // Text colors
    text: 'gray-900',
    'text-secondary': 'gray-700',
    'text-muted': 'gray-500',
    'text-inverse': 'white',

    // Border colors
    border: 'gray-300',
    'border-light': 'gray-200',
    'border-focus': 'blue-500',

    // Button variants
    'button-primary': 'blue-600',
    'button-secondary': 'gray-600',
    'button-danger': 'red-600',

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

export const defaultDarkTheme: DefaultThemeStructure = {
  fonts: {
    primary: 'Inter, system-ui, sans-serif',
    secondary: 'Roboto, Arial, sans-serif',
    monospace: 'Fira Code, Consolas, monospace',
    display: 'Poppins, Inter, sans-serif',
  },
  fontSizes: { ...fontSizeMap },
  colors: {
    // Primary colors
    primary: 'blue-400',
    secondary: 'gray-400',
    accent: 'purple-400',

    // Semantic colors
    success: 'green-400',
    warning: 'yellow-400',
    error: 'red-400',
    info: 'blue-300',

    // Background colors
    background: 'gray-900',
    'background-secondary': 'gray-800',
    'background-panel': 'gray-700',
    'background-modal': 'gray-800',

    // Text colors
    text: 'white',
    'text-secondary': 'gray-300',
    'text-muted': 'gray-400',
    'text-inverse': 'gray-900',

    // Border colors
    border: 'gray-600',
    'border-light': 'gray-700',
    'border-focus': 'blue-400',

    // Button variants
    'button-primary': 'blue-500',
    'button-secondary': 'gray-500',
    'button-danger': 'red-500',

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
