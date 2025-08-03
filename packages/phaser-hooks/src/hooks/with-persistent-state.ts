import { type HookState } from './type';
import { withGlobalState } from './with-global-state';

/**
 * Creates a state hook with automatic localStorage persistence
 * @template T The type of the state value
 * @param key Unique identifier for the state
 * @param initialValue Initial value to use if no stored value exists
 * @param storageKey Optional custom localStorage key (defaults to the state key)
 * @returns HookState with automatic persistence
 *
 * @example
 * ```typescript
 * const persistentSettings = withPersistentState<UserSettings>(
 *   'settings',
 *   { volume: 0.8, difficulty: 'normal' }
 * );
 * ```
 */
export const withPersistentState = <T>(
  key: string,
  initialValue: T,
  storageKey?: string
): HookState<T> => {
  const actualStorageKey = storageKey ?? `phaser-state-${key}`;

  // Load from localStorage if available
  let storedValue = initialValue;
  try {
    const stored = localStorage.getItem(actualStorageKey);
    if (stored) {
      storedValue = JSON.parse(stored);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(
      `[withPersistentState] Failed to load stored state for "${key}":`,
      error
    );
  }

  const state = withGlobalState<T>(key, storedValue);

  // Save to localStorage on changes
  state.onChange(newValue => {
    try {
      localStorage.setItem(actualStorageKey, JSON.stringify(newValue));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(
        `[withPersistentState] Failed to save state for "${key}":`,
        error
      );
    }
  });

  return state;
};
