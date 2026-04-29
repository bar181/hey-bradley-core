# Phase 58 — Session Log

## Sprint O — Open Core RC v1.0.0-RC1

**Date:** 2026-04-30
**Wave commit target:** P58 (Sprint O — closing phase of the moat roadmap)
**Preflight:** `plans/implementation/phase-58/preflight/00-summary.md`
**ADR:** ADR-082 (Open Core RC — README + CLAUDE Final + Demo Video + Agentics Beta)

> **Closing arc note.** Sprint O closes the open-core moat-roadmap arc.
> After this seal, the project pivots to commercial-track planning via
> ROADMAP_NEXT.md. All four moat priorities (Speed K / Spec L / Templates
> M / Share N) are visible in the public-facing artifact at this seal.
> The v1.0.0-RC1 git tag itself is **owner-triggered post-merge** — not
> part of this commit.

## Deliverables (O4 scope — docs/tests/EOP only)

| # | Owner | Status | Files | LOC |
|---|---|---|---|---|
| 1 | O1 | parallel | edits to `README.md` (rewrite around 4 moat priorities) | ≤300 |
| 2 | O2 | parallel | edits to `CLAUDE.md` (final accuracy pass — counts + ledger) | — |
| 3 | O3 | parallel | edits/NEW `docs/launch/demo-video-script.md` + NEW `docs/launch/agentics-foundation-beta.md` | — |
| 4 | O4 | shipped | NEW `docs/adr/ADR-082-open-core-rc.md` | 119 |
| 5 | O4 | shipped | NEW `tests/p58-open-core-rc.spec.ts` (12 cases) | ~120 |
| 6 | O4 | shipped | EOP artifacts (this file + retrospective) | — |

## Test results

- p58-open-core-rc.spec.ts: 12 PURE-UNIT cases authored (FS-level reads,
  no browser bootstrap, no aisp barrel imports).
- Cases P58.1–P58.8 depend on O1/O2 source landing (README rewrite +
  CLAUDE final accuracy pass) — expected-failures by design until those
  parallel agents seal. GREEN-flip on Sprint O seal.
- Cases P58.9–P58.10 (demo video script) MAY be GREEN immediately —
  `docs/launch/demo-video-script.md` was authored by O3 dispatch and is
  already on disk pre-seal.
- Case P58.11 (Agentics Foundation beta) depends on O3 landing
  `docs/launch/agentics-foundation-beta.md` — expected-failure pre-seal.
- Case P58.12 (ADR-082 file shape) is GREEN immediately on O4 dispatch.
- `npx tsc --noEmit`: tests/ is outside the tsconfig.app `include` list,
  so adding a spec file cannot regress the typecheck. ADR + EOP markdown
  cannot regress either. O4 scope is regression-safe by construction.

## Deliverable details

### ADR-082 (119 LOC, ≤120 budget)

Full Accepted. Decision broken into five parts: README rewrite (around
the four moat priorities, not the build journey) / CLAUDE final
accuracy pass / demo video script (script-first, recording owner-side)
/ Agentics beta artifact (template, not deployed forum post) /
v1.0.0-RC1 tag prep (owner-triggered post-merge). Trade-offs name the
hosted-share in-browser stub per ADR-081 + the script-vs-recording +
the template-vs-published-post boundaries explicitly. Cross-refs
ADR-077/078/079/080/081 + open-core-moat-roadmap.md + 01.north-star §1
PMF version stamp + 09.post-mvp-open-core (commercial-track boundary).

### tests/p58-open-core-rc.spec.ts (12 cases)

PURE-UNIT — `existsSync` + `readFileSync` + regex. Each body ≤6 lines.
P58.1–P58.6 README; P58.7–P58.8 CLAUDE.md; P58.9–P58.10 demo video
script; P58.11 Agentics beta; P58.12 ADR-082 file shape (≤120 LOC, refs
ADR-077/078/079/080/081).

## Dispatch verification

`docs/launch/demo-video-script.md` confirmed on disk pre-O4 write at
~71 LOC (O3 dispatched first; P58.9 + P58.10 GREEN-immediate). Agentics
beta artifact not yet on disk at O4 dispatch — P58.11 expected-failure
until O3 lands it. README + CLAUDE.md unchanged at O4 dispatch —
P58.1–P58.8 expected-failure until O1/O2 land. ADR-082 + the spec file
itself (P58.12) are the GREEN-immediate pair on O4 dispatch. Sprint O
closes the open-core moat-roadmap arc; commercial-track planning kicks
off in ROADMAP_NEXT.md after seal.
