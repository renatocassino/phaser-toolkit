import { type HookState, type StateUpdater } from './type';
import { withLocalState } from './with-local-state';

/**
 * Enhanced HookState interface with undo/redo capabilities
 */
export type UndoableHookState<T> = {
  undo(): boolean;
  redo(): boolean;
  canUndo(): boolean;
  canRedo(): boolean;
  clearHistory(): void;
} & HookState<T>;

/**
 * Creates a state hook with undo/redo functionality
 * @template T The type of the state value
 * @param scene The Phaser scene instance
 * @param key Unique identifier for the state
 * @param initialValue Initial value for the state
 * @param maxHistorySize Maximum number of history entries to keep
 * @returns Enhanced HookState with undo/redo capabilities
 *
 * @example
 * ```typescript
 * const undoableState = withUndoableState<string>(scene, 'text', 'initial', 10);
 *
 * undoableState.set('first change');
 * undoableState.set('second change');
 * undoableState.undo(); // Back to 'first change'
 * undoableState.redo(); // Forward to 'second change'
 * ```
 */
/* eslint-disable max-lines-per-function */
/* eslint-disable complexity */
/* eslint-disable sonarjs/cognitive-complexity */
export const withUndoableState = <T>(
  scene: Phaser.Scene,
  key: string,
  initialValue: T,
  maxHistorySize: number
): UndoableHookState<T> => {
  const currentState = withLocalState<T>(scene, key, initialValue);
  const historyState = withLocalState<T[]>(scene, `${key}:history`, [
    initialValue,
  ]);
  const historyIndexState = withLocalState<number>(
    scene,
    `${key}:historyIndex`,
    0
  );

  const addToHistory = (value: T): void => {
    const history = historyState.get();
    const currentIndex = historyIndexState.get();

    // Remove any "future" history if we're not at the end
    const newHistory = history.slice(0, currentIndex + 1);

    // Add new value
    newHistory.push(value);

    // Limit history size
    if (newHistory.length > maxHistorySize) {
      newHistory.shift();
    } else {
      historyIndexState.set(currentIndex + 1);
    }

    historyState.set(newHistory);
  };

  const set = (value: T | StateUpdater<T>): void => {
    const resolvedValue = typeof value === 'function' 
      ? (value as StateUpdater<T>)(currentState.get()) 
      : value;
    addToHistory(resolvedValue);
    currentState.set(resolvedValue);
  };

  const undo = (): boolean => {
    const currentIndex = historyIndexState.get();
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      historyIndexState.set(newIndex);
      const history = historyState.get();
      const previousValue = history[newIndex];
      if (previousValue !== undefined) {
        currentState.set(previousValue);
        return true;
      }
    }
    return false;
  };

  const redo = (): boolean => {
    const currentIndex = historyIndexState.get();
    const history = historyState.get();
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1;
      historyIndexState.set(newIndex);
      const nextValue = history[newIndex];
      if (nextValue !== undefined) {
        currentState.set(nextValue);
        return true;
      }
    }
    return false;
  };

  const canUndo = (): boolean => historyIndexState.get() > 0;
  const canRedo = (): boolean =>
    historyIndexState.get() < historyState.get().length - 1;

  const clearHistory = (): void => {
    const current = currentState.get();
    historyState.set([current]);
    historyIndexState.set(0);
  };

  return {
    ...currentState,
    set,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory,
  };
};
