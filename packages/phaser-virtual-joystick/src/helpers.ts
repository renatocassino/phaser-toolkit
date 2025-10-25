import { JOYSTICK_CONSTANTS } from './config';

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
export const getDefaultBounds = (scene: Phaser.Scene): { topLeft: { x: number; y: number }; bottomRight: { x: number; y: number } } => {
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
export const isWithinBounds = (x: number, y: number, bounds: { topLeft: { x: number; y: number }; bottomRight: { x: number; y: number } }): boolean => {
  return (
    x >= bounds.topLeft.x &&
    x <= bounds.bottomRight.x &&
    y >= bounds.topLeft.y &&
    y <= bounds.bottomRight.y
  );
};
