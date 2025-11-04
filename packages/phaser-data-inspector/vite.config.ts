import { defineConfig } from 'vite';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, existsSync, readdirSync, statSync, unlinkSync, rmdirSync } from 'fs';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup.html'),
        background: resolve(__dirname, 'src/background.ts'),
        content: resolve(__dirname, 'src/content.ts'),
        devtools: resolve(__dirname, 'src/devtools.html'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === 'background' || chunkInfo.name === 'content'
            ? '[name].js'
            : 'assets/[name]-[hash].js';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          // Keep HTML files at root level (needed for Chrome extension)
          if (assetInfo.name === 'popup.html' || 
              assetInfo.name === 'devtools.html') {
            return '[name][extname]';
          }
          return 'assets/[name]-[hash].[ext]';
        },
      },
    },
    // Ensure popup.html is processed correctly
    minify: false,
    watch: process.argv.includes('--watch') ? {} : null,
  },
  plugins: [
    {
      name: 'copy-public-assets',
      writeBundle() {
        const publicDir = resolve(__dirname, 'public');
        const distDir = resolve(__dirname, 'dist');
        const distSrcDir = resolve(distDir, 'src');
        
        if (!existsSync(distDir)) {
          mkdirSync(distDir, { recursive: true });
        }
        
        // Copy all files from public directory
        if (existsSync(publicDir)) {
          const files = readdirSync(publicDir);
          files.forEach((file) => {
            const srcPath = resolve(publicDir, file);
            const destPath = resolve(distDir, file);
            
            if (statSync(srcPath).isFile()) {
              copyFileSync(srcPath, destPath);
            }
          });
        }
        
        // Move HTML files from dist/src/ to dist/ root
        if (existsSync(distSrcDir)) {
          const files = readdirSync(distSrcDir);
          files.forEach((file) => {
            if (file.endsWith('.html')) {
              const srcPath = resolve(distSrcDir, file);
              const destPath = resolve(distDir, file);
              if (existsSync(srcPath)) {
                copyFileSync(srcPath, destPath);
                // Remove from src directory
                unlinkSync(srcPath);
              }
            }
          });
          
          // Remove empty src directory if it exists
          try {
            const remainingFiles = readdirSync(distSrcDir);
            if (remainingFiles.length === 0) {
              rmdirSync(distSrcDir);
            }
          } catch (e) {
            // Ignore if directory not empty or can't be removed
          }
        }
      },
    },
  ],
});
