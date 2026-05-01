/**
 * P89 / TIER2-FOUNDATION (A5) — Supabase bounded context entry.
 *
 * SCAFFOLDING ONLY. No `@supabase/supabase-js` runtime dep yet (added P90).
 * Types + factory function only — exists to make the routing surface
 * testable and the schema/auth files have a home.
 *
 * Per ADR-114 D6: commercial mode active when feature flag returns true.
 */
export interface SupabaseAuthOtpRequest { email: string; options?: { emailRedirectTo?: string } }
export interface SupabaseSession { access_token: string; refresh_token: string; expires_at: number; user: { id: string; email: string } }
export interface SupabaseAuthSurface {
  signInWithOtp(req: SupabaseAuthOtpRequest): Promise<{ error: Error | null }>
  signInWithOAuth(req: { provider: 'google' }): Promise<{ error: Error | null }>
  signOut(): Promise<{ error: Error | null }>
  getSession(): Promise<{ data: { session: SupabaseSession | null }; error: Error | null }>
}

export interface SupabaseQueryBuilder<T> {
  select(columns?: string): Promise<{ data: T[] | null; error: Error | null }>
  insert(rows: Partial<T>[]): Promise<{ data: T[] | null; error: Error | null }>
  update(values: Partial<T>): Promise<{ data: T[] | null; error: Error | null }>
  delete(): Promise<{ data: null; error: Error | null }>
}

export interface SupabaseClientStub {
  auth: SupabaseAuthSurface
  from<T = unknown>(table: string): SupabaseQueryBuilder<T>
}

export function createSupabaseClient(_url: string, _anonKey: string): SupabaseClientStub {
  // P90 will replace this with real `createClient` from @supabase/supabase-js.
  // Until then, throw — call sites should be guarded by `isSupabaseMode()`.
  throw new Error('Supabase runtime not yet wired (P90); guard call sites with isSupabaseMode()')
}
