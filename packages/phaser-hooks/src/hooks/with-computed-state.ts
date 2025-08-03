import { type HookState, type StateSelector } from './type';
import { withLocalState } from './with-local-state';

/**
 * Creates a computed state that derives its value from other states
 * @template T The input state type
 * @template U The computed result type
 * @param scene The Phaser scene instance
 * @param key Unique identifier for the computed state
 * @param sourceState The source state to derive from
 * @param selector Function to compute the derived value
 * @returns HookState with computed value
 *
 * @example
 * ```typescript
 * const playerState = withLocalState<{hp: number, maxHp: number}>(scene, 'player', {...});
 * const healthPercentage = withComputedState(
 *   scene,
 *   'healthPercent',
 *   playerState,
 *   (player) => (player.hp / player.maxHp) * 100
 * );
 * ```
 */
export const withComputedState = <T, U>(
  scene: Phaser.Scene,
  key: string,
  sourceState: HookState<T>,
  selector: StateSelector<T, U>
): HookState<U> => {
  // Initialize with computed value
  const initialValue = selector(sourceState.get());
  const computedState = withLocalState<U>(scene, key, initialValue);

  // Update computed state when source changes
  sourceState.onChange(newSourceValue => {
    const newComputedValue = selector(newSourceValue);
    computedState.set(newComputedValue);
  });

  return {
    get: computedState.get,
    set: (): void => {
      throw new Error(
        `[withComputedState] Cannot directly set computed state "${key}". Update the source state instead.`
      );
    },
    onChange: computedState.onChange,
  };
};
