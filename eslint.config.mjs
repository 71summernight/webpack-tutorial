// eslint.config.mjs
import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import prettier from 'eslint-plugin-prettier/recommended';

export default [
  // ✅ prettier recommended 설정을 가장 먼저 추가 (포맷 우선순위 유지)
  prettier,

  // ✅ 공통 적용 대상
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
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
  pluginReact.configs.flat.recommended,

  // ✅ 커스텀 규칙
  {
    rules: {
      'no-unused-vars': 'error',
      'no-undef': 'error',
      'react/react-in-jsx-scope': 'off', // Next.js는 React import 불필요
      'prettier/prettier': ['error', { endOfLine: 'auto' }], // prettier 연동 강화
    },
  },
];
