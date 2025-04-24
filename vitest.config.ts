import { defineConfig } from 'vitest/config';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const react = require('@vitejs/plugin-react');

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './test/setup.ts',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
  esbuild: {
    jsx: 'automatic',
  },
});
