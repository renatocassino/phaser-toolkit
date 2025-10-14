import { type HookState, type StateUpdater } from './type';
import { withLocalState } from './with-local-state';

/**
 * Creates a state hook with debounced updates
 * @template T The type of the state value
 * @param scene The Phaser scene instance
 * @param key Unique identifier for the state
 * @param initialValue Initial value for the state
 * @param debounceMs Debounce delay in milliseconds
 * @returns HookState with debounced set operations
 *
 * @example
 * ```typescript
 * const debouncedSearch = withDebouncedState<string>(scene, 'search', '', 300);
 *
 * // These rapid calls will be debounced
 * debouncedSearch.set('a');
 * debouncedSearch.set('ab');
 * debouncedSearch.set('abc'); // Only this final value will be set after 300ms
 * ```
 */
export const withDebouncedState = <T>(
  scene: Phaser.Scene,
  key: string,
  initialValue: T,
  debounceMs: number
): HookState<T> => {
  const actualState = withLocalState<T>(scene, key, initialValue);
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const debouncedSet = (value: T | StateUpdater<T>): void => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      actualState.set(value);
      timeoutId = null;
    }, debounceMs);
  };

  return {
    ...actualState,
    set: debouncedSet,
  };
};
