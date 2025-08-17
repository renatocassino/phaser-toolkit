/* eslint-disable max-lines-per-function */
/* eslint-disable no-magic-numbers */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable max-lines */
/* eslint-disable complexity */
import type { Meta, StoryObj } from '@storybook/html';

import { convertMarkdownToHtml, loadShowdown } from '../helpers/showdown';

const meta: Meta = {
    title: 'PhaserWind',
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
# PhaserWind

PhaserWind is a powerful utility library designed to enhance your Phaser 3 game development experience by providing a collection of useful tools and components.

## Features

- **Scene Management**: Simplified scene transitions and state management
- **UI Components**: Ready-to-use UI elements optimized for Phaser games
- **Input Handling**: Enhanced input management for keyboard, mouse, and touch
- **Animation Tools**: Utilities to create and manage animations more easily
- **Asset Management**: Better control over game assets loading and handling

## Getting Started

Install PhaserWind using npm:

\`\`\`bash
npm install phaser-wind
\`\`\`

Import and use in your Phaser game:

\`\`\`typescript
import { PhaserWind } from 'phaser-wind';

// Initialize PhaserWind
const game = new Phaser.Game({
    // ... your game config
    plugins: {
        global: [
            { key: 'PhaserWind', plugin: PhaserWind, start: true }
        ]
    }
});
\`\`\`

## Documentation

Browse through our examples and documentation to learn more about PhaserWind's features and capabilities. Each component is thoroughly documented with practical examples to help you get started quickly.

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
