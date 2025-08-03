# Phaser Hooks (like "use" hooks in React)

A comprehensive state management library for Phaser games with React-like hooks pattern.

## Installation

```bash
npm install phaser-hooks
# or
pnpm add phaser-hooks
# or
yarn add phaser-hooks
```

## Why "with" instead of "use"?

While React hooks traditionally use the "use" prefix (e.g., useState, useEffect), this library intentionally uses "with" to avoid linting issues. Many linting configurations, including ESLint's built-in hooks rules, expect functions starting with "use" to be used only within React components and in .jsx/.tsx files.

Since this library is designed to work with Phaser games, which typically use plain TypeScript/JavaScript files (.ts/.js), using the "with" prefix helps avoid false positives from linters while maintaining a clear and consistent naming convention that indicates the hook-like pattern these functions follow.

This approach allows you to use these state management utilities in your Phaser games without having to modify your linting configuration or suppress warnings.

## Available Hooks

### Core Hooks

#### `withLocalState`

Scene-specific state management that gets cleaned up when the scene is destroyed.

```typescript
const playerState = withLocalState<PlayerData>(scene, 'player', {
  hp: 100,
  level: 1,
  exp: 0,
});
```

#### `withGlobalState`

Application-wide state that persists across all scenes.

```typescript
const settingsState = withGlobalState<GameSettings>('settings', {
  soundVolume: 0.8,
  musicEnabled: true,
});
```

#### `withStateDef`

Low-level state definition with custom behaviors and validation.

```typescript
const customState = withStateDef<number>(scene, 'score', {
  initialValue: 0,
  validator: value => value >= 0,
  onChange: (newValue, oldValue) => console.log('Score changed!'),
});
```

### Enhanced Hooks

#### `withPersistentState`

State with automatic localStorage persistence.

```typescript
const persistentSettings = withPersistentState<UserSettings>('settings', {
  volume: 0.8,
  difficulty: 'normal',
});
```

#### `withComputedState`

Derived state that automatically updates when source state changes.

```typescript
const healthPercentage = withComputedState(
  scene,
  'healthPercent',
  playerState,
  player => (player.hp / player.maxHp) * 100
);
```

#### `withUndoableState`

State with undo/redo functionality.

```typescript
const undoableText = withUndoableState<string>(scene, 'text', 'initial', 10);

undoableText.set('first change');
undoableText.set('second change');
undoableText.undo(); // Back to 'first change'
undoableText.redo(); // Forward to 'second change'
```

#### `withDebouncedState`

State with debounced updates to prevent rapid successive changes.

```typescript
const debouncedSearch = withDebouncedState<string>(scene, 'search', '', 300);

// These rapid calls will be debounced
debouncedSearch.set('a');
debouncedSearch.set('ab');
debouncedSearch.set('abc'); // Only this final value will be set after 300ms
```

### Utilities

#### `validators`

Pre-built validation functions for common patterns.

```typescript
import { validators } from 'phaser-hooks';

const scoreState = withGlobalState<number>('score', 0, {
  validator: validators.numberRange(0, 1000),
});

const nameState = withGlobalState<string>('name', '', {
  validator: validators.nonEmptyString,
});
```

#### `batchStateUpdates`

Utility for batching multiple state updates.

```typescript
batchStateUpdates(() => {
  playerState.set({ ...playerState.get(), hp: 90 });
  inventoryState.set([...inventoryState.get(), 'new-item']);
  scoreState.set(scoreState.get() + 100);
});
```

## Basic Usage Example

```typescript
import { withLocalState, withGlobalState } from 'phaser-hooks';

export class GameScene extends Phaser.Scene {
  create() {
    // Local state - specific to this scene
    const playerState = withLocalState<{ hp: number; mp: number }>(
      this,
      'player',
      {
        hp: 100,
        mp: 50,
      }
    );

    // Global state - persists across scenes
    const gameState = withGlobalState<{ score: number; level: number }>(
      'game',
      {
        score: 0,
        level: 1,
      }
    );

    // Listen to changes
    playerState.onChange((newPlayer, oldPlayer) => {
      console.log('Player health changed:', newPlayer.hp);
    });

    // Update state
    playerState.set({
      ...playerState.get(),
      hp: playerState.get().hp - 10,
    });
  }
}
```

## Advanced Example

```typescript
import {
  withPersistentState,
  withComputedState,
  withUndoableState,
  validators,
} from 'phaser-hooks';

export class AdvancedGameScene extends Phaser.Scene {
  create() {
    // Persistent settings
    const settings = withPersistentState<GameSettings>('settings', {
      soundVolume: 0.8,
      musicVolume: 0.6,
      difficulty: 'normal',
    });

    // Player state with validation
    const player = withLocalState<PlayerData>(
      this,
      'player',
      {
        hp: 100,
        maxHp: 100,
        level: 1,
      },
      {
        validator: validators.oneOf(['easy', 'normal', 'hard']),
      }
    );

    // Computed health percentage
    const healthPercent = withComputedState(this, 'healthPercent', player, p =>
      Math.round((p.hp / p.maxHp) * 100)
    );

    // Undoable action system
    const actionHistory = withUndoableState<string>(this, 'actions', 'start');

    // Use the states
    console.log('Health:', healthPercent.get() + '%');

    if (healthPercent.get() < 20) {
      console.log('Low health warning!');
    }
  }
}
```

### Composing Hooks

You can compose your own hooks using other with\* hooks — similar to how custom React hooks are built. This is a powerful way to isolate logic, reuse behavior, and keep your scenes clean and focused.

Example: Extracting a withPlayerEnergy hook from withPlayerState

Imagine you have a local player state like this:

```ts
interface PlayerAttributes {
  energy: number;
  stamina: number;
  strength: number;
  agility: number;
}

const playerState = withLocalState<PlayerAttributes>(scene, 'player', {
  energy: 100,
  stamina: 80,
  strength: 50,
  agility: 40,
});
```

You can now create a custom hook focused only on energy:

```ts
function withPlayerEnergy(scene: Phaser.Scene) {
  const player = withLocalState<PlayerAttributes>(scene, 'player', {
    energy: 100,
    stamina: 80,
    strength: 50,
    agility: 40,
  });

  return {
    get: () => player.get().energy,
    set: (value: number) => player.set({ ...player.get(), energy: value }),
    onChange: (fn: (energy: number) => void) =>
      player.onChange(newVal => fn(newVal.energy)),
  };
}
```

Usage in a scene

```ts
const energy = withPlayerEnergy(this);

console.log('Current energy:', energy.get());

energy.set(energy.get() - 10);

energy.onChange(newEnergy => {
  if (newEnergy <= 0) {
    console.warn('You are out of energy!');
  }
});
```

### Why use this pattern?

✅ Keeps your scene code focused on intent (e.g., energy.get()) rather than structure (player.get().energy)

✅ Allows centralized validation, side effects, or formatting for specific state slices

✅ Makes it easier to refactor or share logic across scenes and systems

You can extend this idea to compose computed hooks, persistent hooks, undoable hooks, and more — everything works with the same API.

## TypeScript Support

All hooks are fully typed and provide excellent TypeScript support:

```typescript
interface PlayerData {
  hp: number;
  maxHp: number;
  level: number;
  inventory: string[];
}

const playerState = withLocalState<PlayerData>(scene, 'player', {
  hp: 100,
  maxHp: 100,
  level: 1,
  inventory: [],
});

// TypeScript knows the exact type
const currentPlayer: PlayerData = playerState.get();
```

## License

MIT
