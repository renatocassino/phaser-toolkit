# Phaser Toolkit

A modern monorepo to supercharge Phaser game development. It bundles design tokens (Tailwind-inspired), a UI/HUD layer, utility helpers, Font Awesome integration, and a Storybook demo — all strongly typed and built with TypeScript.

## Packages

- phaser-wind: Tailwind-like design tokens (color, font size, spacing, radius, shadow) and a global plugin for Phaser scenes. Strong typing out of the box, optional theme system.
  - Read more: packages/phaser-wind/README.md
- hudini: HUD/UI building blocks for Phaser, designed to work seamlessly with phaser-wind tokens (WIP but already useful).
  - Read more: packages/hudini/README.md
- phaser-hooks: Practical utilities and lifecycle helpers to make Phaser code cleaner and more maintainable.
  - Read more: packages/phaser-hooks/README.md
- font-awesome-for-phaser: Use Font Awesome icons as text in Phaser with a tiny helper API and a ready-to-use IconText object.
  - Read more: packages/font-awesome-for-phaser/README.md
- phaser-toolkit-demo: Storybook HTML that demonstrates the packages with live, runnable examples.
  - Run locally: pnpm -C packages/phaser-toolkit-demo storybook

## Why this toolkit?

- Strongly typed design tokens you can trust
- Theme plugin that brings tokens directly into your scenes (scene.pw)
- Reusable HUD/UI pieces and helpers to speed up common tasks
- Docs and live examples via Storybook
- TypeScript-first, Phaser-focused DX

## Getting started

- Requirements
  - Node.js >= 18
  - pnpm >= 8

- Install dependencies

```bash
pnpm install
```

- Build all packages

```bash
pnpm build
```

- Launch Storybook demo

```bash
pnpm -C packages/phaser-toolkit-demo storybook
```

## Development flow

- Validate all packages (lint, typecheck, tests)

```bash
pnpm validate
```

- Work on a specific package

```bash
pnpm -C packages/phaser-wind dev
pnpm -C packages/hudini dev
```

- Typecheck / Test / Lint (per package)

```bash
pnpm -C packages/phaser-wind typecheck
pnpm -C packages/phaser-wind test
pnpm -C packages/phaser-wind lint
```

## Repository structure

```
phaser-toolkit/
├── packages/
│   ├── phaser-wind/
│   ├── hudini/
│   ├── phaser-hooks/
│   ├── font-awesome-for-phaser/
│   └── phaser-toolkit-demo/
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

## Contributing

Contributions are welcome! Please open an issue or a PR. For larger changes, feel free to start a discussion first.

## License

MIT — see LICENSE.
