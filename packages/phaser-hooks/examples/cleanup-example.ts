/**
 * Example demonstrating how to use the new cleanup methods in phaser-hooks
 * to prevent memory leaks when scenes are destroyed.
 */

import * as Phaser from 'phaser';
import { withLocalState, withGlobalState } from '../src';

class GameScene extends Phaser.Scene {
  private scoreState: any;
  private healthState: any;
  private inventoryState: any;
  private callbacks: Array<() => void> = [];

  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    // Create local state for this scene
    this.scoreState = withLocalState(this, 'score', 0);
    this.healthState = withLocalState(this, 'health', 100);
    
    // Create global state that persists across scenes
    this.inventoryState = withGlobalState(this, 'inventory', []);

    // Set up change listeners
    this.setupChangeListeners();
  }

  private setupChangeListeners() {
    // Store callback references for manual cleanup if needed
    const scoreCallback = (newScore: number, oldScore: number) => {
      console.log(`Score changed from ${oldScore} to ${newScore}`);
      this.updateScoreDisplay(newScore);
    };

    const healthCallback = (newHealth: number, oldHealth: number) => {
      console.log(`Health changed from ${oldHealth} to ${newHealth}`);
      this.updateHealthDisplay(newHealth);
      
      if (newHealth <= 0) {
        this.gameOver();
      }
    };

    const inventoryCallback = (newInventory: string[], oldInventory: string[]) => {
      console.log(`Inventory changed:`, newInventory);
      this.updateInventoryDisplay(newInventory);
    };

    // Register callbacks
    this.scoreState.onChange(scoreCallback);
    this.healthState.onChange(healthCallback);
    this.inventoryState.onChange(inventoryCallback);

    // Store callbacks for manual cleanup if needed
    this.callbacks.push(() => this.scoreState.removeOnChange(scoreCallback));
    this.callbacks.push(() => this.healthState.removeOnChange(healthCallback));
    this.callbacks.push(() => this.inventoryState.removeOnChange(inventoryCallback));
  }

  private updateScoreDisplay(score: number) {
    // Update UI elements
    console.log(`Updating score display to: ${score}`);
  }

  private updateHealthDisplay(health: number) {
    // Update UI elements
    console.log(`Updating health display to: ${health}`);
  }

  private updateInventoryDisplay(inventory: string[]) {
    // Update UI elements
    console.log(`Updating inventory display:`, inventory);
  }

  private gameOver() {
    console.log('Game Over!');
    // Transition to game over scene
  }

  // Manual cleanup method (optional - automatic cleanup happens on scene destroy)
  private cleanup() {
    console.log('Manually cleaning up callbacks...');
    
    // Option 1: Remove specific callbacks
    this.callbacks.forEach(cleanup => cleanup());
    
    // Option 2: Remove all callbacks at once
    // this.scoreState.removeAllOnChange();
    // this.healthState.removeAllOnChange();
    // this.inventoryState.removeAllOnChange();
  }

  // Called when scene is destroyed
  destroy() {
    console.log('Scene being destroyed - automatic cleanup will occur');
    
    // Optional: Manual cleanup before automatic cleanup
    // this.cleanup();
    
    super.destroy();
  }
}

/**
 * Example of a scene that needs to clean up callbacks when transitioning
 */
class MenuScene extends Phaser.Scene {
  private settingsState: any;
  private musicCallback: () => void;

  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    // Create state for menu settings
    this.settingsState = withLocalState(this, 'settings', {
      musicEnabled: true,
      soundEnabled: true,
      difficulty: 'normal'
    });

    // Set up music callback
    this.musicCallback = (newSettings: any, oldSettings: any) => {
      if (newSettings.musicEnabled !== oldSettings.musicEnabled) {
        if (newSettings.musicEnabled) {
          this.sound.play('background-music', { loop: true });
        } else {
          this.sound.stopByKey('background-music');
        }
      }
    };

    this.settingsState.onChange(this.musicCallback);
  }

  // Method to transition to game scene
  startGame() {
    // Remove the music callback before transitioning
    // This prevents the callback from trying to access the destroyed scene
    this.settingsState.removeOnChange(this.musicCallback);
    
    // Transition to game scene
    this.scene.start('GameScene');
  }

  // Alternative: Remove all callbacks before transitioning
  startGameWithFullCleanup() {
    // Remove all callbacks
    this.settingsState.removeAllOnChange();
    
    // Transition to game scene
    this.scene.start('GameScene');
  }
}

/**
 * Example of a component that manages its own cleanup
 */
class PlayerComponent {
  private scene: Phaser.Scene;
  private positionState: any;
  private velocityState: any;
  private callbacks: Array<() => void> = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.positionState = withLocalState(scene, 'player-position', { x: 0, y: 0 });
    this.velocityState = withLocalState(scene, 'player-velocity', { x: 0, y: 0 });
    
    this.setupCallbacks();
  }

  private setupCallbacks() {
    const positionCallback = (newPos: any, oldPos: any) => {
      console.log(`Player moved from (${oldPos.x}, ${oldPos.y}) to (${newPos.x}, ${newPos.y})`);
    };

    const velocityCallback = (newVel: any, oldVel: any) => {
      console.log(`Player velocity changed from (${oldVel.x}, ${oldVel.y}) to (${newVel.x}, ${newVel.y})`);
    };

    this.positionState.onChange(positionCallback);
    this.velocityState.onChange(velocityCallback);

    // Store cleanup functions
    this.callbacks.push(() => this.positionState.removeOnChange(positionCallback));
    this.callbacks.push(() => this.velocityState.removeOnChange(velocityCallback));
  }

  // Public method to clean up this component
  destroy() {
    console.log('Destroying player component...');
    this.callbacks.forEach(cleanup => cleanup());
  }

  // Getters for state access
  get position() {
    return this.positionState.get();
  }

  get velocity() {
    return this.velocityState.get();
  }

  // Setters for state updates
  setPosition(x: number, y: number) {
    this.positionState.set({ x, y });
  }

  setVelocity(x: number, y: number) {
    this.velocityState.set({ x, y });
  }
}

export { GameScene, MenuScene, PlayerComponent };