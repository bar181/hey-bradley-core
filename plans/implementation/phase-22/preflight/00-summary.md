# Phase 22 — Preflight 00 Summary

> **Phase title:** Public Website Rebuild — BYOK demo + Don Miller blog-style
> **Status:** PREFLIGHT (activates immediately after P21 seal in this session)
> **Source plan:** `phase-22/A5-website-rebuild-plan.md` (full SPARC spec; 9 sections; ADR-053 stub)
> **Successor:** P23 (Sprint B Phase 1 — Simple Chat)
> **Persona gate:** Grandma ≥70 BINDING; Framer ≥75; Capstone ≥85

## North Star

A first-time visitor understands what Hey Bradley does in 10 seconds. Three modes (Builder / Chat / Listen) with one demo each. BYOK demo runs locally. Commercial features point to a separate repo. No Supabase. No carousels. No stat-grid callouts.

## Don Miller / StoryBrand framing

Per pre-flight commit `1c23c8a`, A5 plan now incorporates:
- 7-part copy structure per page (character / problem / guide / plan / call / failure / success)
- Blog-style pages: long-form articles, ONE primary CTA, no carousels
- Marketing nav max 5 items (Welcome / Three Modes / AISP / BYOK / About)
- Headlines ≤ 8 words; lede ≤ 35 words; body ≤ 200 words per section
- Drop stat-grid callout cards from current OpenCore; use inline emphasis

## Per-page deliverables (from A5 §1.3)

| Page | Current LOC | Target LOC | Change |
|---|---:|---:|---|
| `Welcome.tsx` | 918 | ~250 | Drop 8-showcase carousel; single hero + 3-mode tiles + 3 CTAs |
| `OpenCore.tsx` | 429 | ~350 | Repurpose: keep "55% problem" thesis; add open-core-vs-commercial section |
| `Docs.tsx` | 275 | ~280 | Refresh counts (12/17/16/300/38/63) |
| `HowIBuiltThis.tsx` | 247 | ~280 | Refresh: 33→38 ADRs; phase table P1-P11 → P1-P21; LOC stat fixed |
| `AISP.tsx` | 258 | ~260 | Add Crystal Atom side-by-side with human-readable spec |
| `About.tsx` | 223 | ~230 | Add "Sealed P15-P21 at composite 88+; defending May 2026" |
| `Research.tsx` | 308 | ~300 | Spot-verify counts; minor refresh |
| `Onboarding.tsx` | 740 | unchanged | In-product flow; not part of marketing rebuild |
| `Builder.tsx` | 5 | resolve | Either expand OR remove route |
| `NotFound.tsx` | 20 | unchanged | OK |
| **NEW**: `BYOK.tsx` | — | ~200 | 60-second walkthrough with 5-provider table |

Plus 3 new components: `ModeTiles.tsx`, `AISPDualView.tsx`, `OpenCoreVsCommercial.tsx`.

## Test plan

- `tests/p22-website-visual.spec.ts` — visual regression on Welcome / OpenCore / BYOK
- `tests/p22-website-links.spec.ts` — link-integrity sweep across 11 pages
- `tests/p22-byok-walk.spec.ts` — Grandma-walk: open `/byok`, see 5 providers, complete setup in <60s
- `tests/p22-mode-tiles.spec.ts` — 3 modes render correctly with their CTAs
- 1 a11y check (axe-core or similar) across rebuilt pages

**Target:** +5 cases (P22 baseline at velocity).

## Effort + schedule (this session)

| Step | Estimated |
|---|---:|
| Truth-up counts (Docs + HowIBuilt + Research) | 30m |
| New `BYOK.tsx` page + `ModeTiles` component | 45m |
| `AISPDualView` component + plumb into AISP/How-it-works | 30m |
| `OpenCoreVsCommercial` component + repurpose OpenCore | 30m |
| Compress `Welcome.tsx` (drop carousel; add ModeTiles) | 45m |
| Theme-alignment pass | 20m |
| Persona walks + record scores | 30m |
| Tests (5 new) | 20m |
| ADR-053 full author (replaces stub) | 10m |
| Build verify + commit + push | 10m |
| **Total** | **~4h** |

## Definition of Done

See `phase-22/A5-website-rebuild-plan.md` §5 (full DoD).

Critical gates:
- [ ] Welcome.tsx ≤ 280 LOC
- [ ] All counts truthed
- [ ] BYOK page exists at `/byok`
- [ ] AISP dual-view component renders
- [ ] OpenCore delineation explicit
- [ ] Theme tokens consistent
- [ ] +5 Playwright cases green
- [ ] Grandma persona ≥70 (binding)
- [ ] ADR-053 fully authored
- [ ] No source-code regressions
- [ ] Build + tsc clean

## Cross-references

- A3 Website assessment (`phase-22/wave-1/A3-website-assessment.md`)
- A5 Website rebuild plan (`phase-22/A5-website-rebuild-plan.md`)
- ADR-053 stub (`docs/adr/ADR-053-public-site-ia.md`)
- P21 cleanup work (this same session)

## Reading guide for phase-22/

| File | Purpose |
|---|---|
| `preflight/00-summary.md` (this) | Phase 22 entry point |
| `A5-website-rebuild-plan.md` | Full SPARC spec |
| `A3-website-assessment.md` (in wave-1/) | Gap analysis driving the plan |
| `A6-cleanup-plan.md` | NEIGHBOR phase plan (P21 — already executing this session) |
| `A4-sprint-plan-updates.md` | Sequencing rationale (P21+P22 insertion) |
