import * as Phaser from 'phaser';

import { type HookState, type StateChangeCallback } from './type';

/**
 * Configuration options for state definition
 */
export type StateDefOptions = {
  /**
   * Whether to persist state across scene changes
   * @default true
   */
  persistent?: boolean;

  /**
   * Custom validator function for state values
   * @param value The value to validate
   * @returns true if valid, false or error message if invalid
   */
  validator?: (value: unknown) => boolean | string;

  /**
   * Whether to enable debug logging for this state
   * @default false
   */
  debug?: boolean;
};

/**
 * Low-level state management hook that directly interfaces with Phaser's registry system.
 * This is the foundation for all other state hooks and provides direct access to
 * Phaser's scene registry with additional safety and TypeScript support.
 *
 * ⚠️ **Note**: This is a low-level hook. Consider using `withLocalState` or `withGlobalState`
 * for most use cases unless you need specific registry control.
 *
 * @template T The type of the state value
 * @param scene The Phaser scene instance that owns this state
 * @param key Unique identifier for the state in the registry
 * @param initialValue Optional initial value to set if key doesn't exist
 * @param options Optional configuration for state behavior
 * @returns HookState interface for managing the state
 *
 * @throws {Error} When scene or registry is not available
 * @throws {Error} When key is invalid (empty or non-string)
 * @throws {Error} When validator rejects the initial value
 *
 * @example
 * ```typescript
 * // Basic usage
 * const playerState = withStateDef<{name: string, level: number}>(
 *   scene,
 *   'player',
 *   { name: 'Player1', level: 1 }
 * );
 *
 * // With validation
 * const healthState = withStateDef<number>(
 *   scene,
 *   'health',
 *   100,
 *   {
 *     validator: (value) => {
 *       const health = value as number;
 *       return health >= 0 && health <= 100 ? true : 'Health must be between 0-100';
 *     }
 *   }
 * );
 *
 * // With debug logging
 * const debugState = withStateDef<string>(
 *   scene,
 *   'debug-info',
 *   'initial',
 *   { debug: true }
 * );
 * ```
 */
/* eslint-disable max-lines-per-function */
/* eslint-disable complexity */
/* eslint-disable sonarjs/cognitive-complexity */
export const withStateDef = <T>(
  scene: Phaser.Scene,
  key: string,
  initialValue?: T,
  options: StateDefOptions = {}
): HookState<T> => {
  if (!scene) {
    throw new Error('[withStateDef] Scene parameter is required');
  }

  if (!scene.registry) {
    throw new Error(
      '[withStateDef] Scene registry is not available. Ensure the scene is properly initialized.'
    );
  }

  if (!key || typeof key !== 'string' || key.trim().length === 0) {
    throw new Error('[withStateDef] Key must be a non-empty string');
  }

  const { validator, debug = false } = options;
  const registry = scene.registry;
  const eventKey = `changedata-${key}`;

  // Validate and set initial value if provided
  if (!registry.has(key) && initialValue !== undefined) {
    if (validator) {
      const validationResult = validator(initialValue);
      if (validationResult !== true) {
        const message =
          typeof validationResult === 'string'
            ? validationResult
            : `Invalid initial value for key "${key}"`;
        throw new Error(`[withStateDef] ${message}`);
      }
    }

    registry.set(key, initialValue);

    if (debug) {
      // eslint-disable-next-line no-console
      console.debug(
        `[withStateDef] Initialized "${key}" with value:`,
        initialValue
      );
    }
  }

  /**
   * Gets the current state value from the registry
   */
  const get = (): T => {
    const value = registry.get(key) as T;

    if (debug) {
      // eslint-disable-next-line no-console
      console.debug(`[withStateDef] Getting "${key}":`, value);
    }

    return value;
  };

  /**
   * Sets a new state value in the registry
   */
  const set = (value: T): void => {
    if (validator) {
      const validationResult = validator(value);
      if (validationResult !== true) {
        const message =
          typeof validationResult === 'string'
            ? validationResult
            : `Invalid value for key "${key}"`;
        throw new Error(`[withStateDef] ${message}`);
      }
    }

    const oldValue = registry.get(key) as T;
    registry.set(key, value);

    if (debug) {
      // eslint-disable-next-line no-console
      console.debug(`[withStateDef] Setting "${key}":`, {
        oldValue,
        newValue: value,
      });
    }
  };

  /**
   * Registers a change listener for this state
   */
  const onChange = (callback: StateChangeCallback<T>): void => {
    if (!callback || typeof callback !== 'function') {
      throw new Error('[withStateDef] onChange callback must be a function');
    }

    registry.events.on(
      eventKey,
      (parent: unknown, key: string, value: T, previousValue: T) => {
        if (debug) {
          // eslint-disable-next-line no-console
          console.debug(`[withStateDef] Change detected for "${key}":`, {
            previousValue,
            value,
          });
        }

        try {
          callback(value, previousValue);
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(
            `[withStateDef] Error in onChange callback for "${key}":`,
            error
          );
        }
      }
    );
  };

  return {
    get,
    set,
    onChange,
  };
};
