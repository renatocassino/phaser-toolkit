import type { BaseThemeConfig } from '../theme';

/**
 * Valid duration scale keys following Tailwind's `transition-duration` scale.
 * Values are milliseconds — ready for Phaser's `tweens.add({ duration })`.
 */
export type DurationKey =
  | '0'
  | '75'
  | '100'
  | '150'
  | '200'
  | '300'
  | '500'
  | '700'
  | '1000';

/** Maps duration scale keys to milliseconds. */
export type DurationMap = Record<DurationKey | string, number>;

/**
 * Duration scale mapping following Tailwind's `duration-*` utilities.
 * All values in milliseconds — the unit Phaser's tween API expects.
 */
export const durationMap: DurationMap = {
  '0': 0,
  '75': 75,
  '100': 100,
  '150': 150,
  '200': 200,
  '300': 300,
  '500': 500,
  '700': 700,
  '1000': 1000,
};

/**
 * API for resolving duration tokens.
 * Accepted keys are narrowed to default tokens plus theme keys.
 */
export type DurationApi<T extends DurationMap | undefined> = {
  /** Duration in milliseconds, ready for `tweens.add({ duration })`. */
  ms: (key: DurationKey | (T extends DurationMap ? keyof T : never)) => number;
  /** Duration in seconds. */
  seconds: (
    key: DurationKey | (T extends DurationMap ? keyof T : never)
  ) => number;
  /** CSS duration string like `'300ms'`. */
  css: (key: DurationKey | (T extends DurationMap ? keyof T : never)) => string;
};

/**
 * Create a duration API bound to an optional theme duration map.
 *
 * @example
 * const d = createDuration({ hover: 120, slide: 240 });
 * d.ms('hover');   // 120
 * d.ms('300');     // 300
 * d.css('500');    // '500ms'
 */
export const createDuration = <
  T extends DurationMap | undefined = BaseThemeConfig['duration'],
>(
  themeDuration?: T
): DurationApi<T> => {
  const map: DurationMap = {
    ...durationMap,
    ...(themeDuration as DurationMap | undefined),
  } as DurationMap;

  const get = (key: string): number =>
    typeof map[key] === 'number' ? (map[key] as number) : 0;

  return {
    ms: (
      key: DurationKey | (T extends DurationMap ? keyof T : never)
    ): number => get(key as string),
    seconds: (
      key: DurationKey | (T extends DurationMap ? keyof T : never)
    ): number => {
      const MS_PER_SECOND = 1000;
      return get(key as string) / MS_PER_SECOND;
    },
    css: (
      key: DurationKey | (T extends DurationMap ? keyof T : never)
    ): string => `${get(key as string)}ms`,
  };
};

/** Convenience instance using default duration map (no theme). */
export const Duration: DurationApi<undefined> =
  createDuration<undefined>(undefined);
