#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync } from 'fs';

const umdDir = 'umd';

if (!existsSync(umdDir)) {
  console.log('❌ UMD directory not found. Run "pnpm build:umd" first.');
  process.exit(1);
}

console.log('🚀 Serving UMD files locally...');
console.log('📁 Serving from:', umdDir);
console.log('🌐 Open http://localhost:8080/example.html in your browser');
console.log('⏹️  Press Ctrl+C to stop');

try {
  execSync(`npx serve ${umdDir} -p 8080`, {
    stdio: 'inherit',
  });
} catch (error) {
  console.log('❌ Failed to start server. Make sure you have "serve" installed:');
  console.log('   npm install -g serve');
  console.log('   or');
  console.log('   npx serve dist/umd -p 8080');
}