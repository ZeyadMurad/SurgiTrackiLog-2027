import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  test: {
    // Pure unit tests (no DOM, no React rendering). Switch to 'jsdom' when
    // component tests are added.
    environment: 'node',
    include: ['src/test/**/*.test.ts'],
    // Fail fast on the first unexpected error to keep CI output focused.
    reporters: ['default'],
  },
});
