// eslint.config.mjs
import pluginJs from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier'; // 변경!
import pluginReact from 'eslint-plugin-react';
import reactCompiler from 'eslint-plugin-react-compiler';
import storybook from 'eslint-plugin-storybook';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: ['dist/', 'node_modules/', 'webpack.*.js', 'webpack.*.cjs'],
  },
  {
    files: ['src/**/*.{js,mjs,ts,jsx,tsx}'],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      'react-compiler': reactCompiler,
    },
    rules: {
      'react-compiler/react-compiler': 'error',
    },
  },
  {
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'react/react-in-jsx-scope': 'off',
      // prettier/prettier 규칙 제거!
    },
  },
  {
    files: ['src/**/*.{js,mjs,jsx}'],
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'error',
      'react/react-in-jsx-scope': 'off',
      // prettier/prettier 규칙 제거!
    },
  },
  ...storybook.configs['flat/recommended'],
  eslintConfigPrettier, // 마지막에! ESLint 스타일 규칙 비활성화
];
