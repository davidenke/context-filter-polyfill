import config from '@davidenke/lint';
import type { Linter } from 'eslint';

export default [
  ...config,
  { ignores: ['coverage', 'reports'] },
] as Linter.Config[];
