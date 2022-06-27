import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { cleandir } from 'rollup-plugin-cleandir';
import external from 'rollup-plugin-peer-deps-external';

import pkg from './package.json';

export default {
  input: 'src/index.tsx',
  output: [
    {
      file: pkg.module,
      format: 'es',
      exports: 'auto',
    },
  ],
  plugins: [
    cleandir('./dist'),
    external({ includeDependencies: true }),
    resolve(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: '.',
    }),
  ],
};
