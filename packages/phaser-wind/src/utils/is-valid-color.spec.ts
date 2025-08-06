/* eslint-disable max-lines-per-function */
/* eslint-disable sonarjs/no-duplicate-string */
import { describe, expect, it } from 'vitest';

import { isValidColor } from './is-valid-color';

describe('isValidColor', () => {
  describe('hex colors', () => {
    it('should return true for valid 6-digit hex colors', () => {
      expect(isValidColor('#000000')).toBe(true);
      expect(isValidColor('#FFFFFF')).toBe(true);
      expect(isValidColor('#ff0000')).toBe(true);
      expect(isValidColor('#00ff00')).toBe(true);
      expect(isValidColor('#0000ff')).toBe(true);
    });

    it('should return true for valid 3-digit hex colors', () => {
      expect(isValidColor('#000')).toBe(true);
      expect(isValidColor('#FFF')).toBe(true);
      expect(isValidColor('#f00')).toBe(true);
      expect(isValidColor('#0f0')).toBe(true);
      expect(isValidColor('#00f')).toBe(true);
    });

    it('should return false for invalid hex colors', () => {
      expect(isValidColor('#12')).toBe(false);
      expect(isValidColor('#1234')).toBe(false);
      expect(isValidColor('#12345')).toBe(false);
      expect(isValidColor('#1234567')).toBe(false);
      expect(isValidColor('#xyz')).toBe(false);
    });
  });

  describe('rgb/rgba colors', () => {
    it('should return true for rgb format', () => {
      expect(isValidColor('rgb(0, 0, 0)')).toBe(true);
      expect(isValidColor('rgb(255, 255, 255)')).toBe(true);
      expect(isValidColor('rgb(100%, 0%, 0%)')).toBe(true);
      expect(isValidColor('rgb(0,0,0)')).toBe(true);
      expect(isValidColor('rgb( 0, 0, 0 )')).toBe(true);
      expect(isValidColor('  rgb(0, 0, 0)')).toBe(true);
      expect(isValidColor('rgb(0, 0, 0)  ')).toBe(true);
    });

    it('should return true for rgba format', () => {
      expect(isValidColor('rgba(0, 0, 0, 1)')).toBe(true);
      expect(isValidColor('rgba(255, 255, 255, 0.5)')).toBe(true);
      expect(isValidColor('rgba(0,0,0,1)')).toBe(true);
      expect(isValidColor('rgba( 0, 0, 0, 1 )')).toBe(true);
      expect(isValidColor('  rgba(0, 0, 0, 1)')).toBe(true);
      expect(isValidColor('rgba(0, 0, 0, 1)  ')).toBe(true);
    });
  });

  describe('oklch colors', () => {
    it('should return true for oklch format', () => {
      expect(isValidColor('oklch(40% 0.268 34.568)')).toBe(true);
      expect(isValidColor('oklch(40% 0.268 34.568 / 1)')).toBe(true);
      expect(isValidColor('oklch( 40% 0.268 34.568 )')).toBe(true);
      expect(isValidColor('  oklch(40% 0.268 34.568)')).toBe(true);
      expect(isValidColor('oklch(40% 0.268 34.568)  ')).toBe(true);
      expect(isValidColor('oklch(0.5 0.2 268)')).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('should return false for non-color strings', () => {
      expect(isValidColor('not a color')).toBe(false);
      expect(isValidColor('')).toBe(false);
      expect(isValidColor('123456')).toBe(false);
      expect(isValidColor('   ')).toBe(false);
      expect(isValidColor('\t')).toBe(false);
      expect(isValidColor('\n')).toBe(false);
      expect(isValidColor('oklch(40%0.268 34.568)')).toBe(false);
    });

    it('should return false for hex colors without #', () => {
      expect(isValidColor('000000')).toBe(false);
      expect(isValidColor('FFFFFF')).toBe(false);
      expect(isValidColor('  000000')).toBe(false);
      expect(isValidColor('FFFFFF  ')).toBe(false);
    });

    it('should handle hex colors with spacing correctly', () => {
      expect(isValidColor('  #000000')).toBe(true);
      expect(isValidColor('#000000  ')).toBe(true);
      expect(isValidColor('#  000000')).toBe(false);
      expect(isValidColor('# 000000')).toBe(false);
    });
  });
});
