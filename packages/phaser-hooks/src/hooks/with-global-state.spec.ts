/* eslint-disable max-lines-per-function */
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { buildSceneMock } from '../test/scene-mock';

import { withGlobalState } from './with-global-state';

type FakeState = {
  life: number;
};

describe('withGlobalState', () => {
  const baseState: FakeState = {
    life: 100,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('validation', () => {
    it('should throw an error if the scene is not provided', () => {
      const scene: Phaser.Scene = null as unknown as Phaser.Scene;
      expect(() =>
        withGlobalState<FakeState>(scene, 'test-state', baseState)
      ).toThrow('[withGlobalState] Scene parameter is required');
    });

    it('should throw an error if the registry manager is not provided', () => {
      const scene = buildSceneMock();
      // @ts-expect-error - we want to test the error case
      scene.registry = null;
      expect(() =>
        withGlobalState<FakeState>(scene, 'test-state', baseState)
      ).toThrow(
        '[withStateDef] Scene registry is not available. Ensure the scene is properly initialized.'
      );
    });
  });

  it('should be defined', () => {
    expect(withGlobalState).toBeDefined();
  });

  describe('initial state definition', () => {
    it('should set initial state value if not provided in first call', () => {
      const scene = buildSceneMock();
      const key = `test-state-${Date.now()}`;
      const initialState = { ...baseState, life: 90 };

      const setSpy = vi.spyOn(scene.registry, 'set');

      withGlobalState<FakeState>(scene, key, initialState);

      // withGlobalState uses scene.registry, not scene.data, for global state
      expect(setSpy).toHaveBeenCalledWith(
        `phaser-hooks:global:${key}`,
        initialState
      );

      setSpy.mockRestore();
    });

    it('should not set state in second call', () => {
      const scene = buildSceneMock();
      const key = `test-state-${Date.now()}`;
      const initialState = { ...baseState, life: 75 };

      const setSpy = vi.spyOn(scene.registry, 'set');

      withGlobalState<FakeState>(scene, key, initialState);

      expect(setSpy).toHaveBeenCalledWith(
        `phaser-hooks:global:${key}`,
        initialState
      );

      // second call should not set state
      const hook = withGlobalState<FakeState>(scene, key, {
        ...baseState,
        life: 100,
      });

      expect(setSpy).toHaveBeenCalledTimes(1);
      expect(hook.get()).toEqual(initialState);

      setSpy.mockRestore();
    });
  });

  describe('get/set', () => {
    it('should return the initial state', () => {
      const scene = buildSceneMock();
      const key = `test-state-${Date.now()}`;
      const initialState = { ...baseState, life: 100 };
      const hook = withGlobalState<FakeState>(scene, key, initialState);
      expect(hook.get()).toEqual(initialState);
    });

    it('should return the updated state', () => {
      const scene = buildSceneMock();
      const key = `test-state-${Date.now()}`;
      const initialState = { ...baseState, life: 100 };
      const hook = withGlobalState<FakeState>(scene, key, initialState);
      hook.set({ ...baseState, life: 90 });
      expect(hook.get()).toEqual({ ...baseState, life: 90 });
    });
  });

  describe('events', () => {
    describe('on', () => {
      it('should register a change listener', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = { ...baseState, life: 100 };

        const callback = vi.fn();
        const hook = withGlobalState<FakeState>(scene, key, initialState);
        hook.on('change', callback);
        hook.set({ ...baseState, life: 90 });
        expect(callback).toHaveBeenCalled();
      });

      it('should call multiple listeners', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = { ...baseState, life: 100 };

        const callback1 = vi.fn();
        const callback2 = vi.fn();
        const hook = withGlobalState<FakeState>(scene, key, initialState);
        hook.on('change', callback1);
        hook.on('change', callback2);
        hook.set({ ...baseState, life: 90 });
        expect(callback1).toHaveBeenCalled();
        expect(callback2).toHaveBeenCalled();
      });

      it('should not call listener when call unsubscribe returned by .on function', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = { ...baseState, life: 100 };

        const callback = vi.fn();
        const hook = withGlobalState<FakeState>(scene, key, initialState);
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
        const initialState = { ...baseState, life: 100 };

        const callback = vi.fn();
        const hook = withGlobalState<FakeState>(scene, key, initialState);
        hook.on('change', callback);
        hook.off('change', callback);
        hook.set({ ...baseState, life: 90 });

        expect(callback).not.toHaveBeenCalled();
      });

      it('should call listener when call .once method', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = { ...baseState, life: 100 };

        const callback = vi.fn();
        const hook = withGlobalState<FakeState>(scene, key, initialState);
        hook.once('change', callback);
        hook.set({ ...baseState, life: 90 });
        expect(callback).toHaveBeenCalled();
      });

      it('should call listener once when call .once method', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = { ...baseState, life: 100 };

        const callback = vi.fn();
        const hook = withGlobalState<FakeState>(scene, key, initialState);
        hook.once('change', callback);
        hook.set({ ...baseState, life: 90 });
        expect(callback).toHaveBeenCalled();
        hook.set({ ...baseState, life: 100 });
        expect(callback).toHaveBeenCalledTimes(1);
      });

      it('should not call listener when call unsubscribe returned by .once function', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = { ...baseState, life: 100 };

        const callback = vi.fn();
        const hook = withGlobalState<FakeState>(scene, key, initialState);
        const unsubscribe = hook.once('change', callback);
        unsubscribe();
        hook.set({ ...baseState, life: 90 });
        hook.set({ ...baseState, life: 100 });
        expect(callback).not.toHaveBeenCalled();
      });
    });

    describe('clearListeners', () => {
      it('should clear all event listeners', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = { ...baseState, life: 100 };

        const callback1 = vi.fn();
        const callback2 = vi.fn();
        const callback3 = vi.fn();
        const hook = withGlobalState<FakeState>(scene, key, initialState);

        // Add multiple listeners
        hook.on('change', callback1);
        hook.on('change', callback2);
        hook.once('change', callback3);

        // Verify listeners are working
        hook.set({ ...baseState, life: 90 });
        expect(callback1).toHaveBeenCalled();
        expect(callback2).toHaveBeenCalled();
        expect(callback3).toHaveBeenCalled();

        // Clear all listeners
        hook.clearListeners();

        // Verify listeners are cleared
        callback1.mockClear();
        callback2.mockClear();
        callback3.mockClear();

        hook.set({ ...baseState, life: 80 });
        expect(callback1).not.toHaveBeenCalled();
        expect(callback2).not.toHaveBeenCalled();
        expect(callback3).not.toHaveBeenCalled();
      });

      it('should clear listeners added via onChange (deprecated)', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = { ...baseState, life: 100 };

        const callback = vi.fn();
        const hook = withGlobalState<FakeState>(scene, key, initialState);

        // Add listener via deprecated onChange
        hook.onChange(callback);

        // Verify listener is working
        hook.set({ ...baseState, life: 90 });
        expect(callback).toHaveBeenCalled();

        // Clear all listeners
        hook.clearListeners();

        // Verify listener is cleared
        callback.mockClear();
        hook.set({ ...baseState, life: 80 });
        expect(callback).not.toHaveBeenCalled();
      });

      it('should work with debug mode enabled', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = { ...baseState, life: 100 };

        const consoleSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
        const hook = withGlobalState<FakeState>(scene, key, initialState, { debug: true });

        const callback = vi.fn();
        hook.on('change', callback);

        // Clear listeners with debug enabled
        hook.clearListeners();

        expect(consoleSpy).toHaveBeenCalledWith(
          expect.stringContaining('[withStateDef] Cleared all event listeners for "phaser-hooks:global:test-state-')
        );

        consoleSpy.mockRestore();
      });

      it('should not affect other state instances', () => {
        const scene = buildSceneMock();
        const key1 = `test-state-1-${Date.now()}`;
        const key2 = `test-state-2-${Date.now()}`;
        const initialState = { ...baseState, life: 100 };

        const callback1 = vi.fn();
        const callback2 = vi.fn();
        
        const hook1 = withGlobalState<FakeState>(scene, key1, initialState);
        const hook2 = withGlobalState<FakeState>(scene, key2, initialState);

        // Add listeners to both hooks
        hook1.on('change', callback1);
        hook2.on('change', callback2);

        // Clear listeners from hook1 only
        hook1.clearListeners();

        // Verify hook1 listeners are cleared but hook2 listeners still work
        hook1.set({ ...baseState, life: 90 });
        hook2.set({ ...baseState, life: 90 });

        expect(callback1).not.toHaveBeenCalled();
        expect(callback2).toHaveBeenCalled();
      });

      it('should work when no listeners are present', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = { ...baseState, life: 100 };

        const hook = withGlobalState<FakeState>(scene, key, initialState);

        // Should not throw when clearing listeners that don't exist
        expect(() => hook.clearListeners()).not.toThrow();
      });

      it('should clear listeners after partial removal', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = { ...baseState, life: 100 };

        const callback1 = vi.fn();
        const callback2 = vi.fn();
        const callback3 = vi.fn();
        const hook = withGlobalState<FakeState>(scene, key, initialState);

        // Add multiple listeners
        hook.on('change', callback1);
        hook.on('change', callback2);
        hook.on('change', callback3);

        // Remove one listener manually
        hook.off('change', callback2);

        // Clear all remaining listeners
        hook.clearListeners();

        // Verify all listeners are cleared
        callback1.mockClear();
        callback2.mockClear();
        callback3.mockClear();

        hook.set({ ...baseState, life: 90 });
        expect(callback1).not.toHaveBeenCalled();
        expect(callback2).not.toHaveBeenCalled();
        expect(callback3).not.toHaveBeenCalled();
      });

      it('should work with global state persistence', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = { ...baseState, life: 100 };

        const callback = vi.fn();
        const hook = withGlobalState<FakeState>(scene, key, initialState);

        // Add listener
        hook.on('change', callback);

        // Verify listener works
        hook.set({ ...baseState, life: 90 });
        expect(callback).toHaveBeenCalled();

        // Clear listeners
        hook.clearListeners();

        // Verify listener is cleared but state persists
        callback.mockClear();
        hook.set({ ...baseState, life: 80 });
        expect(callback).not.toHaveBeenCalled();
        expect(hook.get()).toEqual({ ...baseState, life: 80 });
      });
    });
  });
});
