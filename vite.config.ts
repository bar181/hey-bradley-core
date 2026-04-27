import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
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
})
