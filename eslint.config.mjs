// eslint.config.mjs
import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import prettier from 'eslint-plugin-prettier/recommended';

export default [
  // ✅ dist, node_modules 등 무시
  {
    ignores: ['dist/', 'node_modules/', 'webpack.*.js', 'webpack.*.cjs'],
  },

  // ✅ prettier recommended 설정을 가장 먼저 추가 (포맷 우선순위 유지)
  prettier,

  // ✅ src 디렉토리만 체크
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

  // ✅ eslint 기본 JS 규칙
  pluginJs.configs.recommended,

  // ✅ typescript-eslint 기본 규칙
  ...tseslint.configs.recommended,

  // ✅ React 플러그인 Flat config 적용
  {
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // ✅ 커스텀 규칙
  {
    files: ['src/**/*.{js,mjs,ts,jsx,tsx}'],
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'error',
      '@typescript-eslint/no-unused-vars': 'warn',
      'react/react-in-jsx-scope': 'off',
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },
];
