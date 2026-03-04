import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./configs/vitest.setup.ts'],
    globals: true,
    clearMocks: true,
    restoreMocks: true,
    css: true, // ✅ allow css handling
  },
});
