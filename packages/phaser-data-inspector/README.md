# Phaser Data Inspector

Chrome extension for inspecting Phaser game data and state.

## Development

```bash
# Install dependencies
pnpm install

# Run dev mode with watch (builds to dist continuously)
pnpm dev

# Build for production
pnpm build
```

## Loading the Extension in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `dist` folder from this project
5. The extension should now appear in your extensions list

## Project Structure

```
phaser-data-inspector/
├── src/
│   ├── popup.html          # Shared UI (used by both popup and DevTools tab)
│   ├── inspector.ts        # Shared logic with Alpine.js
│   ├── devtools.html       # DevTools page (creates the tab)
│   ├── devtools.ts         # DevTools panel creation
│   ├── background.ts       # Background service worker
│   └── content.ts          # Content script injected into pages
├── public/
│   └── manifest.json       # Extension manifest
└── dist/                   # Build output (for Chrome)
```

## Features

- **DevTools Tab**: Custom tab in Chrome DevTools (like Redux DevTools)
- **Popup Button**: Clickable button in toolbar that opens popup
- **TypeScript**: Full type safety
- **Alpine.js**: Reactive UI framework

## Technologies

- **TypeScript** - Type-safe development
- **Vite** - Fast build tool with watch mode
- **Alpine.js** - Lightweight reactive framework for UI
