import * as Phaser from 'phaser';

import { type HookState } from './type';
import { withStateDef, type StateDefOptions } from './with-state-def';

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
export const withGlobalState = <T>(
  scene: Phaser.Scene,
  key: string,
  initialValue?: T,
  options?: StateDefOptions
): HookState<T> => {
  if (!scene) {
    throw new Error('[withGlobalState] Scene parameter is required');
  }

  // Prefix the key with scene key to ensure locality
  const globalKey = `phaser-hooks:global:${key}`;

  return withStateDef(scene, globalKey, initialValue, {
    ...options,
    persistent: false, // Local state shouldn't persist across scene changes
    global: true,
  });
};
