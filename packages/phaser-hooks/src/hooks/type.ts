/**
 * Callback function type for state changes
 * @template T The type of the state value
 * @param newValue The new state value after the change
 * @param oldValue The previous state value before the change
 */
export type StateChangeCallback<T> = (newValue: T, oldValue: T) => void;

/**
 * Utility type for state selectors
 * @template T The input state type
 * @template U The computed result type
 */
export type StateSelector<T, U> = (state: T) => U;

/**
 * Utility type for state updaters
 * @template T The state type
 */
export type StateUpdater<T> = (currentState: T) => T;

/**
 * Core interface for all state management hooks in Phaser games.
 * Provides a React-like state management API with get/set/onChange functionality.
 *
 * @template T The type of the state value being managed
 *
 * @example
 * ```typescript
 * // Basic usage
 * const scoreState: HookState<number> = withLocalState(scene, 'score', 0);
 *
 * // Getting current value
 * const currentScore = scoreState.get();
 *
 * // Setting new value directly
 * scoreState.set(100);
 *
 * // Setting based on current value
 * scoreState.set(current => current + 10); // Adds 10 to current score
 *
 * // Partial update (for object states)
 * const playerState: HookState<{name: string, score: number}> = withLocalState(scene, 'player', {name: 'Player', score: 0});
 * playerState.patch({ score: 100 }); // Only updates score, keeps name
 *
 * // Listening to changes with on (receives all Phaser event params)
 * scoreState.on('change', (parent, key, newScore, oldScore) => {
 *   console.log(`Score changed from ${oldScore} to ${newScore}`);
 * });
 *
 * // Or use onChange (deprecated, but simpler signature)
 * scoreState.onChange((newScore, oldScore) => {
 *   console.log(`Score changed from ${oldScore} to ${newScore}`);
 * });
 * ```
 */
export type HookState<T> = {
  /**
   * Gets the current state value
   * @returns The current state value
   */
  get: () => T;

  /**
   * Sets a new state value and triggers change listeners
   * @param value The new value to set, or a function that receives the current value and returns the new value
   */
  set: (value: T | StateUpdater<T>) => void;

  /**
   * Partially updates the state (only works when T is an object)
   * @param partial Partial object to merge with current state
   * @throws {Error} If the current state is not an object
   */
  patch: (partial: Partial<T>) => void;

  /**
   * Registers a callback to be called whenever the state changes
   * @param callback Function to call when state changes
   */
  onChange: (callback: StateChangeCallback<T>) => void;

  /**
   * Registers a callback to be called whenever the state changes
   * @param callback Function to call when state changes. Receives: parent, key, newValue, oldValue
   */
  on: (event: 'change', callback: (parent: unknown, key: string, newValue: T, oldValue: T) => void) => () => void;

  /**
   * Registers a callback to be called whenever the state changes
   * @param callback Function to call when state changes. Receives: parent, key, newValue, oldValue
   */
  once: (event: 'change', callback: (parent: unknown, key: string, newValue: T, oldValue: T) => void) => () => void;

  /**
   * Removes an event listener
   * @param event The event to remove
   * @param callback The callback to remove
   */
  off: (event: 'change', callback: (parent: unknown, key: string, newValue: T, oldValue: T) => void) => void;

  /**
   * Removes all event listeners for this state
   */
  clearListeners: () => void;
};
