/* eslint-disable max-lines-per-function */
/* eslint-disable no-magic-numbers */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable max-lines */
/* eslint-disable complexity */
import type { Meta, StoryObj } from '@storybook/html';

import { convertMarkdownToHtml, loadShowdown } from '../helpers/showdown';

const meta: Meta = {
  title: 'Phaser Sound Studio',
  parameters: {
    docs: {
      description: {
        component: 'Examples of how to install and use Phaser Sound Studio',
      },
    },
  },
};
export default meta;

const createContent = (): HTMLDivElement => {
  const root = document.getElementById('phaser-sound-studio-index');
  if (root) {
    return root as HTMLDivElement;
  }

  const container = document.createElement('div');
  container.id = 'phaser-sound-studio-index';
  container.style.padding = '1rem';
  container.style.fontFamily = 'sans-serif';
  return container;
};

const content = `
# Phaser Sound Studio

Phaser Sound Studio is a powerful utility library designed to enhance your Phaser 3 game development experience by providing a collection of UI components and tools built on top of PhaserWind.

## Features

- **UI Components**: Ready-to-use UI elements optimized for Phaser games
- **Theme Integration**: Seamless integration with PhaserWind theming system
- **Layout Management**: Flexible layout system for organizing game UI
- **Component Library**: Rich set of pre-built components for common UI needs
- **Customization**: Easy theme customization and component styling

## Getting Started

Install Phaser Sound Studio using npm:

\`\`\`bash
npm install phaser-sound-studio
\`\`\`

Import and use in your Phaser game:

\`\`\`typescript
import { PhaserSoundStudioPlugin, PHASER_SOUND_STUDIO_KEY } from 'phaser-sound-studio';

// Initialize Phaser Sound Studio
const game = new Phaser.Game({
    // ... your game config
    plugins: {
        global: [
            {
                key: PHASER_SOUND_STUDIO_KEY,
                plugin: PhaserSoundStudioPlugin,
                mapping: PHASER_SOUND_STUDIO_KEY,
                data: { darkMode: false }
            }
        ]
    }
});
\`\`\`

## Documentation

Browse through our examples and documentation to learn more about Phaser Sound Studio's features and capabilities. Each component is thoroughly documented with practical examples to help you get started quickly.

## Contributing

We welcome contributions! If you have suggestions or want to contribute to the project, please visit our [GitHub repository](https://github.com/renatocassino/phaser-toolkit).

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
