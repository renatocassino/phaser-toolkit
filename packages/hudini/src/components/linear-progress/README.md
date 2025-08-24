# LinearProgress Component

A customizable linear progress bar component for Phaser games using the phaser-wind design system.

## Features

- **Determinate Progress**: Shows specific progress from 0-100%
- **Indeterminate Progress**: Shows loading animation with a smaller bar (30% width) moving left to right in infinite loop
- **Phaser-Wind Integration**: Uses color tokens and radius tokens from phaser-wind
- **Customizable Appearance**: Configurable colors, border radius, and dimensions
- **Animation Support**: Smooth progress transitions with configurable animation

## Usage

### Basic Progress Bar

```typescript
import { LinearProgress } from 'hudini';

const progressBar = new LinearProgress({
  scene,
  x: 400,
  y: 100,
  width: 300,
  height: 8,
  backgroundColor: 'gray-200',
  progressColor: 'blue-500',
  borderRadius: 'default',
  progress: 50,
});

scene.add.existing(progressBar);
```

### Indeterminate Progress Bar

```typescript
// Creates a loading bar where a smaller bar (30% of total width) 
// moves left to right within the background bounds
const loadingBar = new LinearProgress({
  scene,
  x: 400,
  y: 200,
  width: 300,
  height: 8,
  backgroundColor: 'gray-200',
  progressColor: 'purple-500',
  borderRadius: 'full',
  indeterminate: true,
});

scene.add.existing(loadingBar);
```

## API Reference

### Constructor Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `scene` | `Scene` | - | The Phaser scene this component belongs to |
| `x` | `number` | - | X coordinate of the progress bar |
| `y` | `number` | - | Y coordinate of the progress bar |
| `width` | `number` | - | Width of the progress bar in pixels |
| `height` | `number` | - | Height of the progress bar in pixels |
| `backgroundColor` | `ColorToken` | `'gray-200'` | Background color using phaser-wind color tokens |
| `progressColor` | `ColorToken` | `'blue-500'` | Progress fill color using phaser-wind color tokens |
| `borderRadius` | `RadiusKey \| number` | `'default'` | Border radius using phaser-wind radius tokens or pixels |
| `progress` | `number` | `0` | Initial progress value (0-100) |
| `indeterminate` | `boolean` | `false` | Whether to show indeterminate loading animation |

### Methods

#### `setProgress(progress: number, animate?: boolean): this`
Sets the progress value (0-100). Only works for determinate progress bars.
- `progress`: Progress value between 0 and 100
- `animate`: Whether to animate the change (default: true)

#### `getProgress(): number`
Returns the current progress value.

#### `setIndeterminate(indeterminate: boolean): this`
Switches between determinate and indeterminate modes.
- `indeterminate`: Whether to show indeterminate animation

#### `setBorderRadius(borderRadius: RadiusKey | number): this`
Updates the border radius of the progress bar.
- `borderRadius`: Border radius token or pixel value

#### `setBackgroundColor(color: ColorToken): this`
Updates the background color of the progress bar.
- `color`: Background color token

#### `setProgressColor(color: ColorToken): this`
Updates the progress fill color.
- `color`: Progress color token

## Color Tokens

The component uses phaser-wind color tokens. Examples include:
- `'gray-200'`, `'gray-500'`, `'gray-800'`
- `'blue-400'`, `'blue-500'`, `'blue-600'`
- `'green-500'`, `'red-500'`, `'purple-500'`
- `'black'`, `'white'`

## Radius Tokens

The component supports phaser-wind radius tokens:
- `'none'` (0px)
- `'sm'` (2px)
- `'default'` (4px)
- `'md'` (6px)
- `'lg'` (8px)
- `'xl'` (12px)
- `'2xl'` (16px)
- `'3xl'` (24px)
- `'full'` (9999px - fully rounded)

## Examples

See `example.ts` for comprehensive usage examples including:
- Basic determinate progress bars
- Indeterminate loading animations
- Dynamic color changes
- Progress animation over time