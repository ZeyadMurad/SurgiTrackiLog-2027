// ESLint flat config (ESLint 10 / typescript-eslint v8 / TypeScript 5.9).
//
// TypeScript is pinned to ~5.9.0 (not 7.x) because typescript-eslint does not yet
// support TS 7 (https://github.com/typescript-eslint/typescript-eslint/issues/10940).
// The production build uses esbuild and is unaffected by the tsc version; only the
// type-check (`tsc --noEmit`) and lint run on 5.9. When typescript-eslint ships TS 7
// support, bump `typescript` back to ^7 and this config needs no changes.
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default tseslint.config(
  // Global ignores — generated / vendored / non-source paths.
  {
    ignores: [
      'dist/',
      'node_modules/',
      'coverage/',
      'public/assets/', // bundled static images (not authored)
      '*.log',
      'bun.lock',
      'firebase-applet-config.json', // deploy-time injected (empty values)
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      // Real bugs → error.
      'react-hooks/rules-of-hooks': 'error',
      'no-debugger': 'error',
      'no-cond-assign': 'error',

      // Migration debt → warn (don't block CI; surface for cleanup).
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      // Legacy style/correctness nits from the inherited codebase — surfaced as
      // warnings rather than errors so CI stays green while they're cleaned up.
      'prefer-const': 'warn',
      'no-empty': ['warn', { allowEmptyCatch: true }],
      'preserve-caught-error': 'warn',

      // Legacy codebase uses `any` broadly; migrate incrementally, not via lint.
      '@typescript-eslint/no-explicit-any': 'off',
      // Handled by the TS plugin variant above.
      'no-unused-vars': 'off',
    },
  },
);
