/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines-per-function */
import type { Scene } from 'phaser';
import { describe, expect, it } from 'vitest';

import { Pos } from './pos';

const makeScene = (width: number, height: number): Scene =>
  ({
    cameras: { main: { width, height } },
  }) as unknown as Scene;

describe('Pos', () => {
  describe('center', () => {
    it('returns the midpoint of the viewport', () => {
      expect(Pos.center(makeScene(800, 600))).toEqual({ x: 400, y: 300 });
    });
  });

  describe('edge helpers', () => {
    const scene = makeScene(800, 600);

    it('top: horizontal center, y = padding', () => {
      expect(Pos.top(scene)).toEqual({ x: 400, y: 0 });
      expect(Pos.top(scene, 20)).toEqual({ x: 400, y: 20 });
    });

    it('bottom: horizontal center, y = height - padding', () => {
      expect(Pos.bottom(scene, 20)).toEqual({ x: 400, y: 580 });
    });

    it('left: x = padding, vertical center', () => {
      expect(Pos.left(scene, 20)).toEqual({ x: 20, y: 300 });
    });

    it('right: x = width - padding, vertical center', () => {
      expect(Pos.right(scene, 20)).toEqual({ x: 780, y: 300 });
    });
  });

  describe('corner helpers', () => {
    const scene = makeScene(800, 600);

    it('topLeft insets both axes by padding', () => {
      expect(Pos.topLeft(scene, 16)).toEqual({ x: 16, y: 16 });
    });

    it('topRight anchors to the right edge', () => {
      expect(Pos.topRight(scene, 16)).toEqual({ x: 784, y: 16 });
    });

    it('bottomLeft anchors to the bottom edge', () => {
      expect(Pos.bottomLeft(scene, 16)).toEqual({ x: 16, y: 584 });
    });

    it('bottomRight anchors to the bottom-right corner', () => {
      expect(Pos.bottomRight(scene, 16)).toEqual({ x: 784, y: 584 });
    });

    it('defaults padding to 0', () => {
      expect(Pos.topRight(scene)).toEqual({ x: 800, y: 0 });
    });
  });

  describe('safeArea', () => {
    const scene = makeScene(800, 600);

    it('applies uniform inset by default (16px)', () => {
      expect(Pos.safeArea(scene)).toEqual({
        x: 16,
        y: 16,
        width: 768,
        height: 568,
        centerX: 400,
        centerY: 300,
      });
    });

    it('accepts a numeric inset for uniform padding', () => {
      expect(Pos.safeArea(scene, 32)).toEqual({
        x: 32,
        y: 32,
        width: 736,
        height: 536,
        centerX: 400,
        centerY: 300,
      });
    });

    it('accepts per-edge insets', () => {
      const safe = Pos.safeArea(scene, { top: 40, bottom: 20, left: 10, right: 10 });
      expect(safe).toEqual({
        x: 10,
        y: 40,
        width: 780,
        height: 540,
        centerX: 400,
        centerY: 310,
      });
    });

    it('treats missing edges as 0', () => {
      const safe = Pos.safeArea(scene, { top: 40 });
      expect(safe).toEqual({
        x: 0,
        y: 40,
        width: 800,
        height: 560,
        centerX: 400,
        centerY: 320,
      });
    });
  });
});
