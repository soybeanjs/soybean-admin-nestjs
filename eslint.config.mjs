import { defineConfig } from '@soybeanjs/eslint-config';

export default defineConfig({
  overrides: {
    '@typescript-eslint/consistent-type-imports': 'off',
    '@typescript-eslint/no-extraneous-class': 'off',
    'class-methods-use-this': 'off'
  }
});
