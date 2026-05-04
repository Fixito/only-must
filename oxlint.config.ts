import { defineConfig } from 'oxlint';

export default defineConfig({
  plugins: ['typescript', 'unicorn', 'oxc'],
  categories: {
    correctness: 'error',
    suspicious: 'warn',
  },
  env: {
    builtin: true,
  },
  rules: {
    'no-console': 'warn',
    'typescript/no-explicit-any': 'error',
    'typescript/consistent-type-imports': 'error',
  },
  ignorePatterns: ['**/dist/**', '**/node_modules/**', '**/*.gen.ts', '**/drizzle/**'],
  options: {
    reportUnusedDisableDirectives: 'error',
  },
});
