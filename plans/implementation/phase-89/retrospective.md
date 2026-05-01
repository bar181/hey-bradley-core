# P89 / TIER2-FOUNDATION — Retrospective

> **Phase:** P89 · **Sprint:** TIER2-FOUNDATION (first commercial sprint)
> **Date:** 2026-05-01

## Keep

- **Architecture-first dispatch.** A4 (ADR-114) as a hard gate before A5 (scaffolding)
  and A6 (closer + tests + ADR-115) dispatched. Eliminated the risk of A5 shipping
  schema/auth stubs that diverged from the architectural decision.
- **Scaffolding-only discipline.** No `@supabase/supabase-js` install this sprint —
  P89.7 test enforces zero `from '@supabase/*'` imports across all P89 source. Real
  SDK install + runtime wiring is P90's mandate, separating architecture from runtime.
- **BYOK denylist test (P89.6).** Hard test that `schema.sql` contains 0 occurrences of
  `api_key|apikey|byok_key` (case-insensitive). Encodes ADR-043 + ADR-114 D3 in CI;
  any future schema edit that drifts trips the test.
- **`existsSync` soft-pass guards.** Continuing the P85/P86/P87/P88 cadence. A4 / A5
  timing slips surface as deferred (carry-forward) rather than red-cascade the seal.
- **Build-time-flag-not-runtime principle (ADR-115 D3).** Eliminates mid-session
  backend swap risk; halves the test matrix; protects BYOK trust boundary by routing
  the entire binary through one persistence backend.
- **Combined-seal cadence with P88.** Two parallel sprints sealed in one CLAUDE.md
  sync — efficient when sprints are independent (P88 = visual polish, P89 = backend
  scaffolding; zero file overlap).

## Drop

- **No new deps as a hard rule.** Validated as the right call for P89 (scaffolding
  only); P90 will need to drop this rule for `@supabase/supabase-js`. The rule is
  sprint-scoped, not project-scoped.
- **Persona scoring this sprint.** P89 has no user-visible surface; persona scoring
  (Grandma / Framer / Capstone) is meaningless here. Deferred to P90 cleanly.

## Reframe

- **"Open-core path unchanged" as a continuous invariant.** ADR-114 D5 + ADR-115 D2
  encode it. Future Tier-2 sprints must verify the open-core build remains
  byte-equivalent — recommend adding a CI gate that builds open-core (no env vars)
  and diffs the bundle hash against the v1.0.0-RC1 baseline.
- **Two-binary deploy model.** ADR-115 explicitly chooses two artifacts (open-core +
  commercial) over runtime mode-switching. Documentation + deploy scripts must
  surface this clearly so commercial customers don't accidentally ship the wrong
  binary.

## Carry-forward

| Item | Owner phase | Notes |
|------|-------------|-------|
| `@supabase/supabase-js` install + runtime wiring | **P90** | First sprint that drops the "no new deps" rule scoped to Tier-2. |
| Magic-link sign-in UI + Google OAuth button + sign-in page | **P90** | Wires `auth.ts` stubs to real SDK. |
| sql.js → Supabase migration tool (per ADR-114 D4) | **P91** | Multi-agent sprint: RPC + JSON-export expansion + UI flow. |
| Hosted share URL runtime (`share_specs` table) | **P91** | Schema reserved in `schema.sql`; runtime needs SDK + share-hash generation. |
| Multi-tenant team workspaces (`team_members` table) | **P92** | Schema + RLS reserved; UI + invite flow deferred. |
| Commercial tier gate (Stripe / billing) | **P93** | Per ADR-114 out-of-scope. |
| Graceful Supabase → local fallback on outage | **P92+** | Per ADR-115 out-of-scope; requires offline-first sync layer. |
| CI gate: open-core bundle hash diff vs v1.0.0-RC1 | **P90+** (new candidate) | Encodes "open-core path unchanged" invariant continuously. |
| Real-time subscriptions + edge functions | **Tier-2 phase 2** | Per ADR-114 out-of-scope. |
| Runtime feature toggles (LaunchDarkly-style) | **Tier-2 phase 3** | Per ADR-115 out-of-scope; orthogonal to backend selection. |

## Velocity note

First commercial sprint. Pure scaffolding — no runtime, no UI. The architecture-first
dispatch (A4 gate before A5/A6) added one wave of latency but eliminated rework risk:
A5 wrote schema.sql against the ADR-114 schema verbatim; A6 wrote tests that hard-gate
A4's decisions (cross-refs, LOC cap, status). Recommend the same shape for P90 when
runtime wiring lands.
