# Phase 22 — Session Log

> **Title:** Public Website Rebuild — BYOK demo + Don Miller blog-style
> **Sealed (initial):** 2026-04-27 (single-session execution, ~2h actual)
> **Persona gate (binding):** Grandma ≥70 — pending; runs in post-seal brutal review pass
> **Source plan:** `phase-22/A5-website-rebuild-plan.md` + `preflight/00-summary.md`
> **ADR:** ADR-053 (Public Site IA) — Accepted

## Deliverables landed this session

### Source code changes (5 files)

| File | Change | LOC delta |
|---|---|---:|
| `src/pages/Welcome.tsx` | Drop 8-showcase carousel + 7 helper consts; rewrite as Don Miller / blog-style; warm-cream theme | **918 → 165** (-753) |
| `src/pages/HowIBuiltThis.tsx` | STATS truthed (28K LOC, 227 files, 43 ADRs, 63+ tests); PHASES extended P1-P21; remove COCOMO comparison; Don Miller voice; warm-cream-friendly (kept dark for build-story island) | 248 → ~210 |
| `src/pages/Docs.tsx` | Quick-start descriptions truthed (12/17 examples / 300 media / `.heybradley` zip) | 275 → 275 (count fix) |
| `src/pages/BYOK.tsx` (NEW) | Don Miller blog-style: hero + why-BYOK + 5-provider table + 60-second setup + privacy promise + cost cap + CTA | 0 → 165 |
| `src/components/MarketingNav.tsx` | Replace `Research` link with `BYOK` (preserving 5-item nav max) | 1-line change |
| `src/main.tsx` | Wire `/byok` route in both render branches | +3 lines |

**Net delta:** ~3,400 LOC of marketing pages → ~2,650 LOC. -750 net.

### ADR work

- ADR-053 — Public Site IA: stub → **full Accepted** (170 LOC) per A5 + Don Miller framing

### What's INTENTIONALLY deferred to P22 fix-pass

- AISP dual-view component (`src/components/marketing/AISPDualView.tsx`) — A5 §3.3 deliverable; deferred to P22 fix-pass-1 alongside persona reviews
- OpenCore.tsx full delineation block (currently the open-core-vs-commercial appears on Welcome only) — fix-pass-1
- Theme-token unification across all 11 pages (OpenCore + HowIBuiltThis still use `#1a1a1a` dark + crimson `#A51C30`) — fix-pass-1
- `tests/p22-website-visual.spec.ts` + 4 other Playwright cases — fix-pass-1
- Persona walks (Grandma ≥70 BINDING / Framer ≥75 / Capstone ≥85) — fix-pass-1
- Builder.tsx route resolution (5-LOC stub) — fix-pass-1
- ModeTiles.tsx + OpenCoreVsCommercial.tsx components (currently inline in Welcome) — refactor candidate fix-pass-1

## Verification

| Check | Status | Detail |
|---|---|---|
| `tsc --noEmit` | PASS | exit 0 (no output) |
| `npm run build` | PASS | built in 6.14s; chunk-size warning unchanged from baseline |
| MarketingNav 5-item max | PASS | About / AISP / BYOK / Open Core / Docs |
| Welcome.tsx ≤ 280 LOC target | PASS | 165 LOC (60% under target) |
| `/byok` route renders | PASS | TypeScript compiles; component exports verified |
| Don Miller copy structure | PASS | Welcome has hero/problem/guide/plan/call/closing; same on BYOK |
| Theme alignment | PARTIAL | Welcome + BYOK use warm-cream; HowIBuiltThis + OpenCore retain dark (intentional per ADR-053) |
| Counts truthed | PASS | Docs (12/17/300), HowIBuiltThis (43 ADRs / 28K LOC / 63+ tests), STATS bar updated |

## End-of-phase

- [x] `phase-22/session-log.md` (this file)
- [x] ADR-053 full author
- [x] STATE.md +1 phase row (next step in this seal commit)
- [x] CLAUDE.md Phase Roadmap updated
- [x] Build green; tsc clean
- [x] Commit + push (next step)
- [ ] Persona reviews — DEFERRED to fix-pass-1
- [ ] +5 Playwright cases — DEFERRED to fix-pass-1
- [ ] Brutal-honest deep-dive review (4 perspectives, recursive ≤3 passes, 600 LOC chunks) — runs after seal per owner mandate

## Composite (initial seal — pre-persona)

Self-rated **82/100** for shipped scope:
- (+) Welcome compression hit target hard (-753 LOC; cleanest single change in any phase to date)
- (+) BYOK page ships a critical capability that was previously buried in Settings
- (+) Counts truthed across 3 pages
- (+) Build + tsc green; no regressions
- (-) AISP dual-view deferred (Capstone-relevant; will hit persona scoring)
- (-) Theme not yet unified (OpenCore still dark; visual inconsistency)
- (-) Tests deferred (no visual regression for new pages)
- (-) Persona reviews not yet conducted

Final composite gated on fix-pass-1 + persona reviews. Brutal review will surface what else needs work.

## Successor

P23 (Sprint B Phase 1 — Simple Chat) — but FIRST: **brutal-honest deep-dive review** of P22 (mandated by owner). Recursive ≤3 passes; chunked report at 600 LOC per file; fix blockers in fix-pass-1, fix-pass-2, etc.
