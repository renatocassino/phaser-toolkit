import type { BaseThemeConfig } from '../theme';

/**
 * Named z-layer tokens for `setDepth()`. In games these layers matter more
 * than on the web — HUD, dimming overlays, modals, and tooltips need to sit
 * on stable, semantic layers instead of ad-hoc magic numbers.
 *
 * - `base` — the game world (background, actors, particles).
 * - `content` — HUD elements on top of the world (score, buttons, bars).
 * - `overlay` — full-screen dimming or masking (pause dim, cutscene fade).
 * - `modal` — dialogs sitting above the overlay (settings, level complete).
 * - `tooltip` — pinpoint labels that must sit above everything else.
 *
 * Values are spaced with room to insert custom layers in between
 * (e.g. `toast` between modal and tooltip).
 */
export type DepthKey = 'base' | 'content' | 'overlay' | 'modal' | 'tooltip';

/** Maps depth scale keys to their numeric depth values. */
export type DepthMap = Record<DepthKey | string, number>;

/**
 * Depth scale mapping. Values chosen with gaps so consumers can slot
 * custom depths between the semantic layers (e.g. `toast: 2500`).
 */
export const depthMap: DepthMap = {
  base: 0,
  content: 100,
  overlay: 1000,
  modal: 2000,
  tooltip: 3000,
};

/**
 * API for resolving depth tokens.
 * Accepted keys are narrowed to default tokens plus theme keys.
 */
export type DepthApi<T extends DepthMap | undefined> = {
  /**
   * Resolves the token to a numeric depth, ready for
   * `gameObject.setDepth(...)`.
   */
  value: (key: DepthKey | (T extends DepthMap ? keyof T : never)) => number;
};

/**
 * Create a depth API bound to an optional theme depth map.
 *
 * @example
 * const d = createDepth({ toast: 2500 });
 * d.value('modal');   // 2000
 * d.value('toast');   // 2500
 *
 * @example
 * sprite.setDepth(Depth.value('modal'));
 */
export const createDepth = <
  T extends DepthMap | undefined = BaseThemeConfig['depth'],
>(
  themeDepth?: T
): DepthApi<T> => {
  const map: DepthMap = {
    ...depthMap,
    ...(themeDepth as DepthMap | undefined),
  } as DepthMap;

  return {
    value: (key: DepthKey | (T extends DepthMap ? keyof T : never)): number => {
      const value = map[key as string];
      return typeof value === 'number' ? value : 0;
    },
  };
};

/** Convenience instance using default depth map (no theme). */
export const Depth: DepthApi<undefined> = createDepth<undefined>(undefined);
