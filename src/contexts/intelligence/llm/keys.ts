// BYOK key handling: in-memory + opt-in `kv` persistence.
// Spec: plans/implementation/mvp-plan/03-phase-17-llm-provider.md §1.1, §3.7.
// Decision record: docs/adr/ADR-043-api-key-trust-boundaries.md.
//
// Critical: this module is the ONLY writer to kv['byok_key'] and kv['byok_provider'].
// All keys are stripped from .heybradley exports per ADR-040 SENSITIVE_KV_KEYS
// (see src/contexts/persistence/exportImport.ts line 20).

import { kvGet, kvSet, kvDelete, kvHas } from '@/contexts/persistence/repositories/kv';

const KEY_K = 'byok_key';
const PROVIDER_K = 'byok_provider';

let inMemoryKey: string | null = null;
let inMemoryProvider: string | null = null;

export interface BYOKEntry {
  key: string;
  provider: string;
}

/** Read the active BYOK key/provider. Returns null when none. Tries memory first, then kv. */
export function readBYOK(): BYOKEntry | null {
  if (inMemoryKey && inMemoryProvider) {
    return { key: inMemoryKey, provider: inMemoryProvider };
  }
  const key = kvGet(KEY_K);
  const provider = kvGet(PROVIDER_K);
  return key && provider ? { key, provider } : null;
}

/** Save BYOK. If `remember` is false, only in-memory (and clear any stale persisted entry). */
export function writeBYOK(entry: BYOKEntry, opts: { remember: boolean }): void {
  inMemoryKey = entry.key;
  inMemoryProvider = entry.provider;
  if (opts.remember) {
    kvSet(KEY_K, entry.key);
    kvSet(PROVIDER_K, entry.provider);
  } else {
    // Defensive: if a previous "Remember" entry exists, clear it.
    if (kvHas(KEY_K)) kvDelete(KEY_K);
    if (kvHas(PROVIDER_K)) kvDelete(PROVIDER_K);
  }
}

/** Clear BYOK from both memory and kv. */
export function clearBYOK(): void {
  inMemoryKey = null;
  inMemoryProvider = null;
  if (kvHas(KEY_K)) kvDelete(KEY_K);
  if (kvHas(PROVIDER_K)) kvDelete(PROVIDER_K);
}

/** True if a key is present in either memory or kv. */
export function hasBYOK(): boolean {
  return Boolean(inMemoryKey) || kvHas(KEY_K);
}

/** Mask a key for safe display: keep first/last 4 chars only. */
export function maskKey(k: string): string {
  if (k.length <= 8) return '•'.repeat(k.length);
  return `${k.slice(0, 4)}…${k.slice(-4)}`;
}

/** Lightweight format check; never throws. */
export function looksLikeAnthropicKey(k: string): boolean {
  return /^sk-ant-/i.test(k.trim());
}

export function looksLikeGoogleKey(k: string): boolean {
  return /^AIza/.test(k.trim());
}

/** P35 — OpenAI keys: classic `sk-...` (non-project) or `sk-proj-...` project keys. */
export function looksLikeOpenAIKey(k: string): boolean {
  const t = k.trim();
  // Reject Anthropic keys that share the `sk-` prefix.
  if (/^sk-ant-/i.test(t)) return false;
  return /^sk-(?:proj-)?[A-Za-z0-9_-]{20,}$/.test(t);
}

/**
 * Redact API-key-shaped substrings before they hit logs / persisted error_text /
 * exported `.heybradley` zips. Pure, no I/O. Kept narrow on purpose: SDK error
 * messages routinely echo malformed keys / Bearer tokens, and `llm_calls.error_text`
 * is exported by default. See ADR-043.
 */
export function redactKeyShapes(s: string): string {
  if (!s) return s;
  return s
    .replace(/sk-ant-[A-Za-z0-9_-]{20,}/g, '[REDACTED]')
    .replace(/sk-proj-[A-Za-z0-9_-]{20,}/g, '[REDACTED]')
    .replace(/AIza[0-9A-Za-z_-]{35}/g, '[REDACTED]')
    .replace(/Bearer\s+\S+/g, '[REDACTED]');
}

/**
 * SHA-256 hex digest of (systemPrompt + '\n' + userPrompt). Used as the
 * `llm_logs.prompt_hash` column (D3 of ruvector-research.md): enables fixture
 * matching and dedup without persisting prompt text. Browser-only (uses
 * crypto.subtle); falls back to a non-cryptographic stub if subtle is
 * unavailable so dev/test environments without a SubtleCrypto implementation
 * still produce deterministic, comparable hashes.
 */
export async function hashPrompt(systemPrompt: string, userPrompt: string): Promise<string> {
  const input = `${systemPrompt}\n${userPrompt}`;
  const subtle = (globalThis.crypto as Crypto | undefined)?.subtle;
  if (subtle) {
    const buf = await subtle.digest('SHA-256', new TextEncoder().encode(input));
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  // Deterministic non-crypto fallback (FNV-1a 32-bit, hex-padded).
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(64, '0');
}
