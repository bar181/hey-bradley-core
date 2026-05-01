# ADR-115 — Open Core / Commercial Feature Flag Architecture

- **Status:** Accepted
- **Date:** 2026-05-01
- **Phase:** P89 / TIER2-FOUNDATION
- **Cross-refs:** ADR-114 (Supabase Architecture), ADR-082 (Open Core RC)

> **Tier-2 planning document — not part of open-core v1.0.0.**
> Implementation archived at `plans/tier-2/featureFlag-archived.ts` per P89b correction.
> Open-core build has zero feature-flag code; commercial fork applies this pattern.
> See `plans/tier-2/README.md` for the boundary.

## Context

ADR-114 ships the Supabase architecture (auth + schema + migration path) for the Tier-2
commercial track. ADR-115 ships the **routing primitive** that selects between the two
persistence backends:

- **Open-core path** — local sql.js + IndexedDB (default; v1.0.0-RC1 byte-equivalent)
- **Commercial path** — Supabase (managed Postgres + auth + RLS)

The flag is **build-time, not runtime** — a single binary cannot toggle modes mid-session.
This is intentional: it eliminates an entire class of bugs (mid-session backend swap,
partial-state inconsistency, BYOK trust-boundary slip via wrong code path) at the cost
of two distinct deploy artifacts (open-core binary + commercial binary).

The selection is driven by the presence of `VITE_SUPABASE_URL` (read at module load via
`import.meta.env`). Open-core users never see Supabase code; commercial deployments
inject the env var at build.

## Decisions

### Decision 1 — `VITE_SUPABASE_URL` env var presence activates Supabase mode (build-time)

- Vite inlines `import.meta.env.VITE_SUPABASE_URL` at build; the value is fixed in the
  emitted JS bundle.
- `featureFlag.ts` exports `isSupabaseMode()` returning `Boolean(import.meta.env.VITE_SUPABASE_URL)`.
- Truthy → Supabase commercial path active for the binary's entire lifetime.

### Decision 2 — Absent env var → local sql.js mode (open-core; default)

- `VITE_SUPABASE_URL` undefined or empty string → `isSupabaseMode()` returns `false`.
- `db.ts` initialization stays on the existing sql.js path; behavior is byte-equivalent
  to v1.0.0-RC1 (per ADR-114 Decision 5).
- Open-core users never ship a Supabase code path; tree-shake removes the unused
  branches at build.

### Decision 3 — Build-time flag, not runtime

- **No** dynamic mode-switching API. There is no `setSupabaseMode(true)` function.
- **No** UI toggle for backend selection. Mode is a property of the deploy artifact,
  not the user session.
- Rationale: a single binary that can swap between sql.js and Supabase mid-session
  introduces (a) BYOK trust-boundary risk (key handling differs per path), (b) data
  integrity risk (partial migrations), (c) test-matrix explosion (every code path
  tested twice). Build-time flag eliminates all three.

### Decision 4 — No mixed mode

- A single `isSupabaseMode()` value drives ALL persistence routing in the binary.
- An open-core user running a Supabase build (or vice-versa) is **undefined behavior** —
  not a supported configuration.
- Commercial deployments **MUST** set both `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
  at build time. Missing either falls back to open-core local mode (per ADR-114 D6).

## Out of scope

- **Runtime feature toggles** — deferred to Tier-2 phase 3 (LaunchDarkly-style flag
  service for A/B tests, gradual rollout). Not relevant to backend selection.
- **Per-user mode override** — architectural complexity not justified; if a user wants
  Supabase, they sign up for the commercial product (separate deploy).
- **Graceful fallback Supabase → local on outage** — separate sprint (P92 candidate);
  requires offline-first sync layer + conflict resolution; out of scope here.

## Acceptance gates

- ADR ≤120 LOC
- Status: **Accepted**
- 4 decisions enumerated
- Cross-refs ADR-114 + ADR-082
- `featureFlag.ts` source mentions `VITE_SUPABASE_URL` (verified via P89.5 test)

## Consequences

- **Positive:** zero-risk routing primitive; open-core build path completely isolated
  from commercial code; tree-shaking removes unused branches; test matrix stays single-
  path per build; BYOK trust boundary preserved (commercial path doesn't change key
  handling per ADR-114 D3).
- **Negative:** two deploy artifacts to maintain (open-core + commercial); no in-app
  upgrade flow ("switch to commercial" requires user re-deploy or visiting hosted
  commercial URL); env var typos at build time silently fall back to open-core.
- **Mitigations:** CI matrix builds both artifacts on every commit; deployment docs
  call out the env var requirement explicitly; commercial deploy script asserts both
  env vars are non-empty before build (fail-fast).
