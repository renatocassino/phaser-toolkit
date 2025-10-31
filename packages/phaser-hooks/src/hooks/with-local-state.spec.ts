/* eslint-disable max-lines-per-function */
/* eslint-disable no-magic-numbers */
/* eslint-disable max-lines */
/* eslint-disable max-nested-callbacks */
/* eslint-disable sonarjs/no-duplicate-string */
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

  describe('set with updater function', () => {
    describe('object state', () => {
      it('should update state using updater function', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = { ...baseState, life: 100 };
        const hook = withLocalState<FakeState>(scene, key, initialState);

        hook.set((currentState) => ({
          ...currentState,
          life: currentState.life - 10,
        }));

        expect(hook.get()).toEqual({ ...baseState, life: 90 });
      });

      it('should update state using updater function multiple times', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = { ...baseState, life: 100 };
        const hook = withLocalState<FakeState>(scene, key, initialState);

        // First update
        hook.set((currentState) => ({
          ...currentState,
          life: currentState.life - 20,
        }));
        expect(hook.get()).toEqual({ ...baseState, life: 80 });

        // Second update
        hook.set((currentState) => ({
          ...currentState,
          life: currentState.life + 5,
        }));
        expect(hook.get()).toEqual({ ...baseState, life: 85 });
      });

      it('should work with complex updater logic', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = { ...baseState, life: 100 };
        const hook = withLocalState<FakeState>(scene, key, initialState);

        hook.set((currentState) => ({
          ...currentState,
          life: Math.min(currentState.life + 30, 100),
        }));

        expect(hook.get()).toEqual({ ...baseState, life: 100 });
      });

      it('should trigger change events when using updater function', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = { ...baseState, life: 100 };
        const hook = withLocalState<FakeState>(scene, key, initialState);

        const callback = vi.fn();
        hook.on('change', callback);

        hook.set((currentState) => ({
          ...currentState,
          life: currentState.life - 15,
        }));

        expect(callback).toHaveBeenCalledWith(
          { ...baseState, life: 85 },
          { ...baseState, life: 100 }
        );
      });
    });

    describe('primitive state', () => {
      it('should work with number state', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = 100;
        const hook = withLocalState<number>(scene, key, initialState);

        hook.set((currentValue) => currentValue + 10);
        expect(hook.get()).toEqual(110);

        hook.set((currentValue) => currentValue * 2);
        expect(hook.get()).toEqual(220);
      });

      it('should work with string state', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = 'hello';
        const hook = withLocalState<string>(scene, key, initialState);

        hook.set((currentValue) => `${currentValue  } world`);
        expect(hook.get()).toEqual('hello world');

        hook.set((currentValue) => currentValue.toUpperCase());
        expect(hook.get()).toEqual('HELLO WORLD');
      });

      it('should work with boolean state', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = false;
        const hook = withLocalState<boolean>(scene, key, initialState);

        hook.set((currentValue) => !currentValue);
        expect(hook.get()).toEqual(true);

        hook.set((currentValue) => !currentValue);
        expect(hook.get()).toEqual(false);
      });

      it('should work with array state', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = [1, 2, 3];
        const hook = withLocalState<number[]>(scene, key, initialState);

        hook.set((currentValue) => [...currentValue, 4]);
        expect(hook.get()).toEqual([1, 2, 3, 4]);

        hook.set((currentValue) => currentValue.map(x => x * 2));
        expect(hook.get()).toEqual([2, 4, 6, 8]);
      });
    });

    describe('validator with updater function', () => {
      it('should validate the result of updater function', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = { ...baseState, life: 50 };

        const validator = vi.fn().mockImplementation((value: FakeState) => {
          return value.life >= 0 && value.life <= 100 ? true : 'Invalid life value';
        });

        const hook = withLocalState<FakeState>(scene, key, initialState, {
          validator,
        });

        // Valid updater function
        hook.set((currentState) => ({
          ...currentState,
          life: currentState.life + 20,
        }));
        expect(hook.get()).toEqual({ ...baseState, life: 70 });
        expect(validator).toHaveBeenCalledWith({ ...baseState, life: 70 });

        // Invalid updater function result
        expect(() =>
          hook.set((currentState) => ({
            ...currentState,
            life: currentState.life + 50, // This would make life = 120, which is invalid
          }))
        ).toThrow('[withStateDef] Invalid life value');
      });

      it('should not update state when updater function result is invalid', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = { ...baseState, life: 50 };

        const validator = vi.fn().mockImplementation((value: FakeState) => {
          return value.life >= 0 && value.life <= 100 ? true : 'Invalid life value';
        });

        const hook = withLocalState<FakeState>(scene, key, initialState, {
          validator,
        });

        // Try to set invalid value via updater function
        expect(() =>
          hook.set((currentState) => ({
            ...currentState,
            life: 150, // Invalid value
          }))
        ).toThrow('[withStateDef] Invalid life value');

        // State should remain unchanged
        expect(hook.get()).toEqual(initialState);
      });
    });

    describe('edge cases', () => {
      it('should handle updater function that returns the same reference', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = { ...baseState, life: 100 };
        const hook = withLocalState<FakeState>(scene, key, initialState);

        const callback = vi.fn();
        hook.on('change', callback);

        // Updater function that returns the same object reference
        hook.set((currentState) => currentState);

        // Should still trigger change event (Phaser's registry will detect the change)
        expect(callback).toHaveBeenCalled();
      });

      it('should handle updater function with complex logic', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = { ...baseState, life: 100 };
        const hook = withLocalState<FakeState>(scene, key, initialState);

        hook.set((currentState) => {
          const newLife = currentState.life - 10;
          if (newLife < 0) {
            return { ...currentState, life: 0 };
          }
          return { ...currentState, life: newLife };
        });

        expect(hook.get()).toEqual({ ...baseState, life: 90 });
      });

      it('should work with nested object updates', () => {
        type ComplexState = {
          player: {
            stats: {
              hp: number;
              mp: number;
            };
            level: number;
          };
        };

        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState: ComplexState = {
          player: {
            stats: { hp: 100, mp: 50 },
            level: 1,
          },
        };

        const hook = withLocalState<ComplexState>(scene, key, initialState);

        hook.set((currentState) => ({
          ...currentState,
          player: {
            ...currentState.player,
            stats: {
              ...currentState.player.stats,
              hp: currentState.player.stats.hp - 20,
            },
          },
        }));

        expect(hook.get()).toEqual({
          player: {
            stats: { hp: 80, mp: 50 },
            level: 1,
          },
        });
      });
    });
  });

  describe('patch method', () => {
    describe('object state patching', () => {
      it('should patch object state with partial updates', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = { 
          life: 100, 
          mana: 50, 
          level: 1,
          stats: {
            strength: 10,
            agility: 8,
            intelligence: 12
          }
        };
        const hook = withLocalState<typeof initialState>(scene, key, initialState);

        // Patch only specific properties
        hook.patch({ life: 90 });
        expect(hook.get()).toEqual({
          life: 90,
          mana: 50,
          level: 1,
          stats: {
            strength: 10,
            agility: 8,
            intelligence: 12
          }
        });

        // Patch multiple properties
        hook.patch({ mana: 75, level: 2 });
        expect(hook.get()).toEqual({
          life: 90,
          mana: 75,
          level: 2,
          stats: {
            strength: 10,
            agility: 8,
            intelligence: 12
          }
        });
      });

      it('should patch nested object properties', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = {
          player: {
            name: 'Hero',
            stats: {
              hp: 100,
              mp: 50,
              level: 1
            },
            inventory: ['sword', 'potion']
          },
          game: {
            score: 0,
            difficulty: 'normal'
          }
        };
        const hook = withLocalState<typeof initialState>(scene, key, initialState);

        // Patch nested stats
        hook.patch({
          player: {
            stats: {
              hp: 80
            }
          }
        });

        expect(hook.get()).toEqual({
          player: {
            name: 'Hero',
            stats: {
              hp: 80,
              mp: 50,
              level: 1
            },
            inventory: ['sword', 'potion']
          },
          game: {
            score: 0,
            difficulty: 'normal'
          }
        });
      });

      it('should work with updater function for patching', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = { 
          life: 100, 
          mana: 50, 
          level: 1 
        };
        const hook = withLocalState<typeof initialState>(scene, key, initialState);

        // Use updater function to patch
        hook.patch((currentState) => ({
          life: currentState.life - 10,
          level: currentState.level + 1
        }));

        expect(hook.get()).toEqual({
          life: 90,
          mana: 50,
          level: 2
        });
      });

      it('should trigger change events when patching', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = { 
          life: 100, 
          mana: 50, 
          level: 1 
        };
        const hook = withLocalState<typeof initialState>(scene, key, initialState);

        const callback = vi.fn();
        hook.on('change', callback);

        hook.patch({ life: 90 });

        expect(callback).toHaveBeenCalledWith(
          { life: 90, mana: 50, level: 1 },
          { life: 100, mana: 50, level: 1 }
        );
      });

      it('should preserve other properties when patching', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = {
          a: 1,
          b: 2,
          c: 3,
          d: 4,
          e: 5
        };
        const hook = withLocalState<typeof initialState>(scene, key, initialState);

        // Patch only one property
        hook.patch({ c: 30 });

        expect(hook.get()).toEqual({
          a: 1,
          b: 2,
          c: 30,
          d: 4,
          e: 5
        });
      });
    });

    describe('complex object patching', () => {
      it('should patch deeply nested objects', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = {
          game: {
            player: {
              character: {
                stats: {
                  primary: {
                    strength: 10,
                    dexterity: 8
                  },
                  secondary: {
                    charisma: 5,
                    wisdom: 7
                  }
                },
                equipment: {
                  weapon: 'sword',
                  armor: 'leather'
                }
              },
              position: { x: 0, y: 0 }
            },
            world: {
              level: 1,
              difficulty: 'normal'
            }
          }
        };
        const hook = withLocalState<typeof initialState>(scene, key, initialState);

        // Patch deeply nested property
        hook.patch({
          game: {
            player: {
              character: {
                stats: {
                  primary: {
                    strength: 15
                  }
                }
              }
            }
          }
        });

        expect(hook.get()).toEqual({
          game: {
            player: {
              character: {
                stats: {
                  primary: {
                    strength: 15,
                    dexterity: 8
                  },
                  secondary: {
                    charisma: 5,
                    wisdom: 7
                  }
                },
                equipment: {
                  weapon: 'sword',
                  armor: 'leather'
                }
              },
              position: { x: 0, y: 0 }
            },
            world: {
              level: 1,
              difficulty: 'normal'
            }
          }
        });
      });

      it('should handle array properties in objects', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = {
          player: {
            name: 'Hero',
            inventory: ['sword', 'potion'],
            skills: ['attack', 'defend'],
            stats: {
              hp: 100,
              mp: 50
            }
          }
        };
        const hook = withLocalState<typeof initialState>(scene, key, initialState);

        // Patch array property
        hook.patch({
          player: {
            inventory: ['sword', 'potion', 'shield']
          }
        });

        expect(hook.get()).toEqual({
          player: {
            name: 'Hero',
            inventory: ['sword', 'potion', 'shield'],
            skills: ['attack', 'defend'],
            stats: {
              hp: 100,
              mp: 50
            }
          }
        });
      });
    });

    describe('error handling', () => {
      it('should throw error when trying to patch non-object state', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = 100; // Primitive value
        const hook = withLocalState<number>(scene, key, initialState);

        expect(() => {
          // @ts-expect-error - we want to test the error case
          hook.patch({ value: 200 });
        }).toThrow('[withStateDef] Current value is not an object');
      });

      it('should throw error when trying to patch null state', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = null;
        const hook = withLocalState<null>(scene, key, initialState);

        expect(() => {
          // @ts-expect-error - we want to test the error case
          hook.patch({ value: 'something' });
        }).toThrow('[withStateDef] Current value is not an object');
      });
    });

    describe('validator with patch', () => {
      it('should validate patched values', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = { 
          life: 50, 
          mana: 30 
        };

        const validator = vi.fn().mockImplementation((value: typeof initialState) => {
          return value.life >= 0 && value.life <= 100 ? true : 'Invalid life value';
        });

        const hook = withLocalState<typeof initialState>(scene, key, initialState, {
          validator,
        });

        // Valid patch
        hook.patch({ life: 75 });
        expect(hook.get()).toEqual({ life: 75, mana: 30 });
        expect(validator).toHaveBeenCalledWith({ life: 75, mana: 30 });

        // Invalid patch
        expect(() => hook.patch({ life: 150 })).toThrow('[withStateDef] Invalid life value');
        expect(hook.get()).toEqual({ life: 75, mana: 30 }); // Should remain unchanged
      });

      it('should not update state when patch result is invalid', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = { 
          score: 100, 
          level: 1 
        };

        const validator = vi.fn().mockImplementation((value: typeof initialState) => {
          return value.score >= 0 && value.score <= 1000 ? true : 'Score must be 0-1000';
        });

        const hook = withLocalState<typeof initialState>(scene, key, initialState, {
          validator,
        });

        // Try to patch with invalid value
        expect(() => hook.patch({ score: 2000 })).toThrow('[withStateDef] Score must be 0-1000');
        expect(hook.get()).toEqual(initialState); // Should remain unchanged
      });
    });

    describe('edge cases', () => {
      it('should handle patching with empty object', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = { 
          life: 100, 
          mana: 50 
        };
        const hook = withLocalState<typeof initialState>(scene, key, initialState);

        // Patch with empty object should not change anything
        hook.patch({});

        expect(hook.get()).toEqual(initialState);
      });

      it('should handle patching with undefined values', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = { 
          life: 100, 
          mana: 50 
        };
        const hook = withLocalState<typeof initialState>(scene, key, initialState);

        // Patch with undefined should not change anything
        hook.patch({ life: undefined as unknown as number });

        expect(hook.get()).toEqual(initialState);
      });

      it('should handle patching with null values', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = { 
          life: 100, 
          mana: 50 
        };
        const hook = withLocalState<typeof initialState>(scene, key, initialState);

        // Patch with null
        hook.patch({ life: null as unknown as number });

        expect(hook.get()).toEqual({ life: null as unknown as number, mana: 50 });
      });

      it('should handle patching with function values', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = { 
          life: 100, 
          mana: 50 
        };
        const hook = withLocalState<typeof initialState>(scene, key, initialState);

        const testFunction = (): string => 'test';

        // Patch with function
        hook.patch({ life: testFunction as unknown as number });

        expect(hook.get()).toEqual({ life: testFunction, mana: 50 });
      });
    });

    describe('performance and immutability', () => {
      it('should create new object references when patching', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = { 
          life: 100, 
          mana: 50,
          nested: {
            value: 10
          }
        };
        const hook = withLocalState<typeof initialState>(scene, key, initialState);

        const originalState = hook.get();
        hook.patch({ life: 90 });

        const newState = hook.get();

        // Should be different object references
        expect(newState).not.toBe(originalState);
        expect(newState.nested).not.toBe(originalState.nested);
        
        // But nested objects should be preserved if not patched
        expect(newState.nested).toEqual(originalState.nested);
      });

      it('should handle multiple sequential patches', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState = { 
          a: 1, 
          b: 2, 
          c: 3, 
          d: 4 
        };
        const hook = withLocalState<typeof initialState>(scene, key, initialState);

        // Multiple sequential patches
        hook.patch({ a: 10 });
        hook.patch({ b: 20 });
        hook.patch({ c: 30 });
        hook.patch({ d: 40 });

        expect(hook.get()).toEqual({ a: 10, b: 20, c: 30, d: 40 });
      });
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
        expect(callback).toHaveBeenCalledWith({ ...baseState, life: 90 }, initialState);
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

      it('should validate TypeScript types for newValue and oldValue parameters after calling .set', () => {
        const scene = buildSceneMock();
        const key = `test-state-${Date.now()}`;
        const initialState: FakeState = { ...baseState, life: 100 };
        const hook = withLocalState<FakeState>(scene, key, initialState);

        // Test that callbacks receive correctly typed newValue and oldValue
        let capturedNewValue: FakeState | undefined;
        let capturedOldValue: FakeState | undefined;

        const onCallback = (newValue: FakeState, oldValue: FakeState): void => {
          capturedNewValue = newValue;
          capturedOldValue = oldValue;
        };

        const onceCallback = (newValue: FakeState, oldValue: FakeState): void => {
          // Type check: newValue and oldValue should be FakeState
          expect(newValue).toBeDefined();
          expect(oldValue).toBeDefined();
        };

        // Register listeners with typed callbacks
        hook.on('change', onCallback);
        hook.once('change', onceCallback);

        // Call .set and verify types are correct
        const newState: FakeState = { ...baseState, life: 90 };
        hook.set(newState);

        // Verify that callbacks received the correct typed values
        expect(capturedNewValue).toEqual(newState);
        expect(capturedOldValue).toEqual(initialState);

        // Remove listener using .off with typed callback
        hook.off('change', onCallback);

        // Verify .off worked by setting again and checking offCallback wasn't called
        hook.set({ ...baseState, life: 80 });
        // onCallback should still be called
        expect(capturedNewValue).toEqual({ ...baseState, life: 90 });
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
