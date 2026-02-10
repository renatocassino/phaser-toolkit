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
  scene: Phaser.Scene,
  key: string,
  initialValue: T,
  storageKey?: string,
  storageType: 'session' | 'local' = 'local'
): HookState<T> => {
  const actualStorageKey = storageKey ?? `phaser-hooks-state:${key}`;
  const storage = storageType === 'local' ? localStorage : sessionStorage;

  // Load from localStorage if available
  let storedValue = initialValue;
  try {
    const stored = storage.getItem(actualStorageKey);
    if (stored !== null) {
      storedValue = JSON.parse(stored);
    } else if (initialValue !== undefined) {
      storage.setItem(actualStorageKey, JSON.stringify(initialValue));
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(
      `[withPersistentState] Failed to load stored state for "${key}":`,
      error
    );
  }

  // @ts-ignore
  const state = withGlobalState<T>(scene, key, storedValue);

  // Save to localStorage on changes
  state.on('change', (newValue: unknown) => {
    try {
      const storage = storageType === 'local' ? localStorage : sessionStorage;
      storage.setItem(actualStorageKey, JSON.stringify(newValue));
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
