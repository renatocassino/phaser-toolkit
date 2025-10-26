import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default {
  input: 'packages/hudini/src/index.ts',
  output: {
    file: 'packages/hudini/dist/hudini.umd.min.js',
    format: 'umd',
    name: 'hudini',
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
};