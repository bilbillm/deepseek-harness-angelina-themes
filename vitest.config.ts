import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  resolve: {
    alias: {
      // 0.2.x moved defineStore into the platform seed package; the stub stands
      // in for it here so unit tests never need the app's client runtime.
      '@deepseek-ai/dsh-client-store': fileURLToPath(new URL('./tests/stubs/runtime.ts', import.meta.url)),
      '@deepseek-ai/dsh-client-runtime/client': fileURLToPath(new URL('./tests/stubs/runtime.ts', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
    passWithNoTests: false,
  },
})
