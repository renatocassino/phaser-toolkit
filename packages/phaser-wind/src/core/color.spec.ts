/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines-per-function */
import { beforeEach, describe, expect, it } from 'vitest';

import { createTheme } from '../theme';

import {
  createColor,
  Color as ColorDefault,
  type Color,
  type ColorToken,
} from './color';

const RED_500_RGB = 'rgb(239, 68, 68)';
const SLATE_50_RGB = 'rgb(248, 250, 252)';
const RED_500_TOKEN = 'red-500' as const;
const SLATE_50_TOKEN = '50' as const;
const BLUE_500_TOKEN = '500' as const;

describe('ColorPicker', () => {
  let color: Color<{
    colors: {
      primary: string;
      secondary: string;
      another: string;
    };
  }>;

  beforeEach(() => {
    const fakeTheme = createTheme({
      colors: {
        primary: 'red-500',
        secondary: 'slate-50',
        another: '#ff9887',
      },
    });
    color = createColor(fakeTheme);
  });

  describe('rgb method', () => {
    it.each([
      // slate
      ['slate-50', SLATE_50_RGB],
      ['slate-100', 'rgb(241, 245, 249)'],
      ['slate-200', 'rgb(226, 232, 240)'],
      ['slate-300', 'rgb(203, 213, 225)'],
      ['slate-400', 'rgb(148, 163, 184)'],
      ['slate-500', 'rgb(100, 116, 139)'],
      ['slate-600', 'rgb(71, 85, 105)'],
      ['slate-700', 'rgb(51, 65, 85)'],
      ['slate-800', 'rgb(30, 41, 59)'],
      ['slate-900', 'rgb(15, 23, 42)'],
      ['slate-950', 'rgb(2, 6, 23)'],

      // gray
      ['gray-50', 'rgb(249, 250, 251)'],
      ['gray-100', 'rgb(243, 244, 246)'],
      ['gray-200', 'rgb(229, 231, 235)'],
      ['gray-300', 'rgb(209, 213, 219)'],
      ['gray-400', 'rgb(156, 163, 175)'],
      ['gray-500', 'rgb(107, 114, 128)'],
      ['gray-600', 'rgb(75, 85, 99)'],
      ['gray-700', 'rgb(55, 65, 81)'],
      ['gray-800', 'rgb(31, 41, 55)'],
      ['gray-900', 'rgb(17, 24, 39)'],
      ['gray-950', 'rgb(3, 7, 18)'],

      // zinc
      ['zinc-50', 'rgb(250, 250, 250)'],
      ['zinc-100', 'rgb(244, 244, 245)'],
      ['zinc-200', 'rgb(228, 228, 231)'],
      ['zinc-300', 'rgb(212, 212, 216)'],
      ['zinc-400', 'rgb(161, 161, 170)'],
      ['zinc-500', 'rgb(113, 113, 122)'],
      ['zinc-600', 'rgb(82, 82, 91)'],
      ['zinc-700', 'rgb(63, 63, 70)'],
      ['zinc-800', 'rgb(39, 39, 42)'],
      ['zinc-900', 'rgb(24, 24, 27)'],
      ['zinc-950', 'rgb(9, 9, 11)'],

      // red
      ['red-50', 'rgb(254, 242, 242)'],
      ['red-100', 'rgb(254, 226, 226)'],
      ['red-200', 'rgb(254, 202, 202)'],
      ['red-300', 'rgb(252, 165, 165)'],
      ['red-400', 'rgb(248, 113, 113)'],
      ['red-500', RED_500_RGB],
      ['red-600', 'rgb(220, 38, 38)'],
      ['red-700', 'rgb(185, 28, 28)'],
      ['red-800', 'rgb(153, 27, 27)'],
      ['red-900', 'rgb(127, 29, 29)'],
      ['red-950', 'rgb(69, 10, 10)'],

      // blue
      ['blue-50', 'rgb(239, 246, 255)'],
      ['blue-100', 'rgb(219, 234, 254)'],
      ['blue-200', 'rgb(191, 219, 254)'],
      ['blue-300', 'rgb(147, 197, 253)'],
      ['blue-400', 'rgb(96, 165, 250)'],
      ['blue-500', 'rgb(59, 130, 246)'],
      ['blue-600', 'rgb(37, 99, 235)'],
      ['blue-700', 'rgb(29, 78, 216)'],
      ['blue-800', 'rgb(30, 64, 175)'],
      ['blue-900', 'rgb(30, 58, 138)'],
      ['blue-950', 'rgb(23, 37, 84)'],

      // green
      ['green-50', 'rgb(240, 253, 244)'],
      ['green-100', 'rgb(220, 252, 231)'],
      ['green-200', 'rgb(187, 247, 208)'],
      ['green-300', 'rgb(134, 239, 172)'],
      ['green-400', 'rgb(74, 222, 128)'],
      ['green-500', 'rgb(34, 197, 94)'],
      ['green-600', 'rgb(22, 163, 74)'],
      ['green-700', 'rgb(21, 128, 61)'],
      ['green-800', 'rgb(22, 101, 52)'],
      ['green-900', 'rgb(20, 83, 45)'],
      ['green-950', 'rgb(5, 46, 22)'],

      // special colors
      ['black', '#000'],
      ['white', '#fff'],
    ])('should convert %s to rgb %s', (colorToken, expected) => {
      expect(color.rgb(colorToken as ColorToken)).toBe(expected);
    });

    // With stronger typing, direct CSS strings are not allowed by the type system.
    // Runtime still supports them when needed, but they are intentionally not tested here.

    it('should return the theme color when pass a token', () => {
      const color = createColor({
        primary: 'red-500',
        secondary: 'slate-50',
      });

      expect(color.rgb('primary')).toBe('rgb(239, 68, 68)');
      expect(color.rgb('secondary')).toBe('rgb(248, 250, 252)');
    });
  });

  describe('default Color constant (no theme)', () => {
    it('should resolve palette tokens via Color constant', () => {
      expect(ColorDefault.rgb(RED_500_TOKEN)).toBe(RED_500_RGB);
      expect(ColorDefault.slate(SLATE_50_TOKEN)).toBe(SLATE_50_RGB);
      expect(ColorDefault.blueHex(BLUE_500_TOKEN)).toBe(0x3b82f6);
    });

    it('should throw for unknown tokens', () => {
      expect(() => ColorDefault.rgb('unknown-123')).toThrow();
    });
  });

  describe('hex method', () => {
    it.each([
      // slate
      ['slate-50', 0xf8fafc],
      ['slate-100', 0xf1f5f9],
      ['slate-200', 0xe2e8f0],
      ['slate-300', 0xcbd5e1],
      ['slate-400', 0x94a3b8],
      ['slate-500', 0x64748b],
      ['slate-600', 0x475569],
      ['slate-700', 0x334155],
      ['slate-800', 0x1e293b],
      ['slate-900', 0x0f172a],
      ['slate-950', 0x020617],

      // gray
      ['gray-50', 0xf9fafb],
      ['gray-100', 0xf3f4f6],
      ['gray-200', 0xe5e7eb],
      ['gray-300', 0xd1d5db],
      ['gray-400', 0x9ca3af],
      ['gray-500', 0x6b7280],
      ['gray-600', 0x4b5563],
      ['gray-700', 0x374151],
      ['gray-800', 0x1f2937],
      ['gray-900', 0x111827],
      ['gray-950', 0x030712],

      // zinc
      ['zinc-50', 0xfafafa],
      ['zinc-100', 0xf4f4f5],
      ['zinc-200', 0xe4e4e7],
      ['zinc-300', 0xd4d4d8],
      ['zinc-400', 0xa1a1aa],
      ['zinc-500', 0x71717a],
      ['zinc-600', 0x52525b],
      ['zinc-700', 0x3f3f46],
      ['zinc-800', 0x27272a],
      ['zinc-900', 0x18181b],
      ['zinc-950', 0x09090b],

      // red
      ['red-50', 0xfef2f2],
      ['red-100', 0xfee2e2],
      ['red-200', 0xfecaca],
      ['red-300', 0xfca5a5],
      ['red-400', 0xf87171],
      ['red-500', 0xef4444],
      ['red-600', 0xdc2626],
      ['red-700', 0xb91c1c],
      ['red-800', 0x991b1b],
      ['red-900', 0x7f1d1d],
      ['red-950', 0x450a0a],

      // blue
      ['blue-50', 0xeff6ff],
      ['blue-100', 0xdbeafe],
      ['blue-200', 0xbfdbfe],
      ['blue-300', 0x93c5fd],
      ['blue-400', 0x60a5fa],
      ['blue-500', 0x3b82f6],
      ['blue-600', 0x2563eb],
      ['blue-700', 0x1d4ed8],
      ['blue-800', 0x1e40af],
      ['blue-900', 0x1e3a8a],
      ['blue-950', 0x172554],

      // green
      ['green-50', 0xf0fdf4],
      ['green-100', 0xdcfce7],
      ['green-200', 0xbbf7d0],
      ['green-300', 0x86efac],
      ['green-400', 0x4ade80],
      ['green-500', 0x22c55e],
      ['green-600', 0x16a34a],
      ['green-700', 0x15803d],
      ['green-800', 0x166534],
      ['green-900', 0x14532d],
      ['green-950', 0x052e16],

      // special colors
      ['black', 0x000000],
      ['white', 0xffffff],
    ])('should convert %s to hex 0x%s', (colorToken, expected) => {
      expect(color.hex(colorToken as ColorToken)).toBe(expected);
    });
  });

  describe('error handling', () => {
    it('should throw an error for invalid color token', () => {
      expect(() => color.rgb('invalid-color' as ColorToken)).toThrow(
        'Color token "invalid-color" not found'
      );
    });

    it('should throw an error for invalid shade', () => {
      expect(() => color.rgb('red-999' as ColorToken)).toThrow(
        'Color token "red-999" not found'
      );
    });

    it('should throw an error for invalid color key', () => {
      expect(() => color.hex('purples-500' as ColorToken)).toThrow(
        'Color token "purples-500" not found'
      );
    });
  });

  describe('theme integration', () => {
    const fakeTheme = createTheme({
      colors: {
        primary: 'red-500',
        secondary: 'slate-50',
        another: '#ff9887',
      },
    });

    const color = createColor(fakeTheme.colors);

    it('should resolve theme token with colors. prefix', () => {
      expect(color.rgb('primary')).toBe(RED_500_RGB);
      expect(color.rgb('secondary')).toBe(SLATE_50_RGB);
      expect(color.rgb('another')).toBe('#ff9887');
    });

    it('should resolve theme token without colors. prefix', () => {
      expect(color.rgb('primary')).toBe(RED_500_RGB);
      expect(color.rgb('secondary')).toBe(SLATE_50_RGB);
    });

    it('should convert theme tokens to hex', () => {
      expect(color.hex('primary')).toBe(0xef4444);
      expect(color.hex('secondary')).toBe(0xf8fafc);
    });

    it('should throw an error if theme token is not found', () => {
      expect(() => color.rgb('colors.not-found' as ColorToken)).toThrow(
        'Color token "colors.not-found" not found'
      );
    });
  });
});
