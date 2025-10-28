# Font Awesome for Phaser

[![NPM Version](https://img.shields.io/npm/v/phaser-wind)](https://www.npmjs.com/package/phaser-wind)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

Main utilities and types for game development with Phaser.

You can check a small demo [clicking here](https://stackblitz.com/edit/vitejs-vite-i6wesnmm?ctl=1&embed=1&file=src%2Fmain.ts&view=preview&startScript=dev).

## 📦 Instalação

```bash
npm install font-awesome-for-phaser
# or
pnpm add font-awesome-for-phaser
# or
yarn add font-awesome-for-phaser
```

## 🌐 UMD/CDN (JavaScript)

If you prefer not to use TypeScript or want to include the library via CDN, you can use the UMD build:

```html
<script src="https://cdn.jsdelivr.net/npm/font-awesome-for-phaser@0.9.0/dist/font-awesome-for-phaser.min.js"></script>
```

The library will be available globally as `window.FontAwesomeForPhaser`. You can use it like this:

```javascript
// Load the font
await window.FontAwesomeForPhaser.loadFont();
```

> **⚠️ Note**: While UMD builds are available, we **strongly recommend using TypeScript** for better type safety, IntelliSense, and development experience. The TypeScript version provides better error detection and autocomplete features.

## 🚀 Add to your project

First, you must have the free font awesome imported in your page.

```ts
import { loadFont } from 'font-awesome-for-phaser';
import type Phaser from 'phaser';

const config: Phaser.Types.Core.GameConfig = {
  //......
};

loadFont().then(() => {
  new Game(config);
})

// or
async function startGame() {
  await loadFont();

  new Game(config);
}
```

If you want to use self-hosted fonts, you can pass a URL pointing to your `all.min.css` file:

```ts
loadFont('/fonts/font-awesome/all.min.css').then(() => {
  new Game(config);
})
```

## Usage

You can use Font Awesome icons in your Phaser game in two ways:

### Using icon as text

```typescript
import { getIconChar } from 'font-awesome-for-phaser';

// .....
const iconText = scene.add.text(0, 0, char, {
  font: `36px 'FontAwesome'`, // IMPORTANT! The name of the font MUST BE between char ('), if you use `font: '36px FontAwesome', won't work
  color: '#ffffff',
});
// PS: The font should be 'FontAwesome', or 'Font Awesome 7 Free' or 'Font Awesome 7 Brands'. Depends of the char

iconText.setOrigin(0.5);
scene.add.existing(iconText);

// Or you can use our component
import { IconText } from 'font-awesome-for-phaser';

// PS: `this` is the scene
const icon = new IconText(this, 90, 90, 'gamepad', 64, {
  color: '#0066cc',
  iconStyle: 'solid', // 'solid' | 'regular' | 'brands';
});
this.add.existing(icon); // Don't forget to add in scene
```

<img src="data/image.png" alt="example of button">

## Documentation

You can read the full documentation in [this link](https://toolkit.cassino.dev/font-awesome-for-phaser/guides/getting-started/).
