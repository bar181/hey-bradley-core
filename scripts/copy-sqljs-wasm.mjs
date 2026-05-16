#!/usr/bin/env node
// Copies sql.js WASM into public/ so Vite serves it at /sql-wasm.wasm.
// Standardised path per P122 W5 — was previously /sqljs/sql-wasm.wasm.
// See plans/implementation/mvp-plan/02-phase-16-local-db.md §3.5 + ADR-040.
import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const src = resolve(root, 'node_modules/sql.js/dist/sql-wasm.wasm');
const destDir = resolve(root, 'public');
const dest = resolve(destDir, 'sql-wasm.wasm');

mkdirSync(destDir, { recursive: true });
copyFileSync(src, dest);
console.log(`[copy-sqljs-wasm] ${src} -> ${dest}`);
