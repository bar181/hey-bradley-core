# P82 / OC-CLEANUP — Retrospective

**Phase:** P82 / OC-CLEANUP
**Date:** 2026-05-01
**Composite estimate:** 91/100 (Grandma 80 / Framer 90 / Capstone 96)

## Keep

- **Three-agent parallel dispatch with disjoint scopes.** A3 / A4 / A5 each owned non-overlapping file sets. Zero collisions at seal. Mirrors the P78 / P79 / P80 dispatch pattern that has been clean across the OC arc.
- **existsSync guards on cross-agent surfaces in the test spec.** When A4 runs after A5 starts (timing slip), the spec green-skips rather than red-fails. This pattern has now held across P74 / P78 / P79 / P82 — promote it to standard practice for any parallel-dispatch sprint.
- **CLAUDE.md fallback path discipline.** A5 brief specified three branches (NOTE present / partial sync / no NOTE). The "no NOTE" fallback (A2 hadn't run) executed cleanly. Pre-specifying coordination contingencies prevented the kind of ad-hoc edit war that mid-arc would cost a real day.
- **ADR-107 cross-refs ADR-090 / ADR-097 / ADR-104.** Cleanup ADRs that explicitly cite the originating standards make the discipline visible in the ledger, not just in retros.

## Drop

- **The "P1 carry-forward bucket" as a perpetual-motion machine.** P82 closed three deferred P1s from P79 / OC-14, but the P82 retro itself opens four new P83+ items. Cleanup-as-discipline is good; cleanup-as-permanent-feature is debt with a different label. P83 should land the AISP adoption push WITHOUT generating a new "OC-CLEANUP-2" successor; if it does, that is the signal the discipline is failing.
- **Hand-counting blog posts.** A4 verified blog count by `ls *.md | wc -l`. P83+ should land a build-step gate that fails if `blogPosts.ts` length < ADR-097 floor. (Owner-flagged carry-forward.)

## Reframe

- **OC-CLEANUP is not a recovery phase, it is a punctuation phase.** The naming pattern (OC-CLEANUP-1 in P70; OC-CLEANUP-2 in P82) suggests a cycle: every ~10-12 sprints, accumulated debt warrants a dedicated closure phase. Capstone-reviewer score discipline keeps the bar honest; without it, OC-CLEANUP becomes a "we'll fix it later" sink.
- **Three deferred P1s + one new ADR + 15 tests** is the actual P82 footprint. The retro should report this as the unit of work — not "doc cleanup" or "tidying" — because it underweights the engine wire-up A3 shipped.

## Carry-forward (post-P82 → P83+ / Tier-2)

| Item | Surface | Target phase | Rationale |
|---|---|---|---|
| Full build-step RSS cron | `scripts/build-rss.ts` (currently static stub) | P83+ | Static refresh meets ADR-097 cadence; cron is optimization. |
| Cross-page command UX picker | `ChatInput.tsx` autocomplete | P83+ | Engine ready (A3 / P82); UX surface deferred. |
| Build-step blog floor gate | `vite.config.ts` plugin or `scripts/build-rss.ts` | P83+ | Replace hand-counting at A4 retro time. |
| Ruvector HNSW activation | `phase-61/03-ruvector-state.md` | Tier-2 | Manually-curated snapshot is sufficient for OSS RC. |
| Hosted share URL | Vercel KV / Supabase | Tier-2 | Static export ships with OSS; hosted URL pairs with auth. |
| Live-LLM eval harness | OC-12 | Tier-2 | Corpus from P81 is the input; runner is post-RC. |
| Cross-language disfluency coverage | `tests/prompts/edge-cases.json` | Post-RC | English-only floor for v1 per ADR-106. |

## Velocity note

- **Original budget:** P82 OC-CLEANUP estimated as 1-2 days at velocity (3-agent sprint).
- **Actual elapsed:** Sub-day at velocity (parallel dispatch with clean disjoint scopes).
- **Re-budget for P83:** AISP adoption push will likely need 1-2 days at velocity given marketing-surface complexity (the moat priority work) and a clean P82 baseline.

The discipline (ADR + tests + EOP triplet + persona scoring) holds. Velocity emerges when the brakes hold; do not compress P83 to chase a faster seal.

## Status

**P82 / OC-CLEANUP SEALED at composite ~91/100.** All three P79 / OC-14 deferred P1s closed in source (page-aware INTENT, DECOMP page-targeting, mobile drawer page selector). Blog floor met (12 ≥ 12 per ADR-097). EOP audit doc landed (P15-P81 back-fill enumerated). ADR-107 Accepted. P83 inherits a clean baseline.
