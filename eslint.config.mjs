import js from '@eslint/js';
import importX from 'eslint-plugin-import-x';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';

const importOrderRule = [
  'warn',
  {
    groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
    'newlines-between': 'always',
    alphabetize: { order: 'asc', caseInsensitive: true },
  },
];

export default [
  {
    ignores: [
      'build/**',
      'node_modules/**',
      'coverage/**',
      'dist/**',
      'uploads/**',
      'cypress/screenshots/**',
      'cypress/videos/**',
      'cypress/downloads/**',
    ],
  },
  js.configs.recommended,
  {
    // Repo-wide overrides to eslint:recommended.
    rules: {
      // Fixing every unused-var hit (67 across src/server) means editing app
      // code at each call site (dropping now-unneeded React imports, unused
      // catch params, unused destructured state). Well past the ~20 budget
      // for this tooling PR — tracked as follow-up.
      'no-unused-vars': 'off',
      // Only 1 hit (tripDetail.reducer.js); fixing it means wrapping a
      // `case` body in braces, a real edit to app code. Kept visible as a
      // warning rather than silently dropped.
      'no-case-declarations': 'warn',
    },
  },
  // Browser-side React code (app source + cypress specs that mount components).
  {
    files: ['src/**/*.{js,jsx}', 'cypress/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: {
        ...globals.browser,
        ...globals.mocha,
        cy: 'readonly',
        Cypress: 'readonly',
        // Vite's `define` injects this at build time; not a real browser global.
        process: 'readonly',
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'import-x': importX,
    },
    settings: { react: { version: '19.2' } },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...react.configs.flat['jsx-runtime'].rules,
      ...reactHooks.configs['recommended-latest'].rules,
      'import-x/order': importOrderRule,
      'import-x/no-duplicates': 'warn',

      // Fixing every hit means adding a `propTypes` block to 58 call sites
      // across components. Well past the ~20 budget — tracked as follow-up.
      'react/prop-types': 'off',
      // Real finding worth keeping visible (Map.jsx calls useState after an
      // early return), but fixing it means restructuring component logic,
      // which this tooling PR intentionally doesn't do. Flagged in the PR
      // description instead of silenced.
      'react-hooks/rules-of-hooks': 'warn',
      // 11 hits, none autofixable (no-unescaped-entities has no fixer, only
      // suggestions) - escaping JSX text is harmless but is still an edit to
      // every affected component. Kept as a warning; tracked as follow-up.
      'react/no-unescaped-entities': 'warn',
    },
  },
  // Server-side CommonJS code.
  {
    files: ['server/**/*.js', 'scripts/**/*.js', 'cypress.config.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: { ...globals.node },
    },
  },
  // Node-side ESM config files.
  {
    files: ['vite.config.mjs', 'eslint.config.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.node },
    },
  },
  // Must stay last: turns off any core/plugin rules that conflict with Prettier formatting.
  eslintConfigPrettier,
];
