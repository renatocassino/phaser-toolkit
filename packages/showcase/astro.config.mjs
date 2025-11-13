import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// Base path para GitHub Pages
// Por padrão usa /phaser-toolkit/ para funcionar com GitHub Pages padrão
// Se o domínio customizado estiver apontando para a raiz, sobrescreva com ASTRO_BASE=/
// Exemplo: ASTRO_BASE=/ pnpm build
// Em localhost, use ASTRO_BASE=/ para desenvolvimento local
const base = process.env.ASTRO_BASE || '/phaser-toolkit/';

export default defineConfig({
  output: 'static',
  site: 'https://phaser-toolkit.dev',
  base: base,
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