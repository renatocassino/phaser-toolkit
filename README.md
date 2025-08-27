# Phaser Toolkit

A comprehensive collection of tools and utilities for game development with Phaser.

## 📦 Packages

This monorepo contains a cohesive suite of TypeScript-first libraries for Phaser. Each package is focused, well-tested, and built to work great together or stand alone.

### Hudini — Magical UI components for Phaser

- Reusable HUD/UI building blocks (containers, buttons, panels) with delightful UX.
- Built on top of `phaser-wind` (theme tokens) and `font-awesome-for-phaser` (icons).
- Strongly typed APIs and ergonomic composition for game UIs.
- Live demos: [Storybook (Hudini)](https://renatocassino.github.io/phaser-toolkit/?path=/story/hudini--index)
- Read more: [Hudini README](https://github.com/renatocassino/phaser-toolkit/tree/main/packages/hudini#readme)

### phaser-wind — Theme system inspired by Tailwind

- Design tokens (colors, spacing, font sizes) and helpers for consistent styling.
- Easy light/dark theming; extend or override to match your game’s art direction.
- Foundation for other packages in this toolkit.
- Read more: [phaser-wind README](https://github.com/renatocassino/phaser-toolkit/tree/main/packages/phaser-wind#readme)

### font-awesome-for-phaser — Font Awesome icons in Phaser

- Use Font Awesome icons as text/sprites directly in your scenes.
- Zero friction rendering pipeline with sizing, color and stroke controls.
- Perfect companion for HUD elements and in-game indicators.
- Read more: [font-awesome-for-phaser README](https://github.com/renatocassino/phaser-toolkit/tree/main/packages/font-awesome-for-phaser#readme)

### phaser-hooks — React-style hooks for Phaser

- Declarative helpers to manage stateful game logic cleanly.
- Reduce boilerplate in Scenes and GameObjects with composable hooks.
- Type-safe utilities designed for Phaser lifecycles.
- Read more: [phaser-hooks README](https://github.com/renatocassino/phaser-toolkit/tree/main/packages/phaser-hooks#readme)

## 🚀 Getting started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Instalação

```bash
# Clone o repositório
git clone https://github.com/cassinodev/phaser-toolkit.git
cd phaser-toolkit

# Instale as dependências
pnpm install

# Construa todos os pacotes
pnpm build
```

### Scripts Disponíveis

- `pnpm build` - Builds all packages
- `pnpm test` - Runs tests across all packages
- `pnpm dev` - Starts development mode
- `pnpm lint` - Runs linting across all packages
- `pnpm typecheck` - Checks TypeScript types
- `pnpm clean` - Cleans previous builds
- `pnpm changeset` - Creates a new changeset for versioning
- `pnpm release` - Publishes new versions of packages

## 📋 Project Structure

```
phaser-toolkit/
├── packages/
├── apps/
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

## 🤝 Contribute

Contributions are always welcome! Please read our contribution guide before submitting a PR.

1. Fork the project
2. Create a branch for your feature (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**CassinoDev**

- Website: [games.cassino.dev](https://games.cassino.dev)
- GitHub: [@cassinodev](https://github.com/cassinodev)

## ⭐ Show your support

If this project helped you, please give it a ⭐ in the repository!
