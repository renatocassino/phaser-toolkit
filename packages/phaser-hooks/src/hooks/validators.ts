/**
 * State validator function type
 */
export type StateValidator = (value: unknown) => boolean | string;

/**
 * Creates a state validator function for common patterns
 */
export const validators = {
  /**
   * Validates that a number is within a range
   */
  numberRange:
    (min: number, max: number): StateValidator =>
    (value: unknown): boolean | string => {
      const num = value as number;
      if (typeof num !== 'number' || Number.isNaN(num)) {
        return 'Value must be a number';
      }
      if (num < min || num > max) {
        return `Value must be between ${min} and ${max}`;
      }
      return true;
    },

  /**
   * Validates that a string is not empty
   */
  nonEmptyString: (value: unknown): boolean | string => {
    const str = value as string;
    if (typeof str !== 'string' || str.trim().length === 0) {
      return 'Value must be a non-empty string';
    }
    return true;
  },

  /**
   * Validates that an array has a specific length range
   */
  arrayLength:
    (min: number, max?: number): StateValidator =>
    (value: unknown): boolean | string => {
      const arr = value as unknown[];
      if (!Array.isArray(arr)) {
        return 'Value must be an array';
      }
      if (arr.length < min) {
        return `Array must have at least ${min} items`;
      }
      if (max !== undefined && arr.length > max) {
        return `Array must have at most ${max} items`;
      }
      return true;
    },

  /**
   * Validates that a value is one of the allowed options
   */
  oneOf:
    <T>(allowedValues: T[]): StateValidator =>
    (value: unknown): boolean | string => {
      if (!allowedValues.includes(value as T)) {
        return `Value must be one of: ${allowedValues.join(', ')}`;
      }
      return true;
    },
};
