(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('phaser')) :
    typeof define === 'function' && define.amd ? define(['exports', 'phaser'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.phaserVirtualJoystick = {}, global.Phaser));
})(this, (function (exports, Phaser) { 'use strict';

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

    var Phaser__namespace = /*#__PURE__*/_interopNamespaceDefault(Phaser);

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

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    /**
     * Default configuration for the dead zone circle.
     * @constant {Object}
     */
    var deadZoneConfigDefault = {
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
    var baseAreaConfigDefault = {
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
    var stickConfigDefault = {
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
    var JOYSTICK_CONSTANTS = {
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
    var getDefaultBounds = function (scene) {
        var screenWidth = scene.scale.width;
        var screenHeight = scene.scale.height;
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
    var isWithinBounds = function (x, y, bounds) {
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
    var VirtualJoystick = /** @class */ (function (_super) {
        __extends(VirtualJoystick, _super);
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
        function VirtualJoystick(_a) {
            var scene = _a.scene, deadZone = _a.deadZone, baseArea = _a.baseArea, stick = _a.stick, stickIcon = _a.stickIcon, bounds = _a.bounds, _b = _a.enableWithoutTouch, enableWithoutTouch = _b === void 0 ? false : _b;
            var _this = _super.call(this, scene, 0, 0) || this;
            /** The ID of the current active touch (null if no touch is active) */
            _this.touchId = null;
            _this.deadZoneConfig = __assign(__assign({}, deadZoneConfigDefault), (deadZone !== null && deadZone !== void 0 ? deadZone : {}));
            _this.baseAreaConfig = __assign(__assign({}, baseAreaConfigDefault), (baseArea !== null && baseArea !== void 0 ? baseArea : {}));
            _this.stickConfig = __assign(__assign({}, stickConfigDefault), (stick !== null && stick !== void 0 ? stick : {}));
            // Set default bounds if not provided (left half of screen with 20% top padding)
            _this.bounds = bounds !== null && bounds !== void 0 ? bounds : getDefaultBounds(scene);
            if (!_this.scene.sys.game.device.input.touch && !enableWithoutTouch) {
                return _this;
            }
            _this.setScrollFactor(0);
            _this.createJoystick(stickIcon);
            _this.setupEventListeners();
            return _this;
        }
        /**
         * Creates the visual elements of the joystick (dead zone, base area, stick, and optional icon).
         *
         * @private
         * @param {Phaser.GameObjects.Text} stickIcon - Optional icon to display on the stick
         */
        VirtualJoystick.prototype.createJoystick = function (stickIcon) {
            this.analogContainer = this.scene.add.container(JOYSTICK_CONSTANTS.HIDDEN_POSITION, JOYSTICK_CONSTANTS.HIDDEN_POSITION);
            this.add(this.analogContainer);
            var _a = this, deadZoneConfig = _a.deadZoneConfig, baseAreaConfig = _a.baseAreaConfig, stickConfig = _a.stickConfig;
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
        };
        /**
         * Resets the joystick to its hidden state and clears all active touch data.
         * Only resets if the pointer matches the current active touch.
         *
         * @private
         * @param {Phaser.Input.Pointer} pointer - The pointer that triggered the reset
         */
        VirtualJoystick.prototype.resetJoystick = function (pointer) {
            var _a;
            // Only resets if it's the same touch that started the joystick
            if (this.touchId === null || this.touchId !== pointer.id || this.startPosition === null) {
                return;
            }
            this.analogContainer.setPosition(JOYSTICK_CONSTANTS.HIDDEN_POSITION, JOYSTICK_CONSTANTS.HIDDEN_POSITION);
            this.analogContainer.setAlpha(JOYSTICK_CONSTANTS.HIDDEN_ALPHA);
            this.stick.setPosition(0, 0);
            (_a = this.stickIcon) === null || _a === void 0 ? void 0 : _a.setPosition(0, 0);
            this.startPosition = null;
            this.touchId = null;
        };
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
        VirtualJoystick.prototype.on = function (event, callback) {
            if (event === 'move') {
                this.scene.events.on(exports.VirtualJoystickEvents.UPDATE, callback);
                return this;
            }
            if (event === 'release') {
                this.scene.events.on(exports.VirtualJoystickEvents.RELEASE, callback);
                return this;
            }
            if (event === 'press') {
                this.scene.events.on(exports.VirtualJoystickEvents.PRESS, callback);
                return this;
            }
            // eslint-disable-next-line no-console
            console.warn("Event ".concat(event, " not supported"));
            return this;
        };
        /**
         * Emits a move event with the current joystick position.
         *
         * @private
         * @param {number} x - Normalized x position (-1 to 1)
         * @param {number} y - Normalized y position (-1 to 1)
         */
        VirtualJoystick.prototype.emitMove = function (x, y) {
            this.scene.events.emit(exports.VirtualJoystickEvents.UPDATE, { x: x, y: y });
        };
        /**
         * Emits a release event when the joystick is released.
         *
         * @private
         */
        VirtualJoystick.prototype.emitRelease = function () {
            this.scene.events.emit(exports.VirtualJoystickEvents.RELEASE);
        };
        /**
         * Emits a press event when the joystick is first pressed.
         *
         * @private
         */
        VirtualJoystick.prototype.emitPress = function () {
            this.scene.events.emit(exports.VirtualJoystickEvents.PRESS);
        };
        /**
         * Updates the joystick position and handles automatic joystick movement.
         * Called every frame to ensure smooth joystick following behavior.
         *
         * @public
         */
        VirtualJoystick.prototype.update = function () {
            var _this = this;
            if (this.startPosition === null) {
                return;
            }
            if (!this.touchId || this.touchId !== this.scene.input.activePointer.id) {
                return;
            }
            var pointer = null;
            // Searches among active touches for the one that matches the registered touchId
            if (this.scene.input.manager.pointers) {
                pointer = this.scene.input.manager.pointers.find(function (p) { return p.id === _this.touchId; });
            }
            // If not found, fallback to activePointer (in mouse or simple touch mode)
            pointer !== null && pointer !== void 0 ? pointer : (pointer = this.scene.input.activePointer);
            var distance = new Phaser__namespace.Math.Vector2(pointer.x, pointer.y).subtract(this.startPosition);
            var maxDistance = this.baseArea.radius * JOYSTICK_CONSTANTS.MAX_DISTANCE_FACTOR;
            var currentDistance = distance.length();
            if (currentDistance > maxDistance * JOYSTICK_CONSTANTS.DISTANCE_THRESHOLD_MULTIPLIER) {
                this.moveJoystickToPointer(distance);
            }
        };
        /**
         * Moves the joystick towards the pointer when it's dragged too far from the center.
         * This provides a smooth following behavior that keeps the joystick accessible.
         *
         * @private
         * @param {Phaser.Math.Vector2} distance - The distance vector from joystick center to pointer
         */
        VirtualJoystick.prototype.moveJoystickToPointer = function (distance) {
            // Calculates the new position maintaining distance from the edge
            var padding = JOYSTICK_CONSTANTS.SCREEN_PADDING;
            if (this.startPosition === null) {
                return;
            }
            // Calculates how much to move based on the difference between current and desired position
            var newX = this.startPosition.x + (distance.x * JOYSTICK_CONSTANTS.MOVE_FACTOR);
            var newY = this.startPosition.y + (distance.y * JOYSTICK_CONSTANTS.MOVE_FACTOR);
            // Limits the new position within the defined bounds with padding
            var minX = this.bounds.topLeft.x + padding + this.baseArea.radius + this.stick.radius;
            var maxX = this.bounds.bottomRight.x - padding - this.baseArea.radius - this.stick.radius;
            var minY = this.bounds.topLeft.y + padding + this.baseArea.radius + this.stick.radius;
            var maxY = this.bounds.bottomRight.y - padding - this.baseArea.radius - this.stick.radius;
            newX = Math.max(newX, minX);
            newX = Math.min(newX, maxX);
            newY = Math.max(newY, minY);
            newY = Math.min(newY, maxY);
            // Updates positions
            this.startPosition.set(newX, newY);
            this.analogContainer.setPosition(newX, newY);
        };
        /**
         * Sets up all the input event listeners for touch/mouse interactions.
         * Handles pointer down, move, up, and cancel events.
         *
         * @private
         */
        VirtualJoystick.prototype.setupEventListeners = function () {
            this.scene.input.on('pointerdown', this.onPointerDown, this);
            this.scene.input.on('pointermove', this.onPointerMove, this);
            this.scene.input.on('pointerup', this.onPointerUp, this);
            this.scene.input.on('pointercancel', this.onPointerCancel, this);
        };
        /**
         * Handles pointer down events for joystick activation.
         *
         * @private
         * @param {Phaser.Input.Pointer} pointer - The pointer that was pressed
         */
        VirtualJoystick.prototype.onPointerDown = function (pointer) {
            var _this = this;
            var _a;
            var x = pointer.x, y = pointer.y;
            // Ignored if there is already a touch active on the joystick
            if (this.touchId !== null) {
                return;
            }
            // Check if the touch is over any interactive object (buttons)
            var objectsAtPointer = this.scene.input.hitTestPointer(pointer);
            var hasInteractiveObject = objectsAtPointer.some(function (obj) {
                var _a;
                // Check if it is a button or interactive object
                if (!((_a = obj.input) === null || _a === void 0 ? void 0 : _a.enabled)) {
                    return false;
                }
                // Ignore the own container of the joystick
                if (obj === _this || obj === _this.analogContainer) {
                    return false;
                }
                return obj.parentContainer === _this.buttonsContainer;
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
            (_a = this.stickIcon) === null || _a === void 0 ? void 0 : _a.setPosition(0, 0);
            this.startPosition = new Phaser__namespace.Math.Vector2(x, y);
            this.touchId = pointer.id;
            this.emitPress();
        };
        /**
         * Handles pointer move events for joystick movement.
         *
         * @private
         * @param {Phaser.Input.Pointer} pointer - The pointer that moved
         */
        VirtualJoystick.prototype.onPointerMove = function (pointer) {
            var _a;
            var x = pointer.x, y = pointer.y;
            if (this.startPosition === null) {
                return;
            }
            if (!this.touchId || this.touchId !== pointer.id) {
                return;
            }
            var distance = new Phaser__namespace.Math.Vector2(x, y).subtract(this.startPosition);
            var maxDistance = this.baseArea.radius * JOYSTICK_CONSTANTS.MAX_DISTANCE_FACTOR;
            var currentDistance = distance.length();
            if (currentDistance > maxDistance) {
                // Normalizes the vector and multiplies by the maximum distance
                distance.normalize().scale(maxDistance);
            }
            // Normalizes values to -1 to 1
            var normalizedX = distance.x / maxDistance;
            var normalizedY = distance.y / maxDistance;
            this.emitMove(normalizedX, normalizedY);
            this.stick.setPosition(distance.x, distance.y);
            (_a = this.stickIcon) === null || _a === void 0 ? void 0 : _a.setPosition(distance.x, distance.y);
            // If the pointer is too far, move the joystick towards the pointer
            if (currentDistance > maxDistance * JOYSTICK_CONSTANTS.DISTANCE_THRESHOLD_MULTIPLIER) {
                this.moveJoystickToPointer(distance);
            }
        };
        /**
         * Handles pointer up events for joystick release.
         *
         * @private
         * @param {Phaser.Input.Pointer} pointer - The pointer that was released
         */
        VirtualJoystick.prototype.onPointerUp = function (pointer) {
            this.emitRelease();
            this.resetJoystick(pointer);
        };
        /**
         * Handles pointer cancel events for joystick release.
         *
         * @private
         * @param {Phaser.Input.Pointer} pointer - The pointer that was cancelled
         */
        VirtualJoystick.prototype.onPointerCancel = function (pointer) {
            this.emitRelease();
            this.resetJoystick(pointer);
        };
        /**
         * Destroys the joystick and cleans up all resources.
         * Removes event listeners, clears references, and calls parent destroy method.
         *
         * @public
         */
        VirtualJoystick.prototype.destroy = function () {
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
            _super.prototype.destroy.call(this);
        };
        return VirtualJoystick;
    }(Phaser__namespace.GameObjects.Container));

    exports.JOYSTICK_CONSTANTS = JOYSTICK_CONSTANTS;
    exports.VirtualJoystick = VirtualJoystick;
    exports.baseAreaConfigDefault = baseAreaConfigDefault;
    exports.deadZoneConfigDefault = deadZoneConfigDefault;
    exports.getDefaultBounds = getDefaultBounds;
    exports.isWithinBounds = isWithinBounds;
    exports.stickConfigDefault = stickConfigDefault;

}));
