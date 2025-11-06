/* eslint-disable max-lines-per-function */
/* eslint-disable no-magic-numbers */
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { buildSceneMock } from "../test/scene-mock";

import { withUndoableState } from "./with-undoable-state";

type FakeState = {
  life: number;
}

describe('withUndoableState', () => {
  const baseState: FakeState = {
    life: 100,
  }

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('validation', () => {
    it('should throw an error if the scene is not provided', () => {
      // @ts-expect-error - we want to test the error case
      expect(() => withUndoableState<FakeState>(null, 'test-state', baseState, 10)).toThrow('[withLocalState] Scene parameter is required');
    });

    it('should throw an error if the data manager is not provided', () => {
      const scene = buildSceneMock();
      // @ts-expect-error - we want to test the error case
      scene.data = null;
      expect(() => withUndoableState<FakeState>(scene, 'test-state', baseState, 10)).toThrow('[withStateDef] Scene data is not available. Ensure the scene is properly initialized.');
    });
  });

  it('should be defined', () => {
    expect(withUndoableState).toBeDefined();
  });

  describe('initial state definition', () => {
    it('should set initial state value if not provided in first call', () => {
      const scene = buildSceneMock();
      const key = `test-state-${Date.now()}`;
      const initialState = { ...baseState, life: 90 }

      const setSpy = vi.spyOn(scene.data, 'set');

      withUndoableState<FakeState>(scene, key, initialState, 10);

      // withUndoableState uses scene.data for current state, history, and historyIndex
      expect(setSpy).toHaveBeenCalledWith(`phaser-hooks:local:${key}`, initialState);
      expect(setSpy).toHaveBeenCalledWith(`phaser-hooks:local:${key}:history`, [initialState]);
      expect(setSpy).toHaveBeenCalledWith(`phaser-hooks:local:${key}:historyIndex`, 0);

      setSpy.mockRestore();
    });

    it('should not set state in second call', () => {
      const scene = buildSceneMock();
      const key = `test-state-${Date.now()}`;
      const initialState = { ...baseState, life: 75 }

      const setSpy = vi.spyOn(scene.data, 'set');

      withUndoableState<FakeState>(scene, key, initialState, 10);

      expect(setSpy).toHaveBeenCalledWith(`phaser-hooks:local:${key}`, initialState);
      expect(setSpy).toHaveBeenCalledWith(`phaser-hooks:local:${key}:history`, [initialState]);
      expect(setSpy).toHaveBeenCalledWith(`phaser-hooks:local:${key}:historyIndex`, 0);

      // second call should not set state
      const hook = withUndoableState<FakeState>(scene, key, { ...baseState, life: 100 }, 10);

      expect(setSpy).toHaveBeenCalledTimes(3); // Only the initial 3 calls
      expect(hook.get()).toEqual(initialState);

      setSpy.mockRestore();
    });
  });

  describe('get/set', () => {
    it('should return the initial state', () => {
      const scene = buildSceneMock();
      const key = `test-state-${Date.now()}`;
      const initialState = { ...baseState, life: 100 }
      const hook = withUndoableState<FakeState>(scene, key, initialState, 10);
      expect(hook.get()).toEqual(initialState);
    });

    it('should return the updated state', () => {
      const scene = buildSceneMock();
      const key = `test-state-${Date.now()}`;
      const initialState = { ...baseState, life: 100 }
      const hook = withUndoableState<FakeState>(scene, key, initialState, 10);
      hook.set({ ...baseState, life: 90 });
      expect(hook.get()).toEqual({ ...baseState, life: 90 });
    });
  });

  describe('undo/redo functionality', () => {
    it('should undo to previous state', () => {
      const scene = buildSceneMock();
      const key = `test-state-${Date.now()}`;
      const initialState = { ...baseState, life: 100 }
      const hook = withUndoableState<FakeState>(scene, key, initialState, 10);

      hook.set({ ...baseState, life: 90 });
      hook.set({ ...baseState, life: 80 });

      expect(hook.get()).toEqual({ ...baseState, life: 80 });
      expect(hook.canUndo()).toBe(true);

      const undoResult = hook.undo();
      expect(undoResult).toBe(true);
      expect(hook.get()).toEqual({ ...baseState, life: 90 });
    });

    it('should redo to next state', () => {
      const scene = buildSceneMock();
      const key = `test-state-${Date.now()}`;
      const initialState = { ...baseState, life: 100 }
      const hook = withUndoableState<FakeState>(scene, key, initialState, 10);

      hook.set({ ...baseState, life: 90 });
      hook.set({ ...baseState, life: 80 });

      hook.undo(); // Back to 90
      expect(hook.get()).toEqual({ ...baseState, life: 90 });
      expect(hook.canRedo()).toBe(true);

      const redoResult = hook.redo();
      expect(redoResult).toBe(true);
      expect(hook.get()).toEqual({ ...baseState, life: 80 });
    });

    it('should return false when undo is not possible', () => {
      const scene = buildSceneMock();
      const key = `test-state-${Date.now()}`;
      const initialState = { ...baseState, life: 100 }
      const hook = withUndoableState<FakeState>(scene, key, initialState, 10);

      expect(hook.canUndo()).toBe(false);
      const undoResult = hook.undo();
      expect(undoResult).toBe(false);
      expect(hook.get()).toEqual(initialState);
    });

    it('should return false when redo is not possible', () => {
      const scene = buildSceneMock();
      const key = `test-state-${Date.now()}`;
      const initialState = { ...baseState, life: 100 }
      const hook = withUndoableState<FakeState>(scene, key, initialState, 10);

      hook.set({ ...baseState, life: 90 });

      expect(hook.canRedo()).toBe(false);
      const redoResult = hook.redo();
      expect(redoResult).toBe(false);
      expect(hook.get()).toEqual({ ...baseState, life: 90 });
    });

    it('should clear history and reset to current state', () => {
      const scene = buildSceneMock();
      const key = `test-state-${Date.now()}`;
      const initialState = { ...baseState, life: 100 }
      const hook = withUndoableState<FakeState>(scene, key, initialState, 10);

      hook.set({ ...baseState, life: 90 });
      hook.set({ ...baseState, life: 80 });

      expect(hook.canUndo()).toBe(true);
      hook.clearHistory();
      expect(hook.canUndo()).toBe(false);
      expect(hook.canRedo()).toBe(false);
      expect(hook.get()).toEqual({ ...baseState, life: 80 });
    });
  });

  describe('history management', () => {
    it('should limit history size when maxHistorySize is exceeded', () => {
      const scene = buildSceneMock();
      const key = `test-state-${Date.now()}`;
      const initialState = { ...baseState, life: 100 }
      const hook = withUndoableState<FakeState>(scene, key, initialState, 3);

      // Add more states than maxHistorySize
      hook.set({ ...baseState, life: 90 });
      hook.set({ ...baseState, life: 80 });
      hook.set({ ...baseState, life: 70 });
      hook.set({ ...baseState, life: 60 }); // This should remove the first state (100)

      // Should be able to undo 2 times (maxHistorySize - 1)
      expect(hook.canUndo()).toBe(true);
      hook.undo(); // Should go to 70
      expect(hook.get()).toEqual({ ...baseState, life: 70 });
      
      hook.undo(); // Should go to 80
      expect(hook.get()).toEqual({ ...baseState, life: 80 });
      
      // Should not be able to undo further (initial state was removed)
      expect(hook.canUndo()).toBe(false);
    });

    it('should remove future history when setting new state after undo', () => {
      const scene = buildSceneMock();
      const key = `test-state-${Date.now()}`;
      const initialState = { ...baseState, life: 100 }
      const hook = withUndoableState<FakeState>(scene, key, initialState, 10);

      hook.set({ ...baseState, life: 90 });
      hook.set({ ...baseState, life: 80 });
      hook.set({ ...baseState, life: 70 });

      hook.undo(); // Back to 80
      hook.undo(); // Back to 90

      // Now set a new state - this should remove the future history (70)
      hook.set({ ...baseState, life: 95 });

      expect(hook.get()).toEqual({ ...baseState, life: 95 });
      expect(hook.canRedo()).toBe(false); // No future history
      expect(hook.canUndo()).toBe(true);

      hook.undo(); // Should go back to 90
      expect(hook.get()).toEqual({ ...baseState, life: 90 });
    });
  });

  describe('events', () => {
    describe('on', () => {
      it('should register a change listener', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = { ...baseState, life: 100 }

        const callback = vi.fn();
        const hook = withUndoableState<FakeState>(scene, key, initialState, 10);
        hook.on('change', callback);
        hook.set({ ...baseState, life: 90 });
        expect(callback).toHaveBeenCalled();
      });

      it('should call multiple listeners', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = { ...baseState, life: 100 }

        const callback1 = vi.fn();
        const callback2 = vi.fn();
        const hook = withUndoableState<FakeState>(scene, key, initialState, 10);
        hook.on('change', callback1);
        hook.on('change', callback2);
        hook.set({ ...baseState, life: 90 });
        expect(callback1).toHaveBeenCalled();
        expect(callback2).toHaveBeenCalled();
      });

      it('should not call listener when call unsubscribe returned by .on function', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = { ...baseState, life: 100 }

        const callback = vi.fn();
        const hook = withUndoableState<FakeState>(scene, key, initialState, 10);
        const unsubscribe = hook.on('change', callback);
        hook.set({ ...baseState, life: 90 });

        expect(callback).toHaveBeenCalled();
        unsubscribe();

        hook.set({ ...baseState, life: 100 });
        expect(callback).toHaveBeenCalledTimes(1);
      });

      it('should not call listener when add .off method to remove listener', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = { ...baseState, life: 100 }

        const callback = vi.fn();
        const hook = withUndoableState<FakeState>(scene, key, initialState, 10);
        hook.on('change', callback);
        hook.off('change', callback);
        hook.set({ ...baseState, life: 90 });

        expect(callback).not.toHaveBeenCalled();
      });

      it('should call listener when call .once method', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = { ...baseState, life: 100 }

        const callback = vi.fn();
        const hook = withUndoableState<FakeState>(scene, key, initialState, 10);
        hook.once('change', callback);
        hook.set({ ...baseState, life: 90 });
        expect(callback).toHaveBeenCalled();
      });

      it('should call listener once when call .once method', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = { ...baseState, life: 100 }

        const callback = vi.fn();
        const hook = withUndoableState<FakeState>(scene, key, initialState, 10);
        hook.once('change', callback);
        hook.set({ ...baseState, life: 90 });
        expect(callback).toHaveBeenCalled();
        hook.set({ ...baseState, life: 100 });
        expect(callback).toHaveBeenCalledTimes(1);
      });

      it('should not call listener when call unsubscribe returned by .once function', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = { ...baseState, life: 100 }

        const callback = vi.fn();
        const hook = withUndoableState<FakeState>(scene, key, initialState, 10);
        const unsubscribe = hook.once('change', callback);
        unsubscribe();
        hook.set({ ...baseState, life: 90 })
        hook.set({ ...baseState, life: 100 });
        expect(callback).not.toHaveBeenCalled();
      });
    });
  });
});