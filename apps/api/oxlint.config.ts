import security from 'eslint-plugin-security';
import { defineConfig } from 'oxlint';

import baseConfig from '../../oxlint.config.ts';

export default defineConfig({
  extends: [baseConfig],
  jsPlugins: ['eslint-plugin-security'],
  rules: {
    ...security.configs.recommended.rules,
    'security/detect-object-injection': 'off',
    'import/no-cycle': 'error',
    'no-console': ['warn', { allow: ['error', 'warn'] }],
    'no-undef': 'off',
    'no-unused-vars': 'off',
    'oxc/no-async-endpoint-handlers': 'off',
    'typescript/no-namespace': 'off',
    'typescript/no-require-imports': 'off',
    'typescript/no-unused-vars': 'off',
  },
  env: {
    node: true,
  },
  overrides: [
    {
      files: ['db/migrate.ts', 'scripts/scrape.ts'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
});
