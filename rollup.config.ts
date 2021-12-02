import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'

import pkg from './package.json'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.browser,
      format: 'umd',
      name: 'Lich',
    },

    {
      file: pkg.commonjs,
      format: 'commonjs',
    },
  ],

  plugins: [nodeResolve(), commonjs(), typescript()],
}
