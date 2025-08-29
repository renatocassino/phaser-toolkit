import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  server: {
    port: 5173,
    open: false,
  },
  build: {
    target: 'esnext',
  },
  resolve: {
    alias: {
      crypto: 'crypto-browserify',
      'phaser-wind': resolve(__dirname, '../phaser-wind/src/index.ts'),
      'phaser-sound-studio': resolve(
        __dirname,
        '../phaser-sound-studio/src/index.ts'
      ),
      'phaser-hooks': resolve(__dirname, '../phaser-hooks/src/index.ts'),
      'font-awesome-for-phaser': resolve(
        __dirname,
        '../font-awesome-for-phaser/src/index.ts'
      ),
      'hudini': resolve(__dirname, '../hudini/src/index.ts'),
    },
  },
});
