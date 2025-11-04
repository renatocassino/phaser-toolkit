import { defineConfig } from 'vite';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, existsSync, readdirSync, statSync, unlinkSync, rmdirSync, readFileSync, writeFileSync } from 'fs';
import react from '@vitejs/plugin-react';

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
        'injected-script': resolve(__dirname, 'src/injected-script.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === 'background' || 
                 chunkInfo.name === 'content' ||
                 chunkInfo.name === 'injected-script'
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
    react(),
    {
      name: 'copy-public-assets',
      buildStart() {
        // Copy pico.min.css from node_modules to public at build start
        const picoCssPath = resolve(__dirname, 'node_modules/@picocss/pico/css/pico.min.css');
        const publicDir = resolve(__dirname, 'public');
        const publicPicoPath = resolve(publicDir, 'pico.min.css');
        
        if (!existsSync(publicDir)) {
          mkdirSync(publicDir, { recursive: true });
        }
        
        if (existsSync(picoCssPath)) {
          copyFileSync(picoCssPath, publicPicoPath);
        }
      },
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
        
        // Transform injected-script.js to IIFE format
        // Vite compiles it as ES module, but we need pure IIFE for page injection
        const injectedScriptPath = resolve(distDir, 'injected-script.js');
        if (existsSync(injectedScriptPath)) {
          let content = readFileSync(injectedScriptPath, 'utf-8');
          
          // Remove any import/export statements (including type imports)
          content = content.replace(/^import\s+(?:type\s+)?.*?from\s+['"].*?['"];?\s*$/gm, '');
          content = content.replace(/^export\s+.*?;?\s*$/gm, '');
          
          // Remove module wrapper if present (e.g., "var injected_script = {}; ... export {}")
          content = content.replace(/var\s+\w+\s*=\s*\{\};?\s*/g, '');
          content = content.replace(/export\s*\{\s*\};?\s*/g, '');
          
          // Remove any remaining export statements at the end
          content = content.replace(/export\s+.*$/gm, '');
          
          // Ensure it's wrapped in IIFE if not already
          // Check if content already starts with IIFE
          const trimmedContent = content.trim();
          if (!trimmedContent.startsWith('(function') && !trimmedContent.startsWith('!function')) {
            content = `(function() {\n'use strict';\n${content}\n})();`;
          }
          
          writeFileSync(injectedScriptPath, content);
        }
      },
    },
  ],
});
