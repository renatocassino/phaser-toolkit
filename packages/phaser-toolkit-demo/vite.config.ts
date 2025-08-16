import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

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
      'phaser-wind': resolve(__dirname, '../phaser-wind/src/index.ts'),
      'font-awesome-for-phaser': resolve(
        __dirname,
        '../font-awesome-for-phaser/src/index.ts'
      ),
    },
  },
});
