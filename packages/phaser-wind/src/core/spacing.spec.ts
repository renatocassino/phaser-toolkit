/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
/* eslint-disable sonarjs/no-duplicate-string */
import { describe, expect, it } from 'vitest';

import { createSpacing, Spacing } from './spacing';

describe('Spacing', () => {
  describe('px', () => {
    it('should return pixel values', () => {
      const spacing = createSpacing();
      expect(spacing.px('2')).toBe(8);
      expect(spacing.px('4')).toBe(16);
      expect(spacing.px('8')).toBe(32);
    });
  });

  describe('rem', () => {
    it('should convert pixel values to rem', () => {
      const spacing = createSpacing();
      expect(spacing.rem('16')).toBe(4);
      expect(spacing.rem('8')).toBe(2);
      expect(spacing.rem('4')).toBe(1);
    });
  });

  describe('css', () => {
    it('should return pixel values as CSS strings', () => {
      const spacing = createSpacing();
      expect(spacing.css('2')).toBe('8px');
      expect(spacing.css('4')).toBe('16px');
      expect(spacing.css('8')).toBe('32px');
    });

    it('should work with default Spacing constant', () => {
      expect(Spacing.px('2')).toBe(8);
      expect(Spacing.css('4')).toBe('16px');
      expect(Spacing.rem('8')).toBe(2);
    });
  });
});
