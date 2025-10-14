/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable max-lines-per-function */
import * as Phaser from 'phaser';

import {
  logStateInit,
  logStateGet,
  logStateSet,
  logEventListenerAdd,
  logEventListenerRemove,
  logClearListeners,
  logError,
  logWarning,
} from '../utils/logger';

import { type HookState, type StateChangeCallback } from './type';

/**
 * Configuration options for state definition
 * @typedef {Object} StateDefOptions
 * @property {boolean} [persistent] Whether to persist state across scene changes. @default true
 * @property {(value: unknown) => boolean | string} [validator] Custom validator function for state values. Returns true if valid, false or error message if invalid.
 * @property {boolean} [debug] Whether to enable debug logging for this state. @default false
 * @property {boolean} [global] Whether to use global state. @default false
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

  /**
   * Whether to use global state
   * @default false
   */
  global?: boolean;
};

/**
 * Gets the current value for a given key from the registry.
 * @template T
 * @param {Phaser.Data.DataManager} registry - The Phaser data manager (scene.data or scene.registry)
 * @param {string} key - The key to retrieve
 * @param {boolean} debug - Whether to log debug info
 * @returns {T} The value stored in the registry for the given key
 */
const get = <T>(
  registry: Phaser.Data.DataManager,
  key: string,
  debug: boolean
): T => {
  const value = registry.get(key) as T;

  if (debug) {
    logStateGet(key, value);
  }

  return value;
};

/**
 * Sets a new state value in the registry.
 * @template T
 * @param {Phaser.Data.DataManager} registry - The Phaser data manager
 * @param {string} key - The key to set
 * @param {T | ((currentValue: T) => T)} value - The value to set, or a function that receives the current value and returns the new value
 * @param {boolean} debug - Whether to log debug info
 * @param {(value: unknown) => boolean | string} [validator] - Optional validator function
 * @throws {Error} If the validator returns false or an error message
 */
const set = <T>(
  registry: Phaser.Data.DataManager,
  key: string,
  value: T | ((currentValue: T) => T),
  debug: boolean,
  validator?: (value: unknown) => boolean | string
): void => {
  const oldValue = registry.get(key) as T;
  const newValue = typeof value === 'function' ? (value as (currentValue: T) => T)(oldValue) : value;

  if (validator) {
    const validationResult = validator(newValue);
    if (validationResult !== true) {
      const message =
        typeof validationResult === 'string'
          ? validationResult
          : `Invalid value for key "${key}"`;
      throw new Error(`[withStateDef] ${message}`);
    }
  }

  registry.set(key, newValue);

  if (debug) {
    logStateSet(key, oldValue, newValue);
  }
};

/**
 * Registers a change listener for this state (DEPRECATED).
 * @template T
 * @param {Phaser.Data.DataManager} registry - The Phaser data manager
 * @param {string} key - The key to listen for changes
 * @param {boolean} debug - Whether to log debug info
 * @param {StateChangeCallback<T>} callback - Callback to invoke on change
 * @deprecated Use .on('change', callback) or .once('change', callback) instead.
 * @throws {Error} If callback is not a function
 */
const onChange = <T>(
  registry: Phaser.Data.DataManager,
  key: string,
  debug: boolean,
  callback: StateChangeCallback<T>
): void => {
  logWarning(
    'DEPRECATED_ONCHANGE',
    "onChange callback is deprecated in phaser-hooks. Use .on('change', callback) or .once('change', callback) instead.",
    { key }
  );

  if (!callback || typeof callback !== 'function') {
    throw new Error('[withStateDef] onChange callback must be a function');
  }

  registry.events.on(
    `changedata-${key}`, // reserved word in Phaser
    (_parent: unknown, key: string, value: T, previousValue: T) => {
      if (debug) {
        logStateSet(key, previousValue, value);
      }

      try {
        callback(value, previousValue);
      } catch (error) {
        logError('ONCHANGE_CALLBACK_ERROR', error as Error, { key });
      }
    }
  );
};

/**
 * Registers an event listener for the state.
 * Only the 'change' event is supported.
 * @param {Phaser.Data.DataManager} registry - The Phaser data manager
 * @param {string | symbol} event - The event name ('change')
 * @param {string} key - The key to listen for changes
 * @param {boolean} debug - Whether to log debug info
 * @param {Function} callback - The callback to invoke on event
 * @returns {() => void} Unsubscribe function to remove the listener
 * @throws {Error} If event is not 'change'
 */
const on = (
  registry: Phaser.Data.DataManager,
  event: string | symbol,
  key: string,
  debug: boolean,
  callback: Function
): (() => void) => {
  if (event !== 'change') {
    throw new Error(
      '[withStateDef] Invalid event. Only "change" is supported.'
    );
  }

  if (debug) {
    logEventListenerAdd(key, event as string, callback);
  }
  registry.events.on(`changedata-${key}`, callback);

  return () => {
    if (debug) {
      logEventListenerRemove(key, event as string, callback);
    }
    registry.events.off(`changedata-${key}`, callback);
  };
};

/**
 * Validates the scene and options for the state hook.
 * @param {Phaser.Scene} scene - The Phaser scene
 * @param {StateDefOptions} options - State definition options
 * @throws {Error} If scene or registry/data is not available
 */
const validateHook = (
  scene: Phaser.Scene,
  options: StateDefOptions,
  key: string
): void => {
  if (!scene) {
    throw new Error('[withStateDef] Scene parameter is required');
  }

  if (!key || typeof key !== 'string' || key.trim().length === 0) {
    throw new Error('[withStateDef] Key must be a non-empty string');
  }

  if (options.global && !scene.registry) {
    throw new Error(
      '[withStateDef] Scene registry is not available. Ensure the scene is properly initialized.'
    );
  } else if (!options.global && !scene.data) {
    throw new Error(
      '[withStateDef] Scene data is not available. Ensure the scene is properly initialized.'
    );
  }
};

/**
 * Initializes the state in the registry if not already set.
 * @template T
 * @param {Phaser.Data.DataManager} registry - The Phaser data manager
 * @param {string} key - The key to initialize
 * @param {T} [initialValue] - The initial value to set
 * @param {boolean} debug - Whether to log debug info
 * @param {(value: unknown) => boolean | string} [validator] - Optional validator function
 * @throws {Error} If the validator returns false or an error message
 */
const initializeState = <T>(
  registry: Phaser.Data.DataManager,
  key: string,
  debug: boolean,
  validator?: (value: unknown) => boolean | string,
  initialValue?: T
): void => {
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
      logStateInit(key, initialValue);
    }
  }
};

/**
 * Registers a one-time event listener for the state.
 * Only the 'change' event is supported.
 * @param {Phaser.Data.DataManager} registry - The Phaser data manager
 * @param {string | symbol} event - The event name ('change')
 * @param {string} key - The key to listen for changes
 * @param {boolean} debug - Whether to log debug info
 * @param {Function} callback - The callback to invoke on event
 * @returns {() => void} Unsubscribe function to remove the listener
 * @throws {Error} If event is not 'change'
 */
const once = (
  registry: Phaser.Data.DataManager,
  event: string | symbol,
  key: string,
  debug: boolean,
  callback: Function
): (() => void) => {
  if (event !== 'change') {
    throw new Error(
      '[withStateDef] Invalid event. Only "change" is supported.'
    );
  }

  if (debug) {
    logEventListenerAdd(key, event as string, callback);
  }
  registry.events.once(`changedata-${key}`, callback);

  return () => {
    if (debug) {
      logEventListenerRemove(key, event as string, callback);
    }
    registry.events.off(`changedata-${key}`, callback);
  };
};

/**
 * Removes an event listener for the state.
 * Only the 'change' event is supported.
 * @param {Phaser.Data.DataManager} registry - The Phaser data manager
 * @param {string | symbol} event - The event name ('change')
 * @param {string} key - The key to remove the listener from
 * @param {boolean} debug - Whether to log debug info
 * @param {Function} callback - The callback to remove
 * @throws {Error} If event is not 'change'
 */
const off = (
  registry: Phaser.Data.DataManager,
  event: string | symbol,
  key: string,
  debug: boolean,
  callback: Function
): void => {
  if (event !== 'change') {
    throw new Error(
      '[withStateDef] Invalid event. Only "change" is supported.'
    );
  }

  registry.events.off(`changedata-${key}`, callback);

  if (debug) {
    logEventListenerRemove(key, event as string, callback);
  }
};

/**
 * Removes all event listeners for the state.
 * @param {Phaser.Data.DataManager} registry - The Phaser data manager
 * @param {string} key - The key to remove all listeners from
 * @param {boolean} debug - Whether to log debug info
 */
const clearListeners = (
  registry: Phaser.Data.DataManager,
  key: string,
  debug: boolean
): void => {
  registry.events.removeAllListeners(`changedata-${key}`);

  if (debug) {
    logClearListeners(key);
  }
};

/**
 * Partially updates an object state by merging with current value.
 * @template T
 * @param {Phaser.Data.DataManager} registry - The Phaser data manager
 * @param {string} key - The key to update
 * @param {Partial<T>} partial - Partial object to merge
 * @param {boolean} debug - Whether to log debug info
 * @param {(value: unknown) => boolean | string} [validator] - Optional validator function
 * @throws {Error} If the current state is not an object
 * @throws {Error} If the validator returns false or an error message
 */
const patch = <T>(
  registry: Phaser.Data.DataManager,
  key: string,
  partial: Partial<T>,
  debug: boolean,
  validator?: (value: unknown) => boolean | string
): void => {
  const currentValue = get<T>(registry, key, debug);

  // Validate that current value is an object
  if (
    typeof currentValue !== 'object' ||
    currentValue === null ||
    Array.isArray(currentValue)
  ) {
    throw new Error(
      `[withStateDef] patch() can only be used with object states. Current value type: ${typeof currentValue}`
    );
  }

  // Merge current value with partial
  const newValue = { ...currentValue, ...partial };
  set<T>(registry, key, newValue, debug, validator);
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
 * @param {Phaser.Scene} scene The Phaser scene instance that owns this state
 * @param {string} key Unique identifier for the state in the registry
 * @param {T} [initialValue] Optional initial value to set if key doesn't exist
 * @param {StateDefOptions} [options] Optional configuration for state behavior
 * @returns {HookState<T>} HookState interface for managing the state
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
 *
 * // Setting based on current value
 * const counter = withStateDef<number>(scene, 'counter', 0);
 * counter.set(current => current + 1); // Increment by 1
 * 
 * // Partial update for object states
 * const player = withStateDef<{name: string, items: number}>(
 *   scene,
 *   'player',
 *   { name: 'someone', items: 10 }
 * );
 * player.patch({ items: 11 }); // Only updates items, keeps name
 * 
 * // Listening to changes
 * playerState.on('change', (parent, key, newValue, oldValue) => {
 *   console.log('Player state changed:', newValue, oldValue);
 * });
 *
 * // Listening to changes only once
 * playerState.once('change', (parent, key, newValue, oldValue) => {
 *   console.log('Player state changed once:', newValue, oldValue);
 * });
 *
 * // Removing a listener
 * const unsubscribe = playerState.on('change', callback);
 * unsubscribe(); // Removes the listener
 * playerState.off('change', callback); // Also removes the listener
 * playerState.clearListeners(); // Removes all listeners
 * ```
 *
 * @method get Gets the current state value
 * @method set Sets a new state value (or uses a function to compute it from current value) and triggers change listeners
 * @method patch Partially updates an object state by merging with current value
 * @method on Registers a callback to be called whenever the state changes. Returns an unsubscribe function.
 * @method once Registers a callback to be called once when the state changes. Returns an unsubscribe function.
 * @method off Removes an event listener for the state
 * @method clearListeners Removes all event listeners for this state
 * @method onChange (DEPRECATED) Registers a callback to be called whenever the state changes
 */
export const withStateDef = <T>(
  scene: Phaser.Scene,
  key: string,
  initialValue?: T,
  options: StateDefOptions = {}
): HookState<T> => {
  validateHook(scene, options, key);

  const { validator, debug = false, global = false } = options;
  const registry = global ? scene.registry : scene.data;

  // Fix: move debug and validator before initialValue to match required params before optional
  initializeState(registry, key, debug, validator, initialValue);

  return {
    /**
     * Gets the current state value.
     * @returns {T}
     */
    get: () => get<T>(registry, key, debug),
    /**
     * Sets a new state value and triggers change listeners.
     * @param {T | ((currentValue: T) => T)} value - The new value to set, or a function that receives the current value and returns the new value
     */
    set: (value: T | ((currentValue: T) => T)) => set<T>(registry, key, value, debug, validator),
    /**
     * Partially updates the state (only works when T is an object).
     * @param {Partial<T>} partial - Partial object to merge with current state
     * @throws {Error} If the current state is not an object
     */
    patch: (partial: Partial<T>) => patch<T>(registry, key, partial, debug, validator),
    /**
     * Registers a callback to be called whenever the state changes (DEPRECATED).
     * @param {StateChangeCallback<T>} callback
     */
    onChange: (callback: StateChangeCallback<T>) =>
      onChange<T>(registry, key, debug, callback),
    /**
     * Registers a callback to be called whenever the state changes.
     * Only the 'change' event is supported.
     * @param {'change'} event
     * @param {Function} fn - Callback receives: (parent, key, newValue, oldValue)
     * @returns {() => void} Unsubscribe function
     */
    on: (event: string | symbol, fn: Function) =>
      on(registry, event, key, debug, fn),
    /**
     * Registers a callback to be called once when the state changes.
     * Only the 'change' event is supported.
     * @param {'change'} event
     * @param {Function} fn - Callback receives: (parent, key, newValue, oldValue)
     * @returns {() => void} Unsubscribe function
     */
    once: (event: string | symbol, fn: Function) =>
      once(registry, event, key, debug, fn),
    /**
     * Removes an event listener for the state.
     * Only the 'change' event is supported.
     * @param {'change'} event
     * @param {Function} fn - Callback receives: (parent, key, newValue, oldValue)
     */
    off: (event: string | symbol, fn: Function) =>
      off(registry, event, key, debug, fn),
    /**
     * Removes all event listeners for this state.
     */
    clearListeners: () => clearListeners(registry, key, debug),
  };
};
