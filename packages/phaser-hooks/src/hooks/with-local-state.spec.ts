/* eslint-disable max-lines-per-function */
/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines */
import { type Scene } from 'phaser';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { buildSceneMock } from '../test/scene-mock';

import { withLocalState } from './with-local-state';

type FakeState = {
  life: number;
};

describe('withLocalState', () => {
  const baseState: FakeState = {
    life: 100,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('validation', () => {
    it('should throw an error if the scene is not provided', () => {
      const scene = null as unknown as Scene;
      expect(() =>
        withLocalState<FakeState>(scene, 'test-state', baseState)
      ).toThrow('[withLocalState] Scene parameter is required');
    });

    it('should throw an error if the data manager is not provided', () => {
      const scene = buildSceneMock();
      // @ts-expect-error - we want to test the error case
      scene.data = null;
      expect(() =>
        withLocalState<FakeState>(scene, 'test-state', baseState)
      ).toThrow(
        '[withStateDef] Scene data is not available. Ensure the scene is properly initialized.'
      );
    });
  });

  it('should be defined', () => {
    expect(withLocalState).toBeDefined();
  });

  describe('initial state definition', () => {
    it('should set initial state value if not provided in first call', () => {
      const scene = buildSceneMock();
      const key = `test-state-${Date.now()}`;
      const initialState = { ...baseState, life: 90 };

      const setSpy = vi.spyOn(scene.data, 'set');

      withLocalState<FakeState>(scene, key, initialState);

      // withLocalState uses scene.data, not scene.registry, for local state
      expect(setSpy).toHaveBeenCalledWith(
        `phaser-hooks:local:test-scene:${key}`,
        initialState
      );

      setSpy.mockRestore();
    });

    it('should not set state in second call', () => {
      const scene = buildSceneMock();
      const key = `test-state-${Date.now()}`;
      const initialState = { ...baseState, life: 75 };

      const setSpy = vi.spyOn(scene.data, 'set');

      withLocalState<FakeState>(scene, key, initialState);

      expect(setSpy).toHaveBeenCalledWith(
        `phaser-hooks:local:test-scene:${key}`,
        initialState
      );

      // second call should not set state
      const hook = withLocalState<FakeState>(scene, key, {
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
      const hook = withLocalState<FakeState>(scene, key, initialState);
      expect(hook.get()).toEqual(initialState);
    });

    it('should return the updated state', () => {
      const scene = buildSceneMock();
      const key = `test-state-${Date.now()}`;
      const initialState = { ...baseState, life: 100 };
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
        const initialState = { ...baseState, life: 100 };

        const callback = vi.fn();
        const hook = withLocalState<FakeState>(scene, key, initialState);
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
        const initialState = { ...baseState, life: 100 };

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
        const initialState = { ...baseState, life: 100 };

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
        const initialState = { ...baseState, life: 100 };

        const callback = vi.fn();
        const hook = withLocalState<FakeState>(scene, key, initialState);
        hook.once('change', callback);
        hook.set({ ...baseState, life: 90 });
        expect(callback).toHaveBeenCalled();
      });

      it('should call listener once when call .once method', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = { ...baseState, life: 100 };

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
        const initialState = { ...baseState, life: 100 };

        const callback = vi.fn();
        const hook = withLocalState<FakeState>(scene, key, initialState);
        const unsubscribe = hook.once('change', callback);
        unsubscribe();
        hook.set({ ...baseState, life: 90 });
        hook.set({ ...baseState, life: 100 });
        expect(callback).not.toHaveBeenCalled();
      });
    });
  });

  describe('validators', () => {
    describe('valid values', () => {
      it('should accept valid values when validator returns true', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = { ...baseState, life: 50 };

        const validator = vi.fn().mockReturnValue(true);
        const hook = withLocalState<FakeState>(scene, key, initialState, {
          validator,
        });

        expect(validator).toHaveBeenCalledWith(initialState);
        expect(hook.get()).toEqual(initialState);

        // Test setting a new valid value
        const newValue = { ...baseState, life: 75 };
        hook.set(newValue);
        expect(validator).toHaveBeenCalledWith(newValue);
        expect(hook.get()).toEqual(newValue);
        expect(validator).toHaveBeenCalledTimes(2);
      });

      it('should accept valid values when validator returns string true', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = { ...baseState, life: 50 };

        const validator = vi.fn().mockReturnValue(true);
        const hook = withLocalState<FakeState>(scene, key, initialState, {
          validator,
        });

        expect(validator).toHaveBeenCalledWith(initialState);
        expect(hook.get()).toEqual(initialState);
      });
    });

    describe('invalid values', () => {
      it('should reject invalid values when validator returns false', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = { ...baseState, life: 50 };

        const validator = vi.fn().mockImplementation((value: FakeState) => {
          return value.life >= 0 ? true : false;
        });
        const hook = withLocalState<FakeState>(scene, key, initialState, {
          validator,
        });

        expect(validator).toHaveBeenCalledWith(initialState);
        expect(hook.get()).toEqual(initialState);

        // Test setting an invalid value
        const invalidValue = { ...baseState, life: -10 };
        expect(() => hook.set(invalidValue)).toThrow(
          '[withStateDef] Invalid value for key'
        );
        expect(validator).toHaveBeenCalledWith(invalidValue);
        expect(hook.get()).toEqual(initialState); // Should remain unchanged
      });

      it('should reject invalid values when validator returns error message', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = { ...baseState, life: 50 };
        const errorMessage = 'Life must be between 0 and 100';

        const validator = vi.fn().mockImplementation((value: FakeState) => {
          return value.life >= 0 && value.life <= 100 ? true : errorMessage;
        });
        const hook = withLocalState<FakeState>(scene, key, initialState, {
          validator,
        });

        expect(validator).toHaveBeenCalledWith(initialState);
        expect(hook.get()).toEqual(initialState);

        // Test setting an invalid value
        const invalidValue = { ...baseState, life: 150 };
        expect(() => hook.set(invalidValue)).toThrow(
          `[withStateDef] ${errorMessage}`
        );
        expect(validator).toHaveBeenCalledWith(invalidValue);
        expect(hook.get()).toEqual(initialState); // Should remain unchanged
      });

      it('should reject invalid initial value when validator returns false', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const invalidInitialValue = { ...baseState, life: -50 };

        const validator = vi.fn().mockReturnValue(false);

        expect(() =>
          withLocalState<FakeState>(scene, key, invalidInitialValue, {
            validator,
          })
        ).toThrow('[withStateDef] Invalid initial value for key');
        expect(validator).toHaveBeenCalledWith(invalidInitialValue);
      });

      it('should reject invalid initial value when validator returns error message', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const invalidInitialValue = { ...baseState, life: 200 };
        const errorMessage = 'Life cannot exceed 100';

        const validator = vi.fn().mockReturnValue(errorMessage);

        expect(() =>
          withLocalState<FakeState>(scene, key, invalidInitialValue, {
            validator,
          })
        ).toThrow(`[withStateDef] ${errorMessage}`);
        expect(validator).toHaveBeenCalledWith(invalidInitialValue);
      });
    });

    describe('validator behavior', () => {
      it('should not call validator on get operations', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = { ...baseState, life: 50 };

        const validator = vi.fn().mockReturnValue(true);
        const hook = withLocalState<FakeState>(scene, key, initialState, {
          validator,
        });

        // Clear the validator calls from initialization
        validator.mockClear();

        // Get the value multiple times
        hook.get();
        hook.get();
        hook.get();

        expect(validator).not.toHaveBeenCalled();
      });

      it('should call validator on every set operation', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = { ...baseState, life: 50 };

        const validator = vi.fn().mockReturnValue(true);
        const hook = withLocalState<FakeState>(scene, key, initialState, {
          validator,
        });

        // Clear the validator calls from initialization
        validator.mockClear();

        // Set multiple values
        hook.set({ ...baseState, life: 60 });
        hook.set({ ...baseState, life: 70 });
        hook.set({ ...baseState, life: 80 });

        expect(validator).toHaveBeenCalledTimes(3);
        expect(validator).toHaveBeenCalledWith({ ...baseState, life: 60 });
        expect(validator).toHaveBeenCalledWith({ ...baseState, life: 70 });
        expect(validator).toHaveBeenCalledWith({ ...baseState, life: 80 });
      });

      it('should work with complex validator logic', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = { ...baseState, life: 50 };

        const validator = vi.fn().mockImplementation((value: FakeState) => {
          if (value.life < 0) return 'Life cannot be negative';
          if (value.life > 100) return 'Life cannot exceed 100';
          if (value.life % 10 !== 0) return 'Life must be a multiple of 10';
          return true;
        });

        const hook = withLocalState<FakeState>(scene, key, initialState, {
          validator,
        });

        // Test valid value
        hook.set({ ...baseState, life: 90 });
        expect(hook.get()).toEqual({ ...baseState, life: 90 });

        // Test invalid values
        expect(() => hook.set({ ...baseState, life: -10 })).toThrow(
          '[withStateDef] Life cannot be negative'
        );

        expect(() => hook.set({ ...baseState, life: 150 })).toThrow(
          '[withStateDef] Life cannot exceed 100'
        );

        expect(() => hook.set({ ...baseState, life: 55 })).toThrow(
          '[withStateDef] Life must be a multiple of 10'
        );

        // State should remain unchanged after invalid attempts
        expect(hook.get()).toEqual({ ...baseState, life: 90 });
      });

      it('should work with async-like validator (synchronous)', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = { ...baseState, life: 50 };

        const validator = vi.fn().mockImplementation((value: FakeState) => {
          // Simulate some validation logic
          const isValid = value.life >= 0 && value.life <= 100;
          return isValid ? true : 'Invalid life value';
        });

        const hook = withLocalState<FakeState>(scene, key, initialState, {
          validator,
        });

        // Test valid value
        hook.set({ ...baseState, life: 75 });
        expect(hook.get()).toEqual({ ...baseState, life: 75 });

        // Test invalid value
        expect(() => hook.set({ ...baseState, life: 150 })).toThrow(
          '[withStateDef] Invalid life value'
        );
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
        const hook = withLocalState<FakeState>(scene, key, initialState);

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
        const hook = withLocalState<FakeState>(scene, key, initialState);

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

        // Test that debug mode doesn't throw errors
        const hook = withLocalState<FakeState>(scene, key, initialState, {
          debug: true,
        });

        const callback = vi.fn();
        hook.on('change', callback);

        // Clear listeners with debug enabled - should not throw
        expect(() => hook.clearListeners()).not.toThrow();
      });

      it('should not affect other state instances', () => {
        const scene = buildSceneMock();
        const key1 = `test-state-1-${Date.now()}`;
        const key2 = `test-state-2-${Date.now()}`;
        const initialState = { ...baseState, life: 100 };

        const callback1 = vi.fn();
        const callback2 = vi.fn();

        const hook1 = withLocalState<FakeState>(scene, key1, initialState);
        const hook2 = withLocalState<FakeState>(scene, key2, initialState);

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

        const hook = withLocalState<FakeState>(scene, key, initialState);

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
        const hook = withLocalState<FakeState>(scene, key, initialState);

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
    });
  });
});
