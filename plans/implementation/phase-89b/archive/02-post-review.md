# P89b — Post-Review (TIER2-CLEANUP)

> **Phase:** P89b · **Sprint:** TIER2-CLEANUP · **Date:** 2026-05-01
> **Predecessor:** P89 sealed at `f3c1e0d` (~1082+ GREEN, 115 ADRs)
> **Companion:** P90 (Mode Architecture, parallel)

## 1. Reframe — open-core boundary correction

P89 sealed too eagerly. The Supabase scaffolding (5 files: `supabase/index.ts`,
`supabase/auth.ts`, `supabase/schema.sql`, `featureFlag.ts`, `db.ts` guard
block) landed inside `src/contexts/persistence/` — which is **open-core
production code**. Open core ships local-only sql.js + BYOK only; ZERO
Supabase references are allowed in `src/`.

Recon at the start of P89b confirmed clean coupling: only `db.ts` ↔
`featureFlag.ts` ↔ `supabase/*` referenced each other; no external imports
in `src/store/`, `src/components/`, `src/contexts/intelligence/`. Cleanup
landed within hours of the P89 seal.

## 2. 2-agent score (A1 + A2)

| Agent | Scope | Result |
|-------|-------|--------|
| A1 | Move `src/contexts/persistence/supabase/` → `plans/tier-2/supabase/`; move `featureFlag.ts` → `plans/tier-2/featureFlag-archived.ts`; restore `db.ts` to pre-P89 byte-equivalent body | Verified: 0 matches in `src/` for `supabase\|isSupabaseMode\|VITE_SUPABASE` |
| A2 | ADR-114 + ADR-115 Tier-2 markers (surgical prepend); `plans/tier-2/README.md` (≤120 LOC); `tests/p89b-supabase-cleanup.spec.ts` (8 cases / 4 describe blocks); EOP triplet; CLAUDE.md correction note | This document |

## 3. Acceptance gates met

- ADR-114 + ADR-115 carry **Tier-2 planning document** marker
- ADR-114 + ADR-115 Status REMAINS **Accepted** — only the implementation
  venue moved; the architectural decision is correct
- `plans/tier-2/README.md` ≤120 LOC, ≥80 LOC, documents the boundary
- `tests/p89b-supabase-cleanup.spec.ts` — 4 describe blocks (P89b.1–P89b.4),
  8 cases, hard-gate on tier-2 README + ADR markers + EOP triplet, tolerant
  existsSync guards on src/* checks (so an A1 timing-slip surfaces as
  carry-forward not red)
- Cumulative test anchor: ~1082+ → ~1087+ (+5 P89b cleanup tests)

## 4. Honest carry-forwards

- **Tier-2 commercial fork activation** — separate repo or branch; post-RC;
  install `@supabase/supabase-js`, set env vars, apply schema, wire runtime
  per `plans/tier-2/README.md` §4
- **Migration tool** (sql.js JSON export → Supabase `import_local_data` RPC)
  — deferred to P91 commercial track
- **Multi-tenant team workspaces** — deferred to P92
- **Stripe / billing** — deferred to P93
- **Real-time subscriptions + edge functions** — deferred to Tier-2 phase 2

## 5. Open-core boundary discipline (NEW principle)

Every commercial-flavored sprint must verify zero leak into open-core
`src/`. The P89b spec's recursive-walk forbidden-token check is the
template — future sprints touching Tier-2 surfaces should add equivalent
guards.

## 6. NOTE-FOR-P90/A5

P90 closer agent should bump ADR count to 116 in CLAUDE.md (this sprint
adds NO new ADR — only marker prepends to ADR-114 + ADR-115). Append
ADR-116 entry inline + remove the leave-note comment in CLAUDE.md.
