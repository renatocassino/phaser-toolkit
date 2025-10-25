/* eslint-disable max-lines-per-function */
import { JOYSTICK_CONSTANTS } from './config';
import { isWithinBounds } from './helpers';
import { VirtualJoystick } from './joystick';

/**
 * Sets up all the input event listeners for touch/mouse interactions.
 * Handles pointer down, move, up, and cancel events.
 *
 * @param {Phaser.Scene} scene - The scene to attach events to
 * @param {Object} joystick - The joystick instance
 * @param {Object} joystick.bounds - The bounds for joystick activation
 * @param {Object} joystick.analogContainer - The container for joystick elements
 * @param {Object} joystick.stickIcon - The stick icon element
 * @param {Object} joystick.startPosition - The start position vector
 * @param {Object} joystick.touchId - The current touch ID
 * @param {Function} joystick.emitPress - Function to emit press event
 * @param {Function} joystick.emitMove - Function to emit move event
 * @param {Function} joystick.emitRelease - Function to emit release event
 * @param {Function} joystick.resetJoystick - Function to reset joystick
 */
export const createJoystickEvents = (scene: Phaser.Scene, joystick: VirtualJoystick): void => {
  scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
    const { x, y } = pointer;

    // Ignored if there is already a touch active on the joystick
    if (joystick.touchId !== null) {
      return;
    }

    // Check if the touch is over any interactive object (buttons)
    const objectsAtPointer = scene.input.hitTestPointer(pointer);
    const hasInteractiveObject = objectsAtPointer.some((obj: Phaser.GameObjects.GameObject) => {
      // Check if it is a button or interactive object
      if (!obj.input?.enabled) {
        return false;
      }

      // Ignore the own container of the joystick
      if (obj === joystick || obj === joystick.analogContainer) {
        return false;
      }
      return obj.parentContainer === joystick.buttonsContainer;
    });

    // If touched on a button or interactive object, do not activate the joystick
    if (hasInteractiveObject) {
      return;
    }

    // Check if touch is within the defined bounds
    if (!isWithinBounds(x, y, joystick.bounds)) {
      return;
    }

    joystick.analogContainer.setPosition(x, y);
    joystick.analogContainer.setAlpha(JOYSTICK_CONSTANTS.VISIBLE_ALPHA);
    joystick.stickIcon?.setPosition(0, 0);
    joystick.startPosition = new Phaser.Math.Vector2(x, y);
    joystick.touchId = pointer.id;

    joystick.emitPress();
  });

  scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
    const { x, y } = pointer;

    if (joystick.startPosition === null) {
      return;
    }

    if (!joystick.touchId || joystick.touchId !== pointer.id) {
      return;
    }

    const distance = new Phaser.Math.Vector2(x, y).subtract(joystick.startPosition);
    const maxDistance = joystick.baseArea.radius * JOYSTICK_CONSTANTS.MAX_DISTANCE_FACTOR;
    const currentDistance = distance.length();

    if (currentDistance > maxDistance) {
      // Normalizes the vector and multiplies by the maximum distance
      distance.normalize().scale(maxDistance);
    }

    // Normalizes values to -1 to 1
    const normalizedX = distance.x / maxDistance;
    const normalizedY = distance.y / maxDistance;

    joystick.emitMove(normalizedX, normalizedY);

    joystick.stick.setPosition(distance.x, distance.y);
    joystick.stickIcon?.setPosition(distance.x, distance.y);

    // If the pointer is too far, move the joystick towards the pointer
    if (currentDistance > maxDistance * JOYSTICK_CONSTANTS.DISTANCE_THRESHOLD_MULTIPLIER) {
      joystick.moveJoystickToPointer(distance);
    }
  });

  scene.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
    joystick.emitRelease();
    joystick.resetJoystick(pointer);
  });

  // Event for when touch is cancelled (e.g., dragging outside the screen)
  scene.input.on('pointercancel', (pointer: Phaser.Input.Pointer) => {
    joystick.emitRelease();
    joystick.resetJoystick(pointer);
  });
}
