import type { StorybookConfig } from '@storybook/html-vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
// eslint-disable-next-line import/no-named-as-default
import mdxIndexer from '@storybook/addon-docs/indexers/mdx';

const config: StorybookConfig = {
  framework: '@storybook/html-vite',
  stories: [
    '../src/**/*.stories.mdx',
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: ['@storybook/addon-essentials', '@storybook/addon-docs'],
  indexers: [mdxIndexer as any],
  docs: {
    defaultName: 'Docs',
    autodocs: true,
  },
  viteFinal: async config => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const hudiniSrc = path.resolve(__dirname, '..', '..', 'hudini', 'src');

    config.resolve = config.resolve || ({} as any);
    const currentAliases = (config.resolve as any).alias || [];
    (config.resolve as any).alias = [
      ...currentAliases,
      { find: 'hudini', replacement: hudiniSrc },
    ];

    config.optimizeDeps = config.optimizeDeps || ({} as any);
    const currentExclude = (config.optimizeDeps as any).exclude || [];
    (config.optimizeDeps as any).exclude = [...currentExclude, 'hudini'];

    return config;
  },
};

export default config;
