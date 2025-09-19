/* eslint-disable max-lines-per-function */
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { buildSceneMock } from "../test/scene-mock";

import { withLocalState } from "./with-local-state";

type FakeState = {
  life: number;
}

describe('withLocalState', () => {
  const baseState: FakeState = {
    life: 100,
  }

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('validation', () => {
    it('should throw an error if the scene is not provided', () => {
      // @ts-expect-error - we want to test the error case
      expect(() => withLocalState<FakeState>(null, 'test-state', baseState)).toThrow('[withLocalState] Scene parameter is required');
    });

    it('should throw an error if the data manager is not provided', () => {
      const scene = buildSceneMock();
      // @ts-expect-error - we want to test the error case
      scene.data = null;
      expect(() => withLocalState<FakeState>(scene, 'test-state', baseState)).toThrow('[withStateDef] Scene data is not available. Ensure the scene is properly initialized.');
    });
  });

  it('should be defined', () => {
    expect(withLocalState).toBeDefined();
  });

  describe('initial state definition', () => {
    it('should set initial state value if not provided in first call', () => {
      const scene = buildSceneMock();
      const key = `test-state-${Date.now()}`;
      const initialState = { ...baseState, life: 90 }

      const setSpy = vi.spyOn(scene.data, 'set');

      withLocalState<FakeState>(scene, key, initialState);

      // withLocalState uses scene.data, not scene.registry, for local state
      expect(setSpy).toHaveBeenCalledWith(`phaser-hooks:local:test-scene:${key}`, initialState);

      setSpy.mockRestore();
    });

    it('should not set state in second call', () => {
      const scene = buildSceneMock();
      const key = `test-state-${Date.now()}`;
      const initialState = { ...baseState, life: 75 }

      const setSpy = vi.spyOn(scene.data, 'set');

      withLocalState<FakeState>(scene, key, initialState);

      expect(setSpy).toHaveBeenCalledWith(`phaser-hooks:local:test-scene:${key}`, initialState);

      // second call should not set state
      const hook = withLocalState<FakeState>(scene, key, { ...baseState, life: 100 });

      expect(setSpy).toHaveBeenCalledTimes(1);
      expect(hook.get()).toEqual(initialState);

      setSpy.mockRestore();
    });
  });

  describe('get/set', () => {
    it('should return the initial state', () => {
      const scene = buildSceneMock();
      const key = `test-state-${Date.now()}`;
      const initialState = { ...baseState, life: 100 }
      const hook = withLocalState<FakeState>(scene, key, initialState);
      expect(hook.get()).toEqual(initialState);
    });

    it('should return the updated state', () => {
      const scene = buildSceneMock();
      const key = `test-state-${Date.now()}`;
      const initialState = { ...baseState, life: 100 }
      const hook = withLocalState<FakeState>(scene, key, initialState);
      hook.set({ ...baseState, life: 90 });
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
        const hook = withLocalState<FakeState>(scene, key, initialState);
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
        const hook = withLocalState<FakeState>(scene, key, initialState);
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
        const hook = withLocalState<FakeState>(scene, key, initialState);
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
        const hook = withLocalState<FakeState>(scene, key, initialState);
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
        const hook = withLocalState<FakeState>(scene, key, initialState);
        hook.once('change', callback);
        hook.set({ ...baseState, life: 90 });
        expect(callback).toHaveBeenCalled();
      });

      it('should call listener once when call .once method', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = { ...baseState, life: 100 }

        const callback = vi.fn();
        const hook = withLocalState<FakeState>(scene, key, initialState);
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
        const hook = withLocalState<FakeState>(scene, key, initialState);
        const unsubscribe = hook.once('change', callback);
        unsubscribe();
        hook.set({ ...baseState, life: 90 })
        hook.set({ ...baseState, life: 100 });
        expect(callback).not.toHaveBeenCalled();
      });
    });
  });
});
