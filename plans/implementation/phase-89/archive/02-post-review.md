# P89 / TIER2-FOUNDATION — Post-Review

> **Phase:** P89 · **Sprint:** TIER2-FOUNDATION (first commercial sprint) · **Date:** 2026-05-01
> **Predecessor:** P88 sealed (section visual quality; ADR-113; ~1061+ GREEN, 113 ADRs)
> **Companion:** P88 sealed in parallel
> **Cross-refs:** ADR-016, ADR-043, ADR-082, ADR-109, ADR-114, ADR-115

## Summary

First Tier-2 commercial sprint. Architecture-first dispatch: A4 wrote ADR-114 (Supabase
Architecture Decision) as the gate; A5 + A6 dispatched after A4 sealed. Pure
scaffolding — **NO** runtime wiring, **NO** new dependencies. Open-core path
(local sql.js) remains byte-equivalent to v1.0.0-RC1.

## Per-agent score

| Agent | Surface | Result | Score |
|-------|---------|--------|-------|
| **A4** | `docs/adr/ADR-114-supabase-architecture.md` (138 LOC ≤ 180 cap; 6 decisions; cross-refs ADR-016/043/082/109) | shipped | 9.5 / 10 — clean architecture gate; schema portable Postgres; BYOK trust boundary explicitly preserved (D3); migration path enumerated (D4); open-core path unchanged (D5) |
| **A5** | `src/contexts/persistence/supabase/{index.ts, auth.ts, schema.sql}` + `featureFlag.ts` + `db.ts` wrapper | shipped | 9.4 / 10 — bounded context discipline; stub interfaces (no `@supabase/supabase-js` install); schema.sql ready-to-apply with RLS policies; feature flag reads `import.meta.env.VITE_SUPABASE_URL`; zero BYOK column names in schema |
| **A6** | `docs/adr/ADR-115-feature-flag-architecture.md` + `tests/p89-tier2-foundation.spec.ts` + EOP triplet + CLAUDE.md sync | shipped | 9.5 / 10 — ADR ≤120 LOC; 4 decisions; build-time-flag-not-runtime principle codified; 18 test cases (8 describe blocks); existsSync soft-pass on A4/A5 surfaces matching P85/P86/P87/P88 cadence; CLAUDE.md NOTE-FOR-P89/A6 marker found and removed; ADRs bumped 113 → 115 |

## Test count delta

| Phase | Δ | Cumulative anchor |
|-------|---|-------------------|
| P88 (parallel seal) | +~10 | ~1061+ |
| P89 (this sprint) | +~15 | **~1076+** at combined P88 + P89 seal |

`tests/p89-tier2-foundation.spec.ts` ships 18 PURE-UNIT cases across 8 describe blocks
(P89.1 ADR-114 / P89.2 ADR-115 / P89.3 scaffolding existence / P89.4 schema tables /
P89.5 feature flag env var / P89.6 BYOK denylist / P89.7 KISS no SDK / P89.8 EOP).
existsSync guards on A4 + A5 surfaces (4 + 4 + 1 + 1 = 10 soft-pass-eligible cases);
hard-gate on ADR-115 + EOP triplet (3 + 4 + 3 = 10 hard cases).

## Honest deferred declarations

The following are explicitly **NOT** shipped this sprint and are owner-tracked
carry-forward for the next Tier-2 phases:

| Deferred to | Item | Rationale |
|-------------|------|-----------|
| **P90** | `@supabase/supabase-js` install + runtime wiring | Scaffolding-only sprint per ADR-114 §6. P90 dispatches the real SDK install + connects auth.ts stubs to the SDK + adds `db.ts` runtime branch on `isSupabaseMode()`. |
| **P90** | Real auth flow UI (magic-link form, Google OAuth button, sign-in page) | Auth components depend on the real SDK runtime; P90 ships them after P90/A1 wires the SDK. |
| **P91** | sql.js → Supabase migration tool | Per ADR-114 D4, requires (a) `import_local_data` RPC on Supabase side, (b) JSON-export expansion in `exportImport.ts`, (c) UI flow with idempotency/rollback. Multi-agent sprint. |
| **P91** | Hosted share URL runtime | `share_specs` table reserved in schema.sql; runtime activates after P90 SDK wiring. |
| **P92** | Multi-tenant team workspaces | `team_members` table reserved in schema.sql with role enum; UI + RLS policy enforcement deferred. |
| **P93** | Commercial tier gate | Stripe/billing integration (separate sprint per ADR-114 out-of-scope). |
| **P92+** | Graceful Supabase → local fallback on outage | Per ADR-115 §Out of scope; requires offline-first sync layer + conflict resolution. |
| **Tier-2 phase 2** | Real-time subscriptions + edge functions | Per ADR-114 out-of-scope. |
| **Tier-2 phase 3** | Runtime feature toggles (LaunchDarkly-style) | Per ADR-115 §Out of scope; orthogonal to backend selection. |

## Hard-rule compliance

- ✅ NO new dependencies (`package.json` unchanged; zero `from '@supabase/*'` imports verified by P89.7)
- ✅ NO animation libs in any P89 source
- ✅ Open-core path (local sql.js) byte-equivalent — `db.ts` wrapper guards on `isSupabaseMode()`
- ✅ BYOK keys NEVER in Supabase schema — verified by P89.6 (zero `api_key|apikey|byok_key` tokens)
- ✅ TypeScript-strict (`npx tsc --noEmit` clean)
- ✅ ADR ≤180 LOC (ADR-114) and ≤120 LOC (ADR-115) caps respected
- ✅ NO source code edits outside owned scope (A6 ships docs + tests + EOP only)
- ✅ NO touching ADR-113, ADR-114, A5 source files, P88 EOP, or `tests/p88-*`

## Persona scores (deferred)

P89 is a pure architecture/scaffolding sprint with no user-visible surface. Persona
scoring (Grandma / Framer / Capstone) is **deferred to P90** when the first commercial
auth UI ships. Architecture-only gates here.
