export type StyleConfig = {
  alpha: number;
  strokeColor: number;
  strokeAlpha: number;
  strokeWidth: number;
  radius: number;
  fillColor: number;
}

/**
 * Default configuration for the dead zone circle.
 * @constant {Object}
 */
export const deadZoneConfigDefault: StyleConfig = {
  alpha: 0.5,
  strokeColor: 0x1D4ED8, // Blue 600 in phaser-wind
  strokeAlpha: 0.3,
  strokeWidth: 5,
  radius: 16,
  fillColor: 0x2563EB, // Blue 700 in phaser-wind
} as const;

/**
 * Default configuration for the base area circle.
 * @constant {Object}
 */
export const baseAreaConfigDefault: StyleConfig = {
  alpha: 0.05,
  strokeColor: 0x1D4ED8, // Blue 600 in phaser-wind
  strokeAlpha: 0.3,
  strokeWidth: 5,
  radius: 64,
  fillColor: 0x2563EB, // Blue 700 in phaser-wind
} as const;

/**
 * Default configuration for the stick circle.
 * @constant {Object}
 */
export const stickConfigDefault: StyleConfig = {
  alpha: 1,
  strokeColor: 0x1D4ED8, // Blue 600 in phaser-wind
  strokeAlpha: 0.4,
  strokeWidth: 5,
  radius: 40,
  fillColor: 0x1D4ED8, // Blue 600 in phaser-wind
} as const;

/**
 * Constants used throughout the TouchpadJoystick class.
 * Contains magic numbers and default values for better maintainability.
 * @constant {Object}
 */
export const JOYSTICK_CONSTANTS = {
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
} as const;
