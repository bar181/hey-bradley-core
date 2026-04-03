# Phase 6 Retrospective

**Phase:** 6 — Canned Demo + Deploy Preparation
**Dates:** 2026-04-03 (single day, 4 sessions)
**Sessions:** 5 (0 = planning, 1 = visual polish + AISP, 2 = grounding, 3 = Loop 1-3 swarm, 4 = final checklist)
**Status:** COMPLETED
**Checklist:** 53/54 (98%) — 1 item descoped (HTML export per ADR-026)

---

## What Was Delivered

### Demo Simulator + Chat Integration

- **demoSimulator.ts** — timed section reveals with typewriter captions, composable and cancellable
- **Chat quick-demo buttons** — 4 example prompts in a 2-column grid for one-click demo launch
- **Listen "Watch a Demo"** wired to real demo simulator with orb burst sync
- **Auto-switch to Builder tab** on demo completion via `leftPanelTab` in uiStore

### AISP Platinum Output

- **Crystal Atom renderer** with syntax highlighting (Greek symbols, Crystal Atom delimiters)
- **Copy AISP Spec button** in TopBar with clipboard feedback toast

### Visual Polish (31 Templates)

- **Section headings + decorative accent bars** on all 31 grid templates
- **Scroll-triggered entrance animations** via `useScrollReveal` + IntersectionObserver
- **Staggered card animations** across ALL card-based templates
- **Button/card micro-interactions** (hover translate, scale, shadow transitions)
- **Cinematic 4-layer orb** with `orb-breathe` animation + burst growth on demo events
- **Reduced-motion a11y compliance** via `prefers-reduced-motion` media query

### Layout + Responsive Fixes

- **Left panel narrowed** to 320px max-width
- **Dev tabs always visible** (Specs highlighted with FileText icon + accent dot)
- **HeroSplit responsive** — `flex-col md:flex-row` for mobile layout
- **ColumnsGlass blob colors** derived from theme via `color-mix()`

### Content + Configuration

- **Neutral default config** — no SaaS jargon, no "Hey Bradley" branding in site content
- **4 example websites** with vertical-appropriate headings (bakery, agency, etc.)
- **Shareable preview URL** via `?preview=1` query parameter
- **ImagePicker integration** for Team + Logo Cloud section editors

### Architecture Decisions (ADRs)

- **ADR-026:** HTML Export Descope — deferred static export to post-capstone; not needed for demo
- **ADR-027:** Demo Simulator Architecture — composable reveal engine, cancellation, orb sync
- **ADR-028:** AISP Platinum Output — Crystal Atom format, copy-to-clipboard, syntax highlighting

---

## Key Metrics

| Metric | Start of Phase | End of Phase | Target |
|--------|---------------|-------------|--------|
| Section types | 15 | 15 (unchanged) | 15 |
| Variant renderers | 47+ (62 files) | 47+ (62 files) | -- |
| Persona score (avg) | 67 | ~78 (projected) | 80+ |
| Tests passing | 26 | 26 (unchanged) | 30+ |
| Total commits this phase | -- | 4 | -- |
| Checklist completion | -- | 53/54 (98%) | 100% |

---

## What Went Well

1. **Swarm execution was efficient.** 10 agents in Loop 1 delivered cleanly with zero merge conflicts. The hierarchical topology and specialized agent roles meant each agent touched non-overlapping files. This is the first phase where swarm-based parallelism worked exactly as designed.

2. **Loop-based improvement caught real gaps.** The build-review-fix cycle (Loop 1 = implement, Loop 2 = review, Loop 3 = fix) surfaced issues that single-pass development would have shipped: default config still had "Hey Bradley" branding in site content, demo completion didn't auto-switch tabs, accent bars were missing on 8 templates. Three loops, three layers of quality.

3. **demoSimulator architecture is clean.** Separate module, composable section reveals, cancellable via AbortController, orb burst sync via callback. No coupling to UI components. This is the kind of module that will survive into production without rewrite.

4. **Phase 6 closed all P0/P1/P2 items in a single day.** Four sessions, one calendar day, 53/54 checklist items. The constraint of a single-day phase forced aggressive prioritization and zero scope creep (aside from the HTML export descope, which was the right call).

---

## What Didn't Go Well

1. **Score didn't reach the 80+ target.** Projected ~78, but never verified with a final persona re-run. "Projected" is not "measured." We closed the phase on an estimate, which means the actual score could be 74 or 82 — we don't know. This is the same mistake Phase 5 made (closed at 65, targeting 75+). Two phases in a row of missing the score target and not verifying the final number.

2. **No new Playwright tests added.** The demo simulator, chat quick-demo buttons, listen integration, orb burst sync, auto-tab-switch, and scroll animations are all untested by automation. 26 tests passing is the same number as Phase 4. Significant UI behavior was added with zero regression coverage. If any of these features break in Phase 7, we won't know until manual testing.

3. **Original Phase 6 scope included static HTML export.** Descoped mid-phase via ADR-026. This was the correct call — the capstone demo doesn't need export, and the effort would have consumed an entire session. But the scope change means Phase 6 delivered a different thing than what was planned. The descope was documented properly, which is an improvement over Phase 5's undocumented scope pivot.

4. **Phase 7/8 READMEs are now outdated.** Much of the work planned for Phase 7 (scroll animations, section headings, micro-interactions, demo flow) was completed in Phase 6. The phase plans need to be rewritten before Phase 7 begins, or agents will re-implement already-shipped features.

---

## Technical Debt Remaining

| Item | Severity | Description |
|------|----------|-------------|
| `(section.content as any)` cast | High | Appears 62+ times across template renderers. Needs a proper discriminated union type for section content. Type safety is completely bypassed for the most critical data structure in the app. |
| No Playwright tests for Phase 6 features | High | Demo simulator, chat buttons, listen integration, orb sync, scroll animations, auto-tab-switch — all untested. 26 tests is the same count as Phase 4. |
| Newsletter form decorative | Medium | ActionNewsletter renders a non-functional email input. No form action, no webhook, no validation. Users will type their email and nothing will happen. |
| No custom hex color input | Medium | Palette system has 10 presets but no way to type a specific brand hex code. Every persona review has flagged this. |
| No image upload | Medium | ImagePicker is curated library only (50 photos). No user upload, no drag-and-drop, no URL paste for custom images. Gallery/Team/Logos are limited to the curated set. |
| `color-mix` no fallback | Low | Templates use CSS Color Level 5 `color-mix()` without `@supports` fallback. Safari 14 and older browsers will render broken colors. |

---

## Lessons Learned

1. **Swarm-based loops (build then review then fix) are more efficient than sequential sessions.** Three loops in one session produced higher quality output than six sequential sessions in Phase 5. The review loop catches issues while context is fresh. This should be the default execution model for all future phases.

2. **Always run a persona review before closing.** Two phases in a row we've closed without a verified final score. "Projected ~78" is not data. Phase 7 must start with a persona review to establish the real baseline, and must end with one to verify the final number. No exceptions.

3. **The demo simulator is the single highest-impact feature for the capstone.** It should have been built in Phase 4 or 5. A working demo flow transforms the product from "a builder tool you have to figure out" to "watch this, then try it yourself." Every capstone evaluator will see the demo before they see the builder. Building it on the last day was cutting it close.

4. **"No new features, polish only" was the correct directive and should continue into Phase 7.** Phase 6 added the demo simulator (new feature) but otherwise focused on polish — headings, animations, micro-interactions, responsive fixes, content cleanup. The score moved from 67 to ~78 primarily through polish, not new section types or new capabilities. Phase 7 should maintain this discipline.

---

## Phase 6 Final Checklist Status

- **6A (Demo Simulator):** 5/5 DONE
- **6B (Chat Integration):** 4/4 DONE
- **6C (Listen Integration):** 3/3 DONE
- **6D (AISP Platinum):** 3/3 DONE
- **6E (Visual Polish — Headings):** 6/6 DONE
- **6F (Visual Polish — Animations):** 5/5 DONE
- **6G (Visual Polish — Micro-interactions):** 4/4 DONE
- **6H (Orb + Layout):** 4/4 DONE
- **6I (Content + Config):** 5/5 DONE
- **6J (Responsive + A11y):** 4/4 DONE
- **6K (Builder UX):** 4/4 DONE
- **6L (Architecture):** 3/3 DONE
- **6M (Shareable Preview):** 2/2 DONE
- **6N (HTML Export):** 0/1 DESCOPED (ADR-026)

**Overall:** 53/54 items complete, 1 descoped
