# Phase 9 Retrospective: Pre-LLM MVP Foundation

**Phase Score: 85/100**
**Date:** 2026-04-04
**Duration:** 3 sessions (~10 hours total)
**Sprints Completed:** 4 of 5 (Sprint 5 = this document)

---

## Phase Score Context

| Phase | Score | Focus |
|-------|-------|-------|
| P1 | 77 | Project scaffolding |
| P2 | 82 | Theme system |
| P3 | 73 | Editor panels |
| P4 | 84 | Template variants |
| P5 | 67 | Spec generators (first pass) |
| P6 | 78 | Chat/Listen simulation |
| P7 | 75 | Polish + test suite |
| P8 | 88 | Kitchen Sink + image library |
| **P9** | **85** | **Pre-LLM MVP foundation** |

**Why 85:** Phase 9 delivered substantial new features (image upload, save/load, hex colors, SEO, brand, pricing variants, onboarding redesign) AND a major quality pass (144 as-any to 0, react-markdown specs, 54 to 71 tests). The combination of breadth and depth is strong. Docked points for: Sprint 4 quality items still unfinished (navbar height, toggle knob, Getting Started connectors), PricingComparison missing content.tiers parity, and manual gates still blocking.

---

## Sprint-by-Sprint Scores

| Sprint | Score | Rationale |
|--------|-------|-----------|
| Sprint 1: Grandma UX + Spec Upgrades | 8/10 | Template-first onboarding, jargon cleanup across 14 files, all 4 spec generators upgraded. Solid foundation work. |
| Sprint 2: Image Upload + Brand + Colors + SEO + Save/Load | 9/10 | Five distinct features delivered cleanly. Drag-drop image upload with validation, project save/load with localStorage + export, hex color picker with debounce. All worked on first deploy. |
| Sprint 3: Section Variants + Pricing + Onboarding Redesign | 8/10 | Two new pricing variants, navbar centered, 18 preview screenshots, onboarding two-panel redesign. Parallel agent swarms worked well. UX review found 15 issues; 7 fixed same session. |
| Sprint 4: Quality Pass | 9/10 | The most impactful sprint. 144 as-any eliminated (created sectionContent.ts helpers), react-markdown replaced pre tags for spec rendering, Features generator overhauled from 5.5 to 8/10, 17 new Playwright tests. ADR-030 documented. |
| Sprint 5: Docs + Review + Retrospective | 7/10 | This sprint. Wiki page, retrospective, backlog update. No 4-persona review conducted (time constraint). |

**Average: 8.2/10**

---

## What Went Well (6 items)

1. **Parallel agent swarms were highly effective.** Wave 1 of Sprint 3 ran 5 agents simultaneously (screenshot-gen, variant-auditor, pricing-toggle, pricing-comparison, ux-research). Total wall-clock time was ~15 minutes for work that would have taken 2+ hours sequentially.

2. **The type safety overhaul was transformative.** Going from 144 `as any` casts to zero with a clean helper library (`sectionContent.ts` with `getStr`/`getItems`/`getContent`) improved confidence across the entire codebase. TypeScript now catches real bugs instead of being silenced.

3. **react-markdown spec rendering was the single highest-impact change.** Spec output went from raw `<pre>` terminal dumps to professionally formatted documents with real tables, headings, bold text, and code blocks. This directly impacts the capstone demo quality.

4. **Test suite grew 31% (54 to 71).** New tests cover pricing variants, onboarding navigation, preview images, Getting Started steps, empty state, and spec tab accessibility. No regressions introduced.

5. **Feature velocity was strong.** Five Pre-LLM MVP features (image upload, save/load, hex colors, SEO, brand) shipped in Sprint 2 alone. All were clean implementations with validation, error handling, and user feedback.

6. **UX review loop caught real issues.** The review agent found 15 genuine problems with file:line references. The P0s (pricing toggle opacity flash, navbar mobile overflow) would have been embarrassing in a demo. Fixing them same-session prevented regression.

---

## What Didn't Go Well (4 items)

1. **Screenshot generation took 3 attempts.** Zustand stores do not auto-hydrate from localStorage on page reload in the builder. The first two approaches (localStorage injection, reusing same page) produced identical screenshots. Only the third approach (fresh browser contexts with click-through) worked. This wasted ~45 minutes.

2. **Living checklist was completely stale after Session 1.** All Sprint 1 and Sprint 2 items still showed TODO when Session 2 started. This undermined the checklist's purpose as a living document. Must update checklist at the end of every session, not just when convenient.

3. **Agent file conflicts were a real risk.** In Sprint 3, the screenshot agent and pricing agents both modified `RealityTab.tsx` and `helpers.ts`. The additions happened to be compatible, but this was luck. Future swarms need explicit file ownership boundaries.

4. **PricingComparison data shape gap.** PricingToggle handles both `content.tiers[]` and `components[]` data shapes, but PricingComparison only handles `components[]`. If a user switches from Toggle to Comparison, features disappear. This was identified but not fixed.

---

## What We'd Do Differently (4 items)

1. **Assign explicit file ownership per agent.** Each agent in a parallel swarm should get a non-overlapping set of files. Shared files like `helpers.ts` should be assigned to exactly one agent, with others passing data via a coordination message.

2. **Update the living checklist at the end of every session, not just sprint boundaries.** The checklist is only useful if it reflects reality. A 2-minute update prevents 10 minutes of confusion.

3. **Start with the fresh-context approach for screenshots.** The lesson about Zustand hydration should be encoded in session memory so future screenshot tasks skip the two failed approaches.

4. **Run the 4-persona review earlier.** It was planned for Sprint 5 but got deprioritized. A mid-phase review (after Sprint 2 or 3) would have caught UX issues earlier and given more time to address them.

---

## Technical Debt Remaining

| Item | Priority | Notes |
|------|----------|-------|
| PricingComparison `content.tiers` parity | P1 | Only handles `components[]` data shape |
| NavbarCentered vertical height | P2 | `py-3` should be `py-2.5` |
| PricingToggle knob positioning | P2 | `translate-x-[28px]` doesn't fully reach right edge |
| Getting Started step connectors | P2 | Dashed lines between 1-2-3 steps |
| Empty state contrast boost | P2 | Stronger icon color + CTA pill background |
| Preview screenshots include tab bar | P2 | Should use preview mode before screenshotting |
| Features generator still B+ not A | P2 | Category grouping done but needs more descriptions |
| Newsletter form webhook | P2 | ActionNewsletter has no configurable URL |
| Console errors during demo flow | P1 | Needs audit pass |
| 4-persona composite review | P1 | Never conducted |

---

## Presentation DoD Status

**18/20 items DONE** (per master backlog). Remaining manual gates:

| # | Item | Status | Blocker |
|---|------|--------|---------|
| 12 | Copy spec into Claude, verify 90% reproduction | TODO | Requires manual testing |
| 20 | 15-min demo flows without "known issue" moments | TODO | Requires full rehearsal |

These are human-only gates that cannot be automated. Both require dedicated time from Bradley with a clear head and fresh browser.

---

## Key Metrics Summary

| Metric | Start of Phase | End of Phase | Delta |
|--------|---------------|-------------|-------|
| Tests | 54 | 71 | +17 (+31%) |
| `as any` casts | 144 | 0 | -144 (-100%) |
| Section variants | 53 | 57 | +4 |
| Spec generators upgraded | 0 | 6 | +6 |
| Pricing variants | 1 | 3 | +2 |
| New features | 0 | 5 | +5 (upload, save/load, hex, SEO, brand) |
| UX issues found | 0 | 15 | 15 found, 7 fixed |
| ADRs | 29 | 30 | +1 (ADR-030) |
| Dependencies added | 0 | 3 | react-markdown, remark-gfm, @tailwindcss/typography |

---

## Phase 10 Preflight

Phase 10 should focus on:
1. Remaining Presentation DoD items (manual gates)
2. 4-persona composite review (target 85+)
3. PricingComparison data shape fix
4. Console error audit
5. Demo rehearsal with timing notes
6. Final wiki updates with Phase 9 metrics
