/* eslint-disable no-magic-numbers */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ThemeManager } from '../theme/theme-manager';

import { pallete } from './pallete';

export type ColorKey = keyof typeof pallete;
export type ShadeKey =
  | '50'
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900'
  | '950';
export type ColorToken = `${ColorKey}-${ShadeKey}` | 'black' | 'white';

export class ColorPicker {
  constructor(private colorKey: ColorKey) {}

  /**
   * Get RGB string for a color token or theme token
   * @param color - Color token (e.g., 'blue-500') or theme token (e.g., 'primary', 'colors.primary')
   * @returns RGB string format 'rgb(r, g, b)'
   */
  static rgb(color: ColorToken | string): string {
    // First check if it's a theme token (with or without colors. prefix)
    const colorPath = color.includes('.') ? color : `colors.${color}`;

    if (ThemeManager.hasToken(colorPath)) {
      const themeValue = ThemeManager.getToken(colorPath);
      if (themeValue) {
        // Recursively resolve the theme token
        const resolved = ThemeManager.resolveToken(themeValue as string);
        return ColorPicker.rgb(resolved as ColorToken);
      }
    }

    // Fallback: check if it's a direct theme token (backwards compatibility)
    if (ThemeManager.hasToken(color)) {
      const themeValue = ThemeManager.getToken(color);
      if (themeValue) {
        const resolved = ThemeManager.resolveToken(themeValue as string);
        return ColorPicker.rgb(resolved as ColorToken);
      }
    }

    // Handle direct color tokens
    const parts = color.split('-');
    if (parts.length === 2) {
      const colorKey = parts[0] as ColorKey;
      const shade = parts[1] as ShadeKey;
      const colorValue = pallete[colorKey]?.[shade];
      if (!colorValue) {
        throw new Error(`Color token "${colorKey}-${shade}" not found`);
      }
      return colorValue;
    }

    const colorValue = pallete[color as 'black' | 'white'];
    if (!colorValue) {
      throw new Error(`Color token "${color}" not found`);
    }
    return colorValue;
  }

  /**
   * Get hex number for a color token or theme token
   * @param color - Color token (e.g., 'blue-500') or theme token (e.g., 'primary', 'colors.primary')
   * @returns Hex number format 0xRRGGBB
   */
  static hex(color: ColorToken | string): number {
    // First check if it's a theme token (with or without colors. prefix)
    const colorPath = color.includes('.') ? color : `colors.${color}`;

    if (ThemeManager.hasToken(colorPath)) {
      const themeValue = ThemeManager.getToken(colorPath);
      if (themeValue) {
        // Recursively resolve the theme token
        const resolved = ThemeManager.resolveToken(themeValue as string);
        return ColorPicker.hex(resolved as ColorToken);
      }
    }

    // Fallback: check if it's a direct theme token (backwards compatibility)
    if (ThemeManager.hasToken(color)) {
      const themeValue = ThemeManager.getToken(color);
      if (themeValue) {
        const resolved = ThemeManager.resolveToken(themeValue as string);
        return ColorPicker.hex(resolved as ColorToken);
      }
    }

    // Handle direct color tokens
    const parts = color.split('-');
    if (parts.length === 2) {
      const colorKey = parts[0] as ColorKey;
      const shade = parts[1] as ShadeKey;
      const colorPicker = new ColorPicker(colorKey);
      return colorPicker.getHex(shade);
    }
    const colorToConvert = pallete[color as 'black' | 'white'] as string;
    // Handle 3-digit hex values like #fff by expanding them to 6 digits
    const hex = colorToConvert.slice(1);
    if (hex.length === 3) {
      const r = parseInt(hex[0]! + hex[0]!, 16);
      const g = parseInt(hex[1]! + hex[1]!, 16);
      const b = parseInt(hex[2]! + hex[2]!, 16);
      return (r << 16) + (g << 8) + b;
    }
    return parseInt(hex, 16);
  }

  getRgb(shade: ShadeKey): string {
    const color = pallete[this.colorKey];
    if (typeof color === 'string') {
      return color;
    }
    return color[shade];
  }

  getHex(shade: ShadeKey): number {
    const rgb = this.getRgb(shade);
    if (rgb.startsWith('#')) {
      return parseInt(rgb.slice(1), 16);
    }

    // Extract RGB values from string like 'rgb(x, y, z)'
    const matches = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (!matches) {
      throw new Error(`Invalid RGB format: ${rgb}`);
    }

    const r = parseInt(matches[1]!);
    const g = parseInt(matches[2]!);
    const b = parseInt(matches[3]!);

    // Convert to hex number format 0xRRGGBB
    return (r << 16) + (g << 8) + b;
  }
}
