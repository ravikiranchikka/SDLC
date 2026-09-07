import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

/**
 * Unit test configuration.
 *
 * Mirrors the `@/*` path alias from `tsconfig.json` so test files can import
 * application modules the same way application code does, and restricts the
 * run to `tests/unit` so the Playwright specs in `tests/e2e` are not picked up
 * by Vitest.
 */
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'node',
  },
});
