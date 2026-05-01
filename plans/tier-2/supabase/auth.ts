/**
 * P89 / TIER2-FOUNDATION (A5) — Supabase auth flow scaffolding.
 *
 * SCAFFOLDING ONLY. Real implementation lands P90 with @supabase/supabase-js.
 * Per ADR-114 D1: magic link primary; Google OAuth secondary; no password auth.
 *
 * Signature shape is final and stable; UI in P90 wires against these signatures.
 */
import type { SupabaseClientStub, SupabaseSession } from '@/contexts/persistence/supabase'

export interface SendMagicLinkOptions { email: string; redirectTo?: string }
export interface SignInWithGoogleOptions { redirectTo?: string }

export async function sendMagicLink(
  _client: SupabaseClientStub,
  _opts: SendMagicLinkOptions,
): Promise<{ ok: true } | { ok: false; error: string }> {
  throw new Error('sendMagicLink not yet wired (P90)')
}

export async function signInWithGoogle(
  _client: SupabaseClientStub,
  _opts?: SignInWithGoogleOptions,
): Promise<{ ok: true } | { ok: false; error: string }> {
  throw new Error('signInWithGoogle not yet wired (P90)')
}

export async function signOut(
  _client: SupabaseClientStub,
): Promise<{ ok: true } | { ok: false; error: string }> {
  throw new Error('signOut not yet wired (P90)')
}

export async function getCurrentSession(
  _client: SupabaseClientStub,
): Promise<SupabaseSession | null> {
  throw new Error('getCurrentSession not yet wired (P90)')
}
