import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'packages/hudini/src/index.ts',
  output: {
    file: 'packages/hudini/dist/hudini.js',
    format: 'umd',
    name: 'Hudini',
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
      exclude: ['**/*.test.ts', '**/*.spec.ts', '**/test/**/*', '**/tests/**/*']
    })
  ]
};