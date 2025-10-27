import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  output: 'static',
  site: 'https://phaser-toolkit.dev',
  integrations: [tailwind()],
  vite: {
    resolve: {
      alias: {
        'hudini': new URL('../hudini/src/index.ts', import.meta.url).pathname,
        'phaser-wind': new URL('../phaser-wind/src/index.ts', import.meta.url).pathname,
        'phaser-hooks': new URL('../phaser-hooks/src/index.ts', import.meta.url).pathname,
        'phaser-sound-studio': new URL('../phaser-sound-studio/src/index.ts', import.meta.url).pathname,
        'phaser-virtual-joystick': new URL('../phaser-virtual-joystick/src/index.ts', import.meta.url).pathname,
        'font-awesome-for-phaser': new URL('../font-awesome-for-phaser/src/index.ts', import.meta.url).pathname,
      }
    }
  }
});