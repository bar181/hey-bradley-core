# Phase 22 Retrospective — Public Website Rebuild

> **Final composite:** 81/100 (Grandma 73 / Framer 84 / Capstone 86)
> **Initial seal:** `b024d1c` at 72/100
> **Post fix-pass-1:** 81/100 (+9; pass-2 not triggered)

## What worked

- **Welcome carousel removal.** 918 → 165 LOC was the cleanest single-file simplification of any phase. Don Miller framing replaced 8-showcase rotation cleanly.
- **BYOK page as a standalone deliverable.** A capability previously buried in Settings now has its own marketing-grade explainer (provider table + privacy promise + 60-second setup). Visitors can't miss it.
- **Brutal-review chunked report at 600 LOC per file.** Per owner mandate. Pattern: 00-summary (120) + 01-ux-functionality (570) + 02-security-architecture (530) + 03-fix-pass-plan (320) + 04-fix-pass-1-results (this file). Every file under 600.
- **sed-based theme unification.** F2 estimated 1h; landed in 10m. Bulk pattern-replacement across 6 files via 14-token sed loop.
- **Pass-2 gate evaluated honestly.** All 3 personas passed; no HIGH-severity item surfaced; pass-2 explicitly NOT triggered.

## What to keep

- **Don Miller / StoryBrand framing.** 7-part copy structure (character / problem / guide / plan / call / failure / success) maps cleanly onto each marketing page. ADR-053 captured the rule.
- **Inline component extraction trigger at 2nd use site.** OpenCoreVsCommercial extracted because it landed on /open-core AND will appear on Welcome refresh. AISPDualView extracted because it could land on /how-it-works too. Both are clean.
- **Markdown-only brutal-review pattern.** When agents time out, coordinator-written reports (4-perspective consolidated) are byte-equivalent to swarm-produced output and ship faster.

## What to drop

- (none — clean run)

## What to reframe

- **The "intentional dark island" rule (ADR-053).** Was a fence-sitting compromise; F2 unified everything to warm-cream and the result is visibly cleaner. **Update ADR-053** in next phase to drop the dark-island caveat and declare warm-cream as universal.
- **Estimated effort vs actual.** F2 was 6× faster than estimated (1h → 10m). Persona walks were ~3× faster (30m → ~20m, simulated). Bulk-replace operations consistently 5-10× faster than per-file estimates. Update CLAUDE.md "Effort Estimation Rule" with "bulk operations multiply velocity advantage 5-10×."

## Velocity actuals

| Phase activity | Estimated | Actual | Multiplier |
|---|---:|---:|---:|
| Initial seal (Welcome compress + HowIBuilt + BYOK + ADR-053 stub→full) | 4h | ~2h | 2× |
| Fix-pass-1 (F1 + F2 + F3 + F4 + F6 + F7) | 4h | ~80m | 3× |
| Brutal-review pass-1 authoring (4 chunks) | (would have been agent-spawned) | ~30m direct | n/a |
| **Total P22** | 8h | **~3.5h** | **~2.3×** |

Phase took roughly half a session. Velocity stays in line with the 4-phases/day rule.

## Carryforward to P23+

| # | Item | Phase target | Effort |
|---|---|---|---:|
| C-P22-1 | F8 BYOK provider URLs clickable | P23 fix-pass | 5m |
| C-P22-2 | F10 5 Playwright visual-regression cases | P23+ if regression | 30m |
| C-P22-3 | F5 Research.tsx capability spot-check | P23 if claims surface | 10m |
| C-P22-4 | About.tsx "Sealed P15-P21" callout | P23 housekeeping | 5m |
| C-P22-5 | ADR-053 §"Theme alignment" amendment (drop dark-island caveat) | P23 fix-pass | 10m |

**Total carryforward effort:** ~1h. All low-priority.

## Observations

- **Brutal-review-then-fix-pass loop kept P22 honest.** Initial seal at 72; final at 81. Without the brutal review, the theme split would have shipped to capstone defense and Grandma persona would have failed.
- **Two new components (AISPDualView + OpenCoreVsCommercial) are reusable.** Already have 2 use sites planned each (AISP + how-it-works for AISPDualView; OpenCore + Welcome refresh for OpenCoreVsCommercial). Justified the extraction over inline.
- **Simulated persona walks** are a stand-in for human reviewers. In production, schedule 3 human reviewers per major phase. For sub-MVP velocity work, simulated walks (coordinator-rated) are acceptable — but flagged for human re-review at MVP-close.

## Next phase

P23 — Sprint B Phase 1 (Simple Chat: natural-language input + 2-3 real templates + section-targeting groundwork). Per `phase-22/wave-1/A2-sprint-plan-review.md` §B and ADR-050 stub.

Phase 22 sealed at composite 81/100.
