/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
/* eslint-disable sonarjs/no-duplicate-string */
import { afterAll, beforeEach, describe, expect, it } from 'vitest';

import { ThemeManager } from '../theme';

import { FontSize, fontSizeMap } from './font-size';

describe('FontSize', () => {
  beforeEach(() => {
    ThemeManager.clear();
  });

  afterAll(() => {
    ThemeManager.clear();
  });

  describe('px', () => {
    it('should return pixel value for font size key', () => {
      expect(FontSize.px('sm')).toBe(14);
      expect(FontSize.px('lg')).toBe(18);
      expect(FontSize.px('2xl')).toBe(24);
    });
  });

  describe('rem', () => {
    it('should convert pixel value to rem', () => {
      expect(FontSize.rem('sm')).toBe(14 / 16);
      expect(FontSize.rem('lg')).toBe(18 / 16);
      expect(FontSize.rem('2xl')).toBe(24 / 16);
    });

    it('should handle theme values', () => {
      ThemeManager.setThemeObject({
        fontSizes: {
          sm: 16,
          lg: 24,
          '2xl': 32,
        },
      });

      expect(FontSize.rem('sm')).toBe(1); // 16/16
      expect(FontSize.rem('lg')).toBe(1.5); // 24/16
      expect(FontSize.rem('2xl')).toBe(2); // 32/16
    });

    it('should return 0 for invalid keys', () => {
      expect(FontSize.rem('invalid')).toBe(0);
    });
  });
  describe('css', () => {
    it('should return CSS string with px unit', () => {
      expect(FontSize.css('sm')).toBe('14px');
      expect(FontSize.css('lg')).toBe('18px');
      expect(FontSize.css('2xl')).toBe('24px');
    });
  });

  describe('with theme', () => {
    it('should return value from theme', () => {
      expect(FontSize.px('sm')).toBe(fontSizeMap.sm);
      expect(FontSize.px('lg')).toBe(fontSizeMap.lg);
      expect(FontSize.px('2xl')).toBe(fontSizeMap['2xl']);

      ThemeManager.setThemeObject({
        fontSizes: {
          sm: 16,
          lg: 24,
          '2xl': 32,
          custom: 42,
          '11': 100,
        },
      });

      expect(FontSize.px('sm')).toBe(16);
      expect(FontSize.px('lg')).toBe(24);
      expect(FontSize.px('2xl')).toBe(32);
      expect(FontSize.px('custom')).toBe(42);
      expect(FontSize.px('11')).toBe(100);
    });
  });
});
