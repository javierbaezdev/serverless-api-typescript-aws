// eslint.config.cjs
const js = require('@eslint/js');
const globals = require('globals');
const tseslint = require('typescript-eslint');
const { globalIgnores } = require('eslint/config');

module.exports = tseslint.config([
  // Ignora carpetas de la raíz
  globalIgnores([
    'node_modules',
    'dist',
    '.esbuild',
    '.serverless',
    '.prisma',
    '.volume',
  ]),

  {
    // Aplica a .js y .ts de tu servicio
    files: ['**/*.{js,ts}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: globals.node, // Variables de Node.js
    },
    extends: [
      js.configs.recommended, // Reglas base de ESLint
      tseslint.configs.recommended, // Reglas recomendadas de TypeScript
    ],
    rules: {
      'no-var': 'off',
      'no-console': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      'prefer-const': 'off',
    },
  },
]);
