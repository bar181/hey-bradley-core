# P53 Preflight — Sprint J Wave 4 (Mobile UX + Sprint J seal)

**Source:** `plans/implementation/sprint-j-personality/03-sprint-j-locked.md` §P53
**Inbound state:** P52 sealed via mixed agent + manual-write closure (timeouts on A7/A9; A8 clean). 21 new test cases added → ~194 cumulative GREEN target.

## Scope (3 agents)

| Agent | Owner-stated scope | Files |
|---|---|---|
| **A10** | `MobileLayout.tsx` — 3-tab sticky nav (Chat / Listen / View). Builder hidden at `< md:`. Hamburger mounts all advanced features (specs, AISP, logs, settings, BYOK, brand voice, codebase upload, share spec). | NEW `src/components/shell/MobileLayout.tsx` (≤280 LOC) · NEW `src/components/shell/MobileMenu.tsx` (≤220 LOC) · `src/pages/Builder.tsx` (`md:hidden` switch, ≤25 LOC delta) |
| **A11** | Preview tab sticky nav. Listen mobile polish (bigger PTT button, press-state). Touch interactions verified. | `src/components/center-canvas/RealityTab.tsx` (sticky top mini-nav on mobile preview, ≤30 LOC delta) · `src/components/left-panel/ListenTab.tsx` or `MobileLayout` (PTT mobile size + active press-state, ≤40 LOC delta) |
| **A12** | ADR-076 + 15 tests + brutal review + fix pass + seal artifacts. Update wiki + GROUNDING. | NEW `docs/adr/ADR-076-mobile-ux-overhaul.md` (≤120 LOC) · NEW `tests/p53-mobile-and-seal.spec.ts` (~15 cases) · NEW `plans/implementation/phase-53/deep-dive/01-sprint-j-review.md` (≤200 LOC) · `docs/wiki/llm-call-process-flow.md` (`Last verified: P53 sealed`) · `docs/GROUNDING.md` |

## Locked decisions reaffirmed

- D7 (mobile UX) — owner override of north-star X8: Builder mobile = stay out; Chat/Listen/Preview mobile = ship.
- ADR-076 cross-refs: ADR-072 (P49 Tailwind-only mobile precedent), ADR-073/074/075 (Sprint J upstream).
- ADR-076 narrows X8 operationally — does NOT amend the rule itself.
- Cumulative test target: ~615 GREEN at seal.

## Risks (Wave 4 specific)

- **Stream-timeout exposure:** P52 lost 2 of 3 agents to timeouts. Wave 4
  should keep agent prompts crisp (≤500 words per agent) and prefer
  sequential fallback if the network destabilizes.
- **Mobile layout overhaul scope:** A10 is the largest single-agent task
  in Sprint J. Consider splitting MobileLayout vs MobileMenu into two
  agents if dispatch reveals it's too large.
- **A12 brutal review breadth:** Per owner mandate, the end-of-sprint
  review is comprehensive (single file chunked at 600 LOC, multiple
  chunks expected, includes Playwright browser tests with screenshot
  UI/UX analysis). This is a separate post-Wave-4 step that needs its
  own dispatch + scope. A12's brutal review here is **Sprint J only**;
  the comprehensive system-wide brutal review is the next step after
  Sprint J seals.

## Post-Wave-4 sequence

1. Wave 4 commits (A10 + A11 + A12 land as one wave)
2. Sprint J seal commit (composite + persona scores + cumulative regression)
3. **Comprehensive brutal review (system-wide):** chunked 600-LOC files,
   includes Playwright browser tests + screenshot UX analysis. Multiple
   reviewer agents, each owns one chunk.
4. Sprint J presentation refresh (`docs/wiki/presentation-readiness.md`)

## Gate to dispatch

- P52 commit + push lands first.
- Owner sign-off on whether to dispatch Wave 4 immediately or pause for
  comprehensive review prep first.
