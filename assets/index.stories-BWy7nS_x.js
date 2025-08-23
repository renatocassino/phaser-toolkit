import{l as o,c as i}from"./showdown-BvUchQxB.js";const d={title:"Hudini",parameters:{docs:{description:{component:"Examples of how to install and use Hudini"}}}},r=()=>{const n=document.getElementById("hudini-index");if(n)return n;const e=document.createElement("div");return e.id="hudini-index",e.style.padding="1rem",e.style.fontFamily="sans-serif",e},a=`
# Hudini

Hudini is a powerful utility library designed to enhance your Phaser 3 game development experience by providing a collection of UI components and tools built on top of PhaserWind.

## Features

- **UI Components**: Ready-to-use UI elements optimized for Phaser games
- **Theme Integration**: Seamless integration with PhaserWind theming system
- **Layout Management**: Flexible layout system for organizing game UI
- **Component Library**: Rich set of pre-built components for common UI needs
- **Customization**: Easy theme customization and component styling

## Getting Started

Install Hudini using npm:

\`\`\`bash
npm install hudini
\`\`\`

Import and use in your Phaser game:

\`\`\`typescript
import { HudiniPlugin, HUDINI_KEY } from 'hudini';

// Initialize Hudini
const game = new Phaser.Game({
    // ... your game config
    plugins: {
        global: [
            {
                key: HUDINI_KEY,
                plugin: HudiniPlugin,
                mapping: HUDINI_KEY,
                data: { darkMode: false }
            }
        ]
    }
});
\`\`\`

## Documentation

Browse through our examples and documentation to learn more about Hudini's features and capabilities. Each component is thoroughly documented with practical examples to help you get started quickly.

## Contributing

We welcome contributions! If you have suggestions or want to contribute to the project, please visit our GitHub repository.

`,t={render:()=>{o();const n=r();return i(a).then(e=>{n.innerHTML=e}),n}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: (): HTMLElement => {
    loadShowdown();
    const root = createContent();
    convertMarkdownToHtml(content).then(html => {
      root.innerHTML = html;
    });
    return root;
  }
}`,...t.parameters?.docs?.source}}};const m=["Index"];export{t as Index,m as __namedExportsOrder,d as default};
