import{l as o,c as a}from"./showdown-BvUchQxB.js";const d={title:"PhaserWind",parameters:{docs:{description:{component:"Examples of how to install and use PhaserWind"}}}},r=()=>{const n=document.getElementById("phaser-wind-index");if(n)return n;const e=document.createElement("div");return e.id="phaser-wind-index",e.style.padding="1rem",e.style.fontFamily="sans-serif",e},s=`
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

`,t={render:()=>{o();const n=r();return a(s).then(e=>{n.innerHTML=e}),n}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: (): HTMLElement => {
    loadShowdown();
    const root = createContent();
    convertMarkdownToHtml(content).then(html => {
      root.innerHTML = html;
    });
    return root;
  }
}`,...t.parameters?.docs?.source}}};const m=["Index"];export{t as Index,m as __namedExportsOrder,d as default};
