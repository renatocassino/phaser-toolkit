#!/usr/bin/env node

import { execSync } from 'child_process';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

const packagesDir = 'packages';

function getPackageDirs() {
  return readdirSync(packagesDir)
    .map(name => join(packagesDir, name))
    .filter(dir => statSync(dir).isDirectory());
}

function buildPackage(packageDir) {
  console.log(`🔨 Building ${packageDir}...`);
  try {
    execSync('pnpm build', {
      cwd: packageDir,
      stdio: 'inherit',
    });
    console.log(`✅ Successfully built ${packageDir}`);
  } catch (error) {
    console.error(`❌ Failed to build ${packageDir}`);
    throw error;
  }
}

function main() {
  console.log('🚀 Building all packages...\n');

  const packages = getPackageDirs();

  if (packages.length === 0) {
    console.log('📦 No packages found to build');
    return;
  }

  for (const pkg of packages) {
    buildPackage(pkg);
  }

  console.log('\n🎉 All packages built successfully!');
}

main();
