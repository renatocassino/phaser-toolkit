/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines-per-function */
/* eslint-disable sonarjs/no-duplicate-string */
import { describe, expect, it } from 'vitest';

import { createOpacity, Opacity } from './opacity';

describe('Opacity', () => {
  describe('value', () => {
    it('should return alpha values in 0..1 range', () => {
      const opacity = createOpacity();
      expect(opacity.value('0')).toBe(0);
      expect(opacity.value('50')).toBe(0.5);
      expect(opacity.value('100')).toBe(1);
    });

    it('should handle every tailwind step', () => {
      const opacity = createOpacity();
      expect(opacity.value('5')).toBe(0.05);
      expect(opacity.value('25')).toBe(0.25);
      expect(opacity.value('75')).toBe(0.75);
      expect(opacity.value('95')).toBe(0.95);
    });
  });

  describe('percent', () => {
    it('should return values as percentages (0..100)', () => {
      const opacity = createOpacity();
      expect(opacity.percent('0')).toBe(0);
      expect(opacity.percent('50')).toBe(50);
      expect(opacity.percent('100')).toBe(100);
    });
  });

  describe('css', () => {
    it('should return CSS opacity strings', () => {
      const opacity = createOpacity();
      expect(opacity.css('0')).toBe('0%');
      expect(opacity.css('50')).toBe('50%');
      expect(opacity.css('100')).toBe('100%');
    });

    it('should work with default Opacity constant', () => {
      expect(Opacity.value('50')).toBe(0.5);
      expect(Opacity.percent('75')).toBe(75);
      expect(Opacity.css('25')).toBe('25%');
    });
  });

  describe('theme override', () => {
    it('should resolve custom theme opacity keys', () => {
      const opacity = createOpacity({ faded: 0.35, ghost: 0.08 });
      expect(opacity.value('faded')).toBe(0.35);
      expect(opacity.value('ghost')).toBe(0.08);
    });

    it('should keep default tokens available alongside theme keys', () => {
      const opacity = createOpacity({ faded: 0.35 });
      expect(opacity.value('50')).toBe(0.5);
      expect(opacity.value('faded')).toBe(0.35);
    });

    it('should let theme keys override default keys with the same name', () => {
      const opacity = createOpacity({ '50': 0.42 });
      expect(opacity.value('50')).toBe(0.42);
    });
  });
});
