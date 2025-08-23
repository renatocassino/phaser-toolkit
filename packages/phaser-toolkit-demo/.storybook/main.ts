import type { StorybookConfig } from '@storybook/html-vite';
import { fileURLToPath } from 'node:url';

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

const config: StorybookConfig = {
  framework: {
    name: '@storybook/html-vite',
    options: {},
  },
  stories: ['../src/**/*.stories.@(ts|js)'],
  addons: ['@storybook/addon-essentials'],
  core: {},
  docs: {
    autodocs: true,
  },
  viteFinal: async (config) => {
    config.resolve = config.resolve ?? {};
    const existingAlias = (config.resolve as any).alias ?? {};
    (config.resolve as any).alias = {
      ...existingAlias,
      'phaser-wind': r('../../phaser-wind/src/index.ts'),
      'font-awesome-for-phaser': r('../../font-awesome-for-phaser/src/index.ts'),
      hudini: r('../../hudini/src/index.ts'),
    };
    config.optimizeDeps = config.optimizeDeps || {};
    config.optimizeDeps.include = [
      ...(config.optimizeDeps.include || []),
      'phaser',
    ];

    return config;
  },
};

export default config;
