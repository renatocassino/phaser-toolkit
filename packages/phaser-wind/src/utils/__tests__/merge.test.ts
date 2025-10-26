import { merge, mergeDeep } from '../merge';

describe('merge', () => {
  describe('basic functionality', () => {
    it('should merge simple objects', () => {
      const target = { a: 1, b: 2 };
      const source = { b: 3, c: 4 };
      const result = merge(target, source);

      expect(result).toEqual({ a: 1, b: 3, c: 4 });
    });

    it('should merge multiple sources', () => {
      const target = { a: 1, b: 2 };
      const source1 = { b: 3, c: 4 };
      const source2 = { c: 5, d: 6 };
      const result = merge(target, source1, source2);

      expect(result).toEqual({ a: 1, b: 3, c: 5, d: 6 });
    });

    it('should handle empty objects', () => {
      const target = {};
      const source = { a: 1, b: 2 };
      const result = merge(target, source);

      expect(result).toEqual({ a: 1, b: 2 });
    });

    it('should handle null and undefined sources', () => {
      const target = { a: 1 };
      const result = merge(target, null, undefined);

      expect(result).toEqual({ a: 1 });
    });
  });

  describe('deep merging', () => {
    it('should deep merge nested objects', () => {
      const target = {
        a: 1,
        b: {
          c: 2,
          d: 3
        }
      };
      const source = {
        b: {
          c: 4,
          e: 5
        },
        f: 6
      };
      const result = merge(target, source);

      expect(result).toEqual({
        a: 1,
        b: {
          c: 4,
          d: 3,
          e: 5
        },
        f: 6
      });
    });

    it('should deep merge multiple levels', () => {
      const target = {
        a: {
          b: {
            c: 1,
            d: 2
          },
          e: 3
        }
      };
      const source = {
        a: {
          b: {
            c: 4,
            f: 5
          },
          g: 6
        }
      };
      const result = merge(target, source);

      expect(result).toEqual({
        a: {
          b: {
            c: 4,
            d: 2,
            f: 5
          },
          e: 3,
          g: 6
        }
      });
    });

    it('should replace non-object values', () => {
      const target = {
        a: {
          b: 1
        }
      };
      const source = {
        a: 2
      };
      const result = merge(target, source);

      expect(result).toEqual({ a: 2 });
    });
  });

  describe('array handling', () => {
    it('should replace arrays instead of merging', () => {
      const target = {
        a: [1, 2, 3],
        b: {
          c: [4, 5]
        }
      };
      const source = {
        a: [6, 7],
        b: {
          c: [8, 9, 10]
        }
      };
      const result = merge(target, source);

      expect(result).toEqual({
        a: [6, 7],
        b: {
          c: [8, 9, 10]
        }
      });
    });
  });

  describe('edge cases', () => {
    it('should handle non-object target', () => {
      const target = 'string';
      const source = { a: 1 };
      const result = merge(target as any, source);

      expect(result).toBe('string');
    });

    it('should handle non-object sources', () => {
      const target = { a: 1 };
      const source = 'string';
      const result = merge(target, source as any);

      expect(result).toEqual({ a: 1 });
    });

    it('should not mutate original target', () => {
      const target = { a: 1, b: { c: 2 } };
      const source = { b: { d: 3 } };
      const originalTarget = JSON.parse(JSON.stringify(target));
      
      merge(target, source);

      expect(target).toEqual(originalTarget);
    });

    it('should handle undefined values in source', () => {
      const target = { a: 1, b: 2 };
      const source = { a: undefined, c: 3 };
      const result = merge(target, source);

      expect(result).toEqual({ a: 1, b: 2, c: 3 });
    });
  });

  describe('complex scenarios', () => {
    it('should handle theme-like objects', () => {
      const defaultTheme = {
        colors: {
          primary: 'blue',
          secondary: 'gray'
        },
        spacing: {
          small: 8,
          medium: 16
        },
        typography: {
          fontFamily: 'Arial',
          fontSize: 14
        }
      };

      const customTheme = {
        colors: {
          primary: 'red',
          accent: 'yellow'
        },
        spacing: {
          large: 24
        }
      };

      const result = merge(defaultTheme, customTheme);

      expect(result).toEqual({
        colors: {
          primary: 'red',
          secondary: 'gray',
          accent: 'yellow'
        },
        spacing: {
          small: 8,
          medium: 16,
          large: 24
        },
        typography: {
          fontFamily: 'Arial',
          fontSize: 14
        }
      });
    });
  });
});

describe('mergeDeep', () => {
  it('should create a new object without mutating original', () => {
    const target = { a: 1, b: { c: 2 } };
    const source = { b: { d: 3 } };
    const originalTarget = JSON.parse(JSON.stringify(target));
    
    const result = mergeDeep(target, source);

    expect(result).toEqual({
      a: 1,
      b: {
        c: 2,
        d: 3
      }
    });

    // Original should not be mutated
    expect(target).toEqual(originalTarget);
  });

  it('should handle empty target', () => {
    const target = {};
    const source = { a: 1, b: { c: 2 } };
    const result = mergeDeep(target, source);

    expect(result).toEqual({ a: 1, b: { c: 2 } });
  });
});
