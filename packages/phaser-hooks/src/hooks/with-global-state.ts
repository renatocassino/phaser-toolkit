import { type HookState, type StateChangeCallback } from './type';

/**
 * Global state manager singleton.
 * Manages application-wide state without dependency on specific scenes.
 */
class GlobalState {
  private static registry = new Map<string, unknown>();
  private static listeners = new Map<
    string,
    Set<StateChangeCallback<unknown>>
  >();

  /**
   * Set a value in the global state
   */
  static set<T>(key: string, value: T): void {
    const oldValue = this.registry.get(key);
    this.registry.set(key, value);

    // Trigger callbacks
    const callbacks = this.listeners.get(key);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(value, oldValue);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(
            `[GlobalState] Error in onChange callback for "${key}":`,
            error
          );
        }
      });
    }
  }

  /**
   * Get a value from the global state
   */
  static get<T>(key: string, defaultValue?: T): T | undefined {
    return this.registry.has(key)
      ? (this.registry.get(key) as T)
      : defaultValue;
  }

  /**
   * Check if a key exists in the global state
   */
  static has(key: string): boolean {
    return this.registry.has(key);
  }

  /**
   * Register a callback for when a specific key changes
   */
  static onChange<T>(key: string, callback: StateChangeCallback<T>): void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)?.add(callback as StateChangeCallback<unknown>);
  }

  /**
   * Remove a callback for a specific key
   */
  static offChange<T>(key: string, callback: StateChangeCallback<T>): void {
    const callbacks = this.listeners.get(key);
    if (callbacks) {
      callbacks.delete(callback as StateChangeCallback<unknown>);
      if (callbacks.size === 0) {
        this.listeners.delete(key);
      }
    }
  }

  /**
   * Clear all global state (useful for testing or resetting game)
   */
  static clear(): void {
    this.registry.clear();
    this.listeners.clear();
  }

  /**
   * Get all keys in the global state
   */
  static keys(): string[] {
    return Array.from(this.registry.keys());
  }

  /**
   * Get debug information about the global state
   */
  static debug(): {
    registry: Record<string, unknown>;
    listeners: Record<string, number>;
  } {
    const debugRegistry: Record<string, unknown> = {};
    const debugListeners: Record<string, number> = {};

    this.registry.forEach((value, key) => {
      debugRegistry[key] = value;
    });

    this.listeners.forEach((callbacks, key) => {
      debugListeners[key] = callbacks.size;
    });

    return { registry: debugRegistry, listeners: debugListeners };
  }
}

/**
 * Configuration for global state management
 */
export type GlobalStateOptions = {
  /**
   * Validator function to validate state values
   */
  validator?: (value: unknown) => boolean | string;

  /**
   * Enable debug logging
   */
  debug?: boolean;
};

/**
 * Creates a global state hook that persists across all scenes in the game.
 * Global state is managed by a singleton registry, removing dependency on specific scenes.
 * Perfect for user settings, game progress, authentication state, or any data that
 * should persist throughout the game session.
 *
 * @template T The type of the state value
 * @param scene Phaser scene instance (kept for API compatibility, not used internally)
 * @param key Unique identifier for the global state
 * @param initialValue Optional initial value to set if state doesn't exist
 * @param options Optional configuration for validation and debugging
 * @returns HookState interface for managing the global state
 *
 * @throws {Error} When key is invalid
 * @throws {Error} When validator rejects the initial value
 *
 * @example
 * ```typescript
 * // User settings that persist across scenes
 * interface UserSettings {
 *   soundVolume: number;
 *   musicEnabled: boolean;
 *   difficulty: 'easy' | 'normal' | 'hard';
 * }
 *
 * const settingsState = withGlobalState<UserSettings>(scene, 'settings', {
 *   soundVolume: 0.8,
 *   musicEnabled: true,
 *   difficulty: 'normal'
 * });
 *
 * // Game progress
 * interface GameProgress {
 *   currentLevel: number;
 *   unlockedLevels: number[];
 *   totalScore: number;
 * }
 *
 * const progressState = withGlobalState<GameProgress>(scene, 'progress', {
 *   currentLevel: 1,
 *   unlockedLevels: [1],
 *   totalScore: 0
 * });
 *
 * // Listen to changes globally
 * progressState.onChange((newProgress, oldProgress) => {
 *   console.log('Game progress updated:', newProgress);
 *   // Could trigger achievements, save to localStorage, etc.
 * });
 * ```
 *
 * @example
 * ```typescript
 * // With validation
 * const scoreState = withGlobalState<number>(scene, 'score', 0, {
 *   validator: (value) => {
 *     if (typeof value !== 'number' || value < 0) {
 *       return 'Score must be a positive number';
 *     }
 *     return true;
 *   },
 *   debug: true
 * });
 *
 * // Authentication state example
 * interface AuthState {
 *   isLoggedIn: boolean;
 *   username: string | null;
 *   token: string | null;
 * }
 *
 * const authState = withGlobalState<AuthState>(scene, 'auth', {
 *   isLoggedIn: false,
 *   username: null,
 *   token: null
 * });
 *
 * // Use from any scene - no dependency on Boot scene!
 * if (authState.get().isLoggedIn) {
 *   // Show authenticated content
 * }
 * ```
 *
 * @see {@link withLocalState} For scene-specific state
 * @see {@link withStateDef} For low-level state management
 */
/* eslint-disable max-lines-per-function */
/* eslint-disable complexity */
/* eslint-disable sonarjs/cognitive-complexity */
export const withGlobalState = <T = unknown>(
  key: string,
  initialValue?: T,
  options: GlobalStateOptions = {}
): HookState<T> => {
  if (!key || typeof key !== 'string' || key.trim().length === 0) {
    throw new Error('[withGlobalState] Key must be a non-empty string');
  }

  const { validator, debug } = options;

  // Prefix the key to indicate it's global state
  const globalKey = `global:${key}`;

  // Initialize value if it doesn't exist
  if (!GlobalState.has(globalKey) && initialValue !== undefined) {
    if (validator) {
      const validationResult = validator(initialValue);
      if (validationResult !== true) {
        throw new Error(
          `[withGlobalState] ${validationResult || 'Invalid initial value'}`
        );
      }
    }

    GlobalState.set(globalKey, initialValue);

    if (debug) {
      // eslint-disable-next-line no-console
      console.debug(
        `[withGlobalState] Initialized "${key}" with value:`,
        initialValue
      );
    }
  }

  return {
    get: (): T => {
      const value = GlobalState.get<T>(globalKey);

      if (debug) {
        // eslint-disable-next-line no-console
        console.debug(`[withGlobalState] Getting "${key}":`, value);
      }

      return value ?? (initialValue as T);
    },

    set: (value: T): void => {
      if (validator) {
        const validationResult = validator(value);
        if (validationResult !== true) {
          throw new Error(
            `[withGlobalState] Invalid value for key "${key}": ${validationResult}`
          );
        }
      }

      if (debug) {
        const oldValue = GlobalState.get<T>(globalKey);
        // eslint-disable-next-line no-console
        console.debug(`[withGlobalState] Setting "${key}":`, {
          oldValue,
          newValue: value,
        });
      }

      GlobalState.set(globalKey, value);
    },

    onChange: (callback: StateChangeCallback<T>): void => {
      if (typeof callback !== 'function') {
        throw new Error(
          '[withGlobalState] onChange callback must be a function'
        );
      }

      GlobalState.onChange(globalKey, callback);
    },
  };
};

/**
 * Export the GlobalState class for advanced use cases
 * (testing, debugging, manual state management)
 */
export { GlobalState };
