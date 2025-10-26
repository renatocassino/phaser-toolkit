(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('phaser'), require('lodash.merge')) :
    typeof define === 'function' && define.amd ? define(['exports', 'phaser', 'lodash.merge'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.phaserSoundStudio = {}, global.Phaser, global._.merge));
})(this, (function (exports, phaser, merge) { 'use strict';

    var DEFAULT_MAX_INSTANCES = 10;

    var SoundLoader = /** @class */ (function () {
        function SoundLoader(plugin) {
            this.plugin = plugin;
            this.plugin = plugin;
        }
        Object.defineProperty(SoundLoader.prototype, "game", {
            get: function () {
                return this.plugin.getGame();
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Loads a sound by its key into the given scene.
         * @param {Scene} scene - The Phaser scene to load the sound into.
         * @param {TSoundKey} soundKey - The key of the sound to load.
         * @returns {void}
         */
        SoundLoader.prototype.loadBySoundKey = function (scene, soundKey) {
            var _a;
            var _b = this, game = _b.game, plugin = _b.plugin;
            if (!game.cache.audio.has(soundKey)) {
                scene.load.audio(soundKey, (_a = plugin.soundList[soundKey]) === null || _a === void 0 ? void 0 : _a.path);
            }
        };
        /**
         * Loads all sounds associated with a specific channel into the given scene.
         * @param {Scene} scene - The Phaser scene to load the sounds into.
         * @param {TChannel} channel - The channel whose sounds should be loaded.
         * @returns {void}
         */
        SoundLoader.prototype.loadByChannel = function (scene, channel) {
            var _this = this;
            var plugin = this.plugin;
            Object.entries(plugin.soundList)
                .filter(function (s) { return s[1].channel === channel; })
                .forEach(function (_a) {
                var soundKey = _a[0];
                _this.loadBySoundKey(scene, soundKey);
            });
        };
        return SoundLoader;
    }());

    /**
     * SoundPlayer is responsible for playing sounds according to their channel mode.
     *
     * @template TSoundKey - The type of the sound key (defaults to string).
     * @template TChannel - The type of the channel name (defaults to string).
     */
    var SoundPlayer = /** @class */ (function () {
        /**
         * Creates an instance of SoundPlayer.
         * @param plugin - The PhaserSoundStudioPlugin instance.
         */
        function SoundPlayer(plugin) {
            this.plugin = plugin;
            this.plugin = plugin;
        }
        Object.defineProperty(SoundPlayer.prototype, "game", {
            /**
             * Returns the Phaser Game instance.
             * @returns {Game} The Phaser Game instance.
             */
            get: function () {
                return this.plugin.getGame();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SoundPlayer.prototype, "soundRegistry", {
            /**
             * Returns the SoundRegistry instance.
             * @returns {SoundRegistry<TSoundKey, TChannel>} The SoundRegistry instance.
             */
            get: function () {
                return this.plugin.soundRegistry;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Plays a sound by its key, using the appropriate channel mode.
         * @param {TSoundKey} key - The key of the sound to play.
         * @returns {void}
         */
        SoundPlayer.prototype.play = function (key) {
            var channel = this.soundRegistry.getChannelBySoundKey(key);
            var channelMode = channel.mode;
            switch (channelMode) {
                case 'single':
                    this.playSingleMode(key);
                    break;
                case 'multiple':
                    this.playMultipleMode(key, channel.maxInstances);
                    break;
            }
        };
        /**
         * Plays a sound in 'single' mode (only one instance can play at a time).
         * @param {TSoundKey} key - The key of the sound to play.
         * @returns {void}
         */
        SoundPlayer.prototype.playSingleMode = function (key) {
            var _a;
            var sound = this.soundRegistry.getSoundBySoundKey(key);
            if (sound) {
                if (!sound.isPlaying) {
                    sound.play();
                }
                return;
            }
            var soundConfig = this.soundRegistry.getSoundConfigBySoundKey(key);
            this.game.sound.add(key, {
                volume: (soundConfig === null || soundConfig === void 0 ? void 0 : soundConfig.channel) ? this.plugin.getChannelVolume(soundConfig.channel) : 1,
                loop: (_a = soundConfig === null || soundConfig === void 0 ? void 0 : soundConfig.loop) !== null && _a !== void 0 ? _a : false,
            }).play();
        };
        /**
         * Plays a sound in 'multiple' mode (multiple instances can play simultaneously, up to maxInstances).
         * @param {TSoundKey} key - The key of the sound to play.
         * @param {number} [maxInstances=DEFAULT_MAX_INSTANCES] - The maximum number of simultaneous instances allowed.
         * @returns {void}
         */
        SoundPlayer.prototype.playMultipleMode = function (key, maxInstances) {
            var _a;
            if (maxInstances === void 0) { maxInstances = DEFAULT_MAX_INSTANCES; }
            var sounds = this.soundRegistry.fetchSoundsBySoundKey(key);
            var stoppedSound = sounds.find(function (sound) { return !sound.isPlaying; });
            if (stoppedSound) {
                stoppedSound.play();
                return;
            }
            if (sounds.length < maxInstances) {
                var soundConfig = this.soundRegistry.getSoundConfigBySoundKey(key);
                this.game.sound.add(key, {
                    volume: (soundConfig === null || soundConfig === void 0 ? void 0 : soundConfig.channel) ? this.plugin.getChannelVolume(soundConfig.channel) : 1,
                    loop: (_a = soundConfig === null || soundConfig === void 0 ? void 0 : soundConfig.loop) !== null && _a !== void 0 ? _a : false,
                }).play();
            }
        };
        return SoundPlayer;
    }());

    /**
     * SoundRegistry is responsible for managing and providing access to sound and channel configurations.
     *
     * @template TSoundKey - The type of the sound key (defaults to string).
     * @template TChannel - The type of the channel name (defaults to string).
     */
    var SoundRegistry = /** @class */ (function () {
        /**
         * Creates an instance of SoundRegistry.
         * @param plugin - The PhaserSoundStudioPlugin instance.
         */
        function SoundRegistry(plugin) {
            this.plugin = plugin;
            this.plugin = plugin;
        }
        Object.defineProperty(SoundRegistry.prototype, "game", {
            /**
             * Returns the Phaser Game instance.
             * @returns {Game} The Phaser Game instance.
             */
            get: function () {
                return this.plugin.getGame();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SoundRegistry.prototype, "soundPlayer", {
            /**
             * Returns the SoundPlayer instance.
             * @returns {SoundPlayer<TSoundKey>} The SoundPlayer instance.
             */
            get: function () {
                return this.plugin.soundPlayer;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SoundRegistry.prototype, "channels", {
            /**
             * Returns the channel configuration.
             * @returns {ChannelConfig<TChannel>} The channel configuration.
             */
            get: function () {
                return this.plugin.channels;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SoundRegistry.prototype, "soundList", {
            /**
             * Returns the sound list configuration.
             * @returns {SoundListConfig<TSoundKey, TChannel>} The sound list configuration.
             */
            get: function () {
                return this.plugin.soundList;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Gets the sound configuration for a given sound key.
         * @param {TSoundKey} soundKey - The key of the sound.
         * @returns {SoundConfig<TChannel> | null} The sound configuration or null if not found.
         */
        SoundRegistry.prototype.getSoundConfigBySoundKey = function (soundKey) {
            var _a;
            return (_a = this.soundList[soundKey]) !== null && _a !== void 0 ? _a : null;
        };
        /**
         * Gets the first Phaser sound instance for a given sound key.
         * @param soundKey - The key of the sound.
         * @returns {Phaser.Sound.BaseSound | null} The first sound instance or null if not found.
         */
        SoundRegistry.prototype.getSoundBySoundKey = function (soundKey) {
            var sounds = this.fetchSoundsBySoundKey(soundKey);
            return sounds.length > 0 ? sounds[0] : null;
        };
        /**
         * Fetches all Phaser sound instances for a given sound key.
         * @param soundKey - The key of the sound.
         * @returns {Phaser.Sound.BaseSound[]} An array of sound instances.
         */
        SoundRegistry.prototype.fetchSoundsBySoundKey = function (soundKey) {
            return this.game.sound.getAll(soundKey);
        };
        /**
         * Gets the channel configuration for a given sound key.
         * @param soundKey - The key of the sound.
         * @returns {ChannelItem} The channel configuration item.
         */
        SoundRegistry.prototype.getChannelBySoundKey = function (soundKey) {
            var sound = this.soundList[soundKey];
            var channel = this.channels[sound.channel];
            return channel;
        };
        return SoundRegistry;
    }());

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

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
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
        const actualStorageKey = `phaser-hooks-state:${key}`;
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
     * The key used to register the Phaser Sound Studio plugin.
     * @type {string}
     */
    var PHASER_SOUND_STUDIO_KEY = 'soundStudio';
    /**
     * Phaser Sound Studio Plugin class that manages sound configuration and playback.
     * @template TSoundKey - The type of the sound key (defaults to string).
     * @template TChannel - The type of the channel name (defaults to string).
     * @extends Plugins.BasePlugin
     */
    var PhaserSoundStudioPlugin = /** @class */ (function (_super) {
        __extends(PhaserSoundStudioPlugin, _super);
        /**
         * Creates an instance of PhaserSoundStudioPlugin.
         * @param {Plugins.PluginManager} pluginManager - Phaser plugin manager instance.
         */
        function PhaserSoundStudioPlugin(pluginManager) {
            var _this = _super.call(this, pluginManager) || this;
            /**
             * Map of channel names to their current volume.
             * @type {Record<TChannel, number>}
             * @private
             */
            _this.channelVolumes = {};
            _this.soundList = {};
            _this.soundLoader = new SoundLoader(_this);
            _this.channels = {};
            _this.storage = 'local';
            _this.soundPlayer = new SoundPlayer(_this);
            _this.soundRegistry = new SoundRegistry(_this);
            return _this;
        }
        /**
         * The game instance.
         * @type {Game}
         * @public
         */
        PhaserSoundStudioPlugin.prototype.getGame = function () {
            return this.game;
        };
        /**
         * Initializes the plugin with configuration data.
         * @param {PhaserSoundStudioPluginData<TSoundKey, TChannel>} param0 - The plugin configuration data.
         * @returns {void}
         * @override
         */
        PhaserSoundStudioPlugin.prototype.init = function (_a) {
            var _this = this;
            var soundList = _a.soundList, channels = _a.channels, storage = _a.storage, gameName = _a.gameName;
            this.soundList = soundList;
            this.channels = channels;
            this.storage = storage;
            this.gameName = gameName;
            Object.keys(channels).forEach(function (channel) {
                _this.channelVolumes[channel] = 1.0;
            });
        };
        /**
         * Loads all sounds defined in the sound list into the given scene.
         * @param {Scene} scene - The Phaser scene to load sounds into.
         * @returns {void}
         */
        PhaserSoundStudioPlugin.prototype.loadAll = function (scene) {
            var soundsToLoad = Object.entries(this.soundList)
                .filter(function (s) { return s[1].preload !== false; });
            for (var _i = 0, soundsToLoad_1 = soundsToLoad; _i < soundsToLoad_1.length; _i++) {
                var _a = soundsToLoad_1[_i], key = _a[0], sound = _a[1];
                scene.load.audio(key, sound.path);
            }
            this.loadChannelVolumes(scene);
        };
        /**
         * Loads all sounds for a specific channel into the given scene.
         * @param {Scene} scene - The Phaser scene to load sounds into.
         * @param {TChannel} channel - The channel to load sounds for.
         * @returns {void}
         */
        PhaserSoundStudioPlugin.prototype.loadByChannel = function (scene, channel) {
            this.soundLoader.loadByChannel(scene, channel);
            this.loadChannelVolumes(scene);
        };
        /**
         * Loads a specific sound by its key into the given scene.
         * @param {Scene} scene - The Phaser scene to load the sound into.
         * @param {TSoundKey} soundKey - The key of the sound to load.
         * @returns {void}
         */
        PhaserSoundStudioPlugin.prototype.loadBySoundKey = function (scene, soundKey) {
            this.soundLoader.loadBySoundKey(scene, soundKey);
        };
        /**
         * Plays a sound by key in the given scene. If the sound is not loaded, it loads and then plays it.
         * @param {TSoundKey} key - The key of the sound to play.
         * @returns {void}
         */
        PhaserSoundStudioPlugin.prototype.play = function (key) {
            this.soundPlayer.play(key);
        };
        /**
         * Plays a sound by key only if it is not already playing.
         * @param {Scene} scene - The Phaser scene to play the sound in.
         * @param {TSoundKey} key - The key of the sound to play.
         * @returns {void}
         */
        PhaserSoundStudioPlugin.prototype.playOnce = function (scene, key) {
            var sound = scene.sound.get(key);
            if (sound === null || sound === void 0 ? void 0 : sound.isPlaying) {
                return;
            }
            this.play(key);
        };
        /**
         * Lazy loads a sound by key in the given scene.
         * @param {Scene} scene - The Phaser scene to load the sound into.
         * @param {TSoundKey} key - The key of the sound to load.
         * @returns {void}
         */
        PhaserSoundStudioPlugin.prototype.lazyLoadPlay = function (scene, key) {
            var _this = this;
            var _a;
            var path = (_a = this.soundList[key]) === null || _a === void 0 ? void 0 : _a.path;
            if (!path) {
                return;
            }
            scene.load.audio(key, path);
            scene.load.once("filecomplete-audio-".concat(key), function () {
                _this.play(key);
            });
        };
        /**
         * Sets the volume for a specific channel.
         * @param {Scene} scene - The Phaser scene context.
         * @param {TChannel} channel - The channel to set the volume for.
         * @param {number} volume - The volume to set (0.0 to 1.0).
         * @returns {void}
         */
        PhaserSoundStudioPlugin.prototype.setChannelVolume = function (scene, channel, volume) {
            if (volume < 0 || volume > 1) {
                volume = Math.max(0, Math.min(1, volume));
                // eslint-disable-next-line no-console
                console.warn("Volume must be between 0 and 1. Setting volume to ".concat(volume, " instead in channel ").concat(channel, "."));
            }
            this.channelVolumes[channel] = volume;
            Object.entries(this.soundList)
                .filter(function (s) { return s[1].channel === channel; })
                .forEach(function (_a) {
                var soundKey = _a[0];
                var soundInstance = scene.sound.get(soundKey);
                if (soundInstance && 'setVolume' in soundInstance) {
                    soundInstance.setVolume(volume);
                }
            });
            this.saveChannelVolumes(scene);
        };
        /**
         * Gets the volume for a specific channel.
         * @param {TChannel} channel - The channel to get the volume for.
         * @returns {number} The volume for the channel.
         */
        PhaserSoundStudioPlugin.prototype.getChannelVolume = function (channel) {
            var _a;
            return (_a = this.channelVolumes[channel]) !== null && _a !== void 0 ? _a : 1;
        };
        /**
         * Mutes a specific channel.
         * @param {Scene} scene - The Phaser scene context.
         * @param {TChannel} channel - The channel to mute.
         * @returns {void}
         */
        PhaserSoundStudioPlugin.prototype.muteChannel = function (scene, channel) {
            this.setChannelVolume(scene, channel, 0);
        };
        /**
         * Unmutes a specific channel.
         * @param {Scene} scene - The Phaser scene context.
         * @param {TChannel} channel - The channel to unmute.
         * @returns {void}
         */
        PhaserSoundStudioPlugin.prototype.unmuteChannel = function (scene, channel) {
            this.setChannelVolume(scene, channel, 1);
        };
        /**
         * Gets all channels.
         * @returns {ChannelConfig<TChannel>} All channels.
         */
        PhaserSoundStudioPlugin.prototype.getAllChannels = function () {
            return this.channels;
        };
        /**
         * Returns the persistent storage key for channel volumes.
         * @returns {string} The storage key for channel volumes.
         */
        PhaserSoundStudioPlugin.prototype.persistNameKey = function () {
            if (!this.gameName) {
                return 'phaser-sound-studio-volumes';
            }
            return "phaser-sound-studio-volumes:".concat(this.gameName);
        };
        /**
         * Saves the channel volumes to the storage.
         * @param {Scene} scene - The Phaser scene context.
         * @returns {void}
         * @private
         */
        PhaserSoundStudioPlugin.prototype.saveChannelVolumes = function (scene) {
            var hook = withPersistentState(scene, this.persistNameKey(), this.channelVolumes, undefined, this.storage);
            hook.set(this.channelVolumes);
        };
        /**
         * Loads the channel volumes from the storage.
         * @param {Scene} scene - The Phaser scene context.
         * @returns {void}
         * @private
         */
        PhaserSoundStudioPlugin.prototype.loadChannelVolumes = function (scene) {
            var hook = withPersistentState(scene, this.persistNameKey(), this.channelVolumes, undefined, this.storage);
            this.channelVolumes = hook.get();
        };
        return PhaserSoundStudioPlugin;
    }(phaser.Plugins.BasePlugin));

    var getSoundStudio = function (scene, mappingKey) {
        if (mappingKey === void 0) { mappingKey = PHASER_SOUND_STUDIO_KEY; }
        return scene.plugins.get(mappingKey);
    };

    exports.DEFAULT_MAX_INSTANCES = DEFAULT_MAX_INSTANCES;
    exports.PHASER_SOUND_STUDIO_KEY = PHASER_SOUND_STUDIO_KEY;
    exports.PhaserSoundStudioPlugin = PhaserSoundStudioPlugin;
    exports.SoundLoader = SoundLoader;
    exports.SoundPlayer = SoundPlayer;
    exports.SoundRegistry = SoundRegistry;
    exports.getSoundStudio = getSoundStudio;

}));
