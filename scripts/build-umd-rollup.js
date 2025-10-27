#!/usr/bin/env node

import { execSync } from 'child_process';
import { readdirSync, statSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packagesDir = 'packages';

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

function toCapitalizedCamelCase(str) {
  const camelCase = toCamelCase(str);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
}

function createRollupConfig(packageDir, packageName) {
  const config = `import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: '${packageDir}/src/index.ts',
  output: {
    file: '${packageDir}/dist/${packageName}.js',
    format: 'umd',
    name: '${toCapitalizedCamelCase(packageName)}',
    globals: {
      'phaser': 'Phaser',
      'webfontloader': 'WebFont'
    }
  },
  external: ['phaser', 'webfontloader'],
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
    file: '${packageDir}/dist/${packageName}.min.js',
    format: 'umd',
    name: '${toCapitalizedCamelCase(packageName)}',
    globals: {
      'phaser': 'Phaser',
      'webfontloader': 'WebFont'
    }
  },
  external: ['phaser', 'webfontloader'],
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


function createHTMLExample() {
  console.log('📄 Creating HTML example...');
  
  const htmlExample = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Phaser Toolkit UMD Example</title>
    <script src="https://cdn.jsdelivr.net/npm/phaser@3.90.0/dist/phaser.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/webfontloader@1.6.28/webfontloader.js"></script>
</head>
<body>
    <div id="game-container"></div>
    
    <!-- Individual packages -->
    <script src="./packages/phaser-hooks/dist/phaser-hooks.min.js"></script>
    <script src="./packages/phaser-wind/dist/phaser-wind.min.js"></script>
    <script src="./packages/font-awesome-for-phaser/dist/font-awesome-for-phaser.min.js"></script>
    <script src="./packages/hudini/dist/hudini.min.js"></script>
    <script src="./packages/phaser-sound-studio/dist/phaser-sound-studio.min.js"></script>
    <script src="./packages/phaser-virtual-joystick/dist/phaser-virtual-joystick.min.js"></script>
    
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
                        FontAwesomeForPhaser: typeof FontAwesomeForPhaser !== 'undefined',
                        Hudini: typeof Hudini !== 'undefined',
                        PhaserSoundStudio: typeof PhaserSoundStudio !== 'undefined',
                        PhaserVirtualJoystick: typeof PhaserVirtualJoystick !== 'undefined'
                    });
                }
            }
        };
        
        const game = new Phaser.Game(config);
    </script>
</body>
</html>`;

  writeFileSync('example.html', htmlExample);
  console.log('✅ HTML example created');
}

function main() {
  console.log('🚀 Building UMD packages with Rollup...\n');


  const packages = getPackageDirs();

  if (packages.length === 0) {
    console.log('📦 No packages found to build');
    return;
  }

  // Build individual packages UMD
  for (const pkg of packages) {
    buildPackageUMD(pkg);
  }

  // Criar exemplo HTML
  createHTMLExample();

  console.log('\n🎉 All UMD packages built successfully!');
  console.log('📁 UMD files are available in each package dist/ folder');
  console.log('📄 Check example.html for usage examples');
}

main();
