# Phaser Toolkit Showcase

A modern, static showcase for the Phaser Toolkit ecosystem built with Astro and SSG (Static Site Generation).

## 🚀 Features

- **Static Site Generation**: Fast, SEO-friendly static pages
- **Modern UI**: Beautiful interface with Tailwind CSS
- **Interactive Demos**: Live Phaser game examples
- **Component Documentation**: Comprehensive component guides
- **Mobile Responsive**: Works perfectly on all devices
- **TypeScript Support**: Full TypeScript integration

## 📦 Components Showcased

### Hudini
- Card Component
- Text Button
- Icon Button
- Flat Icon Button
- Section Header
- Circular Progress
- Linear Progress
- Radial Progress
- Column & Row Layout
- Sized Box

### Phaser Wind
- Button Component
- Theming System
- Design Tokens

### Phaser Hooks
- useGame Hook
- Global State Management
- Local State Management

### Phaser Sound Studio
- Audio Management
- Music System
- Sound Effects

### Phaser Virtual Joystick
- Touch Controls
- Mobile Optimization

### Font Awesome for Phaser
- Icon Integration
- Scalable Icons

## 🛠️ Development

### Prerequisites

- Node.js 18+
- pnpm (recommended)

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Project Structure

```
src/
├── components/          # Reusable Astro components
│   └── PhaserGame.astro # Phaser game container component
├── layouts/            # Page layouts
│   └── Layout.astro    # Main layout with sidebar
├── pages/              # Astro pages (file-based routing)
│   ├── index.astro     # Home page
│   ├── hudini/         # Hudini component pages
│   ├── phaser-wind/    # Phaser Wind pages
│   ├── phaser-hooks/   # Phaser Hooks pages
│   ├── phaser-sound-studio/    # Sound Studio pages
│   ├── phaser-virtual-joystick/ # Virtual Joystick pages
│   └── font-awesome-for-phaser/ # Font Awesome pages
└── styles/             # Global styles
```

## 🎮 Interactive Demos

Each component page includes:

- **Live Examples**: Interactive Phaser games demonstrating the component
- **Code Snippets**: Copy-paste ready code examples
- **Props Documentation**: Complete API reference
- **Features Overview**: Key capabilities and benefits

## 🎨 Styling

The showcase uses Tailwind CSS for styling with a custom design system:

- **Primary Colors**: Blue-based color palette
- **Typography**: Inter font family
- **Layout**: Responsive grid system
- **Components**: Custom component styles

## 📱 Mobile Support

The showcase is fully responsive and works great on:

- Desktop computers
- Tablets
- Mobile phones
- Touch devices

## 🚀 Deployment

The showcase is built for static deployment and can be deployed to:

- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

### Build Command

```bash
pnpm build
```

The built files will be in the `dist/` directory.

## 🔧 Configuration

### Astro Configuration

The showcase is configured in `astro.config.mjs` with:

- Static site generation
- Tailwind CSS integration
- Vite aliases for local packages
- TypeScript support

### Tailwind Configuration

Custom Tailwind configuration in `tailwind.config.mjs` with:

- Custom color palette
- Extended theme
- Component-specific styles

## 📚 Documentation

Each component page includes:

1. **Overview**: What the component does
2. **Features**: Key capabilities
3. **Props**: Complete API reference
4. **Live Demo**: Interactive example
5. **Code Example**: Usage code
6. **Installation**: How to install

## 🤝 Contributing

To add new components to the showcase:

1. Create a new page in the appropriate directory
2. Add the component to the sidebar navigation
3. Include interactive demos and code examples
4. Update the home page overview

## 📄 License

This showcase is part of the Phaser Toolkit project and follows the same license terms.