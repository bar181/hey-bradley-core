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
    // sql.js is excluded so dep-optimizer doesn't try to bundle the wasm
    // alongside the JS. The wasm is served from public/sqljs/ via
    // locateFile() at runtime. Dev-mode CJS interop quirk is tolerated by
    // the dual-shape import in src/contexts/persistence/db.ts.
    exclude: ['sql.js'],
  },
})
