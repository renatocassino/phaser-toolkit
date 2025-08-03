/* eslint-disable no-magic-numbers */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
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

  static rgb(color: ColorToken): string {
    const parts = color.split('-');
    if (parts.length === 2) {
      const colorKey = parts[0] as ColorKey;
      const shade = parts[1] as ShadeKey;
      return pallete[colorKey][shade] as string;
    }
    return pallete[color as 'black' | 'white'] as string;
  }

  static hex(color: ColorToken): number {
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
