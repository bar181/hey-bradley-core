# P22 Brutal Review — Pass 1 — 00 Summary

> **Phase reviewed:** P22 Public Website Rebuild (initial seal `b024d1c`)
> **Methodology:** 4 perspectives — UX / Functionality / Security / Architecture
> **Report style:** single logical report, chunked at ≤600 LOC per file
> **Pass:** 1 of ≤3 (recursive per owner mandate)
> **Author:** coordinator (replacing typically-spawned reviewer agents; agent-timeout pattern this session forces direct write)

## Verdict

**P22 ships, but with 7 must-fix-now items before final seal.** Welcome compression is a clean win. BYOK page lands a critical previously-buried capability. ADR-053 captures the IA decisions correctly. **However:**

- AISP dual-view component IS Capstone-relevant and was deferred — that's a binding gate at-risk
- Theme split is now louder (warm-cream Welcome + BYOK vs dark HowIBuiltThis + OpenCore + Research + AISP + About) — visual incoherence
- Persona walks not yet conducted — Grandma ≥70 is BINDING per ADR-053
- 0 new Playwright cases — the rebuild is unverified by test
- BYOK page references `/onboarding` route (correct) but Welcome CTAs reference `/onboarding` (correct) — so `/new-project` is now an orphan route only reachable from MarketingNav "Try Builder" button. Verify it's not stale.
- HowIBuiltThis.tsx STATS bar lost the COCOMO context (was a thesis-relevant capstone talking point)
- AISP.tsx, About.tsx, OpenCore.tsx, Research.tsx UNTOUCHED this seal — they retain dark theme + stale hero copy

## Composite estimate (pre-fix-pass-1)

| Persona | Initial seal estimate | Target | Delta |
|---|---:|---:|---:|
| Grandma | **62** (carousel removed but theme split confuses) | 70 | -8 |
| Framer | 78 (clean Welcome + good BYOK; theme split irks) | 75 | +3 ✅ |
| Capstone | 75 (AISP dual-view missing; phase trajectory good) | 85 | -10 |
| **Composite** | **72** | 78 | -6 |

**P22 cannot final-seal at 72.** Fix-pass-1 must close the must-fix queue. Estimated +12 composite delta after fix-pass-1.

## Reading guide for this pass

| Chunk | Topic | LOC target |
|---|---|---:|
| `00-summary.md` (this) | Verdict, composite estimate, must-fix queue | ~120 |
| `01-ux-functionality.md` | R1 UX + R2 Functionality combined | ~600 |
| `02-security-architecture.md` | R3 Security + R4 Architecture combined | ~600 |
| `03-fix-pass-plan.md` | Consolidated must-fix queue + per-item file-by-file decomposition | ~400 |

**Single logical report** — sequential reading recommended; cross-link via `01-ux-functionality.md#item-N` style.

## Must-fix queue (drives fix-pass-1)

| # | Item | Severity | Effort | Closes |
|---|------|---|---:|---|
| F1 | AISP dual-view component on `/aisp` page (Crystal Atom + human-readable side-by-side) | HIGH (Capstone) | 30m | 02-architecture #1 |
| F2 | Theme unification — pick warm-cream OR dark for ALL marketing pages (recommend warm-cream; OpenCore + HowIBuiltThis dark are intentional islands per ADR-053 but Pass-1 reviewer notes the inconsistency hits Grandma persona hard) | HIGH (UX) | 1h | 01-ux #2 |
| F3 | Persona walks (Grandma + Framer + Capstone) — record scores; if Grandma <70 add fix-pass-2 | HIGH (binding) | 30m | 01-ux #3 |
| F4 | OpenCore.tsx delineation block — explicit open-core-vs-commercial section (currently only on Welcome) | MED | 15m | 01-functionality #4 |
| F5 | About.tsx + AISP.tsx + Research.tsx capability sections refresh — reflect P15-P21 actuals | MED | 20m | 01-functionality #5 |
| F6 | 5 Playwright cases for visual regression / link integrity / BYOK walk / mode-tile render / a11y | MED | 30m | 02-architecture #6 |
| F7 | `/new-project` route audit — is it still reachable; should it redirect to `/onboarding`; orphan route concern | LOW | 5m | 02-architecture #7 |
| F8 | HowIBuiltThis.tsx restore single COCOMO callout (thesis-relevant; capstone reviewer will ask) | LOW | 10m | 01-functionality #8 |

**Total fix-pass-1 effort:** ~3h.

## Items NOT must-fix (acceptable carryforward to P23+ or Sprint K)

- Builder.tsx 5-LOC stub resolution (low blast radius)
- ModeTiles + OpenCoreVsCommercial component extraction (refactor; not capability)
- Welcome's footer link to `/about` works but Welcome footer doesn't link to all pages (Don Miller "less is more" approves this; Grandma persona may not notice)
- `/research` orphaned from main nav (still accessible via direct link; Research page has no broken refs)

## Cross-references

- P22 source plan: `phase-22/A5-website-rebuild-plan.md`
- ADR-053: `docs/adr/ADR-053-public-site-ia.md`
- A3 website assessment (precursor): `phase-22/wave-1/A3-website-assessment.md`
- P19 deep-dive (template for this brutal-review pattern): `phase-19/deep-dive/00-summary.md`

## Next file

`01-ux-functionality.md` — R1 + R2 perspectives combined (chunk 1 of 3).
