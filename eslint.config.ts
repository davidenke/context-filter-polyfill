import config from '@enke.dev/lint';
import type { Linter } from 'eslint';

export default [
  ...config,
  { ignores: ['coverage', 'reports'] },
] as Linter.Config[];
