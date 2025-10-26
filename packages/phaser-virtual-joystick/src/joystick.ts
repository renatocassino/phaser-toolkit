import * as Phaser from 'phaser';
/**
 * Events emitted by the TouchpadJoystick component.
 * @enum {string}
 */
export enum VirtualJoystickEvents {
  /** Emitted when the joystick position changes */
  UPDATE = 'touchpad-joystick-update',
  /** Emitted when the user releases the joystick */
  RELEASE = 'touchpad-joystick-release',
  /** Emitted when the user presses the joystick */
  PRESS = 'touchpad-joystick-press',
}

const getEventName = (event: VirtualJoystickEvents, id: string | number): string => {
  return `${event}${id}`.replace(/[^a-zA-Z0-9]/g, '');
}

const BASE36 = 36;
const idGenerator = (): string => {
  const now = performance.now().toString(BASE36);
  const random = Math.random().toString(BASE36).substring(2);
  return `${now}${random}`.replace(/[^a-zA-Z0-9]/g, '');
}

/**
 * Configuration parameters for creating a TouchpadJoystick instance.
 * @typedef {Object} TouchpadJoystickParams
 * @property {Phaser.Scene} scene - The Phaser scene where the joystick will be created
 * @property {Object} [deadZone] - Configuration for the dead zone circle
 * @property {number} [deadZone.alpha] - Alpha transparency of the dead zone
 * @property {string} [deadZone.strokeColor] - Color of the dead zone stroke
 * @property {number} [deadZone.strokeAlpha] - Alpha transparency of the stroke
 * @property {number} [deadZone.strokeWidth] - Width of the stroke
 * @property {number} [deadZone.radius] - Radius of the dead zone
 * @property {string} [deadZone.fillColor] - Fill color of the dead zone
 * @property {Object} [baseArea] - Configuration for the base area circle
 * @property {number} [baseArea.alpha] - Alpha transparency of the base area
 * @property {string} [baseArea.strokeColor] - Color of the base area stroke
 * @property {number} [baseArea.strokeAlpha] - Alpha transparency of the stroke
 * @property {number} [baseArea.strokeWidth] - Width of the stroke
 * @property {number} [baseArea.radius] - Radius of the base area
 * @property {Object} [stick] - Configuration for the stick circle
 * @property {number} [stick.alpha] - Alpha transparency of the stick
 * @property {string} [stick.strokeColor] - Color of the stick stroke
 * @property {number} [stick.strokeAlpha] - Alpha transparency of the stroke
 * @property {number} [stick.strokeWidth] - Width of the stroke
 * @property {number} [stick.radius] - Radius of the stick
 * @property {string} [stick.fillColor] - Fill color of the stick
 * @property {Phaser.GameObjects.Text} [stickIcon] - Optional icon to display on the stick
 * @property {Object} [bounds] - Custom bounds for joystick activation area
 * @property {Object} [bounds.topLeft] - Top-left corner of the activation area
 * @property {number} [bounds.topLeft.x] - X coordinate of top-left corner
 * @property {number} [bounds.topLeft.y] - Y coordinate of top-left corner
 * @property {Object} [bounds.bottomRight] - Bottom-right corner of the activation area
 * @property {number} [bounds.bottomRight.x] - X coordinate of bottom-right corner
 * @property {number} [bounds.bottomRight.y] - Y coordinate of bottom-right corner
 */
export type VirtualJoystickParams = {
  scene: Phaser.Scene;
  deadZone?: Partial<StyleConfig>;
  baseArea?: Partial<StyleConfig>;
  stick?: Partial<StyleConfig>;
  stickIcon?: Phaser.GameObjects.Text;
  bounds?: {
    topLeft: { x: number; y: number };
    bottomRight: { x: number; y: number };
  };
  enableWithoutTouch?: boolean;
  id?: string | number;
}

import {
  JOYSTICK_CONSTANTS,
  StyleConfig,
  baseAreaConfigDefault,
  deadZoneConfigDefault,
  stickConfigDefault,
} from './config';
import { getDefaultBounds, isWithinBounds } from './helpers';

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
export class VirtualJoystick extends Phaser.GameObjects.Container {
  /** The dead zone circle that defines the center area where no input is registered */
  deadZone!: Phaser.GameObjects.Arc;

  /** The base area circle that defines the maximum joystick movement range */
  baseArea!: Phaser.GameObjects.Arc;

  /** The stick circle that follows the user's finger movement */
  stick!: Phaser.GameObjects.Arc;

  /** Optional icon displayed on the stick (e.g., directional arrows) */
  stickIcon?: Phaser.GameObjects.Text | undefined;

  /** Container that holds all joystick visual elements */
  analogContainer!: Phaser.GameObjects.Container;

  /** The initial touch position when the joystick was activated */
  startPosition!: Phaser.Math.Vector2 | null;

  /** Container for any button elements that should not interfere with joystick */
  buttonsContainer!: Phaser.GameObjects.Container;

  /** The ID of the current active touch (null if no touch is active) */
  touchId: number | null = null;

  /** Configuration for the dead zone visual appearance */
  deadZoneConfig: StyleConfig;

  /** Configuration for the base area visual appearance */
  baseAreaConfig: StyleConfig;

  /** Configuration for the stick visual appearance */
  stickConfig: StyleConfig;

  /** The bounds within which the joystick can be activated */
  bounds: {
    topLeft: { x: number; y: number };
    bottomRight: { x: number; y: number };
  };

  id: string | number;

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
  constructor({
    scene,
    deadZone,
    baseArea,
    stick,
    stickIcon,
    bounds,
    enableWithoutTouch = false,
    id,
  }: VirtualJoystickParams) {
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
  createJoystick(stickIcon?: Phaser.GameObjects.Text): void {
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
  resetJoystick(pointer: Phaser.Input.Pointer): void {
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
  override on(event: 'move' | 'release' | 'press', callback: (data: { x: number; y: number }) => void): this {
    if (event === 'move') {
      const eventName = getEventName(VirtualJoystickEvents.UPDATE, this.id);
      this.scene.events.on(eventName, callback);
      return this;
    }

    if (event === 'release') {
      const eventName = getEventName(VirtualJoystickEvents.RELEASE, this.id);
      this.scene.events.on(eventName, callback);
      return this;
    }

    if (event === 'press') {
      const eventName = getEventName(VirtualJoystickEvents.PRESS, this.id);
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
  emitMove(x: number, y: number): void {
    const eventName = getEventName(VirtualJoystickEvents.UPDATE, this.id);
    this.scene.events.emit(eventName, { x, y });
  }

  /**
   * Emits a release event when the joystick is released.
   *
   * @private
   */
  emitRelease(): void {
    const eventName = getEventName(VirtualJoystickEvents.RELEASE, this.id);
    this.scene.events.emit(eventName);
  }

  /**
   * Emits a press event when the joystick is first pressed.
   *
   * @private
   */
  emitPress(): void {
    const eventName = getEventName(VirtualJoystickEvents.PRESS, this.id);
    this.scene.events.emit(eventName);
  }

  /**
   * Updates the joystick position and handles automatic joystick movement.
   * Called every frame to ensure smooth joystick following behavior.
   *
   * @public
   */
  override update(): void {
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

    const distance = new Phaser.Math.Vector2(pointer.x, pointer.y).subtract(this.startPosition);
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
  moveJoystickToPointer(distance: Phaser.Math.Vector2): void {
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
  private setupEventListeners(): void {
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
  private onPointerDown(pointer: Phaser.Input.Pointer): void {
    const { x, y } = pointer;

    // Ignored if there is already a touch active on the joystick
    if (this.touchId !== null) {
      return;
    }

    // Check if the touch is over any interactive object (buttons)
    const objectsAtPointer = this.scene.input.hitTestPointer(pointer);
    const hasInteractiveObject = objectsAtPointer.some((obj: Phaser.GameObjects.GameObject) => {
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
    this.startPosition = new Phaser.Math.Vector2(x, y);
    this.touchId = pointer.id;

    this.emitPress();
  }

  /**
   * Handles pointer move events for joystick movement.
   *
   * @private
   * @param {Phaser.Input.Pointer} pointer - The pointer that moved
   */
  private onPointerMove(pointer: Phaser.Input.Pointer): void {
    const { x, y } = pointer;

    if (this.startPosition === null) {
      return;
    }

    if (!this.touchId || this.touchId !== pointer.id) {
      return;
    }

    const distance = new Phaser.Math.Vector2(x, y).subtract(this.startPosition);
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
  private onPointerUp(pointer: Phaser.Input.Pointer): void {
    this.emitRelease();
    this.resetJoystick(pointer);
  }

  /**
   * Handles pointer cancel events for joystick release.
   *
   * @private
   * @param {Phaser.Input.Pointer} pointer - The pointer that was cancelled
   */
  private onPointerCancel(pointer: Phaser.Input.Pointer): void {
    this.emitRelease();
    this.resetJoystick(pointer);
  }

  /**
   * Destroys the joystick and cleans up all resources.
   * Removes event listeners, clears references, and calls parent destroy method.
   *
   * @public
   */
  override destroy(): void {
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
}
