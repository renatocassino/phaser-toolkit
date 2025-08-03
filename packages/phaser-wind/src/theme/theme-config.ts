import type { ColorToken } from '../color/color-picker';

/**
 * Base theme configuration interface
 * Developers can extend this to create their own theme structure
 */
export type BaseThemeConfig = {
  [key: string]: ColorToken | string | number;
};

/**
 * Default theme tokens following common design patterns
 */
export type DefaultThemeTokens = {
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

/**
 * Example theme configurations
 */
export const defaultLightTheme: DefaultThemeTokens = {
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
};

export const defaultDarkTheme: DefaultThemeTokens = {
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
};

/**
 * Type helper to create strongly-typed custom themes
 */
export type CreateTheme<T extends BaseThemeConfig> = T;

/**
 * Type helper to extract theme token keys
 */
export type ThemeTokenKeys<T extends BaseThemeConfig> = keyof T;
