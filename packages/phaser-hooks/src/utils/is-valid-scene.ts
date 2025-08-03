/**
 * Utility function to check if a scene is valid for state management
 * @param scene The scene to validate
 * @returns true if scene is valid, false otherwise
 */
export const isValidScene = (scene: unknown): scene is Phaser.Scene => {
  return (
    scene != null &&
    typeof scene === 'object' &&
    'registry' in scene &&
    'scene' in scene
  );
};
