/**
 * P89 / TIER2-FOUNDATION (A5) — feature flag for Supabase mode.
 *
 * VITE_SUPABASE_URL present at build time → Supabase mode (commercial).
 * Absent → local sql.js mode (open-core; default).
 *
 * Per ADR-115 the flag is build-time, not runtime. No mixed mode.
 *
 * Per ADR-114 D5: open-core path is byte-equivalent when this returns false.
 */
export function isSupabaseMode(): boolean {
  // import.meta.env.VITE_SUPABASE_URL is undefined when not set; truthy string when set
  return Boolean(import.meta.env.VITE_SUPABASE_URL)
}

export function getSupabaseUrl(): string | null {
  const v = import.meta.env.VITE_SUPABASE_URL
  return typeof v === 'string' && v.length > 0 ? v : null
}

export function getSupabaseAnonKey(): string | null {
  const v = import.meta.env.VITE_SUPABASE_ANON_KEY
  return typeof v === 'string' && v.length > 0 ? v : null
}
