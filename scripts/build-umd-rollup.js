#!/usr/bin/env node

import { execSync } from 'child_process';
import { readdirSync, statSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packagesDir = 'packages';
const umdDir = 'umd';

// Lista de packages que devem ser incluídos no build UMD
const packagesToBuild = [
  'phaser-hooks',
  'phaser-wind', 
  'font-awesome-for-phaser',
  'hudini',
  'phaser-sound-studio',
  'phaser-virtual-joystick'
];

function getPackageDirs() {
  return readdirSync(packagesDir)
    .map(name => join(packagesDir, name))
    .filter(dir => {
      const isDir = statSync(dir).isDirectory();
      const packageName = dir.split('/').pop();
      return isDir && packagesToBuild.includes(packageName);
    });
}

function toCamelCase(str) {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

function createRollupConfig(packageDir, packageName) {
  const config = `import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: '${packageDir}/src/index.ts',
  output: {
    file: '${umdDir}/${packageName}.umd.js',
    format: 'umd',
    name: '${toCamelCase(packageName)}',
    globals: {
      'phaser': 'Phaser',
      'lodash.merge': '_.merge',
      'webfontloader': 'WebFont'
    }
  },
  external: ['phaser', 'lodash.merge', 'webfontloader'],
  plugins: [
    nodeResolve({
      preferBuiltins: false,
      browser: true
    }),
    commonjs(),
    typescript({
      tsconfig: false,
      declaration: false,
      declarationMap: false,
      sourceMap: false,
      exclude: ['**/*.test.ts', '**/*.spec.ts']
    })
  ]
};`;

  const configPath = `${packageDir}/rollup.umd.config.js`;
  writeFileSync(configPath, config);
  return configPath;
}

function createMinifiedRollupConfig(packageDir, packageName) {
  const config = `import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default {
  input: '${packageDir}/src/index.ts',
  output: {
    file: '${umdDir}/${packageName}.umd.min.js',
    format: 'umd',
    name: '${toCamelCase(packageName)}',
    globals: {
      'phaser': 'Phaser',
      'lodash.merge': '_.merge',
      'webfontloader': 'WebFont'
    }
  },
  external: ['phaser', 'lodash.merge', 'webfontloader'],
  plugins: [
    nodeResolve({
      preferBuiltins: false,
      browser: true
    }),
    commonjs(),
    typescript({
      tsconfig: false,
      declaration: false,
      declarationMap: false,
      sourceMap: false,
      exclude: ['**/*.test.ts', '**/*.spec.ts']
    }),
    terser()
  ]
};`;

  const configPath = `${packageDir}/rollup.umd.min.config.js`;
  writeFileSync(configPath, config);
  return configPath;
}

function buildPackageUMD(packageDir) {
  const packageName = packageDir.split('/').pop();
  console.log(`🔨 Building UMD for ${packageName}...`);
  
  try {
    // Criar configuração do Rollup normal
    const configPath = createRollupConfig(packageDir, packageName);
    
    // Executar Rollup normal
    execSync(`npx rollup -c ${configPath}`, {
      cwd: process.cwd(),
      stdio: 'inherit',
    });

    // Criar configuração do Rollup minificado
    const minConfigPath = createMinifiedRollupConfig(packageDir, packageName);
    
    // Executar Rollup minificado
    execSync(`npx rollup -c ${minConfigPath}`, {
      cwd: process.cwd(),
      stdio: 'inherit',
    });

    // Limpar arquivos de configuração temporários
    execSync(`rm ${configPath} ${minConfigPath}`, {
      cwd: process.cwd(),
      stdio: 'inherit',
    });

    console.log(`✅ Successfully built UMD for ${packageName}`);
  } catch (error) {
    console.error(`❌ Failed to build UMD for ${packageName}:`, error.message);
    // Continuar com outros packages mesmo se um falhar
  }
}

function createBundleUMD() {
  console.log('🔨 Creating bundle UMD with all packages...');
  
  try {
    // Criar arquivo de entrada que importa todos os packages
    const bundleEntry = `// Phaser Toolkit Bundle - UMD Version
// This file bundles all phaser-toolkit packages into a single UMD module

import * as PhaserHooks from './packages/phaser-hooks/src/index.ts';
import * as PhaserWind from './packages/phaser-wind/src/index.ts';
import * as FontAwesome from './packages/font-awesome-for-phaser/src/index.ts';
import * as Hudini from './packages/hudini/src/index.ts';
import * as SoundStudio from './packages/phaser-sound-studio/src/index.ts';
import * as VirtualJoystick from './packages/phaser-virtual-joystick/src/index.ts';

// Export everything under PhaserToolkit namespace
const PhaserToolkit = {
  PhaserHooks,
  PhaserWind,
  FontAwesome,
  Hudini,
  SoundStudio,
  VirtualJoystick
};

// Also export individual packages for convenience
Object.assign(PhaserToolkit, {
  ...PhaserHooks,
  ...PhaserWind,
  ...FontAwesome,
  ...Hudini,
  ...SoundStudio,
  ...VirtualJoystick
});

export default PhaserToolkit;
export * from './packages/phaser-hooks/src/index.ts';
export * from './packages/phaser-wind/src/index.ts';
export * from './packages/font-awesome-for-phaser/src/index.ts';
export * from './packages/hudini/src/index.ts';
export * from './packages/phaser-sound-studio/src/index.ts';
export * from './packages/phaser-virtual-joystick/src/index.ts';`;

    const bundleEntryPath = 'bundle-entry.ts';
    writeFileSync(bundleEntryPath, bundleEntry);

    // Configuração do Rollup para o bundle
    const bundleConfig = `import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'bundle-entry.ts',
  output: {
    file: '${umdDir}/phaser-toolkit.umd.js',
    format: 'umd',
    name: 'PhaserToolkit',
    globals: {
      'phaser': 'Phaser',
      'lodash.merge': '_.merge',
      'webfontloader': 'WebFont'
    }
  },
  external: ['phaser', 'lodash.merge', 'webfontloader'],
  plugins: [
    nodeResolve({
      preferBuiltins: false,
      browser: true
    }),
    commonjs(),
    typescript({
      declaration: false,
      declarationMap: false,
      sourceMap: false,
      exclude: ['**/*.test.ts', '**/*.spec.ts']
    })
  ]
};`;

    const bundleConfigPath = 'rollup.bundle.config.js';
    writeFileSync(bundleConfigPath, bundleConfig);

    // Executar Rollup para o bundle
    execSync(`npx rollup -c ${bundleConfigPath}`, {
      cwd: process.cwd(),
      stdio: 'inherit',
    });

    // Configuração minificada do bundle
    const bundleMinConfig = `import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default {
  input: 'bundle-entry.ts',
  output: {
    file: '${umdDir}/phaser-toolkit.umd.min.js',
    format: 'umd',
    name: 'PhaserToolkit',
    globals: {
      'phaser': 'Phaser',
      'lodash.merge': '_.merge',
      'webfontloader': 'WebFont'
    }
  },
  external: ['phaser', 'lodash.merge', 'webfontloader'],
  plugins: [
    nodeResolve({
      preferBuiltins: false,
      browser: true
    }),
    commonjs(),
    typescript({
      declaration: false,
      declarationMap: false,
      sourceMap: false,
      exclude: ['**/*.test.ts', '**/*.spec.ts']
    }),
    terser()
  ]
};`;

    const bundleMinConfigPath = 'rollup.bundle.min.config.js';
    writeFileSync(bundleMinConfigPath, bundleMinConfig);

    // Executar Rollup minificado para o bundle
    execSync(`npx rollup -c ${bundleMinConfigPath}`, {
      cwd: process.cwd(),
      stdio: 'inherit',
    });

    // Limpar arquivos temporários
    execSync(`rm ${bundleEntryPath} ${bundleConfigPath} ${bundleMinConfigPath}`, {
      cwd: process.cwd(),
      stdio: 'inherit',
    });

    console.log('✅ Successfully created bundle UMD');
  } catch (error) {
    console.error('❌ Failed to create bundle UMD');
    throw error;
  }
}

function createHTMLExample() {
  console.log('📄 Creating HTML example...');
  
  const htmlExample = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Phaser Toolkit UMD Example</title>
    <script src="https://cdn.jsdelivr.net/npm/phaser@3.90.0/dist/phaser.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/webfontloader@1.6.28/webfontloader.js"></script>
</head>
<body>
    <div id="game-container"></div>
    
    <!-- Individual packages -->
    <script src="./phaser-hooks.umd.min.js"></script>
    <script src="./phaser-wind.umd.min.js"></script>
    <script src="./font-awesome-for-phaser.umd.min.js"></script>
    <script src="./hudini.umd.min.js"></script>
    <script src="./phaser-sound-studio.umd.min.js"></script>
    <script src="./phaser-virtual-joystick.umd.min.js"></script>
    
    <!-- Or use the bundle -->
    <!-- <script src="./phaser-toolkit.umd.min.js"></script> -->
    
    <script>
        // Example usage
        const config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            parent: 'game-container',
            scene: {
                preload: function() {
                    // Your preload code here
                },
                create: function() {
                    // Your create code here
                    console.log('Phaser Toolkit UMD loaded successfully!');
                    console.log('Available packages:', {
                        PhaserHooks: typeof PhaserHooks !== 'undefined',
                        PhaserWind: typeof PhaserWind !== 'undefined',
                        FontAwesome: typeof FontAwesome !== 'undefined',
                        Hudini: typeof Hudini !== 'undefined',
                        SoundStudio: typeof SoundStudio !== 'undefined',
                        VirtualJoystick: typeof VirtualJoystick !== 'undefined'
                    });
                }
            }
        };
        
        const game = new Phaser.Game(config);
    </script>
</body>
</html>`;

  writeFileSync(`${umdDir}/example.html`, htmlExample);
  console.log('✅ HTML example created');
}

function main() {
  console.log('🚀 Building UMD packages with Rollup...\n');

  // Garantir que o diretório UMD existe
  mkdirSync(umdDir, { recursive: true });

  const packages = getPackageDirs();

  if (packages.length === 0) {
    console.log('📦 No packages found to build');
    return;
  }

  // Build individual packages UMD
  for (const pkg of packages) {
    buildPackageUMD(pkg);
  }

  // Build bundle
  createBundleUMD();

  // Criar exemplo HTML
  createHTMLExample();

  console.log('\n🎉 All UMD packages built successfully!');
  console.log(`📁 UMD files are available in: ${umdDir}/`);
  console.log('📄 Check example.html for usage examples');
}

main();