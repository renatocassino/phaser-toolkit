/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
/* eslint-disable sonarjs/no-duplicate-string */
import { afterAll, beforeEach, describe, expect, it } from 'vitest';

import { ThemeManager } from '../theme/theme-manager';

import { Spacing } from './spacing';

describe('Spacing', () => {
  beforeEach(() => {
    ThemeManager.clear();
  });

  afterAll(() => {
    ThemeManager.clear();
  });

  describe('px', () => {
    it('should return pixel values', () => {
      expect(Spacing.px('2')).toBe(8);
      expect(Spacing.px('4')).toBe(16);
      expect(Spacing.px('8')).toBe(32);
    });
  });

  describe('rem', () => {
    it('should convert pixel values to rem', () => {
      expect(Spacing.rem('16')).toBe(4);
      expect(Spacing.rem('8')).toBe(2);
      expect(Spacing.rem('4')).toBe(1);
    });
  });

  describe('css', () => {
    it('should return pixel values as CSS strings', () => {
      expect(Spacing.css('2')).toBe('8px');
      expect(Spacing.css('4')).toBe('16px');
      expect(Spacing.css('8')).toBe('32px');
    });

    it('should handle theme values', () => {
      expect(Spacing.css('custom')).toBe('0px');
      expect(Spacing.css('11')).toBe('44px');

      ThemeManager.setThemeObject({
        spacing: {
          custom: 42,
          '11': 100,
        },
      });
      expect(Spacing.css('custom')).toBe('42px');
      expect(Spacing.css('11')).toBe('100px');
    });
  });
});
