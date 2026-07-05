import type { Scene } from 'phaser';

/** A point in the scene's viewport. Spread-friendly for Phaser constructors. */
export type Point = { x: number; y: number };

/**
 * A rectangular area with pre-computed center coordinates — spread-friendly
 * for both bounding-box and centered-object positioning.
 */
export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
};

/**
 * Per-edge insets for `safeArea`. A single number applies uniformly to all
 * four edges; the object form lets you set different insets per edge
 * (mirroring CSS `padding` / `env(safe-area-inset-*)`).
 */
export type SafeAreaInsets =
  | number
  | {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    };

const DEFAULT_PADDING = 0;
const DEFAULT_SAFE_INSET = 16;

/**
 * Reads the current viewport size from the scene's main camera. Prefer this
 * over `scene.scale` — the camera reflects post-zoom/pan bounds used for HUD
 * positioning.
 */
const getViewport = (scene: Scene): { width: number; height: number } => {
  const cam = scene.cameras.main;
  return { width: cam.width, height: cam.height };
};

const resolveInsets = (
  inset: SafeAreaInsets
): { top: number; right: number; bottom: number; left: number } => {
  if (typeof inset === 'number') {
    return { top: inset, right: inset, bottom: inset, left: inset };
  }
  return {
    top: inset.top ?? 0,
    right: inset.right ?? 0,
    bottom: inset.bottom ?? 0,
    left: inset.left ?? 0,
  };
};

/**
 * Positioning helpers built on top of `scene.cameras.main`. Every helper
 * returns a spread-friendly `{ x, y }` (or `Rect`) so you can drop it
 * straight into Phaser constructors.
 *
 * @example
 * // Center a modal:
 * new Modal({ scene, ...Pos.center(scene) });
 *
 * @example
 * // Close button in the top-right, inset 16px from the corner:
 * new IconButton({ scene, ...Pos.topRight(scene, 16), icon: 'xmark' });
 *
 * @example
 * // Lay out a HUD within a safe area:
 * const safe = Pos.safeArea(scene, 24);
 * scoreLabel.setPosition(safe.x, safe.y);
 * pauseButton.setPosition(safe.x + safe.width, safe.y);
 */
export const Pos = {
  /** Center of the viewport. */
  center(scene: Scene): Point {
    const { width, height } = getViewport(scene);
    return { x: width / 2, y: height / 2 };
  },

  /** Horizontal center at the top edge, offset down by `padding`. */
  top(scene: Scene, padding: number = DEFAULT_PADDING): Point {
    const { width } = getViewport(scene);
    return { x: width / 2, y: padding };
  },

  /** Horizontal center at the bottom edge, offset up by `padding`. */
  bottom(scene: Scene, padding: number = DEFAULT_PADDING): Point {
    const { width, height } = getViewport(scene);
    return { x: width / 2, y: height - padding };
  },

  /** Vertical center at the left edge, offset right by `padding`. */
  left(scene: Scene, padding: number = DEFAULT_PADDING): Point {
    const { height } = getViewport(scene);
    return { x: padding, y: height / 2 };
  },

  /** Vertical center at the right edge, offset left by `padding`. */
  right(scene: Scene, padding: number = DEFAULT_PADDING): Point {
    const { width, height } = getViewport(scene);
    return { x: width - padding, y: height / 2 };
  },

  /** Top-left corner, inset by `padding` on both axes. */
  topLeft(_scene: Scene, padding: number = DEFAULT_PADDING): Point {
    return { x: padding, y: padding };
  },

  /** Top-right corner, inset by `padding` on both axes. */
  topRight(scene: Scene, padding: number = DEFAULT_PADDING): Point {
    const { width } = getViewport(scene);
    return { x: width - padding, y: padding };
  },

  /** Bottom-left corner, inset by `padding` on both axes. */
  bottomLeft(scene: Scene, padding: number = DEFAULT_PADDING): Point {
    const { height } = getViewport(scene);
    return { x: padding, y: height - padding };
  },

  /** Bottom-right corner, inset by `padding` on both axes. */
  bottomRight(scene: Scene, padding: number = DEFAULT_PADDING): Point {
    const { width, height } = getViewport(scene);
    return { x: width - padding, y: height - padding };
  },

  /**
   * Usable rectangle inset from every edge — approximates a mobile safe
   * area (notch, home indicator, rounded corners). Accepts a uniform inset
   * or per-edge overrides. Returns pre-computed `centerX`/`centerY` so a
   * modal can drop straight in without re-doing the math.
   */
  safeArea(
    scene: Scene,
    inset: SafeAreaInsets = DEFAULT_SAFE_INSET
  ): Rect {
    const { width, height } = getViewport(scene);
    const { top, right, bottom, left } = resolveInsets(inset);
    const w = width - left - right;
    const h = height - top - bottom;
    return {
      x: left,
      y: top,
      width: w,
      height: h,
      centerX: left + w / 2,
      centerY: top + h / 2,
    };
  },
} as const;

export type PosApi = typeof Pos;
