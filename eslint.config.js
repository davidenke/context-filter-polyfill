// @ts-check

import eslintJs from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslintSimpleImportSort from 'eslint-plugin-simple-import-sort';
import eslintPluginUnusedImports from 'eslint-plugin-unused-imports';
import eslintTs from 'typescript-eslint';

export default eslintTs.config(
  eslintJs.configs.recommended,
  ...eslintTs.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    ignores: [
      '**/node_modules/',
      '**/generated/',
      '**/dist/',
      '**/coverage/',
      '**/reports/',
    ],
  },
  {
    plugins: {
      'simple-import-sort': eslintSimpleImportSort,
      'unused-imports': eslintPluginUnusedImports,
    },
    rules: {
      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'prettier/prettier': ['error'],
      'unused-imports/no-unused-imports': 'error',
    },
  },
);
