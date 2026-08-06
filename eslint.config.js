import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default tseslint.config(
  { ignores: ['dist/**', 'coverage/**', 'reports/**', '.stryker-tmp/**'] },
  { ...js.configs.recommended, files: ['**/*.mjs', 'eslint.config.js'], languageOptions: { globals: globals.node } },
  ...tseslint.configs.recommended.map((config) => ({ ...config, files: ['src/**/*.{ts,tsx}', '*.ts'] })),
  {
    files: ['src/**/*.{ts,tsx}', '*.ts'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    plugins: { 'react-hooks': reactHooks, 'jsx-a11y': jsxA11y },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-has-content': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-role': 'error',
      'jsx-a11y/role-has-required-aria-props': 'error',
    },
  },
);
