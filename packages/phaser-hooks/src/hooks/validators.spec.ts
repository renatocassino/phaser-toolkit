/* eslint-disable no-magic-numbers */
import { describe, expect, it } from 'vitest';

import { validators } from './validators';

/* eslint-disable max-lines-per-function */
describe('validators', () => {
  describe('numberRange', () => {
    const validator = validators.numberRange(0, 100);

    it('should return true for valid numbers in range', () => {
      expect(validator(50)).toBe(true);
      expect(validator(0)).toBe(true);
      expect(validator(100)).toBe(true);
    });

    it('should return error message for invalid numbers', () => {
      expect(validator(-1)).toBe('Value must be between 0 and 100');
      expect(validator(101)).toBe('Value must be between 0 and 100');
      expect(validator('50')).toBe('Value must be a number');
      expect(validator(NaN)).toBe('Value must be a number');
    });
  });

  describe('nonEmptyString', () => {
    it('should return true for valid non-empty strings', () => {
      expect(validators.nonEmptyString('test')).toBe(true);
      expect(validators.nonEmptyString('  test  ')).toBe(true);
    });

    it('should return error message for invalid strings', () => {
      const message = 'Value must be a non-empty string';
      expect(validators.nonEmptyString('')).toBe(message);
      expect(validators.nonEmptyString('   ')).toBe(message);
      expect(validators.nonEmptyString(123)).toBe(message);
    });
  });

  describe('arrayLength', () => {
    const validator = validators.arrayLength(2, 4);

    it('should return true for arrays with valid length', () => {
      expect(validator([1, 2])).toBe(true);
      expect(validator([1, 2, 3])).toBe(true);
      expect(validator([1, 2, 3, 4])).toBe(true);
    });

    it('should return error message for invalid arrays', () => {
      expect(validator([1])).toBe('Array must have at least 2 items');
      expect(validator([1, 2, 3, 4, 5])).toBe(
        'Array must have at most 4 items'
      );
      expect(validator('not an array')).toBe('Value must be an array');
    });

    it('should work with only minimum length specified', () => {
      const minOnlyValidator = validators.arrayLength(2);
      expect(minOnlyValidator([1, 2])).toBe(true);
      expect(minOnlyValidator([1, 2, 3, 4, 5])).toBe(true);
      expect(minOnlyValidator([1])).toBe('Array must have at least 2 items');
    });
  });

  describe('oneOf', () => {
    const validator = validators.oneOf(['a', 'b', 'c']);

    it('should return true for allowed values', () => {
      expect(validator('a')).toBe(true);
      expect(validator('b')).toBe(true);
      expect(validator('c')).toBe(true);
    });

    it('should return error message for disallowed values', () => {
      expect(validator('d')).toBe('Value must be one of: a, b, c');
      expect(validator(123)).toBe('Value must be one of: a, b, c');
    });
  });
});
