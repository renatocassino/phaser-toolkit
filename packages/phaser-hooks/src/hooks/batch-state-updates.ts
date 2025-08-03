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
export const batchStateUpdates = (updateFn: () => void): void => {
  // Note: This is a placeholder for potential batching optimization
  // In a more advanced implementation, you might collect all updates
  // and apply them in a single registry update
  updateFn();
};
