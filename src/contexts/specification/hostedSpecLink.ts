/**
 * Sprint N P57 (Wave 2 / N2) — Client-side hosted shareable spec link.
 *
 * Open-core stub: `/spec/:hash` resolves only inside the browser that
 * published it (kv-backed). Other browsers see the "unknown spec" state.
 * Hash = SHA-256 of canonical JSON (first 12 hex chars), so same bundle =>
 * same URL. Tier-2 commercial swaps kv for Supabase + a real endpoint.
 * `redactKeyShapes` is applied on both read and write (defence-in-depth).
 */

import { kvGet, kvSet } from '@/contexts/persistence/repositories/kv';
import { redactKeyShapes } from '@/contexts/intelligence/llm/keys';
import type { ShareSpecBundle } from './shareSpecBundle';

const KV_PREFIX = 'shared_spec_';
const HASH_LEN = 12; // first 12 hex chars of SHA-256 — collision risk is negligible at MVP scale

interface StoredEntry {
  createdAt: number;
  bundle: ShareSpecBundle;
}

/**
 * SHA-256 hash of the canonical JSON, truncated to HASH_LEN hex chars.
 * Mirrors the `hashPrompt` pattern in `intelligence/llm/keys.ts`. Falls back
 * to a deterministic FNV-1a stub when SubtleCrypto is unavailable so dev/test
 * environments without it still produce comparable hashes.
 */
async function sha256Short(input: string): Promise<string> {
  const subtle = (globalThis.crypto as Crypto | undefined)?.subtle;
  if (subtle) {
    const buf = await subtle.digest('SHA-256', new TextEncoder().encode(input));
    const hex = Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    return hex.slice(0, HASH_LEN);
  }
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(HASH_LEN, '0').slice(0, HASH_LEN);
}

function kvKey(hash: string): string {
  return `${KV_PREFIX}${hash}`;
}

/**
 * Publish a spec bundle to local kv and return a stable in-browser URL.
 * The URL is `/spec/:hash` — only resolvable in a browser that has the
 * matching kv row (i.e., the original creator's session). Same bundle =>
 * same hash (deterministic).
 */
export async function publishSpecLocally(
  bundle: ShareSpecBundle,
): Promise<{ hash: string; url: string }> {
  // Canonical JSON: bundle.json is already the redacted, pretty-printed JSON
  // produced by composeShareSpecBundle. We hash THAT exact string so the
  // hash is stable across re-publishes of the same spec.
  const canonical = bundle.json ?? '';
  const hash = await sha256Short(canonical);
  const entry: StoredEntry = {
    createdAt: Date.now(),
    bundle,
  };
  // Defence-in-depth: re-redact at the write boundary in case anything in
  // dataUrl or future fields slipped past the composer.
  const serialized = redactKeyShapes(JSON.stringify(entry));
  try {
    kvSet(kvKey(hash), serialized);
  } catch (err) {
    if (import.meta.env.DEV) console.warn('[hostedSpecLink] kvSet failed:', err);
  }
  return { hash, url: `/spec/${hash}` };
}

/**
 * Look up a previously-published spec bundle by hash. Returns
 * `{found:false}` when the hash is unknown to this browser (the open-core
 * "unknown spec" path).
 */
export function loadSharedSpec(
  hash: string,
):
  | { found: true; bundle: ShareSpecBundle; createdAt: number }
  | { found: false } {
  if (!hash || !/^[0-9a-f]+$/i.test(hash)) return { found: false };
  let raw: string | undefined;
  try {
    raw = kvGet(kvKey(hash));
  } catch (err) {
    if (import.meta.env.DEV) console.warn('[hostedSpecLink] kvGet failed:', err);
    return { found: false };
  }
  if (!raw) return { found: false };
  try {
    // Defence-in-depth: redact again at the read boundary before parsing.
    const safe = redactKeyShapes(raw);
    const parsed = JSON.parse(safe) as StoredEntry;
    if (!parsed?.bundle?.json) return { found: false };
    return { found: true, bundle: parsed.bundle, createdAt: parsed.createdAt };
  } catch (err) {
    if (import.meta.env.DEV) console.warn('[hostedSpecLink] parse failed:', err);
    return { found: false };
  }
}

/**
 * List all locally-published shared specs. Backs an EXPERT-mode
 * "Your shared specs" panel (out of scope this wave; UI deferred).
 */
export function listSharedSpecs(): Array<{ hash: string; createdAt: number; sizeBytes: number }> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getDB } = require('@/contexts/persistence/db') as typeof import('@/contexts/persistence/db');
    const stmt = getDB().prepare("SELECT k, v FROM kv WHERE k LIKE ?");
    const out: Array<{ hash: string; createdAt: number; sizeBytes: number }> = [];
    try {
      stmt.bind([`${KV_PREFIX}%`]);
      while (stmt.step()) {
        const row = stmt.getAsObject() as { k?: string; v?: string };
        const k = String(row.k ?? '');
        const v = String(row.v ?? '');
        let createdAt = 0;
        try { createdAt = (JSON.parse(redactKeyShapes(v)) as StoredEntry).createdAt ?? 0; } catch { /* 0 */ }
        out.push({ hash: k.slice(KV_PREFIX.length), createdAt, sizeBytes: new Blob([v]).size });
      }
    } finally { stmt.free(); }
    return out.sort((a, b) => b.createdAt - a.createdAt);
  } catch { return []; }
}
