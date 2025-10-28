/* eslint-disable max-lines */
/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines-per-function */
import { describe, expect, it } from 'vitest';

import { merge } from '../merge';

describe('merge', () => {
  describe('basic functionality', () => {
    it('should merge simple objects', () => {
      const target = { a: 1, b: 2 };
      const source = { b: 3, c: 4 };
      const result = merge(target, source);

      expect(result).toEqual({ a: 1, b: 3, c: 4 });
      expect(result).not.toBe(target);
      expect(result).not.toBe(source);
    });

    it('should merge multiple sources', () => {
      const target = { a: 1, b: 2 };
      const source1 = { b: 3, c: 4 };
      const source2 = { c: 5, d: 6 };
      const result = merge(target, source1, source2);

      expect(result).toEqual({ a: 1, b: 3, c: 5, d: 6 });
      expect(result).not.toBe(target);
      expect(result).not.toBe(source1);
      expect(result).not.toBe(source2);
    });

    it('should handle empty objects', () => {
      const target = {};
      const source = { a: 1, b: 2 };
      const result = merge(target, source);

      expect(result).toEqual({ a: 1, b: 2 });
      expect(result).not.toBe(target);
      expect(result).not.toBe(source);
    });

    it('should handle null and undefined sources', () => {
      const target = { a: 1 };
      const result = merge(target, null as unknown as Record<string, unknown>, undefined as unknown as Record<string, unknown>);

      expect(result).toEqual({ a: 1 });
      expect(result).not.toBe(target);
    });
  });

  describe('deep merging and immutability', () => {
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

      // Check immutability
      expect(result).not.toBe(target);
      expect(result).not.toBe(source);
      expect(result.b).not.toBe(target.b);
      expect(result.b).not.toBe(source.b);
    });

    it('should create new references for all nested objects', () => {
      const target = {
        life: 100,
        nested: {
          value: 10
        }
      };
      const source = { life: 90 };
      const result = merge(target, source);

      expect(result).toEqual({
        life: 90,
        nested: {
          value: 10
        }
      });

      // Critical test: nested objects should have new references
      expect(result).not.toBe(target);
      expect(result.nested).not.toBe(target.nested);
      expect(result.nested).toEqual(target.nested);
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

      // Check immutability at all levels
      expect(result).not.toBe(target);
      expect(result.a).not.toBe(target.a);
      expect(result.a.b).not.toBe(target.a.b);
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
      expect(result).not.toBe(target);
      expect(result).not.toBe(source);
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

      // Arrays should be new references
      expect(result.a).not.toBe(target.a);
      expect(result.b.c).not.toBe(target.b.c);
    });

    it('should create new array references', () => {
      const target = {
        items: [1, 2, 3]
      };
      const source = {
        items: [4, 5, 6]
      };
      const result = merge(target, source);

      expect(result.items).toEqual([4, 5, 6]);
      expect(result.items).not.toBe(target.items);
      expect(result.items).not.toBe(source.items);
    });
  });

  describe('edge cases', () => {
    it('should handle non-object target', () => {
      const target = 'string';
      const source = { a: 1 };
      const result = merge(target as unknown as Record<string, unknown>, source);

      expect(result).toBe('string');
    });

    it('should handle non-object sources', () => {
      const target = { a: 1 };
      const source = 'string';
      const result = merge(target, source as unknown as Record<string, unknown>);

      expect(result).toEqual({ a: 1 });
      expect(result).not.toBe(target);
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
      expect(result).not.toBe(target);
    });

    it('should handle null values', () => {
      const target = { a: 1, b: 2 };
      const source = { a: null, c: 3 };
      const result = merge(target, source);

      expect(result).toEqual({ a: null, b: 2, c: 3 });
      expect(result).not.toBe(target);
    });

    it('should handle empty source objects', () => {
      const target = { a: 1, b: 2 };
      const source = {};
      const result = merge(target, source);

      expect(result).toEqual({ a: 1, b: 2 });
      expect(result).not.toBe(target);
    });
  });

  describe('type safety', () => {
    it('should maintain type safety with typed objects', () => {
      const user = {
        id: 1,
        name: 'John',
        profile: {
          age: 30,
          email: 'john@example.com'
        }
      };

      const updates = {
        name: 'Jane',
        profile: {
          age: 31
        }
      };

      const result = merge(user, updates);

      expect(result).toEqual({
        id: 1,
        name: 'Jane',
        profile: {
          age: 31,
          email: 'john@example.com'
        }
      });

      // Type should be preserved
      expect(typeof result['id']).toBe('number');
      expect(typeof result['name']).toBe('string');
      expect(typeof (result['profile'] as Record<string, unknown>)['age']).toBe('number');
      expect(typeof (result['profile'] as Record<string, unknown>)['email']).toBe('string');
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

      // All nested objects should be new references
      expect(result).not.toBe(defaultTheme);
      expect(result.colors).not.toBe(defaultTheme.colors);
      expect(result.spacing).not.toBe(defaultTheme.spacing);
      expect(result.typography).not.toBe(defaultTheme.typography);
    });

    it('should handle deeply nested objects with mixed types', () => {
      const target = {
        config: {
          database: {
            host: 'localhost',
            port: 5432,
            credentials: {
              username: 'admin',
              password: 'secret'
            }
          },
          features: ['auth', 'logging'],
          debug: true
        },
        metadata: {
          version: '1.0.0',
          author: 'Developer'
        }
      };

      const source = {
        config: {
          database: {
            port: 3306,
            credentials: {
              username: 'root'
            }
          },
          features: ['auth', 'logging', 'monitoring'],
          production: false
        }
      };

      const result = merge(target, source);

      expect(result).toEqual({
        config: {
          database: {
            host: 'localhost',
            port: 3306,
            credentials: {
              username: 'root',
              password: 'secret'
            }
          },
          features: ['auth', 'logging', 'monitoring'],
          debug: true,
          production: false
        },
        metadata: {
          version: '1.0.0',
          author: 'Developer'
        }
      });

      // Verify immutability
      expect(result).not.toBe(target);
      expect(result['config']).not.toBe(target['config']);
      expect((result['config'] as Record<string, unknown>)['database']).not.toBe((target['config'] as Record<string, unknown>)['database']);
      expect(result['metadata']).not.toBe(target['metadata']);
    });
  });

  describe('performance and memory', () => {
    it('should not create unnecessary references for primitive values', () => {
      const target = { a: 1, b: 'string', c: true };
      const source = { a: 2 };
      const result = merge(target, source);

      expect(result).toEqual({ a: 2, b: 'string', c: true });
      expect(result).not.toBe(target);
    });

    it('should handle large objects efficiently', () => {
      const target: Record<string, unknown> = {};
      const source: Record<string, unknown> = {};

      // Create large objects
      for (let i = 0; i < 1000; i++) {
        target[`key${i}`] = { value: i, nested: { deep: i * 2 } };
        source[`key${i}`] = { value: i + 1000, nested: { deep: (i + 1000) * 2 } };
      }

      const result = merge(target, source);

      expect(Object.keys(result)).toHaveLength(1000);
      expect(result['key0']).toEqual({ value: 1000, nested: { deep: 2000 } });
      expect(result['key999']).toEqual({ value: 1999, nested: { deep: 3998 } });

      // Verify immutability
      expect(result).not.toBe(target);
      expect(result['key0']).not.toBe(target['key0']);
      expect((result['key0'] as Record<string, unknown>)['nested']).not.toBe((target['key0'] as Record<string, unknown>)['nested']);
    });
  });
});