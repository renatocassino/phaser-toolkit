import type { BaseThemeConfig } from '../theme';

/**
 * Valid easing tokens. Each maps to a Phaser ease name string, ready to be
 * passed as `ease` to `tweens.add({...})`.
 *
 * - The four base tokens (`linear`, `in`, `out`, `in-out`) mirror Tailwind's
 *   `ease-*` utilities and map to Phaser's `Cubic` family — the closest
 *   equivalent to Tailwind's default `cubic-bezier` curves.
 * - The character curves (`back-*`, `sine-*`, `expo-*`, `bounce-*`,
 *   `elastic-*`) are the game-flavored motion curves you actually want in
 *   an interactive HUD.
 */
export type EaseKey =
  // Tailwind-style base curves (backed by Cubic).
  | 'linear'
  | 'in'
  | 'out'
  | 'in-out'
  // Sine — soft, gentle motion (great for continuous background tweens).
  | 'sine-in'
  | 'sine-out'
  | 'sine-in-out'
  // Back — pop with a subtle overshoot (best for button/UI pops).
  | 'back-in'
  | 'back-out'
  | 'back-in-out'
  // Expo — dramatic acceleration / deceleration.
  | 'expo-in'
  | 'expo-out'
  | 'expo-in-out'
  // Bounce — physical bounce at the end / start.
  | 'bounce-in'
  | 'bounce-out'
  | 'bounce-in-out'
  // Elastic — springy overshoot with oscillation.
  | 'elastic-in'
  | 'elastic-out'
  | 'elastic-in-out';

/** Maps ease scale keys to their Phaser ease-name string values. */
export type EaseMap = Record<EaseKey | string, string>;

/**
 * Ease scale mapping. Each value is the Phaser ease name string (dotted
 * form, like `'Back.easeOut'`), which is what `tweens.add({ ease })` expects.
 */
export const easeMap: EaseMap = {
  linear: 'Linear',
  in: 'Cubic.easeIn',
  out: 'Cubic.easeOut',
  'in-out': 'Cubic.easeInOut',

  'sine-in': 'Sine.easeIn',
  'sine-out': 'Sine.easeOut',
  'sine-in-out': 'Sine.easeInOut',

  'back-in': 'Back.easeIn',
  'back-out': 'Back.easeOut',
  'back-in-out': 'Back.easeInOut',

  'expo-in': 'Expo.easeIn',
  'expo-out': 'Expo.easeOut',
  'expo-in-out': 'Expo.easeInOut',

  'bounce-in': 'Bounce.easeIn',
  'bounce-out': 'Bounce.easeOut',
  'bounce-in-out': 'Bounce.easeInOut',

  'elastic-in': 'Elastic.easeIn',
  'elastic-out': 'Elastic.easeOut',
  'elastic-in-out': 'Elastic.easeInOut',
};

/**
 * API for resolving easing tokens.
 * Accepted keys are narrowed to default tokens plus theme keys.
 */
export type EaseApi<T extends EaseMap | undefined> = {
  /**
   * Resolves the token to the Phaser ease-name string, ready for
   * `tweens.add({ ease })`.
   */
  value: (key: EaseKey | (T extends EaseMap ? keyof T : never)) => string;
};

/**
 * Create an ease API bound to an optional theme ease map.
 *
 * @example
 * const e = createEase({ pop: 'Back.easeOut', drift: 'Sine.easeInOut' });
 * e.value('pop');       // 'Back.easeOut'
 * e.value('back-out');  // 'Back.easeOut'
 * e.value('linear');    // 'Linear'
 *
 * @example
 * scene.tweens.add({
 *   targets: obj,
 *   x: 100,
 *   duration: Duration.ms('300'),
 *   ease: Ease.value('back-out'),
 * });
 */
export const createEase = <
  T extends EaseMap | undefined = BaseThemeConfig['ease'],
>(
  themeEase?: T
): EaseApi<T> => {
  const map: EaseMap = {
    ...easeMap,
    ...(themeEase as EaseMap | undefined),
  } as EaseMap;

  return {
    value: (key: EaseKey | (T extends EaseMap ? keyof T : never)): string => {
      const value = map[key as string];
      // Fall back to Linear if the token isn't found — safer than throwing
      // (tween runs with linear motion) and matches how other tokens degrade.
      return typeof value === 'string' && value.length > 0 ? value : 'Linear';
    },
  };
};

/** Convenience instance using default ease map (no theme). */
export const Ease: EaseApi<undefined> = createEase<undefined>(undefined);
