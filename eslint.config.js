// eslint.config.js
import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser, // dùng parser của TypeScript
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        ...globals.worker,
        ...globals.commonjs,
        console: 'readonly',
        window: 'readonly',
        document: 'readonly',
        React: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'react-hooks': reactHooks,
    },
    rules: {
      ...tseslint.configs.recommended.rules, // rules recommended của TS
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
    },
  },
];
