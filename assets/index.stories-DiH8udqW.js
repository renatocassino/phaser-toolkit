import{l as o,c as s}from"./showdown-BvUchQxB.js";const l={title:"Phaser Hooks",parameters:{docs:{description:{component:"Examples of how to install and use Phaser Hooks"}}}},n=()=>{const t=document.getElementById("phaser-hooks-index");if(t)return t;const e=document.createElement("div");return e.id="phaser-hooks-index",e.style.padding="1rem",e.style.fontFamily="sans-serif",e},r=`
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

`,a={render:()=>{o();const t=n();return s(r).then(e=>{t.innerHTML=e}),t}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: (): HTMLElement => {
    loadShowdown();
    const root = createContent();
    convertMarkdownToHtml(content).then(html => {
      root.innerHTML = html;
    });
    return root;
  }
}`,...a.parameters?.docs?.source}}};const c=["Index"];export{a as Index,c as __namedExportsOrder,l as default};
