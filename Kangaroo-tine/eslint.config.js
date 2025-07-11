const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierPlugin = require('eslint-plugin-prettier');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      // Prettier 규칙을 ESLint로 적용
      'prettier/prettier': 'warn',
    },
  },
]);