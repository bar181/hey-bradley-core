# P67b — Close the Gap (7.9 → 8.5 Professional Grade)

> **Phase:** P67b · **Sprint:** Polish Wave 2 closure
> **Date:** 2026-04-30
> **Predecessor:** P67 / Polish Wave 2 sealed at `17c9635` (570/570 GREEN, score 7.9)
> **Mandate:** hit 8.5 — close ChatInput orchestrator carry-forward, sub-page hero polish, mobile real-device audit

---

## ChatInput target — honest reframe

Owner brief: orchestrator ≤300 LOC. Recon shows that's NOT achievable with just the 3-component consume:

| Block | LOC | Replaceable by |
|---|---:|---|
| Personality popover (lines ~611-660) | ~60 | ChatInputPersonalityPopover |
| Quick actions panel (lines ~849-974) | ~125 | ChatInputQuickActions |
| Input form + send (lines ~985-1010) | ~25 | ChatInputBar |
| **Total replaceable** | **~210** | |
| Orchestrator after consume | **~833** | (1013 − 210 + 30 import/JSX overhead) |

To hit ≤300, would need to ALSO extract ChatThread (message rendering loop with personality bubbles + Geek footer + Teacher chips, ~150 LOC) + useChatPipeline hook (submit + error handling, ~150 LOC) + effects bundle. That's a further refactor sprint.

**Honest target this sprint:** orchestrator ≤700 LOC. Good progress from 1013. ≤300 deferred to P67c if owner wants further decomposition.

---

## 3 parallel sub-modules + A4 closer

### A1 — ChatInput orchestrator (carry-forward)

**Owns:** `src/components/shell/ChatInput.tsx` (EDIT only).

3 explicit deletion ranges + 3 import/JSX inserts. Target ≤700 LOC (relaxed from owner's ≤300 per recon).

### A2 — Sub-page hero polish

**Owns:** `src/pages/{AISP, OpenCore, Research, Blog, Progress}.tsx` (EDIT, surgical hero consistency).

Per page:
- Consistent hero: eyebrow + headline + sub + ONE CTA (per ADR-092 standards)
- Same padding/typography from design tokens
- No orphaned text blocks or misaligned sections
- Score 1-10; fix any below 8

### A3 — Mobile real-device audit + fix

**Owns:** any page-level CSS or Tailwind class adjustments needed for 375px / 390px / 428px viewports. Likely surfaces:
- ListenModeDemo / ChatModeDemo at small viewports (mic + transcript readability; keyboard not covering input)
- MobileFirstRunCard at small viewports
- MarketingNav hamburger
- Onboarding card stacks

NEW file allowed: `tests/p67b-mobile-audit.spec.ts` if useful — but A4 owns the canonical test spec.

### A4 — Brutal review + ADR-094 + EOP

**Owns:**
- `docs/adr/ADR-094-professional-grade-standard.md` (≤120 LOC)
- `tests/p67b-close-the-gap.spec.ts` (≥10 cases)
- `plans/implementation/phase-67b/{02-post-review.md, session-log.md, retrospective.md}`

ADR-094 captures: what 8.5 means quantitatively (e.g., per-surface gate); enforcement via test spec.

---

## Hard rules (all 4 agents)

1. NO new dependencies
2. NO Framer Motion / GSAP / Lottie / React Spring / animejs
3. NO new CSS files. Tailwind only.
4. NO breaking JSON config contract or section-renderer behavior
5. NO copy changes (CTAs are owner-supplied verbatim from ADR-092)
6. NO touching files outside owned list
7. NO shell commands inside agents
8. TypeScript-strict

---

## Acceptance gates

- A1: ChatInput.tsx ≤700 LOC; imports the 3 sub-components; renders them in place of deleted blocks; preserves Geek `INTENT_ATOM` + Teacher `Try:` literals (P66/P67 tests)
- A2: 5 sub-pages have consistent hero pattern; each scores ≥8/10
- A3: 3 viewport breakpoints render cleanly; layout-break fixes documented
- A4: ADR-094 Accepted; ≥10 tests passing; cumulative 585+ GREEN
- tsc clean; adjacent regression GREEN

---

## Successor

Polish Wave 3 if any surface still <8.5 OR OC-4 Templates Round 2 if all surfaces ≥8.5.
