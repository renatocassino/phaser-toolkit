/* eslint-disable no-console */
/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable no-magic-numbers */
/**
 * Example usage of Phaser Wind with custom themes
 * This file demonstrates how to set up and use custom themes
 */
import Phaser from 'phaser';

import {
  Color,
  FontSizePicker,
  ThemeManager,
  createTheme,
  defaultDarkTheme,
  defaultLightTheme,
} from '..';

// Example 1: Using default themes
export const setupDefaultThemes = (): void => {
  // Initialize with light theme
  ThemeManager.init(defaultLightTheme);

  // Register dark theme
  ThemeManager.registerTheme('dark', defaultDarkTheme);
};

// Example 2: Creating custom theme
export const setupCustomTheme = (): void => {
  const gameTheme = createTheme({
    // Custom semantic tokens
    primary: 'purple-600',
    secondary: 'pink-500',
    background: 'slate-900',
    'background-panel': 'slate-800',
    text: 'white',
    'text-muted': 'slate-400',
    accent: 'yellow-400',

    // Game-specific tokens
    'player-health': 'green-500',
    'player-health-low': 'red-500',
    'enemy-health': 'red-600',
    'pickup-rare': 'purple-400',
    'pickup-common': 'blue-400',
    'ui-button': 'slate-700',
    'ui-button-hover': 'slate-600',
    'ui-danger': 'red-500',
    'ui-success': 'green-500',
  });

  ThemeManager.init(gameTheme);
};

// Example 3: Using in Phaser Scene
export class ExampleGameScene extends Phaser.Scene {
  create(): void {
    // Initialize custom theme first
    setupCustomTheme();

    // Now use theme tokens instead of hardcoded colors
    this.createUI();
    this.createGameElements();
  }

  private createUI(): void {
    // Background using theme token
    this.add
      .rectangle(
        0,
        0,
        this.cameras.main.width,
        this.cameras.main.height,
        Color.hex('background')
      )
      .setOrigin(0);

    // Title using theme tokens
    this.add
      .text(400, 50, 'MY GAME', {
        fontSize: FontSizePicker.css('4xl'),
        color: Color.rgb('primary') as string,
      })
      .setOrigin(0.5);

    // Health bar
    this.createHealthBar(100, 100, 200, 20);

    // UI Panel
    this.createPanel(50, 150, 300, 200);
  }

  private createHealthBar(
    x: number,
    y: number,
    width: number,
    height: number
  ): void {
    // Background
    this.add.rectangle(x, y, width, height, Color.hex('background-panel'));

    // Health fill (80% health example)
    const healthWidth = width * 0.8;
    this.add.rectangle(
      x - (width - healthWidth) / 2,
      y,
      healthWidth,
      height - 4,
      Color.hex('player-health')
    );

    // Health text
    this.add
      .text(x, y, '80 / 100', {
        fontSize: FontSizePicker.css('sm'),
        color: Color.rgb('text') as string,
      })
      .setOrigin(0.5);
  }

  private createPanel(
    x: number,
    y: number,
    width: number,
    height: number
  ): void {
    // Panel background
    this.add.rectangle(x, y, width, height, Color.hex('background-panel'));

    // Panel title
    this.add
      .text(x, y - height / 2 + 20, 'Inventory', {
        fontSize: FontSizePicker.css('lg'),
        color: Color.rgb('text') as string,
      })
      .setOrigin(0.5);

    // Rare item
    this.add.circle(x - 50, y, 15, Color.hex('pickup-rare'));
    this.add
      .text(x - 50, y + 25, 'Rare', {
        fontSize: FontSizePicker.css('xs'),
        color: Color.rgb('pickup-rare') as string,
      })
      .setOrigin(0.5);

    // Common item
    this.add.circle(x + 50, y, 15, Color.hex('pickup-common'));
    this.add
      .text(x + 50, y + 25, 'Common', {
        fontSize: FontSizePicker.css('xs'),
        color: Color.rgb('pickup-common') as string,
      })
      .setOrigin(0.5);
  }

  private createGameElements(): void {
    // Enemy with theme-based health
    const enemy = this.add.circle(600, 300, 30, Color.hex('enemy-health'));

    // Player with theme-based color
    const player = this.add.circle(200, 300, 25, Color.hex('primary'));

    // eslint-disable-next-line no-console
    console.log(enemy, player);

    // Pickup items with theme colors
    this.add.star(400, 400, 5, 10, 20, Color.hex('pickup-rare'));
    this.add.star(450, 400, 5, 8, 16, Color.hex('pickup-common'));
  }
}

// Example 4: Dynamic theme switching
export const setupThemeSwitching = (): void => {
  // Setup themes
  ThemeManager.registerTheme('light', defaultLightTheme);
  ThemeManager.registerTheme('dark', defaultDarkTheme);

  const customTheme = createTheme({
    primary: 'emerald-500',
    background: 'emerald-950',
    text: 'emerald-50',
    'background-panel': 'emerald-900',
  });
  ThemeManager.registerTheme('emerald', customTheme);

  // Listen for theme changes
  ThemeManager.onThemeChange(newTheme => {
    console.log('Theme changed!', newTheme);
    // Here you could update existing game objects with new colors
  });

  // Switch themes
  ThemeManager.setTheme('dark');
  setTimeout(() => ThemeManager.setTheme('emerald'), 2000);
  setTimeout(() => ThemeManager.setTheme('light'), 4000);
};

// Example 5: Extending themes
export const setupExtendedTheme = (): void => {
  ThemeManager.init(defaultLightTheme);

  // Create variation of current theme
  const winterTheme = ThemeManager.extendCurrentTheme({
    primary: 'blue-400',
    secondary: 'cyan-300',
    accent: 'white',
    background: 'blue-950',
    text: 'blue-50',
    'special-snow': 'white',
    'special-ice': 'cyan-200',
  });

  ThemeManager.registerTheme('winter', winterTheme);
  ThemeManager.setTheme('winter');
};
