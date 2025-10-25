/* eslint-disable max-lines-per-function */
/* eslint-disable no-magic-numbers */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable max-lines */
/* eslint-disable complexity */
import type { Meta, StoryObj } from '@storybook/html';

import { convertMarkdownToHtml, loadShowdown } from '../helpers/showdown';

const meta: Meta = {
    title: 'Phaser Virtual Joystick',
    parameters: {
        docs: {
            description: {
                component: 'Examples of how to install and use Phaser Virtual Joystick',
            },
        },
    },
};
export default meta;

const createContent = (): HTMLDivElement => {
    const root = document.getElementById('phaser-virtual-joystick-index');
    if (root) {
        return root as HTMLDivElement;
    }

    const container = document.createElement('div');
    container.id = 'phaser-virtual-joystick-index';
    container.style.padding = '1rem';
    container.style.fontFamily = 'sans-serif';
    return container;
};

const content = `
# Phaser Virtual Joystick

Phaser Virtual Joystick is a touch-friendly virtual joystick component for Phaser 3 games that provides smooth analog input control for mobile devices and touch screens.

## Features

- **Touch-Optimized**: Designed specifically for touch devices and mobile gaming
- **Analog Input**: Provides smooth analog control with normalized values (-1 to 1)
- **Auto-Following**: Automatically follows your finger when dragged beyond joystick limits
- **Customizable**: Fully customizable appearance with different colors, sizes, and styles
- **Bounds Control**: Define specific areas where the joystick can be activated
- **Event System**: Comprehensive event system for press, move, and release events
- **Button Integration**: Smart detection to avoid conflicts with UI buttons

## Getting Started

Install Phaser Virtual Joystick using npm:

\`\`\`bash
npm install phaser-virtual-joystick
\`\`\`

Import and use in your Phaser game:

\`\`\`typescript
import { VirtualJoystick } from 'phaser-virtual-joystick';

class GameScene extends Phaser.Scene {
    create() {
        // Create a virtual joystick with default settings
        const joystick = new VirtualJoystick({
            scene: this
        });

        // Listen to joystick events
        joystick.on('move', (data) => {
            console.log(\`Joystick position: \${data.x}, \${data.y}\`);
        });

        joystick.on('press', () => {
            console.log('Joystick pressed');
        });

        joystick.on('release', () => {
            console.log('Joystick released');
        });
    }
}
\`\`\`

## Configuration Options

### Basic Configuration

\`\`\`typescript
const joystick = new VirtualJoystick({
    scene: this,
    bounds: {
        topLeft: { x: 0, y: 100 },
        bottomRight: { x: 400, y: 600 }
    }
});
\`\`\`

### Custom Styling

\`\`\`typescript
const joystick = new VirtualJoystick({
    scene: this,
    deadZone: {
        radius: 20,
        alpha: 0.3,
        fillColor: 0x000000,
        strokeColor: 0xffffff,
        strokeWidth: 2
    },
    baseArea: {
        radius: 60,
        alpha: 0.2,
        fillColor: 0x333333,
        strokeColor: 0x666666,
        strokeWidth: 1
    },
    stick: {
        radius: 15,
        alpha: 0.8,
        fillColor: 0xffffff,
        strokeColor: 0x000000,
        strokeWidth: 2
    }
});
\`\`\`

### With Custom Icon

\`\`\`typescript
// Create a custom icon for the stick
const stickIcon = this.add.text(0, 0, '🎮', {
    fontSize: '24px',
    color: '#ffffff'
});

const joystick = new VirtualJoystick({
    scene: this,
    stickIcon: stickIcon
});
\`\`\`

## Event Handling

The Virtual Joystick emits three types of events:

### Move Event
Fired continuously while the joystick is being moved:

\`\`\`typescript
joystick.on('move', (data) => {
    // data.x and data.y are normalized values between -1 and 1
    player.setVelocity(data.x * 200, data.y * 200);
});
\`\`\`

### Press Event
Fired when the joystick is first pressed:

\`\`\`typescript
joystick.on('press', () => {
    console.log('Joystick activated');
});
\`\`\`

### Release Event
Fired when the joystick is released:

\`\`\`typescript
joystick.on('release', () => {
    console.log('Joystick deactivated');
    player.setVelocity(0, 0);
});
\`\`\`

## Advanced Features

### Custom Bounds
Define specific areas where the joystick can be activated:

\`\`\`typescript
const joystick = new VirtualJoystick({
    scene: this,
    bounds: {
        topLeft: { x: 0, y: 0 },
        bottomRight: { x: this.cameras.main.width / 2, y: this.cameras.main.height }
    }
});
\`\`\`

### Button Integration
The joystick automatically detects and avoids conflicts with interactive UI elements:

\`\`\`typescript
// Create buttons that won't interfere with joystick
const button = this.add.text(100, 100, 'Button', {
    backgroundColor: '#4A5568',
    padding: { x: 20, y: 10 }
}).setInteractive();

// The joystick will not activate when touching this button
\`\`\`

## Best Practices

1. **Touch-Only**: Only create joysticks on touch-enabled devices
2. **Bounds**: Use appropriate bounds to avoid conflicts with UI elements
3. **Performance**: The joystick automatically handles performance optimization
4. **Cleanup**: Always destroy joysticks when switching scenes

\`\`\`typescript
class GameScene extends Phaser.Scene {
    private joystick?: VirtualJoystick;

    create() {
        if (this.sys.game.device.input.touch) {
            this.joystick = new VirtualJoystick({
                scene: this
            });
        }
    }

    destroy() {
        if (this.joystick) {
            this.joystick.destroy();
        }
    }
}
\`\`\`

## Documentation

Browse through our examples and documentation to learn more about Phaser Virtual Joystick's features and capabilities. Each example is thoroughly documented with practical use cases to help you get started quickly.

## Contributing

We welcome contributions! If you have suggestions or want to contribute to the project, please visit our GitHub repository.

`;

export const Index: StoryObj = {
    render: (): HTMLElement => {
        loadShowdown();
        const root = createContent();

        convertMarkdownToHtml(content).then(html => {
            root.innerHTML = html;
        });

        return root;
    },
};
