import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

let pkg = require('./package.json');

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'iife',
      name: 'window',
      extend: true
    }
  ],
  context: 'window',
  plugins: [
    typescript(),
    commonjs(),
    terser()
  ]
};
