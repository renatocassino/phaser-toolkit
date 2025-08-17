/* eslint-disable max-lines-per-function */
/* eslint-disable no-magic-numbers */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable max-lines */
/* eslint-disable complexity */
import type { Meta, StoryObj } from '@storybook/html';

import { convertMarkdownToHtml, loadShowdown } from '../helpers/showdown';

const meta: Meta = {
    title: 'Font Awesome For Phaser',
    parameters: {
        docs: {
            description: {
                component: 'Examples of how to install and use PhaserWind',
            },
        },
    },
};
export default meta;

const createContent = (): HTMLDivElement => {
    const root = document.getElementById('phaser-wind-index');
    if (root) {
        return root as HTMLDivElement;
    }

    const container = document.createElement('div');
    container.id = 'phaser-wind-index';
    container.style.padding = '1rem';
    container.style.fontFamily = 'sans-serif';
    return container;
};

const content = `
# Font Awesome For Phaser

Font Awesome For Phaser is a library that enables you to easily use Font Awesome icons in your Phaser 3 games. It provides a simple way to render Font Awesome icons as game objects with full support for different styles and customization.

## Features

- **Easy Integration**: Simple API to add Font Awesome icons to your Phaser games
- **Multiple Icon Styles**: Support for Solid, Regular and Brands icon styles
- **Customization**: Control icon size, color and other text properties
- **Performance**: Optimized font loading and rendering
- **Type Safety**: Full TypeScript support with icon name suggestions

## Getting Started

Install Font Awesome For Phaser using npm:

\`\`\`bash
npm install font-awesome-for-phaser
\`\`\`

Import and use in your Phaser game:

\`\`\`typescript
import { IconText, loadFont } from 'font-awesome-for-phaser';

// Load the font first
await loadFont();

// Create an icon in your scene
const icon = new IconText({
    scene: this,
    x: 300,
    y: 200,
    icon: 'house',
    iconStyle: 'regular', // 'solid' | 'regular' | 'brands'
    size: 64,
    style: { color: '#ffffff' }
});
this.add.existing(icon);
\`\`\`

## Documentation

Check out our examples and documentation to learn more about Font Awesome For Phaser's features. Each component is documented with practical examples to help you get started quickly.

## Contributing

We welcome contributions! If you have suggestions or want to contribute to the project, please visit our GitHub repository.

`;

export const Index: StoryObj = {
    render: (): HTMLElement => {
        loadShowdown();
        const root = createContent();

        convertMarkdownToHtml(content).then((html) => {
            root.innerHTML = html;
        });

        return root;
    },
};
