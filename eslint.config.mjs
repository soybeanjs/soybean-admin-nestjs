import { defineConfig } from '@soybeanjs/eslint-config';

export default defineConfig(
  {},
  {
    rules: {
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/no-extraneous-class': 'off',
      'class-methods-use-this': 'off'
    }
  }
);
