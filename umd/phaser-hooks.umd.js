(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('lodash.merge')) :
    typeof define === 'function' && define.amd ? define(['exports', 'lodash.merge'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.phaserHooks = {}, global._.merge));
})(this, (function (exports, merge) { 'use strict';

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
    var batchStateUpdates = function (updateFn) {
        // Note: This is a placeholder for potential batching optimization
        // In a more advanced implementation, you might collect all updates
        // and apply them in a single registry update
        updateFn();
    };

    /**
     * Creates a state validator function for common patterns
     */
    var validators = {
        /**
         * Validates that a number is within a range
         */
        numberRange: function (min, max) {
            return function (value) {
                var num = value;
                if (typeof num !== 'number' || Number.isNaN(num)) {
                    return 'Value must be a number';
                }
                if (num < min || num > max) {
                    return "Value must be between ".concat(min, " and ").concat(max);
                }
                return true;
            };
        },
        /**
         * Validates that a string is not empty
         */
        nonEmptyString: function (value) {
            var str = value;
            if (typeof str !== 'string' || str.trim().length === 0) {
                return 'Value must be a non-empty string';
            }
            return true;
        },
        /**
         * Validates that an array has a specific length range
         */
        arrayLength: function (min, max) {
            return function (value) {
                var arr = value;
                if (!Array.isArray(arr)) {
                    return 'Value must be an array';
                }
                if (arr.length < min) {
                    return "Array must have at least ".concat(min, " items");
                }
                if (max !== undefined && arr.length > max) {
                    return "Array must have at most ".concat(max, " items");
                }
                return true;
            };
        },
        /**
         * Validates that a value is one of the allowed options
         */
        oneOf: function (allowedValues) {
            return function (value) {
                if (!allowedValues.includes(value)) {
                    return "Value must be one of: ".concat(allowedValues.join(', '));
                }
                return true;
            };
        },
    };

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise, SuppressedError, Symbol, Iterator */


    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    }

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
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
    var formatDateTime = function () {
        var now = new Date();
        return now.toISOString().replace('T', ' ').replace('Z', '');
    };
    /**
     * Creates a searchable prefix for phaser-hooks logs with colors
     */
    var createLogPrefix = function (operation) {
        var timestamp = formatDateTime();
        var libName = '%c[phaser-hooks]%c'; // Blue color for library name
        var operationStr = operation ? " %c".concat(operation, "%c") : '';
        return "%c[".concat(timestamp, "]%c ").concat(libName).concat(operationStr);
    };
    /**
     * Creates CSS styles for the colored prefix
     */
    var createLogStyles = function (operation) {
        var styles = [
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
    var logStateInit = function (key, initialValue) {
        var prefix = createLogPrefix('STATE_INIT');
        var styles = createLogStyles('STATE_INIT');
        console.groupCollapsed.apply(console, __spreadArray(["".concat(prefix, " Initializing state \"").concat(key, "\"")], styles, false));
        console.log('🔧 Key:', key);
        console.log('📦 Initial Value:', initialValue);
        console.log('⏰ Timestamp:', formatDateTime());
        console.groupEnd();
    };
    /**
     * Log state value retrieval
     */
    var logStateGet = function (key, value) {
        var prefix = createLogPrefix('STATE_GET');
        var styles = createLogStyles('STATE_GET');
        console.log.apply(console, __spreadArray(__spreadArray(["".concat(prefix, " Getting state \"").concat(key, "\":")], styles, false), [value], false));
    };
    /**
     * Log state value update
     */
    var logStateSet = function (key, oldValue, newValue) {
        var prefix = createLogPrefix('STATE_SET');
        var styles = createLogStyles('STATE_SET');
        console.groupCollapsed.apply(console, __spreadArray(["".concat(prefix, " Updating state \"").concat(key, "\"")], styles, false));
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
    var logEventListenerAdd = function (key, event, callback) {
        var prefix = createLogPrefix('EVENT_ADD');
        var styles = createLogStyles('EVENT_ADD');
        console.groupCollapsed.apply(console, __spreadArray(["".concat(prefix, " Adding listener for \"").concat(key, "\"")], styles, false));
        console.log('🔑 Key:', key);
        console.log('📡 Event:', event);
        console.log('🎯 Callback:', callback.name || 'anonymous');
        console.log('⏰ Timestamp:', formatDateTime());
        console.groupEnd();
    };
    /**
     * Log event listener removal
     */
    var logEventListenerRemove = function (key, event, callback) {
        var prefix = createLogPrefix('EVENT_REMOVE');
        var styles = createLogStyles('EVENT_REMOVE');
        console.groupCollapsed.apply(console, __spreadArray(["".concat(prefix, " Removing listener for \"").concat(key, "\"")], styles, false));
        console.log('🔑 Key:', key);
        console.log('📡 Event:', event);
        console.log('🎯 Callback:', callback.name || 'anonymous');
        console.log('⏰ Timestamp:', formatDateTime());
        console.groupEnd();
    };
    /**
     * Log clearing all listeners
     */
    var logClearListeners = function (key) {
        var prefix = createLogPrefix('CLEAR_LISTENERS');
        var styles = createLogStyles('CLEAR_LISTENERS');
        console.groupCollapsed.apply(console, __spreadArray(["".concat(prefix, " Clearing all listeners for \"").concat(key, "\"")], styles, false));
        console.log('🔑 Key:', key);
        console.log('🧹 Action:', 'Removing all event listeners');
        console.log('⏰ Timestamp:', formatDateTime());
        console.groupEnd();
    };
    /**
     * Log error with context
     */
    var logError = function (operation, error, context) {
        var prefix = createLogPrefix(operation);
        var styles = createLogStyles(operation);
        console.groupCollapsed.apply(console, __spreadArray(["".concat(prefix, " ERROR")], styles, false));
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
    var logWarning = function (operation, message, context) {
        var prefix = createLogPrefix(operation);
        var styles = createLogStyles(operation);
        console.groupCollapsed.apply(console, __spreadArray(["".concat(prefix, " WARNING")], styles, false));
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
    var get = function (registry, key, debug) {
        var value = registry.get(key);
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
    var set = function (registry, key, value, debug, validator) {
        var currentValue = registry.get(key);
        // If value is a function, execute it with current state
        var newValue = typeof value === 'function' ? value(currentValue) : value;
        if (validator) {
            var validationResult = validator(newValue);
            if (validationResult !== true) {
                var message = typeof validationResult === 'string'
                    ? validationResult
                    : "Invalid value for key \"".concat(key, "\"");
                throw new Error("[withStateDef] ".concat(message));
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
    var patch = function (registry, key, value, debug, validator) {
        var currentValue = registry.get(key);
        if (typeof currentValue !== 'object' || currentValue === null) {
            throw new Error('[withStateDef] Current value is not an object');
        }
        // If value is a function, execute it with current state to get the patch
        var patchValue = typeof value === 'function' ? value(currentValue) : value;
        var newValue = merge({}, currentValue, patchValue);
        if (validator) {
            var validationResult = validator(newValue);
            if (validationResult !== true) {
                var message = typeof validationResult === 'string'
                    ? validationResult
                    : "Invalid value for key \"".concat(key, "\"");
                throw new Error("[withStateDef] ".concat(message));
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
    var onChange = function (registry, key, debug, callback) {
        logWarning('DEPRECATED_ONCHANGE', "onChange callback is deprecated in phaser-hooks. Use .on('change', callback) or .once('change', callback) instead.", { key: key });
        if (!callback || typeof callback !== 'function') {
            throw new Error('[withStateDef] onChange callback must be a function');
        }
        registry.events.on("changedata-".concat(key), // reserved word in Phaser
        function (_parent, key, value, previousValue) {
            if (debug) {
                logStateSet(key, previousValue, value);
            }
            try {
                callback(value, previousValue);
            }
            catch (error) {
                logError('ONCHANGE_CALLBACK_ERROR', error, { key: key });
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
    var on = function (registry, event, key, debug, callback) {
        if (event !== 'change') {
            throw new Error('[withStateDef] Invalid event. Only "change" is supported.');
        }
        if (debug) {
            logEventListenerAdd(key, event, callback);
        }
        registry.events.on("changedata-".concat(key), callback);
        return function () {
            if (debug) {
                logEventListenerRemove(key, event, callback);
            }
            registry.events.off("changedata-".concat(key), callback);
        };
    };
    /**
     * Validates the scene and options for the state hook.
     * @param {Phaser.Scene} scene - The Phaser scene
     * @param {StateDefOptions} options - State definition options
     * @throws {Error} If scene or registry/data is not available
     */
    var validateHook = function (scene, options, key) {
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
    var initializeState = function (registry, key, debug, validator, initialValue) {
        // Validate and set initial value if provided
        if (!registry.has(key) && initialValue !== undefined) {
            if (validator) {
                var validationResult = validator(initialValue);
                if (validationResult !== true) {
                    var message = typeof validationResult === 'string'
                        ? validationResult
                        : "Invalid initial value for key \"".concat(key, "\"");
                    throw new Error("[withStateDef] ".concat(message));
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
    var once = function (registry, event, key, debug, callback) {
        if (event !== 'change') {
            throw new Error('[withStateDef] Invalid event. Only "change" is supported.');
        }
        if (debug) {
            logEventListenerAdd(key, event, callback);
        }
        registry.events.once("changedata-".concat(key), callback);
        return function () {
            if (debug) {
                logEventListenerRemove(key, event, callback);
            }
            registry.events.off("changedata-".concat(key), callback);
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
    var off = function (registry, event, key, debug, callback) {
        if (event !== 'change') {
            throw new Error('[withStateDef] Invalid event. Only "change" is supported.');
        }
        registry.events.off("changedata-".concat(key), callback);
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
    var clearListeners = function (registry, key, debug) {
        registry.events.removeAllListeners("changedata-".concat(key));
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
    var withStateDef = function (scene, key, initialValue, options) {
        if (options === void 0) { options = {}; }
        validateHook(scene, options, key);
        var validator = options.validator, _a = options.debug, debug = _a === void 0 ? false : _a, _b = options.global, global = _b === void 0 ? false : _b;
        var registry = global ? scene.registry : scene.data;
        // Fix: move debug and validator before initialValue to match required params before optional
        initializeState(registry, key, debug, validator, initialValue);
        return {
            /**
             * Gets the current state value.
             * @returns {T}
             */
            get: function () { return get(registry, key, debug); },
            /**
             * Sets a new state value and triggers change listeners.
             * @param {T | ((currentState: T) => T)} value - The new value to set or a function that receives current state and returns new state
             */
            set: function (value) { return set(registry, key, value, debug, validator); },
            /**
             * Patches the current state value with a new value.
             * @param {DeepPartial<T> | StatePatchUpdater<T>} value - The new value to patch or a function that receives current state and returns new state
             */
            patch: function (value) { return patch(registry, key, value, debug, validator); },
            /**
             * Registers a callback to be called whenever the state changes (DEPRECATED).
             * @param {StateChangeCallback<T>} callback
             */
            onChange: function (callback) {
                return onChange(registry, key, debug, callback);
            },
            /**
             * Registers a callback to be called whenever the state changes.
             * Only the 'change' event is supported.
             * @param {'change'} event
             * @param {Function} fn
             * @returns {() => void} Unsubscribe function
             */
            on: function (event, fn) {
                return on(registry, event, key, debug, fn);
            },
            /**
             * Registers a callback to be called once when the state changes.
             * Only the 'change' event is supported.
             * @param {'change'} event
             * @param {Function} fn
             * @returns {() => void} Unsubscribe function
             */
            once: function (event, fn) {
                return once(registry, event, key, debug, fn);
            },
            /**
             * Removes an event listener for the state.
             * Only the 'change' event is supported.
             * @param {'change'} event
             * @param {Function} fn
             */
            off: function (event, fn) {
                return off(registry, event, key, debug, fn);
            },
            /**
             * Removes all event listeners for this state.
             */
            clearListeners: function () { return clearListeners(registry, key, debug); },
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
    var withLocalState = function (scene, key, initialValue, options) {
        var _a;
        if (!scene) {
            throw new Error('[withLocalState] Scene parameter is required');
        }
        // Prefix the key with scene key to ensure locality
        var sceneKey = ((_a = scene.scene) === null || _a === void 0 ? void 0 : _a.key) || 'unknown-scene';
        var localKey = "phaser-hooks:local:".concat(sceneKey, ":").concat(key);
        return withStateDef(scene, localKey, initialValue, __assign(__assign({}, options), { persistent: false, global: false }));
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
    var withComputedState = function (scene, key, sourceState, selector) {
        // Initialize with computed value
        var initialValue = selector(sourceState.get());
        var computedState = withLocalState(scene, key, initialValue);
        // Update computed state when source changes
        sourceState.on('change', function () {
            var newSourceValue = sourceState.get();
            var newComputedValue = selector(newSourceValue);
            computedState.set(newComputedValue);
        });
        return __assign(__assign({}, computedState), { set: function () {
                throw new Error("[withComputedState] Cannot directly set computed state \"".concat(key, "\". Update the source state instead."));
            } });
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
    var withDebouncedState = function (scene, key, initialValue, debounceMs) {
        var actualState = withLocalState(scene, key, initialValue);
        var timeoutId = null;
        var debouncedSet = function (value) {
            var newValue = typeof value === 'function' ? value(actualState.get()) : value;
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(function () {
                actualState.set(newValue);
                timeoutId = null;
            }, debounceMs);
        };
        var debouncedPatch = function (value) {
            var patchValue = typeof value === 'function' ? value(actualState.get()) : value;
            debouncedSet(function (currentState) { return merge({}, currentState, patchValue); });
        };
        return __assign(__assign({}, actualState), { set: debouncedSet, patch: debouncedPatch });
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
    var withGlobalState = function (scene, key, initialValue, options) {
        if (!scene) {
            throw new Error('[withGlobalState] Scene parameter is required');
        }
        // Prefix the key with scene key to ensure locality
        var localKey = "phaser-hooks:global:".concat(key);
        return withStateDef(scene, localKey, initialValue, __assign(__assign({}, options), { persistent: false, global: true }));
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
    var withPersistentState = function (scene, key, initialValue, storageKey, storageType) {
        if (storageType === void 0) { storageType = 'local'; }
        var actualStorageKey = storageKey !== null && storageKey !== void 0 ? storageKey : "phaser-hooks-state:".concat(key);
        // Load from localStorage if available
        var storedValue = initialValue;
        try {
            var stored = storageType === 'local' ? localStorage.getItem(actualStorageKey) : sessionStorage.getItem(actualStorageKey);
            if (stored) {
                storedValue = JSON.parse(stored);
            }
        }
        catch (error) {
            // eslint-disable-next-line no-console
            console.warn("[withPersistentState] Failed to load stored state for \"".concat(key, "\":"), error);
        }
        // @ts-ignore
        var state = withGlobalState(scene, key, storedValue);
        // Save to localStorage on changes
        state.onChange(function (newValue) {
            try {
                var storage = storageType === 'local' ? localStorage : sessionStorage;
                storage.setItem(actualStorageKey, JSON.stringify(newValue));
            }
            catch (error) {
                // eslint-disable-next-line no-console
                console.warn("[withPersistentState] Failed to save state for \"".concat(key, "\":"), error);
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
    var withUndoableState = function (scene, key, initialValue, maxHistorySize) {
        var currentState = withLocalState(scene, key, initialValue);
        var historyState = withLocalState(scene, "".concat(key, ":history"), [
            initialValue,
        ]);
        var historyIndexState = withLocalState(scene, "".concat(key, ":historyIndex"), 0);
        var addToHistory = function (value) {
            var history = historyState.get();
            var currentIndex = historyIndexState.get();
            // Remove any "future" history if we're not at the end
            var newHistory = history.slice(0, currentIndex + 1);
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
        var set = function (value) {
            var newValue = typeof value === 'function' ? value(currentState.get()) : value;
            addToHistory(newValue);
            currentState.set(newValue);
        };
        var undo = function () {
            var currentIndex = historyIndexState.get();
            if (currentIndex > 0) {
                var newIndex = currentIndex - 1;
                historyIndexState.set(newIndex);
                var history_1 = historyState.get();
                var previousValue = history_1[newIndex];
                if (previousValue !== undefined) {
                    currentState.set(previousValue);
                    return true;
                }
            }
            return false;
        };
        var redo = function () {
            var currentIndex = historyIndexState.get();
            var history = historyState.get();
            if (currentIndex < history.length - 1) {
                var newIndex = currentIndex + 1;
                historyIndexState.set(newIndex);
                var nextValue = history[newIndex];
                if (nextValue !== undefined) {
                    currentState.set(nextValue);
                    return true;
                }
            }
            return false;
        };
        var canUndo = function () { return historyIndexState.get() > 0; };
        var canRedo = function () {
            return historyIndexState.get() < historyState.get().length - 1;
        };
        var clearHistory = function () {
            var current = currentState.get();
            historyState.set([current]);
            historyIndexState.set(0);
        };
        return __assign(__assign({}, currentState), { set: function (value) {
                var newValue = typeof value === 'function' ? value(currentState.get()) : value;
                set(newValue);
            }, patch: function (value) {
                var patchValue = typeof value === 'function' ? value(currentState.get()) : value;
                set(function (currentValue) { return merge({}, currentValue, patchValue); });
            }, undo: undo, redo: redo, canUndo: canUndo, canRedo: canRedo, clearHistory: clearHistory });
    };

    /**
     * Utility function to check if a scene is valid for state management
     * @param scene The scene to validate
     * @returns true if scene is valid, false otherwise
     */
    var isValidScene = function (scene) {
        return (scene != null &&
            typeof scene === 'object' &&
            'registry' in scene &&
            'scene' in scene);
    };

    exports.batchStateUpdates = batchStateUpdates;
    exports.isValidScene = isValidScene;
    exports.validators = validators;
    exports.withComputedState = withComputedState;
    exports.withDebouncedState = withDebouncedState;
    exports.withGlobalState = withGlobalState;
    exports.withLocalState = withLocalState;
    exports.withPersistentState = withPersistentState;
    exports.withStateDef = withStateDef;
    exports.withUndoableState = withUndoableState;

}));
