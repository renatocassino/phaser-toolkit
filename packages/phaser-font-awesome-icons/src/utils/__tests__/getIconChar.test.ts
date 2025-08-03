import { describe, expect, it } from 'vitest';
import { IconKey } from '../../constants/icons';
import { getIconChar } from '../getIconChar';

describe('getIconChar', () => {
    // Forma 2: Array de objetos (mais legível)
    it.each([
        { iconName: 'baseball', expected: '\uf433' },
        { iconName: 'arrows-rotate', expected: '\uf021' },
        { iconName: 'arrows-spin', expected: '\ue4bb' },
        { iconName: 'at', expected: '\u0040' },
        { iconName: 'award', expected: '\uf559' },
        { iconName: 'backward', expected: '\uf04a' },
        { iconName: 'ban', expected: '\uf05e' },
        { iconName: 'barcode', expected: '\uf02a' },
        { iconName: 'bars', expected: '\uf0c9' },
        { iconName: 'bed', expected: '\uf236' },
        { iconName: 'bicycle', expected: '\uf206' },
    ])('should return $expected for icon $iconName', ({ iconName, expected }: { iconName: string, expected: string }) => {
        const result = getIconChar(iconName as IconKey);
        expect(result).toBe(expected);
    });

    it.each([
        'non-existent-icon',
        'invalid-icon',
        'missing-icon'
    ])('should throw error for invalid icon "%s"', (invalidIcon) => {
        expect(() => getIconChar(invalidIcon as IconKey)).toThrow();
    });
});
