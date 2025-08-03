# 🌪️ Phaser Wind

<center>
<img src="data/image.png" height="350" style="margin: 0 auto;" alt="Phaser + TailWIND">
</center>

> **Tired of fighting with Phaser layouts and colors?**
>
> **Love Tailwind CSS but stuck with Phaser?**
>
> **Welcome to Phaser Wind** - bringing the joy and simplicity of Tailwind CSS design tokens to Phaser games! 🎮✨

[![NPM Version](https://img.shields.io/npm/v/phaser-wind)](https://www.npmjs.com/package/phaser-wind)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

---

## 🎯 Why Phaser Wind?

### The Problem 😫

```typescript
// Ugh... more magic numbers and random colors
const button = this.add.text(100, 50, 'Click me!', {
  fontSize: '18px', // Is this too big? Too small? 🤷‍♂️
  fill: '#3B82F6', // What color is this again?
  backgroundColor: '#1F2937', // Does this even look good?
});

const title = this.add.text(200, 100, 'Game Title', {
  fontSize: '32px', // Different magic number...
  fill: '#EF4444', // Another random hex...
});
```

### The Solution 🌟

```typescript
import { ColorPicker, FontSizePicker } from 'phaser-wind';

// Clean, semantic, consistent!
const button = this.add.text(100, 50, 'Click me!', {
  fontSize: FontSizePicker.css('lg'), // Clear intention!
  fill: ColorPicker.rgb('blue-500'), // Beautiful blue
  backgroundColor: ColorPicker.rgb('gray-800'), // Perfect contrast
});

const title = this.add.text(200, 100, 'Game Title', {
  fontSize: FontSizePicker.css('3xl'), // Clearly bigger!
  fill: ColorPicker.rgb('red-500'), // Vibrant red
});
```

---

## 🚀 Features

- 🎨 **Complete Tailwind Color Palette** - All 22 color families with 11 shades each
- 📐 **Semantic Font Sizes** - From `xs` to `6xl`, just like Tailwind
- 🔧 **TypeScript First** - Full type safety and IntelliSense
- 🎮 **Phaser Ready** - Designed specifically for Phaser 3 games
- 🌈 **Consistent Design** - No more guessing colors and sizes
- 📦 **Tiny Bundle** - Zero runtime overhead, just better DX

---

## 📦 Installation

```bash
npm install phaser-wind
# or
yarn add phaser-wind
# or
pnpm add phaser-wind
```

---

## 🎨 Color System

### Complete Tailwind Palette

Access all Tailwind colors with semantic naming:

```typescript
import { ColorPicker } from 'phaser-wind';

// RGB strings (for Phaser text styles)
const blueText = ColorPicker.rgb('blue-500'); // 'rgb(59, 130, 246)'
const redButton = ColorPicker.rgb('red-600'); // 'rgb(220, 38, 38)'

// Hex numbers (for Phaser graphics)
const greenRect = ColorPicker.hex('green-400'); // 0x4ADE80
const purpleCircle = ColorPicker.hex('purple-300'); // 0xD8B4FE

// Basic colors
const blackText = ColorPicker.rgb('black'); // 'rgb(0, 0, 0)'
const whiteBackground = ColorPicker.hex('white'); // 0xFFFFFF
```

### Available Colors

**Grays:** `slate`, `gray`, `zinc`, `neutral`, `stone`  
**Colors:** `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose`  
**Shades:** `50`, `100`, `200`, `300`, `400`, `500`, `600`, `700`, `800`, `900`, `950`

---

## 📏 Font Size System

### Semantic Sizing

Stop guessing font sizes and use semantic tokens:

```typescript
import { FontSizePicker } from 'phaser-wind';

// Get pixel values
const smallText = FontSizePicker.px('sm'); // 14
const normalText = FontSizePicker.px('md'); // 16
const largeTitle = FontSizePicker.px('3xl'); // 30

// Get CSS strings (perfect for Phaser)
const buttonText = FontSizePicker.css('lg'); // '18px'
const heroTitle = FontSizePicker.css('6xl'); // '60px'

// Get rem values (if needed)
const responsiveText = FontSizePicker.rem('xl'); // 1.25
```

### Font Size Scale

| Token | Pixels | Use Case                |
| ----- | ------ | ----------------------- |
| `xs`  | 12px   | Small labels, captions  |
| `sm`  | 14px   | Body text, descriptions |
| `md`  | 16px   | Default text size       |
| `lg`  | 18px   | Slightly larger text    |
| `xl`  | 20px   | Subheadings             |
| `2xl` | 24px   | Headings                |
| `3xl` | 30px   | Large headings          |
| `4xl` | 36px   | Hero text               |
| `5xl` | 48px   | Display text            |
| `6xl` | 60px   | Giant display text      |

---

## 💡 Real-World Examples

### Game UI Components

```typescript
import { ColorPicker, FontSizePicker } from 'phaser-wind';

export class GameScene extends Phaser.Scene {
  create() {
    // Main title
    this.add
      .text(400, 100, 'SPACE RAIDERS', {
        fontSize: FontSizePicker.css('5xl'),
        fill: ColorPicker.rgb('yellow-400'),
        stroke: ColorPicker.rgb('yellow-800'),
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    // Score display
    this.add.text(50, 50, 'Score: 12,500', {
      fontSize: FontSizePicker.css('xl'),
      fill: ColorPicker.rgb('green-400'),
    });

    // Health bar background
    const healthBg = this.add.graphics();
    healthBg.fillStyle(ColorPicker.hex('red-900'));
    healthBg.fillRect(50, 100, 200, 20);

    // Health bar fill
    const healthFill = this.add.graphics();
    healthFill.fillStyle(ColorPicker.hex('red-500'));
    healthFill.fillRect(52, 102, 156, 16); // 80% health

    // Game over screen
    this.add.rectangle(400, 300, 600, 400, ColorPicker.hex('slate-900'), 0.9);

    this.add
      .text(400, 250, 'GAME OVER', {
        fontSize: FontSizePicker.css('4xl'),
        fill: ColorPicker.rgb('red-500'),
      })
      .setOrigin(0.5);

    this.add
      .text(400, 320, 'Final Score: 12,500', {
        fontSize: FontSizePicker.css('2xl'),
        fill: ColorPicker.rgb('slate-300'),
      })
      .setOrigin(0.5);
  }
}
```

### Button System

```typescript
class GameButton {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string,
    variant: 'primary' | 'secondary' | 'danger' = 'primary'
  ) {
    const colors = {
      primary: {
        bg: ColorPicker.hex('blue-600'),
        bgHover: ColorPicker.hex('blue-700'),
        text: ColorPicker.rgb('white'),
      },
      secondary: {
        bg: ColorPicker.hex('slate-600'),
        bgHover: ColorPicker.hex('slate-700'),
        text: ColorPicker.rgb('slate-100'),
      },
      danger: {
        bg: ColorPicker.hex('red-600'),
        bgHover: ColorPicker.hex('red-700'),
        text: ColorPicker.rgb('white'),
      },
    };

    const style = colors[variant];

    // Background
    this.background = scene.add
      .rectangle(x, y, 200, 50, style.bg)
      .setInteractive()
      .on('pointerover', () => this.background.setFillStyle(style.bgHover))
      .on('pointerout', () => this.background.setFillStyle(style.bg));

    // Text
    this.text = scene.add
      .text(x, y, text, {
        fontSize: FontSizePicker.css('lg'),
        fill: style.text,
      })
      .setOrigin(0.5);
  }
}

// Usage
const playButton = new GameButton(this, 400, 200, 'PLAY', 'primary');
const settingsButton = new GameButton(this, 400, 280, 'SETTINGS', 'secondary');
const quitButton = new GameButton(this, 400, 360, 'QUIT', 'danger');
```

### Particle Effects with Color Harmony

```typescript
// Create harmonious particle effects
this.add.particles(player.x, player.y, 'sparkle', {
  speed: { min: 50, max: 100 },
  tint: [
    ColorPicker.hex('blue-400'),
    ColorPicker.hex('blue-500'),
    ColorPicker.hex('blue-600'),
    ColorPicker.hex('cyan-400'),
    ColorPicker.hex('cyan-500'),
  ],
  lifespan: 1000,
});
```

---

## 🎮 Integration with Phaser

### Scene Setup

```typescript
import { ColorPicker, FontSizePicker } from 'phaser-wind';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    // Background gradient effect
    const bg = this.add.graphics();
    bg.fillGradientStyle(
      ColorPicker.hex('slate-900'), // top-left
      ColorPicker.hex('slate-800'), // top-right
      ColorPicker.hex('slate-800'), // bottom-left
      ColorPicker.hex('slate-700') // bottom-right
    );
    bg.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);

    // Consistent UI elements
    this.createTitle();
    this.createMenu();
  }

  private createTitle() {
    this.add
      .text(this.cameras.main.centerX, 150, 'MY AWESOME GAME', {
        fontSize: FontSizePicker.css('4xl'),
        fill: ColorPicker.rgb('yellow-400'),
        stroke: ColorPicker.rgb('yellow-700'),
        strokeThickness: 3,
      })
      .setOrigin(0.5);
  }

  private createMenu() {
    const menuItems = ['Play', 'Options', 'Credits', 'Quit'];

    menuItems.forEach((item, index) => {
      this.add
        .text(this.cameras.main.centerX, 250 + index * 60, item, {
          fontSize: FontSizePicker.css('xl'),
          fill: ColorPicker.rgb('slate-300'),
        })
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerover', function () {
          this.setTint(ColorPicker.hex('yellow-400'));
        })
        .on('pointerout', function () {
          this.clearTint();
        });
    });
  }
}
```

---

## 🔧 Advanced Usage

### Custom Color Schemes

```typescript
// Create consistent themes
const darkTheme = {
  background: ColorPicker.hex('slate-900'),
  surface: ColorPicker.hex('slate-800'),
  primary: ColorPicker.hex('blue-500'),
  secondary: ColorPicker.hex('slate-600'),
  text: ColorPicker.rgb('slate-100'),
  textMuted: ColorPicker.rgb('slate-400'),
};

const lightTheme = {
  background: ColorPicker.hex('slate-50'),
  surface: ColorPicker.hex('white'),
  primary: ColorPicker.hex('blue-600'),
  secondary: ColorPicker.hex('slate-200'),
  text: ColorPicker.rgb('slate-900'),
  textMuted: ColorPicker.rgb('slate-600'),
};
```

### Responsive Text Sizing

```typescript
// Scale text based on screen size
const getResponsiveTextSize = (baseSize: FontSizeKey): string => {
  const scale = this.cameras.main.width / 1920; // Base on 1920px width
  const basePixels = FontSizePicker.px(baseSize);
  return `${Math.round(basePixels * scale)}px`;
};

this.add.text(x, y, 'Responsive Text', {
  fontSize: getResponsiveTextSize('2xl'),
  fill: ColorPicker.rgb('blue-500'),
});
```

---

## 🤝 Why "Wind" instead of "Tailwind"?

We love Tailwind CSS, but we're not affiliated with them. "Phaser Wind" captures the essence:

- **Wind** = Fast, natural, refreshing (like your development experience)
- **Wind** = Carries things forward (like your game development)
- **Wind** = Invisible but powerful (like good design tokens)

Plus, `phaser-wind` is way easier to type than `phaser-tailwind-css-design-tokens-for-games` 😉

---

## 📚 Compared to Raw Phaser

| Without Phaser Wind      | With Phaser Wind                     |
| ------------------------ | ------------------------------------ |
| `fill: '#3B82F6'`        | `fill: ColorPicker.rgb('blue-500')`  |
| `fontSize: '18px'`       | `fontSize: FontSizePicker.css('lg')` |
| `tint: 0x4ADE80`         | `tint: ColorPicker.hex('green-400')` |
| Magic numbers everywhere | Semantic, consistent tokens          |
| Color picking hell       | Harmonious color palettes            |
| Inconsistent sizing      | Perfect typography scale             |

---

## 🔮 Coming Soon

- 🎯 **Spacing System** - Consistent margins and padding tokens
- 📐 **Layout Utilities** - Flexbox-inspired alignment helpers
- 🎨 **Theme System** - Easy dark/light mode switching
- 📱 **Responsive Utilities** - Breakpoint-based design tokens
- ⚡ **Animation Presets** - Smooth, consistent transitions

---

## 🤝 Contributing

We'd love your help making Phaser Wind even better!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT © [CassinoDev](https://github.com/cassinodev)

---

## 🌟 Show Your Support

If Phaser Wind makes your game development life better, give us a ⭐ on GitHub!

**Happy Gaming!** 🎮✨

---

> _"Making Phaser development as enjoyable as Tailwind CSS"_
>
> — The Phaser Wind Team
