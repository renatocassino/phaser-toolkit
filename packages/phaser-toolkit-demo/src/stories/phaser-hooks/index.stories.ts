/* eslint-disable max-lines-per-function */
/* eslint-disable no-magic-numbers */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable max-lines */
/* eslint-disable complexity */
import type { Meta, StoryObj } from '@storybook/html';

import { convertMarkdownToHtml, loadShowdown } from '../helpers/showdown';

const meta: Meta = {
    title: 'Phaser Hooks',
    parameters: {
        docs: {
            description: {
                component: 'Examples of how to install and use Phaser Hooks',
            },
        },
    },
};
export default meta;

const createContent = (): HTMLDivElement => {
    const root = document.getElementById('phaser-hooks-index');
    if (root) {
        return root as HTMLDivElement;
    }

    const container = document.createElement('div');
    container.id = 'phaser-hooks-index';
    container.style.padding = '1rem';
    container.style.fontFamily = 'sans-serif';
    return container;
};

const content = `
# Phaser Hooks

Phaser Hooks is a powerful state management library designed to enhance your Phaser 3 game development experience by providing React-like hooks for managing game state and logic.

## Features

- **State Management**: React-like hooks for managing game state
- **Global State**: Shared state across scenes and components
- **Local State**: Component-specific state management
- **Computed State**: Derived state based on other state values
- **Persistent State**: State that persists across game sessions
- **Undoable State**: State with undo/redo functionality
- **Debounced State**: State updates with debouncing capabilities
- **Batch Updates**: Efficient state updates with batching

## Getting Started

Install Phaser Hooks using npm:

\`\`\`bash
npm install phaser-hooks
\`\`\`

Import and use in your Phaser game:

\`\`\`typescript
import { PhaserHooksPlugin, PHASER_HOOKS_KEY } from 'phaser-hooks';

// Initialize Phaser Hooks
const game = new Phaser.Game({
    // ... your game config
    plugins: {
        global: [
            {
                key: PHASER_HOOKS_KEY,
                plugin: PhaserHooksPlugin,
                mapping: PHASER_HOOKS_KEY
            }
        ]
    }
});
\`\`\`

## Available Hooks

- **useLocalState**: Manage local component state
- **useGlobalState**: Access and modify global state
- **useComputedState**: Create derived state values
- **usePersistentState**: State that persists in localStorage
- **useUndoableState**: State with undo/redo history
- **useDebouncedState**: Debounced state updates
- **useStateDef**: Define state with validation and defaults

## Example Usage

\`\`\`typescript
import { useLocalState, useGlobalState } from 'phaser-hooks';

class GameScene extends Phaser.Scene {
    create() {
        // Local state for this scene
        const [score, setScore] = useLocalState(this, 0);
        
        // Global state shared across scenes
        const [playerHealth, setPlayerHealth] = useGlobalState('player.health', 100);
        
        // Update state
        setScore(score + 10);
        setPlayerHealth(playerHealth - 5);
    }
}
\`\`\`

## Documentation

Browse through our examples and documentation to learn more about Phaser Hooks' features and capabilities. Each hook is thoroughly documented with practical examples to help you get started quickly.

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
