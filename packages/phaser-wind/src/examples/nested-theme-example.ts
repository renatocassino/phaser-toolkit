/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
/* eslint-disable no-console */
/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable no-magic-numbers */
/**
 * Example usage of Phaser Wind with nested theme structure
 * This file demonstrates the new complex theme system
 */
import Phaser from 'phaser';

import {
  Color,
  EffectPicker,
  Font,
  FontSizePicker,
  SpacingPicker,
  ThemeManager,
  TypographyPicker,
  createTheme,
  defaultDarkTheme,
  defaultLightTheme,
  type BaseThemeConfig,
} from '..';

// Example 1: Creating complex nested theme
export const createGameTheme = (): BaseThemeConfig =>
  createTheme({
    fonts: {
      primary: 'Inter, system-ui, sans-serif',
      secondary: 'Roboto, Arial, sans-serif',
      display: 'Orbitron, monospace', // Sci-fi font for game
      ui: 'Poppins, sans-serif',
    },
    colors: {
      // Brand colors
      primary: 'purple-600',
      secondary: 'cyan-500',
      accent: 'yellow-400',

      // Game-specific colors
      'player-health': 'green-500',
      'player-health-low': 'red-500',
      'player-mana': 'blue-500',
      'enemy-health': 'red-600',
      'item-rare': 'purple-400',
      'item-epic': 'orange-400',
      'item-legendary': 'yellow-400',

      // UI colors
      'ui-background': 'slate-900',
      'ui-panel': 'slate-800',
      'ui-button': 'slate-700',
      'ui-button-hover': 'slate-600',
      'ui-text': 'white',
      'ui-text-muted': 'slate-400',

      // Feedback colors
      success: 'green-400',
      warning: 'yellow-400',
      error: 'red-400',
      info: 'blue-400',
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48,
      huge: 64,
      massive: 96,
    },
    typography: {
      'title-huge': {
        fontSize: '6xl',
        fontFamily: 'fonts.display', // Reference to fonts.display
        fontWeight: 700,
        lineHeight: 1.1,
      },
      'title-large': {
        fontSize: '4xl',
        fontFamily: 'fonts.display',
        fontWeight: 600,
        lineHeight: 1.2,
      },
      heading: {
        fontSize: '2xl',
        fontFamily: 'fonts.ui',
        fontWeight: 500,
        lineHeight: 1.3,
      },
      body: {
        fontSize: 'md',
        fontFamily: 'fonts.primary',
        fontWeight: 400,
        lineHeight: 1.5,
      },
      caption: {
        fontSize: 'sm',
        fontFamily: 'fonts.primary',
        fontWeight: 400,
        lineHeight: 1.4,
      },
    },
    effects: {
      'glow-primary': {
        blur: 8,
        offsetX: 0,
        offsetY: 0,
        color: 'colors.primary', // Reference to colors.primary
        alpha: 0.6,
      },
      'shadow-ui': {
        blur: 4,
        offsetX: 0,
        offsetY: 2,
        color: 'black',
        alpha: 0.3,
      },
      'shadow-heavy': {
        blur: 16,
        offsetX: 0,
        offsetY: 8,
        color: 'black',
        alpha: 0.4,
      },
    },
    // Custom category
    animations: {
      'fade-duration': 300,
      'slide-duration': 400,
      'bounce-intensity': 1.2,
    },
  });

// Example 2: Using the new theme system
export class AdvancedGameScene extends Phaser.Scene {
  create(): void {
    // Initialize custom theme
    const gameTheme = createGameTheme();
    ThemeManager.init(gameTheme);

    this.createBackground();
    this.createHUD();
    this.createGameElements();
    this.createUI();
  }

  private createBackground(): void {
    // Create gradient background using theme colors
    const bg = this.add.graphics();
    bg.fillGradientStyle(
      Color.hex('ui-background'), // Top-left
      Color.hex('ui-panel'), // Top-right
      Color.hex('ui-panel'), // Bottom-left
      Color.hex('ui-background') // Bottom-right
    );
    bg.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
  }

  private createHUD(): void {
    const hudY = SpacingPicker.px('md');

    // Game title using typography token
    const titleStyle = TypographyPicker.phaserStyle('title-huge');
    this.add
      .text(this.cameras.main.centerX, hudY, 'CYBER QUEST', {
        ...titleStyle,
        color: Color.rgb('primary') as string,
      })
      .setOrigin(0.5);

    // Player stats using spacing and colors from theme
    this.createStatBar(
      SpacingPicker.px('lg'),
      hudY + SpacingPicker.px('xl'),
      'Health',
      'player-health',
      0.8
    );

    this.createStatBar(
      SpacingPicker.px('lg'),
      hudY + SpacingPicker.px('xl') + SpacingPicker.px('lg'),
      'Mana',
      'player-mana',
      0.6
    );
  }

  private createStatBar(
    x: number,
    y: number,
    label: string,
    colorKey: string,
    percentage: number
  ): void {
    const width = 200;
    const height = SpacingPicker.px('md');

    // Label using typography
    const labelStyle = TypographyPicker.phaserStyle('caption');
    this.add.text(x, y - SpacingPicker.px('sm'), label, {
      ...labelStyle,
      color: Color.rgb('ui-text') as string,
    });

    // Background bar
    this.add
      .rectangle(x, y, width, height, Color.hex('ui-panel'))
      .setOrigin(0, 0.5);

    // Fill bar
    const fillWidth = width * percentage;
    this.add
      .rectangle(x, y, fillWidth, height - 2, Color.hex(colorKey))
      .setOrigin(0, 0.5);

    // Text overlay
    const bodyStyle = TypographyPicker.phaserStyle('body');
    this.add
      .text(x + width / 2, y, `${Math.round(percentage * 100)}%`, {
        ...bodyStyle,
        color: Color.rgb('ui-text') as string,
      })
      .setOrigin(0.5);
  }

  private createGameElements(): void {
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    // Player character
    const player = this.add.circle(
      centerX - SpacingPicker.px('massive'),
      centerY,
      SpacingPicker.px('lg'),
      Color.hex('primary')
    );

    // Enemy
    const enemy = this.add.circle(
      centerX + SpacingPicker.px('massive'),
      centerY,
      SpacingPicker.px('xl'),
      Color.hex('enemy-health')
    );

    // Items with different rarities
    this.createItem(
      centerX - SpacingPicker.px('lg'),
      centerY + SpacingPicker.px('huge'),
      'item-rare'
    );
    this.createItem(centerX, centerY + SpacingPicker.px('huge'), 'item-epic');
    this.createItem(
      centerX + SpacingPicker.px('lg'),
      centerY + SpacingPicker.px('huge'),
      'item-legendary'
    );

    console.log('Game elements created:', { player, enemy });
  }

  private createItem(x: number, y: number, rarityColor: string): void {
    // Item background
    this.add.star(
      x,
      y,
      5,
      SpacingPicker.px('sm'),
      SpacingPicker.px('md'),
      Color.hex(rarityColor)
    );

    // Item glow effect (simulated)
    this.add.circle(x, y, SpacingPicker.px('lg'), Color.hex(rarityColor), 0.2);
  }

  private createUI(): void {
    const bottomY = this.cameras.main.height - SpacingPicker.px('xl');

    // Action buttons
    this.createButton(
      this.cameras.main.centerX - SpacingPicker.px('huge'),
      bottomY,
      'ATTACK',
      'error'
    );

    this.createButton(this.cameras.main.centerX, bottomY, 'DEFEND', 'warning');

    this.createButton(
      this.cameras.main.centerX + SpacingPicker.px('huge'),
      bottomY,
      'HEAL',
      'success'
    );
  }

  private createButton(
    x: number,
    y: number,
    text: string,
    variant: string
  ): void {
    const width = SpacingPicker.px('massive');
    const height = SpacingPicker.px('xl');

    // Button background
    const button = this.add
      .rectangle(x, y, width, height, Color.hex('ui-button'))
      .setInteractive()
      .on('pointerover', () => {
        button.setFillStyle(Color.hex('ui-button-hover'));
      })
      .on('pointerout', () => {
        button.setFillStyle(Color.hex('ui-button'));
      })
      .on('pointerdown', () => {
        console.log(`${text} button clicked!`);
      });

    // Button text
    const buttonStyle = TypographyPicker.phaserStyle('heading');
    this.add
      .text(x, y, text, {
        ...buttonStyle,
        color: Color.rgb(variant) as string,
      })
      .setOrigin(0.5);
  }
}

// Example 3: Theme switching and dynamic updates
export const demonstrateThemeSwitching = (): void => {
  // Register multiple themes
  ThemeManager.registerTheme('light', defaultLightTheme);
  ThemeManager.registerTheme('dark', defaultDarkTheme);
  ThemeManager.registerTheme('game', createGameTheme());

  // Listen for theme changes
  const unsubscribe = ThemeManager.onThemeChange(newTheme => {
    console.log('Theme changed!', {
      fonts: Object.keys(newTheme.fonts ?? {}),
      colors: Object.keys(newTheme.colors ?? {}),
      spacing: Object.keys(newTheme.spacing ?? {}),
    });
  });

  // Start with game theme
  ThemeManager.setTheme('game');

  // Switch themes after delays
  setTimeout(() => ThemeManager.setTheme('dark'), 2000);
  setTimeout(() => ThemeManager.setTheme('light'), 4000);
  setTimeout(() => ThemeManager.setTheme('game'), 6000);

  // Clean up after demo
  setTimeout(() => unsubscribe(), 8000);
};

// Example 4: Direct API usage
export const demonstrateAPIUsage = (): void => {
  const gameTheme = createGameTheme();
  ThemeManager.init(gameTheme);

  console.log('=== Theme API Demo ===');

  // Colors
  console.log('Primary color (RGB):', Color.rgb('primary'));
  console.log('Primary color (HEX):', Color.hex('primary'));
  console.log('UI background:', Color.rgb('ui-background'));

  // Fonts
  console.log('Display font:', Font.family('display'));
  console.log('Available fonts:', Font.getAvailableFonts());

  // Spacing
  console.log('Large spacing:', SpacingPicker.px('lg'));
  console.log('Available spacing:', SpacingPicker.getAvailableSpacing());

  // Typography
  console.log('Title style:', TypographyPicker.style('title-huge'));
  console.log(
    'Phaser title style:',
    TypographyPicker.phaserStyle('title-huge')
  );

  // Effects
  console.log('Primary glow:', EffectPicker.config('glow-primary'));

  // Direct theme access
  console.log(
    'Custom animation duration:',
    ThemeManager.getToken('animations.fade-duration')
  );

  // Font size (still works)
  console.log('XL font size:', FontSizePicker.css('xl'));
};

// Example 5: Creating themed components
export class ThemedButton {
  private background: Phaser.GameObjects.Rectangle;
  private text: Phaser.GameObjects.Text;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    label: string,
    variant:
      | 'primary'
      | 'secondary'
      | 'success'
      | 'warning'
      | 'error' = 'primary'
  ) {
    const width = SpacingPicker.px('massive');
    const height = SpacingPicker.px('xl');

    // Background with theme colors
    this.background = scene.add
      .rectangle(x, y, width, height, Color.hex('ui-button'))
      .setInteractive()
      .on('pointerover', () => this.onHover())
      .on('pointerout', () => this.onLeave())
      .on('pointerdown', () => this.onClick());

    // Text with theme typography and colors
    const textStyle = TypographyPicker.phaserStyle('heading');
    this.text = scene.add
      .text(x, y, label, {
        ...textStyle,
        color: Color.rgb(variant) as string,
      })
      .setOrigin(0.5);
  }

  private onHover(): void {
    this.background.setFillStyle(Color.hex('ui-button-hover'));
  }

  private onLeave(): void {
    this.background.setFillStyle(Color.hex('ui-button'));
  }

  private onClick(): void {
    console.log(`Themed button clicked: ${this.text.text}`);
  }
}
