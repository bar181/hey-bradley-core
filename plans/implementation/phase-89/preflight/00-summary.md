# P89 — Tier-2 Foundation: Supabase Auth + Schema (Preflight)

> **Phase:** P89 · **Sprint:** TIER2-FOUNDATION · **Date:** 2026-05-01
> **Predecessor:** P86+P87 sealed at `9570268` (~1051+ GREEN, 112 ADRs, v1.0.0-RC1 + library professional grade)
> **Companion:** P88 Section Visual Quality (parallel)
> **Cross-refs:** ADR-016 (Local Database sql.js), ADR-043 (API Key Trust Boundaries), ADR-082 (Open Core RC), ADR-109 (Open Core RC Architecture)

## Mandate — first commercial sprint

**Architecture before code.** A4 writes ADR-114 (Supabase architecture decision) FIRST as a hard gate. A5 + A6 dispatch only after A4 completes.

P89 closes the foundation work for the Tier-2 commercial track:
- Auth strategy
- Schema design
- Migration path from local sql.js → Supabase
- Feature-flag routing (open-core stays local; commercial opt-in)
- BYOK keys stay localStorage (per ADR-043, never crossing to Supabase)

## 3 agents · 2 waves

### Wave 1 (gate) — A4
A5 + A6 do not start until A4 completes. A4 is pure write — no code, no shell commands.

#### A4 — ADR-114 Supabase Architecture Decision
**Owns:**
- `docs/adr/ADR-114-supabase-architecture.md` (NEW; ≤180 LOC; Status: Accepted; cites ADR-016 + ADR-043 + ADR-082 + ADR-109)

**Required decisions:**
1. **Auth strategy:** Supabase magic link primary; Google OAuth secondary. No password-based auth.
2. **Schema:** users / projects / sessions / team_members / share_specs tables. Foreign keys + Row Level Security (RLS) policies enumerated.
3. **BYOK key storage:** STAYS in localStorage per ADR-043. Never crosses to Supabase. RLS policy explicitly forbids API key columns.
4. **Migration path:** local sql.js → Supabase; user-initiated, idempotent, zero data loss. JSON export from sql.js → Supabase ingest endpoint.
5. **Open-core users:** local sql.js path UNCHANGED. No Supabase dependency added to open-core.
6. **Commercial users:** Supabase opt-in on account creation. Feature flag `VITE_SUPABASE_URL` env var presence routes the runtime.

**Out of scope:** real-time subscriptions (Tier-2 phase 2), edge functions, server-side rendering, billing integration (separate sprint).

**Constraints:** Pure architecture artifact. ADR ≤180 LOC (slightly larger than usual — schema + migration + RLS notes need room). Status: Accepted.

### Wave 2 (after A4) — A5 + A6 parallel

#### A5 — Supabase schema + auth scaffolding
**Owns:**
- `src/contexts/persistence/supabase/index.ts` (NEW; ≤80 LOC) — bounded context entry; export `createSupabaseClient(url, anonKey)` factory
- `src/contexts/persistence/supabase/auth.ts` (NEW; ≤200 LOC) — magic link send + Google OAuth init + signOut + getSession
- `src/contexts/persistence/supabase/schema.sql` (NEW; ≤200 LOC) — tables: users, projects, sessions, team_members, share_specs + RLS policies per ADR-114
- `src/contexts/persistence/featureFlag.ts` (NEW; ≤40 LOC) — exports `isSupabaseMode()` reading `import.meta.env.VITE_SUPABASE_URL`; defaults to local-only when absent
- `src/contexts/persistence/db.ts` (EDIT — surgical) — wrap initDB call to no-op when `isSupabaseMode()` is true (commercial path TBD; routing only this sprint)

**Constraints:** **NO new dependencies** — Supabase JS SDK adds significant footprint; this sprint is SCAFFOLDING only. Use TypeScript stub interfaces matching the Supabase API surface; the real `@supabase/supabase-js` install is deferred to the next phase that actually wires runtime calls. Document this as an explicit note at the top of `auth.ts`. Schema file is ready-to-apply SQL; not executed this sprint.

NO touching ADR-114 (A4 owns) or tests/p89-* (A6 owns).

#### A6 — ADR-115 + tests + EOP
**Owns:**
- `docs/adr/ADR-115-feature-flag-architecture.md` (NEW; ≤120 LOC; Status: Accepted; cites ADR-114 + ADR-082)
  - Decisions: (1) `VITE_SUPABASE_URL` env var present → Supabase mode; (2) absent → local sql.js (open-core); (3) feature flag is build-time, not runtime; (4) no mixed mode — exactly one persistence backend per session
- `tests/p89-tier2-foundation.spec.ts` (NEW; ≥15 cases; Playwright):
  - P89.1 ADR-114 file shape (4): exists, ≤180 LOC, Status Accepted, cross-refs ADR-016/043/082/109
  - P89.2 ADR-115 file shape (4)
  - P89.3 Supabase scaffolding files exist (4): supabase/index.ts, auth.ts, schema.sql, featureFlag.ts
  - P89.4 Schema SQL has required tables (1): grep `users\|projects\|sessions\|team_members\|share_specs` in schema.sql — all 5 present
  - P89.5 Feature flag uses VITE_SUPABASE_URL (1)
  - P89.6 BYOK keys NOT in Supabase schema (1): schema.sql contains NO `api_key` / `apikey` / `byok_key` columns
  - P89.7 KISS — no animation libs / no new deps in P89 source (1)
  - P89.8 EOP triplet (3)
- `plans/implementation/phase-89/{02-post-review.md, session-log.md, retrospective.md}`
- `CLAUDE.md` final sync — coordinate with P88/A3 NOTE: bump ADRs 113 → 115 with both ADR-114 + ADR-115 entries; tests cumulative anchor; capabilities entries for P88 + P89.

**Constraints:** ADR ≤120 LOC; tests use `@playwright/test`; ROOT = `process.cwd()`. existsSync guards on A5 surfaces.

## Hard rules
1. **NO new dependencies** — including no `@supabase/supabase-js` install this sprint (scaffolding only)
2. NO animation libs
3. NO touching files outside owned list
4. BYOK keys NEVER cross to Supabase schema
5. Open-core (local sql.js) path unchanged
6. NO shell commands inside agents (except tsc + targeted playwright run)
7. TypeScript-strict
8. KISS — scaffolding + types + SQL + flags only; runtime wiring is next sprint

## Acceptance gates (combined P88 + P89)
- ADR-113 + ADR-114 + ADR-115 Accepted
- Supabase bounded context exists at `src/contexts/persistence/supabase/`
- Schema SQL ready-to-apply
- Feature flag routes correctly
- BYOK keys NOT in schema
- ≥10 P88 tests + ≥15 P89 tests GREEN
- Cumulative ≥760 session OC chain regression
- tsc strict clean

## Carry-forwards (post-P89)
- `@supabase/supabase-js` dep install + runtime wiring → P90
- Real auth flow UI (sign-in card / OAuth callback) → P90
- sql.js → Supabase migration tool → P91
- Hosted share URL feature → P91 (or per roadmap P91)
- Multi-tenant projects + team workspaces → P92
- Commercial tier gate (freemium boundary) → P93
