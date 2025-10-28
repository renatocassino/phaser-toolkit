<p align="center" style="margin: 0 auto;">
  <img src="data/image.png" alt="logo" style="max-width: 300px">
</p>

[![NPM Version](https://img.shields.io/npm/v/phaser-hooks)](https://www.npmjs.com/package/phaser-hooks)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

# Phaser Hooks

React-like state management for Phaser 3 games. Simple, type-safe, and powerful.

## Why phaser-hooks?

Phaser gives you `registry` (global) and `data` (local) for state management. They work fine, but the API is verbose and error-prone:

```ts
// Phaser's built-in way - this == scene
this.game.registry.set('volume', 0.5);
const volume = this.game.registry.get('volume');

this.game.registry.events.on('changedata-volume', (game, value) => {
  console.log('Volume changed to', value);
});

this.data.set('score', 42);
const score = this.data.get('score');

this.onChangeFn = (scene, value) => {
  console.log('Score updated to', value);
};
this.data.events.on('changedata-score', this.onChangeFn); // if you pass an anonymous function, you cannot unsubscribe

// when move to another scene, you must unsubscribe. Boring and easy to forget
this.data.events.off('changedata-score', this.onChangeFn);
```

**With _phaser-hooks_, you get a simple, React-like API:**

```ts
const volume = withGlobalState(this, 'volume', 0.5);
volume.get(); // Returns: 0.5
volume.set(0.8); // updates the value

this.unsubscribe = volume.on('change', () => {
  console.log('Volume changed →', volume.get())
}); // Returns the easy unsubscribe function

// when changing scenes
this.unsubscribe();
```

### Key Benefits

- ✅ **React-like patterns** - Hooks work just like React: same key = same state
- ✅ **Type-safe** - Full TypeScript support with inference
- ✅ **Memory safe** - Auto-cleanup prevents memory leaks
- ✅ **Feature-rich** - Persistence, computed state, undo/redo, validation
- ✅ **Familiar** - React-like patterns for easier onboarding


## Installation

```bash
npm install phaser-hooks
# or
pnpm add phaser-hooks
# or
yarn add phaser-hooks
```
> **Note:** This library uses "with" prefix (e.g., `withLocalState`) instead of "use" to avoid ESLint warnings in `.ts` files.

## 🌐 UMD/CDN (JavaScript)

If you prefer not to use TypeScript or want to include the library via CDN, you can use the UMD build:

```html
<script src="https://cdn.jsdelivr.net/npm/phaser-hooks@0.6.0/dist/phaser-hooks.min.js"></script>
```

The library will be available globally as `window.PhaserHooks`. You can use it like this:

```javascript
// Create local state
const playerState = window.PhaserHooks.withLocalState(scene, 'player', { hp: 100 });
```

> **⚠️ Note**: While UMD builds are available, we **strongly recommend using TypeScript** for better type safety, IntelliSense, and development experience. The TypeScript version provides better error detection and autocomplete features.

## Quick Start

Here's a complete example showing the basics:

```typescript
// hooks/withPlayerState.ts
import { withLocalState } from 'phaser-hooks';
// or const { withLocalState } from 'phaser-hooks';

const withPlayer = (scene: Phaser.Scene) => {
  const player = withLocalState(scene, 'player', {
    hp: 100,
    maxHp: 100,
    level: 1,
  });

  return player;
};

// hooks/withSettings.ts
import { withGlobalState } from 'phaser-hooks';

const withSettings = (scene: Phaser.Scene) => {
  const settings = withGlobalState(scene, 'settings', { 
    volume: 0.8,
    difficulty: 'normal' 
  });
  return settings;
};


// scenes/gameScene.ts
import { withLocalState, withGlobalState } from 'phaser-hooks';

class GameScene extends Phaser.Scene {
  private unsubscribe?: () => void;

  create() {
    // 1. Local state (scene-specific, auto-cleanup)
    const player = withPlayer(this); // clean and reusable within the same scene

    // 2. Global state (persists across scenes)
    const settings = withSettings(this); // the same instance in all scenes

    // 3. Update state
    player.patch({ hp: 90 }); // Partial update
    settings.set({ volume: 0.5, difficulty: 'hard' }); // Full update

    // 4. Read state
    console.log(player.get().hp); // 90
    console.log(settings.get().volume); // 0.5

    // 5. Listen to changes
    this.unsubscribe = player.on('change', (newPlayer, oldPlayer) => {
      if (newPlayer.hp < 20) {
        console.warn(`Low health! Your old HP was ${oldPlayer.hp}`);
      }
    });
  }

  shutdown() {
    // 6. Clean up (local state auto-cleans, but it’s good practice)
    this.unsubscribe?.();
  }
}
```

**That's it!** You now have reactive, type-safe state management in your Phaser game.

### Recommended: Create Custom Hooks

**Just like in React**, the real power comes from creating reusable hooks (but without React):
```typescript
// GameScene.ts
import { withPlayerState } from './hooks/withPlayerState';

class GameScene extends Phaser.Scene {
  create() {
    const player = withPlayerState(this); // Clean and reusable!
    player.patch({ hp: 90 });
  }
}

// HealthBar.ts - Access the SAME state!
class HealthBar extends Phaser.GameObjects.Container {
  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);
    
    const player = withPlayerState(scene); // Same state instance!
    
    player.on('change', (newPlayer) => {
      this.updateDisplay(newPlayer.hp, newPlayer.maxHp);
    });
  }
}
```

**Key insight:** Using the same `key` returns the same state instance, just like React hooks! This allows you to access state from anywhere: scenes, components, systems, etc.
**Initial value:** The initial value is only applied during the first execution. On subsequent calls, the same state instance is reused — just like in React Hooks.

### Advanced: Hooks with Custom Methods

> 💡 If you’re not using TypeScript, don’t worry — all hooks work with plain JavaScript too.

However, defining full types for your state object, hook return, and custom methods gives you complete end-to-end type safety with full IntelliSense for every method and return value.

```typescript
// hooks/withPlayerState.ts
import { withLocalState, type HookState } from 'phaser-hooks';

export type PlayerState = {
  hp: number;
  maxHp: number;
  level: number;
};

export type PlayerHook = HookState<PlayerState> & {
  takeDamage: (amount: number) => void;
  heal: (amount: number) => void;
  levelUp: () => void;
};

const initialPlayerState: PlayerState = {
  hp: 100,
  maxHp: 100,
  level: 1,
};

export function withPlayerState(scene: Phaser.Scene): PlayerHook {
  const state = withLocalState<PlayerState>(scene, 'player', initialPlayerState);
  const takeDamage = (amount: number): void => {
    const current = state.get();
    state.patch({
      hp: Math.max(0, current.hp - amount),
    });
  };

  const heal = (amount: number): void => {
    const current = state.get();
    state.patch({
      hp: Math.min(current.maxHp, current.hp + amount),
    });
  };

  const levelUp = (): void => {
    const current = state.get();
    state.patch({
      level: current.level + 1,
      maxHp: current.maxHp + 10,
      hp: current.maxHp + 10,
    });
  };

  return {
    ...state,     // get, set, patch, on, once, off, clearListeners
    takeDamage,
    heal,
    levelUp,
  };
}

// Usage in your scene
const player = withPlayerState(this);
console.log(player.get());
player.takeDamage(30);
console.log(player.get());
player.heal(10);
console.log(player.get());
player.levelUp();
console.log(player.get());
/**
 * Output:
 * {hp: 100, maxHp: 100, level: 1}
 * {hp: 70, maxHp: 100, level: 1} 
 * {hp: 80, maxHp: 100, level: 1}
 * {hp: 110, maxHp: 110, level: 2}
 */
```

### Next Steps

- 📚 [Full documentation and examples](https://toolkit.cassino.dev/phaser-hooks)

## Core Concepts

### Updater Functions

Both `set()` and `patch()` accept updater functions for race-condition-safe updates:
```typescript
// Direct value
player.set({ hp: 90, level: 2 });

// Updater function (recommended when based on current state)
player.set(current => ({ ...current, hp: current.hp - 10 }));

// Patch with updater
player.patch(current => ({ hp: current.hp + 20 }));
```

**Why use updater functions?** They always work with the latest state, preventing race conditions in async scenarios.

---

### `set()` vs `patch()`

- **`set()`** - Full state replacement
- **`patch()`** - Partial update with deep merge (only for objects)
```typescript
const player = withLocalState(this, 'player', { 
  hp: 100, 
  maxHp: 100, 
  level: 1 
});

player.set({ hp: 90, maxHp: 100, level: 1 }); // Must provide all properties
player.patch({ hp: 90 }); // Only updates hp, preserves maxHp and level
```

**Rule of thumb:** Use `patch()` for object states when you only need to update specific properties.

## Debug Mode / Dev tool

Phaser Hooks includes a built-in debug mode that provides detailed logging for state operations. This is extremely useful when developing or debugging state-related issues.

### How to Enable Debug Mode

To enable debug mode, simply pass `{ debug: true }` in the options parameter when creating any hook:

```typescript
import { withLocalState } from 'phaser-hooks';

export const withPlayer = (scene: Phaser.Scene) => {
  const playerState = withLocalState<{ hp: number; level: number }>(
    this,
    'player',
    {
      hp: 100,
      level: 1,
    },
    { debug: true }, // Enable debug logging
  );

  return playerState;
}

// in your scene
playerState.patch((current) => ({ hp: current.hp - 10 })); // Log here
```


## Hook API Reference

All hooks return a `HookState<T>` object with the following methods:

| Method | Description | Parameters | Returns |
|--------|-------------|------------|---------|
| `get()` | Gets the current state value | None | `T` - Current state value |
| `set(value)` | Sets a new state value and triggers change listeners | `value: T \| ((current: T) => T)` | `void` |
| `patch(value)` | Patches object state with partial updates (deep merge) | `value: Partial<T> \| ((current: T) => Partial<T>)` | `void` |
| `on('change', callback)` | Registers a callback for state changes | `callback: (newValue: T, oldValue: T) => void` | `() => void` - Unsubscribe function |
| `once('change', callback)` | Registers a callback that fires only once | `callback: (newValue: T, oldValue: T) => void` | `() => void` - Unsubscribe function |
| `off('change', callback)` | Removes a specific event listener | `callback: (newValue: T, oldValue: T) => void` | `void` |
| `clearListeners()` | Removes all event listeners for this state | None | `void` |

### Notes

- **`set()`** accepts either a value or an updater function for safe updates
- **`patch()`** only works with object states and performs deep merging
- **`on()`/`once()`/`off()`** only support the `'change'` event
- **`off()`** requires the exact same function reference that was passed to `on()`

### Example:

![Debug Console Screenshot](data/debug-mode.png)
*Screenshot showing debug logs in the browser console*

## License

MIT
