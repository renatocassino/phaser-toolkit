/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines-per-function */
import { describe, expect, it } from 'vitest';

import { createTheme, ThemeManager } from '../theme';

import { ColorPicker, type ColorKey, type ShadeKey } from './color-picker';

describe('ColorPicker', () => {
  it('should get the correct hex value for a shade', () => {
    const colorPicker = new ColorPicker('slate');
    expect(colorPicker.getHex('50')).toBe(0xf8fafc);
  });

  it.each([
    ['slate', '50', 0xf8fafc],
    ['slate', '900', 0x0f172a],
    ['rose', '500', 0xf43f5e],
    ['fuchsia', '400', 0xe879f9],
    ['zinc', '200', 0xe4e4e7],
    ['gray', '600', 0x4b5563],
    ['pink', '300', 0xf9a8d4],
    ['stone', '700', 0x44403c],
  ])('should convert %s-%s to hex %s', (color, shade, expected) => {
    const colorPicker = new ColorPicker(color as ColorKey);
    expect(colorPicker.getHex(shade as ShadeKey)).toBe(expected);
  });

  it('should convert color token to rgb using static method', () => {
    expect(ColorPicker.rgb('slate-50')).toBe('rgb(248, 250, 252)');
    expect(ColorPicker.rgb('black')).toBe('#000');
    expect(ColorPicker.rgb('white')).toBe('#fff');
  });

  it('should convert color token to hex using static method', () => {
    expect(ColorPicker.hex('slate-50')).toBe(0xf8fafc);
    expect(ColorPicker.hex('black')).toBe(0x000000);
    expect(ColorPicker.hex('white')).toBe(0xffffff);
    expect(ColorPicker.hex('slate-900')).toBe(0x0f172a);
    expect(ColorPicker.hex('slate-500')).toBe(0x64748b);
    expect(ColorPicker.hex('slate-200')).toBe(0xe2e8f0);
    expect(ColorPicker.hex('slate-100')).toBe(0xf1f5f9);
    expect(ColorPicker.hex('slate-50')).toBe(0xf8fafc);
    expect(ColorPicker.hex('slate-950')).toBe(0x020617);
    expect(ColorPicker.hex('slate-800')).toBe(0x1e293b);
  });

  describe('with theme manager', () => {
    const fakeTheme = createTheme({
      colors: {
        primary: 'red-500',
        secondary: 'slate-50',
      },
    });

    ThemeManager.init(fakeTheme);

    it('should get the correct hex in theme', () => {
      expect(ColorPicker.rgb('colors.primary')).toBe('rgb(239, 68, 68)');
    });

    it('should get the correct hex in theme using color token', () => {
      expect(ColorPicker.rgb('colors.secondary')).toBe('rgb(248, 250, 252)');
    });

    it('should throw an error if the color token is not found', () => {
      expect(() => ColorPicker.rgb('colors.not-found')).toThrow(
        'Color token "colors.not-found" not found'
      );
    });
  });
});
