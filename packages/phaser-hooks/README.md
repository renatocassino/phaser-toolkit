<p align="center">
  <img src="data/image.png" alt="logo" style="max-width: 300px">
</p>

[![NPM Version](https://img.shields.io/npm/v/phaser-wind)](https://www.npmjs.com/package/phaser-wind)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

# Phaser Hooks (like "use" hooks in React)

A comprehensive state management library for Phaser games with React-like hooks pattern.

## Why phaser-hooks?

Phaser already gives you two ways of storing state:

- `registry` → global state across the game
- `data` → local state inside a scene or game object

They work, but the API is a bit… verbose:

```ts
// Using registry (global)
this.game.registry.set('volume', 0.5); // too boring
const volume = this.game.registry.get('volume');
this.game.registry.events.on('changedata-volume', (game, value) => {
  console.log('Volume changed to', value);
});

// Using scene.data (local)
this.data.set('score', 42); // too boring too
const score = this.data.get('score');

const onChangeFn = (scene, value) => {
  console.log('Score updated to', value);
};
this.data.events.on('changedata-score', onChangeFn); // If you pass an anonymous function, you cannot unsubscribe :(

// when move to another scene, you must unsubscribe. Boring and easy to forget
this.data.events.off('changeset-score', onChangeFn);
```

With _phaser-hooks_, you get a simple, React-like API:

```ts
// Global state
const volume = withGlobalState(scene, 'volume', 0.5); // woow! awesome
volume.get(); // 0.5
volume.set(0.8); // updates value

const unsubscribe = volume.on('change', v =>
  console.log('Volume changed →', v)
); // Nice callback in event <3 - Return the easy unsubscribe function

// when move to another scene, just call :)
unsubscribe();

// Persisted state (localStorage / sessionStorage)
const score = withPersistState(scene, 'score', 0, { storage: 'local' }); // Wow! Saving in localStorage
score.set(100); // Update localStorage!! Wow! I love this lib <3
```

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

## Hook API Reference

All hooks return a `HookState` object with the following methods:

| Method                     | Description                                          | Parameters                                | Returns                             |
| -------------------------- | ---------------------------------------------------- | ----------------------------------------- | ----------------------------------- |
| `get()`                    | Gets the current state value                         | None                                      | `T` - Current state value           |
| `set(value)`               | Sets a new state value and triggers change listeners | `value: T` - New value to set             | `void`                              |
| `on('change', callback)`   | Registers a callback for state changes               | `event: 'change'`, `callback: () => void` | `() => void` - Unsubscribe function |
| `once('change', callback)` | Registers a callback that fires only once            | `event: 'change'`, `callback: () => void` | `() => void` - Unsubscribe function |
| `off('change', callback)`  | Removes an event listener                            | `event: 'change'`, `callback: () => void` | `void`                              |
| `clearListeners()`          | Removes all event listeners for this state           | None                                      | `void`                              |

### Special Hook Methods

Some hooks have additional methods beyond the standard `HookState` interface:

#### `withUndoableState` Additional Methods:

| Method           | Description                   | Parameters | Returns                    |
| ---------------- | ----------------------------- | ---------- | -------------------------- |
| `undo()`         | Reverts to the previous state | None       | `boolean` - Success status |
| `redo()`         | Advances to the next state    | None       | `boolean` - Success status |
| `canUndo()`      | Checks if undo is available   | None       | `boolean`                  |
| `canRedo()`      | Checks if redo is available   | None       | `boolean`                  |
| `clearHistory()` | Clears the undo/redo history  | None       | `void`                     |

## Available Hooks

### Core Hooks

#### `withLocalState`

Scene-specific state management that gets cleaned up when the scene is destroyed.

```typescript
type PlayerData = {
  hp: number;
  level: number;
  exp: number;
};

const playerState = withLocalState<PlayerData>(scene, 'player', {
  hp: 100,
  level: 1,
  exp: 0,
});
```

#### `withGlobalState`

Application-wide state that persists across all scenes.

```typescript
type GameSettings = {
  soundVolume: number;
  musicEnabled: true;
};

const settingsState = withGlobalState<GameSettings>(scene, 'settings', {
  soundVolume: 0.8,
  musicEnabled: true,
});
```

### Enhanced Hooks

#### `withPersistentState`

State with automatic localStorage persistence.

```typescript
type UserSettings = {
  volume: number;
  difficulty: 'easy' | 'normal' | 'hard';
};

const persistentSettings = withPersistentState<UserSettings>(
  'settings',
  {
    volume: 0.8,
    difficulty: 'normal',
  },
  'local' // If you want only in sessionStorage, you can set 'session'
);
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

// Number range validation (0-1000)
const scoreState = withGlobalState<number>(scene, 'score', 0, {
  validator: validators.numberRange(0, 1000),
});

// Non-empty string validation
const nameState = withGlobalState<string>(scene, 'name', '', {
  validator: validators.nonEmptyString,
});

// Array length validation (2-4 items)
const inventoryState = withLocalState<string[]>(scene, 'inventory', [], {
  validator: validators.arrayLength(2, 4),
});

// One of allowed values validation
const difficultyState = withGlobalState<'easy' | 'normal' | 'hard'>(
  scene,
  'difficulty',
  'normal',
  {
    validator: validators.oneOf(['easy', 'normal', 'hard']),
  }
);

// Custom validator example
const healthState = withLocalState<number>(scene, 'health', 100, {
  validator: value => {
    const health = value as number;
    if (health < 0) return 'Health cannot be negative';
    if (health > 100) return 'Health cannot exceed 100';
    return true; // Valid
  },
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
    const ubsubscribe = playerState.on('change', (newPlayer, oldPlayer) => {
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
    ...player,
  };
}
```

Usage in a scene

```ts
const energy = withPlayerEnergy(this);

console.log('Current energy:', energy.get());

energy.set(energy.get() - 10);

energy.on('change', () => {
  if (energy.get() <= 0) {
    console.warn('You are out of energy!');
  }
});
```

## Unsubscribe Events

When you subscribe to state changes using `.on('change', callback)`, it's crucial to properly unsubscribe to prevent memory leaks and unexpected behavior. Phaser Hooks provides two ways for unsubscribing from events.

### Method 1: Using the Return Value from `.on('change')`

The `.on('change', callback)` method returns an unsubscribe function that you can call to remove the listener:

```typescript
export class GameScene extends Phaser.Scene {
  create() {
    const playerState = withLocalState<{ hp: number }>(this, 'player', {
      hp: 100,
    });

    // Subscribe to changes and get unsubscribe function
    const unsubscribe = playerState.on('change', (newPlayer, oldPlayer) => {
      console.log('Player health changed:', newPlayer.hp);
    });

    this.add
      .text(centerX, centerY, 'Go to another scene')
      .setInteractive()
      .on('pointerdown', () => {
        // Later, unsubscribe when needed
        unsubscribe();

        // To switch to another scene in Phaser, use:
        this.scene.start('OtherSceneKey');
      });
  }
}
```

### Method 2: Using `.off('change', callback)`

You can also unsubscribe by passing the same callback function to `.off('change', callback)`:

```typescript
export class GameScene extends Phaser.Scene {
  private healthCallback?: (newPlayer: any, oldPlayer: any) => void;

  create() {
    const playerState = withLocalState<{ hp: number }>(this, 'player', {
      hp: 100,
    });

    // Define callback function
    this.healthCallback = (newPlayer, oldPlayer) => {
      console.log('Player health changed:', newPlayer.hp);
    };

    // Subscribe to changes
    playerState.on('change', this.healthCallback);

    this.add
      .text(centerX, centerY, 'Go to another scene')
      .setInteractive()
      .on('pointerdown', () => {
        // Later, unsubscribe when needed
        playerState.off('change', this.healthCallback);

        // To switch to another scene in Phaser, use:
        this.scene.start('OtherSceneKey');
      });
  }
}
```

> **Note:** When using `.off`, you must pass the exact same function instance that was used with `.on`. This means you cannot use an inline closure or anonymous function—use a named function or store the callback reference to unsubscribe properly.

### Best Practices for Scene Cleanup

**⚠️ IMPORTANT DISCLAIMER**: If you don't clean up event listeners when leaving a scene, you may encounter:

- Memory leaks
- Unexpected behavior when returning to the scene
- Callbacks firing on destroyed or inactive scenes
- Performance issues over time

Always unsubscribe from events when transitioning between scenes:

```typescript
export class GameScene extends Phaser.Scene {
  private unsubscribeFunctions: (() => void)[] = [];

  create() {
    const playerState = withLocalState<{ hp: number }>(this, 'player', {
      hp: 100,
    });
    const scoreState = withGlobalState<number>(this, 'score', 0);

    // Store unsubscribe functions
    this.unsubscribeFunctions.push(
      playerState.on('change', newPlayer => {
        console.log('Player updated:', newPlayer);
      })
    );

    this.unsubscribeFunctions.push(
      scoreState.on('change', newScore => {
        console.log('Score updated:', newScore);
      })
    );
  }

  // Clean up when scene is destroyed or when transitioning
  shutdown() {
    // Unsubscribe from all events
    this.unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
    this.unsubscribeFunctions = [];
  }

  // Or clean up before transitioning to another scene
  goToNextScene() {
    // Clean up before changing scenes
    this.unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
    this.unsubscribeFunctions = [];

    // Then transition
    this.scene.start('NextScene');
  }
}
```

### Using `clearListeners()` for Easy Cleanup

For easier cleanup, you can use the `clearListeners()` method to remove all event listeners at once:

```typescript
export class GameScene extends Phaser.Scene {
  private playerState: HookState<{ hp: number }>;
  private scoreState: HookState<number>;

  create() {
    this.playerState = withLocalState<{ hp: number }>(this, 'player', { hp: 100 });
    this.scoreState = withGlobalState<number>(this, 'score', 0);

    // Add listeners
    this.playerState.on('change', (newPlayer) => {
      console.log('Player updated:', newPlayer);
    });

    this.scoreState.on('change', (newScore) => {
      console.log('Score updated:', newScore);
    });
  }

  shutdown() {
    // Clear all listeners at once - much easier!
    this.playerState.clearListeners();
    this.scoreState.clearListeners();
  }
}
```

#### Important Notes about `clearListeners()`:

- **`withLocalState`**: Automatically cleans up when the scene is destroyed, but you can still use `clearListeners()` for manual cleanup
- **`withGlobalState`**: **Requires manual cleanup** since global state persists across scenes. Always call `clearListeners()` when the scene is destroyed:

```typescript
export class GameScene extends Phaser.Scene {
  private globalState: HookState<GameSettings>;

  create() {
    this.globalState = withGlobalState<GameSettings>(this, 'settings', defaultSettings);
    
    this.globalState.on('change', (newSettings) => {
      console.log('Settings updated:', newSettings);
    });

    // IMPORTANT: Clean up global state listeners when scene is destroyed
    this.events.once('destroy', () => {
      this.globalState.clearListeners();
    });
  }
}
```

### Multiple Subscriptions Example

You can have multiple listeners for the same state:

```typescript
export class GameScene extends Phaser.Scene {
  create() {
    const playerState = withLocalState<{ hp: number; level: number }>(
      this,
      'player',
      {
        hp: 100,
        level: 1,
      }
    );

    // Multiple listeners for the same state
    const unsubscribeHealth = playerState.on('change', newPlayer => {
      console.log('Health changed:', newPlayer.hp);
    });

    const unsubscribeLevel = playerState.on('change', newPlayer => {
      console.log('Level changed:', newPlayer.level);
    });

    // Unsubscribe specific listeners
    unsubscribeHealth(); // Only removes health listener
    // unsubscribeLevel still active
  }
}
```

### Using `.once()` for One-Time Events

The `.once()` method registers a callback that will only fire once, then automatically unsubscribes:

```typescript
export class GameScene extends Phaser.Scene {
  create() {
    const playerState = withLocalState<{ hp: number; level: number }>(
      this,
      'player',
      {
        hp: 100,
        level: 1,
      }
    );

    // One-time listener - fires only once then auto-unsubscribes
    const unsubscribeOnce = playerState.once('change', newPlayer => {
      console.log('First level up detected!', newPlayer.level);
      // This callback will only run once, even if the state changes multiple times
    });

    // You can still manually unsubscribe if needed before it fires
    // unsubscribeOnce();

    // Simulate level up
    playerState.set({ hp: 100, level: 2 }); // Fires the once callback
    playerState.set({ hp: 100, level: 3 }); // Won't fire the once callback again
  }
}
```

### Validation Error Handling

When using validators, invalid values will throw errors. Handle them appropriately:

```typescript
export class GameScene extends Phaser.Scene {
  create() {
    const healthState = withLocalState<number>(this, 'health', 100, {
      validator: validators.numberRange(0, 100),
    });

    try {
      healthState.set(150); // This will throw an error: "Value must be between 0 and 100"
    } catch (error) {
      console.error('Invalid health value:', error.message);
      // Handle the error appropriately
    }

    // Valid value
    healthState.set(75); // This works fine
  }
}
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
