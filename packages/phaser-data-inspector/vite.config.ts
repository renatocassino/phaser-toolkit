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
        actionPopup: resolve(__dirname, 'src/action-popup.html'),
        actionPopupJs: resolve(__dirname, 'src/action-popup.ts'),
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
                 chunkInfo.name === 'injected-script' ||
                 chunkInfo.name === 'actionPopupJs'
            ? chunkInfo.name === 'actionPopupJs' ? 'action-popup.js' : '[name].js'
            : 'assets/[name]-[hash].js';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          // Keep HTML files at root level (needed for Chrome extension)
          if (assetInfo.name === 'popup.html' || 
              assetInfo.name === 'devtools.html' ||
              assetInfo.name === 'action-popup.html') {
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
    react({
      babel: {
        plugins: [
          ['babel-plugin-styled-components', {
            displayName: true,
            ssr: false,
          }],
        ],
      },
    }),
    {
      name: 'copy-public-assets',
      buildStart() {
        const publicDir = resolve(__dirname, 'public');
        
        if (!existsSync(publicDir)) {
          mkdirSync(publicDir, { recursive: true });
        }
        
        // Copy pico.min.css from node_modules to public at build start
        const picoCssPath = resolve(__dirname, 'node_modules/@picocss/pico/css/pico.min.css');
        const publicPicoPath = resolve(publicDir, 'pico.min.css');
        
        if (existsSync(picoCssPath)) {
          copyFileSync(picoCssPath, publicPicoPath);
        }
        
        // Copy Font Awesome files from node_modules to public
        const fontAwesomeSource = resolve(__dirname, 'node_modules/@fortawesome/fontawesome-free');
        const fontAwesomeDest = resolve(publicDir, 'fontawesome');
        
        if (existsSync(fontAwesomeSource)) {
          // Create fontawesome directory if it doesn't exist
          if (!existsSync(fontAwesomeDest)) {
            mkdirSync(fontAwesomeDest, { recursive: true });
          }
          
          // Copy CSS directory
          const cssSource = resolve(fontAwesomeSource, 'css');
          const cssDest = resolve(fontAwesomeDest, 'css');
          if (existsSync(cssSource)) {
            if (!existsSync(cssDest)) {
              mkdirSync(cssDest, { recursive: true });
            }
            const cssFiles = readdirSync(cssSource);
            cssFiles.forEach((file) => {
              const srcPath = resolve(cssSource, file);
              const destPath = resolve(cssDest, file);
              if (statSync(srcPath).isFile()) {
                copyFileSync(srcPath, destPath);
              }
            });
          }
          
          // Copy webfonts directory
          const webfontsSource = resolve(fontAwesomeSource, 'webfonts');
          const webfontsDest = resolve(fontAwesomeDest, 'webfonts');
          if (existsSync(webfontsSource)) {
            if (!existsSync(webfontsDest)) {
              mkdirSync(webfontsDest, { recursive: true });
            }
            const fontFiles = readdirSync(webfontsSource);
            fontFiles.forEach((file) => {
              const srcPath = resolve(webfontsSource, file);
              const destPath = resolve(webfontsDest, file);
              if (statSync(srcPath).isFile()) {
                copyFileSync(srcPath, destPath);
              }
            });
          }
        }
      },
      writeBundle() {
        const publicDir = resolve(__dirname, 'public');
        const distDir = resolve(__dirname, 'dist');
        const distSrcDir = resolve(distDir, 'src');
        
        if (!existsSync(distDir)) {
          mkdirSync(distDir, { recursive: true });
        }
        
        // Copy all files and directories from public directory
        const copyRecursive = (src: string, dest: string): void => {
          if (!existsSync(dest)) {
            mkdirSync(dest, { recursive: true });
          }
          
          const entries = readdirSync(src);
          entries.forEach((entry) => {
            const srcPath = resolve(src, entry);
            const destPath = resolve(dest, entry);
            
            if (statSync(srcPath).isDirectory()) {
              copyRecursive(srcPath, destPath);
            } else {
              copyFileSync(srcPath, destPath);
            }
          });
        };
        
        if (existsSync(publicDir)) {
          copyRecursive(publicDir, distDir);
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
          
          // Also check for action-popup.html in dist root (it might be there already)
          const actionPopupHtmlPath = resolve(distDir, 'action-popup.html');
          if (!existsSync(actionPopupHtmlPath)) {
            // Try to find it in dist/src or any subdirectory
            const findHtmlFile = (dir: string, filename: string): string | null => {
              if (!existsSync(dir)) return null;
              const entries = readdirSync(dir);
              for (const entry of entries) {
                const fullPath = resolve(dir, entry);
                if (statSync(fullPath).isDirectory()) {
                  const found = findHtmlFile(fullPath, filename);
                  if (found) return found;
                } else if (entry === filename) {
                  return fullPath;
                }
              }
              return null;
            };
            const foundPath = findHtmlFile(distDir, 'action-popup.html');
            if (foundPath && foundPath !== actionPopupHtmlPath) {
              copyFileSync(foundPath, actionPopupHtmlPath);
            }
          }
          
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
        
        // Ensure action-popup.html references action-popup.js correctly
        const actionPopupHtmlPath = resolve(distDir, 'action-popup.html');
        if (existsSync(actionPopupHtmlPath)) {
          let htmlContent = readFileSync(actionPopupHtmlPath, 'utf-8');
          // Replace any hashed references with the actual filename
          htmlContent = htmlContent.replace(/action-popup-[a-f0-9]+\.js/g, 'action-popup.js');
          htmlContent = htmlContent.replace(/assets\/action-popup.*?\.js/g, 'action-popup.js');
          // Ensure it references action-popup.js
          if (!htmlContent.includes('action-popup.js')) {
            htmlContent = htmlContent.replace(
              /<script[^>]*src=["'][^"']*["'][^>]*><\/script>/i,
              '<script src="action-popup.js"></script>'
            );
          }
          writeFileSync(actionPopupHtmlPath, htmlContent);
        }
      },
    },
  ],
});
