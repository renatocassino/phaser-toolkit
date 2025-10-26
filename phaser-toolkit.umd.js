(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('lodash.merge'), require('phaser'), require('webfontloader')) :
    typeof define === 'function' && define.amd ? define(['exports', 'lodash.merge', 'phaser', 'webfontloader'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.PhaserToolkit = {}, global._.merge, global.Phaser, global.WebFont));
})(this, (function (exports, merge, Phaser$1, WebFont) { 'use strict';

    function _interopNamespaceDefault(e) {
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () { return e[k]; }
                    });
                }
            });
        }
        n.default = e;
        return Object.freeze(n);
    }

    var Phaser__namespace = /*#__PURE__*/_interopNamespaceDefault(Phaser$1);

    /**
     * Utility to batch multiple state updates
     * @param updateFn Function that performs multiple state updates
     *
     * @example
     * ```typescript
     * batchStateUpdates(() => {
     *   playerState.set({...playerState.get(), hp: 90});
     *   inventoryState.set([...inventoryState.get(), 'new-item']);
     *   scoreState.set(scoreState.get() + 100);
     * });
     * ```
     */
    const batchStateUpdates = (updateFn) => {
        // Note: This is a placeholder for potential batching optimization
        // In a more advanced implementation, you might collect all updates
        // and apply them in a single registry update
        updateFn();
    };

    /**
     * Creates a state validator function for common patterns
     */
    const validators = {
        /**
         * Validates that a number is within a range
         */
        numberRange: (min, max) => (value) => {
            const num = value;
            if (typeof num !== 'number' || Number.isNaN(num)) {
                return 'Value must be a number';
            }
            if (num < min || num > max) {
                return `Value must be between ${min} and ${max}`;
            }
            return true;
        },
        /**
         * Validates that a string is not empty
         */
        nonEmptyString: (value) => {
            const str = value;
            if (typeof str !== 'string' || str.trim().length === 0) {
                return 'Value must be a non-empty string';
            }
            return true;
        },
        /**
         * Validates that an array has a specific length range
         */
        arrayLength: (min, max) => (value) => {
            const arr = value;
            if (!Array.isArray(arr)) {
                return 'Value must be an array';
            }
            if (arr.length < min) {
                return `Array must have at least ${min} items`;
            }
            if (max !== undefined && arr.length > max) {
                return `Array must have at most ${max} items`;
            }
            return true;
        },
        /**
         * Validates that a value is one of the allowed options
         */
        oneOf: (allowedValues) => (value) => {
            if (!allowedValues.includes(value)) {
                return `Value must be one of: ${allowedValues.join(', ')}`;
            }
            return true;
        },
    };

    /* eslint-disable no-console */
    /* eslint-disable sonarjs/no-duplicate-string */
    /**
     * Professional logging utility for phaser-hooks
     * Provides structured, searchable logs with datetime and library identification
     */
    /**
     * Formats datetime for consistent logging
     */
    const formatDateTime = () => {
        const now = new Date();
        return now.toISOString().replace('T', ' ').replace('Z', '');
    };
    /**
     * Creates a searchable prefix for phaser-hooks logs with colors
     */
    const createLogPrefix = (operation) => {
        const timestamp = formatDateTime();
        const libName = '%c[phaser-hooks]%c'; // Blue color for library name
        const operationStr = operation ? ` %c${operation}%c` : '';
        return `%c[${timestamp}]%c ${libName}${operationStr}`;
    };
    /**
     * Creates CSS styles for the colored prefix
     */
    const createLogStyles = (operation) => {
        const styles = [
            'color: #bd93f9; font-weight: bold;', // Dracula purple for timestamp
            'color: inherit;', // Reset after timestamp
            'color: #2563eb; font-weight: bold;', // Blue for [phaser-hooks]
            'color: inherit;', // Reset after library name
        ];
        if (operation) {
            styles.push('color: #059669; font-weight: bold;', // Green for operation
            'color: inherit;' // Reset after operation
            );
        }
        return styles;
    };
    /**
     * Log state initialization
     */
    const logStateInit = (key, initialValue) => {
        const prefix = createLogPrefix('STATE_INIT');
        const styles = createLogStyles('STATE_INIT');
        console.groupCollapsed(`${prefix} Initializing state "${key}"`, ...styles);
        console.log('🔧 Key:', key);
        console.log('📦 Initial Value:', initialValue);
        console.log('⏰ Timestamp:', formatDateTime());
        console.groupEnd();
    };
    /**
     * Log state value retrieval
     */
    const logStateGet = (key, value) => {
        const prefix = createLogPrefix('STATE_GET');
        const styles = createLogStyles('STATE_GET');
        console.log(`${prefix} Getting state "${key}":`, ...styles, value);
    };
    /**
     * Log state value update
     */
    const logStateSet = (key, oldValue, newValue) => {
        const prefix = createLogPrefix('STATE_SET');
        const styles = createLogStyles('STATE_SET');
        console.groupCollapsed(`${prefix} Updating state "${key}"`, ...styles);
        console.log('🔑 Key:', key);
        console.log('📤 Old Value:', oldValue);
        console.log('📥 New Value:', newValue);
        console.log('🔄 Changed:', oldValue !== newValue);
        console.log('⏰ Timestamp:', formatDateTime());
        console.groupEnd();
    };
    /**
     * Log event listener registration
     */
    const logEventListenerAdd = (key, event, callback) => {
        const prefix = createLogPrefix('EVENT_ADD');
        const styles = createLogStyles('EVENT_ADD');
        console.groupCollapsed(`${prefix} Adding listener for "${key}"`, ...styles);
        console.log('🔑 Key:', key);
        console.log('📡 Event:', event);
        console.log('🎯 Callback:', callback.name || 'anonymous');
        console.log('⏰ Timestamp:', formatDateTime());
        console.groupEnd();
    };
    /**
     * Log event listener removal
     */
    const logEventListenerRemove = (key, event, callback) => {
        const prefix = createLogPrefix('EVENT_REMOVE');
        const styles = createLogStyles('EVENT_REMOVE');
        console.groupCollapsed(`${prefix} Removing listener for "${key}"`, ...styles);
        console.log('🔑 Key:', key);
        console.log('📡 Event:', event);
        console.log('🎯 Callback:', callback.name || 'anonymous');
        console.log('⏰ Timestamp:', formatDateTime());
        console.groupEnd();
    };
    /**
     * Log clearing all listeners
     */
    const logClearListeners = (key) => {
        const prefix = createLogPrefix('CLEAR_LISTENERS');
        const styles = createLogStyles('CLEAR_LISTENERS');
        console.groupCollapsed(`${prefix} Clearing all listeners for "${key}"`, ...styles);
        console.log('🔑 Key:', key);
        console.log('🧹 Action:', 'Removing all event listeners');
        console.log('⏰ Timestamp:', formatDateTime());
        console.groupEnd();
    };
    /**
     * Log error with context
     */
    const logError = (operation, error, context) => {
        const prefix = createLogPrefix(operation);
        const styles = createLogStyles(operation);
        console.groupCollapsed(`${prefix} ERROR`, ...styles);
        console.error('🚨 Operation:', operation);
        console.error('💥 Error:', error);
        if (context) {
            console.error('📋 Context:', context);
        }
        console.error('⏰ Timestamp:', formatDateTime());
        console.groupEnd();
    };
    /**
     * Log warning with context
     */
    const logWarning = (operation, message, context) => {
        const prefix = createLogPrefix(operation);
        const styles = createLogStyles(operation);
        console.groupCollapsed(`${prefix} WARNING`, ...styles);
        console.warn('⚠️ Operation:', operation);
        console.warn('📢 Message:', message);
        if (context) {
            console.warn('📋 Context:', context);
        }
        console.warn('⏰ Timestamp:', formatDateTime());
        console.groupEnd();
    };

    /* eslint-disable sonarjs/no-duplicate-string */
    /* eslint-disable max-lines-per-function */
    /**
     * Gets the current value for a given key from the registry.
     * @template T
     * @param {Phaser.Data.DataManager} registry - The Phaser data manager (scene.data or scene.registry)
     * @param {string} key - The key to retrieve
     * @param {boolean} debug - Whether to log debug info
     * @returns {T} The value stored in the registry for the given key
     */
    const get = (registry, key, debug) => {
        const value = registry.get(key);
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
     * @param {T | ((currentState: T) => T)} value - The value to set or a function that receives current state and returns new state
     * @param {boolean} debug - Whether to log debug info
     * @param {(value: unknown) => boolean | string} [validator] - Optional validator function
     * @throws {Error} If the validator returns false or an error message
     */
    const set = (registry, key, value, debug, validator) => {
        const currentValue = registry.get(key);
        // If value is a function, execute it with current state
        const newValue = typeof value === 'function' ? value(currentValue) : value;
        if (validator) {
            const validationResult = validator(newValue);
            if (validationResult !== true) {
                const message = typeof validationResult === 'string'
                    ? validationResult
                    : `Invalid value for key "${key}"`;
                throw new Error(`[withStateDef] ${message}`);
            }
        }
        registry.set(key, newValue);
        if (debug) {
            logStateSet(key, currentValue, newValue);
        }
    };
    /**
     * Applies a shallow merge ("patch") to an object state in the registry.
     *
     * This method attempts to update the current state associated with the given key by performing a shallow merge
     * between the existing state and the provided value or the result of an updater function.
     * The function will throw an error if the current state is not an object.
     * An optional validator function can be provided to ensure the new value is valid before committing the patch.
     *
     * @template T
     * @param {Phaser.Data.DataManager} registry - The Phaser data manager
     * @param {string} key - The key to patch in the registry
     * @param {T | ((currentState: T) => T)} value - The value object to merge, or a function that returns a value given the current state
     * @param {boolean} debug - Whether to enable debug logging
     * @param {(value: unknown) => boolean | string} [validator] - Optional validator function; must return true or an error message
     * @throws {Error} If the current value is not an object or the validator returns false/an error message
     */
    const patch = (registry, key, value, debug, validator) => {
        const currentValue = registry.get(key);
        if (typeof currentValue !== 'object' || currentValue === null) {
            throw new Error('[withStateDef] Current value is not an object');
        }
        // If value is a function, execute it with current state to get the patch
        const patchValue = typeof value === 'function' ? value(currentValue) : value;
        const newValue = merge({}, currentValue, patchValue);
        if (validator) {
            const validationResult = validator(newValue);
            if (validationResult !== true) {
                const message = typeof validationResult === 'string'
                    ? validationResult
                    : `Invalid value for key "${key}"`;
                throw new Error(`[withStateDef] ${message}`);
            }
        }
        registry.set(key, newValue);
        if (debug) {
            logStateSet(key, currentValue, newValue);
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
    const onChange = (registry, key, debug, callback) => {
        logWarning('DEPRECATED_ONCHANGE', "onChange callback is deprecated in phaser-hooks. Use .on('change', callback) or .once('change', callback) instead.", { key });
        if (!callback || typeof callback !== 'function') {
            throw new Error('[withStateDef] onChange callback must be a function');
        }
        registry.events.on(`changedata-${key}`, // reserved word in Phaser
        (_parent, key, value, previousValue) => {
            if (debug) {
                logStateSet(key, previousValue, value);
            }
            try {
                callback(value, previousValue);
            }
            catch (error) {
                logError('ONCHANGE_CALLBACK_ERROR', error, { key });
            }
        });
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
    const on = (registry, event, key, debug, callback) => {
        if (event !== 'change') {
            throw new Error('[withStateDef] Invalid event. Only "change" is supported.');
        }
        if (debug) {
            logEventListenerAdd(key, event, callback);
        }
        registry.events.on(`changedata-${key}`, callback);
        return () => {
            if (debug) {
                logEventListenerRemove(key, event, callback);
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
    const validateHook = (scene, options, key) => {
        if (!scene) {
            throw new Error('[withStateDef] Scene parameter is required');
        }
        if (!key || typeof key !== 'string' || key.trim().length === 0) {
            throw new Error('[withStateDef] Key must be a non-empty string');
        }
        if (options.global && !scene.registry) {
            throw new Error('[withStateDef] Scene registry is not available. Ensure the scene is properly initialized.');
        }
        else if (!options.global && !scene.data) {
            throw new Error('[withStateDef] Scene data is not available. Ensure the scene is properly initialized.');
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
    const initializeState = (registry, key, debug, validator, initialValue) => {
        // Validate and set initial value if provided
        if (!registry.has(key) && initialValue !== undefined) {
            if (validator) {
                const validationResult = validator(initialValue);
                if (validationResult !== true) {
                    const message = typeof validationResult === 'string'
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
    const once = (registry, event, key, debug, callback) => {
        if (event !== 'change') {
            throw new Error('[withStateDef] Invalid event. Only "change" is supported.');
        }
        if (debug) {
            logEventListenerAdd(key, event, callback);
        }
        registry.events.once(`changedata-${key}`, callback);
        return () => {
            if (debug) {
                logEventListenerRemove(key, event, callback);
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
    const off = (registry, event, key, debug, callback) => {
        if (event !== 'change') {
            throw new Error('[withStateDef] Invalid event. Only "change" is supported.');
        }
        registry.events.off(`changedata-${key}`, callback);
        if (debug) {
            logEventListenerRemove(key, event, callback);
        }
    };
    /**
     * Removes all event listeners for the state.
     * @param {Phaser.Data.DataManager} registry - The Phaser data manager
     * @param {string} key - The key to remove all listeners from
     * @param {boolean} debug - Whether to log debug info
     */
    const clearListeners = (registry, key, debug) => {
        registry.events.removeAllListeners(`changedata-${key}`);
        if (debug) {
            logClearListeners(key);
        }
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
     * // Setting values directly
     * playerState.set({ name: 'Player2', level: 5 });
     *
     * // Setting values using updater function
     * playerState.set((currentState) => ({ ...currentState, level: currentState.level + 1 }));
     *
     * // Listening to changes
     * playerState.on('change', (newValue, oldValue) => {
     *   console.log('Player state changed:', newValue, oldValue);
     * });
     *
     * // Listening to changes only once
     * playerState.once('change', (newValue, oldValue) => {
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
     * @method set Sets a new state value and triggers change listeners
     * @method on Registers a callback to be called whenever the state changes. Returns an unsubscribe function.
     * @method once Registers a callback to be called once when the state changes. Returns an unsubscribe function.
     * @method off Removes an event listener for the state
     * @method clearListeners Removes all event listeners for this state
     * @method onChange (DEPRECATED) Registers a callback to be called whenever the state changes
     */
    const withStateDef = (scene, key, initialValue, options = {}) => {
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
            get: () => get(registry, key, debug),
            /**
             * Sets a new state value and triggers change listeners.
             * @param {T | ((currentState: T) => T)} value - The new value to set or a function that receives current state and returns new state
             */
            set: (value) => set(registry, key, value, debug, validator),
            /**
             * Patches the current state value with a new value.
             * @param {DeepPartial<T> | StatePatchUpdater<T>} value - The new value to patch or a function that receives current state and returns new state
             */
            patch: (value) => patch(registry, key, value, debug, validator),
            /**
             * Registers a callback to be called whenever the state changes (DEPRECATED).
             * @param {StateChangeCallback<T>} callback
             */
            onChange: (callback) => onChange(registry, key, debug, callback),
            /**
             * Registers a callback to be called whenever the state changes.
             * Only the 'change' event is supported.
             * @param {'change'} event
             * @param {Function} fn
             * @returns {() => void} Unsubscribe function
             */
            on: (event, fn) => on(registry, event, key, debug, fn),
            /**
             * Registers a callback to be called once when the state changes.
             * Only the 'change' event is supported.
             * @param {'change'} event
             * @param {Function} fn
             * @returns {() => void} Unsubscribe function
             */
            once: (event, fn) => once(registry, event, key, debug, fn),
            /**
             * Removes an event listener for the state.
             * Only the 'change' event is supported.
             * @param {'change'} event
             * @param {Function} fn
             */
            off: (event, fn) => off(registry, event, key, debug, fn),
            /**
             * Removes all event listeners for this state.
             */
            clearListeners: () => clearListeners(registry, key, debug),
        };
    };

    /**
     * Creates a local state hook scoped to a specific Phaser scene.
     * Local state is isolated to the scene instance and doesn't persist across scene changes.
     * This is ideal for UI state, temporary game state, or scene-specific data.
     *
     * @template T The type of the state value
     * @param scene The Phaser scene instance that owns this state
     * @param key Unique identifier for the state within this scene
     * @param initialValue Optional initial value to set if state doesn't exist
     * @param options Optional configuration for state behavior
     * @returns HookState interface for managing the local state
     *
     * @throws {Error} When scene is not available or key is invalid
     *
     * @example
     * ```typescript
     * // Simple counter state
     * const counterState = withLocalState<number>(scene, 'counter', 0);
     *
     * // Complex object state
     * interface GameUI {
     *   isMenuOpen: boolean;
     *   selectedTab: string;
     * }
     *
     * const uiState = withLocalState<GameUI>(scene, 'ui', {
     *   isMenuOpen: false,
     *   selectedTab: 'main'
     * });
     *
     * // Listen to changes
     * uiState.onChange((newUI, oldUI) => {
     *   if (newUI.isMenuOpen !== oldUI.isMenuOpen) {
     *     console.log('Menu visibility changed');
     *   }
     * });
     *
     * // Update state
     * uiState.set({ ...uiState.get(), isMenuOpen: true });
     *
     * // Array state example
     * const inventoryState = withLocalState<string[]>(scene, 'inventory', []);
     * inventoryState.set([...inventoryState.get(), 'new-item']);
     * ```
     *
     * @example
     * ```typescript
     * // With validation
     * const playerHealthState = withLocalState<number>(
     *   scene,
     *   'health',
     *   100,
     *   {
     *     validator: (value) => {
     *       const health = value as number;
     *       return health >= 0 && health <= 100 ? true : 'Health must be 0-100';
     *     }
     *   }
     * );
     * ```
     *
     * @see {@link withGlobalState} For state that persists across scenes
     * @see {@link withStateDef} For low-level state management
     */
    const withLocalState = (scene, key, initialValue, options) => {
        if (!scene) {
            throw new Error('[withLocalState] Scene parameter is required');
        }
        // Prefix the key with scene key to ensure locality
        const sceneKey = scene.scene?.key || 'unknown-scene';
        const localKey = `phaser-hooks:local:${sceneKey}:${key}`;
        return withStateDef(scene, localKey, initialValue, {
            ...options,
            global: false,
        });
    };

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
    const withComputedState = (scene, key, sourceState, selector) => {
        // Initialize with computed value
        const initialValue = selector(sourceState.get());
        const computedState = withLocalState(scene, key, initialValue);
        // Update computed state when source changes
        sourceState.on('change', () => {
            const newSourceValue = sourceState.get();
            const newComputedValue = selector(newSourceValue);
            computedState.set(newComputedValue);
        });
        return {
            ...computedState,
            set: () => {
                throw new Error(`[withComputedState] Cannot directly set computed state "${key}". Update the source state instead.`);
            },
        };
    };

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
    const withDebouncedState = (scene, key, initialValue, debounceMs) => {
        const actualState = withLocalState(scene, key, initialValue);
        let timeoutId = null;
        const debouncedSet = (value) => {
            const newValue = typeof value === 'function' ? value(actualState.get()) : value;
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                actualState.set(newValue);
                timeoutId = null;
            }, debounceMs);
        };
        const debouncedPatch = (value) => {
            const patchValue = typeof value === 'function' ? value(actualState.get()) : value;
            debouncedSet((currentState) => merge({}, currentState, patchValue));
        };
        return {
            ...actualState,
            set: debouncedSet,
            patch: debouncedPatch,
        };
    };

    /**
     * Creates a local state hook scoped to a specific Phaser scene.
     * Local state is isolated to the scene instance and doesn't persist across scene changes.
     * This is ideal for UI state, temporary game state, or scene-specific data.
     *
     * @template T The type of the state value
     * @param scene The Phaser scene instance that owns this state
     * @param key Unique identifier for the state within this scene
     * @param initialValue Optional initial value to set if state doesn't exist
     * @param options Optional configuration for state behavior
     * @returns HookState interface for managing the local state
     *
     * @throws {Error} When scene is not available or key is invalid
     *
     * @example
     * ```typescript
     * // Simple counter state
     * const counterState = withGlobalState<number>(scene, 'counter', 0);
     *
     * // Complex object state
     * interface GameUI {
     *   isMenuOpen: boolean;
     *   selectedTab: string;
     * }
     *
     * const uiState = withGlobalState<GameUI>(scene, 'ui', {
     *   isMenuOpen: false,
     *   selectedTab: 'main'
     * });
     *
     * // Listen to changes
     * uiState.onChange((newUI, oldUI) => {
     *   if (newUI.isMenuOpen !== oldUI.isMenuOpen) {
     *     console.log('Menu visibility changed');
     *   }
     * });
     *
     * // Update state
     * uiState.set({ ...uiState.get(), isMenuOpen: true });
     *
     * // Array state example
     * const inventoryState = withGlobalState<string[]>(scene, 'inventory', []);
     * inventoryState.set([...inventoryState.get(), 'new-item']);
     * ```
     *
     * @example
     * ```typescript
     * // With validation
     * const playerHealthState = withGlobalState<number>(
     *   scene,
     *   'health',
     *   100,
     *   {
     *     validator: (value) => {
     *       const health = value as number;
     *       return health >= 0 && health <= 100 ? true : 'Health must be 0-100';
     *     }
     *   }
     * );
     * ```
     *
     * @see {@link withGlobalState} For state that persists across scenes
     * @see {@link withStateDef} For low-level state management
     */
    const withGlobalState = (scene, key, initialValue, options) => {
        if (!scene) {
            throw new Error('[withGlobalState] Scene parameter is required');
        }
        // Prefix the key with scene key to ensure locality
        const localKey = `phaser-hooks:global:${key}`;
        return withStateDef(scene, localKey, initialValue, {
            ...options,
            global: true,
        });
    };

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
    const withPersistentState = (scene, key, initialValue, storageKey, storageType = 'local') => {
        const actualStorageKey = storageKey ?? `phaser-hooks-state:${key}`;
        // Load from localStorage if available
        let storedValue = initialValue;
        try {
            const stored = storageType === 'local' ? localStorage.getItem(actualStorageKey) : sessionStorage.getItem(actualStorageKey);
            if (stored) {
                storedValue = JSON.parse(stored);
            }
        }
        catch (error) {
            // eslint-disable-next-line no-console
            console.warn(`[withPersistentState] Failed to load stored state for "${key}":`, error);
        }
        // @ts-ignore
        const state = withGlobalState(scene, key, storedValue);
        // Save to localStorage on changes
        state.onChange((newValue) => {
            try {
                const storage = storageType === 'local' ? localStorage : sessionStorage;
                storage.setItem(actualStorageKey, JSON.stringify(newValue));
            }
            catch (error) {
                // eslint-disable-next-line no-console
                console.warn(`[withPersistentState] Failed to save state for "${key}":`, error);
            }
        });
        return state;
    };

    /**
     * Creates a state hook with undo/redo functionality
     * @template T The type of the state value
     * @param scene The Phaser scene instance
     * @param key Unique identifier for the state
     * @param initialValue Initial value for the state
     * @param maxHistorySize Maximum number of history entries to keep
     * @returns Enhanced HookState with undo/redo capabilities
     *
     * @example
     * ```typescript
     * const undoableState = withUndoableState<string>(scene, 'text', 'initial', 10);
     *
     * undoableState.set('first change');
     * undoableState.set('second change');
     * undoableState.undo(); // Back to 'first change'
     * undoableState.redo(); // Forward to 'second change'
     * ```
     */
    /* eslint-disable max-lines-per-function */
    /* eslint-disable complexity */
    /* eslint-disable sonarjs/cognitive-complexity */
    const withUndoableState = (scene, key, initialValue, maxHistorySize) => {
        const currentState = withLocalState(scene, key, initialValue);
        const historyState = withLocalState(scene, `${key}:history`, [
            initialValue,
        ]);
        const historyIndexState = withLocalState(scene, `${key}:historyIndex`, 0);
        const addToHistory = (value) => {
            const history = historyState.get();
            const currentIndex = historyIndexState.get();
            // Remove any "future" history if we're not at the end
            const newHistory = history.slice(0, currentIndex + 1);
            // Add new value
            newHistory.push(value);
            // Limit history size
            if (newHistory.length > maxHistorySize) {
                newHistory.shift();
            }
            else {
                historyIndexState.set(currentIndex + 1);
            }
            historyState.set(newHistory);
        };
        const set = (value) => {
            const newValue = typeof value === 'function' ? value(currentState.get()) : value;
            addToHistory(newValue);
            currentState.set(newValue);
        };
        const undo = () => {
            const currentIndex = historyIndexState.get();
            if (currentIndex > 0) {
                const newIndex = currentIndex - 1;
                historyIndexState.set(newIndex);
                const history = historyState.get();
                const previousValue = history[newIndex];
                if (previousValue !== undefined) {
                    currentState.set(previousValue);
                    return true;
                }
            }
            return false;
        };
        const redo = () => {
            const currentIndex = historyIndexState.get();
            const history = historyState.get();
            if (currentIndex < history.length - 1) {
                const newIndex = currentIndex + 1;
                historyIndexState.set(newIndex);
                const nextValue = history[newIndex];
                if (nextValue !== undefined) {
                    currentState.set(nextValue);
                    return true;
                }
            }
            return false;
        };
        const canUndo = () => historyIndexState.get() > 0;
        const canRedo = () => historyIndexState.get() < historyState.get().length - 1;
        const clearHistory = () => {
            const current = currentState.get();
            historyState.set([current]);
            historyIndexState.set(0);
        };
        return {
            ...currentState,
            set: (value) => {
                const newValue = typeof value === 'function' ? value(currentState.get()) : value;
                set(newValue);
            },
            patch: (value) => {
                const patchValue = typeof value === 'function' ? value(currentState.get()) : value;
                set((currentValue) => merge({}, currentValue, patchValue));
            },
            undo,
            redo,
            canUndo,
            canRedo,
            clearHistory,
        };
    };

    /**
     * Utility function to check if a scene is valid for state management
     * @param scene The scene to validate
     * @returns true if scene is valid, false otherwise
     */
    const isValidScene = (scene) => {
        return (scene != null &&
            typeof scene === 'object' &&
            'registry' in scene &&
            'scene' in scene);
    };

    var PhaserHooks = /*#__PURE__*/Object.freeze({
        __proto__: null,
        batchStateUpdates: batchStateUpdates,
        isValidScene: isValidScene,
        validators: validators,
        withComputedState: withComputedState,
        withDebouncedState: withDebouncedState,
        withGlobalState: withGlobalState,
        withLocalState: withLocalState,
        withPersistentState: withPersistentState,
        withStateDef: withStateDef,
        withUndoableState: withUndoableState
    });

    /* eslint-disable security/detect-unsafe-regex */
    /**
     * Checks if a string is a valid CSS color value
     * @param color - The color string to validate
     * @returns True if the color string is valid, false otherwise
     *
     * Supports the following formats:
     * - Hex colors (#RRGGBB or #RGB)
     * - RGB colors (rgb(r, g, b))
     * - RGBA colors (rgba(r, g, b, a))
     * - OKLCH colors (oklch(l c h [/ a]))
     */
    const isValidColor = (color) => {
        if (typeof color !== 'string') {
            return false;
        }
        const trimmedColor = color.trim();
        if (/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(trimmedColor)) {
            return true;
        }
        if (/^rgb\(\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*\)$/.test(trimmedColor)) {
            return true;
        }
        if (/^rgba\(\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*,\s*(\d{1,3}%?)\s*,\s*([01]|0?\.\d+)\s*\)$/.test(trimmedColor)) {
            return true;
        }
        if (/^oklch\(\s*(\d*\.?\d+%?)\s+(\d*\.?\d+)\s+(\d*\.?\d+)(?:\s*\/\s*([01]|0?\.\d+))?\s*\)$/.test(trimmedColor)) {
            return true;
        }
        return false;
    };

    // https://github.com/tailwindlabs/tailwindcss/blob/main/packages/tailwindcss/src/compat/colors.ts
    const palette = {
        black: '#000',
        white: '#fff',
        slate: {
            '50': 'rgb(248, 250, 252)',
            '100': 'rgb(241, 245, 249)',
            '200': 'rgb(226, 232, 240)',
            '300': 'rgb(203, 213, 225)',
            '400': 'rgb(148, 163, 184)',
            '500': 'rgb(100, 116, 139)',
            '600': 'rgb(71, 85, 105)',
            '700': 'rgb(51, 65, 85)',
            '800': 'rgb(30, 41, 59)',
            '900': 'rgb(15, 23, 42)',
            '950': 'rgb(2, 6, 23)',
        },
        gray: {
            '50': 'rgb(249, 250, 251)',
            '100': 'rgb(243, 244, 246)',
            '200': 'rgb(229, 231, 235)',
            '300': 'rgb(209, 213, 219)',
            '400': 'rgb(156, 163, 175)',
            '500': 'rgb(107, 114, 128)',
            '600': 'rgb(75, 85, 99)',
            '700': 'rgb(55, 65, 81)',
            '800': 'rgb(31, 41, 55)',
            '900': 'rgb(17, 24, 39)',
            '950': 'rgb(3, 7, 18)',
        },
        zinc: {
            '50': 'rgb(250, 250, 250)',
            '100': 'rgb(244, 244, 245)',
            '200': 'rgb(228, 228, 231)',
            '300': 'rgb(212, 212, 216)',
            '400': 'rgb(161, 161, 170)',
            '500': 'rgb(113, 113, 122)',
            '600': 'rgb(82, 82, 91)',
            '700': 'rgb(63, 63, 70)',
            '800': 'rgb(39, 39, 42)',
            '900': 'rgb(24, 24, 27)',
            '950': 'rgb(9, 9, 11)',
        },
        neutral: {
            '50': 'rgb(250, 250, 250)',
            '100': 'rgb(245, 245, 245)',
            '200': 'rgb(229, 229, 229)',
            '300': 'rgb(212, 212, 212)',
            '400': 'rgb(163, 163, 163)',
            '500': 'rgb(115, 115, 115)',
            '600': 'rgb(82, 82, 82)',
            '700': 'rgb(64, 64, 64)',
            '800': 'rgb(38, 38, 38)',
            '900': 'rgb(23, 23, 23)',
            '950': 'rgb(10, 10, 10)',
        },
        stone: {
            '50': 'rgb(250, 250, 249)',
            '100': 'rgb(245, 245, 244)',
            '200': 'rgb(231, 229, 228)',
            '300': 'rgb(214, 211, 209)',
            '400': 'rgb(168, 162, 158)',
            '500': 'rgb(120, 113, 108)',
            '600': 'rgb(87, 83, 78)',
            '700': 'rgb(68, 64, 60)',
            '800': 'rgb(41, 37, 36)',
            '900': 'rgb(28, 25, 23)',
            '950': 'rgb(12, 10, 9)',
        },
        red: {
            '50': 'rgb(254, 242, 242)',
            '100': 'rgb(254, 226, 226)',
            '200': 'rgb(254, 202, 202)',
            '300': 'rgb(252, 165, 165)',
            '400': 'rgb(248, 113, 113)',
            '500': 'rgb(239, 68, 68)',
            '600': 'rgb(220, 38, 38)',
            '700': 'rgb(185, 28, 28)',
            '800': 'rgb(153, 27, 27)',
            '900': 'rgb(127, 29, 29)',
            '950': 'rgb(69, 10, 10)',
        },
        orange: {
            '50': 'rgb(255, 247, 237)',
            '100': 'rgb(255, 237, 213)',
            '200': 'rgb(254, 215, 170)',
            '300': 'rgb(253, 186, 116)',
            '400': 'rgb(251, 146, 60)',
            '500': 'rgb(249, 115, 22)',
            '600': 'rgb(234, 88, 12)',
            '700': 'rgb(194, 65, 12)',
            '800': 'rgb(154, 52, 18)',
            '900': 'rgb(124, 45, 18)',
            '950': 'rgb(67, 20, 7)',
        },
        amber: {
            '50': 'rgb(255, 251, 235)',
            '100': 'rgb(254, 243, 199)',
            '200': 'rgb(253, 230, 138)',
            '300': 'rgb(252, 211, 77)',
            '400': 'rgb(251, 191, 36)',
            '500': 'rgb(245, 158, 11)',
            '600': 'rgb(217, 119, 6)',
            '700': 'rgb(180, 83, 9)',
            '800': 'rgb(146, 64, 14)',
            '900': 'rgb(120, 53, 15)',
            '950': 'rgb(69, 26, 3)',
        },
        yellow: {
            '50': 'rgb(254, 252, 232)',
            '100': 'rgb(254, 249, 195)',
            '200': 'rgb(254, 240, 138)',
            '300': 'rgb(253, 224, 71)',
            '400': 'rgb(250, 204, 21)',
            '500': 'rgb(234, 179, 8)',
            '600': 'rgb(202, 138, 4)',
            '700': 'rgb(161, 98, 7)',
            '800': 'rgb(133, 77, 14)',
            '900': 'rgb(113, 63, 18)',
            '950': 'rgb(66, 32, 6)',
        },
        lime: {
            '50': 'rgb(247, 254, 231)',
            '100': 'rgb(236, 252, 203)',
            '200': 'rgb(217, 249, 157)',
            '300': 'rgb(190, 242, 100)',
            '400': 'rgb(163, 230, 53)',
            '500': 'rgb(132, 204, 22)',
            '600': 'rgb(101, 163, 13)',
            '700': 'rgb(77, 124, 15)',
            '800': 'rgb(63, 98, 18)',
            '900': 'rgb(54, 83, 20)',
            '950': 'rgb(26, 46, 5)',
        },
        green: {
            '50': 'rgb(240, 253, 244)',
            '100': 'rgb(220, 252, 231)',
            '200': 'rgb(187, 247, 208)',
            '300': 'rgb(134, 239, 172)',
            '400': 'rgb(74, 222, 128)',
            '500': 'rgb(34, 197, 94)',
            '600': 'rgb(22, 163, 74)',
            '700': 'rgb(21, 128, 61)',
            '800': 'rgb(22, 101, 52)',
            '900': 'rgb(20, 83, 45)',
            '950': 'rgb(5, 46, 22)',
        },
        emerald: {
            '50': 'rgb(236, 253, 245)',
            '100': 'rgb(209, 250, 229)',
            '200': 'rgb(167, 243, 208)',
            '300': 'rgb(110, 231, 183)',
            '400': 'rgb(52, 211, 153)',
            '500': 'rgb(16, 185, 129)',
            '600': 'rgb(5, 150, 105)',
            '700': 'rgb(4, 120, 87)',
            '800': 'rgb(6, 95, 70)',
            '900': 'rgb(6, 78, 59)',
            '950': 'rgb(2, 44, 34)',
        },
        teal: {
            '50': 'rgb(240, 253, 250)',
            '100': 'rgb(204, 251, 241)',
            '200': 'rgb(153, 246, 228)',
            '300': 'rgb(94, 234, 212)',
            '400': 'rgb(45, 212, 191)',
            '500': 'rgb(20, 184, 166)',
            '600': 'rgb(13, 148, 136)',
            '700': 'rgb(15, 118, 110)',
            '800': 'rgb(17, 94, 89)',
            '900': 'rgb(19, 78, 74)',
            '950': 'rgb(4, 47, 46)',
        },
        cyan: {
            '50': 'rgb(236, 254, 255)',
            '100': 'rgb(207, 250, 254)',
            '200': 'rgb(165, 243, 252)',
            '300': 'rgb(103, 232, 249)',
            '400': 'rgb(34, 211, 238)',
            '500': 'rgb(6, 182, 212)',
            '600': 'rgb(8, 145, 178)',
            '700': 'rgb(14, 116, 144)',
            '800': 'rgb(21, 94, 117)',
            '900': 'rgb(22, 78, 99)',
            '950': 'rgb(8, 51, 68)',
        },
        sky: {
            '50': 'rgb(240, 249, 255)',
            '100': 'rgb(224, 242, 254)',
            '200': 'rgb(186, 230, 253)',
            '300': 'rgb(125, 211, 252)',
            '400': 'rgb(56, 189, 248)',
            '500': 'rgb(14, 165, 233)',
            '600': 'rgb(2, 132, 199)',
            '700': 'rgb(3, 105, 161)',
            '800': 'rgb(7, 89, 133)',
            '900': 'rgb(12, 74, 110)',
            '950': 'rgb(8, 47, 73)',
        },
        blue: {
            '50': 'rgb(239, 246, 255)',
            '100': 'rgb(219, 234, 254)',
            '200': 'rgb(191, 219, 254)',
            '300': 'rgb(147, 197, 253)',
            '400': 'rgb(96, 165, 250)',
            '500': 'rgb(59, 130, 246)',
            '600': 'rgb(37, 99, 235)',
            '700': 'rgb(29, 78, 216)',
            '800': 'rgb(30, 64, 175)',
            '900': 'rgb(30, 58, 138)',
            '950': 'rgb(23, 37, 84)',
        },
        indigo: {
            '50': 'rgb(238, 242, 255)',
            '100': 'rgb(224, 231, 255)',
            '200': 'rgb(199, 210, 254)',
            '300': 'rgb(165, 180, 252)',
            '400': 'rgb(129, 140, 248)',
            '500': 'rgb(99, 102, 241)',
            '600': 'rgb(79, 70, 229)',
            '700': 'rgb(67, 56, 202)',
            '800': 'rgb(55, 48, 163)',
            '900': 'rgb(49, 46, 129)',
            '950': 'rgb(30, 27, 75)',
        },
        violet: {
            '50': 'rgb(245, 243, 255)',
            '100': 'rgb(237, 233, 254)',
            '200': 'rgb(221, 214, 254)',
            '300': 'rgb(196, 181, 253)',
            '400': 'rgb(167, 139, 250)',
            '500': 'rgb(139, 92, 246)',
            '600': 'rgb(124, 58, 237)',
            '700': 'rgb(109, 40, 217)',
            '800': 'rgb(91, 33, 182)',
            '900': 'rgb(76, 29, 149)',
            '950': 'rgb(46, 16, 101)',
        },
        purple: {
            '50': 'rgb(250, 245, 255)',
            '100': 'rgb(243, 232, 255)',
            '200': 'rgb(233, 213, 255)',
            '300': 'rgb(216, 180, 254)',
            '400': 'rgb(192, 132, 252)',
            '500': 'rgb(168, 85, 247)',
            '600': 'rgb(147, 51, 234)',
            '700': 'rgb(126, 34, 206)',
            '800': 'rgb(107, 33, 168)',
            '900': 'rgb(88, 28, 135)',
            '950': 'rgb(59, 7, 100)',
        },
        fuchsia: {
            '50': 'rgb(253, 244, 255)',
            '100': 'rgb(250, 232, 255)',
            '200': 'rgb(245, 208, 254)',
            '300': 'rgb(240, 171, 252)',
            '400': 'rgb(232, 121, 249)',
            '500': 'rgb(217, 70, 239)',
            '600': 'rgb(192, 38, 211)',
            '700': 'rgb(162, 28, 175)',
            '800': 'rgb(134, 25, 143)',
            '900': 'rgb(112, 26, 117)',
            '950': 'rgb(74, 4, 78)',
        },
        pink: {
            '50': 'rgb(253, 242, 248)',
            '100': 'rgb(252, 231, 243)',
            '200': 'rgb(251, 207, 232)',
            '300': 'rgb(249, 168, 212)',
            '400': 'rgb(244, 114, 182)',
            '500': 'rgb(236, 72, 153)',
            '600': 'rgb(219, 39, 119)',
            '700': 'rgb(190, 24, 93)',
            '800': 'rgb(157, 23, 77)',
            '900': 'rgb(131, 24, 67)',
            '950': 'rgb(80, 7, 36)',
        },
        rose: {
            '50': 'rgb(255, 241, 242)',
            '100': 'rgb(255, 228, 230)',
            '200': 'rgb(254, 205, 211)',
            '300': 'rgb(253, 164, 175)',
            '400': 'rgb(251, 113, 133)',
            '500': 'rgb(244, 63, 94)',
            '600': 'rgb(225, 29, 72)',
            '700': 'rgb(190, 18, 60)',
            '800': 'rgb(159, 18, 57)',
            '900': 'rgb(136, 19, 55)',
            '950': 'rgb(76, 5, 25)',
        },
    };

    /** Regular expression to match RGB color format */
    const RGB_REGEX = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/;
    /**
     * Convert hex color value to number
     * @param hexValue - Hex color value (e.g., '#ff0000')
     * @returns Number representation of hex color
     */
    const convertHexToNumber = (hexValue) => {
        const hex = hexValue.slice(1);
        if (hex.length === 3) {
            const r = parseInt(hex[0] + hex[0], 16);
            const g = parseInt(hex[1] + hex[1], 16);
            const b = parseInt(hex[2] + hex[2], 16);
            return (r << 16) + (g << 8) + b;
        }
        return parseInt(hex, 16);
    };
    /**
     * Convert RGB color value to number
     * @param rgbValue - RGB color value (e.g., 'rgb(255, 0, 0)')
     * @returns Number representation of RGB color
     * @throws {Error} If RGB format is invalid
     */
    const convertRgbToNumber = (rgbValue) => {
        const matches = rgbValue.match(RGB_REGEX);
        if (!matches) {
            throw new Error(`Invalid RGB format: ${rgbValue}`);
        }
        const r = parseInt(matches[1]);
        const g = parseInt(matches[2]);
        const b = parseInt(matches[3]);
        return (r << 16) + (g << 8) + b;
    };
    /**
     * Convert color value to number
     * @param colorValue - Color value (e.g., '#ff0000' or 'rgb(255, 0, 0)')
     * @returns Number representation of color
     */
    const convertColorValueToNumber = (colorValue) => {
        if (colorValue.startsWith('#')) {
            return convertHexToNumber(colorValue);
        }
        return convertRgbToNumber(colorValue);
    };
    /**
     * Factory that creates a color utility API based on the provided theme colors
     * @param themeColors - Theme colors configuration
     * @returns Color utility API instance
     */
    /**
     * Create a color API bound to an optional theme colors map.
     * If a key exists in `themeColors`, it will be resolved to a palette token and then to RGB/Hex.
     *
     * @typeParam T - Theme colors map
     * @param themeColors - Optional map of theme color tokens
     * @example
     * const c = createColor({ primary: 'blue-500' });
     * c.rgb('primary'); // rgb(59, 130, 246)
     */
    const createColor = (themeColors) => {
        /**
         * Get color value from theme configuration
         * @param key - Color token or theme color key
         * @returns Color value from theme or null if not found
         */
        const getValueFromTheme = (key) => {
            if (themeColors && key in themeColors) {
                return themeColors[key];
            }
            return null;
        };
        /**
         * Get RGB string representation of a color
         * @param color - Color token, theme color key or valid color string
         * @returns RGB color string
         * @throws {Error} If color token is not found
         */
        const rgb = (color) => {
            // Runtime supports direct CSS strings for flexibility, but
            // the public type restricts to palette tokens or theme keys.
            if (typeof color === 'string' && isValidColor(color)) {
                return color;
            }
            const colorFromTheme = getValueFromTheme(color);
            if (colorFromTheme) {
                return rgb(colorFromTheme);
            }
            const parts = color.split('-');
            if (parts.length === 2) {
                const colorKey = parts[0];
                const shade = parts[1];
                const colorValue = palette[colorKey]?.[shade];
                if (!colorValue) {
                    if (isValidColor(color)) {
                        return color;
                    }
                    throw new Error(`Color token "${colorKey}-${shade}" not found`);
                }
                return colorValue;
            }
            const colorValue = palette[color];
            if (!colorValue) {
                if (isValidColor(color)) {
                    return color;
                }
                throw new Error(`Color token "${color}" not found`);
            }
            return colorValue;
        };
        /**
         * Get hex number representation of a color
         * @param color - Color token, theme color key or valid color string
         * @returns Hex color number
         * @throws {Error} If color token is not found
         */
        const hex = (color) => {
            // See note in rgb()
            if (typeof color === 'string' && isValidColor(color)) {
                return convertColorValueToNumber(color);
            }
            const colorFromTheme = getValueFromTheme(color);
            if (colorFromTheme) {
                return hex(colorFromTheme);
            }
            const parts = color.split('-');
            if (parts.length === 2) {
                const colorKey = parts[0];
                const shade = parts[1];
                const colorValue = palette[colorKey]?.[shade];
                if (!colorValue) {
                    if (isValidColor(color)) {
                        return convertColorValueToNumber(color);
                    }
                    throw new Error(`Color token "${colorKey}-${shade}" not found`);
                }
                return convertColorValueToNumber(colorValue);
            }
            const colorToConvert = palette[color];
            if (isValidColor(colorToConvert)) {
                return convertColorValueToNumber(colorToConvert);
            }
            throw new Error(`Color token "${color}" not found`);
        };
        const api = {
            rgb,
            hex,
            black: () => rgb('black'),
            white: () => rgb('white'),
            slate: (shade) => rgb(`slate-${shade}`),
            gray: (shade) => rgb(`gray-${shade}`),
            zinc: (shade) => rgb(`zinc-${shade}`),
            neutral: (shade) => rgb(`neutral-${shade}`),
            stone: (shade) => rgb(`stone-${shade}`),
            red: (shade) => rgb(`red-${shade}`),
            orange: (shade) => rgb(`orange-${shade}`),
            amber: (shade) => rgb(`amber-${shade}`),
            yellow: (shade) => rgb(`yellow-${shade}`),
            lime: (shade) => rgb(`lime-${shade}`),
            green: (shade) => rgb(`green-${shade}`),
            emerald: (shade) => rgb(`emerald-${shade}`),
            teal: (shade) => rgb(`teal-${shade}`),
            cyan: (shade) => rgb(`cyan-${shade}`),
            sky: (shade) => rgb(`sky-${shade}`),
            blue: (shade) => rgb(`blue-${shade}`),
            indigo: (shade) => rgb(`indigo-${shade}`),
            violet: (shade) => rgb(`violet-${shade}`),
            purple: (shade) => rgb(`purple-${shade}`),
            fuchsia: (shade) => rgb(`fuchsia-${shade}`),
            pink: (shade) => rgb(`pink-${shade}`),
            rose: (shade) => rgb(`rose-${shade}`),
            blackHex: () => hex('black'),
            whiteHex: () => hex('white'),
            slateHex: (shade) => hex(`slate-${shade}`),
            grayHex: (shade) => hex(`gray-${shade}`),
            zincHex: (shade) => hex(`zinc-${shade}`),
            neutralHex: (shade) => hex(`neutral-${shade}`),
            stoneHex: (shade) => hex(`stone-${shade}`),
            redHex: (shade) => hex(`red-${shade}`),
            orangeHex: (shade) => hex(`orange-${shade}`),
            amberHex: (shade) => hex(`amber-${shade}`),
            yellowHex: (shade) => hex(`yellow-${shade}`),
            limeHex: (shade) => hex(`lime-${shade}`),
            greenHex: (shade) => hex(`green-${shade}`),
            emeraldHex: (shade) => hex(`emerald-${shade}`),
            tealHex: (shade) => hex(`teal-${shade}`),
            cyanHex: (shade) => hex(`cyan-${shade}`),
            skyHex: (shade) => hex(`sky-${shade}`),
            blueHex: (shade) => hex(`blue-${shade}`),
            indigoHex: (shade) => hex(`indigo-${shade}`),
            violetHex: (shade) => hex(`violet-${shade}`),
            purpleHex: (shade) => hex(`purple-${shade}`),
            fuchsiaHex: (shade) => hex(`fuchsia-${shade}`),
            pinkHex: (shade) => hex(`pink-${shade}`),
            roseHex: (shade) => hex(`rose-${shade}`),
        };
        return api;
    };
    /**
     * Convenience instance using only the default palette tokens (no theme).
     *
     * @example
     * Color.rgb('emerald-400')
     * Color.hex('black')
     */
    // eslint-disable-next-line no-redeclare
    const Color = createColor({});

    /**
     * Default mapping of font size keys to their pixel values in pixels
     */
    /** Default font-size scale mapping (in pixels). */
    const fontSizeMap = {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        '2xl': 24,
        '3xl': 30,
        '4xl': 36,
        '5xl': 48,
        '6xl': 60,
        '7xl': 72,
        '8xl': 96,
        '9xl': 128,
    };
    /**
     * Creates a font size conversion API with optional custom font sizes
     * @template T - Optional custom font size map type
     * @param themeFontSizes - Optional custom font size mappings to extend defaults
     * @returns Font size conversion API
     */
    /**
     * Create a font-size API bound to an optional custom map.
     * @example
     * const f = createFontSize({ xxl: 28 });
     * f.css('xxl'); // '28px'
     */
    const createFontSize = (themeFontSizes) => {
        const fontmap = {
            ...fontSizeMap,
            ...themeFontSizes,
        };
        return {
            px: (key) => {
                const value = fontmap[key];
                if (typeof value === 'number') {
                    return value;
                }
                return 0;
            },
            rem: (key) => {
                const value = fontmap[key];
                if (typeof value === 'number') {
                    return value / 16;
                }
                return 0;
            },
            css: (key) => {
                const value = fontmap[key];
                if (typeof value === 'number') {
                    return `${value}px`;
                }
                return '0px';
            },
        };
    };
    // Convenience instance using default font sizes (no theme)
    const FontSize = createFontSize(undefined);

    const fontMap = {
        primary: 'Inter, system-ui, sans-serif',
        secondary: 'Roboto, Arial, sans-serif',
        monospace: 'Fira Code, Consolas, monospace',
        display: 'Poppins, Inter, sans-serif',
    };
    const createFont = (fonts, fontSizes) => {
        const map = {
            ...fontMap,
            ...fonts,
        };
        const fontSizeApi = createFontSize(fontSizes);
        const getFamily = (key) => {
            if (key.includes('.')) {
                const [, short] = key.split('.');
                if (short && typeof map[short] === 'string') {
                    return map[short];
                }
            }
            return typeof map[key] === 'string' ? map[key] : key;
        };
        return {
            size: (key) => {
                return fontSizeApi.px(key) ?? 0;
            },
            format: ({ size, family }) => {
                const sizePx = fontSizeApi.px(size) ?? 0;
                return `${sizePx}px '${getFamily(family)}'`;
            },
            family: (key) => getFamily(key),
            getAvailableFonts: () => {
                return Array.from(new Set([...Object.keys(fontMap), ...Object.keys(map)]));
            },
        };
    };

    /**
     * Mapping of radius keys to their pixel values
     */
    /** Default radius scale mapping (in pixels). */
    const radiusMap = {
        none: 0,
        sm: 2,
        default: 4,
        md: 6,
        lg: 8,
        xl: 12,
        '2xl': 16,
        '3xl': 24,
        full: 9999,
    };
    /**
     * Create a radius API bound to an optional theme radius map.
     * @example
     * const r = createRadius({ card: 12 });
     * r.css('card'); // '12px'
     */
    const createRadius = (themeRadius) => {
        const map = {
            ...radiusMap,
            ...themeRadius,
        };
        const get = (key) => {
            return typeof map[key] === 'number' ? map[key] : 0;
        };
        return {
            px: (key) => get(key),
            rem: (key) => get(key) / 16,
            css: (key) => `${get(key)}px`,
        };
    };
    /** Convenience instance using default radius map (no theme). */
    const Radius = createRadius(undefined);

    /** Default shadow presets. */
    const defaultShadowMap = {
        sm: { blur: 2, offsetX: 1, offsetY: 1, alpha: 0.15 },
        md: { blur: 4, offsetX: 2, offsetY: 2, alpha: 0.2 },
        lg: { blur: 6, offsetX: 4, offsetY: 4, alpha: 0.25 },
        xl: { blur: 8, offsetX: 6, offsetY: 6, alpha: 0.3 },
        '2xl': { blur: 12, offsetX: 8, offsetY: 8, alpha: 0.35 },
        inner: { blur: 4, offsetX: -2, offsetY: -2, alpha: 0.2 },
    };
    /**
     * Create a shadow API bound to an optional effects map.
     * @example
     * const sh = createShadow({ glow: { blur: 8, offsetX: 0, offsetY: 0, alpha: .6 } });
     * sh.get('glow');
     */
    const createShadow = (effects) => {
        const map = {
            ...defaultShadowMap,
            ...effects,
        };
        const getConfig = (key) => {
            const cfg = map[key];
            if (cfg && typeof cfg === 'object')
                return cfg;
            return defaultShadowMap['md'];
        };
        return {
            get: (key) => getConfig(key),
        };
    };
    /** Convenience instance using default shadows (no theme). */
    const Shadow = createShadow(undefined);

    /**
     * Spacing scale mapping following Tailwind's spacing scale.
     * Values are in pixels, with a base unit of 4px (1 = 4px).
     */
    const spacingMap = {
        '0': 0,
        px: 1,
        '0.5': 2,
        '1': 4,
        '1.5': 6,
        '2': 8,
        '2.5': 10,
        '3': 12,
        '3.5': 14,
        '4': 16,
        '5': 20,
        '6': 24,
        '7': 28,
        '8': 32,
        '9': 36,
        '10': 40,
        '11': 44,
        '12': 48,
        '14': 56,
        '16': 64,
        '20': 80,
        '24': 96,
        '28': 112,
        '32': 128,
        '36': 144,
        '40': 160,
        '44': 176,
        '48': 192,
        '52': 208,
        '56': 224,
        '60': 240,
        '64': 256,
        '72': 288,
        '80': 320,
        '96': 384,
    };
    /**
     * Create a spacing API bound to an optional theme spacing map.
     * @example
     * const s = createSpacing({ gutter: 24 });
     * s.px('gutter'); // 24
     */
    const createSpacing = (themeSpacing) => {
        const map = {
            ...spacingMap,
            ...themeSpacing,
        };
        const get = (key) => {
            return typeof map[key] === 'number' ? map[key] : 0;
        };
        return {
            px: (key) => {
                return get(key);
            },
            rem: (key) => {
                return get(key) / 16;
            },
            css: (key) => {
                return `${get(key)}px`;
            },
        };
    };
    /** Convenience instance using default spacing map (no theme). */
    const Spacing = createSpacing(undefined);

    /* eslint-disable max-lines */
    /* eslint-disable sonarjs/no-duplicate-string */
    /**
     * Example theme configurations with structured design tokens
     */
    const defaultLightTheme = {
        fonts: {
            primary: 'Inter, system-ui, sans-serif',
            secondary: 'Roboto, Arial, sans-serif',
            monospace: 'Fira Code, Consolas, monospace',
            display: 'Poppins, Inter, sans-serif',
        },
        fontSizes: { ...fontSizeMap },
        colors: {
            // Primary colors
            primary: 'blue-600',
            secondary: 'gray-600',
            // Semantic colors
            success: 'green-500',
            warning: 'yellow-500',
            error: 'red-500',
            info: 'blue-400',
            // Background colors
            background: 'white',
            // Text colors
            text: 'gray-900',
            // UI elements
            shadow: 'black',
            overlay: 'black',
        },
        spacing: { ...spacingMap },
        typography: {
            heading: {
                fontSize: '2xl',
                fontFamily: 'fonts.display',
                fontWeight: 600,
                lineHeight: 1.2,
            },
            'heading-large': {
                fontSize: '4xl',
                fontFamily: 'fonts.display',
                fontWeight: 700,
                lineHeight: 1.1,
            },
            body: {
                fontSize: 'base',
                fontFamily: 'fonts.primary',
                fontWeight: 400,
                lineHeight: 1.5,
            },
            caption: {
                fontSize: 'sm',
                fontFamily: 'fonts.primary',
                fontWeight: 400,
                lineHeight: 1.4,
            },
        },
        // TODO: Check this implementation
        effects: {
            'shadow-sm': {
                blur: 2,
                offsetY: 1,
                color: 'colors.shadow',
                alpha: 0.05,
            },
            'shadow-md': {
                blur: 4,
                offsetY: 2,
                color: 'colors.shadow',
                alpha: 0.1,
            },
            'shadow-lg': {
                blur: 8,
                offsetY: 4,
                color: 'colors.shadow',
                alpha: 0.1,
            },
        },
        custom: {},
    };
    const defaultDarkTheme = {
        fonts: {
            primary: 'Inter, system-ui, sans-serif',
            secondary: 'Roboto, Arial, sans-serif',
            monospace: 'Fira Code, Consolas, monospace',
            display: 'Poppins, Inter, sans-serif',
        },
        fontSizes: { ...fontSizeMap },
        radius: { ...radiusMap },
        colors: {
            // Primary colors
            primary: 'blue-400',
            secondary: 'gray-400',
            // Semantic colors
            success: 'green-400',
            warning: 'yellow-400',
            error: 'red-400',
            info: 'blue-300',
            // Background colors
            background: 'gray-900',
            // Text colors
            text: 'white',
            // UI elements
            shadow: 'black',
            overlay: 'black',
        },
        spacing: { ...spacingMap },
        typography: {
            heading: {
                fontSize: '2xl',
                fontFamily: 'fonts.display',
                fontWeight: 600,
                lineHeight: 1.2,
            },
            'heading-large': {
                fontSize: '4xl',
                fontFamily: 'fonts.display',
                fontWeight: 700,
                lineHeight: 1.1,
            },
            body: {
                fontSize: 'base',
                fontFamily: 'fonts.primary',
                fontWeight: 400,
                lineHeight: 1.5,
            },
            caption: {
                fontSize: 'sm',
                fontFamily: 'fonts.primary',
                fontWeight: 400,
                lineHeight: 1.4,
            },
        },
        effects: {
            'shadow-sm': {
                blur: 2,
                offsetY: 1,
                color: 'colors.shadow',
                alpha: 0.1,
            },
            'shadow-md': {
                blur: 4,
                offsetY: 2,
                color: 'colors.shadow',
                alpha: 0.15,
            },
            'shadow-lg': {
                blur: 8,
                offsetY: 4,
                color: 'colors.shadow',
                alpha: 0.2,
            },
        },
        custom: {},
    };

    const createTheme = (theme) => merge({}, defaultLightTheme, theme);

    const PHASER_WIND_KEY = 'pw';
    /**
     * Phaser Wind Plugin class that manages theme configuration
     * @extends Plugins.BasePlugin
     */
    class PhaserWindPlugin extends Phaser$1.Plugins.BasePlugin {
        colorInstance = null;
        fontSizeInstance = null;
        spacingInstance = null;
        radiusInstance = null;
        fontInstance = null;
        shadowInstance = null;
        /** Current theme configuration */
        theme;
        /**
         * Creates an instance of PhaserWindPlugin
         * @param pluginManager - Phaser plugin manager instance
         */
        constructor(pluginManager) {
            super(pluginManager);
            this.theme = defaultLightTheme;
        }
        /**
         * Initializes the plugin with theme configuration
         * @param theme - Custom theme configuration
         * @param darkMode - Whether to use dark mode theme when no custom theme provided
         * @example
         * ```typescript
         * const game = new Phaser.Game({
         *   plugins: {
         *     global: [
         *       {
         *         key: PHASER_WIND_KEY,
         *         plugin: PhaserWindPlugin,
         *         mapping: PHASER_WIND_KEY,
         *         data: { theme: defaultLightTheme }
         *       },
         *     ],
         *   },
         * });
         * ```
         */
        init({ theme, darkMode = false }) {
            if (!theme) {
                this.theme = darkMode
                    ? defaultDarkTheme
                    : defaultLightTheme;
                return;
            }
            else {
                this.theme = theme;
            }
            this.colorInstance = createColor(this.theme.colors);
            this.fontSizeInstance = createFontSize(this.theme.fontSizes);
            this.spacingInstance = createSpacing(this.theme.spacing);
            this.radiusInstance = createRadius(this.theme.radius);
            this.fontInstance = createFont(this.theme.fonts, this.theme.fontSizes);
            this.shadowInstance = createShadow(this.theme.effects);
        }
        /**
         * Returns the current theme configuration
         * @returns Current BaseThemeConfig
         */
        getTheme() {
            return this.theme;
        }
        get color() {
            return this.colorInstance;
        }
        get fontSize() {
            return this.fontSizeInstance;
        }
        get spacing() {
            return this.spacingInstance;
        }
        get radius() {
            return this.radiusInstance;
        }
        get font() {
            return this.fontInstance;
        }
        get shadow() {
            return this.shadowInstance;
        }
    }

    class SceneWithPhaserWind extends Phaser.Scene {
        /**
         *
         * @param config The scene key or scene specific configuration settings.
         */
        constructor(config) {
            super(config);
        }
        pw;
    }

    var PhaserWind = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Color: Color,
        FontSize: FontSize,
        PHASER_WIND_KEY: PHASER_WIND_KEY,
        PhaserWindPlugin: PhaserWindPlugin,
        Radius: Radius,
        SceneWithPhaserWind: SceneWithPhaserWind,
        Shadow: Shadow,
        Spacing: Spacing,
        createColor: createColor,
        createFont: createFont,
        createFontSize: createFontSize,
        createRadius: createRadius,
        createShadow: createShadow,
        createSpacing: createSpacing,
        createTheme: createTheme,
        defaultDarkTheme: defaultDarkTheme,
        defaultLightTheme: defaultLightTheme,
        defaultShadowMap: defaultShadowMap,
        fontMap: fontMap,
        fontSizeMap: fontSizeMap,
        isValidColor: isValidColor,
        palette: palette,
        radiusMap: radiusMap,
        spacingMap: spacingMap
    });

    // ⚠️ AUTOGENERATED FILE: file generated by scripts/generateFonts.js in home path'
    // Please, don't edit this file manually, it will be overwritten on the next run of the script.
    const fontIcons = {
        '0': { hexCode: '30', acceptedStyles: ['solid'] },
        '1': { hexCode: '31', acceptedStyles: ['solid'] },
        '2': { hexCode: '32', acceptedStyles: ['solid'] },
        '3': { hexCode: '33', acceptedStyles: ['solid'] },
        '4': { hexCode: '34', acceptedStyles: ['solid'] },
        '5': { hexCode: '35', acceptedStyles: ['solid'] },
        '6': { hexCode: '36', acceptedStyles: ['solid'] },
        '7': { hexCode: '37', acceptedStyles: ['solid'] },
        '8': { hexCode: '38', acceptedStyles: ['solid'] },
        '9': { hexCode: '39', acceptedStyles: ['solid'] },
        '42-group': { hexCode: 'e080', acceptedStyles: ['brands'] },
        '500px': { hexCode: 'f26e', acceptedStyles: ['brands'] },
        'a': { hexCode: '41', acceptedStyles: ['solid'] },
        'accessible-icon': { hexCode: 'f368', acceptedStyles: ['brands'] },
        'accusoft': { hexCode: 'f369', acceptedStyles: ['brands'] },
        'address-book': { hexCode: 'f2b9', acceptedStyles: ['solid', 'regular'] },
        'address-card': { hexCode: 'f2bb', acceptedStyles: ['solid', 'regular'] },
        'adn': { hexCode: 'f170', acceptedStyles: ['brands'] },
        'adversal': { hexCode: 'f36a', acceptedStyles: ['brands'] },
        'affiliatetheme': { hexCode: 'f36b', acceptedStyles: ['brands'] },
        'airbnb': { hexCode: 'f834', acceptedStyles: ['brands'] },
        'alarm-clock': { hexCode: 'f34e', acceptedStyles: ['solid', 'regular'] },
        'algolia': { hexCode: 'f36c', acceptedStyles: ['brands'] },
        'align-center': { hexCode: 'f037', acceptedStyles: ['solid'] },
        'align-justify': { hexCode: 'f039', acceptedStyles: ['solid'] },
        'align-left': { hexCode: 'f036', acceptedStyles: ['solid'] },
        'align-right': { hexCode: 'f038', acceptedStyles: ['solid'] },
        'alipay': { hexCode: 'f642', acceptedStyles: ['brands'] },
        'amazon': { hexCode: 'f270', acceptedStyles: ['brands'] },
        'amazon-pay': { hexCode: 'f42c', acceptedStyles: ['brands'] },
        'amilia': { hexCode: 'f36d', acceptedStyles: ['brands'] },
        'anchor': { hexCode: 'f13d', acceptedStyles: ['solid'] },
        'anchor-circle-check': { hexCode: 'e4aa', acceptedStyles: ['solid'] },
        'anchor-circle-exclamation': { hexCode: 'e4ab', acceptedStyles: ['solid'] },
        'anchor-circle-xmark': { hexCode: 'e4ac', acceptedStyles: ['solid'] },
        'anchor-lock': { hexCode: 'e4ad', acceptedStyles: ['solid'] },
        'android': { hexCode: 'f17b', acceptedStyles: ['brands'] },
        'angellist': { hexCode: 'f209', acceptedStyles: ['brands'] },
        'angle-down': { hexCode: 'f107', acceptedStyles: ['solid'] },
        'angle-left': { hexCode: 'f104', acceptedStyles: ['solid'] },
        'angle-right': { hexCode: 'f105', acceptedStyles: ['solid'] },
        'angle-up': { hexCode: 'f106', acceptedStyles: ['solid'] },
        'angles-down': { hexCode: 'f103', acceptedStyles: ['solid'] },
        'angles-left': { hexCode: 'f100', acceptedStyles: ['solid'] },
        'angles-right': { hexCode: 'f101', acceptedStyles: ['solid'] },
        'angles-up': { hexCode: 'f102', acceptedStyles: ['solid'] },
        'angrycreative': { hexCode: 'f36e', acceptedStyles: ['brands'] },
        'angular': { hexCode: 'f420', acceptedStyles: ['brands'] },
        'ankh': { hexCode: 'f644', acceptedStyles: ['solid'] },
        'app-store': { hexCode: 'f36f', acceptedStyles: ['brands'] },
        'app-store-ios': { hexCode: 'f370', acceptedStyles: ['brands'] },
        'apper': { hexCode: 'f371', acceptedStyles: ['brands'] },
        'apple': { hexCode: 'f179', acceptedStyles: ['brands'] },
        'apple-pay': { hexCode: 'f415', acceptedStyles: ['brands'] },
        'apple-whole': { hexCode: 'f5d1', acceptedStyles: ['solid'] },
        'archway': { hexCode: 'f557', acceptedStyles: ['solid'] },
        'arrow-down': { hexCode: 'f063', acceptedStyles: ['solid'] },
        'arrow-down-1-9': { hexCode: 'f162', acceptedStyles: ['solid'] },
        'arrow-down-9-1': { hexCode: 'f886', acceptedStyles: ['solid'] },
        'arrow-down-a-z': { hexCode: 'f15d', acceptedStyles: ['solid'] },
        'arrow-down-long': { hexCode: 'f175', acceptedStyles: ['solid'] },
        'arrow-down-short-wide': { hexCode: 'f884', acceptedStyles: ['solid'] },
        'arrow-down-up-across-line': { hexCode: 'e4af', acceptedStyles: ['solid'] },
        'arrow-down-up-lock': { hexCode: 'e4b0', acceptedStyles: ['solid'] },
        'arrow-down-wide-short': { hexCode: 'f160', acceptedStyles: ['solid'] },
        'arrow-down-z-a': { hexCode: 'f881', acceptedStyles: ['solid'] },
        'arrow-left': { hexCode: 'f060', acceptedStyles: ['solid'] },
        'arrow-left-long': { hexCode: 'f177', acceptedStyles: ['solid'] },
        'arrow-pointer': { hexCode: 'f245', acceptedStyles: ['solid'] },
        'arrow-right': { hexCode: 'f061', acceptedStyles: ['solid'] },
        'arrow-right-arrow-left': { hexCode: 'f0ec', acceptedStyles: ['solid'] },
        'arrow-right-from-bracket': { hexCode: 'f08b', acceptedStyles: ['solid'] },
        'arrow-right-long': { hexCode: 'f178', acceptedStyles: ['solid'] },
        'arrow-right-to-bracket': { hexCode: 'f090', acceptedStyles: ['solid'] },
        'arrow-right-to-city': { hexCode: 'e4b3', acceptedStyles: ['solid'] },
        'arrow-rotate-left': { hexCode: 'f0e2', acceptedStyles: ['solid'] },
        'arrow-rotate-right': { hexCode: 'f01e', acceptedStyles: ['solid'] },
        'arrow-trend-down': { hexCode: 'e097', acceptedStyles: ['solid'] },
        'arrow-trend-up': { hexCode: 'e098', acceptedStyles: ['solid'] },
        'arrow-turn-down': { hexCode: 'f149', acceptedStyles: ['solid'] },
        'arrow-turn-up': { hexCode: 'f148', acceptedStyles: ['solid'] },
        'arrow-up': { hexCode: 'f062', acceptedStyles: ['solid'] },
        'arrow-up-1-9': { hexCode: 'f163', acceptedStyles: ['solid'] },
        'arrow-up-9-1': { hexCode: 'f887', acceptedStyles: ['solid'] },
        'arrow-up-a-z': { hexCode: 'f15e', acceptedStyles: ['solid'] },
        'arrow-up-from-bracket': { hexCode: 'e09a', acceptedStyles: ['solid'] },
        'arrow-up-from-ground-water': { hexCode: 'e4b5', acceptedStyles: ['solid'] },
        'arrow-up-from-water-pump': { hexCode: 'e4b6', acceptedStyles: ['solid'] },
        'arrow-up-long': { hexCode: 'f176', acceptedStyles: ['solid'] },
        'arrow-up-right-dots': { hexCode: 'e4b7', acceptedStyles: ['solid'] },
        'arrow-up-right-from-square': { hexCode: 'f08e', acceptedStyles: ['solid'] },
        'arrow-up-short-wide': { hexCode: 'f885', acceptedStyles: ['solid'] },
        'arrow-up-wide-short': { hexCode: 'f161', acceptedStyles: ['solid'] },
        'arrow-up-z-a': { hexCode: 'f882', acceptedStyles: ['solid'] },
        'arrows-down-to-line': { hexCode: 'e4b8', acceptedStyles: ['solid'] },
        'arrows-down-to-people': { hexCode: 'e4b9', acceptedStyles: ['solid'] },
        'arrows-left-right': { hexCode: 'f07e', acceptedStyles: ['solid'] },
        'arrows-left-right-to-line': { hexCode: 'e4ba', acceptedStyles: ['solid'] },
        'arrows-rotate': { hexCode: 'f021', acceptedStyles: ['solid'] },
        'arrows-spin': { hexCode: 'e4bb', acceptedStyles: ['solid'] },
        'arrows-split-up-and-left': { hexCode: 'e4bc', acceptedStyles: ['solid'] },
        'arrows-to-circle': { hexCode: 'e4bd', acceptedStyles: ['solid'] },
        'arrows-to-dot': { hexCode: 'e4be', acceptedStyles: ['solid'] },
        'arrows-to-eye': { hexCode: 'e4bf', acceptedStyles: ['solid'] },
        'arrows-turn-right': { hexCode: 'e4c0', acceptedStyles: ['solid'] },
        'arrows-turn-to-dots': { hexCode: 'e4c1', acceptedStyles: ['solid'] },
        'arrows-up-down': { hexCode: 'f07d', acceptedStyles: ['solid'] },
        'arrows-up-down-left-right': { hexCode: 'f047', acceptedStyles: ['solid'] },
        'arrows-up-to-line': { hexCode: 'e4c2', acceptedStyles: ['solid'] },
        'artstation': { hexCode: 'f77a', acceptedStyles: ['brands'] },
        'asterisk': { hexCode: '2a', acceptedStyles: ['solid'] },
        'asymmetrik': { hexCode: 'f372', acceptedStyles: ['brands'] },
        'at': { hexCode: '40', acceptedStyles: ['solid'] },
        'atlassian': { hexCode: 'f77b', acceptedStyles: ['brands'] },
        'atom': { hexCode: 'f5d2', acceptedStyles: ['solid'] },
        'audible': { hexCode: 'f373', acceptedStyles: ['brands'] },
        'audio-description': { hexCode: 'f29e', acceptedStyles: ['solid'] },
        'austral-sign': { hexCode: 'e0a9', acceptedStyles: ['solid'] },
        'autoprefixer': { hexCode: 'f41c', acceptedStyles: ['brands'] },
        'avianex': { hexCode: 'f374', acceptedStyles: ['brands'] },
        'aviato': { hexCode: 'f421', acceptedStyles: ['brands'] },
        'award': { hexCode: 'f559', acceptedStyles: ['solid'] },
        'aws': { hexCode: 'f375', acceptedStyles: ['brands'] },
        'b': { hexCode: '42', acceptedStyles: ['solid'] },
        'baby': { hexCode: 'f77c', acceptedStyles: ['solid'] },
        'baby-carriage': { hexCode: 'f77d', acceptedStyles: ['solid'] },
        'backward': { hexCode: 'f04a', acceptedStyles: ['solid'] },
        'backward-fast': { hexCode: 'f049', acceptedStyles: ['solid'] },
        'backward-step': { hexCode: 'f048', acceptedStyles: ['solid'] },
        'bacon': { hexCode: 'f7e5', acceptedStyles: ['solid'] },
        'bacteria': { hexCode: 'e059', acceptedStyles: ['solid'] },
        'bacterium': { hexCode: 'e05a', acceptedStyles: ['solid'] },
        'bag-shopping': { hexCode: 'f290', acceptedStyles: ['solid'] },
        'bahai': { hexCode: 'f666', acceptedStyles: ['solid'] },
        'baht-sign': { hexCode: 'e0ac', acceptedStyles: ['solid'] },
        'ban': { hexCode: 'f05e', acceptedStyles: ['solid'] },
        'ban-smoking': { hexCode: 'f54d', acceptedStyles: ['solid'] },
        'bandage': { hexCode: 'f462', acceptedStyles: ['solid'] },
        'bandcamp': { hexCode: 'f2d5', acceptedStyles: ['brands'] },
        'bangladeshi-taka-sign': { hexCode: 'e2e6', acceptedStyles: ['solid'] },
        'barcode': { hexCode: 'f02a', acceptedStyles: ['solid'] },
        'bars': { hexCode: 'f0c9', acceptedStyles: ['solid'] },
        'bars-progress': { hexCode: 'f828', acceptedStyles: ['solid'] },
        'bars-staggered': { hexCode: 'f550', acceptedStyles: ['solid'] },
        'baseball': { hexCode: 'f433', acceptedStyles: ['solid'] },
        'baseball-bat-ball': { hexCode: 'f432', acceptedStyles: ['solid'] },
        'basket-shopping': { hexCode: 'f291', acceptedStyles: ['solid'] },
        'basketball': { hexCode: 'f434', acceptedStyles: ['solid'] },
        'bath': { hexCode: 'f2cd', acceptedStyles: ['solid'] },
        'battery-empty': { hexCode: 'f244', acceptedStyles: ['solid'] },
        'battery-full': { hexCode: 'f240', acceptedStyles: ['solid'] },
        'battery-half': { hexCode: 'f242', acceptedStyles: ['solid'] },
        'battery-quarter': { hexCode: 'f243', acceptedStyles: ['solid'] },
        'battery-three-quarters': { hexCode: 'f241', acceptedStyles: ['solid'] },
        'battle-net': { hexCode: 'f835', acceptedStyles: ['brands'] },
        'bed': { hexCode: 'f236', acceptedStyles: ['solid'] },
        'bed-pulse': { hexCode: 'f487', acceptedStyles: ['solid'] },
        'beer-mug-empty': { hexCode: 'f0fc', acceptedStyles: ['solid'] },
        'behance': { hexCode: 'f1b4', acceptedStyles: ['brands'] },
        'bell': { hexCode: 'f0f3', acceptedStyles: ['solid', 'regular'] },
        'bell-concierge': { hexCode: 'f562', acceptedStyles: ['solid'] },
        'bell-slash': { hexCode: 'f1f6', acceptedStyles: ['solid', 'regular'] },
        'bezier-curve': { hexCode: 'f55b', acceptedStyles: ['solid'] },
        'bicycle': { hexCode: 'f206', acceptedStyles: ['solid'] },
        'bilibili': { hexCode: 'e3d9', acceptedStyles: ['brands'] },
        'bimobject': { hexCode: 'f378', acceptedStyles: ['brands'] },
        'binoculars': { hexCode: 'f1e5', acceptedStyles: ['solid'] },
        'biohazard': { hexCode: 'f780', acceptedStyles: ['solid'] },
        'bitbucket': { hexCode: 'f171', acceptedStyles: ['brands'] },
        'bitcoin': { hexCode: 'f379', acceptedStyles: ['brands'] },
        'bitcoin-sign': { hexCode: 'e0b4', acceptedStyles: ['solid'] },
        'bity': { hexCode: 'f37a', acceptedStyles: ['brands'] },
        'black-tie': { hexCode: 'f27e', acceptedStyles: ['brands'] },
        'blackberry': { hexCode: 'f37b', acceptedStyles: ['brands'] },
        'blender': { hexCode: 'f517', acceptedStyles: ['solid'] },
        'blender-phone': { hexCode: 'f6b6', acceptedStyles: ['solid'] },
        'blog': { hexCode: 'f781', acceptedStyles: ['solid'] },
        'blogger': { hexCode: 'f37c', acceptedStyles: ['brands'] },
        'blogger-b': { hexCode: 'f37d', acceptedStyles: ['brands'] },
        'bluesky': { hexCode: 'e671', acceptedStyles: ['brands'] },
        'bluetooth': { hexCode: 'f293', acceptedStyles: ['brands'] },
        'bluetooth-b': { hexCode: 'f294', acceptedStyles: ['brands'] },
        'bold': { hexCode: 'f032', acceptedStyles: ['solid'] },
        'bolt': { hexCode: 'f0e7', acceptedStyles: ['solid'] },
        'bolt-lightning': { hexCode: 'e0b7', acceptedStyles: ['solid'] },
        'bomb': { hexCode: 'f1e2', acceptedStyles: ['solid'] },
        'bone': { hexCode: 'f5d7', acceptedStyles: ['solid'] },
        'bong': { hexCode: 'f55c', acceptedStyles: ['solid'] },
        'book': { hexCode: 'f02d', acceptedStyles: ['solid'] },
        'book-atlas': { hexCode: 'f558', acceptedStyles: ['solid'] },
        'book-bible': { hexCode: 'f647', acceptedStyles: ['solid'] },
        'book-bookmark': { hexCode: 'e0bb', acceptedStyles: ['solid'] },
        'book-journal-whills': { hexCode: 'f66a', acceptedStyles: ['solid'] },
        'book-medical': { hexCode: 'f7e6', acceptedStyles: ['solid'] },
        'book-open': { hexCode: 'f518', acceptedStyles: ['solid'] },
        'book-open-reader': { hexCode: 'f5da', acceptedStyles: ['solid'] },
        'book-quran': { hexCode: 'f687', acceptedStyles: ['solid'] },
        'book-skull': { hexCode: 'f6b7', acceptedStyles: ['solid'] },
        'book-tanakh': { hexCode: 'f827', acceptedStyles: ['solid'] },
        'bookmark': { hexCode: 'f02e', acceptedStyles: ['solid', 'regular'] },
        'bootstrap': { hexCode: 'f836', acceptedStyles: ['brands'] },
        'border-all': { hexCode: 'f84c', acceptedStyles: ['solid'] },
        'border-none': { hexCode: 'f850', acceptedStyles: ['solid'] },
        'border-top-left': { hexCode: 'f853', acceptedStyles: ['solid'] },
        'bore-hole': { hexCode: 'e4c3', acceptedStyles: ['solid'] },
        'bots': { hexCode: 'e340', acceptedStyles: ['brands'] },
        'bottle-droplet': { hexCode: 'e4c4', acceptedStyles: ['solid'] },
        'bottle-water': { hexCode: 'e4c5', acceptedStyles: ['solid'] },
        'bowl-food': { hexCode: 'e4c6', acceptedStyles: ['solid'] },
        'bowl-rice': { hexCode: 'e2eb', acceptedStyles: ['solid'] },
        'bowling-ball': { hexCode: 'f436', acceptedStyles: ['solid'] },
        'box': { hexCode: 'f466', acceptedStyles: ['solid'] },
        'box-archive': { hexCode: 'f187', acceptedStyles: ['solid'] },
        'box-open': { hexCode: 'f49e', acceptedStyles: ['solid'] },
        'box-tissue': { hexCode: 'e05b', acceptedStyles: ['solid'] },
        'boxes-packing': { hexCode: 'e4c7', acceptedStyles: ['solid'] },
        'boxes-stacked': { hexCode: 'f468', acceptedStyles: ['solid'] },
        'braille': { hexCode: 'f2a1', acceptedStyles: ['solid'] },
        'brain': { hexCode: 'f5dc', acceptedStyles: ['solid'] },
        'brave': { hexCode: 'e63c', acceptedStyles: ['brands'] },
        'brave-reverse': { hexCode: 'e63d', acceptedStyles: ['brands'] },
        'brazilian-real-sign': { hexCode: 'e46c', acceptedStyles: ['solid'] },
        'bread-slice': { hexCode: 'f7ec', acceptedStyles: ['solid'] },
        'bridge': { hexCode: 'e4c8', acceptedStyles: ['solid'] },
        'bridge-circle-check': { hexCode: 'e4c9', acceptedStyles: ['solid'] },
        'bridge-circle-exclamation': { hexCode: 'e4ca', acceptedStyles: ['solid'] },
        'bridge-circle-xmark': { hexCode: 'e4cb', acceptedStyles: ['solid'] },
        'bridge-lock': { hexCode: 'e4cc', acceptedStyles: ['solid'] },
        'bridge-water': { hexCode: 'e4ce', acceptedStyles: ['solid'] },
        'briefcase': { hexCode: 'f0b1', acceptedStyles: ['solid'] },
        'briefcase-medical': { hexCode: 'f469', acceptedStyles: ['solid'] },
        'broom': { hexCode: 'f51a', acceptedStyles: ['solid'] },
        'broom-ball': { hexCode: 'f458', acceptedStyles: ['solid'] },
        'brush': { hexCode: 'f55d', acceptedStyles: ['solid'] },
        'btc': { hexCode: 'f15a', acceptedStyles: ['brands'] },
        'bucket': { hexCode: 'e4cf', acceptedStyles: ['solid'] },
        'buffer': { hexCode: 'f837', acceptedStyles: ['brands'] },
        'bug': { hexCode: 'f188', acceptedStyles: ['solid'] },
        'bug-slash': { hexCode: 'e490', acceptedStyles: ['solid'] },
        'bugs': { hexCode: 'e4d0', acceptedStyles: ['solid'] },
        'building': { hexCode: 'f1ad', acceptedStyles: ['solid', 'regular'] },
        'building-circle-arrow-right': { hexCode: 'e4d1', acceptedStyles: ['solid'] },
        'building-circle-check': { hexCode: 'e4d2', acceptedStyles: ['solid'] },
        'building-circle-exclamation': { hexCode: 'e4d3', acceptedStyles: ['solid'] },
        'building-circle-xmark': { hexCode: 'e4d4', acceptedStyles: ['solid'] },
        'building-columns': { hexCode: 'f19c', acceptedStyles: ['solid'] },
        'building-flag': { hexCode: 'e4d5', acceptedStyles: ['solid'] },
        'building-lock': { hexCode: 'e4d6', acceptedStyles: ['solid'] },
        'building-ngo': { hexCode: 'e4d7', acceptedStyles: ['solid'] },
        'building-shield': { hexCode: 'e4d8', acceptedStyles: ['solid'] },
        'building-un': { hexCode: 'e4d9', acceptedStyles: ['solid'] },
        'building-user': { hexCode: 'e4da', acceptedStyles: ['solid'] },
        'building-wheat': { hexCode: 'e4db', acceptedStyles: ['solid'] },
        'bullhorn': { hexCode: 'f0a1', acceptedStyles: ['solid'] },
        'bullseye': { hexCode: 'f140', acceptedStyles: ['solid'] },
        'burger': { hexCode: 'f805', acceptedStyles: ['solid'] },
        'buromobelexperte': { hexCode: 'f37f', acceptedStyles: ['brands'] },
        'burst': { hexCode: 'e4dc', acceptedStyles: ['solid'] },
        'bus': { hexCode: 'f207', acceptedStyles: ['solid'] },
        'bus-side': { hexCode: 'e81d', acceptedStyles: ['solid'] },
        'bus-simple': { hexCode: 'f55e', acceptedStyles: ['solid'] },
        'business-time': { hexCode: 'f64a', acceptedStyles: ['solid'] },
        'buy-n-large': { hexCode: 'f8a6', acceptedStyles: ['brands'] },
        'buysellads': { hexCode: 'f20d', acceptedStyles: ['brands'] },
        'c': { hexCode: '43', acceptedStyles: ['solid'] },
        'cable-car': { hexCode: 'f7da', acceptedStyles: ['solid'] },
        'cake-candles': { hexCode: 'f1fd', acceptedStyles: ['solid'] },
        'calculator': { hexCode: 'f1ec', acceptedStyles: ['solid'] },
        'calendar': { hexCode: 'f133', acceptedStyles: ['solid', 'regular'] },
        'calendar-check': { hexCode: 'f274', acceptedStyles: ['solid', 'regular'] },
        'calendar-day': { hexCode: 'f783', acceptedStyles: ['solid'] },
        'calendar-days': { hexCode: 'f073', acceptedStyles: ['solid', 'regular'] },
        'calendar-minus': { hexCode: 'f272', acceptedStyles: ['solid', 'regular'] },
        'calendar-plus': { hexCode: 'f271', acceptedStyles: ['solid', 'regular'] },
        'calendar-week': { hexCode: 'f784', acceptedStyles: ['solid'] },
        'calendar-xmark': { hexCode: 'f273', acceptedStyles: ['solid', 'regular'] },
        'camera': { hexCode: 'f030', acceptedStyles: ['solid', 'regular'] },
        'camera-retro': { hexCode: 'f083', acceptedStyles: ['solid'] },
        'camera-rotate': { hexCode: 'e0d8', acceptedStyles: ['solid'] },
        'campground': { hexCode: 'f6bb', acceptedStyles: ['solid'] },
        'canadian-maple-leaf': { hexCode: 'f785', acceptedStyles: ['brands'] },
        'candy-cane': { hexCode: 'f786', acceptedStyles: ['solid'] },
        'cannabis': { hexCode: 'f55f', acceptedStyles: ['solid'] },
        'capsules': { hexCode: 'f46b', acceptedStyles: ['solid'] },
        'car': { hexCode: 'f1b9', acceptedStyles: ['solid'] },
        'car-battery': { hexCode: 'f5df', acceptedStyles: ['solid'] },
        'car-burst': { hexCode: 'f5e1', acceptedStyles: ['solid'] },
        'car-on': { hexCode: 'e4dd', acceptedStyles: ['solid'] },
        'car-rear': { hexCode: 'f5de', acceptedStyles: ['solid'] },
        'car-side': { hexCode: 'f5e4', acceptedStyles: ['solid'] },
        'car-tunnel': { hexCode: 'e4de', acceptedStyles: ['solid'] },
        'caravan': { hexCode: 'f8ff', acceptedStyles: ['solid'] },
        'caret-down': { hexCode: 'f0d7', acceptedStyles: ['solid'] },
        'caret-left': { hexCode: 'f0d9', acceptedStyles: ['solid'] },
        'caret-right': { hexCode: 'f0da', acceptedStyles: ['solid'] },
        'caret-up': { hexCode: 'f0d8', acceptedStyles: ['solid'] },
        'carrot': { hexCode: 'f787', acceptedStyles: ['solid'] },
        'cart-arrow-down': { hexCode: 'f218', acceptedStyles: ['solid'] },
        'cart-flatbed': { hexCode: 'f474', acceptedStyles: ['solid'] },
        'cart-flatbed-suitcase': { hexCode: 'f59d', acceptedStyles: ['solid'] },
        'cart-plus': { hexCode: 'f217', acceptedStyles: ['solid'] },
        'cart-shopping': { hexCode: 'f07a', acceptedStyles: ['solid'] },
        'cash-app': { hexCode: 'e7d4', acceptedStyles: ['brands'] },
        'cash-register': { hexCode: 'f788', acceptedStyles: ['solid'] },
        'cat': { hexCode: 'f6be', acceptedStyles: ['solid'] },
        'cc-amazon-pay': { hexCode: 'f42d', acceptedStyles: ['brands'] },
        'cc-amex': { hexCode: 'f1f3', acceptedStyles: ['brands'] },
        'cc-apple-pay': { hexCode: 'f416', acceptedStyles: ['brands'] },
        'cc-diners-club': { hexCode: 'f24c', acceptedStyles: ['brands'] },
        'cc-discover': { hexCode: 'f1f2', acceptedStyles: ['brands'] },
        'cc-jcb': { hexCode: 'f24b', acceptedStyles: ['brands'] },
        'cc-mastercard': { hexCode: 'f1f1', acceptedStyles: ['brands'] },
        'cc-paypal': { hexCode: 'f1f4', acceptedStyles: ['brands'] },
        'cc-stripe': { hexCode: 'f1f5', acceptedStyles: ['brands'] },
        'cc-visa': { hexCode: 'f1f0', acceptedStyles: ['brands'] },
        'cedi-sign': { hexCode: 'e0df', acceptedStyles: ['solid'] },
        'cent-sign': { hexCode: 'e3f5', acceptedStyles: ['solid'] },
        'centercode': { hexCode: 'f380', acceptedStyles: ['brands'] },
        'centos': { hexCode: 'f789', acceptedStyles: ['brands'] },
        'certificate': { hexCode: 'f0a3', acceptedStyles: ['solid'] },
        'chair': { hexCode: 'f6c0', acceptedStyles: ['solid'] },
        'chalkboard': { hexCode: 'f51b', acceptedStyles: ['solid'] },
        'chalkboard-user': { hexCode: 'f51c', acceptedStyles: ['solid'] },
        'champagne-glasses': { hexCode: 'f79f', acceptedStyles: ['solid'] },
        'charging-station': { hexCode: 'f5e7', acceptedStyles: ['solid'] },
        'chart-area': { hexCode: 'f1fe', acceptedStyles: ['solid'] },
        'chart-bar': { hexCode: 'f080', acceptedStyles: ['solid', 'regular'] },
        'chart-column': { hexCode: 'e0e3', acceptedStyles: ['solid'] },
        'chart-diagram': { hexCode: 'e695', acceptedStyles: ['solid'] },
        'chart-gantt': { hexCode: 'e0e4', acceptedStyles: ['solid'] },
        'chart-line': { hexCode: 'f201', acceptedStyles: ['solid'] },
        'chart-pie': { hexCode: 'f200', acceptedStyles: ['solid'] },
        'chart-simple': { hexCode: 'e473', acceptedStyles: ['solid'] },
        'check': { hexCode: 'f00c', acceptedStyles: ['solid'] },
        'check-double': { hexCode: 'f560', acceptedStyles: ['solid'] },
        'check-to-slot': { hexCode: 'f772', acceptedStyles: ['solid'] },
        'cheese': { hexCode: 'f7ef', acceptedStyles: ['solid'] },
        'chess': { hexCode: 'f439', acceptedStyles: ['solid'] },
        'chess-bishop': { hexCode: 'f43a', acceptedStyles: ['solid', 'regular'] },
        'chess-board': { hexCode: 'f43c', acceptedStyles: ['solid'] },
        'chess-king': { hexCode: 'f43f', acceptedStyles: ['solid', 'regular'] },
        'chess-knight': { hexCode: 'f441', acceptedStyles: ['solid', 'regular'] },
        'chess-pawn': { hexCode: 'f443', acceptedStyles: ['solid', 'regular'] },
        'chess-queen': { hexCode: 'f445', acceptedStyles: ['solid', 'regular'] },
        'chess-rook': { hexCode: 'f447', acceptedStyles: ['solid', 'regular'] },
        'chevron-down': { hexCode: 'f078', acceptedStyles: ['solid'] },
        'chevron-left': { hexCode: 'f053', acceptedStyles: ['solid'] },
        'chevron-right': { hexCode: 'f054', acceptedStyles: ['solid'] },
        'chevron-up': { hexCode: 'f077', acceptedStyles: ['solid'] },
        'child': { hexCode: 'f1ae', acceptedStyles: ['solid'] },
        'child-combatant': { hexCode: 'e4e0', acceptedStyles: ['solid'] },
        'child-dress': { hexCode: 'e59c', acceptedStyles: ['solid'] },
        'child-reaching': { hexCode: 'e59d', acceptedStyles: ['solid'] },
        'children': { hexCode: 'e4e1', acceptedStyles: ['solid'] },
        'chrome': { hexCode: 'f268', acceptedStyles: ['brands'] },
        'chromecast': { hexCode: 'f838', acceptedStyles: ['brands'] },
        'church': { hexCode: 'f51d', acceptedStyles: ['solid'] },
        'circle': { hexCode: 'f111', acceptedStyles: ['solid', 'regular'] },
        'circle-arrow-down': { hexCode: 'f0ab', acceptedStyles: ['solid'] },
        'circle-arrow-left': { hexCode: 'f0a8', acceptedStyles: ['solid'] },
        'circle-arrow-right': { hexCode: 'f0a9', acceptedStyles: ['solid'] },
        'circle-arrow-up': { hexCode: 'f0aa', acceptedStyles: ['solid'] },
        'circle-check': { hexCode: 'f058', acceptedStyles: ['solid', 'regular'] },
        'circle-chevron-down': { hexCode: 'f13a', acceptedStyles: ['solid'] },
        'circle-chevron-left': { hexCode: 'f137', acceptedStyles: ['solid'] },
        'circle-chevron-right': { hexCode: 'f138', acceptedStyles: ['solid'] },
        'circle-chevron-up': { hexCode: 'f139', acceptedStyles: ['solid'] },
        'circle-dollar-to-slot': { hexCode: 'f4b9', acceptedStyles: ['solid'] },
        'circle-dot': { hexCode: 'f192', acceptedStyles: ['solid', 'regular'] },
        'circle-down': { hexCode: 'f358', acceptedStyles: ['solid', 'regular'] },
        'circle-exclamation': { hexCode: 'f06a', acceptedStyles: ['solid'] },
        'circle-h': { hexCode: 'f47e', acceptedStyles: ['solid'] },
        'circle-half-stroke': { hexCode: 'f042', acceptedStyles: ['solid'] },
        'circle-info': { hexCode: 'f05a', acceptedStyles: ['solid'] },
        'circle-left': { hexCode: 'f359', acceptedStyles: ['solid', 'regular'] },
        'circle-minus': { hexCode: 'f056', acceptedStyles: ['solid'] },
        'circle-nodes': { hexCode: 'e4e2', acceptedStyles: ['solid'] },
        'circle-notch': { hexCode: 'f1ce', acceptedStyles: ['solid'] },
        'circle-pause': { hexCode: 'f28b', acceptedStyles: ['solid', 'regular'] },
        'circle-play': { hexCode: 'f144', acceptedStyles: ['solid', 'regular'] },
        'circle-plus': { hexCode: 'f055', acceptedStyles: ['solid'] },
        'circle-question': { hexCode: 'f059', acceptedStyles: ['solid', 'regular'] },
        'circle-radiation': { hexCode: 'f7ba', acceptedStyles: ['solid'] },
        'circle-right': { hexCode: 'f35a', acceptedStyles: ['solid', 'regular'] },
        'circle-stop': { hexCode: 'f28d', acceptedStyles: ['solid', 'regular'] },
        'circle-up': { hexCode: 'f35b', acceptedStyles: ['solid', 'regular'] },
        'circle-user': { hexCode: 'f2bd', acceptedStyles: ['solid', 'regular'] },
        'circle-xmark': { hexCode: 'f057', acceptedStyles: ['solid', 'regular'] },
        'city': { hexCode: 'f64f', acceptedStyles: ['solid'] },
        'clapperboard': { hexCode: 'e131', acceptedStyles: ['solid'] },
        'clipboard': { hexCode: 'f328', acceptedStyles: ['solid', 'regular'] },
        'clipboard-check': { hexCode: 'f46c', acceptedStyles: ['solid'] },
        'clipboard-list': { hexCode: 'f46d', acceptedStyles: ['solid'] },
        'clipboard-question': { hexCode: 'e4e3', acceptedStyles: ['solid'] },
        'clipboard-user': { hexCode: 'f7f3', acceptedStyles: ['solid'] },
        'clock': { hexCode: 'f017', acceptedStyles: ['solid', 'regular'] },
        'clock-rotate-left': { hexCode: 'f1da', acceptedStyles: ['solid'] },
        'clone': { hexCode: 'f24d', acceptedStyles: ['solid', 'regular'] },
        'closed-captioning': { hexCode: 'f20a', acceptedStyles: ['solid', 'regular'] },
        'cloud': { hexCode: 'f0c2', acceptedStyles: ['solid', 'regular'] },
        'cloud-arrow-down': { hexCode: 'f0ed', acceptedStyles: ['solid'] },
        'cloud-arrow-up': { hexCode: 'f0ee', acceptedStyles: ['solid'] },
        'cloud-bolt': { hexCode: 'f76c', acceptedStyles: ['solid'] },
        'cloud-meatball': { hexCode: 'f73b', acceptedStyles: ['solid'] },
        'cloud-moon': { hexCode: 'f6c3', acceptedStyles: ['solid'] },
        'cloud-moon-rain': { hexCode: 'f73c', acceptedStyles: ['solid'] },
        'cloud-rain': { hexCode: 'f73d', acceptedStyles: ['solid'] },
        'cloud-showers-heavy': { hexCode: 'f740', acceptedStyles: ['solid'] },
        'cloud-showers-water': { hexCode: 'e4e4', acceptedStyles: ['solid'] },
        'cloud-sun': { hexCode: 'f6c4', acceptedStyles: ['solid'] },
        'cloud-sun-rain': { hexCode: 'f743', acceptedStyles: ['solid'] },
        'cloudflare': { hexCode: 'e07d', acceptedStyles: ['brands'] },
        'cloudscale': { hexCode: 'f383', acceptedStyles: ['brands'] },
        'cloudsmith': { hexCode: 'f384', acceptedStyles: ['brands'] },
        'cloudversify': { hexCode: 'f385', acceptedStyles: ['brands'] },
        'clover': { hexCode: 'e139', acceptedStyles: ['solid'] },
        'cmplid': { hexCode: 'e360', acceptedStyles: ['brands'] },
        'code': { hexCode: 'f121', acceptedStyles: ['solid'] },
        'code-branch': { hexCode: 'f126', acceptedStyles: ['solid'] },
        'code-commit': { hexCode: 'f386', acceptedStyles: ['solid'] },
        'code-compare': { hexCode: 'e13a', acceptedStyles: ['solid'] },
        'code-fork': { hexCode: 'e13b', acceptedStyles: ['solid'] },
        'code-merge': { hexCode: 'f387', acceptedStyles: ['solid'] },
        'code-pull-request': { hexCode: 'e13c', acceptedStyles: ['solid'] },
        'codepen': { hexCode: 'f1cb', acceptedStyles: ['brands'] },
        'codiepie': { hexCode: 'f284', acceptedStyles: ['brands'] },
        'coins': { hexCode: 'f51e', acceptedStyles: ['solid'] },
        'colon-sign': { hexCode: 'e140', acceptedStyles: ['solid'] },
        'comment': { hexCode: 'f075', acceptedStyles: ['solid', 'regular'] },
        'comment-dollar': { hexCode: 'f651', acceptedStyles: ['solid'] },
        'comment-dots': { hexCode: 'f4ad', acceptedStyles: ['solid', 'regular'] },
        'comment-medical': { hexCode: 'f7f5', acceptedStyles: ['solid'] },
        'comment-nodes': { hexCode: 'e696', acceptedStyles: ['solid'] },
        'comment-slash': { hexCode: 'f4b3', acceptedStyles: ['solid'] },
        'comment-sms': { hexCode: 'f7cd', acceptedStyles: ['solid'] },
        'comments': { hexCode: 'f086', acceptedStyles: ['solid', 'regular'] },
        'comments-dollar': { hexCode: 'f653', acceptedStyles: ['solid'] },
        'compact-disc': { hexCode: 'f51f', acceptedStyles: ['solid'] },
        'compass': { hexCode: 'f14e', acceptedStyles: ['solid', 'regular'] },
        'compass-drafting': { hexCode: 'f568', acceptedStyles: ['solid'] },
        'compress': { hexCode: 'f066', acceptedStyles: ['solid'] },
        'computer': { hexCode: 'e4e5', acceptedStyles: ['solid'] },
        'computer-mouse': { hexCode: 'f8cc', acceptedStyles: ['solid'] },
        'confluence': { hexCode: 'f78d', acceptedStyles: ['brands'] },
        'connectdevelop': { hexCode: 'f20e', acceptedStyles: ['brands'] },
        'contao': { hexCode: 'f26d', acceptedStyles: ['brands'] },
        'cookie': { hexCode: 'f563', acceptedStyles: ['solid'] },
        'cookie-bite': { hexCode: 'f564', acceptedStyles: ['solid'] },
        'copy': { hexCode: 'f0c5', acceptedStyles: ['solid', 'regular'] },
        'copyright': { hexCode: 'f1f9', acceptedStyles: ['solid', 'regular'] },
        'cotton-bureau': { hexCode: 'f89e', acceptedStyles: ['brands'] },
        'couch': { hexCode: 'f4b8', acceptedStyles: ['solid'] },
        'cow': { hexCode: 'f6c8', acceptedStyles: ['solid'] },
        'cpanel': { hexCode: 'f388', acceptedStyles: ['brands'] },
        'creative-commons': { hexCode: 'f25e', acceptedStyles: ['brands'] },
        'creative-commons-by': { hexCode: 'f4e7', acceptedStyles: ['brands'] },
        'creative-commons-nc': { hexCode: 'f4e8', acceptedStyles: ['brands'] },
        'creative-commons-nc-eu': { hexCode: 'f4e9', acceptedStyles: ['brands'] },
        'creative-commons-nc-jp': { hexCode: 'f4ea', acceptedStyles: ['brands'] },
        'creative-commons-nd': { hexCode: 'f4eb', acceptedStyles: ['brands'] },
        'creative-commons-pd': { hexCode: 'f4ec', acceptedStyles: ['brands'] },
        'creative-commons-pd-alt': { hexCode: 'f4ed', acceptedStyles: ['brands'] },
        'creative-commons-remix': { hexCode: 'f4ee', acceptedStyles: ['brands'] },
        'creative-commons-sa': { hexCode: 'f4ef', acceptedStyles: ['brands'] },
        'creative-commons-sampling': { hexCode: 'f4f0', acceptedStyles: ['brands'] },
        'creative-commons-sampling-plus': { hexCode: 'f4f1', acceptedStyles: ['brands'] },
        'creative-commons-share': { hexCode: 'f4f2', acceptedStyles: ['brands'] },
        'creative-commons-zero': { hexCode: 'f4f3', acceptedStyles: ['brands'] },
        'credit-card': { hexCode: 'f09d', acceptedStyles: ['solid', 'regular'] },
        'critical-role': { hexCode: 'f6c9', acceptedStyles: ['brands'] },
        'crop': { hexCode: 'f125', acceptedStyles: ['solid'] },
        'crop-simple': { hexCode: 'f565', acceptedStyles: ['solid'] },
        'cross': { hexCode: 'f654', acceptedStyles: ['solid'] },
        'crosshairs': { hexCode: 'f05b', acceptedStyles: ['solid'] },
        'crow': { hexCode: 'f520', acceptedStyles: ['solid'] },
        'crown': { hexCode: 'f521', acceptedStyles: ['solid'] },
        'crutch': { hexCode: 'f7f7', acceptedStyles: ['solid'] },
        'cruzeiro-sign': { hexCode: 'e152', acceptedStyles: ['solid'] },
        'css': { hexCode: 'e6a2', acceptedStyles: ['brands'] },
        'css3': { hexCode: 'f13c', acceptedStyles: ['brands'] },
        'css3-alt': { hexCode: 'f38b', acceptedStyles: ['brands'] },
        'cube': { hexCode: 'f1b2', acceptedStyles: ['solid'] },
        'cubes': { hexCode: 'f1b3', acceptedStyles: ['solid'] },
        'cubes-stacked': { hexCode: 'e4e6', acceptedStyles: ['solid'] },
        'cuttlefish': { hexCode: 'f38c', acceptedStyles: ['brands'] },
        'd': { hexCode: '44', acceptedStyles: ['solid'] },
        'd-and-d': { hexCode: 'f38d', acceptedStyles: ['brands'] },
        'd-and-d-beyond': { hexCode: 'f6ca', acceptedStyles: ['brands'] },
        'dailymotion': { hexCode: 'e052', acceptedStyles: ['brands'] },
        'dart-lang': { hexCode: 'e693', acceptedStyles: ['brands'] },
        'dashcube': { hexCode: 'f210', acceptedStyles: ['brands'] },
        'database': { hexCode: 'f1c0', acceptedStyles: ['solid'] },
        'debian': { hexCode: 'e60b', acceptedStyles: ['brands'] },
        'deezer': { hexCode: 'e077', acceptedStyles: ['brands'] },
        'delete-left': { hexCode: 'f55a', acceptedStyles: ['solid'] },
        'delicious': { hexCode: 'f1a5', acceptedStyles: ['brands'] },
        'democrat': { hexCode: 'f747', acceptedStyles: ['solid'] },
        'deploydog': { hexCode: 'f38e', acceptedStyles: ['brands'] },
        'deskpro': { hexCode: 'f38f', acceptedStyles: ['brands'] },
        'desktop': { hexCode: 'f390', acceptedStyles: ['solid'] },
        'dev': { hexCode: 'f6cc', acceptedStyles: ['brands'] },
        'deviantart': { hexCode: 'f1bd', acceptedStyles: ['brands'] },
        'dharmachakra': { hexCode: 'f655', acceptedStyles: ['solid'] },
        'dhl': { hexCode: 'f790', acceptedStyles: ['brands'] },
        'diagram-next': { hexCode: 'e476', acceptedStyles: ['solid'] },
        'diagram-predecessor': { hexCode: 'e477', acceptedStyles: ['solid'] },
        'diagram-project': { hexCode: 'f542', acceptedStyles: ['solid'] },
        'diagram-successor': { hexCode: 'e47a', acceptedStyles: ['solid'] },
        'diamond': { hexCode: 'f219', acceptedStyles: ['solid'] },
        'diamond-turn-right': { hexCode: 'f5eb', acceptedStyles: ['solid'] },
        'diaspora': { hexCode: 'f791', acceptedStyles: ['brands'] },
        'dice': { hexCode: 'f522', acceptedStyles: ['solid'] },
        'dice-d20': { hexCode: 'f6cf', acceptedStyles: ['solid'] },
        'dice-d6': { hexCode: 'f6d1', acceptedStyles: ['solid'] },
        'dice-five': { hexCode: 'f523', acceptedStyles: ['solid'] },
        'dice-four': { hexCode: 'f524', acceptedStyles: ['solid'] },
        'dice-one': { hexCode: 'f525', acceptedStyles: ['solid'] },
        'dice-six': { hexCode: 'f526', acceptedStyles: ['solid'] },
        'dice-three': { hexCode: 'f527', acceptedStyles: ['solid'] },
        'dice-two': { hexCode: 'f528', acceptedStyles: ['solid'] },
        'digg': { hexCode: 'f1a6', acceptedStyles: ['brands'] },
        'digital-ocean': { hexCode: 'f391', acceptedStyles: ['brands'] },
        'discord': { hexCode: 'f392', acceptedStyles: ['brands'] },
        'discourse': { hexCode: 'f393', acceptedStyles: ['brands'] },
        'disease': { hexCode: 'f7fa', acceptedStyles: ['solid'] },
        'display': { hexCode: 'e163', acceptedStyles: ['solid'] },
        'disqus': { hexCode: 'e7d5', acceptedStyles: ['brands'] },
        'divide': { hexCode: 'f529', acceptedStyles: ['solid'] },
        'dna': { hexCode: 'f471', acceptedStyles: ['solid'] },
        'dochub': { hexCode: 'f394', acceptedStyles: ['brands'] },
        'docker': { hexCode: 'f395', acceptedStyles: ['brands'] },
        'dog': { hexCode: 'f6d3', acceptedStyles: ['solid'] },
        'dollar-sign': { hexCode: '24', acceptedStyles: ['solid'] },
        'dolly': { hexCode: 'f472', acceptedStyles: ['solid'] },
        'dong-sign': { hexCode: 'e169', acceptedStyles: ['solid'] },
        'door-closed': { hexCode: 'f52a', acceptedStyles: ['solid'] },
        'door-open': { hexCode: 'f52b', acceptedStyles: ['solid'] },
        'dove': { hexCode: 'f4ba', acceptedStyles: ['solid'] },
        'down-left-and-up-right-to-center': { hexCode: 'f422', acceptedStyles: ['solid'] },
        'down-long': { hexCode: 'f309', acceptedStyles: ['solid'] },
        'download': { hexCode: 'f019', acceptedStyles: ['solid'] },
        'draft2digital': { hexCode: 'f396', acceptedStyles: ['brands'] },
        'dragon': { hexCode: 'f6d5', acceptedStyles: ['solid'] },
        'draw-polygon': { hexCode: 'f5ee', acceptedStyles: ['solid'] },
        'dribbble': { hexCode: 'f17d', acceptedStyles: ['brands'] },
        'dropbox': { hexCode: 'f16b', acceptedStyles: ['brands'] },
        'droplet': { hexCode: 'f043', acceptedStyles: ['solid'] },
        'droplet-slash': { hexCode: 'f5c7', acceptedStyles: ['solid'] },
        'drum': { hexCode: 'f569', acceptedStyles: ['solid'] },
        'drum-steelpan': { hexCode: 'f56a', acceptedStyles: ['solid'] },
        'drumstick-bite': { hexCode: 'f6d7', acceptedStyles: ['solid'] },
        'drupal': { hexCode: 'f1a9', acceptedStyles: ['brands'] },
        'dumbbell': { hexCode: 'f44b', acceptedStyles: ['solid'] },
        'dumpster': { hexCode: 'f793', acceptedStyles: ['solid'] },
        'dumpster-fire': { hexCode: 'f794', acceptedStyles: ['solid'] },
        'dungeon': { hexCode: 'f6d9', acceptedStyles: ['solid'] },
        'duolingo': { hexCode: 'e812', acceptedStyles: ['brands'] },
        'dyalog': { hexCode: 'f399', acceptedStyles: ['brands'] },
        'e': { hexCode: '45', acceptedStyles: ['solid'] },
        'ear-deaf': { hexCode: 'f2a4', acceptedStyles: ['solid'] },
        'ear-listen': { hexCode: 'f2a2', acceptedStyles: ['solid'] },
        'earlybirds': { hexCode: 'f39a', acceptedStyles: ['brands'] },
        'earth-africa': { hexCode: 'f57c', acceptedStyles: ['solid'] },
        'earth-americas': { hexCode: 'f57d', acceptedStyles: ['solid'] },
        'earth-asia': { hexCode: 'f57e', acceptedStyles: ['solid'] },
        'earth-europe': { hexCode: 'f7a2', acceptedStyles: ['solid'] },
        'earth-oceania': { hexCode: 'e47b', acceptedStyles: ['solid'] },
        'ebay': { hexCode: 'f4f4', acceptedStyles: ['brands'] },
        'edge': { hexCode: 'f282', acceptedStyles: ['brands'] },
        'edge-legacy': { hexCode: 'e078', acceptedStyles: ['brands'] },
        'egg': { hexCode: 'f7fb', acceptedStyles: ['solid'] },
        'eject': { hexCode: 'f052', acceptedStyles: ['solid'] },
        'elementor': { hexCode: 'f430', acceptedStyles: ['brands'] },
        'elevator': { hexCode: 'e16d', acceptedStyles: ['solid'] },
        'eleventy': { hexCode: 'e7d6', acceptedStyles: ['brands'] },
        'ellipsis': { hexCode: 'f141', acceptedStyles: ['solid'] },
        'ellipsis-vertical': { hexCode: 'f142', acceptedStyles: ['solid'] },
        'ello': { hexCode: 'f5f1', acceptedStyles: ['brands'] },
        'ember': { hexCode: 'f423', acceptedStyles: ['brands'] },
        'empire': { hexCode: 'f1d1', acceptedStyles: ['brands'] },
        'envelope': { hexCode: 'f0e0', acceptedStyles: ['solid', 'regular'] },
        'envelope-circle-check': { hexCode: 'e4e8', acceptedStyles: ['solid'] },
        'envelope-open': { hexCode: 'f2b6', acceptedStyles: ['solid', 'regular'] },
        'envelope-open-text': { hexCode: 'f658', acceptedStyles: ['solid'] },
        'envelopes-bulk': { hexCode: 'f674', acceptedStyles: ['solid'] },
        'envira': { hexCode: 'f299', acceptedStyles: ['brands'] },
        'equals': { hexCode: '3d', acceptedStyles: ['solid'] },
        'eraser': { hexCode: 'f12d', acceptedStyles: ['solid'] },
        'erlang': { hexCode: 'f39d', acceptedStyles: ['brands'] },
        'ethereum': { hexCode: 'f42e', acceptedStyles: ['brands'] },
        'ethernet': { hexCode: 'f796', acceptedStyles: ['solid'] },
        'etsy': { hexCode: 'f2d7', acceptedStyles: ['brands'] },
        'euro-sign': { hexCode: 'f153', acceptedStyles: ['solid'] },
        'evernote': { hexCode: 'f839', acceptedStyles: ['brands'] },
        'exclamation': { hexCode: '21', acceptedStyles: ['solid'] },
        'expand': { hexCode: 'f065', acceptedStyles: ['solid'] },
        'expeditedssl': { hexCode: 'f23e', acceptedStyles: ['brands'] },
        'explosion': { hexCode: 'e4e9', acceptedStyles: ['solid'] },
        'eye': { hexCode: 'f06e', acceptedStyles: ['solid', 'regular'] },
        'eye-dropper': { hexCode: 'f1fb', acceptedStyles: ['solid'] },
        'eye-low-vision': { hexCode: 'f2a8', acceptedStyles: ['solid'] },
        'eye-slash': { hexCode: 'f070', acceptedStyles: ['solid', 'regular'] },
        'f': { hexCode: '46', acceptedStyles: ['solid'] },
        'face-angry': { hexCode: 'f556', acceptedStyles: ['solid', 'regular'] },
        'face-dizzy': { hexCode: 'f567', acceptedStyles: ['solid', 'regular'] },
        'face-flushed': { hexCode: 'f579', acceptedStyles: ['solid', 'regular'] },
        'face-frown': { hexCode: 'f119', acceptedStyles: ['solid', 'regular'] },
        'face-frown-open': { hexCode: 'f57a', acceptedStyles: ['solid', 'regular'] },
        'face-grimace': { hexCode: 'f57f', acceptedStyles: ['solid', 'regular'] },
        'face-grin': { hexCode: 'f580', acceptedStyles: ['solid', 'regular'] },
        'face-grin-beam': { hexCode: 'f582', acceptedStyles: ['solid', 'regular'] },
        'face-grin-beam-sweat': { hexCode: 'f583', acceptedStyles: ['solid', 'regular'] },
        'face-grin-hearts': { hexCode: 'f584', acceptedStyles: ['solid', 'regular'] },
        'face-grin-squint': { hexCode: 'f585', acceptedStyles: ['solid', 'regular'] },
        'face-grin-squint-tears': { hexCode: 'f586', acceptedStyles: ['solid', 'regular'] },
        'face-grin-stars': { hexCode: 'f587', acceptedStyles: ['solid', 'regular'] },
        'face-grin-tears': { hexCode: 'f588', acceptedStyles: ['solid', 'regular'] },
        'face-grin-tongue': { hexCode: 'f589', acceptedStyles: ['solid', 'regular'] },
        'face-grin-tongue-squint': { hexCode: 'f58a', acceptedStyles: ['solid', 'regular'] },
        'face-grin-tongue-wink': { hexCode: 'f58b', acceptedStyles: ['solid', 'regular'] },
        'face-grin-wide': { hexCode: 'f581', acceptedStyles: ['solid', 'regular'] },
        'face-grin-wink': { hexCode: 'f58c', acceptedStyles: ['solid', 'regular'] },
        'face-kiss': { hexCode: 'f596', acceptedStyles: ['solid', 'regular'] },
        'face-kiss-beam': { hexCode: 'f597', acceptedStyles: ['solid', 'regular'] },
        'face-kiss-wink-heart': { hexCode: 'f598', acceptedStyles: ['solid', 'regular'] },
        'face-laugh': { hexCode: 'f599', acceptedStyles: ['solid', 'regular'] },
        'face-laugh-beam': { hexCode: 'f59a', acceptedStyles: ['solid', 'regular'] },
        'face-laugh-squint': { hexCode: 'f59b', acceptedStyles: ['solid', 'regular'] },
        'face-laugh-wink': { hexCode: 'f59c', acceptedStyles: ['solid', 'regular'] },
        'face-meh': { hexCode: 'f11a', acceptedStyles: ['solid', 'regular'] },
        'face-meh-blank': { hexCode: 'f5a4', acceptedStyles: ['solid', 'regular'] },
        'face-rolling-eyes': { hexCode: 'f5a5', acceptedStyles: ['solid', 'regular'] },
        'face-sad-cry': { hexCode: 'f5b3', acceptedStyles: ['solid', 'regular'] },
        'face-sad-tear': { hexCode: 'f5b4', acceptedStyles: ['solid', 'regular'] },
        'face-smile': { hexCode: 'f118', acceptedStyles: ['solid', 'regular'] },
        'face-smile-beam': { hexCode: 'f5b8', acceptedStyles: ['solid', 'regular'] },
        'face-smile-wink': { hexCode: 'f4da', acceptedStyles: ['solid', 'regular'] },
        'face-surprise': { hexCode: 'f5c2', acceptedStyles: ['solid', 'regular'] },
        'face-tired': { hexCode: 'f5c8', acceptedStyles: ['solid', 'regular'] },
        'facebook': { hexCode: 'f09a', acceptedStyles: ['brands'] },
        'facebook-f': { hexCode: 'f39e', acceptedStyles: ['brands'] },
        'facebook-messenger': { hexCode: 'f39f', acceptedStyles: ['brands'] },
        'fan': { hexCode: 'f863', acceptedStyles: ['solid'] },
        'fantasy-flight-games': { hexCode: 'f6dc', acceptedStyles: ['brands'] },
        'faucet': { hexCode: 'e005', acceptedStyles: ['solid'] },
        'faucet-drip': { hexCode: 'e006', acceptedStyles: ['solid'] },
        'fax': { hexCode: 'f1ac', acceptedStyles: ['solid'] },
        'feather': { hexCode: 'f52d', acceptedStyles: ['solid'] },
        'feather-pointed': { hexCode: 'f56b', acceptedStyles: ['solid'] },
        'fedex': { hexCode: 'f797', acceptedStyles: ['brands'] },
        'fedora': { hexCode: 'f798', acceptedStyles: ['brands'] },
        'ferry': { hexCode: 'e4ea', acceptedStyles: ['solid'] },
        'figma': { hexCode: 'f799', acceptedStyles: ['brands'] },
        'file': { hexCode: 'f15b', acceptedStyles: ['solid', 'regular'] },
        'file-arrow-down': { hexCode: 'f56d', acceptedStyles: ['solid'] },
        'file-arrow-up': { hexCode: 'f574', acceptedStyles: ['solid'] },
        'file-audio': { hexCode: 'f1c7', acceptedStyles: ['solid', 'regular'] },
        'file-circle-check': { hexCode: 'e5a0', acceptedStyles: ['solid'] },
        'file-circle-exclamation': { hexCode: 'e4eb', acceptedStyles: ['solid'] },
        'file-circle-minus': { hexCode: 'e4ed', acceptedStyles: ['solid'] },
        'file-circle-plus': { hexCode: 'e494', acceptedStyles: ['solid'] },
        'file-circle-question': { hexCode: 'e4ef', acceptedStyles: ['solid'] },
        'file-circle-xmark': { hexCode: 'e5a1', acceptedStyles: ['solid'] },
        'file-code': { hexCode: 'f1c9', acceptedStyles: ['solid', 'regular'] },
        'file-contract': { hexCode: 'f56c', acceptedStyles: ['solid'] },
        'file-csv': { hexCode: 'f6dd', acceptedStyles: ['solid'] },
        'file-excel': { hexCode: 'f1c3', acceptedStyles: ['solid', 'regular'] },
        'file-export': { hexCode: 'f56e', acceptedStyles: ['solid'] },
        'file-fragment': { hexCode: 'e697', acceptedStyles: ['solid'] },
        'file-half-dashed': { hexCode: 'e698', acceptedStyles: ['solid'] },
        'file-image': { hexCode: 'f1c5', acceptedStyles: ['solid', 'regular'] },
        'file-import': { hexCode: 'f56f', acceptedStyles: ['solid'] },
        'file-invoice': { hexCode: 'f570', acceptedStyles: ['solid'] },
        'file-invoice-dollar': { hexCode: 'f571', acceptedStyles: ['solid'] },
        'file-lines': { hexCode: 'f15c', acceptedStyles: ['solid', 'regular'] },
        'file-medical': { hexCode: 'f477', acceptedStyles: ['solid'] },
        'file-pdf': { hexCode: 'f1c1', acceptedStyles: ['solid', 'regular'] },
        'file-pen': { hexCode: 'f31c', acceptedStyles: ['solid'] },
        'file-powerpoint': { hexCode: 'f1c4', acceptedStyles: ['solid', 'regular'] },
        'file-prescription': { hexCode: 'f572', acceptedStyles: ['solid'] },
        'file-shield': { hexCode: 'e4f0', acceptedStyles: ['solid'] },
        'file-signature': { hexCode: 'f573', acceptedStyles: ['solid'] },
        'file-video': { hexCode: 'f1c8', acceptedStyles: ['solid', 'regular'] },
        'file-waveform': { hexCode: 'f478', acceptedStyles: ['solid'] },
        'file-word': { hexCode: 'f1c2', acceptedStyles: ['solid', 'regular'] },
        'file-zipper': { hexCode: 'f1c6', acceptedStyles: ['solid', 'regular'] },
        'files-pinwheel': { hexCode: 'e69f', acceptedStyles: ['brands'] },
        'fill': { hexCode: 'f575', acceptedStyles: ['solid'] },
        'fill-drip': { hexCode: 'f576', acceptedStyles: ['solid'] },
        'film': { hexCode: 'f008', acceptedStyles: ['solid'] },
        'filter': { hexCode: 'f0b0', acceptedStyles: ['solid'] },
        'filter-circle-dollar': { hexCode: 'f662', acceptedStyles: ['solid'] },
        'filter-circle-xmark': { hexCode: 'e17b', acceptedStyles: ['solid'] },
        'fingerprint': { hexCode: 'f577', acceptedStyles: ['solid'] },
        'fire': { hexCode: 'f06d', acceptedStyles: ['solid'] },
        'fire-burner': { hexCode: 'e4f1', acceptedStyles: ['solid'] },
        'fire-extinguisher': { hexCode: 'f134', acceptedStyles: ['solid'] },
        'fire-flame-curved': { hexCode: 'f7e4', acceptedStyles: ['solid'] },
        'fire-flame-simple': { hexCode: 'f46a', acceptedStyles: ['solid'] },
        'firefox': { hexCode: 'f269', acceptedStyles: ['brands'] },
        'firefox-browser': { hexCode: 'e007', acceptedStyles: ['brands'] },
        'first-order': { hexCode: 'f2b0', acceptedStyles: ['brands'] },
        'first-order-alt': { hexCode: 'f50a', acceptedStyles: ['brands'] },
        'firstdraft': { hexCode: 'f3a1', acceptedStyles: ['brands'] },
        'fish': { hexCode: 'f578', acceptedStyles: ['solid'] },
        'fish-fins': { hexCode: 'e4f2', acceptedStyles: ['solid'] },
        'flag': { hexCode: 'f024', acceptedStyles: ['solid', 'regular'] },
        'flag-checkered': { hexCode: 'f11e', acceptedStyles: ['solid'] },
        'flag-usa': { hexCode: 'f74d', acceptedStyles: ['solid'] },
        'flask': { hexCode: 'f0c3', acceptedStyles: ['solid'] },
        'flask-vial': { hexCode: 'e4f3', acceptedStyles: ['solid'] },
        'flickr': { hexCode: 'f16e', acceptedStyles: ['brands'] },
        'flipboard': { hexCode: 'f44d', acceptedStyles: ['brands'] },
        'floppy-disk': { hexCode: 'f0c7', acceptedStyles: ['solid', 'regular'] },
        'florin-sign': { hexCode: 'e184', acceptedStyles: ['solid'] },
        'flutter': { hexCode: 'e694', acceptedStyles: ['brands'] },
        'fly': { hexCode: 'f417', acceptedStyles: ['brands'] },
        'folder': { hexCode: 'f07b', acceptedStyles: ['solid', 'regular'] },
        'folder-closed': { hexCode: 'e185', acceptedStyles: ['solid', 'regular'] },
        'folder-minus': { hexCode: 'f65d', acceptedStyles: ['solid'] },
        'folder-open': { hexCode: 'f07c', acceptedStyles: ['solid', 'regular'] },
        'folder-plus': { hexCode: 'f65e', acceptedStyles: ['solid'] },
        'folder-tree': { hexCode: 'f802', acceptedStyles: ['solid'] },
        'font': { hexCode: 'f031', acceptedStyles: ['solid'] },
        'font-awesome': { hexCode: 'f2b4', acceptedStyles: ['solid', 'regular', 'brands'] },
        'fonticons': { hexCode: 'f280', acceptedStyles: ['brands'] },
        'fonticons-fi': { hexCode: 'f3a2', acceptedStyles: ['brands'] },
        'football': { hexCode: 'f44e', acceptedStyles: ['solid'] },
        'fort-awesome': { hexCode: 'f286', acceptedStyles: ['brands'] },
        'fort-awesome-alt': { hexCode: 'f3a3', acceptedStyles: ['brands'] },
        'forumbee': { hexCode: 'f211', acceptedStyles: ['brands'] },
        'forward': { hexCode: 'f04e', acceptedStyles: ['solid'] },
        'forward-fast': { hexCode: 'f050', acceptedStyles: ['solid'] },
        'forward-step': { hexCode: 'f051', acceptedStyles: ['solid'] },
        'foursquare': { hexCode: 'f180', acceptedStyles: ['brands'] },
        'franc-sign': { hexCode: 'e18f', acceptedStyles: ['solid'] },
        'free-code-camp': { hexCode: 'f2c5', acceptedStyles: ['brands'] },
        'freebsd': { hexCode: 'f3a4', acceptedStyles: ['brands'] },
        'frog': { hexCode: 'f52e', acceptedStyles: ['solid'] },
        'fulcrum': { hexCode: 'f50b', acceptedStyles: ['brands'] },
        'futbol': { hexCode: 'f1e3', acceptedStyles: ['solid', 'regular'] },
        'g': { hexCode: '47', acceptedStyles: ['solid'] },
        'galactic-republic': { hexCode: 'f50c', acceptedStyles: ['brands'] },
        'galactic-senate': { hexCode: 'f50d', acceptedStyles: ['brands'] },
        'gamepad': { hexCode: 'f11b', acceptedStyles: ['solid'] },
        'gas-pump': { hexCode: 'f52f', acceptedStyles: ['solid'] },
        'gauge': { hexCode: 'f624', acceptedStyles: ['solid'] },
        'gauge-high': { hexCode: 'f625', acceptedStyles: ['solid'] },
        'gauge-simple': { hexCode: 'f629', acceptedStyles: ['solid'] },
        'gauge-simple-high': { hexCode: 'f62a', acceptedStyles: ['solid'] },
        'gavel': { hexCode: 'f0e3', acceptedStyles: ['solid'] },
        'gear': { hexCode: 'f013', acceptedStyles: ['solid'] },
        'gears': { hexCode: 'f085', acceptedStyles: ['solid'] },
        'gem': { hexCode: 'f3a5', acceptedStyles: ['solid', 'regular'] },
        'genderless': { hexCode: 'f22d', acceptedStyles: ['solid'] },
        'get-pocket': { hexCode: 'f265', acceptedStyles: ['brands'] },
        'gg': { hexCode: 'f260', acceptedStyles: ['brands'] },
        'gg-circle': { hexCode: 'f261', acceptedStyles: ['brands'] },
        'ghost': { hexCode: 'f6e2', acceptedStyles: ['solid'] },
        'gift': { hexCode: 'f06b', acceptedStyles: ['solid'] },
        'gifts': { hexCode: 'f79c', acceptedStyles: ['solid'] },
        'git': { hexCode: 'f1d3', acceptedStyles: ['brands'] },
        'git-alt': { hexCode: 'f841', acceptedStyles: ['brands'] },
        'github': { hexCode: 'f09b', acceptedStyles: ['brands'] },
        'github-alt': { hexCode: 'f113', acceptedStyles: ['brands'] },
        'gitkraken': { hexCode: 'f3a6', acceptedStyles: ['brands'] },
        'gitlab': { hexCode: 'f296', acceptedStyles: ['brands'] },
        'gitter': { hexCode: 'f426', acceptedStyles: ['brands'] },
        'glass-water': { hexCode: 'e4f4', acceptedStyles: ['solid'] },
        'glass-water-droplet': { hexCode: 'e4f5', acceptedStyles: ['solid'] },
        'glasses': { hexCode: 'f530', acceptedStyles: ['solid'] },
        'glide': { hexCode: 'f2a5', acceptedStyles: ['brands'] },
        'glide-g': { hexCode: 'f2a6', acceptedStyles: ['brands'] },
        'globe': { hexCode: 'f0ac', acceptedStyles: ['solid'] },
        'gofore': { hexCode: 'f3a7', acceptedStyles: ['brands'] },
        'golang': { hexCode: 'e40f', acceptedStyles: ['brands'] },
        'golf-ball-tee': { hexCode: 'f450', acceptedStyles: ['solid'] },
        'goodreads': { hexCode: 'f3a8', acceptedStyles: ['brands'] },
        'goodreads-g': { hexCode: 'f3a9', acceptedStyles: ['brands'] },
        'google': { hexCode: 'f1a0', acceptedStyles: ['brands'] },
        'google-drive': { hexCode: 'f3aa', acceptedStyles: ['brands'] },
        'google-pay': { hexCode: 'e079', acceptedStyles: ['brands'] },
        'google-play': { hexCode: 'f3ab', acceptedStyles: ['brands'] },
        'google-plus': { hexCode: 'f2b3', acceptedStyles: ['brands'] },
        'google-plus-g': { hexCode: 'f0d5', acceptedStyles: ['brands'] },
        'google-scholar': { hexCode: 'e63b', acceptedStyles: ['brands'] },
        'google-wallet': { hexCode: 'f1ee', acceptedStyles: ['brands'] },
        'gopuram': { hexCode: 'f664', acceptedStyles: ['solid'] },
        'graduation-cap': { hexCode: 'f19d', acceptedStyles: ['solid'] },
        'gratipay': { hexCode: 'f184', acceptedStyles: ['brands'] },
        'grav': { hexCode: 'f2d6', acceptedStyles: ['brands'] },
        'greater-than': { hexCode: '3e', acceptedStyles: ['solid'] },
        'greater-than-equal': { hexCode: 'f532', acceptedStyles: ['solid'] },
        'grip': { hexCode: 'f58d', acceptedStyles: ['solid'] },
        'grip-lines': { hexCode: 'f7a4', acceptedStyles: ['solid'] },
        'grip-lines-vertical': { hexCode: 'f7a5', acceptedStyles: ['solid'] },
        'grip-vertical': { hexCode: 'f58e', acceptedStyles: ['solid'] },
        'gripfire': { hexCode: 'f3ac', acceptedStyles: ['brands'] },
        'group-arrows-rotate': { hexCode: 'e4f6', acceptedStyles: ['solid'] },
        'grunt': { hexCode: 'f3ad', acceptedStyles: ['brands'] },
        'guarani-sign': { hexCode: 'e19a', acceptedStyles: ['solid'] },
        'guilded': { hexCode: 'e07e', acceptedStyles: ['brands'] },
        'guitar': { hexCode: 'f7a6', acceptedStyles: ['solid'] },
        'gulp': { hexCode: 'f3ae', acceptedStyles: ['brands'] },
        'gun': { hexCode: 'e19b', acceptedStyles: ['solid'] },
        'h': { hexCode: '48', acceptedStyles: ['solid'] },
        'hacker-news': { hexCode: 'f1d4', acceptedStyles: ['brands'] },
        'hackerrank': { hexCode: 'f5f7', acceptedStyles: ['brands'] },
        'hammer': { hexCode: 'f6e3', acceptedStyles: ['solid'] },
        'hamsa': { hexCode: 'f665', acceptedStyles: ['solid'] },
        'hand': { hexCode: 'f256', acceptedStyles: ['solid', 'regular'] },
        'hand-back-fist': { hexCode: 'f255', acceptedStyles: ['solid', 'regular'] },
        'hand-dots': { hexCode: 'f461', acceptedStyles: ['solid'] },
        'hand-fist': { hexCode: 'f6de', acceptedStyles: ['solid'] },
        'hand-holding': { hexCode: 'f4bd', acceptedStyles: ['solid'] },
        'hand-holding-dollar': { hexCode: 'f4c0', acceptedStyles: ['solid'] },
        'hand-holding-droplet': { hexCode: 'f4c1', acceptedStyles: ['solid'] },
        'hand-holding-hand': { hexCode: 'e4f7', acceptedStyles: ['solid'] },
        'hand-holding-heart': { hexCode: 'f4be', acceptedStyles: ['solid'] },
        'hand-holding-medical': { hexCode: 'e05c', acceptedStyles: ['solid'] },
        'hand-lizard': { hexCode: 'f258', acceptedStyles: ['solid', 'regular'] },
        'hand-middle-finger': { hexCode: 'f806', acceptedStyles: ['solid'] },
        'hand-peace': { hexCode: 'f25b', acceptedStyles: ['solid', 'regular'] },
        'hand-point-down': { hexCode: 'f0a7', acceptedStyles: ['solid', 'regular'] },
        'hand-point-left': { hexCode: 'f0a5', acceptedStyles: ['solid', 'regular'] },
        'hand-point-right': { hexCode: 'f0a4', acceptedStyles: ['solid', 'regular'] },
        'hand-point-up': { hexCode: 'f0a6', acceptedStyles: ['solid', 'regular'] },
        'hand-pointer': { hexCode: 'f25a', acceptedStyles: ['solid', 'regular'] },
        'hand-scissors': { hexCode: 'f257', acceptedStyles: ['solid', 'regular'] },
        'hand-sparkles': { hexCode: 'e05d', acceptedStyles: ['solid'] },
        'hand-spock': { hexCode: 'f259', acceptedStyles: ['solid', 'regular'] },
        'handcuffs': { hexCode: 'e4f8', acceptedStyles: ['solid'] },
        'hands': { hexCode: 'f2a7', acceptedStyles: ['solid'] },
        'hands-asl-interpreting': { hexCode: 'f2a3', acceptedStyles: ['solid'] },
        'hands-bound': { hexCode: 'e4f9', acceptedStyles: ['solid'] },
        'hands-bubbles': { hexCode: 'e05e', acceptedStyles: ['solid'] },
        'hands-clapping': { hexCode: 'e1a8', acceptedStyles: ['solid'] },
        'hands-holding': { hexCode: 'f4c2', acceptedStyles: ['solid'] },
        'hands-holding-child': { hexCode: 'e4fa', acceptedStyles: ['solid'] },
        'hands-holding-circle': { hexCode: 'e4fb', acceptedStyles: ['solid'] },
        'hands-praying': { hexCode: 'f684', acceptedStyles: ['solid'] },
        'handshake': { hexCode: 'f2b5', acceptedStyles: ['solid', 'regular'] },
        'handshake-angle': { hexCode: 'f4c4', acceptedStyles: ['solid'] },
        'handshake-slash': { hexCode: 'e060', acceptedStyles: ['solid'] },
        'hanukiah': { hexCode: 'f6e6', acceptedStyles: ['solid'] },
        'hard-drive': { hexCode: 'f0a0', acceptedStyles: ['solid', 'regular'] },
        'hashnode': { hexCode: 'e499', acceptedStyles: ['brands'] },
        'hashtag': { hexCode: '23', acceptedStyles: ['solid'] },
        'hat-cowboy': { hexCode: 'f8c0', acceptedStyles: ['solid'] },
        'hat-cowboy-side': { hexCode: 'f8c1', acceptedStyles: ['solid'] },
        'hat-wizard': { hexCode: 'f6e8', acceptedStyles: ['solid'] },
        'head-side-cough': { hexCode: 'e061', acceptedStyles: ['solid'] },
        'head-side-cough-slash': { hexCode: 'e062', acceptedStyles: ['solid'] },
        'head-side-mask': { hexCode: 'e063', acceptedStyles: ['solid'] },
        'head-side-virus': { hexCode: 'e064', acceptedStyles: ['solid'] },
        'heading': { hexCode: 'f1dc', acceptedStyles: ['solid'] },
        'headphones': { hexCode: 'f025', acceptedStyles: ['solid', 'regular'] },
        'headset': { hexCode: 'f590', acceptedStyles: ['solid'] },
        'heart': { hexCode: 'f004', acceptedStyles: ['solid', 'regular'] },
        'heart-circle-bolt': { hexCode: 'e4fc', acceptedStyles: ['solid'] },
        'heart-circle-check': { hexCode: 'e4fd', acceptedStyles: ['solid'] },
        'heart-circle-exclamation': { hexCode: 'e4fe', acceptedStyles: ['solid'] },
        'heart-circle-minus': { hexCode: 'e4ff', acceptedStyles: ['solid'] },
        'heart-circle-plus': { hexCode: 'e500', acceptedStyles: ['solid'] },
        'heart-circle-xmark': { hexCode: 'e501', acceptedStyles: ['solid'] },
        'heart-crack': { hexCode: 'f7a9', acceptedStyles: ['solid'] },
        'heart-pulse': { hexCode: 'f21e', acceptedStyles: ['solid'] },
        'helicopter': { hexCode: 'f533', acceptedStyles: ['solid'] },
        'helicopter-symbol': { hexCode: 'e502', acceptedStyles: ['solid'] },
        'helmet-safety': { hexCode: 'f807', acceptedStyles: ['solid'] },
        'helmet-un': { hexCode: 'e503', acceptedStyles: ['solid'] },
        'hexagon': { hexCode: 'f312', acceptedStyles: ['solid'] },
        'hexagon-nodes': { hexCode: 'e699', acceptedStyles: ['solid'] },
        'hexagon-nodes-bolt': { hexCode: 'e69a', acceptedStyles: ['solid'] },
        'highlighter': { hexCode: 'f591', acceptedStyles: ['solid'] },
        'hill-avalanche': { hexCode: 'e507', acceptedStyles: ['solid'] },
        'hill-rockslide': { hexCode: 'e508', acceptedStyles: ['solid'] },
        'hippo': { hexCode: 'f6ed', acceptedStyles: ['solid'] },
        'hips': { hexCode: 'f452', acceptedStyles: ['brands'] },
        'hire-a-helper': { hexCode: 'f3b0', acceptedStyles: ['brands'] },
        'hive': { hexCode: 'e07f', acceptedStyles: ['brands'] },
        'hockey-puck': { hexCode: 'f453', acceptedStyles: ['solid'] },
        'holly-berry': { hexCode: 'f7aa', acceptedStyles: ['solid'] },
        'hooli': { hexCode: 'f427', acceptedStyles: ['brands'] },
        'hornbill': { hexCode: 'f592', acceptedStyles: ['brands'] },
        'horse': { hexCode: 'f6f0', acceptedStyles: ['solid'] },
        'horse-head': { hexCode: 'f7ab', acceptedStyles: ['solid'] },
        'hospital': { hexCode: 'f0f8', acceptedStyles: ['solid', 'regular'] },
        'hospital-user': { hexCode: 'f80d', acceptedStyles: ['solid'] },
        'hot-tub-person': { hexCode: 'f593', acceptedStyles: ['solid'] },
        'hotdog': { hexCode: 'f80f', acceptedStyles: ['solid'] },
        'hotel': { hexCode: 'f594', acceptedStyles: ['solid'] },
        'hotjar': { hexCode: 'f3b1', acceptedStyles: ['brands'] },
        'hourglass': { hexCode: 'f254', acceptedStyles: ['solid', 'regular'] },
        'hourglass-end': { hexCode: 'f253', acceptedStyles: ['solid'] },
        'hourglass-half': { hexCode: 'f252', acceptedStyles: ['solid', 'regular'] },
        'hourglass-start': { hexCode: 'f251', acceptedStyles: ['solid'] },
        'house': { hexCode: 'f015', acceptedStyles: ['solid', 'regular'] },
        'house-chimney': { hexCode: 'e3af', acceptedStyles: ['solid'] },
        'house-chimney-crack': { hexCode: 'f6f1', acceptedStyles: ['solid'] },
        'house-chimney-medical': { hexCode: 'f7f2', acceptedStyles: ['solid'] },
        'house-chimney-user': { hexCode: 'e065', acceptedStyles: ['solid'] },
        'house-chimney-window': { hexCode: 'e00d', acceptedStyles: ['solid'] },
        'house-circle-check': { hexCode: 'e509', acceptedStyles: ['solid'] },
        'house-circle-exclamation': { hexCode: 'e50a', acceptedStyles: ['solid'] },
        'house-circle-xmark': { hexCode: 'e50b', acceptedStyles: ['solid'] },
        'house-crack': { hexCode: 'e3b1', acceptedStyles: ['solid'] },
        'house-fire': { hexCode: 'e50c', acceptedStyles: ['solid'] },
        'house-flag': { hexCode: 'e50d', acceptedStyles: ['solid'] },
        'house-flood-water': { hexCode: 'e50e', acceptedStyles: ['solid'] },
        'house-flood-water-circle-arrow-right': { hexCode: 'e50f', acceptedStyles: ['solid'] },
        'house-laptop': { hexCode: 'e066', acceptedStyles: ['solid'] },
        'house-lock': { hexCode: 'e510', acceptedStyles: ['solid'] },
        'house-medical': { hexCode: 'e3b2', acceptedStyles: ['solid'] },
        'house-medical-circle-check': { hexCode: 'e511', acceptedStyles: ['solid'] },
        'house-medical-circle-exclamation': { hexCode: 'e512', acceptedStyles: ['solid'] },
        'house-medical-circle-xmark': { hexCode: 'e513', acceptedStyles: ['solid'] },
        'house-medical-flag': { hexCode: 'e514', acceptedStyles: ['solid'] },
        'house-signal': { hexCode: 'e012', acceptedStyles: ['solid'] },
        'house-tsunami': { hexCode: 'e515', acceptedStyles: ['solid'] },
        'house-user': { hexCode: 'e1b0', acceptedStyles: ['solid'] },
        'houzz': { hexCode: 'f27c', acceptedStyles: ['brands'] },
        'hryvnia-sign': { hexCode: 'f6f2', acceptedStyles: ['solid'] },
        'html5': { hexCode: 'f13b', acceptedStyles: ['brands'] },
        'hubspot': { hexCode: 'f3b2', acceptedStyles: ['brands'] },
        'hurricane': { hexCode: 'f751', acceptedStyles: ['solid'] },
        'i': { hexCode: '49', acceptedStyles: ['solid'] },
        'i-cursor': { hexCode: 'f246', acceptedStyles: ['solid'] },
        'ice-cream': { hexCode: 'f810', acceptedStyles: ['solid'] },
        'icicles': { hexCode: 'f7ad', acceptedStyles: ['solid'] },
        'icons': { hexCode: 'f86d', acceptedStyles: ['solid'] },
        'id-badge': { hexCode: 'f2c1', acceptedStyles: ['solid', 'regular'] },
        'id-card': { hexCode: 'f2c2', acceptedStyles: ['solid', 'regular'] },
        'id-card-clip': { hexCode: 'f47f', acceptedStyles: ['solid'] },
        'ideal': { hexCode: 'e013', acceptedStyles: ['brands'] },
        'igloo': { hexCode: 'f7ae', acceptedStyles: ['solid'] },
        'image': { hexCode: 'f03e', acceptedStyles: ['solid', 'regular'] },
        'image-portrait': { hexCode: 'f3e0', acceptedStyles: ['solid'] },
        'images': { hexCode: 'f302', acceptedStyles: ['solid', 'regular'] },
        'imdb': { hexCode: 'f2d8', acceptedStyles: ['brands'] },
        'inbox': { hexCode: 'f01c', acceptedStyles: ['solid'] },
        'indent': { hexCode: 'f03c', acceptedStyles: ['solid'] },
        'indian-rupee-sign': { hexCode: 'e1bc', acceptedStyles: ['solid'] },
        'industry': { hexCode: 'f275', acceptedStyles: ['solid'] },
        'infinity': { hexCode: 'f534', acceptedStyles: ['solid'] },
        'info': { hexCode: 'f129', acceptedStyles: ['solid'] },
        'instagram': { hexCode: 'f16d', acceptedStyles: ['brands'] },
        'instalod': { hexCode: 'e081', acceptedStyles: ['brands'] },
        'intercom': { hexCode: 'f7af', acceptedStyles: ['brands'] },
        'internet-explorer': { hexCode: 'f26b', acceptedStyles: ['brands'] },
        'invision': { hexCode: 'f7b0', acceptedStyles: ['brands'] },
        'ioxhost': { hexCode: 'f208', acceptedStyles: ['brands'] },
        'italic': { hexCode: 'f033', acceptedStyles: ['solid'] },
        'itch-io': { hexCode: 'f83a', acceptedStyles: ['brands'] },
        'itunes': { hexCode: 'f3b4', acceptedStyles: ['brands'] },
        'itunes-note': { hexCode: 'f3b5', acceptedStyles: ['brands'] },
        'j': { hexCode: '4a', acceptedStyles: ['solid'] },
        'jar': { hexCode: 'e516', acceptedStyles: ['solid'] },
        'jar-wheat': { hexCode: 'e517', acceptedStyles: ['solid'] },
        'java': { hexCode: 'f4e4', acceptedStyles: ['brands'] },
        'jedi': { hexCode: 'f669', acceptedStyles: ['solid'] },
        'jedi-order': { hexCode: 'f50e', acceptedStyles: ['brands'] },
        'jenkins': { hexCode: 'f3b6', acceptedStyles: ['brands'] },
        'jet-fighter': { hexCode: 'f0fb', acceptedStyles: ['solid'] },
        'jet-fighter-up': { hexCode: 'e518', acceptedStyles: ['solid'] },
        'jira': { hexCode: 'f7b1', acceptedStyles: ['brands'] },
        'joget': { hexCode: 'f3b7', acceptedStyles: ['brands'] },
        'joint': { hexCode: 'f595', acceptedStyles: ['solid'] },
        'joomla': { hexCode: 'f1aa', acceptedStyles: ['brands'] },
        'js': { hexCode: 'f3b8', acceptedStyles: ['brands'] },
        'jsfiddle': { hexCode: 'f1cc', acceptedStyles: ['brands'] },
        'jug-detergent': { hexCode: 'e519', acceptedStyles: ['solid'] },
        'jxl': { hexCode: 'e67b', acceptedStyles: ['brands'] },
        'k': { hexCode: '4b', acceptedStyles: ['solid'] },
        'kaaba': { hexCode: 'f66b', acceptedStyles: ['solid'] },
        'kaggle': { hexCode: 'f5fa', acceptedStyles: ['brands'] },
        'kakao-talk': { hexCode: 'e7d7', acceptedStyles: ['brands'] },
        'key': { hexCode: 'f084', acceptedStyles: ['solid'] },
        'keybase': { hexCode: 'f4f5', acceptedStyles: ['brands'] },
        'keyboard': { hexCode: 'f11c', acceptedStyles: ['solid', 'regular'] },
        'keycdn': { hexCode: 'f3ba', acceptedStyles: ['brands'] },
        'khanda': { hexCode: 'f66d', acceptedStyles: ['solid'] },
        'kickstarter': { hexCode: 'f3bb', acceptedStyles: ['brands'] },
        'kickstarter-k': { hexCode: 'f3bc', acceptedStyles: ['brands'] },
        'kip-sign': { hexCode: 'e1c4', acceptedStyles: ['solid'] },
        'kit-medical': { hexCode: 'f479', acceptedStyles: ['solid'] },
        'kitchen-set': { hexCode: 'e51a', acceptedStyles: ['solid'] },
        'kiwi-bird': { hexCode: 'f535', acceptedStyles: ['solid'] },
        'korvue': { hexCode: 'f42f', acceptedStyles: ['brands'] },
        'l': { hexCode: '4c', acceptedStyles: ['solid'] },
        'land-mine-on': { hexCode: 'e51b', acceptedStyles: ['solid'] },
        'landmark': { hexCode: 'f66f', acceptedStyles: ['solid'] },
        'landmark-dome': { hexCode: 'f752', acceptedStyles: ['solid'] },
        'landmark-flag': { hexCode: 'e51c', acceptedStyles: ['solid'] },
        'language': { hexCode: 'f1ab', acceptedStyles: ['solid'] },
        'laptop': { hexCode: 'f109', acceptedStyles: ['solid'] },
        'laptop-code': { hexCode: 'f5fc', acceptedStyles: ['solid'] },
        'laptop-file': { hexCode: 'e51d', acceptedStyles: ['solid'] },
        'laptop-medical': { hexCode: 'f812', acceptedStyles: ['solid'] },
        'laravel': { hexCode: 'f3bd', acceptedStyles: ['brands'] },
        'lari-sign': { hexCode: 'e1c8', acceptedStyles: ['solid'] },
        'lastfm': { hexCode: 'f202', acceptedStyles: ['brands'] },
        'layer-group': { hexCode: 'f5fd', acceptedStyles: ['solid'] },
        'leaf': { hexCode: 'f06c', acceptedStyles: ['solid'] },
        'leanpub': { hexCode: 'f212', acceptedStyles: ['brands'] },
        'left-long': { hexCode: 'f30a', acceptedStyles: ['solid'] },
        'left-right': { hexCode: 'f337', acceptedStyles: ['solid'] },
        'lemon': { hexCode: 'f094', acceptedStyles: ['solid', 'regular'] },
        'less': { hexCode: 'f41d', acceptedStyles: ['brands'] },
        'less-than': { hexCode: '3c', acceptedStyles: ['solid'] },
        'less-than-equal': { hexCode: 'f537', acceptedStyles: ['solid'] },
        'letterboxd': { hexCode: 'e62d', acceptedStyles: ['brands'] },
        'life-ring': { hexCode: 'f1cd', acceptedStyles: ['solid', 'regular'] },
        'lightbulb': { hexCode: 'f0eb', acceptedStyles: ['solid', 'regular'] },
        'line': { hexCode: 'f3c0', acceptedStyles: ['brands'] },
        'lines-leaning': { hexCode: 'e51e', acceptedStyles: ['solid'] },
        'link': { hexCode: 'f0c1', acceptedStyles: ['solid'] },
        'link-slash': { hexCode: 'f127', acceptedStyles: ['solid'] },
        'linkedin': { hexCode: 'f08c', acceptedStyles: ['brands'] },
        'linkedin-in': { hexCode: 'f0e1', acceptedStyles: ['brands'] },
        'linktree': { hexCode: 'e7d8', acceptedStyles: ['brands'] },
        'linode': { hexCode: 'f2b8', acceptedStyles: ['brands'] },
        'linux': { hexCode: 'f17c', acceptedStyles: ['brands'] },
        'lira-sign': { hexCode: 'f195', acceptedStyles: ['solid'] },
        'list': { hexCode: 'f03a', acceptedStyles: ['solid'] },
        'list-check': { hexCode: 'f0ae', acceptedStyles: ['solid'] },
        'list-ol': { hexCode: 'f0cb', acceptedStyles: ['solid'] },
        'list-ul': { hexCode: 'f0ca', acceptedStyles: ['solid'] },
        'litecoin-sign': { hexCode: 'e1d3', acceptedStyles: ['solid'] },
        'location-arrow': { hexCode: 'f124', acceptedStyles: ['solid'] },
        'location-crosshairs': { hexCode: 'f601', acceptedStyles: ['solid'] },
        'location-dot': { hexCode: 'f3c5', acceptedStyles: ['solid'] },
        'location-pin': { hexCode: 'f041', acceptedStyles: ['solid'] },
        'location-pin-lock': { hexCode: 'e51f', acceptedStyles: ['solid'] },
        'lock': { hexCode: 'f023', acceptedStyles: ['solid'] },
        'lock-open': { hexCode: 'f3c1', acceptedStyles: ['solid'] },
        'locust': { hexCode: 'e520', acceptedStyles: ['solid'] },
        'lumon': { hexCode: 'e7e2', acceptedStyles: ['brands'] },
        'lumon-drop': { hexCode: 'e7e3', acceptedStyles: ['brands'] },
        'lungs': { hexCode: 'f604', acceptedStyles: ['solid'] },
        'lungs-virus': { hexCode: 'e067', acceptedStyles: ['solid'] },
        'lyft': { hexCode: 'f3c3', acceptedStyles: ['brands'] },
        'm': { hexCode: '4d', acceptedStyles: ['solid'] },
        'magento': { hexCode: 'f3c4', acceptedStyles: ['brands'] },
        'magnet': { hexCode: 'f076', acceptedStyles: ['solid'] },
        'magnifying-glass': { hexCode: 'f002', acceptedStyles: ['solid'] },
        'magnifying-glass-arrow-right': { hexCode: 'e521', acceptedStyles: ['solid'] },
        'magnifying-glass-chart': { hexCode: 'e522', acceptedStyles: ['solid'] },
        'magnifying-glass-dollar': { hexCode: 'f688', acceptedStyles: ['solid'] },
        'magnifying-glass-location': { hexCode: 'f689', acceptedStyles: ['solid'] },
        'magnifying-glass-minus': { hexCode: 'f010', acceptedStyles: ['solid'] },
        'magnifying-glass-plus': { hexCode: 'f00e', acceptedStyles: ['solid'] },
        'mailchimp': { hexCode: 'f59e', acceptedStyles: ['brands'] },
        'manat-sign': { hexCode: 'e1d5', acceptedStyles: ['solid'] },
        'mandalorian': { hexCode: 'f50f', acceptedStyles: ['brands'] },
        'map': { hexCode: 'f279', acceptedStyles: ['solid', 'regular'] },
        'map-location': { hexCode: 'f59f', acceptedStyles: ['solid'] },
        'map-location-dot': { hexCode: 'f5a0', acceptedStyles: ['solid'] },
        'map-pin': { hexCode: 'f276', acceptedStyles: ['solid'] },
        'markdown': { hexCode: 'f60f', acceptedStyles: ['brands'] },
        'marker': { hexCode: 'f5a1', acceptedStyles: ['solid'] },
        'mars': { hexCode: 'f222', acceptedStyles: ['solid'] },
        'mars-and-venus': { hexCode: 'f224', acceptedStyles: ['solid'] },
        'mars-and-venus-burst': { hexCode: 'e523', acceptedStyles: ['solid'] },
        'mars-double': { hexCode: 'f227', acceptedStyles: ['solid'] },
        'mars-stroke': { hexCode: 'f229', acceptedStyles: ['solid'] },
        'mars-stroke-right': { hexCode: 'f22b', acceptedStyles: ['solid'] },
        'mars-stroke-up': { hexCode: 'f22a', acceptedStyles: ['solid'] },
        'martini-glass': { hexCode: 'f57b', acceptedStyles: ['solid'] },
        'martini-glass-citrus': { hexCode: 'f561', acceptedStyles: ['solid'] },
        'martini-glass-empty': { hexCode: 'f000', acceptedStyles: ['solid'] },
        'mask': { hexCode: 'f6fa', acceptedStyles: ['solid'] },
        'mask-face': { hexCode: 'e1d7', acceptedStyles: ['solid'] },
        'mask-ventilator': { hexCode: 'e524', acceptedStyles: ['solid'] },
        'masks-theater': { hexCode: 'f630', acceptedStyles: ['solid'] },
        'mastodon': { hexCode: 'f4f6', acceptedStyles: ['brands'] },
        'mattress-pillow': { hexCode: 'e525', acceptedStyles: ['solid'] },
        'maxcdn': { hexCode: 'f136', acceptedStyles: ['brands'] },
        'maximize': { hexCode: 'f31e', acceptedStyles: ['solid'] },
        'mdb': { hexCode: 'f8ca', acceptedStyles: ['brands'] },
        'medal': { hexCode: 'f5a2', acceptedStyles: ['solid'] },
        'medapps': { hexCode: 'f3c6', acceptedStyles: ['brands'] },
        'medium': { hexCode: 'f23a', acceptedStyles: ['brands'] },
        'medrt': { hexCode: 'f3c8', acceptedStyles: ['brands'] },
        'meetup': { hexCode: 'f2e0', acceptedStyles: ['brands'] },
        'megaport': { hexCode: 'f5a3', acceptedStyles: ['brands'] },
        'memory': { hexCode: 'f538', acceptedStyles: ['solid'] },
        'mendeley': { hexCode: 'f7b3', acceptedStyles: ['brands'] },
        'menorah': { hexCode: 'f676', acceptedStyles: ['solid'] },
        'mercury': { hexCode: 'f223', acceptedStyles: ['solid'] },
        'message': { hexCode: 'f27a', acceptedStyles: ['solid', 'regular'] },
        'meta': { hexCode: 'e49b', acceptedStyles: ['brands'] },
        'meteor': { hexCode: 'f753', acceptedStyles: ['solid'] },
        'microblog': { hexCode: 'e01a', acceptedStyles: ['brands'] },
        'microchip': { hexCode: 'f2db', acceptedStyles: ['solid'] },
        'microphone': { hexCode: 'f130', acceptedStyles: ['solid'] },
        'microphone-lines': { hexCode: 'f3c9', acceptedStyles: ['solid'] },
        'microphone-lines-slash': { hexCode: 'f539', acceptedStyles: ['solid'] },
        'microphone-slash': { hexCode: 'f131', acceptedStyles: ['solid'] },
        'microscope': { hexCode: 'f610', acceptedStyles: ['solid'] },
        'microsoft': { hexCode: 'f3ca', acceptedStyles: ['brands'] },
        'mill-sign': { hexCode: 'e1ed', acceptedStyles: ['solid'] },
        'minimize': { hexCode: 'f78c', acceptedStyles: ['solid'] },
        'mintbit': { hexCode: 'e62f', acceptedStyles: ['brands'] },
        'minus': { hexCode: 'f068', acceptedStyles: ['solid'] },
        'mitten': { hexCode: 'f7b5', acceptedStyles: ['solid'] },
        'mix': { hexCode: 'f3cb', acceptedStyles: ['brands'] },
        'mixcloud': { hexCode: 'f289', acceptedStyles: ['brands'] },
        'mixer': { hexCode: 'e056', acceptedStyles: ['brands'] },
        'mizuni': { hexCode: 'f3cc', acceptedStyles: ['brands'] },
        'mobile': { hexCode: 'f3ce', acceptedStyles: ['solid'] },
        'mobile-button': { hexCode: 'f10b', acceptedStyles: ['solid'] },
        'mobile-retro': { hexCode: 'e527', acceptedStyles: ['solid'] },
        'mobile-screen': { hexCode: 'f3cf', acceptedStyles: ['solid'] },
        'mobile-screen-button': { hexCode: 'f3cd', acceptedStyles: ['solid'] },
        'mobile-vibrate': { hexCode: 'e816', acceptedStyles: ['solid'] },
        'modx': { hexCode: 'f285', acceptedStyles: ['brands'] },
        'monero': { hexCode: 'f3d0', acceptedStyles: ['brands'] },
        'money-bill': { hexCode: 'f0d6', acceptedStyles: ['solid'] },
        'money-bill-1': { hexCode: 'f3d1', acceptedStyles: ['solid', 'regular'] },
        'money-bill-1-wave': { hexCode: 'f53b', acceptedStyles: ['solid'] },
        'money-bill-transfer': { hexCode: 'e528', acceptedStyles: ['solid'] },
        'money-bill-trend-up': { hexCode: 'e529', acceptedStyles: ['solid'] },
        'money-bill-wave': { hexCode: 'f53a', acceptedStyles: ['solid'] },
        'money-bill-wheat': { hexCode: 'e52a', acceptedStyles: ['solid'] },
        'money-bills': { hexCode: 'e1f3', acceptedStyles: ['solid'] },
        'money-check': { hexCode: 'f53c', acceptedStyles: ['solid'] },
        'money-check-dollar': { hexCode: 'f53d', acceptedStyles: ['solid'] },
        'monument': { hexCode: 'f5a6', acceptedStyles: ['solid'] },
        'moon': { hexCode: 'f186', acceptedStyles: ['solid', 'regular'] },
        'mortar-pestle': { hexCode: 'f5a7', acceptedStyles: ['solid'] },
        'mosque': { hexCode: 'f678', acceptedStyles: ['solid'] },
        'mosquito': { hexCode: 'e52b', acceptedStyles: ['solid'] },
        'mosquito-net': { hexCode: 'e52c', acceptedStyles: ['solid'] },
        'motorcycle': { hexCode: 'f21c', acceptedStyles: ['solid'] },
        'mound': { hexCode: 'e52d', acceptedStyles: ['solid'] },
        'mountain': { hexCode: 'f6fc', acceptedStyles: ['solid'] },
        'mountain-city': { hexCode: 'e52e', acceptedStyles: ['solid'] },
        'mountain-sun': { hexCode: 'e52f', acceptedStyles: ['solid'] },
        'mug-hot': { hexCode: 'f7b6', acceptedStyles: ['solid'] },
        'mug-saucer': { hexCode: 'f0f4', acceptedStyles: ['solid'] },
        'music': { hexCode: 'f001', acceptedStyles: ['solid'] },
        'n': { hexCode: '4e', acceptedStyles: ['solid'] },
        'naira-sign': { hexCode: 'e1f6', acceptedStyles: ['solid'] },
        'napster': { hexCode: 'f3d2', acceptedStyles: ['brands'] },
        'neos': { hexCode: 'f612', acceptedStyles: ['brands'] },
        'network-wired': { hexCode: 'f6ff', acceptedStyles: ['solid'] },
        'neuter': { hexCode: 'f22c', acceptedStyles: ['solid'] },
        'newspaper': { hexCode: 'f1ea', acceptedStyles: ['solid', 'regular'] },
        'nfc-directional': { hexCode: 'e530', acceptedStyles: ['brands'] },
        'nfc-symbol': { hexCode: 'e531', acceptedStyles: ['brands'] },
        'nimblr': { hexCode: 'f5a8', acceptedStyles: ['brands'] },
        'node': { hexCode: 'f419', acceptedStyles: ['brands'] },
        'node-js': { hexCode: 'f3d3', acceptedStyles: ['brands'] },
        'non-binary': { hexCode: 'e807', acceptedStyles: ['solid'] },
        'not-equal': { hexCode: 'f53e', acceptedStyles: ['solid'] },
        'notdef': { hexCode: 'e1fe', acceptedStyles: ['solid'] },
        'note-sticky': { hexCode: 'f249', acceptedStyles: ['solid', 'regular'] },
        'notes-medical': { hexCode: 'f481', acceptedStyles: ['solid'] },
        'notion': { hexCode: 'e7d9', acceptedStyles: ['brands'] },
        'npm': { hexCode: 'f3d4', acceptedStyles: ['brands'] },
        'ns8': { hexCode: 'f3d5', acceptedStyles: ['brands'] },
        'nutritionix': { hexCode: 'f3d6', acceptedStyles: ['brands'] },
        'o': { hexCode: '4f', acceptedStyles: ['solid'] },
        'object-group': { hexCode: 'f247', acceptedStyles: ['solid', 'regular'] },
        'object-ungroup': { hexCode: 'f248', acceptedStyles: ['solid', 'regular'] },
        'octagon': { hexCode: 'f306', acceptedStyles: ['solid'] },
        'octopus-deploy': { hexCode: 'e082', acceptedStyles: ['brands'] },
        'odnoklassniki': { hexCode: 'f263', acceptedStyles: ['brands'] },
        'odysee': { hexCode: 'e5c6', acceptedStyles: ['brands'] },
        'oil-can': { hexCode: 'f613', acceptedStyles: ['solid'] },
        'oil-well': { hexCode: 'e532', acceptedStyles: ['solid'] },
        'old-republic': { hexCode: 'f510', acceptedStyles: ['brands'] },
        'om': { hexCode: 'f679', acceptedStyles: ['solid'] },
        'openai': { hexCode: 'e7cf', acceptedStyles: ['brands'] },
        'opencart': { hexCode: 'f23d', acceptedStyles: ['brands'] },
        'openid': { hexCode: 'f19b', acceptedStyles: ['brands'] },
        'opensuse': { hexCode: 'e62b', acceptedStyles: ['brands'] },
        'opera': { hexCode: 'f26a', acceptedStyles: ['brands'] },
        'optin-monster': { hexCode: 'f23c', acceptedStyles: ['brands'] },
        'orcid': { hexCode: 'f8d2', acceptedStyles: ['brands'] },
        'osi': { hexCode: 'f41a', acceptedStyles: ['brands'] },
        'otter': { hexCode: 'f700', acceptedStyles: ['solid'] },
        'outdent': { hexCode: 'f03b', acceptedStyles: ['solid'] },
        'p': { hexCode: '50', acceptedStyles: ['solid'] },
        'padlet': { hexCode: 'e4a0', acceptedStyles: ['brands'] },
        'page4': { hexCode: 'f3d7', acceptedStyles: ['brands'] },
        'pagelines': { hexCode: 'f18c', acceptedStyles: ['brands'] },
        'pager': { hexCode: 'f815', acceptedStyles: ['solid'] },
        'paint-roller': { hexCode: 'f5aa', acceptedStyles: ['solid'] },
        'paintbrush': { hexCode: 'f1fc', acceptedStyles: ['solid'] },
        'palette': { hexCode: 'f53f', acceptedStyles: ['solid'] },
        'palfed': { hexCode: 'f3d8', acceptedStyles: ['brands'] },
        'pallet': { hexCode: 'f482', acceptedStyles: ['solid'] },
        'pandora': { hexCode: 'e7da', acceptedStyles: ['brands'] },
        'panorama': { hexCode: 'e209', acceptedStyles: ['solid'] },
        'paper-plane': { hexCode: 'f1d8', acceptedStyles: ['solid', 'regular'] },
        'paperclip': { hexCode: 'f0c6', acceptedStyles: ['solid'] },
        'parachute-box': { hexCode: 'f4cd', acceptedStyles: ['solid'] },
        'paragraph': { hexCode: 'f1dd', acceptedStyles: ['solid'] },
        'passport': { hexCode: 'f5ab', acceptedStyles: ['solid'] },
        'paste': { hexCode: 'f0ea', acceptedStyles: ['solid', 'regular'] },
        'patreon': { hexCode: 'f3d9', acceptedStyles: ['brands'] },
        'pause': { hexCode: 'f04c', acceptedStyles: ['solid'] },
        'paw': { hexCode: 'f1b0', acceptedStyles: ['solid'] },
        'paypal': { hexCode: 'f1ed', acceptedStyles: ['brands'] },
        'peace': { hexCode: 'f67c', acceptedStyles: ['solid'] },
        'pen': { hexCode: 'f304', acceptedStyles: ['solid'] },
        'pen-clip': { hexCode: 'f305', acceptedStyles: ['solid'] },
        'pen-fancy': { hexCode: 'f5ac', acceptedStyles: ['solid'] },
        'pen-nib': { hexCode: 'f5ad', acceptedStyles: ['solid'] },
        'pen-ruler': { hexCode: 'f5ae', acceptedStyles: ['solid'] },
        'pen-to-square': { hexCode: 'f044', acceptedStyles: ['solid', 'regular'] },
        'pencil': { hexCode: 'f303', acceptedStyles: ['solid'] },
        'pentagon': { hexCode: 'e790', acceptedStyles: ['solid'] },
        'people-arrows': { hexCode: 'e068', acceptedStyles: ['solid'] },
        'people-carry-box': { hexCode: 'f4ce', acceptedStyles: ['solid'] },
        'people-group': { hexCode: 'e533', acceptedStyles: ['solid'] },
        'people-line': { hexCode: 'e534', acceptedStyles: ['solid'] },
        'people-pulling': { hexCode: 'e535', acceptedStyles: ['solid'] },
        'people-robbery': { hexCode: 'e536', acceptedStyles: ['solid'] },
        'people-roof': { hexCode: 'e537', acceptedStyles: ['solid'] },
        'pepper-hot': { hexCode: 'f816', acceptedStyles: ['solid'] },
        'perbyte': { hexCode: 'e083', acceptedStyles: ['brands'] },
        'percent': { hexCode: '25', acceptedStyles: ['solid'] },
        'periscope': { hexCode: 'f3da', acceptedStyles: ['brands'] },
        'person': { hexCode: 'f183', acceptedStyles: ['solid'] },
        'person-arrow-down-to-line': { hexCode: 'e538', acceptedStyles: ['solid'] },
        'person-arrow-up-from-line': { hexCode: 'e539', acceptedStyles: ['solid'] },
        'person-biking': { hexCode: 'f84a', acceptedStyles: ['solid'] },
        'person-booth': { hexCode: 'f756', acceptedStyles: ['solid'] },
        'person-breastfeeding': { hexCode: 'e53a', acceptedStyles: ['solid'] },
        'person-burst': { hexCode: 'e53b', acceptedStyles: ['solid'] },
        'person-cane': { hexCode: 'e53c', acceptedStyles: ['solid'] },
        'person-chalkboard': { hexCode: 'e53d', acceptedStyles: ['solid'] },
        'person-circle-check': { hexCode: 'e53e', acceptedStyles: ['solid'] },
        'person-circle-exclamation': { hexCode: 'e53f', acceptedStyles: ['solid'] },
        'person-circle-minus': { hexCode: 'e540', acceptedStyles: ['solid'] },
        'person-circle-plus': { hexCode: 'e541', acceptedStyles: ['solid'] },
        'person-circle-question': { hexCode: 'e542', acceptedStyles: ['solid'] },
        'person-circle-xmark': { hexCode: 'e543', acceptedStyles: ['solid'] },
        'person-digging': { hexCode: 'f85e', acceptedStyles: ['solid'] },
        'person-dots-from-line': { hexCode: 'f470', acceptedStyles: ['solid'] },
        'person-dress': { hexCode: 'f182', acceptedStyles: ['solid'] },
        'person-dress-burst': { hexCode: 'e544', acceptedStyles: ['solid'] },
        'person-drowning': { hexCode: 'e545', acceptedStyles: ['solid'] },
        'person-falling': { hexCode: 'e546', acceptedStyles: ['solid'] },
        'person-falling-burst': { hexCode: 'e547', acceptedStyles: ['solid'] },
        'person-half-dress': { hexCode: 'e548', acceptedStyles: ['solid'] },
        'person-harassing': { hexCode: 'e549', acceptedStyles: ['solid'] },
        'person-hiking': { hexCode: 'f6ec', acceptedStyles: ['solid'] },
        'person-military-pointing': { hexCode: 'e54a', acceptedStyles: ['solid'] },
        'person-military-rifle': { hexCode: 'e54b', acceptedStyles: ['solid'] },
        'person-military-to-person': { hexCode: 'e54c', acceptedStyles: ['solid'] },
        'person-praying': { hexCode: 'f683', acceptedStyles: ['solid'] },
        'person-pregnant': { hexCode: 'e31e', acceptedStyles: ['solid'] },
        'person-rays': { hexCode: 'e54d', acceptedStyles: ['solid'] },
        'person-rifle': { hexCode: 'e54e', acceptedStyles: ['solid'] },
        'person-running': { hexCode: 'f70c', acceptedStyles: ['solid'] },
        'person-shelter': { hexCode: 'e54f', acceptedStyles: ['solid'] },
        'person-skating': { hexCode: 'f7c5', acceptedStyles: ['solid'] },
        'person-skiing': { hexCode: 'f7c9', acceptedStyles: ['solid'] },
        'person-skiing-nordic': { hexCode: 'f7ca', acceptedStyles: ['solid'] },
        'person-snowboarding': { hexCode: 'f7ce', acceptedStyles: ['solid'] },
        'person-swimming': { hexCode: 'f5c4', acceptedStyles: ['solid'] },
        'person-through-window': { hexCode: 'e5a9', acceptedStyles: ['solid'] },
        'person-walking': { hexCode: 'f554', acceptedStyles: ['solid'] },
        'person-walking-arrow-loop-left': { hexCode: 'e551', acceptedStyles: ['solid'] },
        'person-walking-arrow-right': { hexCode: 'e552', acceptedStyles: ['solid'] },
        'person-walking-dashed-line-arrow-right': { hexCode: 'e553', acceptedStyles: ['solid'] },
        'person-walking-luggage': { hexCode: 'e554', acceptedStyles: ['solid'] },
        'person-walking-with-cane': { hexCode: 'f29d', acceptedStyles: ['solid'] },
        'peseta-sign': { hexCode: 'e221', acceptedStyles: ['solid'] },
        'peso-sign': { hexCode: 'e222', acceptedStyles: ['solid'] },
        'phabricator': { hexCode: 'f3db', acceptedStyles: ['brands'] },
        'phoenix-framework': { hexCode: 'f3dc', acceptedStyles: ['brands'] },
        'phoenix-squadron': { hexCode: 'f511', acceptedStyles: ['brands'] },
        'phone': { hexCode: 'f095', acceptedStyles: ['solid'] },
        'phone-flip': { hexCode: 'f879', acceptedStyles: ['solid'] },
        'phone-slash': { hexCode: 'f3dd', acceptedStyles: ['solid'] },
        'phone-volume': { hexCode: 'f2a0', acceptedStyles: ['solid'] },
        'photo-film': { hexCode: 'f87c', acceptedStyles: ['solid'] },
        'php': { hexCode: 'f457', acceptedStyles: ['brands'] },
        'pied-piper': { hexCode: 'f2ae', acceptedStyles: ['brands'] },
        'pied-piper-alt': { hexCode: 'f1a8', acceptedStyles: ['brands'] },
        'pied-piper-hat': { hexCode: 'f4e5', acceptedStyles: ['brands'] },
        'pied-piper-pp': { hexCode: 'f1a7', acceptedStyles: ['brands'] },
        'piggy-bank': { hexCode: 'f4d3', acceptedStyles: ['solid'] },
        'pills': { hexCode: 'f484', acceptedStyles: ['solid'] },
        'pinterest': { hexCode: 'f0d2', acceptedStyles: ['brands'] },
        'pinterest-p': { hexCode: 'f231', acceptedStyles: ['brands'] },
        'pix': { hexCode: 'e43a', acceptedStyles: ['brands'] },
        'pixelfed': { hexCode: 'e7db', acceptedStyles: ['brands'] },
        'pixiv': { hexCode: 'e640', acceptedStyles: ['brands'] },
        'pizza-slice': { hexCode: 'f818', acceptedStyles: ['solid'] },
        'place-of-worship': { hexCode: 'f67f', acceptedStyles: ['solid'] },
        'plane': { hexCode: 'f072', acceptedStyles: ['solid'] },
        'plane-arrival': { hexCode: 'f5af', acceptedStyles: ['solid'] },
        'plane-circle-check': { hexCode: 'e555', acceptedStyles: ['solid'] },
        'plane-circle-exclamation': { hexCode: 'e556', acceptedStyles: ['solid'] },
        'plane-circle-xmark': { hexCode: 'e557', acceptedStyles: ['solid'] },
        'plane-departure': { hexCode: 'f5b0', acceptedStyles: ['solid'] },
        'plane-lock': { hexCode: 'e558', acceptedStyles: ['solid'] },
        'plane-slash': { hexCode: 'e069', acceptedStyles: ['solid'] },
        'plane-up': { hexCode: 'e22d', acceptedStyles: ['solid'] },
        'plant-wilt': { hexCode: 'e5aa', acceptedStyles: ['solid'] },
        'plate-wheat': { hexCode: 'e55a', acceptedStyles: ['solid'] },
        'play': { hexCode: 'f04b', acceptedStyles: ['solid'] },
        'playstation': { hexCode: 'f3df', acceptedStyles: ['brands'] },
        'plug': { hexCode: 'f1e6', acceptedStyles: ['solid'] },
        'plug-circle-bolt': { hexCode: 'e55b', acceptedStyles: ['solid'] },
        'plug-circle-check': { hexCode: 'e55c', acceptedStyles: ['solid'] },
        'plug-circle-exclamation': { hexCode: 'e55d', acceptedStyles: ['solid'] },
        'plug-circle-minus': { hexCode: 'e55e', acceptedStyles: ['solid'] },
        'plug-circle-plus': { hexCode: 'e55f', acceptedStyles: ['solid'] },
        'plug-circle-xmark': { hexCode: 'e560', acceptedStyles: ['solid'] },
        'plus': { hexCode: '2b', acceptedStyles: ['solid'] },
        'plus-minus': { hexCode: 'e43c', acceptedStyles: ['solid'] },
        'podcast': { hexCode: 'f2ce', acceptedStyles: ['solid'] },
        'poo': { hexCode: 'f2fe', acceptedStyles: ['solid'] },
        'poo-storm': { hexCode: 'f75a', acceptedStyles: ['solid'] },
        'poop': { hexCode: 'f619', acceptedStyles: ['solid'] },
        'power-off': { hexCode: 'f011', acceptedStyles: ['solid'] },
        'prescription': { hexCode: 'f5b1', acceptedStyles: ['solid'] },
        'prescription-bottle': { hexCode: 'f485', acceptedStyles: ['solid'] },
        'prescription-bottle-medical': { hexCode: 'f486', acceptedStyles: ['solid'] },
        'print': { hexCode: 'f02f', acceptedStyles: ['solid'] },
        'product-hunt': { hexCode: 'f288', acceptedStyles: ['brands'] },
        'pump-medical': { hexCode: 'e06a', acceptedStyles: ['solid'] },
        'pump-soap': { hexCode: 'e06b', acceptedStyles: ['solid'] },
        'pushed': { hexCode: 'f3e1', acceptedStyles: ['brands'] },
        'puzzle-piece': { hexCode: 'f12e', acceptedStyles: ['solid'] },
        'python': { hexCode: 'f3e2', acceptedStyles: ['brands'] },
        'q': { hexCode: '51', acceptedStyles: ['solid'] },
        'qq': { hexCode: 'f1d6', acceptedStyles: ['brands'] },
        'qrcode': { hexCode: 'f029', acceptedStyles: ['solid'] },
        'question': { hexCode: '3f', acceptedStyles: ['solid'] },
        'quinscape': { hexCode: 'f459', acceptedStyles: ['brands'] },
        'quora': { hexCode: 'f2c4', acceptedStyles: ['brands'] },
        'quote-left': { hexCode: 'f10d', acceptedStyles: ['solid'] },
        'quote-right': { hexCode: 'f10e', acceptedStyles: ['solid'] },
        'r': { hexCode: '52', acceptedStyles: ['solid'] },
        'r-project': { hexCode: 'f4f7', acceptedStyles: ['brands'] },
        'radiation': { hexCode: 'f7b9', acceptedStyles: ['solid'] },
        'radio': { hexCode: 'f8d7', acceptedStyles: ['solid'] },
        'rainbow': { hexCode: 'f75b', acceptedStyles: ['solid'] },
        'ranking-star': { hexCode: 'e561', acceptedStyles: ['solid'] },
        'raspberry-pi': { hexCode: 'f7bb', acceptedStyles: ['brands'] },
        'ravelry': { hexCode: 'f2d9', acceptedStyles: ['brands'] },
        'react': { hexCode: 'f41b', acceptedStyles: ['brands'] },
        'reacteurope': { hexCode: 'f75d', acceptedStyles: ['brands'] },
        'readme': { hexCode: 'f4d5', acceptedStyles: ['brands'] },
        'rebel': { hexCode: 'f1d0', acceptedStyles: ['brands'] },
        'receipt': { hexCode: 'f543', acceptedStyles: ['solid'] },
        'record-vinyl': { hexCode: 'f8d9', acceptedStyles: ['solid'] },
        'rectangle-ad': { hexCode: 'f641', acceptedStyles: ['solid'] },
        'rectangle-list': { hexCode: 'f022', acceptedStyles: ['solid', 'regular'] },
        'rectangle-xmark': { hexCode: 'f410', acceptedStyles: ['solid', 'regular'] },
        'recycle': { hexCode: 'f1b8', acceptedStyles: ['solid'] },
        'red-river': { hexCode: 'f3e3', acceptedStyles: ['brands'] },
        'reddit': { hexCode: 'f1a1', acceptedStyles: ['brands'] },
        'reddit-alien': { hexCode: 'f281', acceptedStyles: ['brands'] },
        'redhat': { hexCode: 'f7bc', acceptedStyles: ['brands'] },
        'registered': { hexCode: 'f25d', acceptedStyles: ['solid', 'regular'] },
        'renren': { hexCode: 'f18b', acceptedStyles: ['brands'] },
        'repeat': { hexCode: 'f363', acceptedStyles: ['solid'] },
        'reply': { hexCode: 'f3e5', acceptedStyles: ['solid'] },
        'reply-all': { hexCode: 'f122', acceptedStyles: ['solid'] },
        'replyd': { hexCode: 'f3e6', acceptedStyles: ['brands'] },
        'republican': { hexCode: 'f75e', acceptedStyles: ['solid'] },
        'researchgate': { hexCode: 'f4f8', acceptedStyles: ['brands'] },
        'resolving': { hexCode: 'f3e7', acceptedStyles: ['brands'] },
        'restroom': { hexCode: 'f7bd', acceptedStyles: ['solid'] },
        'retweet': { hexCode: 'f079', acceptedStyles: ['solid'] },
        'rev': { hexCode: 'f5b2', acceptedStyles: ['brands'] },
        'ribbon': { hexCode: 'f4d6', acceptedStyles: ['solid'] },
        'right-from-bracket': { hexCode: 'f2f5', acceptedStyles: ['solid'] },
        'right-left': { hexCode: 'f362', acceptedStyles: ['solid'] },
        'right-long': { hexCode: 'f30b', acceptedStyles: ['solid'] },
        'right-to-bracket': { hexCode: 'f2f6', acceptedStyles: ['solid'] },
        'ring': { hexCode: 'f70b', acceptedStyles: ['solid'] },
        'road': { hexCode: 'f018', acceptedStyles: ['solid'] },
        'road-barrier': { hexCode: 'e562', acceptedStyles: ['solid'] },
        'road-bridge': { hexCode: 'e563', acceptedStyles: ['solid'] },
        'road-circle-check': { hexCode: 'e564', acceptedStyles: ['solid'] },
        'road-circle-exclamation': { hexCode: 'e565', acceptedStyles: ['solid'] },
        'road-circle-xmark': { hexCode: 'e566', acceptedStyles: ['solid'] },
        'road-lock': { hexCode: 'e567', acceptedStyles: ['solid'] },
        'road-spikes': { hexCode: 'e568', acceptedStyles: ['solid'] },
        'robot': { hexCode: 'f544', acceptedStyles: ['solid'] },
        'rocket': { hexCode: 'f135', acceptedStyles: ['solid'] },
        'rocketchat': { hexCode: 'f3e8', acceptedStyles: ['brands'] },
        'rockrms': { hexCode: 'f3e9', acceptedStyles: ['brands'] },
        'rotate': { hexCode: 'f2f1', acceptedStyles: ['solid'] },
        'rotate-left': { hexCode: 'f2ea', acceptedStyles: ['solid'] },
        'rotate-right': { hexCode: 'f2f9', acceptedStyles: ['solid'] },
        'route': { hexCode: 'f4d7', acceptedStyles: ['solid'] },
        'rss': { hexCode: 'f09e', acceptedStyles: ['solid'] },
        'ruble-sign': { hexCode: 'f158', acceptedStyles: ['solid'] },
        'rug': { hexCode: 'e569', acceptedStyles: ['solid'] },
        'ruler': { hexCode: 'f545', acceptedStyles: ['solid'] },
        'ruler-combined': { hexCode: 'f546', acceptedStyles: ['solid'] },
        'ruler-horizontal': { hexCode: 'f547', acceptedStyles: ['solid'] },
        'ruler-vertical': { hexCode: 'f548', acceptedStyles: ['solid'] },
        'rupee-sign': { hexCode: 'f156', acceptedStyles: ['solid'] },
        'rupiah-sign': { hexCode: 'e23d', acceptedStyles: ['solid'] },
        'rust': { hexCode: 'e07a', acceptedStyles: ['brands'] },
        's': { hexCode: '53', acceptedStyles: ['solid'] },
        'sack-dollar': { hexCode: 'f81d', acceptedStyles: ['solid'] },
        'sack-xmark': { hexCode: 'e56a', acceptedStyles: ['solid'] },
        'safari': { hexCode: 'f267', acceptedStyles: ['brands'] },
        'sailboat': { hexCode: 'e445', acceptedStyles: ['solid'] },
        'salesforce': { hexCode: 'f83b', acceptedStyles: ['brands'] },
        'sass': { hexCode: 'f41e', acceptedStyles: ['brands'] },
        'satellite': { hexCode: 'f7bf', acceptedStyles: ['solid'] },
        'satellite-dish': { hexCode: 'f7c0', acceptedStyles: ['solid'] },
        'scale-balanced': { hexCode: 'f24e', acceptedStyles: ['solid'] },
        'scale-unbalanced': { hexCode: 'f515', acceptedStyles: ['solid'] },
        'scale-unbalanced-flip': { hexCode: 'f516', acceptedStyles: ['solid'] },
        'schlix': { hexCode: 'f3ea', acceptedStyles: ['brands'] },
        'school': { hexCode: 'f549', acceptedStyles: ['solid'] },
        'school-circle-check': { hexCode: 'e56b', acceptedStyles: ['solid'] },
        'school-circle-exclamation': { hexCode: 'e56c', acceptedStyles: ['solid'] },
        'school-circle-xmark': { hexCode: 'e56d', acceptedStyles: ['solid'] },
        'school-flag': { hexCode: 'e56e', acceptedStyles: ['solid'] },
        'school-lock': { hexCode: 'e56f', acceptedStyles: ['solid'] },
        'scissors': { hexCode: 'f0c4', acceptedStyles: ['solid'] },
        'screenpal': { hexCode: 'e570', acceptedStyles: ['brands'] },
        'screwdriver': { hexCode: 'f54a', acceptedStyles: ['solid'] },
        'screwdriver-wrench': { hexCode: 'f7d9', acceptedStyles: ['solid'] },
        'scribd': { hexCode: 'f28a', acceptedStyles: ['brands'] },
        'scroll': { hexCode: 'f70e', acceptedStyles: ['solid'] },
        'scroll-torah': { hexCode: 'f6a0', acceptedStyles: ['solid'] },
        'sd-card': { hexCode: 'f7c2', acceptedStyles: ['solid'] },
        'searchengin': { hexCode: 'f3eb', acceptedStyles: ['brands'] },
        'section': { hexCode: 'e447', acceptedStyles: ['solid'] },
        'seedling': { hexCode: 'f4d8', acceptedStyles: ['solid'] },
        'sellcast': { hexCode: 'f2da', acceptedStyles: ['brands'] },
        'sellsy': { hexCode: 'f213', acceptedStyles: ['brands'] },
        'septagon': { hexCode: 'e820', acceptedStyles: ['solid'] },
        'server': { hexCode: 'f233', acceptedStyles: ['solid'] },
        'servicestack': { hexCode: 'f3ec', acceptedStyles: ['brands'] },
        'shapes': { hexCode: 'f61f', acceptedStyles: ['solid'] },
        'share': { hexCode: 'f064', acceptedStyles: ['solid'] },
        'share-from-square': { hexCode: 'f14d', acceptedStyles: ['solid', 'regular'] },
        'share-nodes': { hexCode: 'f1e0', acceptedStyles: ['solid'] },
        'sheet-plastic': { hexCode: 'e571', acceptedStyles: ['solid'] },
        'shekel-sign': { hexCode: 'f20b', acceptedStyles: ['solid'] },
        'shield': { hexCode: 'f132', acceptedStyles: ['solid'] },
        'shield-cat': { hexCode: 'e572', acceptedStyles: ['solid'] },
        'shield-dog': { hexCode: 'e573', acceptedStyles: ['solid'] },
        'shield-halved': { hexCode: 'f3ed', acceptedStyles: ['solid'] },
        'shield-heart': { hexCode: 'e574', acceptedStyles: ['solid'] },
        'shield-virus': { hexCode: 'e06c', acceptedStyles: ['solid'] },
        'ship': { hexCode: 'f21a', acceptedStyles: ['solid'] },
        'shirt': { hexCode: 'f553', acceptedStyles: ['solid'] },
        'shirtsinbulk': { hexCode: 'f214', acceptedStyles: ['brands'] },
        'shoe-prints': { hexCode: 'f54b', acceptedStyles: ['solid'] },
        'shoelace': { hexCode: 'e60c', acceptedStyles: ['brands'] },
        'shop': { hexCode: 'f54f', acceptedStyles: ['solid'] },
        'shop-lock': { hexCode: 'e4a5', acceptedStyles: ['solid'] },
        'shop-slash': { hexCode: 'e070', acceptedStyles: ['solid'] },
        'shopify': { hexCode: 'e057', acceptedStyles: ['brands'] },
        'shopware': { hexCode: 'f5b5', acceptedStyles: ['brands'] },
        'shower': { hexCode: 'f2cc', acceptedStyles: ['solid'] },
        'shrimp': { hexCode: 'e448', acceptedStyles: ['solid'] },
        'shuffle': { hexCode: 'f074', acceptedStyles: ['solid'] },
        'shuttle-space': { hexCode: 'f197', acceptedStyles: ['solid'] },
        'sign-hanging': { hexCode: 'f4d9', acceptedStyles: ['solid'] },
        'signal': { hexCode: 'f012', acceptedStyles: ['solid'] },
        'signal-messenger': { hexCode: 'e663', acceptedStyles: ['brands'] },
        'signature': { hexCode: 'f5b7', acceptedStyles: ['solid'] },
        'signs-post': { hexCode: 'f277', acceptedStyles: ['solid'] },
        'sim-card': { hexCode: 'f7c4', acceptedStyles: ['solid'] },
        'simplybuilt': { hexCode: 'f215', acceptedStyles: ['brands'] },
        'single-quote-left': { hexCode: 'e81b', acceptedStyles: ['solid'] },
        'single-quote-right': { hexCode: 'e81c', acceptedStyles: ['solid'] },
        'sink': { hexCode: 'e06d', acceptedStyles: ['solid'] },
        'sistrix': { hexCode: 'f3ee', acceptedStyles: ['brands'] },
        'sitemap': { hexCode: 'f0e8', acceptedStyles: ['solid'] },
        'sith': { hexCode: 'f512', acceptedStyles: ['brands'] },
        'sitrox': { hexCode: 'e44a', acceptedStyles: ['brands'] },
        'sketch': { hexCode: 'f7c6', acceptedStyles: ['brands'] },
        'skull': { hexCode: 'f54c', acceptedStyles: ['solid'] },
        'skull-crossbones': { hexCode: 'f714', acceptedStyles: ['solid'] },
        'skyatlas': { hexCode: 'f216', acceptedStyles: ['brands'] },
        'skype': { hexCode: 'f17e', acceptedStyles: ['brands'] },
        'slack': { hexCode: 'f198', acceptedStyles: ['brands'] },
        'slash': { hexCode: 'f715', acceptedStyles: ['solid'] },
        'sleigh': { hexCode: 'f7cc', acceptedStyles: ['solid'] },
        'sliders': { hexCode: 'f1de', acceptedStyles: ['solid'] },
        'slideshare': { hexCode: 'f1e7', acceptedStyles: ['brands'] },
        'smog': { hexCode: 'f75f', acceptedStyles: ['solid'] },
        'smoking': { hexCode: 'f48d', acceptedStyles: ['solid'] },
        'snapchat': { hexCode: 'f2ab', acceptedStyles: ['brands'] },
        'snowflake': { hexCode: 'f2dc', acceptedStyles: ['solid', 'regular'] },
        'snowman': { hexCode: 'f7d0', acceptedStyles: ['solid'] },
        'snowplow': { hexCode: 'f7d2', acceptedStyles: ['solid'] },
        'soap': { hexCode: 'e06e', acceptedStyles: ['solid'] },
        'socks': { hexCode: 'f696', acceptedStyles: ['solid'] },
        'solar-panel': { hexCode: 'f5ba', acceptedStyles: ['solid'] },
        'sort': { hexCode: 'f0dc', acceptedStyles: ['solid'] },
        'sort-down': { hexCode: 'f0dd', acceptedStyles: ['solid'] },
        'sort-up': { hexCode: 'f0de', acceptedStyles: ['solid'] },
        'soundcloud': { hexCode: 'f1be', acceptedStyles: ['brands'] },
        'sourcetree': { hexCode: 'f7d3', acceptedStyles: ['brands'] },
        'spa': { hexCode: 'f5bb', acceptedStyles: ['solid'] },
        'space-awesome': { hexCode: 'e5ac', acceptedStyles: ['brands'] },
        'spaghetti-monster-flying': { hexCode: 'f67b', acceptedStyles: ['solid'] },
        'speakap': { hexCode: 'f3f3', acceptedStyles: ['brands'] },
        'speaker-deck': { hexCode: 'f83c', acceptedStyles: ['brands'] },
        'spell-check': { hexCode: 'f891', acceptedStyles: ['solid'] },
        'spider': { hexCode: 'f717', acceptedStyles: ['solid'] },
        'spinner': { hexCode: 'f110', acceptedStyles: ['solid'] },
        'spiral': { hexCode: 'e80a', acceptedStyles: ['solid'] },
        'splotch': { hexCode: 'f5bc', acceptedStyles: ['solid'] },
        'spoon': { hexCode: 'f2e5', acceptedStyles: ['solid'] },
        'spotify': { hexCode: 'f1bc', acceptedStyles: ['brands'] },
        'spray-can': { hexCode: 'f5bd', acceptedStyles: ['solid'] },
        'spray-can-sparkles': { hexCode: 'f5d0', acceptedStyles: ['solid'] },
        'square': { hexCode: 'f0c8', acceptedStyles: ['solid', 'regular'] },
        'square-arrow-up-right': { hexCode: 'f14c', acceptedStyles: ['solid'] },
        'square-behance': { hexCode: 'f1b5', acceptedStyles: ['brands'] },
        'square-binary': { hexCode: 'e69b', acceptedStyles: ['solid'] },
        'square-bluesky': { hexCode: 'e6a3', acceptedStyles: ['brands'] },
        'square-caret-down': { hexCode: 'f150', acceptedStyles: ['solid', 'regular'] },
        'square-caret-left': { hexCode: 'f191', acceptedStyles: ['solid', 'regular'] },
        'square-caret-right': { hexCode: 'f152', acceptedStyles: ['solid', 'regular'] },
        'square-caret-up': { hexCode: 'f151', acceptedStyles: ['solid', 'regular'] },
        'square-check': { hexCode: 'f14a', acceptedStyles: ['solid', 'regular'] },
        'square-dribbble': { hexCode: 'f397', acceptedStyles: ['brands'] },
        'square-envelope': { hexCode: 'f199', acceptedStyles: ['solid'] },
        'square-facebook': { hexCode: 'f082', acceptedStyles: ['brands'] },
        'square-figma': { hexCode: 'e7e4', acceptedStyles: ['brands'] },
        'square-font-awesome': { hexCode: 'e5ad', acceptedStyles: ['brands'] },
        'square-font-awesome-stroke': { hexCode: 'f35c', acceptedStyles: ['brands'] },
        'square-full': { hexCode: 'f45c', acceptedStyles: ['solid', 'regular'] },
        'square-git': { hexCode: 'f1d2', acceptedStyles: ['brands'] },
        'square-github': { hexCode: 'f092', acceptedStyles: ['brands'] },
        'square-gitlab': { hexCode: 'e5ae', acceptedStyles: ['brands'] },
        'square-google-plus': { hexCode: 'f0d4', acceptedStyles: ['brands'] },
        'square-h': { hexCode: 'f0fd', acceptedStyles: ['solid'] },
        'square-hacker-news': { hexCode: 'f3af', acceptedStyles: ['brands'] },
        'square-instagram': { hexCode: 'e055', acceptedStyles: ['brands'] },
        'square-js': { hexCode: 'f3b9', acceptedStyles: ['brands'] },
        'square-lastfm': { hexCode: 'f203', acceptedStyles: ['brands'] },
        'square-letterboxd': { hexCode: 'e62e', acceptedStyles: ['brands'] },
        'square-linkedin': { hexCode: 'e7d0', acceptedStyles: ['brands'] },
        'square-minus': { hexCode: 'f146', acceptedStyles: ['solid', 'regular'] },
        'square-nfi': { hexCode: 'e576', acceptedStyles: ['solid'] },
        'square-odnoklassniki': { hexCode: 'f264', acceptedStyles: ['brands'] },
        'square-parking': { hexCode: 'f540', acceptedStyles: ['solid'] },
        'square-pen': { hexCode: 'f14b', acceptedStyles: ['solid'] },
        'square-person-confined': { hexCode: 'e577', acceptedStyles: ['solid'] },
        'square-phone': { hexCode: 'f098', acceptedStyles: ['solid'] },
        'square-phone-flip': { hexCode: 'f87b', acceptedStyles: ['solid'] },
        'square-pied-piper': { hexCode: 'e01e', acceptedStyles: ['brands'] },
        'square-pinterest': { hexCode: 'f0d3', acceptedStyles: ['brands'] },
        'square-plus': { hexCode: 'f0fe', acceptedStyles: ['solid', 'regular'] },
        'square-poll-horizontal': { hexCode: 'f682', acceptedStyles: ['solid'] },
        'square-poll-vertical': { hexCode: 'f681', acceptedStyles: ['solid'] },
        'square-reddit': { hexCode: 'f1a2', acceptedStyles: ['brands'] },
        'square-root-variable': { hexCode: 'f698', acceptedStyles: ['solid'] },
        'square-rss': { hexCode: 'f143', acceptedStyles: ['solid'] },
        'square-share-nodes': { hexCode: 'f1e1', acceptedStyles: ['solid'] },
        'square-snapchat': { hexCode: 'f2ad', acceptedStyles: ['brands'] },
        'square-steam': { hexCode: 'f1b7', acceptedStyles: ['brands'] },
        'square-threads': { hexCode: 'e619', acceptedStyles: ['brands'] },
        'square-tumblr': { hexCode: 'f174', acceptedStyles: ['brands'] },
        'square-twitter': { hexCode: 'f081', acceptedStyles: ['brands'] },
        'square-up-right': { hexCode: 'f360', acceptedStyles: ['solid'] },
        'square-upwork': { hexCode: 'e67c', acceptedStyles: ['brands'] },
        'square-viadeo': { hexCode: 'f2aa', acceptedStyles: ['brands'] },
        'square-vimeo': { hexCode: 'f194', acceptedStyles: ['brands'] },
        'square-virus': { hexCode: 'e578', acceptedStyles: ['solid'] },
        'square-web-awesome': { hexCode: 'e683', acceptedStyles: ['brands'] },
        'square-web-awesome-stroke': { hexCode: 'e684', acceptedStyles: ['brands'] },
        'square-whatsapp': { hexCode: 'f40c', acceptedStyles: ['brands'] },
        'square-x-twitter': { hexCode: 'e61a', acceptedStyles: ['brands'] },
        'square-xing': { hexCode: 'f169', acceptedStyles: ['brands'] },
        'square-xmark': { hexCode: 'f2d3', acceptedStyles: ['solid'] },
        'square-youtube': { hexCode: 'f431', acceptedStyles: ['brands'] },
        'squarespace': { hexCode: 'f5be', acceptedStyles: ['brands'] },
        'stack-exchange': { hexCode: 'f18d', acceptedStyles: ['brands'] },
        'stack-overflow': { hexCode: 'f16c', acceptedStyles: ['brands'] },
        'stackpath': { hexCode: 'f842', acceptedStyles: ['brands'] },
        'staff-snake': { hexCode: 'e579', acceptedStyles: ['solid'] },
        'stairs': { hexCode: 'e289', acceptedStyles: ['solid'] },
        'stamp': { hexCode: 'f5bf', acceptedStyles: ['solid'] },
        'stapler': { hexCode: 'e5af', acceptedStyles: ['solid'] },
        'star': { hexCode: 'f005', acceptedStyles: ['solid', 'regular'] },
        'star-and-crescent': { hexCode: 'f699', acceptedStyles: ['solid'] },
        'star-half': { hexCode: 'f089', acceptedStyles: ['solid', 'regular'] },
        'star-half-stroke': { hexCode: 'f5c0', acceptedStyles: ['solid', 'regular'] },
        'star-of-david': { hexCode: 'f69a', acceptedStyles: ['solid'] },
        'star-of-life': { hexCode: 'f621', acceptedStyles: ['solid'] },
        'staylinked': { hexCode: 'f3f5', acceptedStyles: ['brands'] },
        'steam': { hexCode: 'f1b6', acceptedStyles: ['brands'] },
        'steam-symbol': { hexCode: 'f3f6', acceptedStyles: ['brands'] },
        'sterling-sign': { hexCode: 'f154', acceptedStyles: ['solid'] },
        'stethoscope': { hexCode: 'f0f1', acceptedStyles: ['solid'] },
        'sticker-mule': { hexCode: 'f3f7', acceptedStyles: ['brands'] },
        'stop': { hexCode: 'f04d', acceptedStyles: ['solid'] },
        'stopwatch': { hexCode: 'f2f2', acceptedStyles: ['solid'] },
        'stopwatch-20': { hexCode: 'e06f', acceptedStyles: ['solid'] },
        'store': { hexCode: 'f54e', acceptedStyles: ['solid'] },
        'store-slash': { hexCode: 'e071', acceptedStyles: ['solid'] },
        'strava': { hexCode: 'f428', acceptedStyles: ['brands'] },
        'street-view': { hexCode: 'f21d', acceptedStyles: ['solid'] },
        'strikethrough': { hexCode: 'f0cc', acceptedStyles: ['solid'] },
        'stripe': { hexCode: 'f429', acceptedStyles: ['brands'] },
        'stripe-s': { hexCode: 'f42a', acceptedStyles: ['brands'] },
        'stroopwafel': { hexCode: 'f551', acceptedStyles: ['solid'] },
        'stubber': { hexCode: 'e5c7', acceptedStyles: ['brands'] },
        'studiovinari': { hexCode: 'f3f8', acceptedStyles: ['brands'] },
        'stumbleupon': { hexCode: 'f1a4', acceptedStyles: ['brands'] },
        'stumbleupon-circle': { hexCode: 'f1a3', acceptedStyles: ['brands'] },
        'subscript': { hexCode: 'f12c', acceptedStyles: ['solid'] },
        'suitcase': { hexCode: 'f0f2', acceptedStyles: ['solid'] },
        'suitcase-medical': { hexCode: 'f0fa', acceptedStyles: ['solid'] },
        'suitcase-rolling': { hexCode: 'f5c1', acceptedStyles: ['solid'] },
        'sun': { hexCode: 'f185', acceptedStyles: ['solid', 'regular'] },
        'sun-plant-wilt': { hexCode: 'e57a', acceptedStyles: ['solid'] },
        'superpowers': { hexCode: 'f2dd', acceptedStyles: ['brands'] },
        'superscript': { hexCode: 'f12b', acceptedStyles: ['solid'] },
        'supple': { hexCode: 'f3f9', acceptedStyles: ['brands'] },
        'suse': { hexCode: 'f7d6', acceptedStyles: ['brands'] },
        'swatchbook': { hexCode: 'f5c3', acceptedStyles: ['solid'] },
        'swift': { hexCode: 'f8e1', acceptedStyles: ['brands'] },
        'symfony': { hexCode: 'f83d', acceptedStyles: ['brands'] },
        'synagogue': { hexCode: 'f69b', acceptedStyles: ['solid'] },
        'syringe': { hexCode: 'f48e', acceptedStyles: ['solid'] },
        't': { hexCode: '54', acceptedStyles: ['solid'] },
        'table': { hexCode: 'f0ce', acceptedStyles: ['solid'] },
        'table-cells': { hexCode: 'f00a', acceptedStyles: ['solid'] },
        'table-cells-column-lock': { hexCode: 'e678', acceptedStyles: ['solid'] },
        'table-cells-large': { hexCode: 'f009', acceptedStyles: ['solid'] },
        'table-cells-row-lock': { hexCode: 'e67a', acceptedStyles: ['solid'] },
        'table-cells-row-unlock': { hexCode: 'e691', acceptedStyles: ['solid'] },
        'table-columns': { hexCode: 'f0db', acceptedStyles: ['solid'] },
        'table-list': { hexCode: 'f00b', acceptedStyles: ['solid'] },
        'table-tennis-paddle-ball': { hexCode: 'f45d', acceptedStyles: ['solid'] },
        'tablet': { hexCode: 'f3fb', acceptedStyles: ['solid'] },
        'tablet-button': { hexCode: 'f10a', acceptedStyles: ['solid'] },
        'tablet-screen-button': { hexCode: 'f3fa', acceptedStyles: ['solid'] },
        'tablets': { hexCode: 'f490', acceptedStyles: ['solid'] },
        'tachograph-digital': { hexCode: 'f566', acceptedStyles: ['solid'] },
        'tag': { hexCode: 'f02b', acceptedStyles: ['solid'] },
        'tags': { hexCode: 'f02c', acceptedStyles: ['solid'] },
        'tape': { hexCode: 'f4db', acceptedStyles: ['solid'] },
        'tarp': { hexCode: 'e57b', acceptedStyles: ['solid'] },
        'tarp-droplet': { hexCode: 'e57c', acceptedStyles: ['solid'] },
        'taxi': { hexCode: 'f1ba', acceptedStyles: ['solid'] },
        'teamspeak': { hexCode: 'f4f9', acceptedStyles: ['brands'] },
        'teeth': { hexCode: 'f62e', acceptedStyles: ['solid'] },
        'teeth-open': { hexCode: 'f62f', acceptedStyles: ['solid'] },
        'telegram': { hexCode: 'f2c6', acceptedStyles: ['brands'] },
        'temperature-arrow-down': { hexCode: 'e03f', acceptedStyles: ['solid'] },
        'temperature-arrow-up': { hexCode: 'e040', acceptedStyles: ['solid'] },
        'temperature-empty': { hexCode: 'f2cb', acceptedStyles: ['solid'] },
        'temperature-full': { hexCode: 'f2c7', acceptedStyles: ['solid'] },
        'temperature-half': { hexCode: 'f2c9', acceptedStyles: ['solid'] },
        'temperature-high': { hexCode: 'f769', acceptedStyles: ['solid'] },
        'temperature-low': { hexCode: 'f76b', acceptedStyles: ['solid'] },
        'temperature-quarter': { hexCode: 'f2ca', acceptedStyles: ['solid'] },
        'temperature-three-quarters': { hexCode: 'f2c8', acceptedStyles: ['solid'] },
        'tencent-weibo': { hexCode: 'f1d5', acceptedStyles: ['brands'] },
        'tenge-sign': { hexCode: 'f7d7', acceptedStyles: ['solid'] },
        'tent': { hexCode: 'e57d', acceptedStyles: ['solid'] },
        'tent-arrow-down-to-line': { hexCode: 'e57e', acceptedStyles: ['solid'] },
        'tent-arrow-left-right': { hexCode: 'e57f', acceptedStyles: ['solid'] },
        'tent-arrow-turn-left': { hexCode: 'e580', acceptedStyles: ['solid'] },
        'tent-arrows-down': { hexCode: 'e581', acceptedStyles: ['solid'] },
        'tents': { hexCode: 'e582', acceptedStyles: ['solid'] },
        'terminal': { hexCode: 'f120', acceptedStyles: ['solid'] },
        'tex': { hexCode: 'e7ff', acceptedStyles: ['brands'] },
        'text-height': { hexCode: 'f034', acceptedStyles: ['solid'] },
        'text-slash': { hexCode: 'f87d', acceptedStyles: ['solid'] },
        'text-width': { hexCode: 'f035', acceptedStyles: ['solid'] },
        'the-red-yeti': { hexCode: 'f69d', acceptedStyles: ['brands'] },
        'themeco': { hexCode: 'f5c6', acceptedStyles: ['brands'] },
        'themeisle': { hexCode: 'f2b2', acceptedStyles: ['brands'] },
        'thermometer': { hexCode: 'f491', acceptedStyles: ['solid'] },
        'think-peaks': { hexCode: 'f731', acceptedStyles: ['brands'] },
        'threads': { hexCode: 'e618', acceptedStyles: ['brands'] },
        'thumbs-down': { hexCode: 'f165', acceptedStyles: ['solid', 'regular'] },
        'thumbs-up': { hexCode: 'f164', acceptedStyles: ['solid', 'regular'] },
        'thumbtack': { hexCode: 'f08d', acceptedStyles: ['solid'] },
        'thumbtack-slash': { hexCode: 'e68f', acceptedStyles: ['solid'] },
        'ticket': { hexCode: 'f145', acceptedStyles: ['solid'] },
        'ticket-simple': { hexCode: 'f3ff', acceptedStyles: ['solid'] },
        'tidal': { hexCode: 'e7dc', acceptedStyles: ['brands'] },
        'tiktok': { hexCode: 'e07b', acceptedStyles: ['brands'] },
        'timeline': { hexCode: 'e29c', acceptedStyles: ['solid'] },
        'toggle-off': { hexCode: 'f204', acceptedStyles: ['solid'] },
        'toggle-on': { hexCode: 'f205', acceptedStyles: ['solid'] },
        'toilet': { hexCode: 'f7d8', acceptedStyles: ['solid'] },
        'toilet-paper': { hexCode: 'f71e', acceptedStyles: ['solid'] },
        'toilet-paper-slash': { hexCode: 'e072', acceptedStyles: ['solid'] },
        'toilet-portable': { hexCode: 'e583', acceptedStyles: ['solid'] },
        'toilets-portable': { hexCode: 'e584', acceptedStyles: ['solid'] },
        'toolbox': { hexCode: 'f552', acceptedStyles: ['solid'] },
        'tooth': { hexCode: 'f5c9', acceptedStyles: ['solid'] },
        'torii-gate': { hexCode: 'f6a1', acceptedStyles: ['solid'] },
        'tornado': { hexCode: 'f76f', acceptedStyles: ['solid'] },
        'tower-broadcast': { hexCode: 'f519', acceptedStyles: ['solid'] },
        'tower-cell': { hexCode: 'e585', acceptedStyles: ['solid'] },
        'tower-observation': { hexCode: 'e586', acceptedStyles: ['solid'] },
        'tractor': { hexCode: 'f722', acceptedStyles: ['solid'] },
        'trade-federation': { hexCode: 'f513', acceptedStyles: ['brands'] },
        'trademark': { hexCode: 'f25c', acceptedStyles: ['solid'] },
        'traffic-light': { hexCode: 'f637', acceptedStyles: ['solid'] },
        'trailer': { hexCode: 'e041', acceptedStyles: ['solid'] },
        'train': { hexCode: 'f238', acceptedStyles: ['solid'] },
        'train-subway': { hexCode: 'f239', acceptedStyles: ['solid'] },
        'train-tram': { hexCode: 'e5b4', acceptedStyles: ['solid'] },
        'transgender': { hexCode: 'f225', acceptedStyles: ['solid'] },
        'trash': { hexCode: 'f1f8', acceptedStyles: ['solid'] },
        'trash-arrow-up': { hexCode: 'f829', acceptedStyles: ['solid'] },
        'trash-can': { hexCode: 'f2ed', acceptedStyles: ['solid', 'regular'] },
        'trash-can-arrow-up': { hexCode: 'f82a', acceptedStyles: ['solid'] },
        'tree': { hexCode: 'f1bb', acceptedStyles: ['solid'] },
        'tree-city': { hexCode: 'e587', acceptedStyles: ['solid'] },
        'trello': { hexCode: 'f181', acceptedStyles: ['brands'] },
        'triangle-exclamation': { hexCode: 'f071', acceptedStyles: ['solid'] },
        'trophy': { hexCode: 'f091', acceptedStyles: ['solid'] },
        'trowel': { hexCode: 'e589', acceptedStyles: ['solid'] },
        'trowel-bricks': { hexCode: 'e58a', acceptedStyles: ['solid'] },
        'truck': { hexCode: 'f0d1', acceptedStyles: ['solid', 'regular'] },
        'truck-arrow-right': { hexCode: 'e58b', acceptedStyles: ['solid'] },
        'truck-droplet': { hexCode: 'e58c', acceptedStyles: ['solid'] },
        'truck-fast': { hexCode: 'f48b', acceptedStyles: ['solid'] },
        'truck-field': { hexCode: 'e58d', acceptedStyles: ['solid'] },
        'truck-field-un': { hexCode: 'e58e', acceptedStyles: ['solid'] },
        'truck-front': { hexCode: 'e2b7', acceptedStyles: ['solid'] },
        'truck-medical': { hexCode: 'f0f9', acceptedStyles: ['solid'] },
        'truck-monster': { hexCode: 'f63b', acceptedStyles: ['solid'] },
        'truck-moving': { hexCode: 'f4df', acceptedStyles: ['solid'] },
        'truck-pickup': { hexCode: 'f63c', acceptedStyles: ['solid'] },
        'truck-plane': { hexCode: 'e58f', acceptedStyles: ['solid'] },
        'truck-ramp-box': { hexCode: 'f4de', acceptedStyles: ['solid'] },
        'tty': { hexCode: 'f1e4', acceptedStyles: ['solid'] },
        'tumblr': { hexCode: 'f173', acceptedStyles: ['brands'] },
        'turkish-lira-sign': { hexCode: 'e2bb', acceptedStyles: ['solid'] },
        'turn-down': { hexCode: 'f3be', acceptedStyles: ['solid'] },
        'turn-up': { hexCode: 'f3bf', acceptedStyles: ['solid'] },
        'tv': { hexCode: 'f26c', acceptedStyles: ['solid'] },
        'twitch': { hexCode: 'f1e8', acceptedStyles: ['brands'] },
        'twitter': { hexCode: 'f099', acceptedStyles: ['brands'] },
        'typo3': { hexCode: 'f42b', acceptedStyles: ['brands'] },
        'u': { hexCode: '55', acceptedStyles: ['solid'] },
        'uber': { hexCode: 'f402', acceptedStyles: ['brands'] },
        'ubuntu': { hexCode: 'f7df', acceptedStyles: ['brands'] },
        'uikit': { hexCode: 'f403', acceptedStyles: ['brands'] },
        'umbraco': { hexCode: 'f8e8', acceptedStyles: ['brands'] },
        'umbrella': { hexCode: 'f0e9', acceptedStyles: ['solid'] },
        'umbrella-beach': { hexCode: 'f5ca', acceptedStyles: ['solid'] },
        'uncharted': { hexCode: 'e084', acceptedStyles: ['brands'] },
        'underline': { hexCode: 'f0cd', acceptedStyles: ['solid'] },
        'uniregistry': { hexCode: 'f404', acceptedStyles: ['brands'] },
        'unity': { hexCode: 'e049', acceptedStyles: ['brands'] },
        'universal-access': { hexCode: 'f29a', acceptedStyles: ['solid'] },
        'unlock': { hexCode: 'f09c', acceptedStyles: ['solid'] },
        'unlock-keyhole': { hexCode: 'f13e', acceptedStyles: ['solid'] },
        'unsplash': { hexCode: 'e07c', acceptedStyles: ['brands'] },
        'untappd': { hexCode: 'f405', acceptedStyles: ['brands'] },
        'up-down': { hexCode: 'f338', acceptedStyles: ['solid'] },
        'up-down-left-right': { hexCode: 'f0b2', acceptedStyles: ['solid'] },
        'up-long': { hexCode: 'f30c', acceptedStyles: ['solid'] },
        'up-right-and-down-left-from-center': { hexCode: 'f424', acceptedStyles: ['solid'] },
        'up-right-from-square': { hexCode: 'f35d', acceptedStyles: ['solid'] },
        'upload': { hexCode: 'f093', acceptedStyles: ['solid'] },
        'ups': { hexCode: 'f7e0', acceptedStyles: ['brands'] },
        'upwork': { hexCode: 'e641', acceptedStyles: ['brands'] },
        'usb': { hexCode: 'f287', acceptedStyles: ['brands'] },
        'user': { hexCode: 'f007', acceptedStyles: ['solid', 'regular'] },
        'user-astronaut': { hexCode: 'f4fb', acceptedStyles: ['solid'] },
        'user-check': { hexCode: 'f4fc', acceptedStyles: ['solid'] },
        'user-clock': { hexCode: 'f4fd', acceptedStyles: ['solid'] },
        'user-doctor': { hexCode: 'f0f0', acceptedStyles: ['solid'] },
        'user-gear': { hexCode: 'f4fe', acceptedStyles: ['solid'] },
        'user-graduate': { hexCode: 'f501', acceptedStyles: ['solid'] },
        'user-group': { hexCode: 'f500', acceptedStyles: ['solid'] },
        'user-injured': { hexCode: 'f728', acceptedStyles: ['solid'] },
        'user-lock': { hexCode: 'f502', acceptedStyles: ['solid'] },
        'user-minus': { hexCode: 'f503', acceptedStyles: ['solid'] },
        'user-ninja': { hexCode: 'f504', acceptedStyles: ['solid'] },
        'user-nurse': { hexCode: 'f82f', acceptedStyles: ['solid'] },
        'user-pen': { hexCode: 'f4ff', acceptedStyles: ['solid'] },
        'user-plus': { hexCode: 'f234', acceptedStyles: ['solid'] },
        'user-secret': { hexCode: 'f21b', acceptedStyles: ['solid'] },
        'user-shield': { hexCode: 'f505', acceptedStyles: ['solid'] },
        'user-slash': { hexCode: 'f506', acceptedStyles: ['solid'] },
        'user-tag': { hexCode: 'f507', acceptedStyles: ['solid'] },
        'user-tie': { hexCode: 'f508', acceptedStyles: ['solid'] },
        'user-xmark': { hexCode: 'f235', acceptedStyles: ['solid'] },
        'users': { hexCode: 'f0c0', acceptedStyles: ['solid'] },
        'users-between-lines': { hexCode: 'e591', acceptedStyles: ['solid'] },
        'users-gear': { hexCode: 'f509', acceptedStyles: ['solid'] },
        'users-line': { hexCode: 'e592', acceptedStyles: ['solid'] },
        'users-rays': { hexCode: 'e593', acceptedStyles: ['solid'] },
        'users-rectangle': { hexCode: 'e594', acceptedStyles: ['solid'] },
        'users-slash': { hexCode: 'e073', acceptedStyles: ['solid'] },
        'users-viewfinder': { hexCode: 'e595', acceptedStyles: ['solid'] },
        'usps': { hexCode: 'f7e1', acceptedStyles: ['brands'] },
        'ussunnah': { hexCode: 'f407', acceptedStyles: ['brands'] },
        'utensils': { hexCode: 'f2e7', acceptedStyles: ['solid'] },
        'v': { hexCode: '56', acceptedStyles: ['solid'] },
        'vaadin': { hexCode: 'f408', acceptedStyles: ['brands'] },
        'van-shuttle': { hexCode: 'f5b6', acceptedStyles: ['solid'] },
        'vault': { hexCode: 'e2c5', acceptedStyles: ['solid'] },
        'venus': { hexCode: 'f221', acceptedStyles: ['solid'] },
        'venus-double': { hexCode: 'f226', acceptedStyles: ['solid'] },
        'venus-mars': { hexCode: 'f228', acceptedStyles: ['solid'] },
        'vest': { hexCode: 'e085', acceptedStyles: ['solid'] },
        'vest-patches': { hexCode: 'e086', acceptedStyles: ['solid'] },
        'viacoin': { hexCode: 'f237', acceptedStyles: ['brands'] },
        'viadeo': { hexCode: 'f2a9', acceptedStyles: ['brands'] },
        'vial': { hexCode: 'f492', acceptedStyles: ['solid'] },
        'vial-circle-check': { hexCode: 'e596', acceptedStyles: ['solid'] },
        'vial-virus': { hexCode: 'e597', acceptedStyles: ['solid'] },
        'vials': { hexCode: 'f493', acceptedStyles: ['solid'] },
        'viber': { hexCode: 'f409', acceptedStyles: ['brands'] },
        'video': { hexCode: 'f03d', acceptedStyles: ['solid'] },
        'video-slash': { hexCode: 'f4e2', acceptedStyles: ['solid'] },
        'vihara': { hexCode: 'f6a7', acceptedStyles: ['solid'] },
        'vimeo': { hexCode: 'f40a', acceptedStyles: ['brands'] },
        'vimeo-v': { hexCode: 'f27d', acceptedStyles: ['brands'] },
        'vine': { hexCode: 'f1ca', acceptedStyles: ['brands'] },
        'virus': { hexCode: 'e074', acceptedStyles: ['solid'] },
        'virus-covid': { hexCode: 'e4a8', acceptedStyles: ['solid'] },
        'virus-covid-slash': { hexCode: 'e4a9', acceptedStyles: ['solid'] },
        'virus-slash': { hexCode: 'e075', acceptedStyles: ['solid'] },
        'viruses': { hexCode: 'e076', acceptedStyles: ['solid'] },
        'vk': { hexCode: 'f189', acceptedStyles: ['brands'] },
        'vnv': { hexCode: 'f40b', acceptedStyles: ['brands'] },
        'voicemail': { hexCode: 'f897', acceptedStyles: ['solid'] },
        'volcano': { hexCode: 'f770', acceptedStyles: ['solid'] },
        'volleyball': { hexCode: 'f45f', acceptedStyles: ['solid'] },
        'volume-high': { hexCode: 'f028', acceptedStyles: ['solid'] },
        'volume-low': { hexCode: 'f027', acceptedStyles: ['solid'] },
        'volume-off': { hexCode: 'f026', acceptedStyles: ['solid'] },
        'volume-xmark': { hexCode: 'f6a9', acceptedStyles: ['solid'] },
        'vr-cardboard': { hexCode: 'f729', acceptedStyles: ['solid'] },
        'vsco': { hexCode: 'e7dd', acceptedStyles: ['brands'] },
        'vuejs': { hexCode: 'f41f', acceptedStyles: ['brands'] },
        'w': { hexCode: '57', acceptedStyles: ['solid'] },
        'w3c': { hexCode: 'e7de', acceptedStyles: ['brands'] },
        'walkie-talkie': { hexCode: 'f8ef', acceptedStyles: ['solid'] },
        'wallet': { hexCode: 'f555', acceptedStyles: ['solid'] },
        'wand-magic': { hexCode: 'f0d0', acceptedStyles: ['solid'] },
        'wand-magic-sparkles': { hexCode: 'e2ca', acceptedStyles: ['solid'] },
        'wand-sparkles': { hexCode: 'f72b', acceptedStyles: ['solid'] },
        'warehouse': { hexCode: 'f494', acceptedStyles: ['solid'] },
        'watchman-monitoring': { hexCode: 'e087', acceptedStyles: ['brands'] },
        'water': { hexCode: 'f773', acceptedStyles: ['solid'] },
        'water-ladder': { hexCode: 'f5c5', acceptedStyles: ['solid'] },
        'wave-square': { hexCode: 'f83e', acceptedStyles: ['solid'] },
        'waze': { hexCode: 'f83f', acceptedStyles: ['brands'] },
        'web-awesome': { hexCode: 'e682', acceptedStyles: ['solid', 'brands'] },
        'webflow': { hexCode: 'e65c', acceptedStyles: ['brands'] },
        'weebly': { hexCode: 'f5cc', acceptedStyles: ['brands'] },
        'weibo': { hexCode: 'f18a', acceptedStyles: ['brands'] },
        'weight-hanging': { hexCode: 'f5cd', acceptedStyles: ['solid'] },
        'weight-scale': { hexCode: 'f496', acceptedStyles: ['solid'] },
        'weixin': { hexCode: 'f1d7', acceptedStyles: ['brands'] },
        'whatsapp': { hexCode: 'f232', acceptedStyles: ['brands'] },
        'wheat-awn': { hexCode: 'e2cd', acceptedStyles: ['solid'] },
        'wheat-awn-circle-exclamation': { hexCode: 'e598', acceptedStyles: ['solid'] },
        'wheelchair': { hexCode: 'f193', acceptedStyles: ['solid'] },
        'wheelchair-move': { hexCode: 'e2ce', acceptedStyles: ['solid'] },
        'whiskey-glass': { hexCode: 'f7a0', acceptedStyles: ['solid'] },
        'whmcs': { hexCode: 'f40d', acceptedStyles: ['brands'] },
        'wifi': { hexCode: 'f1eb', acceptedStyles: ['solid'] },
        'wikipedia-w': { hexCode: 'f266', acceptedStyles: ['brands'] },
        'wind': { hexCode: 'f72e', acceptedStyles: ['solid'] },
        'window-maximize': { hexCode: 'f2d0', acceptedStyles: ['solid', 'regular'] },
        'window-minimize': { hexCode: 'f2d1', acceptedStyles: ['solid', 'regular'] },
        'window-restore': { hexCode: 'f2d2', acceptedStyles: ['solid', 'regular'] },
        'windows': { hexCode: 'f17a', acceptedStyles: ['brands'] },
        'wine-bottle': { hexCode: 'f72f', acceptedStyles: ['solid'] },
        'wine-glass': { hexCode: 'f4e3', acceptedStyles: ['solid'] },
        'wine-glass-empty': { hexCode: 'f5ce', acceptedStyles: ['solid'] },
        'wirsindhandwerk': { hexCode: 'e2d0', acceptedStyles: ['brands'] },
        'wix': { hexCode: 'f5cf', acceptedStyles: ['brands'] },
        'wizards-of-the-coast': { hexCode: 'f730', acceptedStyles: ['brands'] },
        'wodu': { hexCode: 'e088', acceptedStyles: ['brands'] },
        'wolf-pack-battalion': { hexCode: 'f514', acceptedStyles: ['brands'] },
        'won-sign': { hexCode: 'f159', acceptedStyles: ['solid'] },
        'wordpress': { hexCode: 'f19a', acceptedStyles: ['brands'] },
        'wordpress-simple': { hexCode: 'f411', acceptedStyles: ['brands'] },
        'worm': { hexCode: 'e599', acceptedStyles: ['solid'] },
        'wpbeginner': { hexCode: 'f297', acceptedStyles: ['brands'] },
        'wpexplorer': { hexCode: 'f2de', acceptedStyles: ['brands'] },
        'wpforms': { hexCode: 'f298', acceptedStyles: ['brands'] },
        'wpressr': { hexCode: 'f3e4', acceptedStyles: ['brands'] },
        'wrench': { hexCode: 'f0ad', acceptedStyles: ['solid'] },
        'x': { hexCode: '58', acceptedStyles: ['solid'] },
        'x-ray': { hexCode: 'f497', acceptedStyles: ['solid'] },
        'x-twitter': { hexCode: 'e61b', acceptedStyles: ['brands'] },
        'xbox': { hexCode: 'f412', acceptedStyles: ['brands'] },
        'xing': { hexCode: 'f168', acceptedStyles: ['brands'] },
        'xmark': { hexCode: 'f00d', acceptedStyles: ['solid'] },
        'xmarks-lines': { hexCode: 'e59a', acceptedStyles: ['solid'] },
        'y': { hexCode: '59', acceptedStyles: ['solid'] },
        'y-combinator': { hexCode: 'f23b', acceptedStyles: ['brands'] },
        'yahoo': { hexCode: 'f19e', acceptedStyles: ['brands'] },
        'yammer': { hexCode: 'f840', acceptedStyles: ['brands'] },
        'yandex': { hexCode: 'f413', acceptedStyles: ['brands'] },
        'yandex-international': { hexCode: 'f414', acceptedStyles: ['brands'] },
        'yarn': { hexCode: 'f7e3', acceptedStyles: ['brands'] },
        'yelp': { hexCode: 'f1e9', acceptedStyles: ['brands'] },
        'yen-sign': { hexCode: 'f157', acceptedStyles: ['solid'] },
        'yin-yang': { hexCode: 'f6ad', acceptedStyles: ['solid'] },
        'yoast': { hexCode: 'f2b1', acceptedStyles: ['brands'] },
        'youtube': { hexCode: 'f167', acceptedStyles: ['brands'] },
        'z': { hexCode: '5a', acceptedStyles: ['solid'] },
        'zhihu': { hexCode: 'f63f', acceptedStyles: ['brands'] },
    };

    /**
     * Converts a decimal number to Font Awesome Unicode format
     */
    const convertToFontAwesome = (codeIcon) => {
        return String.fromCharCode(parseInt(codeIcon, 16));
    };

    const getIconChar = (key) => {
        if (!fontIcons[key]) {
            throw new Error(`Icon ${key} not found in fontIcons`);
        }
        return convertToFontAwesome(fontIcons[key].hexCode);
    };
    const getIconStyles = (key) => {
        if (!fontIcons[key]) {
            throw new Error(`Icon ${key} not found in fontIcons`);
        }
        return new Set(fontIcons[key].acceptedStyles);
    };

    const getIconHex = (key) => {
        if (!fontIcons[key]) {
            throw new Error(`Icon ${key} not found in fontIcons`);
        }
        return fontIcons[key].hexCode;
    };

    /**
     * IconText is a Phaser Text GameObject that displays Font Awesome icons
     * By default, the origin is set to (0.5, 0.5). To change it, use setOrigin() method
     *
     * @param scene - The Scene to which this IconText belongs
     * @param x - The horizontal position of this IconText in the world
     * @param y - The vertical position of this IconText in the world
     * @param icon - The Font Awesome icon key to display
     * @param size - The font size in pixels (default: 16)
     * @param style - Additional text style configuration options
     */
    class IconText extends Phaser$1.GameObjects.Text {
        currentIconStyle = 'solid';
        icon;
        constructor({ scene, x, y, icon, size = 16, style = {}, iconStyle = 'solid', }) {
            super(scene, x, y, getIconChar(icon), {
                fontSize: `${size}px`,
                ...style,
            });
            this.icon = icon;
            this.currentIconStyle = iconStyle;
            this.applyIconStyle(this.currentIconStyle);
            this.setOrigin(0.5, 0.5);
        }
        setIcon(icon, opts) {
            this.setText(getIconChar(icon));
            this.icon = icon;
            if (opts?.iconStyle) {
                this.applyIconStyle(opts.iconStyle);
            }
        }
        setIconStyle(iconStyle) {
            this.applyIconStyle(iconStyle);
        }
        getIconStyle() {
            return this.currentIconStyle;
        }
        getIcon() {
            return this.icon;
        }
        applyIconStyle(iconStyle) {
            let newIconStyle = iconStyle;
            const availableStyles = getIconStyles(this.icon);
            if (!availableStyles.has(iconStyle)) {
                const newStyle = [...availableStyles][0];
                // eslint-disable-next-line no-console
                console.warn(`Icon ${this.icon} does not support style "${iconStyle}", using "${newStyle}" instead. Available styles: ${Array.from([...availableStyles].map(style => `"${style}"`)).join(', ')}`);
                newIconStyle = newStyle;
            }
            // Font Awesome v7:
            // - Free Regular (400) and Free Solid (900) share family "Font Awesome 6 Free"
            // - Brands (400) uses family "Font Awesome 6 Brands"
            if (newIconStyle === 'brands') {
                this.setFontFamily("'Font Awesome 7 Brands'");
                this.setFontStyle('normal');
            }
            else {
                this.setFontFamily("'Font Awesome 7 Free'");
                // Use bold for solid, normal for regular. Bold maps to the closest available weight (900 for solid)
                this.setFontStyle(newIconStyle === 'solid' ? 'bold' : 'normal');
            }
            this.currentIconStyle = newIconStyle;
        }
    }

    const ensureFA7Ready = async () => {
        const loads = [
            document.fonts.load('900 16px "Font Awesome 7 Free"', '\uf005'), // Solid (peso 900)
            document.fonts.load('400 16px "Font Awesome 7 Free"', '\uf2b9'), // Regular (peso 400)
            document.fonts.load('400 16px "Font Awesome 7 Brands"', '\uf09b'), // Brands (400)
        ];
        await Promise.all(loads);
        await document['fonts'].ready;
    };
    const loadFont = (url) => {
        return new Promise((resolve, reject) => {
            WebFont.load({
                custom: {
                    families: [
                        'Font Awesome 7 Free',
                        'Font Awesome 7 Brands',
                        'Font Awesome 5 Brands',
                        'Font Awesome 5 Free',
                        'FontAwesome',
                    ],
                    urls: [
                        url ?? 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css',
                    ],
                },
                active: () => {
                    ensureFA7Ready().then(() => {
                        resolve();
                    }).catch(() => {
                        reject();
                    });
                },
                inactive: () => {
                    reject();
                },
            });
        });
    };

    var FontAwesome = /*#__PURE__*/Object.freeze({
        __proto__: null,
        IconText: IconText,
        fontIcons: fontIcons,
        getIconChar: getIconChar,
        getIconHex: getIconHex,
        getIconStyles: getIconStyles,
        loadFont: loadFont
    });

    const getPWFromScene = (scene) => {
        return scene.pw;
    };

    /** Default gap between elements in pixels */
    const DEFAULT_GAP = 8;
    /** Measures the display width of a game object, with fallbacks */
    const getDisplayWidthOf = (child) => {
        const childTyped = child;
        // Check if it's a Container-like object (has list property and width/height)
        if (child && typeof child === 'object' && 'list' in child && Array.isArray(child.list)) {
            if (typeof childTyped.displayWidth === 'number' && childTyped.displayWidth > 0) {
                return childTyped.displayWidth;
            }
            if (typeof childTyped.width === 'number' && childTyped.width > 0) {
                return childTyped.width;
            }
            const container = child;
            if (typeof container.displayWidth === 'number' && container.displayWidth > 0) {
                return container.displayWidth;
            }
            if (typeof container.width === 'number' && container.width > 0) {
                if (typeof container.scale === 'number' && container.scale > 0) {
                    return container.width / container.scale;
                }
                return container.width;
            }
            let w = 0;
            for (const sub of container.list) {
                const size = getDisplayWidthOf(sub);
                w = Math.max(w, size);
            }
            return w;
        }
        if (typeof childTyped.displayWidth === 'number') {
            return childTyped.displayWidth;
        }
        if (typeof childTyped.width === 'number') {
            return childTyped.width;
        }
        const bounds = childTyped.getBounds?.();
        return bounds ? bounds.width : 0;
    };
    /** Measures the display height of a game object, with fallbacks */
    const getDisplayHeightOf = (child) => {
        const childTyped = child;
        // Check if it's a Container-like object (has list property and width/height)
        if (child && typeof child === 'object' && 'list' in child && Array.isArray(child.list)) {
            if (typeof childTyped.displayHeight === 'number' && childTyped.displayHeight > 0) {
                return childTyped.displayHeight;
            }
            if (typeof childTyped.height === 'number' && childTyped.height > 0) {
                return childTyped.height;
            }
            const container = child;
            if (typeof container.displayHeight === 'number' && container.displayHeight > 0) {
                return container.displayHeight;
            }
            if (typeof container.height === 'number' && container.height > 0) {
                if (typeof container.scale === 'number' && container.scale > 0) {
                    return container.height / container.scale;
                }
                return container.height;
            }
            let h = 0;
            for (const sub of container.list) {
                const size = getDisplayHeightOf(sub);
                h = Math.max(h, size);
            }
            return h;
        }
        if (typeof childTyped.displayHeight === 'number') {
            return childTyped.displayHeight;
        }
        if (typeof childTyped.height === 'number') {
            return childTyped.height;
        }
        const bounds = childTyped.getBounds?.();
        return bounds ? bounds.height : 0;
    };
    /** Returns normalized origin (0..1) for a game object */
    const getNormalizedOriginOf = (child) => {
        const width = getDisplayWidthOf(child);
        const height = getDisplayHeightOf(child);
        const childTyped = child;
        let ox = typeof childTyped.originX === 'number' ? childTyped.originX : undefined;
        let oy = typeof childTyped.originY === 'number' ? childTyped.originY : undefined;
        if (ox === undefined &&
            typeof childTyped.displayOriginX === 'number' &&
            width > 0) {
            ox = childTyped.displayOriginX / width;
        }
        if (oy === undefined &&
            typeof childTyped.displayOriginY === 'number' &&
            height > 0) {
            oy = childTyped.displayOriginY / height;
        }
        return { x: ox ?? 0.5, y: oy ?? 0.5 };
    };

    /**
     * A flexible card component that adapts to its child content size
     */
    class Card extends Phaser$1.GameObjects.Container {
        /** The background graphics of the card */
        backgroundGraphics;
        /** The child component contained within the card */
        child;
        /** Reference to the PhaserWind plugin */
        pw;
        /** Margin size in pixels */
        marginPx;
        /** Border radius in pixels */
        borderRadiusPx;
        /** Background color value */
        backgroundColorValue;
        /**
         * Creates a new Card
         * @param params Configuration parameters for the card
         */
        constructor({ scene, x, y, backgroundColor = 'white', borderRadius = 'md', margin = '4', child, width, height, }) {
            super(scene, x, y);
            this.pw = getPWFromScene(scene);
            // Store values
            this.marginPx =
                typeof margin === 'number'
                    ? margin
                    : this.pw.spacing.px(margin ?? '4');
            this.borderRadiusPx =
                typeof borderRadius === 'number'
                    ? borderRadius
                    : this.pw.radius.px(borderRadius ?? 'md');
            this.backgroundColorValue = Color.rgb(backgroundColor);
            // Store child reference
            this.child = child;
            // Create background and setup container
            this.createBackgroundGraphics(scene, width, height);
            this.setupContainer();
        }
        /**
         * Sets the width of the card. Useful when you want to set a fixed width without a child component.
         * @param width Width in pixels
         * @returns this for chaining
         */
        setWidth(width) {
            this.setSize(width, this.height);
            return this;
        }
        /**
         * Sets the height of the card. Useful when you want to set a fixed height without a child component.
         * @param height Height in pixels
         * @returns this for chaining
         */
        setHeight(height) {
            this.setSize(this.width, height);
            return this;
        }
        /**
         * Sets the background color of the card
         * @param color Background color token or string
         * @returns this for chaining
         */
        setBackgroundColor(color) {
            this.backgroundColorValue = Color.rgb(color);
            this.drawBackground();
            return this;
        }
        /**
         * Sets the border radius of the card
         * @param borderRadius Border radius (number in px or RadiusKey)
         * @returns this for chaining
         */
        setBorderRadius(borderRadius) {
            this.borderRadiusPx =
                typeof borderRadius === 'number'
                    ? borderRadius
                    : this.pw.radius.px(borderRadius ?? 'md');
            this.drawBackground();
            return this;
        }
        /**
         * Sets the margin/padding of the card
         * @param margin Margin size (number in px or SpacingKey)
         * @returns this for chaining
         */
        setMargin(margin) {
            this.marginPx =
                typeof margin === 'number'
                    ? margin
                    : this.pw.spacing.px(margin ?? '4');
            this.layout();
            return this;
        }
        /**
         * Sets a new child component for the card
         * @param child New child component
         * @returns this for chaining
         */
        setChild(child) {
            // Remove old child
            if (this.child) {
                this.remove(this.child);
            }
            // Set new child
            this.child = child;
            // Update layout
            this.layout();
            return this;
        }
        /**
         * Creates the background graphics for the card
         * @param scene The scene to add the graphics to
         */
        createBackgroundGraphics(scene, width, height) {
            this.backgroundGraphics = scene.add.graphics();
            this.drawBackground(width, height);
        }
        /**
         * Sets up the container with background and child
         */
        setupContainer() {
            this.add([this.backgroundGraphics]);
            if (this.child) {
                this.add([this.child]);
            }
            this.layout();
        }
        /**
         * Updates the layout after property changes
         */
        layout() {
            if (!this.child) {
                return;
            }
            // Get child bounds using type assertion
            const childBounds = this.child.getBounds();
            // Calculate card dimensions with margin
            const cardWidth = childBounds.width + this.marginPx * 2;
            const cardHeight = childBounds.height + this.marginPx * 2;
            // Check if child has origin property and get its current origin
            const childOrigin = this.getChildOrigin();
            // Calculate child position considering its origin
            const childX = this.calculateChildX(cardWidth, childBounds.width, childOrigin);
            const childY = this.calculateChildY(cardHeight, childBounds.height, childOrigin);
            // Position child in the center of the card
            this.child.setPosition(childX, childY);
            // Redraw background with new dimensions
            this.drawBackground();
        }
        /**
         * Gets the child's origin if it exists
         * @returns Object with x and y origin values, or null if not available
         */
        getChildOrigin() {
            // Check if child has origin property
            if (this.child && 'originX' in this.child && 'originY' in this.child) {
                return {
                    x: this.child.originX,
                    y: this.child.originY,
                };
            }
            // Check if child has getOrigin method
            if (this.child &&
                typeof this.child.getOrigin === 'function') {
                const origin = this.child.getOrigin();
                if (origin &&
                    typeof origin.x === 'number' &&
                    typeof origin.y === 'number') {
                    return { x: origin.x, y: origin.y };
                }
            }
            return null;
        }
        /**
         * Calculates the X position for the child considering its origin
         * @param cardWidth Total width of the card
         * @param childWidth Width of the child
         * @param childOrigin Origin of the child (null if not available)
         * @returns X position for the child
         */
        calculateChildX(cardWidth, childWidth, childOrigin) {
            if (this.child && childOrigin) {
                // Consider child's origin for centering
                // If child origin is 0.5 (center), we need to offset by half the child width
                // If child origin is 0 (left), we need to offset by the full child width
                const originOffsetX = childWidth * childOrigin.x;
                return -cardWidth / 2 + this.marginPx + originOffsetX;
            }
            else {
                // Fallback to default centering (assumes child origin is center)
                return -cardWidth / 2 + this.marginPx;
            }
        }
        /**
         * Calculates the Y position for the child considering its origin
         * @param cardHeight Total height of the card
         * @param childHeight Height of the child
         * @param childOrigin Origin of the child (null if not available)
         * @returns Y position for the child
         */
        calculateChildY(cardHeight, childHeight, childOrigin) {
            if (childOrigin) {
                // Consider child's origin for centering
                // If child origin is 0.5 (center), we need to offset by half the child height
                // If child origin is 0 (top), we need to offset by the full child height
                const originOffsetY = childHeight * childOrigin.y;
                return -cardHeight / 2 + this.marginPx + originOffsetY;
            }
            else {
                // Fallback to default centering (assumes child origin is center)
                return -cardHeight / 2 + this.marginPx;
            }
        }
        measureChild(child) {
            const w = getDisplayWidthOf(child);
            const h = getDisplayHeightOf(child);
            return { w, h };
        }
        /**
         * Draws the background graphics
         */
        drawBackground(w, h) {
            let [width, height] = [0, 0];
            if (w && h) {
                width = w;
                height = h;
            }
            else {
                const { w: cw, h: ch } = this.measureChild(this.child);
                width = cw + this.marginPx * 2;
                height = ch + this.marginPx * 2;
            }
            this.backgroundGraphics.clear();
            // Limit radius to maximum possible for the card dimensions
            const maxRadius = Math.min(width / 2, height / 2);
            const effectiveRadius = Math.min(this.borderRadiusPx, maxRadius);
            // Since Graphics doesn't have setOrigin, we need to calculate the offset manually
            const bgX = -width / 2;
            const bgY = -height / 2;
            // Draw background
            this.backgroundGraphics.fillStyle(Color.hex(this.backgroundColorValue), 1);
            this.backgroundGraphics.fillRoundedRect(bgX, bgY, width, height, effectiveRadius);
        }
    }

    const DEFAULT_ICON = 'spinner';
    const DEFAULT_COLOR = 'blue';
    const ROTATIONS_PER_SECOND = 2;
    const ONE_SECOND = 1000;
    class CircularProgress extends Phaser$1.GameObjects.Container {
        iconText;
        pw;
        rotationSpeed;
        isSpinning = true;
        constructor({ scene, x, y, icon = DEFAULT_ICON, size, color = DEFAULT_COLOR, rotationsPerSecond = ROTATIONS_PER_SECOND }) {
            super(scene, x, y);
            this.pw = getPWFromScene(scene);
            this.rotationSpeed = rotationsPerSecond;
            const sizePx = typeof size === 'number'
                ? size
                : this.pw.fontSize.px(size ?? 'md');
            this.createIconText(scene, icon, sizePx, color);
            this.setupContainer();
            this.startSpinning();
        }
        /**
         * Start the spinning animation
         */
        start() {
            if (!this.isSpinning) {
                this.isSpinning = true;
                this.startSpinning();
            }
            return this;
        }
        /**
         * Stop the spinning animation
         */
        stop() {
            this.isSpinning = false;
            this.scene.tweens.killTweensOf(this.iconText);
            return this;
        }
        /**
         * Set the rotation speed
         * @param speed - Rotations per second
         */
        setRotationsPerSecond(rotationsPerSecond) {
            this.rotationSpeed = rotationsPerSecond;
            if (this.isSpinning) {
                this.scene.tweens.killTweensOf(this.iconText);
                this.startSpinning();
            }
            return this;
        }
        /**
         * Set the icon
         * @param icon - Font Awesome icon key
         */
        setIcon(icon) {
            this.iconText.setIcon(icon);
            return this;
        }
        /**
         * Set the color
         * @param color - Phaser Wind color token
         */
        setColor(color) {
            this.iconText.setStyle({
                color: this.pw.color.rgb(color),
            });
            return this;
        }
        /**
         * Set the size
         * @param size - Font size key or pixel value
         */
        setSize(size) {
            const sizePx = typeof size === 'number'
                ? size
                : this.pw.fontSize.px(size);
            this.iconText.setFontSize(`${sizePx}px`);
            return this;
        }
        /**
         * Check if the spinner is currently spinning
         */
        get spinning() {
            return this.isSpinning;
        }
        createIconText(scene, icon, size, color) {
            this.iconText = new IconText({
                scene,
                x: 0,
                y: 0,
                icon,
                size,
                style: {
                    color: Color.rgb(color),
                },
            });
            this.iconText.setOrigin(0.5, 0.5);
        }
        setupContainer() {
            this.add([this.iconText]);
        }
        startSpinning() {
            if (!this.isSpinning)
                return;
            const duration = ONE_SECOND / this.rotationSpeed;
            this.scene.tweens.add({
                targets: this.iconText,
                rotation: Math.PI * 2,
                duration,
                ease: 'Linear',
                repeat: -1,
                onComplete: () => {
                    // Reset rotation to prevent accumulation
                    this.iconText.rotation = 0;
                },
            });
        }
        /**
         * Clean up the component
         */
        destroy() {
            this.stop();
            super.destroy();
        }
    }

    /* eslint-disable max-lines-per-function */
    /* eslint-disable complexity */
    /**
     * Column is a layout container that stacks children vertically with a gap.
     * The container position (x, y) represents the center of the whole column.
     */
    class Column extends Phaser$1.GameObjects.Container {
        /** Gap between elements in pixels */
        gap;
        /** Horizontal alignment of elements */
        align;
        /** Vertical origin point of the column */
        verticalOrigin;
        /**
         * Creates a new Column container
         * @param params Configuration parameters for the column
         */
        constructor({ scene, x, y, gap = DEFAULT_GAP, align = 'center', children = [], verticalOrigin = 'center', }) {
            super(scene, x, y);
            this.gap = gap;
            this.align = align;
            this.verticalOrigin = verticalOrigin;
            if (children.length > 0) {
                this.add(children);
            }
            this.layout();
        }
        /**
         * Sets the spacing between children and relayouts
         * @param gap Gap in pixels between elements
         */
        setGap(gap) {
            this.gap = gap;
            this.layout();
        }
        /**
         * Sets the horizontal alignment and relayouts
         * @param align New horizontal alignment
         */
        setAlign(align) {
            this.align = align;
            this.layout();
        }
        /**
         * Adds a child game object to the column
         * @param child Game object to add
         * @param relayout Whether to relayout after adding (default: true)
         * @returns This column instance for chaining
         */
        addChild(child, relayout = true) {
            this.add(child);
            if (relayout)
                this.layout();
            return this;
        }
        /**
         * Adds multiple children to the column
         * @param children Array of game objects to add
         * @param relayout Whether to relayout after adding (default: true)
         * @returns This column instance for chaining
         */
        addChildren(children, relayout = true) {
            if (children.length > 0)
                this.add(children);
            if (relayout)
                this.layout();
            return this;
        }
        /**
         * Recomputes children's positions and updates this container size
         * Positions are calculated based on alignment, origins and gaps
         */
        layout() {
            const children = this.list;
            if (children.length === 0) {
                // Reset size when empty
                this.setSize(0, 0);
                return;
            }
            // Measure sizes and origins
            const entries = children.map((child) => ({
                child,
                width: this.getDisplayWidth(child),
                height: this.getDisplayHeight(child),
                origin: this.getNormalizedOrigin(child),
            }));
            const maxWidth = entries.reduce((m, s) => Math.max(m, s.width), 0);
            const totalHeight = entries.reduce((sum, s) => sum + s.height, 0) + this.gap * (entries.length - 1);
            // Determine top of content based on verticalOrigin
            const contentTopY = this.verticalOrigin === 'top' ? 0 : this.verticalOrigin === 'center' ? -totalHeight / 2 : -totalHeight;
            // Walk from top to bottom, aligning considering each child's origin
            let cursorTopY = contentTopY;
            for (const { child, width, height, origin } of entries) {
                // Horizontal alignment: align left/right edges or centers correctly using origin
                let x = 0;
                if (this.align === 'left') {
                    // place child's left edge at content left
                    x = -maxWidth / 2 + origin.x * width;
                }
                else if (this.align === 'right') {
                    // place child's right edge at content right
                    x = maxWidth / 2 - (1 - origin.x) * width;
                }
                else {
                    // center alignment: center of child at 0 accounting for origin
                    x = (origin.x - 0.5) * width;
                }
                // Vertical position so that child's top is at cursorTopY
                const y = cursorTopY + origin.y * height;
                child.setPosition(x, y);
                cursorTopY += height + this.gap;
            }
            // Update this container size to match content bounds
            this.setSize(maxWidth, totalHeight);
        }
        /**
         * Gets the display width of a game object
         * @param child GameObject to measure
         * @returns Display width in pixels
         */
        getDisplayWidth(child) {
            return getDisplayWidthOf(child);
        }
        /**
         * Gets the display height of a game object
         * @param child GameObject to measure
         * @returns Display height in pixels
         */
        getDisplayHeight(child) {
            return getDisplayHeightOf(child);
        }
        /**
         * Gets the normalized origin point of a game object
         * @param child GameObject to get origin from
         * @returns Object with normalized x,y coordinates of the origin point
         */
        getNormalizedOrigin(child) {
            return getNormalizedOriginOf(child);
        }
    }

    const durations$2 = {
        click: 100};
    const CLICK_OFFSET$2 = 2;
    const BUTTON_SCALE$1 = 2.2;
    const CENTER_OFFSET$1 = 1.1;
    class FlatIconButton extends Phaser$1.GameObjects.Container {
        backgroundSprite;
        iconText;
        pw;
        baseSizePx;
        borderRadiusPx;
        backgroundColorValue; // rgb string
        iconColorValue; // rgb string
        backgroundOpacityValue = 1;
        iconOpacityValue = 1;
        constructor({ scene, x, y, icon, iconStyle = 'solid', size, backgroundColor = 'gray-600', iconColor = 'white', onClick, borderRadius = 'md', backgroundOpacity = 1, iconOpacity = 1, }) {
            super(scene, x, y);
            this.pw = getPWFromScene(scene);
            this.baseSizePx =
                typeof size === 'number'
                    ? size
                    : this.pw.fontSize.px(size ?? 'md');
            this.updateSize();
            this.borderRadiusPx =
                typeof borderRadius === 'number'
                    ? borderRadius
                    : this.pw.radius.px((borderRadius ?? 'md'));
            this.backgroundColorValue = Color.rgb(backgroundColor);
            this.iconColorValue = Color.rgb(iconColor);
            this.backgroundOpacityValue = backgroundOpacity;
            this.iconOpacityValue = iconOpacity;
            this.createBackgroundSprite(scene);
            this.createIconText(scene, icon, iconStyle);
            this.setupContainer();
            this.setupInteractivity(onClick);
        }
        // API: colors
        setBackgroundColor(color) {
            this.backgroundColorValue = Color.rgb(color);
            this.regenerateBackgroundTexture();
            return this;
        }
        setIconColor(color) {
            this.iconColorValue = Color.rgb(color);
            this.iconText.setColor(this.iconColorValue);
            this.iconText.setAlpha(this.iconOpacityValue);
            return this;
        }
        // API: opacity
        setBackgroundOpacity(opacity) {
            this.backgroundOpacityValue = Math.max(0, Math.min(1, opacity));
            this.backgroundSprite.setAlpha(this.backgroundOpacityValue);
            return this;
        }
        setIconOpacity(opacity) {
            this.iconOpacityValue = Math.max(0, Math.min(1, opacity));
            this.iconText.setAlpha(this.iconOpacityValue);
            return this;
        }
        // API: radius
        setBorderRadius(borderRadius) {
            const newRadiusPx = typeof borderRadius === 'number'
                ? borderRadius
                : this.pw.radius.px(borderRadius);
            if (this.borderRadiusPx === newRadiusPx)
                return this;
            this.borderRadiusPx = newRadiusPx;
            this.regenerateBackgroundTexture();
            return this;
        }
        // API: icon
        setIcon(icon, opts) {
            this.iconText.setIcon(icon, opts);
            return this;
        }
        setButtonSize(size) {
            this.baseSizePx =
                typeof size === 'number'
                    ? size
                    : this.pw.fontSize.px(size ?? 'md');
            this.iconText.setFontSize(`${this.baseSizePx}px`);
            this.updateSize();
            this.regenerateBackgroundTexture();
            return this;
        }
        updateSize() {
            this.width = this.baseSizePx * BUTTON_SCALE$1;
            this.height = this.baseSizePx * BUTTON_SCALE$1;
        }
        createBackgroundSprite(scene) {
            const textureKey = this.createBackgroundTexture(scene);
            this.backgroundSprite = scene.add.sprite(0, 0, textureKey);
            this.backgroundSprite.setOrigin(0.5, 0.5);
            this.backgroundSprite.setAlpha(this.backgroundOpacityValue);
        }
        regenerateBackgroundTexture() {
            const textureKey = this.createBackgroundTexture(this.scene);
            this.backgroundSprite.setTexture(textureKey);
            this.backgroundSprite.setAlpha(this.backgroundOpacityValue);
        }
        createBackgroundTexture(scene) {
            const size = this.baseSizePx;
            const textureKey = `flatIconButton_${this.backgroundColorValue}_${this.borderRadiusPx}_${size}`;
            const textureSize = size * BUTTON_SCALE$1; // match icon-button scale for consistency
            const centerX = size * CENTER_OFFSET$1;
            const centerY = size * CENTER_OFFSET$1;
            const graphics = scene.add.graphics();
            graphics.fillStyle(Color.hex(this.backgroundColorValue), 1);
            const side = size * 2;
            const radius = Math.min(this.borderRadiusPx, side / 2);
            graphics.fillRoundedRect(centerX - side / 2, centerY - side / 2, side, side, radius);
            graphics.generateTexture(textureKey, textureSize, textureSize);
            graphics.destroy();
            return textureKey;
        }
        createIconText(scene, icon, iconStyle) {
            this.iconText = new IconText({
                scene,
                x: 0,
                y: 0,
                icon,
                size: this.baseSizePx,
                style: {
                    color: this.iconColorValue,
                    strokeThickness: 0,
                },
                iconStyle,
            });
            this.iconText.setAlpha(this.iconOpacityValue);
            this.iconText.setOrigin(0.5, 0.5);
        }
        setupContainer() {
            this.add([this.backgroundSprite, this.iconText]);
        }
        setupInteractivity(onClick) {
            this.backgroundSprite.setInteractive({ useHandCursor: true });
            this.backgroundSprite.on('pointerdown', () => {
                this.scene.tweens.add({
                    targets: [this.backgroundSprite, this.iconText],
                    y: CLICK_OFFSET$2,
                    duration: durations$2.click,
                    ease: 'Linear',
                });
            });
            this.backgroundSprite.on('pointerup', () => {
                this.scene.tweens.add({
                    targets: [this.backgroundSprite, this.iconText],
                    y: 0,
                    duration: durations$2.click,
                    ease: 'Linear',
                });
                onClick?.();
            });
        }
        /**
         * Gets the interactive sprite of the icon button
         * @returns The interactive sprite
         */
        get interactive() {
            const { on, off, setInteractive, once } = this.backgroundSprite;
            return {
                on: on.bind(this.backgroundSprite),
                off: off.bind(this.backgroundSprite),
                setInteractive: setInteractive.bind(this.backgroundSprite),
                once: once.bind(this.backgroundSprite),
            };
        }
        /**
         * Gets the bounds of the flat icon button for layout calculations
         * @param output Optional rectangle to store the result
         * @returns Rectangle with the button bounds
         */
        getBounds(output) {
            const width = this.baseSizePx * BUTTON_SCALE$1;
            const height = this.baseSizePx * BUTTON_SCALE$1;
            if (output) {
                return output.setTo(this.x - width / 2, this.y - height / 2, width, height);
            }
            return new Phaser.Geom.Rectangle(this.x - width / 2, this.y - height / 2, width, height);
        }
    }

    /* eslint-disable max-lines */
    const durations$1 = {
        click: 100,
        hover: 150,
    };
    const BUTTON_SCALE = 2.2;
    const CENTER_OFFSET = 1.1;
    const SHADOW_OFFSET$1 = 4;
    const SHADOW_OPACITY$2 = 0.1;
    const MAIN_SHADOW_OPACITY = 0.9;
    const INNER_OVERLAY_OPACITY = 0.7;
    const HOVER_SCALE$1 = 1.07;
    const CLICK_OFFSET$1 = 2;
    const MAIN_OVERLAY_SCALE = 0.9;
    const INNER_OVERLAY_SCALE = 0.7;
    class IconButton extends Phaser$1.GameObjects.Container {
        backgroundSprite;
        shadowSprite;
        iconText;
        pw;
        baseColor;
        sizePx;
        borderRadiusPx;
        constructor({ scene, x, y, icon, size, color, onClick, borderRadius, }) {
            super(scene, x, y);
            this.pw = getPWFromScene(scene);
            const sizePx = typeof size === 'number'
                ? size
                : this.pw.fontSize.px(size ?? 'md');
            const baseColor = color ?? 'gray';
            this.sizePx = sizePx;
            this.updateSize();
            this.baseColor = baseColor;
            this.borderRadiusPx =
                typeof borderRadius === 'number'
                    ? borderRadius
                    : this.pw.radius.px((borderRadius ?? 'full'));
            this.createShadowSprite(scene, sizePx, baseColor, this.borderRadiusPx);
            this.createBackgroundSprite(scene, sizePx, baseColor, this.borderRadiusPx);
            this.createIconText(scene, icon, sizePx, baseColor);
            this.setupContainer();
            this.setupInteractivity(onClick);
        }
        setBorderRadius(borderRadius) {
            const newRadiusPx = typeof borderRadius === 'number'
                ? borderRadius
                : this.pw.radius.px(borderRadius);
            if (this.borderRadiusPx === newRadiusPx)
                return this;
            this.borderRadiusPx = newRadiusPx;
            // Regenerate textures for background and shadow
            const shadowTexture = this.createShadowTexture(this.scene, this.sizePx, this.baseColor, this.borderRadiusPx);
            const backgroundTexture = this.createBackgroundTexture(this.scene, this.sizePx, this.baseColor, this.borderRadiusPx);
            this.shadowSprite.setTexture(shadowTexture);
            this.backgroundSprite.setTexture(backgroundTexture);
            return this;
        }
        setButtonSize(size) {
            this.sizePx =
                typeof size === 'number'
                    ? size
                    : this.pw.fontSize.px(size ?? 'md');
            this.iconText.setFontSize(`${this.sizePx}px`);
            this.updateSize();
            const shadowTexture = this.createShadowTexture(this.scene, this.sizePx, this.baseColor, this.borderRadiusPx);
            const backgroundTexture = this.createBackgroundTexture(this.scene, this.sizePx, this.baseColor, this.borderRadiusPx);
            this.shadowSprite.setTexture(shadowTexture);
            this.backgroundSprite.setTexture(backgroundTexture);
            return this;
        }
        createShadowSprite(scene, size, baseColor, borderRadiusPx) {
            const shadowTexture = this.createShadowTexture(scene, size, baseColor, borderRadiusPx);
            this.shadowSprite = scene.add.sprite(1, SHADOW_OFFSET$1, shadowTexture);
            this.shadowSprite.setOrigin(0.5, 0.5);
        }
        createShadowTexture(scene, size, baseColor, borderRadiusPx) {
            const textureKey = `iconButton_shadow_r${borderRadiusPx}_${baseColor}_${size}`;
            const textureSize = size * BUTTON_SCALE;
            const centerX = size * CENTER_OFFSET;
            const centerY = size * CENTER_OFFSET;
            const graphics = scene.add.graphics();
            const sideOuter = size * 2 * CENTER_OFFSET;
            const side = size * 2;
            const radiusOuter = Math.min(borderRadiusPx, sideOuter / 2);
            const radius = Math.min(borderRadiusPx, side / 2);
            graphics.fillStyle(Color.hex('black'), SHADOW_OPACITY$2);
            graphics.fillRoundedRect(centerX + 1 - sideOuter / 2, centerY - sideOuter / 2, sideOuter, sideOuter, radiusOuter);
            graphics.fillStyle(Color.hex(`${baseColor}-900`), MAIN_SHADOW_OPACITY);
            graphics.fillRoundedRect(centerX - side / 2, centerY - CLICK_OFFSET$1 - side / 2, side, side, radius);
            graphics.generateTexture(textureKey, textureSize, textureSize);
            graphics.destroy();
            return textureKey;
        }
        updateSize() {
            this.setSize(this.sizePx * BUTTON_SCALE, this.sizePx * BUTTON_SCALE);
        }
        createBackgroundSprite(scene, size, baseColor, borderRadiusPx) {
            const backgroundTexture = this.createBackgroundTexture(scene, size, baseColor, borderRadiusPx);
            this.backgroundSprite = scene.add.sprite(1, 0, backgroundTexture);
            this.backgroundSprite.setOrigin(0.5, 0.5);
        }
        createBackgroundTexture(scene, size, baseColor, borderRadiusPx) {
            const textureKey = `iconButton_r${borderRadiusPx}_${baseColor}_${size}`;
            const textureSize = size * BUTTON_SCALE;
            const centerX = size * CENTER_OFFSET;
            const centerY = size * CENTER_OFFSET;
            const graphics = scene.add.graphics();
            const side = size * 2;
            const mainSide = side * MAIN_OVERLAY_SCALE;
            const innerSide = side * INNER_OVERLAY_SCALE;
            const mainRadius = Math.min(borderRadiusPx, mainSide / 2);
            const innerRadius = Math.min(borderRadiusPx, innerSide / 2);
            graphics.fillStyle(Color.hex(`${baseColor}-600`), 1);
            graphics.fillRoundedRect(centerX - mainSide / 2, centerY - mainSide / 2, mainSide, mainSide, mainRadius);
            graphics.fillStyle(Color.hex(`${baseColor}-500`), INNER_OVERLAY_OPACITY);
            graphics.fillRoundedRect(centerX - innerSide / 2, centerY - innerSide / 2, innerSide, innerSide, innerRadius);
            graphics.generateTexture(textureKey, textureSize, textureSize);
            graphics.destroy();
            return textureKey;
        }
        createIconText(scene, icon, size, baseColor) {
            this.iconText = new IconText({
                scene,
                x: 1,
                y: 1,
                icon,
                size,
                style: {
                    color: Color.rgb('white'),
                    strokeThickness: 3,
                    stroke: Color.rgb(`${baseColor}-900`),
                },
            });
            this.iconText.setFontStyle('900');
            this.iconText.setOrigin(0.5, 0.5);
        }
        setupContainer() {
            this.add([this.shadowSprite, this.backgroundSprite, this.iconText]);
        }
        setupInteractivity(onClick) {
            this.backgroundSprite.setInteractive({ useHandCursor: true });
            this.backgroundSprite.on('pointerover', () => {
                this.scene.tweens.add({
                    targets: this.iconText,
                    scale: HOVER_SCALE$1,
                    duration: durations$1.hover,
                    ease: 'Linear',
                });
            });
            this.backgroundSprite.on('pointerout', () => {
                this.scene.tweens.add({
                    targets: this.iconText,
                    scale: 1,
                    duration: durations$1.hover,
                    ease: 'Linear',
                });
            });
            this.backgroundSprite.on('pointerdown', () => {
                this.scene.tweens.add({
                    targets: [this.backgroundSprite, this.iconText],
                    y: CLICK_OFFSET$1,
                    duration: durations$1.click,
                    ease: 'Linear',
                });
            });
            this.backgroundSprite.on('pointerup', () => {
                this.scene.tweens.add({
                    targets: [this.backgroundSprite, this.iconText],
                    y: 0,
                    duration: durations$1.click,
                    ease: 'Linear',
                });
                onClick?.();
            });
        }
        /**
         * Gets the interactive sprite of the icon button
         * @returns The interactive sprite
         */
        get interactive() {
            const { on, off, setInteractive, once } = this.backgroundSprite;
            return {
                on: on.bind(this.backgroundSprite),
                off: off.bind(this.backgroundSprite),
                setInteractive: setInteractive.bind(this.backgroundSprite),
                once: once.bind(this.backgroundSprite),
            };
        }
        /**
         * Gets the bounds of the icon button for layout calculations
         * @param output Optional rectangle to store the result
         * @returns Rectangle with the button bounds
         */
        getBounds(output) {
            const width = this.shadowSprite.displayWidth ?? this.shadowSprite.width;
            const height = this.shadowSprite.displayHeight ?? this.shadowSprite.height;
            if (output) {
                return output.setTo(this.x - width / 2, this.y - height / 2, width, height);
            }
            return new Phaser.Geom.Rectangle(this.x - width / 2, this.y - height / 2, width, height);
        }
    }

    const A_HUNDRED$1 = 100;
    const INDETERMINATE_ANIMATION_DURATION = 1500; // 1.5 seconds
    class LinearProgress extends Phaser$1.GameObjects.Container {
        backgroundProgressBar;
        progressBar;
        pw;
        progressWidth;
        progressHeight;
        borderRadiusPx;
        backgroundColor;
        progressColor;
        currentProgress;
        isIndeterminate;
        indeterminateAnimation;
        indeterminateAnimationDuration;
        constructor({ scene, x, y, width, height, backgroundColor = 'gray-200', progressColor = 'blue-500', borderRadius = 'default', progress = 0, indeterminate = false, indeterminateAnimationDuration = INDETERMINATE_ANIMATION_DURATION, }) {
            super(scene, x, y);
            this.pw = getPWFromScene(scene);
            this.progressWidth = width;
            this.progressHeight = height;
            this.backgroundColor = backgroundColor;
            this.progressColor = progressColor;
            this.currentProgress = Math.max(0, Math.min(A_HUNDRED$1, progress));
            this.isIndeterminate = indeterminate;
            this.indeterminateAnimationDuration = indeterminateAnimationDuration;
            this.borderRadiusPx =
                typeof borderRadius === 'number'
                    ? borderRadius
                    : this.pw.radius.px(borderRadius);
            this.createBackgroundSprite();
            this.createProgressSprite();
            this.setupContainer();
            if (this.isIndeterminate) {
                this.startIndeterminateAnimation();
            }
            else {
                this.updateProgressBar();
            }
        }
        /**
         * Sets the progress value (0-100)
         * @param progress Progress value between 0 and 100
         * @param animate Whether to animate the change (default: true)
         */
        setProgress(progress, animate = true) {
            if (this.isIndeterminate) {
                return this;
            }
            const newProgress = Math.max(0, Math.min(A_HUNDRED$1, progress));
            if (this.currentProgress === newProgress) {
                return this;
            }
            if (animate) {
                const target = { value: this.currentProgress };
                this.scene.tweens.add({
                    targets: target,
                    value: newProgress,
                    duration: 300,
                    ease: 'Power2',
                    onUpdate: () => {
                        this.currentProgress = target.value;
                        this.updateProgressBar();
                    },
                });
            }
            else {
                this.currentProgress = newProgress;
                this.updateProgressBar();
            }
            return this;
        }
        /**
         * Gets the current progress value
         * @returns Current progress value (0-100)
         */
        getProgress() {
            return this.currentProgress;
        }
        /**
         * Sets whether the progress bar is indeterminate
         * @param indeterminate Whether to show indeterminate animation
         */
        setIndeterminate(indeterminate) {
            if (this.isIndeterminate === indeterminate) {
                return this;
            }
            this.isIndeterminate = indeterminate;
            if (this.isIndeterminate) {
                this.stopIndeterminateAnimation();
                this.startIndeterminateAnimation();
            }
            else {
                this.stopIndeterminateAnimation();
                this.updateProgressBar();
            }
            return this;
        }
        /**
         * Sets the border radius of the progress bar
         * @param borderRadius Border radius in px (number) or a Phaser Wind radius token (string)
         * Note: The effective radius is automatically limited to half of the smallest dimension to prevent visual artifacts.
         */
        setBorderRadius(borderRadius) {
            const newRadiusPx = typeof borderRadius === 'number'
                ? borderRadius
                : this.pw.radius.px(borderRadius);
            if (this.borderRadiusPx === newRadiusPx) {
                return this;
            }
            this.borderRadiusPx = newRadiusPx;
            this.recreateSprites();
            return this;
        }
        /**
         * Sets the background color of the progress bar
         * @param color Background color token
         */
        setBackgroundColor(color) {
            if (this.backgroundColor === color) {
                return this;
            }
            this.backgroundColor = color;
            this.recreateSprites();
            return this;
        }
        /**
         * Sets the progress color of the progress bar
         * @param color Progress color token
         */
        setProgressColor(color) {
            if (this.progressColor === color) {
                return this;
            }
            this.progressColor = color;
            this.recreateSprites();
            return this;
        }
        /**
         * Destroys the component and cleans up animations
         */
        destroy() {
            this.stopIndeterminateAnimation();
            super.destroy();
        }
        createBackgroundSprite() {
            const bgGraphic = this.scene.add.graphics();
            bgGraphic.fillStyle(Color.hex(this.backgroundColor), 1);
            bgGraphic.fillRoundedRect(-this.progressWidth / 2, -this.progressHeight / 2, this.progressWidth, this.progressHeight, this.getEffectiveBorderRadius());
            this.backgroundProgressBar = bgGraphic;
        }
        createProgressSprite() {
            const progressBar = this.scene.add.graphics();
            progressBar.fillStyle(Color.hex(this.progressColor), 1);
            progressBar.fillRoundedRect(-this.progressWidth / 2, -this.progressHeight / 2, this.progressWidth, this.progressHeight, this.getEffectiveBorderRadius());
            this.progressBar = progressBar;
        }
        setupContainer() {
            this.add([this.backgroundProgressBar, this.progressBar]);
        }
        calculateProgressDimensions() {
            const progressWidth = (this.progressWidth * this.currentProgress) / A_HUNDRED$1;
            const leftOffset = (progressWidth - this.progressWidth) / 2;
            return { progressWidth, leftOffset };
        }
        updateProgressBar(force = false) {
            if (this.isIndeterminate && !force) {
                return;
            }
            const { progressWidth, leftOffset } = this.calculateProgressDimensions();
            this.progressBar.setScale(progressWidth / this.progressWidth, 1);
            this.progressBar.setX(leftOffset);
        }
        startIndeterminateAnimation() {
            if (!this.isIndeterminate) {
                return;
            }
            this.currentProgress = 40;
            this.updateProgressBar(true);
            const { progressWidth } = this.calculateProgressDimensions();
            // Calculate the movement range: the bar should move within the background bounds
            // The bar center can move from left edge + half bar width to right edge - half bar width
            const maxX = (this.progressWidth / 2) - (progressWidth / 2);
            const minX = -(this.progressWidth / 2) + (progressWidth / 2);
            // Start from the left
            this.progressBar.setX(minX);
            this.indeterminateAnimation = this.scene.tweens.add({
                targets: this.progressBar,
                x: maxX,
                duration: this.indeterminateAnimationDuration,
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1,
            });
        }
        stopIndeterminateAnimation() {
            if (this.indeterminateAnimation) {
                this.indeterminateAnimation.destroy();
                this.indeterminateAnimation = undefined;
            }
        }
        recreateSprites() {
            // Remove old sprites
            this.remove([this.backgroundProgressBar, this.progressBar]);
            this.backgroundProgressBar.destroy();
            this.progressBar.destroy();
            // Create new sprites with updated properties
            this.createBackgroundSprite();
            this.createProgressSprite();
            this.setupContainer();
            // Restore state
            if (this.isIndeterminate) {
                this.startIndeterminateAnimation();
            }
            else {
                this.updateProgressBar();
            }
        }
        /**
         * Calculates the effective border radius, ensuring it doesn't exceed
         * half of the smallest dimension to prevent visual artifacts
         * @returns Limited border radius in pixels
         */
        getEffectiveBorderRadius() {
            const maxRadius = Math.min(this.progressWidth, this.progressHeight) / 2;
            return Math.min(this.borderRadiusPx, maxRadius);
        }
    }

    /* eslint-disable max-lines */
    const A_HUNDRED = 100;
    const THREE_SIXTY = 360;
    const START_ANGLE = 270;
    const DEFAULT_THICKNESS = 4;
    const DEFAULT_BACKGROUND_ALPHA = 0.2;
    const DEFAULT_TEXT_COLOR = 'white';
    const DEFAULT_FONT_SIZE = 'base';
    const DEFAULT_TEXT_ALPHA = 1;
    class RadialProgress extends Phaser$1.GameObjects.Container {
        backgroundProgressBar;
        progressBar;
        radialArc;
        percentageText;
        pw;
        radius;
        thickness;
        backgroundColor;
        backgroundAlpha;
        progressColor;
        currentProgress;
        startAngle;
        showText;
        textColor;
        fontSize;
        textAlpha;
        constructor({ scene, x, y, radius, thickness = DEFAULT_THICKNESS, backgroundColor = 'gray-200', backgroundAlpha = DEFAULT_BACKGROUND_ALPHA, progressColor = 'blue-500', progress = 0, startAngle = START_ANGLE, showText = false, textColor = DEFAULT_TEXT_COLOR, fontSize = DEFAULT_FONT_SIZE, textAlpha = DEFAULT_TEXT_ALPHA, }) {
            super(scene, x, y);
            this.pw = getPWFromScene(scene);
            this.radius = radius;
            this.thickness = thickness;
            this.backgroundColor = backgroundColor;
            this.backgroundAlpha = backgroundAlpha;
            this.progressColor = progressColor;
            this.currentProgress = Math.max(0, Math.min(A_HUNDRED, progress));
            this.startAngle = startAngle;
            this.showText = showText;
            this.textColor = textColor;
            this.fontSize = fontSize;
            this.textAlpha = textAlpha;
            this.createBackgroundSprite();
            this.createRadialArc();
            if (this.showText) {
                this.createPercentageText();
            }
            this.setupContainer();
            this.updateProgressBar();
        }
        /**
         * Sets the progress value (0-100)
         * @param progress Progress value between 0 and 100
         * @param animate Whether to animate the change (default: true)
         */
        setProgress(progress, animate = true) {
            const newProgress = Math.max(0, Math.min(A_HUNDRED, progress));
            if (this.currentProgress === newProgress) {
                return this;
            }
            if (animate) {
                const target = { value: this.currentProgress };
                this.scene.tweens.add({
                    targets: target,
                    value: newProgress,
                    duration: 300,
                    ease: 'Power2',
                    onUpdate: () => {
                        this.currentProgress = target.value;
                        this.updateProgressBar();
                        this.updatePercentageText();
                    },
                });
            }
            else {
                this.currentProgress = newProgress;
                this.updateProgressBar();
                this.updatePercentageText();
            }
            return this;
        }
        /**
         * Gets the current progress value
         * @returns Current progress value (0-100)
         */
        getProgress() {
            return this.currentProgress;
        }
        /**
     * Sets the background color of the progress bar
     * @param color Background color token
     */
        setBackgroundColor(color) {
            if (this.backgroundColor === color) {
                return this;
            }
            this.backgroundColor = color;
            this.recreateSprites();
            return this;
        }
        /**
         * Sets the background alpha of the progress bar
         * @param alpha Background alpha value (0-1)
         */
        setBackgroundAlpha(alpha) {
            if (this.backgroundAlpha === alpha) {
                return this;
            }
            this.backgroundAlpha = alpha;
            this.recreateSprites();
            return this;
        }
        /**
         * Sets the progress color of the progress bar
         * @param color Progress color token
         */
        setProgressColor(color) {
            if (this.progressColor === color) {
                return this;
            }
            this.progressColor = color;
            this.recreateSprites();
            return this;
        }
        /**
         * Sets whether to show the percentage text
         * @param show Whether to show the text
         */
        setShowText(show) {
            if (this.showText === show) {
                return this;
            }
            this.showText = show;
            if (show && !this.percentageText) {
                this.createPercentageText();
                if (this.percentageText) {
                    this.add(this.percentageText);
                }
            }
            else if (!show && this.percentageText) {
                this.remove(this.percentageText);
                this.percentageText.destroy();
                this.percentageText = undefined;
            }
            return this;
        }
        /**
         * Sets the text color
         * @param color Text color token
         */
        setTextColor(color) {
            if (this.textColor === color) {
                return this;
            }
            this.textColor = color;
            if (this.percentageText) {
                this.percentageText.destroy();
                this.createPercentageText();
                this.add(this.percentageText);
            }
            return this;
        }
        /**
         * Sets the font size
         * @param size Font size in pixels
         */
        setFontSize(size) {
            if (this.fontSize === size) {
                return this;
            }
            this.fontSize = size;
            if (this.percentageText) {
                this.percentageText.destroy();
                this.createPercentageText();
                this.add(this.percentageText);
            }
            return this;
        }
        /**
         * Sets the text alpha
         * @param alpha Alpha value (0-1)
         */
        setTextAlpha(alpha) {
            if (this.textAlpha === alpha) {
                return this;
            }
            this.textAlpha = alpha;
            if (this.percentageText) {
                this.percentageText.setAlpha(this.textAlpha);
            }
            return this;
        }
        /**
         * Sets the radius of the progress bar
         * @param radius New radius in pixels
         */
        setRadius(radius) {
            if (this.radius === radius) {
                return this;
            }
            this.radius = radius;
            this.recreateSprites();
            return this;
        }
        /**
         * Destroys the component and cleans up animations
         */
        destroy() {
            super.destroy();
        }
        createBackgroundSprite() {
            const bgGraphic = this.scene.add.graphics();
            // Draw a circle with alpha background
            bgGraphic.fillStyle(this.pw.color.hex(this.backgroundColor), this.backgroundAlpha);
            bgGraphic.beginPath();
            bgGraphic.arc(0, 0, this.radius, 0, Phaser.Math.PI2, false);
            bgGraphic.closePath();
            bgGraphic.fillPath();
            this.backgroundProgressBar = bgGraphic;
        }
        createRadialArc() {
            const graphics = this.scene.add.graphics();
            graphics.lineStyle(this.thickness, this.pw.color.hex(this.progressColor), 1);
            graphics.beginPath();
            graphics.arc(0, 0, this.radius, this.startAngle, Phaser.Math.DegToRad(THREE_SIXTY), true);
            graphics.strokePath();
            this.radialArc = graphics;
        }
        createPercentageText() {
            this.percentageText = this.scene.add.text(0, 0, `${Math.round(this.currentProgress)}%`, {
                fontSize: this.pw.fontSize.css(this.fontSize),
                color: this.pw.color.rgb(this.textColor),
                fontStyle: 'bold',
            });
            this.percentageText.setOrigin(0.5);
            this.percentageText.setAlpha(this.textAlpha);
        }
        setThickness(thickness) {
            this.thickness = thickness;
            this.recreateSprites();
        }
        setupContainer() {
            const children = [this.backgroundProgressBar, this.radialArc];
            if (this.percentageText) {
                children.push(this.percentageText);
            }
            this.add(children);
        }
        updateProgressBar() {
            if (!this.radialArc)
                return;
            this.radialArc.clear();
            const startAngleRad = Phaser.Math.DegToRad(this.startAngle);
            const sweepRad = Phaser.Math.DegToRad((this.currentProgress / A_HUNDRED) * THREE_SIXTY);
            const endAngleRad = startAngleRad + sweepRad;
            const isFullCircle = this.currentProgress >= A_HUNDRED;
            this.radialArc.lineStyle(this.thickness, this.pw.color.hex(this.progressColor), 1);
            this.radialArc.beginPath();
            if (isFullCircle) {
                this.radialArc.arc(0, 0, this.radius, 0, Phaser.Math.PI2, false);
            }
            else {
                this.radialArc.arc(0, 0, this.radius, startAngleRad, endAngleRad, false);
            }
            this.radialArc.strokePath();
        }
        updatePercentageText() {
            if (this.percentageText) {
                this.percentageText.setText(`${Math.round(this.currentProgress)}%`);
            }
        }
        recreateSprites() {
            const children = [this.backgroundProgressBar, this.radialArc];
            if (this.percentageText) {
                children.push(this.percentageText);
            }
            this.remove(children);
            this.backgroundProgressBar.destroy();
            this.radialArc.destroy();
            if (this.percentageText) {
                this.percentageText.destroy();
                this.percentageText = undefined;
            }
            this.createBackgroundSprite();
            this.createRadialArc();
            if (this.showText) {
                this.createPercentageText();
            }
            this.setupContainer();
            this.updateProgressBar();
        }
    }

    /* eslint-disable max-lines-per-function */
    /* eslint-disable complexity */
    /**
     * Row is a layout container that arranges children horizontally with a gap.
     * The container position (x, y) represents the center of the whole row.
     */
    class Row extends Phaser$1.GameObjects.Container {
        /** Gap between elements in pixels */
        gap;
        /** Vertical alignment of elements */
        align;
        /** Horizontal origin point of the row */
        horizontalOrigin;
        /**
         * Creates a new Row container
         * @param params Configuration parameters for the row
         */
        constructor({ scene, x, y, gap = DEFAULT_GAP, align = 'center', children = [], horizontalOrigin = 'center', }) {
            super(scene, x, y);
            this.gap = gap;
            this.align = align;
            this.horizontalOrigin = horizontalOrigin;
            if (children.length > 0) {
                this.add(children);
            }
            this.layout();
        }
        /**
         * Sets the gap between elements and updates layout
         * @param gap Gap size in pixels
         */
        setGap(gap) {
            this.gap = gap;
            this.layout();
        }
        /**
         * Sets the vertical alignment and updates layout
         * @param align New vertical alignment
         */
        setAlign(align) {
            this.align = align;
            this.layout();
        }
        /**
         * Adds a single child to the row
         * @param child GameObject to add
         * @param relayout Whether to update layout after adding
         * @returns This row instance for chaining
         */
        addChild(child, relayout = true) {
            this.add(child);
            if (relayout) {
                this.layout();
            }
            return this;
        }
        /**
         * Adds multiple children to the row
         * @param children Array of GameObjects to add
         * @param relayout Whether to update layout after adding
         * @returns This row instance for chaining
         */
        addChildren(children, relayout = true) {
            if (children.length > 0)
                this.add(children);
            if (relayout)
                this.layout();
            return this;
        }
        /**
         * Recomputes children's positions and updates this container size
         */
        layout() {
            const children = this.list;
            if (children.length === 0) {
                this.setSize(0, 0);
                return;
            }
            // Measure sizes and origins
            const entries = children.map(child => ({
                child,
                width: this.getDisplayWidth(child),
                height: this.getDisplayHeight(child),
                origin: this.getNormalizedOrigin(child),
            }));
            const maxHeight = entries.reduce((m, s) => Math.max(m, s.height), 0);
            const totalWidth = entries.reduce((sum, s) => sum + s.width, 0) +
                this.gap * (entries.length - 1);
            // Determine left of content based on horizontalOrigin
            const contentLeftX = this.horizontalOrigin === 'left'
                ? 0
                : this.horizontalOrigin === 'center'
                    ? -totalWidth / 2
                    : -totalWidth;
            // Walk left to right, aligning considering each child's origin
            let cursorLeftX = contentLeftX;
            for (const { child, width, height, origin } of entries) {
                // Vertical alignment: align top/bottom edges or centers correctly using origin
                let y = 0;
                if (this.align === 'top') {
                    // place child's top edge at content top
                    y = -maxHeight / 2 + origin.y * height;
                }
                else if (this.align === 'bottom') {
                    // place child's bottom edge at content bottom
                    y = maxHeight / 2 - (1 - origin.y) * height;
                }
                else {
                    // center alignment
                    y = (origin.y - 0.5) * height;
                }
                // Horizontal position so that child's left is at cursorLeftX
                const x = cursorLeftX + origin.x * width;
                child.setPosition(x, y);
                cursorLeftX += width + this.gap;
            }
            this.setSize(totalWidth, maxHeight);
        }
        /**
         * Gets the display width of a game object
         * @param child GameObject to measure
         * @returns Display width in pixels
         */
        getDisplayWidth(child) {
            return getDisplayWidthOf(child);
        }
        /**
         * Gets the display height of a game object
         * @param child GameObject to measure
         * @returns Display height in pixels
         */
        getDisplayHeight(child) {
            return getDisplayHeightOf(child);
        }
        /**
         * Gets the normalized origin point of a game object
         * @param child GameObject to get origin from
         * @returns Object with normalized x,y coordinates of the origin point
         */
        getNormalizedOrigin(child) {
            return getNormalizedOriginOf(child);
        }
    }

    /* eslint-disable no-magic-numbers */
    /** Vertical offset for the shadow */
    const SHADOW_OFFSET_Y = 4;
    /** Opacity value for the shadow */
    const SHADOW_OPACITY$1 = 0.25;
    /** Thickness of the text stroke */
    const STROKE_THICKNESS = 2;
    /** Shadow size as a percentage of the header size */
    const SHADOW_SCALE = 0.95;
    /**
     * A stylized section header component with shadow, text stroke and auto-sizing
     */
    class SectionHeader extends Phaser$1.GameObjects.Container {
        /** The background graphics of the header */
        backgroundGraphics;
        /** The shadow graphics below the header */
        shadowGraphics;
        /** The text object of the header */
        headerText;
        /** Reference to the PhaserWind plugin */
        pw;
        /** Font size in pixels */
        fontSizePx;
        /** Margin size in pixels */
        marginPx;
        /** Border radius in pixels */
        borderRadiusPx;
        /** Background color value */
        backgroundColorValue;
        /** Text color value */
        textColorValue;
        /** Stroke color value */
        strokeColorValue;
        /** Font family value */
        fontValue;
        /** Text content value */
        textValue;
        /**
         * Creates a new SectionHeader
         * @param params Configuration parameters for the header
         */
        constructor({ scene, x, y, text, fontSize, font, backgroundColor = 'blue-600', textColor = 'white', strokeColor, borderRadius = 'md', margin = '4', }) {
            super(scene, x, y);
            this.pw = getPWFromScene(scene);
            // Store values
            this.textValue = text;
            this.fontSizePx =
                typeof fontSize === 'number'
                    ? fontSize
                    : this.pw.fontSize.px(fontSize ?? 'lg');
            this.marginPx =
                typeof margin === 'number'
                    ? margin
                    : this.pw.spacing.px(margin ?? '4');
            this.borderRadiusPx =
                typeof borderRadius === 'number'
                    ? borderRadius
                    : this.pw.radius.px(borderRadius ?? 'md');
            this.backgroundColorValue = Color.rgb(backgroundColor);
            this.textColorValue = Color.rgb(textColor);
            // If no stroke color provided, use a darker version of the background
            this.strokeColorValue = strokeColor
                ? Color.rgb(strokeColor)
                : this.getDarkerColor(backgroundColor);
            this.fontValue = typeof font === 'string' ? font : this.pw.font.family(font ?? 'display');
            this.createHeaderText(scene);
            this.createShadowGraphics(scene);
            this.createBackgroundGraphics(scene);
            this.setupContainer();
            this.setupInteractivity();
        }
        /**
         * Sets the text content of the header
         * @param text New text content
         * @returns this for chaining
         */
        setText(text) {
            this.textValue = text;
            this.headerText.setText(text);
            this.regenerateGraphics();
            return this;
        }
        /**
         * Sets the font size of the header text
         * @param fontSize New font size (number in px or FontSizeKey)
         * @returns this for chaining
         */
        setFontSize(fontSize) {
            this.fontSizePx =
                typeof fontSize === 'number'
                    ? fontSize
                    : this.pw.fontSize.px(fontSize ?? 'lg');
            this.headerText.setFontSize(this.fontSizePx);
            this.regenerateGraphics();
            return this;
        }
        /**
         * Sets the font family of the header text
         * @param font New font family (FontKey or string)
         * @returns this for chaining
         */
        setFont(font) {
            this.fontValue = typeof font === 'string' ? font : this.pw.font.family(font ?? 'display');
            this.headerText.setFontFamily(this.fontValue);
            this.regenerateGraphics();
            return this;
        }
        /**
         * Sets the background color of the header
         * @param color New background color (ColorKey or string)
         * @returns this for chaining
         */
        setBackgroundColor(color) {
            this.backgroundColorValue = Color.rgb(color);
            // Update stroke color to match new background if it was auto-generated
            if (!this.strokeColorValue.startsWith('#')) {
                this.strokeColorValue = this.getDarkerColor(color);
                this.headerText.setStroke(this.strokeColorValue, STROKE_THICKNESS);
            }
            this.regenerateGraphics();
            return this;
        }
        /**
         * Sets the text color of the header
         * @param color New text color (ColorKey or string)
         * @returns this for chaining
         */
        setTextColor(color) {
            this.textColorValue = Color.rgb(color);
            this.headerText.setColor(this.textColorValue);
            return this;
        }
        /**
         * Sets the stroke color of the header text
         * @param color New stroke color (ColorKey or string)
         * @returns this for chaining
         */
        setStrokeColor(color) {
            this.strokeColorValue = Color.rgb(color);
            this.headerText.setStroke(this.strokeColorValue, STROKE_THICKNESS);
            return this;
        }
        /**
         * Sets the border radius of the header
         * @param borderRadius New border radius (number in px or RadiusKey)
         * @returns this for chaining
         */
        setBorderRadius(borderRadius) {
            this.borderRadiusPx =
                typeof borderRadius === 'number'
                    ? borderRadius
                    : this.pw.radius.px(borderRadius ?? 'md');
            this.regenerateGraphics();
            return this;
        }
        /**
         * Sets the margin/padding of the header
         * @param margin New margin size (number in px or SpacingKey)
         * @returns this for chaining
         */
        setMargin(margin) {
            this.marginPx =
                typeof margin === 'number'
                    ? margin
                    : this.pw.spacing.px(margin ?? '4');
            this.regenerateGraphics();
            return this;
        }
        /**
         * Creates the header text game object
         * @param scene The scene to add the text to
         */
        createHeaderText(scene) {
            this.headerText = scene.add.text(0, 0, this.textValue, {
                fontSize: `${this.fontSizePx}px`,
                fontFamily: this.fontValue,
                color: this.textColorValue,
                stroke: this.strokeColorValue,
                strokeThickness: STROKE_THICKNESS,
                fontStyle: 'bold', // Make section headers bold by default
            });
            this.headerText.setOrigin(0.5, 0.5);
        }
        /**
         * Creates the shadow graphics below the header
         * @param scene The scene to add the graphics to
         */
        createShadowGraphics(scene) {
            this.shadowGraphics = scene.add.graphics();
            this.drawShadow();
        }
        /**
         * Creates the background graphics for the header
         * @param scene The scene to add the graphics to
         */
        createBackgroundGraphics(scene) {
            this.backgroundGraphics = scene.add.graphics();
            this.drawBackground();
        }
        /**
         * Regenerates all graphics after a property change
         */
        regenerateGraphics() {
            // Update text bounds after text/font changes
            this.headerText.setText(this.textValue);
            // Redraw graphics with new properties
            this.drawShadow();
            this.drawBackground();
        }
        /**
         * Draws the shadow graphics
         */
        drawShadow() {
            const sizes = this.getHeaderDimensions();
            const { height, width } = sizes;
            this.shadowGraphics.clear();
            // Limit radius to maximum possible for the header dimensions
            const maxRadius = Math.min(width / 2, height / 2);
            const effectiveRadius = Math.min(this.borderRadiusPx, maxRadius);
            // Shadow size is 80% of the header size
            const shadowWidth = width * SHADOW_SCALE;
            const shadowHeight = height * SHADOW_SCALE;
            // Calculate shadow position to center it
            // Since Graphics doesn't have setOrigin, we need to calculate the offset manually
            const shadowX = -shadowWidth / 2;
            const shadowY = SHADOW_OFFSET_Y - shadowHeight / 2 + 4;
            // Calculate shadow radius (proportional to shadow size)
            const shadowMaxRadius = Math.min(shadowWidth / 2, shadowHeight / 2);
            const shadowEffectiveRadius = Math.min(effectiveRadius * SHADOW_SCALE, shadowMaxRadius);
            // Shadow (only vertical offset, no horizontal)
            this.shadowGraphics.fillStyle(Color.hex('black'), SHADOW_OPACITY$1);
            this.shadowGraphics.fillRoundedRect(shadowX, shadowY, shadowWidth, shadowHeight, shadowEffectiveRadius);
        }
        /**
         * Draws the background graphics
         */
        drawBackground() {
            const { width, height } = this.getHeaderDimensions();
            this.backgroundGraphics.clear();
            // Limit radius to maximum possible for the header dimensions
            const maxRadius = Math.min(width / 2, height / 2);
            const effectiveRadius = Math.min(this.borderRadiusPx, maxRadius);
            // Since Graphics doesn't have setOrigin, we need to calculate the offset manually
            const bgX = -width / 2;
            const bgY = -height / 2;
            // Main background with subtle gradient effect
            this.backgroundGraphics.fillStyle(Color.hex(this.backgroundColorValue), 1);
            this.backgroundGraphics.fillRoundedRect(bgX, bgY, width, height, effectiveRadius);
            const depth = 0.15;
            let hightlightWidth = width;
            if (this.borderRadiusPx > 12) {
                hightlightWidth = width * 0.7;
            }
            const highlightX = bgX + (width - hightlightWidth) / 2;
            // Add a subtle highlight on top for depth
            const highlightHeight = Math.max(2, height * depth);
            // For the highlight, use a smaller radius if the highlight is too small
            const highlightRadius = Math.min(effectiveRadius, highlightHeight / 2);
            this.backgroundGraphics.fillStyle(Color.hex('white'), depth);
            this.backgroundGraphics.fillRoundedRect(highlightX, bgY, hightlightWidth, highlightHeight, highlightRadius);
        }
        /**
         * Gets the dimensions of the header based on text content
         * @returns Object containing width and height
         */
        getHeaderDimensions() {
            const textBounds = this.headerText.getBounds();
            const width = textBounds.width + this.marginPx * 2;
            const height = textBounds.height + this.marginPx * 2;
            return { width, height };
        }
        /**
         * Sets up the container with all graphics in the correct order
         */
        setupContainer() {
            this.add([this.shadowGraphics, this.backgroundGraphics, this.headerText]);
        }
        /**
         * Sets up interactivity for the header
         */
        setupInteractivity() {
            this.setInteractive();
            this.on('pointerdown', () => {
                this.setScale(0.95);
                this.on('pointerup', () => {
                    this.setScale(1);
                });
            });
        }
        /**
         * Gets a darker version of the given color
         * @param color Base color to darken
         * @returns Darker color string
         */
        getDarkerColor(color) {
            // Try to get a darker shade of the same color family
            const colorStr = color;
            // If it's already a shade (e.g., "blue-600"), try to make it darker
            if (colorStr.includes('-')) {
                const [family, shade] = colorStr.split('-');
                if (family && shade) {
                    const currentShade = parseInt(shade);
                    const shadeLimit = 900;
                    const shadeIncrement = 200;
                    if (!isNaN(currentShade) && currentShade < shadeLimit) {
                        const darkerShade = Math.min(shadeLimit, currentShade + shadeIncrement);
                        return Color.rgb(`${family}-${darkerShade}`);
                    }
                }
            }
            // If it's a base color (e.g., "blue"), add a dark shade
            const baseColors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'gray'];
            if (baseColors.includes(colorStr)) {
                return Color.rgb(`${colorStr}-800`);
            }
            // Fallback to a dark color
            return Color.rgb('gray-800');
        }
    }

    /**
     * SizedBox is a simple invisible rectangle component that can be used for spacing
     * and layout purposes. It has no visual appearance but occupies space.
     */
    class SizedBox extends Phaser$1.GameObjects.Rectangle {
        /**
         * Creates a new SizedBox instance.
         * @param params SizedBoxParams
         */
        constructor({ scene, x, y, width = 1, height = 1 }) {
            // Validate that at least one dimension is provided
            if (width === undefined && height === undefined) {
                throw new Error('SizedBox must have at least width or height specified');
            }
            const finalWidth = width ?? 1;
            const finalHeight = height ?? 1;
            // Create invisible rectangle (no fill, no stroke)
            super(scene, x, y, finalWidth, finalHeight, 0x000000, 0);
        }
        /**
         * Sets the width of the SizedBox.
         * @param width New width in pixels.
         * @returns This SizedBox instance.
         */
        setWidth(width) {
            this.width = width;
            return this;
        }
        /**
         * Sets the height of the SizedBox.
         * @param height New height in pixels.
         * @returns This SizedBox instance.
         */
        setHeight(height) {
            this.height = height;
            return this;
        }
        /**
         * Sets both width and height of the SizedBox.
         * @param width New width in pixels.
         * @param height New height in pixels.
         * @returns This SizedBox instance.
         */
        setSize(width, height) {
            this.width = width;
            this.height = height;
            return this;
        }
    }

    const durations = {
        click: 100,
        hover: 150,
    };
    const HOVER_SCALE = 1.05;
    const CLICK_OFFSET = 2;
    const SHADOW_OFFSET = 4;
    const SHADOW_OPACITY = 0.15;
    /**
     * A customizable text button component for Phaser, supporting auto-sizing,
     * design tokens, and interactive effects.
     */
    class TextButton extends Phaser$1.GameObjects.Container {
        /** The background sprite of the button. */
        backgroundSprite;
        /** The shadow sprite of the button. */
        shadowSprite;
        /** The text object of the button. */
        buttonText;
        pw;
        fontSizePx;
        marginPx;
        borderRadiusPx;
        backgroundColorValue;
        textColorValue;
        fontValue;
        textValue;
        /**
         * Creates a new TextButton instance.
         * @param params TextButtonParams
         */
        constructor({ scene, x, y, text, fontSize, font, backgroundColor = 'blue', textColor = 'white', borderRadius = 'md', margin = '4', onClick, }) {
            super(scene, x, y);
            this.pw = getPWFromScene(scene);
            // Store values
            this.textValue = text;
            this.fontSizePx =
                typeof fontSize === 'number'
                    ? fontSize
                    : this.pw.fontSize.px(fontSize ?? 'md');
            this.marginPx =
                typeof margin === 'number'
                    ? margin
                    : this.pw.spacing.px(margin ?? '4');
            this.borderRadiusPx =
                typeof borderRadius === 'number'
                    ? borderRadius
                    : this.pw.radius.px(borderRadius ?? 'md');
            this.backgroundColorValue = Color.rgb(backgroundColor);
            this.textColorValue = Color.rgb(textColor);
            this.fontValue =
                typeof font === 'string'
                    ? font
                    : this.pw.font.family(font ?? 'primary');
            this.createButtonText(scene);
            this.createShadowSprite(scene);
            this.createBackgroundSprite(scene);
            this.setupContainer();
            this.setupInteractivity(onClick);
        }
        // API Methods
        /**
         * Sets the button text.
         * @param text The new text.
         * @returns This TextButton instance.
         */
        setText(text) {
            this.textValue = text;
            this.buttonText.setText(text);
            this.regenerateSprites();
            return this;
        }
        /**
         * Sets the font size.
         * @param fontSize Font size in px or token.
         * @returns This TextButton instance.
         */
        setFontSize(fontSize) {
            this.fontSizePx =
                typeof fontSize === 'number'
                    ? fontSize
                    : this.pw.fontSize.px(fontSize ?? 'md');
            this.buttonText.setFontSize(this.fontSizePx);
            this.regenerateSprites();
            return this;
        }
        /**
         * Sets the font family.
         * @param font Font family as string or token.
         * @returns This TextButton instance.
         */
        setFont(font) {
            this.fontValue =
                typeof font === 'string'
                    ? font
                    : this.pw.font.family(font ?? 'primary');
            this.buttonText.setFontFamily(this.fontValue);
            this.regenerateSprites();
            return this;
        }
        /**
         * Sets the background color.
         * @param color Color as token or CSS string.
         * @returns This TextButton instance.
         */
        setBackgroundColor(color) {
            this.backgroundColorValue = Color.rgb(color);
            this.regenerateSprites();
            return this;
        }
        /**
         * Sets the text color.
         * @param color Color as token or CSS string.
         * @returns This TextButton instance.
         */
        setTextColor(color) {
            this.textColorValue = Color.rgb(color);
            this.buttonText.setColor(this.textColorValue);
            return this;
        }
        /**
         * Sets the border radius.
         * @param borderRadius Border radius in px or token.
         * @returns This TextButton instance.
         */
        setBorderRadius(borderRadius) {
            this.borderRadiusPx =
                typeof borderRadius === 'number'
                    ? borderRadius
                    : this.pw.radius.px(borderRadius ?? 'md');
            this.regenerateSprites();
            return this;
        }
        /**
         * Sets the margin (padding).
         * @param margin Margin in px or token.
         * @returns This TextButton instance.
         */
        setMargin(margin) {
            this.marginPx =
                typeof margin === 'number'
                    ? margin
                    : this.pw.spacing.px(margin ?? '4');
            this.regenerateSprites();
            return this;
        }
        /**
         * Creates the button text GameObject.
         * @param scene Phaser scene.
         */
        createButtonText(scene) {
            this.buttonText = scene.add.text(0, 0, this.textValue, {
                fontSize: `${this.fontSizePx}px`,
                fontFamily: this.fontValue,
                color: this.textColorValue,
            });
            this.buttonText.setOrigin(0.5, 0.5);
        }
        /**
         * Creates the shadow sprite for the button.
         * @param scene Phaser scene.
         */
        createShadowSprite(scene) {
            const shadowTexture = this.createShadowTexture(scene);
            this.shadowSprite = scene.add.sprite(0, SHADOW_OFFSET, shadowTexture);
            this.shadowSprite.setOrigin(0.5, 0.5);
        }
        /**
         * Creates the background sprite for the button.
         * @param scene Phaser scene.
         */
        createBackgroundSprite(scene) {
            const backgroundTexture = this.createBackgroundTexture(scene);
            this.backgroundSprite = scene.add.sprite(0, 0, backgroundTexture);
            this.backgroundSprite.setOrigin(0.5, 0.5);
        }
        /**
         * Regenerates the background and shadow textures based on current state.
         */
        regenerateSprites() {
            // Update text bounds after text/font changes
            this.buttonText.setText(this.textValue);
            // Regenerate textures
            const shadowTexture = this.createShadowTexture(this.scene);
            const backgroundTexture = this.createBackgroundTexture(this.scene);
            this.shadowSprite.setTexture(shadowTexture);
            this.backgroundSprite.setTexture(backgroundTexture);
        }
        /**
         * Calculates the button's width and height based on text and margin.
         * @returns Object with width and height.
         */
        getButtonDimensions() {
            const textBounds = this.buttonText.getBounds();
            const width = textBounds.width + this.marginPx * 2;
            const height = textBounds.height + this.marginPx * 2;
            return { width, height };
        }
        /**
         * Creates a texture for the button's shadow.
         * @param scene Phaser scene.
         * @returns The texture key.
         */
        createShadowTexture(scene) {
            const { width, height } = this.getButtonDimensions();
            const textureKey = `textButton_shadow_${this.backgroundColorValue}_${this.borderRadiusPx}_${width}_${height}`;
            // Add some padding for shadow
            const shadowPadding = 8;
            const textureWidth = width + shadowPadding * 2;
            const textureHeight = height + shadowPadding * 2;
            const graphics = scene.add.graphics();
            // Limit radius to maximum possible for the button dimensions
            const maxRadius = Math.min(width / 2, height / 2);
            const effectiveRadius = Math.min(this.borderRadiusPx, maxRadius);
            // Shadow
            graphics.fillStyle(Color.hex('black'), SHADOW_OPACITY);
            graphics.fillRoundedRect(shadowPadding, shadowPadding + SHADOW_OFFSET, width, height, effectiveRadius);
            graphics.generateTexture(textureKey, textureWidth, textureHeight);
            graphics.destroy();
            return textureKey;
        }
        /**
         * Creates a texture for the button's background.
         * @param scene Phaser scene.
         * @returns The texture key.
         */
        createBackgroundTexture(scene) {
            const { width, height } = this.getButtonDimensions();
            const textureKey = `textButton_bg_${this.backgroundColorValue}_${this.borderRadiusPx}_${width}_${height}`;
            // Add some padding for texture
            const padding = 8;
            const textureWidth = width + padding * 2;
            const textureHeight = height + padding * 2;
            const graphics = scene.add.graphics();
            // Limit radius to maximum possible for the button dimensions
            const maxRadius = Math.min(width / 2, height / 2);
            const effectiveRadius = Math.min(this.borderRadiusPx, maxRadius);
            // Main background
            graphics.fillStyle(Color.hex(this.backgroundColorValue), 1);
            graphics.fillRoundedRect(padding, padding, width, height, effectiveRadius);
            graphics.generateTexture(textureKey, textureWidth, textureHeight);
            graphics.destroy();
            return textureKey;
        }
        /**
         * Adds the button's visual elements to the container.
         */
        setupContainer() {
            this.add([this.shadowSprite, this.backgroundSprite, this.buttonText]);
        }
        /**
         * Sets up interactivity for the button, including hover and click effects.
         * @param onClick Optional click callback.
         */
        setupInteractivity(onClick) {
            this.backgroundSprite.setInteractive({ useHandCursor: true });
            // Hover effects
            this.backgroundSprite.on('pointerover', () => {
                this.scene.tweens.add({
                    targets: this,
                    scaleX: HOVER_SCALE,
                    scaleY: HOVER_SCALE,
                    duration: durations.hover,
                    ease: 'Back.easeOut',
                });
            });
            this.backgroundSprite.on('pointerout', () => {
                this.scene.tweens.add({
                    targets: this,
                    scaleX: 1,
                    scaleY: 1,
                    duration: durations.hover,
                    ease: 'Back.easeOut',
                });
            });
            // Click effects
            this.backgroundSprite.on('pointerdown', () => {
                this.scene.tweens.add({
                    targets: [this.backgroundSprite, this.buttonText],
                    y: CLICK_OFFSET,
                    duration: durations.click,
                    ease: 'Linear',
                });
            });
            this.backgroundSprite.on('pointerup', () => {
                this.scene.tweens.add({
                    targets: [this.backgroundSprite, this.buttonText],
                    y: 0,
                    duration: durations.click,
                    ease: 'Linear',
                });
                onClick?.();
            });
        }
        /**
         * Gets the interactive sprite of the icon button
         * @returns The interactive sprite
         */
        get interactive() {
            const { on, off, setInteractive, once } = this.backgroundSprite;
            return {
                on: on.bind(this.backgroundSprite),
                off: off.bind(this.backgroundSprite),
                setInteractive: setInteractive.bind(this.backgroundSprite),
                once: once.bind(this.backgroundSprite),
            };
        }
    }

    const HUDINI_KEY = 'hudini';
    /**
     * Phaser Wind Plugin class that manages theme configuration
     * @extends Plugins.BasePlugin
     */
    class HudiniPlugin extends Phaser$1.Plugins.BasePlugin {
        /**
         * The mapping key for the PhaserWind plugin
         * @internal
         * @deprecated Do not modify this value unless you know what you're doing.
         * Changing this value can break the plugin's functionality.
         */
        phaserWindMappingKey = PHASER_WIND_KEY;
        /**
         * Creates an instance of HudiniPlugin
         * @param pluginManager - Phaser plugin manager instance
         */
        constructor(pluginManager) {
            super(pluginManager);
        }
        /**
         * Initializes the plugin with theme configuration
         * @param theme - Custom theme configuration
         * @param darkMode - Whether to use dark mode theme when no custom theme provided
         * @example
         * ```typescript
         * const game = new Phaser.Game({
         *   plugins: {
         *     global: [
         *       {
         *         key: HUDINI_KEY,
         *         plugin: HudiniPlugin,
         *         mapping: HUDINI_KEY,
         *         data: { theme: defaultLightTheme,  }
         *       },
         *     ],
         *   },
         * });
         * ```
         */
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        init({ theme, darkMode = false, 
        /**
         * @internal
         * @deprecated Do not modify this value unless you know what you're doing.
         * Changing this value can break the plugin's functionality.
         */
        phaserWindMappingKey = PHASER_WIND_KEY, }) {
            this.phaserWindMappingKey = phaserWindMappingKey;
            // If the phaser-wind plugin is not installed, install it
            if (!this.pluginManager.get(PHASER_WIND_KEY)) {
                const chosenTheme = theme ?? (darkMode ? defaultDarkTheme : defaultLightTheme);
                this.pluginManager.install(PHASER_WIND_KEY, PhaserWindPlugin, true, phaserWindMappingKey, {
                    theme: chosenTheme,
                    darkMode,
                });
            }
        }
        /**
         * Returns the PhaserWind plugin instance
         * @returns PhaserWind plugin instance
         */
        get pw() {
            return this.pluginManager.get(this.phaserWindMappingKey);
        }
    }

    class SceneWithHudini extends SceneWithPhaserWind {
        /**
         *
         * @param config The scene key or scene specific configuration settings.
         */
        constructor(config) {
            super(config);
        }
        hudini;
    }

    const getHudini = (scene) => {
        return scene.hudini;
    };

    var Hudini = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Card: Card,
        CircularProgress: CircularProgress,
        Color: Color,
        Column: Column,
        FlatIconButton: FlatIconButton,
        FontSize: FontSize,
        HUDINI_KEY: HUDINI_KEY,
        HudiniPlugin: HudiniPlugin,
        IconButton: IconButton,
        LinearProgress: LinearProgress,
        PHASER_WIND_KEY: PHASER_WIND_KEY,
        PhaserWindPlugin: PhaserWindPlugin,
        RadialProgress: RadialProgress,
        Radius: Radius,
        Row: Row,
        SceneWithHudini: SceneWithHudini,
        SceneWithPhaserWind: SceneWithPhaserWind,
        SectionHeader: SectionHeader,
        Shadow: Shadow,
        SizedBox: SizedBox,
        Spacing: Spacing,
        TextButton: TextButton,
        createColor: createColor,
        createFont: createFont,
        createFontSize: createFontSize,
        createRadius: createRadius,
        createShadow: createShadow,
        createSpacing: createSpacing,
        createTheme: createTheme,
        defaultDarkTheme: defaultDarkTheme,
        defaultLightTheme: defaultLightTheme,
        defaultShadowMap: defaultShadowMap,
        fontMap: fontMap,
        fontSizeMap: fontSizeMap,
        getHudini: getHudini,
        getPWFromScene: getPWFromScene,
        isValidColor: isValidColor,
        palette: palette,
        radiusMap: radiusMap,
        spacingMap: spacingMap
    });

    const DEFAULT_MAX_INSTANCES = 10;

    class SoundLoader {
        plugin;
        constructor(plugin) {
            this.plugin = plugin;
            this.plugin = plugin;
        }
        get game() {
            return this.plugin.getGame();
        }
        /**
         * Loads a sound by its key into the given scene.
         * @param {Scene} scene - The Phaser scene to load the sound into.
         * @param {TSoundKey} soundKey - The key of the sound to load.
         * @returns {void}
         */
        loadBySoundKey(scene, soundKey) {
            const { game, plugin } = this;
            if (!game.cache.audio.has(soundKey)) {
                scene.load.audio(soundKey, plugin.soundList[soundKey]?.path);
            }
        }
        /**
         * Loads all sounds associated with a specific channel into the given scene.
         * @param {Scene} scene - The Phaser scene to load the sounds into.
         * @param {TChannel} channel - The channel whose sounds should be loaded.
         * @returns {void}
         */
        loadByChannel(scene, channel) {
            const { plugin } = this;
            Object.entries(plugin.soundList)
                .filter(s => s[1].channel === channel)
                .forEach(([soundKey]) => {
                this.loadBySoundKey(scene, soundKey);
            });
        }
    }

    /**
     * SoundPlayer is responsible for playing sounds according to their channel mode.
     *
     * @template TSoundKey - The type of the sound key (defaults to string).
     * @template TChannel - The type of the channel name (defaults to string).
     */
    class SoundPlayer {
        plugin;
        /**
         * Creates an instance of SoundPlayer.
         * @param plugin - The PhaserSoundStudioPlugin instance.
         */
        constructor(plugin) {
            this.plugin = plugin;
            this.plugin = plugin;
        }
        /**
         * Returns the Phaser Game instance.
         * @returns {Game} The Phaser Game instance.
         */
        get game() {
            return this.plugin.getGame();
        }
        /**
         * Returns the SoundRegistry instance.
         * @returns {SoundRegistry<TSoundKey, TChannel>} The SoundRegistry instance.
         */
        get soundRegistry() {
            return this.plugin.soundRegistry;
        }
        /**
         * Plays a sound by its key, using the appropriate channel mode.
         * @param {TSoundKey} key - The key of the sound to play.
         * @returns {void}
         */
        play(key) {
            const channel = this.soundRegistry.getChannelBySoundKey(key);
            const channelMode = channel.mode;
            switch (channelMode) {
                case 'single':
                    this.playSingleMode(key);
                    break;
                case 'multiple':
                    this.playMultipleMode(key, channel.maxInstances);
                    break;
            }
        }
        /**
         * Plays a sound in 'single' mode (only one instance can play at a time).
         * @param {TSoundKey} key - The key of the sound to play.
         * @returns {void}
         */
        playSingleMode(key) {
            const sound = this.soundRegistry.getSoundBySoundKey(key);
            if (sound) {
                if (!sound.isPlaying) {
                    sound.play();
                }
                return;
            }
            const soundConfig = this.soundRegistry.getSoundConfigBySoundKey(key);
            this.game.sound.add(key, {
                volume: soundConfig?.channel ? this.plugin.getChannelVolume(soundConfig.channel) : 1,
                loop: soundConfig?.loop ?? false,
            }).play();
        }
        /**
         * Plays a sound in 'multiple' mode (multiple instances can play simultaneously, up to maxInstances).
         * @param {TSoundKey} key - The key of the sound to play.
         * @param {number} [maxInstances=DEFAULT_MAX_INSTANCES] - The maximum number of simultaneous instances allowed.
         * @returns {void}
         */
        playMultipleMode(key, maxInstances = DEFAULT_MAX_INSTANCES) {
            const sounds = this.soundRegistry.fetchSoundsBySoundKey(key);
            const stoppedSound = sounds.find((sound) => !sound.isPlaying);
            if (stoppedSound) {
                stoppedSound.play();
                return;
            }
            if (sounds.length < maxInstances) {
                const soundConfig = this.soundRegistry.getSoundConfigBySoundKey(key);
                this.game.sound.add(key, {
                    volume: soundConfig?.channel ? this.plugin.getChannelVolume(soundConfig.channel) : 1,
                    loop: soundConfig?.loop ?? false,
                }).play();
            }
        }
    }

    /**
     * SoundRegistry is responsible for managing and providing access to sound and channel configurations.
     *
     * @template TSoundKey - The type of the sound key (defaults to string).
     * @template TChannel - The type of the channel name (defaults to string).
     */
    class SoundRegistry {
        plugin;
        /**
         * Creates an instance of SoundRegistry.
         * @param plugin - The PhaserSoundStudioPlugin instance.
         */
        constructor(plugin) {
            this.plugin = plugin;
            this.plugin = plugin;
        }
        /**
         * Returns the Phaser Game instance.
         * @returns {Game} The Phaser Game instance.
         */
        get game() {
            return this.plugin.getGame();
        }
        /**
         * Returns the SoundPlayer instance.
         * @returns {SoundPlayer<TSoundKey>} The SoundPlayer instance.
         */
        get soundPlayer() {
            return this.plugin.soundPlayer;
        }
        /**
         * Returns the channel configuration.
         * @returns {ChannelConfig<TChannel>} The channel configuration.
         */
        get channels() {
            return this.plugin.channels;
        }
        /**
         * Returns the sound list configuration.
         * @returns {SoundListConfig<TSoundKey, TChannel>} The sound list configuration.
         */
        get soundList() {
            return this.plugin.soundList;
        }
        /**
         * Gets the sound configuration for a given sound key.
         * @param {TSoundKey} soundKey - The key of the sound.
         * @returns {SoundConfig<TChannel> | null} The sound configuration or null if not found.
         */
        getSoundConfigBySoundKey(soundKey) {
            return this.soundList[soundKey] ?? null;
        }
        /**
         * Gets the first Phaser sound instance for a given sound key.
         * @param soundKey - The key of the sound.
         * @returns {Phaser.Sound.BaseSound | null} The first sound instance or null if not found.
         */
        getSoundBySoundKey(soundKey) {
            const sounds = this.fetchSoundsBySoundKey(soundKey);
            return sounds.length > 0 ? sounds[0] : null;
        }
        /**
         * Fetches all Phaser sound instances for a given sound key.
         * @param soundKey - The key of the sound.
         * @returns {Phaser.Sound.BaseSound[]} An array of sound instances.
         */
        fetchSoundsBySoundKey(soundKey) {
            return this.game.sound.getAll(soundKey);
        }
        /**
         * Gets the channel configuration for a given sound key.
         * @param soundKey - The key of the sound.
         * @returns {ChannelItem} The channel configuration item.
         */
        getChannelBySoundKey(soundKey) {
            const sound = this.soundList[soundKey];
            const channel = this.channels[sound.channel];
            return channel;
        }
    }

    /**
     * The key used to register the Phaser Sound Studio plugin.
     * @type {string}
     */
    const PHASER_SOUND_STUDIO_KEY = 'soundStudio';
    /**
     * Phaser Sound Studio Plugin class that manages sound configuration and playback.
     * @template TSoundKey - The type of the sound key (defaults to string).
     * @template TChannel - The type of the channel name (defaults to string).
     * @extends Plugins.BasePlugin
     */
    class PhaserSoundStudioPlugin extends Phaser$1.Plugins.BasePlugin {
        /**
         * Map of channel names to their current volume.
         * @type {Record<TChannel, number>}
         * @private
         */
        channelVolumes = {};
        /**
         * The sound player instance.
         * @type {SoundPlayer<TSoundKey>}
         * @public
         */
        soundPlayer;
        /**
         * The sound loader instance.
         * @type {SoundLoader<TSoundKey, TChannel>}
         * @public
         */
        soundLoader;
        /**
         * The sound registry instance.
         * @type {SoundRegistry<TSoundKey, TChannel>}
         * @public
         */
        soundRegistry;
        /**
         * The list of sound configurations.
         * @type {SoundListConfig<TSoundKey, TChannel>}
         * @private
         */
        soundList;
        /**
         * The list of available channels.
         * @type {ChannelConfig<TChannel>}
         * @public
         */
        channels;
        /**
         * The storage type for sound settings.
         * @type {'local' | 'session'}
         * @public
         */
        storage;
        /**
         * The name of the game.
         * @type {string | undefined}
         * @public
         */
        gameName;
        /**
         * The game instance.
         * @type {Game}
         * @public
         */
        getGame() {
            return this.game;
        }
        /**
         * Creates an instance of PhaserSoundStudioPlugin.
         * @param {Plugins.PluginManager} pluginManager - Phaser plugin manager instance.
         */
        constructor(pluginManager) {
            super(pluginManager);
            this.soundList = {};
            this.soundLoader = new SoundLoader(this);
            this.channels = {};
            this.storage = 'local';
            this.soundPlayer = new SoundPlayer(this);
            this.soundRegistry = new SoundRegistry(this);
        }
        /**
         * Initializes the plugin with configuration data.
         * @param {PhaserSoundStudioPluginData<TSoundKey, TChannel>} param0 - The plugin configuration data.
         * @returns {void}
         * @override
         */
        init({ soundList, channels, storage, gameName, }) {
            this.soundList = soundList;
            this.channels = channels;
            this.storage = storage;
            this.gameName = gameName;
            Object.keys(channels).forEach((channel) => {
                this.channelVolumes[channel] = 1.0;
            });
        }
        /**
         * Loads all sounds defined in the sound list into the given scene.
         * @param {Scene} scene - The Phaser scene to load sounds into.
         * @returns {void}
         */
        loadAll(scene) {
            const soundsToLoad = Object.entries(this.soundList)
                .filter((s) => s[1].preload !== false);
            for (const [key, sound] of soundsToLoad) {
                scene.load.audio(key, sound.path);
            }
            this.loadChannelVolumes(scene);
        }
        /**
         * Loads all sounds for a specific channel into the given scene.
         * @param {Scene} scene - The Phaser scene to load sounds into.
         * @param {TChannel} channel - The channel to load sounds for.
         * @returns {void}
         */
        loadByChannel(scene, channel) {
            this.soundLoader.loadByChannel(scene, channel);
            this.loadChannelVolumes(scene);
        }
        /**
         * Loads a specific sound by its key into the given scene.
         * @param {Scene} scene - The Phaser scene to load the sound into.
         * @param {TSoundKey} soundKey - The key of the sound to load.
         * @returns {void}
         */
        loadBySoundKey(scene, soundKey) {
            this.soundLoader.loadBySoundKey(scene, soundKey);
        }
        /**
         * Plays a sound by key in the given scene. If the sound is not loaded, it loads and then plays it.
         * @param {TSoundKey} key - The key of the sound to play.
         * @returns {void}
         */
        play(key) {
            this.soundPlayer.play(key);
        }
        /**
         * Plays a sound by key only if it is not already playing.
         * @param {Scene} scene - The Phaser scene to play the sound in.
         * @param {TSoundKey} key - The key of the sound to play.
         * @returns {void}
         */
        playOnce(scene, key) {
            const sound = scene.sound.get(key);
            if (sound?.isPlaying) {
                return;
            }
            this.play(key);
        }
        /**
         * Lazy loads a sound by key in the given scene.
         * @param {Scene} scene - The Phaser scene to load the sound into.
         * @param {TSoundKey} key - The key of the sound to load.
         * @returns {void}
         */
        lazyLoadPlay(scene, key) {
            const path = this.soundList[key]?.path;
            if (!path) {
                return;
            }
            scene.load.audio(key, path);
            scene.load.once(`filecomplete-audio-${key}`, () => {
                this.play(key);
            });
        }
        /**
         * Sets the volume for a specific channel.
         * @param {Scene} scene - The Phaser scene context.
         * @param {TChannel} channel - The channel to set the volume for.
         * @param {number} volume - The volume to set (0.0 to 1.0).
         * @returns {void}
         */
        setChannelVolume(scene, channel, volume) {
            if (volume < 0 || volume > 1) {
                volume = Math.max(0, Math.min(1, volume));
                // eslint-disable-next-line no-console
                console.warn(`Volume must be between 0 and 1. Setting volume to ${volume} instead in channel ${channel}.`);
            }
            this.channelVolumes[channel] = volume;
            Object.entries(this.soundList)
                .filter(s => s[1].channel === channel)
                .forEach(([soundKey]) => {
                const soundInstance = scene.sound.get(soundKey);
                if (soundInstance && 'setVolume' in soundInstance) {
                    soundInstance.setVolume(volume);
                }
            });
            this.saveChannelVolumes(scene);
        }
        /**
         * Gets the volume for a specific channel.
         * @param {TChannel} channel - The channel to get the volume for.
         * @returns {number} The volume for the channel.
         */
        getChannelVolume(channel) {
            return this.channelVolumes[channel] ?? 1;
        }
        /**
         * Mutes a specific channel.
         * @param {Scene} scene - The Phaser scene context.
         * @param {TChannel} channel - The channel to mute.
         * @returns {void}
         */
        muteChannel(scene, channel) {
            this.setChannelVolume(scene, channel, 0);
        }
        /**
         * Unmutes a specific channel.
         * @param {Scene} scene - The Phaser scene context.
         * @param {TChannel} channel - The channel to unmute.
         * @returns {void}
         */
        unmuteChannel(scene, channel) {
            this.setChannelVolume(scene, channel, 1);
        }
        /**
         * Gets all channels.
         * @returns {ChannelConfig<TChannel>} All channels.
         */
        getAllChannels() {
            return this.channels;
        }
        /**
         * Returns the persistent storage key for channel volumes.
         * @returns {string} The storage key for channel volumes.
         */
        persistNameKey() {
            if (!this.gameName) {
                return 'phaser-sound-studio-volumes';
            }
            return `phaser-sound-studio-volumes:${this.gameName}`;
        }
        /**
         * Saves the channel volumes to the storage.
         * @param {Scene} scene - The Phaser scene context.
         * @returns {void}
         * @private
         */
        saveChannelVolumes(scene) {
            const hook = withPersistentState(scene, this.persistNameKey(), this.channelVolumes, undefined, this.storage);
            hook.set(this.channelVolumes);
        }
        /**
         * Loads the channel volumes from the storage.
         * @param {Scene} scene - The Phaser scene context.
         * @returns {void}
         * @private
         */
        loadChannelVolumes(scene) {
            const hook = withPersistentState(scene, this.persistNameKey(), this.channelVolumes, undefined, this.storage);
            this.channelVolumes = hook.get();
        }
    }

    const getSoundStudio = (scene, mappingKey = PHASER_SOUND_STUDIO_KEY) => {
        return scene.plugins.get(mappingKey);
    };

    var SoundStudio = /*#__PURE__*/Object.freeze({
        __proto__: null,
        DEFAULT_MAX_INSTANCES: DEFAULT_MAX_INSTANCES,
        PHASER_SOUND_STUDIO_KEY: PHASER_SOUND_STUDIO_KEY,
        PhaserSoundStudioPlugin: PhaserSoundStudioPlugin,
        SoundLoader: SoundLoader,
        SoundPlayer: SoundPlayer,
        SoundRegistry: SoundRegistry,
        getSoundStudio: getSoundStudio
    });

    /**
     * Default configuration for the dead zone circle.
     * @constant {Object}
     */
    const deadZoneConfigDefault = {
        alpha: 0.5,
        strokeColor: 0x1D4ED8, // Blue 600 in phaser-wind
        strokeAlpha: 0.3,
        strokeWidth: 5,
        radius: 16,
        fillColor: 0x2563EB, // Blue 700 in phaser-wind
    };
    /**
     * Default configuration for the base area circle.
     * @constant {Object}
     */
    const baseAreaConfigDefault = {
        alpha: 0.05,
        strokeColor: 0x1D4ED8, // Blue 600 in phaser-wind
        strokeAlpha: 0.3,
        strokeWidth: 5,
        radius: 64,
        fillColor: 0x2563EB, // Blue 700 in phaser-wind
    };
    /**
     * Default configuration for the stick circle.
     * @constant {Object}
     */
    const stickConfigDefault = {
        alpha: 1,
        strokeColor: 0x1D4ED8, // Blue 600 in phaser-wind
        strokeAlpha: 0.4,
        strokeWidth: 5,
        radius: 40,
        fillColor: 0x1D4ED8, // Blue 600 in phaser-wind
    };
    /**
     * Constants used throughout the TouchpadJoystick class.
     * Contains magic numbers and default values for better maintainability.
     * @constant {Object}
     */
    const JOYSTICK_CONSTANTS = {
        // Movement and positioning
        MOVE_FACTOR: 0.03, // How much to move joystick towards pointer (3%)
        SCREEN_PADDING: 24, // Padding from screen edges
        MAX_DISTANCE_FACTOR: 0.9, // Maximum distance as percentage of base area radius
        DISTANCE_THRESHOLD_MULTIPLIER: 2.1, // When to move joystick (210% of max distance)
        // Default bounds (left half of screen with 20% top padding)
        DEFAULT_TOP_PADDING: 0.2, // 20% of screen height
        DEFAULT_LEFT_HALF: 0.5, // Left half of screen
        // Visual positioning
        HIDDEN_POSITION: -100, // Position when joystick is hidden
        HIDDEN_ALPHA: 0, // Alpha when joystick is hidden
        VISIBLE_ALPHA: 1, // Alpha when joystick is visible
    };

    /**
     * Calculates the default bounds for joystick activation.
     * Uses the left half of the screen with 20% padding from the top.
     *
     * @param {Phaser.Scene} scene - The scene to get screen dimensions from
     * @returns {Object} The default bounds object
     * @returns {Object} returns.topLeft - Top-left corner coordinates
     * @returns {number} returns.topLeft.x - X coordinate of top-left corner
     * @returns {number} returns.topLeft.y - Y coordinate of top-left corner
     * @returns {Object} returns.bottomRight - Bottom-right corner coordinates
     * @returns {number} returns.bottomRight.x - X coordinate of bottom-right corner
     * @returns {number} returns.bottomRight.y - Y coordinate of bottom-right corner
     */
    const getDefaultBounds = (scene) => {
        const screenWidth = scene.scale.width;
        const screenHeight = scene.scale.height;
        return {
            topLeft: {
                x: 0,
                y: screenHeight * JOYSTICK_CONSTANTS.DEFAULT_TOP_PADDING,
            },
            bottomRight: {
                x: screenWidth * JOYSTICK_CONSTANTS.DEFAULT_LEFT_HALF,
                y: screenHeight,
            },
        };
    };
    /**
     * Checks if the given coordinates are within the joystick activation bounds.
     *
     * @param {number} x - The x coordinate to check
     * @param {number} y - The y coordinate to check
     * @param {Object} bounds - The bounds to check against
     * @param {Object} bounds.topLeft - Top-left corner of the bounds
     * @param {number} bounds.topLeft.x - X coordinate of top-left corner
     * @param {number} bounds.topLeft.y - Y coordinate of top-left corner
     * @param {Object} bounds.bottomRight - Bottom-right corner of the bounds
     * @param {number} bounds.bottomRight.x - X coordinate of bottom-right corner
     * @param {number} bounds.bottomRight.y - Y coordinate of bottom-right corner
     * @returns {boolean} True if the coordinates are within bounds, false otherwise
     */
    const isWithinBounds = (x, y, bounds) => {
        return (x >= bounds.topLeft.x &&
            x <= bounds.bottomRight.x &&
            y >= bounds.topLeft.y &&
            y <= bounds.bottomRight.y);
    };

    /**
     * Events emitted by the TouchpadJoystick component.
     * @enum {string}
     */
    exports.VirtualJoystickEvents = void 0;
    (function (VirtualJoystickEvents) {
        /** Emitted when the joystick position changes */
        VirtualJoystickEvents["UPDATE"] = "touchpad-joystick-update";
        /** Emitted when the user releases the joystick */
        VirtualJoystickEvents["RELEASE"] = "touchpad-joystick-release";
        /** Emitted when the user presses the joystick */
        VirtualJoystickEvents["PRESS"] = "touchpad-joystick-press";
    })(exports.VirtualJoystickEvents || (exports.VirtualJoystickEvents = {}));
    const getEventName = (event, id) => {
        return `${event}${id}`.replace(/[^a-zA-Z0-9]/g, '');
    };
    const BASE36 = 36;
    const idGenerator = () => {
        const now = performance.now().toString(BASE36);
        const random = Math.random().toString(BASE36).substring(2);
        return `${now}-${random}`;
    };
    /**
     * A virtual joystick component for touch devices that provides analog input control.
     *
     * This class creates a virtual joystick that appears when touched within defined bounds,
     * allowing users to control game characters or objects with smooth analog input.
     * The joystick automatically follows the user's finger when dragged beyond its limits,
     * providing an intuitive touch control experience.
     *
     * @class VirtualJoystick
     * @extends Phaser.GameObjects.Container
     *
     * @example
     * ```typescript
     * // Basic usage with default settings
     * const joystick = new VirtualJoystick({
     *   scene: this,
     * });
     *
     * // Custom configuration
     * const joystick = new VirtualJoystick({
     *   scene: this,
     *   bounds: {
     *     topLeft: { x: 0, y: 100 },
     *     bottomRight: { x: 400, y: 600 }
     *   },
     *   deadZone: { radius: 20, alpha: 0.3 }
     * });
     *
     * // Listen to joystick events
     * joystick.on('move', (data) => {
     *   console.log(`Joystick position: ${data.x}, ${data.y}`);
     * });
     * ```
     */
    let VirtualJoystick$1 = class VirtualJoystick extends Phaser__namespace.GameObjects.Container {
        /** The dead zone circle that defines the center area where no input is registered */
        deadZone;
        /** The base area circle that defines the maximum joystick movement range */
        baseArea;
        /** The stick circle that follows the user's finger movement */
        stick;
        /** Optional icon displayed on the stick (e.g., directional arrows) */
        stickIcon;
        /** Container that holds all joystick visual elements */
        analogContainer;
        /** The initial touch position when the joystick was activated */
        startPosition;
        /** Container for any button elements that should not interfere with joystick */
        buttonsContainer;
        /** The ID of the current active touch (null if no touch is active) */
        touchId = null;
        /** Configuration for the dead zone visual appearance */
        deadZoneConfig;
        /** Configuration for the base area visual appearance */
        baseAreaConfig;
        /** Configuration for the stick visual appearance */
        stickConfig;
        /** The bounds within which the joystick can be activated */
        bounds;
        id;
        /**
         * Creates a new TouchpadJoystick instance.
         *
         * @param {TouchpadJoystickParams} params - Configuration parameters for the joystick
         * @param {Phaser.Scene} params.scene - The Phaser scene where the joystick will be created
         * @param {Object} [params.deadZone] - Custom configuration for the dead zone
         * @param {Object} [params.baseArea] - Custom configuration for the base area
         * @param {Object} [params.stick] - Custom configuration for the stick
         * @param {Phaser.GameObjects.Text} [params.stickIcon] - Optional icon to display on the stick
         * @param {Object} [params.bounds] - Custom bounds for joystick activation area
         *
         * @example
         * ```typescript
         * // Basic usage
         * const joystick = new TouchpadJoystick({ scene: this });
         *
         * // With custom bounds
         * const joystick = new TouchpadJoystick({
         *   scene: this,
         *   bounds: {
         *     topLeft: { x: 0, y: 100 },
         *     bottomRight: { x: 400, y: 600 }
         *   }
         * });
         * ```
         */
        constructor({ scene, deadZone, baseArea, stick, stickIcon, bounds, enableWithoutTouch = false, id, }) {
            super(scene, 0, 0);
            this.deadZoneConfig = {
                ...deadZoneConfigDefault,
                ...(deadZone ?? {}),
            };
            this.baseAreaConfig = {
                ...baseAreaConfigDefault,
                ...(baseArea ?? {}),
            };
            this.stickConfig = {
                ...stickConfigDefault,
                ...(stick ?? {}),
            };
            this.id = id ?? idGenerator();
            // Set default bounds if not provided (left half of screen with 20% top padding)
            this.bounds = bounds ?? getDefaultBounds(scene);
            if (!this.scene.sys.game.device.input.touch && !enableWithoutTouch) {
                return;
            }
            this.setScrollFactor(0);
            this.createJoystick(stickIcon);
            this.setupEventListeners();
        }
        /**
         * Creates the visual elements of the joystick (dead zone, base area, stick, and optional icon).
         *
         * @private
         * @param {Phaser.GameObjects.Text} stickIcon - Optional icon to display on the stick
         */
        createJoystick(stickIcon) {
            this.analogContainer = this.scene.add.container(JOYSTICK_CONSTANTS.HIDDEN_POSITION, JOYSTICK_CONSTANTS.HIDDEN_POSITION);
            this.add(this.analogContainer);
            const { deadZoneConfig, baseAreaConfig, stickConfig } = this;
            this.deadZone = this.scene.add.circle(0, 0, deadZoneConfig.radius, deadZoneConfig.fillColor, deadZoneConfig.alpha);
            this.deadZone.setOrigin(0.5, 0.5).setStrokeStyle(deadZoneConfig.strokeWidth, deadZoneConfig.strokeColor, deadZoneConfig.strokeAlpha);
            this.analogContainer.add(this.deadZone);
            this.baseArea = this.scene.add.circle(0, 0, baseAreaConfig.radius, baseAreaConfig.fillColor, baseAreaConfig.alpha);
            this.baseArea.setOrigin(0.5, 0.5).setStrokeStyle(baseAreaConfig.strokeWidth, baseAreaConfig.strokeColor, baseAreaConfig.strokeAlpha);
            this.analogContainer.add(this.baseArea);
            this.stick = this.scene.add.circle(0, 0, stickConfig.radius, stickConfig.fillColor, stickConfig.alpha);
            this.stick.setOrigin(0.5, 0.5).setStrokeStyle(stickConfig.strokeWidth, stickConfig.strokeColor, stickConfig.strokeAlpha);
            this.analogContainer.add(this.stick);
            if (stickIcon) {
                this.stickIcon = stickIcon;
                this.analogContainer.add(this.stickIcon);
            }
            if (this.stickIcon) {
                this.stickIcon.setOrigin(0.5, 0.5);
                this.analogContainer.add(this.stickIcon);
            }
        }
        /**
         * Resets the joystick to its hidden state and clears all active touch data.
         * Only resets if the pointer matches the current active touch.
         *
         * @private
         * @param {Phaser.Input.Pointer} pointer - The pointer that triggered the reset
         */
        resetJoystick(pointer) {
            // Only resets if it's the same touch that started the joystick
            if (this.touchId === null || this.touchId !== pointer.id || this.startPosition === null) {
                return;
            }
            this.analogContainer.setPosition(JOYSTICK_CONSTANTS.HIDDEN_POSITION, JOYSTICK_CONSTANTS.HIDDEN_POSITION);
            this.analogContainer.setAlpha(JOYSTICK_CONSTANTS.HIDDEN_ALPHA);
            this.stick.setPosition(0, 0);
            this.stickIcon?.setPosition(0, 0);
            this.startPosition = null;
            this.touchId = null;
        }
        /**
         * Registers an event listener for joystick events.
         *
         * @param {'move' | 'release' | 'press'} event - The event type to listen for
         * @param {Function} callback - The callback function to execute when the event occurs
         * @param {Object} callback.data - Event data object
         * @param {number} callback.data.x - Normalized x position (-1 to 1)
         * @param {number} callback.data.y - Normalized y position (-1 to 1)
         *
         * @example
         * ```typescript
         * joystick.on('move', (data) => {
         *   console.log(`Joystick position: ${data.x}, ${data.y}`);
         * });
         *
         * joystick.on('press', () => {
         *   console.log('Joystick pressed');
         * });
         *
         * joystick.on('release', () => {
         *   console.log('Joystick released');
         * });
         * ```
         */
        on(event, callback) {
            if (event === 'move') {
                const eventName = getEventName(exports.VirtualJoystickEvents.UPDATE, this.id);
                this.scene.events.on(eventName, callback);
                return this;
            }
            if (event === 'release') {
                const eventName = getEventName(exports.VirtualJoystickEvents.RELEASE, this.id);
                this.scene.events.on(eventName, callback);
                return this;
            }
            if (event === 'press') {
                const eventName = getEventName(exports.VirtualJoystickEvents.PRESS, this.id);
                this.scene.events.on(eventName, callback);
                return this;
            }
            // eslint-disable-next-line no-console
            console.warn(`Event ${event} not supported`);
            return this;
        }
        /**
         * Emits a move event with the current joystick position.
         *
         * @private
         * @param {number} x - Normalized x position (-1 to 1)
         * @param {number} y - Normalized y position (-1 to 1)
         */
        emitMove(x, y) {
            const eventName = getEventName(exports.VirtualJoystickEvents.UPDATE, this.id);
            this.scene.events.emit(eventName, { x, y });
        }
        /**
         * Emits a release event when the joystick is released.
         *
         * @private
         */
        emitRelease() {
            const eventName = getEventName(exports.VirtualJoystickEvents.RELEASE, this.id);
            this.scene.events.emit(eventName);
        }
        /**
         * Emits a press event when the joystick is first pressed.
         *
         * @private
         */
        emitPress() {
            const eventName = getEventName(exports.VirtualJoystickEvents.PRESS, this.id);
            this.scene.events.emit(eventName);
        }
        /**
         * Updates the joystick position and handles automatic joystick movement.
         * Called every frame to ensure smooth joystick following behavior.
         *
         * @public
         */
        update() {
            if (this.startPosition === null) {
                return;
            }
            if (!this.touchId || this.touchId !== this.scene.input.activePointer.id) {
                return;
            }
            let pointer = null;
            // Searches among active touches for the one that matches the registered touchId
            if (this.scene.input.manager.pointers) {
                pointer = this.scene.input.manager.pointers.find(p => p.id === this.touchId);
            }
            // If not found, fallback to activePointer (in mouse or simple touch mode)
            pointer ??= this.scene.input.activePointer;
            const distance = new Phaser__namespace.Math.Vector2(pointer.x, pointer.y).subtract(this.startPosition);
            const maxDistance = this.baseArea.radius * JOYSTICK_CONSTANTS.MAX_DISTANCE_FACTOR;
            const currentDistance = distance.length();
            if (currentDistance > maxDistance * JOYSTICK_CONSTANTS.DISTANCE_THRESHOLD_MULTIPLIER) {
                this.moveJoystickToPointer(distance);
            }
        }
        /**
         * Moves the joystick towards the pointer when it's dragged too far from the center.
         * This provides a smooth following behavior that keeps the joystick accessible.
         *
         * @private
         * @param {Phaser.Math.Vector2} distance - The distance vector from joystick center to pointer
         */
        moveJoystickToPointer(distance) {
            // Calculates the new position maintaining distance from the edge
            const padding = JOYSTICK_CONSTANTS.SCREEN_PADDING;
            if (this.startPosition === null) {
                return;
            }
            // Calculates how much to move based on the difference between current and desired position
            let newX = this.startPosition.x + (distance.x * JOYSTICK_CONSTANTS.MOVE_FACTOR);
            let newY = this.startPosition.y + (distance.y * JOYSTICK_CONSTANTS.MOVE_FACTOR);
            // Limits the new position within the defined bounds with padding
            const minX = this.bounds.topLeft.x + padding + this.baseArea.radius + this.stick.radius;
            const maxX = this.bounds.bottomRight.x - padding - this.baseArea.radius - this.stick.radius;
            const minY = this.bounds.topLeft.y + padding + this.baseArea.radius + this.stick.radius;
            const maxY = this.bounds.bottomRight.y - padding - this.baseArea.radius - this.stick.radius;
            newX = Math.max(newX, minX);
            newX = Math.min(newX, maxX);
            newY = Math.max(newY, minY);
            newY = Math.min(newY, maxY);
            // Updates positions
            this.startPosition.set(newX, newY);
            this.analogContainer.setPosition(newX, newY);
        }
        /**
         * Sets up all the input event listeners for touch/mouse interactions.
         * Handles pointer down, move, up, and cancel events.
         *
         * @private
         */
        setupEventListeners() {
            this.scene.input.on('pointerdown', this.onPointerDown, this);
            this.scene.input.on('pointermove', this.onPointerMove, this);
            this.scene.input.on('pointerup', this.onPointerUp, this);
            this.scene.input.on('pointercancel', this.onPointerCancel, this);
        }
        /**
         * Handles pointer down events for joystick activation.
         *
         * @private
         * @param {Phaser.Input.Pointer} pointer - The pointer that was pressed
         */
        onPointerDown(pointer) {
            const { x, y } = pointer;
            // Ignored if there is already a touch active on the joystick
            if (this.touchId !== null) {
                return;
            }
            // Check if the touch is over any interactive object (buttons)
            const objectsAtPointer = this.scene.input.hitTestPointer(pointer);
            const hasInteractiveObject = objectsAtPointer.some((obj) => {
                // Check if it is a button or interactive object
                if (!obj.input?.enabled) {
                    return false;
                }
                // Ignore the own container of the joystick
                if (obj === this || obj === this.analogContainer) {
                    return false;
                }
                return obj.parentContainer === this.buttonsContainer;
            });
            // If touched on a button or interactive object, do not activate the joystick
            if (hasInteractiveObject) {
                return;
            }
            // Check if touch is within the defined bounds
            if (!isWithinBounds(x, y, this.bounds)) {
                return;
            }
            this.analogContainer.setPosition(x, y);
            this.analogContainer.setAlpha(JOYSTICK_CONSTANTS.VISIBLE_ALPHA);
            this.stickIcon?.setPosition(0, 0);
            this.startPosition = new Phaser__namespace.Math.Vector2(x, y);
            this.touchId = pointer.id;
            this.emitPress();
        }
        /**
         * Handles pointer move events for joystick movement.
         *
         * @private
         * @param {Phaser.Input.Pointer} pointer - The pointer that moved
         */
        onPointerMove(pointer) {
            const { x, y } = pointer;
            if (this.startPosition === null) {
                return;
            }
            if (!this.touchId || this.touchId !== pointer.id) {
                return;
            }
            const distance = new Phaser__namespace.Math.Vector2(x, y).subtract(this.startPosition);
            const maxDistance = this.baseArea.radius * JOYSTICK_CONSTANTS.MAX_DISTANCE_FACTOR;
            const currentDistance = distance.length();
            if (currentDistance > maxDistance) {
                // Normalizes the vector and multiplies by the maximum distance
                distance.normalize().scale(maxDistance);
            }
            // Normalizes values to -1 to 1
            const normalizedX = distance.x / maxDistance;
            const normalizedY = distance.y / maxDistance;
            this.emitMove(normalizedX, normalizedY);
            this.stick.setPosition(distance.x, distance.y);
            this.stickIcon?.setPosition(distance.x, distance.y);
            // If the pointer is too far, move the joystick towards the pointer
            if (currentDistance > maxDistance * JOYSTICK_CONSTANTS.DISTANCE_THRESHOLD_MULTIPLIER) {
                this.moveJoystickToPointer(distance);
            }
        }
        /**
         * Handles pointer up events for joystick release.
         *
         * @private
         * @param {Phaser.Input.Pointer} pointer - The pointer that was released
         */
        onPointerUp(pointer) {
            this.emitRelease();
            this.resetJoystick(pointer);
        }
        /**
         * Handles pointer cancel events for joystick release.
         *
         * @private
         * @param {Phaser.Input.Pointer} pointer - The pointer that was cancelled
         */
        onPointerCancel(pointer) {
            this.emitRelease();
            this.resetJoystick(pointer);
        }
        /**
         * Destroys the joystick and cleans up all resources.
         * Removes event listeners, clears references, and calls parent destroy method.
         *
         * @public
         */
        destroy() {
            // Remove event listeners
            this.scene.input.off('pointerdown', this.onPointerDown, this);
            this.scene.input.off('pointermove', this.onPointerMove, this);
            this.scene.input.off('pointerup', this.onPointerUp, this);
            this.scene.input.off('pointercancel', this.onPointerCancel, this);
            // Removes all objects from the container
            this.removeAll(true);
            // Clears references
            this.startPosition = null;
            this.touchId = null;
            // Calls destroy of the parent container
            super.destroy();
        }
    };

    var VirtualJoystick = /*#__PURE__*/Object.freeze({
        __proto__: null,
        JOYSTICK_CONSTANTS: JOYSTICK_CONSTANTS,
        VirtualJoystick: VirtualJoystick$1,
        get VirtualJoystickEvents () { return exports.VirtualJoystickEvents; },
        baseAreaConfigDefault: baseAreaConfigDefault,
        deadZoneConfigDefault: deadZoneConfigDefault,
        getDefaultBounds: getDefaultBounds,
        isWithinBounds: isWithinBounds,
        stickConfigDefault: stickConfigDefault
    });

    // Phaser Toolkit Bundle - UMD Version
    // This file bundles all phaser-toolkit packages into a single UMD module


    // Export everything under PhaserToolkit namespace
    const PhaserToolkit = {
      PhaserHooks,
      PhaserWind,
      FontAwesome,
      Hudini,
      SoundStudio,
      VirtualJoystick
    };

    // Also export individual packages for convenience
    Object.assign(PhaserToolkit, {
      ...PhaserHooks,
      ...PhaserWind,
      ...FontAwesome,
      ...Hudini,
      ...SoundStudio,
      ...VirtualJoystick
    });

    exports.Card = Card;
    exports.CircularProgress = CircularProgress;
    exports.Color = Color;
    exports.Column = Column;
    exports.DEFAULT_MAX_INSTANCES = DEFAULT_MAX_INSTANCES;
    exports.FlatIconButton = FlatIconButton;
    exports.FontSize = FontSize;
    exports.HUDINI_KEY = HUDINI_KEY;
    exports.HudiniPlugin = HudiniPlugin;
    exports.IconButton = IconButton;
    exports.IconText = IconText;
    exports.JOYSTICK_CONSTANTS = JOYSTICK_CONSTANTS;
    exports.LinearProgress = LinearProgress;
    exports.PHASER_SOUND_STUDIO_KEY = PHASER_SOUND_STUDIO_KEY;
    exports.PHASER_WIND_KEY = PHASER_WIND_KEY;
    exports.PhaserSoundStudioPlugin = PhaserSoundStudioPlugin;
    exports.PhaserWindPlugin = PhaserWindPlugin;
    exports.RadialProgress = RadialProgress;
    exports.Radius = Radius;
    exports.Row = Row;
    exports.SceneWithHudini = SceneWithHudini;
    exports.SceneWithPhaserWind = SceneWithPhaserWind;
    exports.SectionHeader = SectionHeader;
    exports.Shadow = Shadow;
    exports.SizedBox = SizedBox;
    exports.SoundLoader = SoundLoader;
    exports.SoundPlayer = SoundPlayer;
    exports.SoundRegistry = SoundRegistry;
    exports.Spacing = Spacing;
    exports.TextButton = TextButton;
    exports.VirtualJoystick = VirtualJoystick$1;
    exports.baseAreaConfigDefault = baseAreaConfigDefault;
    exports.batchStateUpdates = batchStateUpdates;
    exports.createColor = createColor;
    exports.createFont = createFont;
    exports.createFontSize = createFontSize;
    exports.createRadius = createRadius;
    exports.createShadow = createShadow;
    exports.createSpacing = createSpacing;
    exports.createTheme = createTheme;
    exports.deadZoneConfigDefault = deadZoneConfigDefault;
    exports.default = PhaserToolkit;
    exports.defaultDarkTheme = defaultDarkTheme;
    exports.defaultLightTheme = defaultLightTheme;
    exports.defaultShadowMap = defaultShadowMap;
    exports.fontIcons = fontIcons;
    exports.fontMap = fontMap;
    exports.fontSizeMap = fontSizeMap;
    exports.getDefaultBounds = getDefaultBounds;
    exports.getHudini = getHudini;
    exports.getIconChar = getIconChar;
    exports.getIconHex = getIconHex;
    exports.getIconStyles = getIconStyles;
    exports.getPWFromScene = getPWFromScene;
    exports.getSoundStudio = getSoundStudio;
    exports.isValidColor = isValidColor;
    exports.isValidScene = isValidScene;
    exports.isWithinBounds = isWithinBounds;
    exports.loadFont = loadFont;
    exports.palette = palette;
    exports.radiusMap = radiusMap;
    exports.spacingMap = spacingMap;
    exports.stickConfigDefault = stickConfigDefault;
    exports.validators = validators;
    exports.withComputedState = withComputedState;
    exports.withDebouncedState = withDebouncedState;
    exports.withGlobalState = withGlobalState;
    exports.withLocalState = withLocalState;
    exports.withPersistentState = withPersistentState;
    exports.withStateDef = withStateDef;
    exports.withUndoableState = withUndoableState;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
