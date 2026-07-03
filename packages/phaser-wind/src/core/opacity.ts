import type { BaseThemeConfig } from '../theme';

/**
 * Valid opacity scale keys following Tailwind's opacity scale.
 * Values map to alpha in the 0..1 range (Phaser's `setAlpha` range).
 */
export type OpacityKey =
  | '0'
  | '5'
  | '10'
  | '15'
  | '20'
  | '25'
  | '30'
  | '35'
  | '40'
  | '45'
  | '50'
  | '55'
  | '60'
  | '65'
  | '70'
  | '75'
  | '80'
  | '85'
  | '90'
  | '95'
  | '100';

/** Maps opacity scale keys to their 0..1 alpha values. */
export type OpacityMap = Record<OpacityKey | string, number>;

/**
 * Opacity scale mapping following Tailwind's opacity scale.
 * Values are in the 0..1 range, ready for Phaser's `setAlpha()`.
 */
export const opacityMap: OpacityMap = {
  '0': 0,
  '5': 0.05,
  '10': 0.1,
  '15': 0.15,
  '20': 0.2,
  '25': 0.25,
  '30': 0.3,
  '35': 0.35,
  '40': 0.4,
  '45': 0.45,
  '50': 0.5,
  '55': 0.55,
  '60': 0.6,
  '65': 0.65,
  '70': 0.7,
  '75': 0.75,
  '80': 0.8,
  '85': 0.85,
  '90': 0.9,
  '95': 0.95,
  '100': 1,
};

/**
 * API for resolving opacity tokens.
 * Accepted keys are narrowed to default tokens plus theme keys.
 */
export type OpacityApi<T extends OpacityMap | undefined> = {
  /** Alpha value in 0..1 range, ready for Phaser's `setAlpha()`. */
  value: (key: OpacityKey | (T extends OpacityMap ? keyof T : never)) => number;
  /** Percentage as a number (0..100). */
  percent: (
    key: OpacityKey | (T extends OpacityMap ? keyof T : never)
  ) => number;
  /** CSS opacity string like `'50%'`. */
  css: (key: OpacityKey | (T extends OpacityMap ? keyof T : never)) => string;
};

/**
 * Create an opacity API bound to an optional theme opacity map.
 * @example
 * const o = createOpacity({ faded: 0.35 });
 * o.value('faded'); // 0.35
 * o.value('50');    // 0.5
 */
export const createOpacity = <
  T extends OpacityMap | undefined = BaseThemeConfig['opacity'],
>(
  themeOpacity?: T
): OpacityApi<T> => {
  const map: OpacityMap = {
    ...opacityMap,
    ...(themeOpacity as OpacityMap | undefined),
  } as OpacityMap;

  const get = (key: string): number => {
    return typeof map[key] === 'number' ? (map[key] as number) : 0;
  };

  return {
    value: (
      key: OpacityKey | (T extends OpacityMap ? keyof T : never)
    ): number => {
      return get(key as string);
    },
    percent: (
      key: OpacityKey | (T extends OpacityMap ? keyof T : never)
    ): number => {
      const ONE_HUNDRED = 100;
      return get(key as string) * ONE_HUNDRED;
    },
    css: (
      key: OpacityKey | (T extends OpacityMap ? keyof T : never)
    ): string => {
      const ONE_HUNDRED = 100;
      return `${get(key as string) * ONE_HUNDRED}%`;
    },
  };
};

/** Convenience instance using default opacity map (no theme). */
export const Opacity: OpacityApi<undefined> =
  createOpacity<undefined>(undefined);
