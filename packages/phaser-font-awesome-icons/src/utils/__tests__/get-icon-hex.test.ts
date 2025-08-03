import { describe, expect, it } from 'vitest';

import { type IconKey } from '../../constants/icons';
import { getIconHex } from '../get-icon-hex';

describe('getIconHex', () => {
  it.each([
    { iconName: 'baseball', expected: 'f433' },
    { iconName: 'x', expected: '58' },
    { iconName: 'arrow-left', expected: 'f060' },
  ])(
    'should return $expected for icon $iconName',
    ({ iconName, expected }: { iconName: string; expected: string }) => {
      const result = getIconHex(iconName as IconKey);
      expect(result).toBe(expected);
    }
  );

  it.each(['non-existent-icon', 'invalid-icon', 'missing-icon'])(
    'should throw error for invalid icon "%s"',
    invalidIcon => {
      expect(() => getIconHex(invalidIcon as IconKey)).toThrow();
    }
  );

  describe.each(['empty-string', 'null-value', 'undefined-value'])(
    'error cases for %s',
    testCase => {
      it('should handle invalid input', () => {
        let input: IconKey | null | undefined | string;
        switch (testCase) {
          case 'empty-string':
            input = '';
            break;
          case 'null-value':
            input = null;
            break;
          case 'undefined-value':
            input = undefined;
            break;
        }
        expect(() => getIconHex(input as IconKey)).toThrow();
      });
    }
  );
});
