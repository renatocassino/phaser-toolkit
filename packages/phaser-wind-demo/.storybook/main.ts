import type { StorybookConfig } from '@storybook/html-vite';

const config: StorybookConfig = {
  framework: {
    name: '@storybook/html-vite',
    options: {},
  },
  stories: ['../src/**/*.stories.@(ts|js)'],
  addons: [],
  core: {},
  docs: {
    autodocs: true,
  },
};

export default config;
