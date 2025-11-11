/* eslint-disable complexity */
/* eslint-disable sonarjs/cognitive-complexity */
import { GameObjects } from 'phaser';

/** Default gap between elements in pixels */
export const DEFAULT_GAP = 8;

/** Measures the display width of a game object, with fallbacks */
export const getDisplayWidthOf = (child: GameObjects.GameObject): number => {
  const childTyped = child as unknown as {
    displayWidth?: number;
    width?: number;
    getBounds?: () => { width: number };
  };
  // Check if it's a Container-like object (has list property and width/height)
  if (child && typeof child === 'object' && 'list' in child && Array.isArray((child as unknown as { list: unknown[] }).list)) {
    if (typeof childTyped.displayWidth === 'number' && childTyped.displayWidth > 0) {
      return childTyped.displayWidth;
    }

    if (typeof childTyped.width === 'number' && childTyped.width > 0) {
      return childTyped.width;
    }

    const container = child as unknown as { list: unknown[]; width?: number; displayWidth?: number, scale?: number };
    if (typeof container.displayWidth === 'number' && container.displayWidth > 0) {
      return container.displayWidth;
    }

    if (typeof container.width === 'number' && container.width > 0) {
      if (typeof container.scale === 'number' && container.scale > 0) {
        return container.width / container.scale;
      }
      return container.width;
    }
    let w = 0;
    for (const sub of container.list) {
      const size = getDisplayWidthOf(sub as GameObjects.GameObject);
      w = Math.max(w, size);
    }
    return w;
  }
  if (typeof childTyped.displayWidth === 'number') {
    return childTyped.displayWidth;
  }
  if (typeof childTyped.width === 'number') {
    return childTyped.width as number;
  }
  const bounds = childTyped.getBounds?.();
  return bounds ? bounds.width : 0;
};

/** Measures the display height of a game object, with fallbacks */
export const getDisplayHeightOf = (child: GameObjects.GameObject): number => {
  const childTyped = child as unknown as {
    displayHeight?: number;
    height?: number;
    getBounds?: () => { height: number };
  };
  // Check if it's a Container-like object (has list property and width/height)
  if (child && typeof child === 'object' && 'list' in child && Array.isArray((child as unknown as { list: unknown[] }).list)) {
    if (typeof childTyped.displayHeight === 'number' && childTyped.displayHeight > 0) {
      return childTyped.displayHeight;
    }

    if (typeof childTyped.height === 'number' && childTyped.height > 0) {
      return childTyped.height;
    }

    const container = child as unknown as { list: unknown[]; height?: number; displayHeight?: number, scale?: number };
    if (typeof container.displayHeight === 'number' && container.displayHeight > 0) {
      return container.displayHeight;
    }

    if (typeof container.height === 'number' && container.height > 0) {
      if (typeof container.scale === 'number' && container.scale > 0) {
        return container.height / container.scale;
      }
      return container.height;
    }
    let h = 0;
    for (const sub of container.list) {
      const size = getDisplayHeightOf(sub as GameObjects.GameObject);
      h = Math.max(h, size);
    }
    return h;
  }
  if (typeof childTyped.displayHeight === 'number') {
    return childTyped.displayHeight;
  }
  if (typeof childTyped.height === 'number') {
    return childTyped.height as number;
  }
  const bounds = childTyped.getBounds?.();
  return bounds ? bounds.height : 0;
};

/** Returns normalized origin (0..1) for a game object */
export const getNormalizedOriginOf = (
  child: GameObjects.GameObject
): { x: number; y: number } => {
  const width = getDisplayWidthOf(child);
  const height = getDisplayHeightOf(child);

  const childTyped = child as unknown as {
    originX?: number;
    originY?: number;
    displayOriginX?: number;
    displayOriginY?: number;
  };

  let ox: number | undefined =
    typeof childTyped.originX === 'number' ? childTyped.originX : undefined;
  let oy: number | undefined =
    typeof childTyped.originY === 'number' ? childTyped.originY : undefined;

  if (
    ox === undefined &&
    typeof childTyped.displayOriginX === 'number' &&
    width > 0
  ) {
    ox = childTyped.displayOriginX / width;
  }
  if (
    oy === undefined &&
    typeof childTyped.displayOriginY === 'number' &&
    height > 0
  ) {
    oy = childTyped.displayOriginY / height;
  }

  return { x: ox ?? 0.5, y: oy ?? 0.5 };
};
