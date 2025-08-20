/* eslint-disable max-lines-per-function */
/* eslint-disable no-magic-numbers */
import type { GameObjects } from 'phaser';
import { describe, expect, it } from 'vitest';

import {
  DEFAULT_GAP,
  getDisplayHeightOf,
  getDisplayWidthOf,
  getNormalizedOriginOf,
} from './layout-utils';

// Helper to satisfy typing without importing Phaser types in tests
const asGO = (o: unknown): GameObjects.GameObject => o as GameObjects.GameObject;

describe('layout-utils', () => {
  it('DEFAULT_GAP should be 8', () => {
    expect(DEFAULT_GAP).toBe(8);
  });

  describe('getDisplayWidthOf', () => {
    it('prefers displayWidth when present', () => {
      const obj = asGO({ displayWidth: 120, width: 200, getBounds: () => ({ width: 300 }) });
      expect(getDisplayWidthOf(obj)).toBe(120);
    });

    it('falls back to width when displayWidth is absent', () => {
      const obj = asGO({ width: 200, getBounds: () => ({ width: 300 }) });
      expect(getDisplayWidthOf(obj)).toBe(200);
    });

    it('falls back to getBounds().width when both displayWidth and width are absent', () => {
      const obj = asGO({ getBounds: () => ({ width: 300 }) });
      expect(getDisplayWidthOf(obj)).toBe(300);
    });

    it('returns 0 when nothing is available', () => {
      const obj = asGO({});
      expect(getDisplayWidthOf(obj)).toBe(0);
    });
  });

  describe('getDisplayHeightOf', () => {
    it('prefers displayHeight when present', () => {
      const obj = asGO({ displayHeight: 110, height: 210, getBounds: () => ({ height: 310 }) });
      expect(getDisplayHeightOf(obj)).toBe(110);
    });

    it('falls back to height when displayHeight is absent', () => {
      const obj = asGO({ height: 210, getBounds: () => ({ height: 310 }) });
      expect(getDisplayHeightOf(obj)).toBe(210);
    });

    it('falls back to getBounds().height when both displayHeight and height are absent', () => {
      const obj = asGO({ getBounds: () => ({ height: 310 }) });
      expect(getDisplayHeightOf(obj)).toBe(310);
    });

    it('returns 0 when nothing is available', () => {
      const obj = asGO({});
      expect(getDisplayHeightOf(obj)).toBe(0);
    });
  });

  describe('getNormalizedOriginOf', () => {
    it('returns originX/Y when provided', () => {
      const obj = asGO({ originX: 0.2, originY: 0.8, displayWidth: 100, displayHeight: 100 });
      expect(getNormalizedOriginOf(obj)).toEqual({ x: 0.2, y: 0.8 });
    });

    it('computes from displayOriginX/Y over displayWidth/Height when originX/Y absent', () => {
      const obj = asGO({ displayOriginX: 25, displayOriginY: 50, displayWidth: 100, displayHeight: 200 });
      // x = 25/100 = 0.25, y = 50/200 = 0.25
      expect(getNormalizedOriginOf(obj)).toEqual({ x: 0.25, y: 0.25 });
    });

    it('defaults to 0.5 when origins are missing and size is zero', () => {
      const obj = asGO({ displayOriginX: 10, displayOriginY: 10, displayWidth: 0, displayHeight: 0 });
      expect(getNormalizedOriginOf(obj)).toEqual({ x: 0.5, y: 0.5 });
    });

    it('uses mixed fallbacks per axis independently', () => {
      const obj = asGO({
        originX: 0.1, // should take precedence on X
        displayOriginY: 30,
        displayHeight: 120, // Y should be 30/120 = 0.25
        displayWidth: 400,
      });
      expect(getNormalizedOriginOf(obj)).toEqual({ x: 0.1, y: 0.25 });
    });
  });
});
