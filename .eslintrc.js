
const path = require('path');

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],

      parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
        project: [path.resolve(__dirname, 'tsconfig.json')],
      },
    },
  ],

  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-var-requires': 'off',
    'import/no-extraneous-dependencies': ["error", {"devDependencies": true}],
    'class-methods-use-this': ["off"],
    'max-lines-per-function': ["error", 40],
  },
  
  
};
