# P89b — Supabase Cleanup (Move Tier-2 Out of Open-Core) (Preflight)

> **Phase:** P89b · **Sprint:** TIER2-CLEANUP · **Date:** 2026-05-01
> **Predecessor:** P89 sealed at `f3c1e0d` (~1082+ GREEN, 115 ADRs)
> **Companion:** P90 (Mode Architecture, parallel)
> **Cross-refs:** ADR-016 (Local Database sql.js), ADR-043 (API Key Trust Boundaries), ADR-082 (Open Core RC), ADR-114 (Supabase Architecture — to be marked Tier-2), ADR-115 (Feature Flag — to be marked Tier-2)

## Reframe — open-core boundary correction

**Open core = local sql.js + BYOK only. Supabase is Tier-2.**

P89 prematurely landed Supabase scaffolding in open-core source. This sprint moves it OUT. ADRs stay (they're correct planning documents) but get explicit Tier-2 markers. Open-core build must have ZERO Supabase references. Recon shows clean coupling: only `db.ts` ↔ `featureFlag.ts` ↔ `supabase/*` reference each other; no external imports.

## 2 parallel agents · disjoint scopes

### A1 — Move Tier-2 code out of open-core source
**Owns:**
- `src/contexts/persistence/supabase/` (DELETE — contents moved to `plans/tier-2/supabase/`)
- `src/contexts/persistence/featureFlag.ts` (DELETE — moved to `plans/tier-2/featureFlag-archived.ts` for reference)
- `src/contexts/persistence/db.ts` (EDIT — remove `import { isSupabaseMode }` (line 10); remove the lines 63-70 guard block; restore `initDB` to its pre-P89 byte-equivalent body)

**Constraints:** After this agent, `grep -rn "supabase\|isSupabaseMode\|VITE_SUPABASE" src/` must return ZERO matches. Open-core build must compile with zero Supabase references.

DO NOT touch:
- `docs/adr/ADR-114-*` or `ADR-115-*` (A2 owns)
- `plans/tier-2/README.md` or any other plans/tier-2/ file except moving the supabase/ dir + featureFlag (A2 owns the README)
- ADR/test/plan/CLAUDE.md (A2 owns)

### A2 — ADR updates + Tier-2 README + tests + EOP
**Owns:**
- `docs/adr/ADR-114-supabase-architecture.md` (EDIT — surgical: prepend a `> **Tier-2 planning document** — not part of open-core v1.0.0 build. Source archived at `plans/tier-2/supabase/`. See ADR-115 for the activation flag.` line BELOW the header, before Context section. Status REMAINS "Accepted" — the architectural decision is still accepted; only the implementation venue moves.)
- `docs/adr/ADR-115-feature-flag-architecture.md` (EDIT — same surgical Tier-2 marker prepend)
- `plans/tier-2/README.md` (NEW; ≤120 LOC) — explains the Tier-2 boundary clearly
  - Open core: local sql.js + BYOK only; ALL data stays on the user's device
  - Tier-2 commercial: hosted persistence, OAuth, multi-tenant, hosted share URLs (P91+), HNSW activation, real-time, etc.
  - BYOK keys: NEVER cross to Tier-2 backend per ADR-043 (commercial mode preserves the trust boundary)
  - Activation: `VITE_SUPABASE_URL` build-time flag (per ADR-115); commercial fork only
  - Source location: `plans/tier-2/supabase/` (this directory mirror of A1's move target) — referenceable for P90+ commercial work
- `tests/p89b-supabase-cleanup.spec.ts` (NEW; ≥5 cases; Playwright `test.describe`/`test`):
  - P89b.1 Open-core source has zero Supabase references (3): grep counts in src/contexts/persistence/, src/store/, src/components/ — each MUST return 0 matches for `supabase|isSupabaseMode|VITE_SUPABASE`
  - P89b.2 Tier-2 README exists + non-empty (1)
  - P89b.3 ADR-114 + ADR-115 carry Tier-2 marker (1 — combined assertion)
  - P89b.4 EOP triplet (3): phase-89b/02-post-review.md, session-log.md, retrospective.md
- `plans/implementation/phase-89b/{02-post-review.md, session-log.md, retrospective.md}` (NEW)
- `CLAUDE.md` sync — note correction; ADR-114 + ADR-115 keep their entries but flagged Tier-2; tests cumulative anchor unchanged (no new test net since P89b counts cleanup as a correction not new feature). LEAVE NOTE-FOR-P90/A5 to bump ADRs to 116 in same combined commit.

**Constraints:** ADR EDITS are surgical-marker prepends only — do NOT delete or rewrite content. Tests use `@playwright/test`; ROOT = `process.cwd()`.

## Hard rules
1. NO new dependencies
2. NO touching files outside owned list
3. Open-core build MUST compile with zero Supabase references
4. ADRs 114 + 115 stay Accepted — only an additional Tier-2 marker is added
5. NO shell commands inside agents (except tsc + targeted playwright run)
6. TypeScript-strict
7. Net test count delta ≤0 (cleanup phase; new P89b spec replaces / complements P89 spec which still passes)

## Acceptance gates (P89b)
- `grep -rn "supabase\|isSupabaseMode\|VITE_SUPABASE" src/` → 0 matches
- ADR-114 + ADR-115 Tier-2 markers present
- `plans/tier-2/README.md` clearly documents the boundary
- Cumulative session OC chain regression ≥759 (P89 spec must still pass since the moved files exist at the new path; existsSync-guarded tests in P89 spec stay GREEN via skip)
- tsc strict clean
