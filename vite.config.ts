import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ command }) => {
  if (command === 'build' && process.env.VITE_LLM_API_KEY) {
    throw new Error(
      '[security] Refusing to build: VITE_LLM_API_KEY is set. Production builds must be key-less per ADR-043.',
    )
  }
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    assetsInclude: ['**/*.wasm'],
    optimizeDeps: {
      // Pre-bundle sql.js so its CJS `module.exports = initSqlJs` shape gets
      // wrapped into proper ESM in dev. Without this, dev-mode dynamic
      // `import('sql.js')` resolves to an empty namespace and initDB fails.
      // The wasm itself is served from public/sqljs/ via locateFile() at
      // runtime — Vite optimisation only touches the JS entry.
      include: ['sql.js'],
    },
  }
})
