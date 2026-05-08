# P65 / OC-2.5 — Retrospective

**Date sealed:** 2026-04-30 · 450/450 cumulative GREEN

## Keep

- **Insertion mid-chain when owner reframes the problem.** The launch plan listed OC-1 → OC-2 → OC-3 → OC-4. Owner reframe at OC-3 close — "visual polish is a design-system problem, not a template-count problem" — surfaced the missing foundation. Inserting OC-2.5 BEFORE OC-4 means the next 14 templates inherit the system from day one. **Pattern: sprint chains are not contracts; reframes are evidence-driven.**
- **Single-file token system (TypeScript, not CSS).** Owner's KISS rule was right: tokens in one TS file, Tailwind for everything else, no animation libraries. Total: 76 LOC. Trivial to extend, trivial to type-check, zero runtime overhead. Resists scope creep (no `src/styles/colors.ts`, `src/styles/spacing.ts`, etc.).
- **Test spec enforces KISS rule.** P65.6 asserts NO `framer-motion` / `gsap` / `lottie` / `@react-spring` strings appear in `design-tokens.ts` AND ADR-087 explicitly disclaims them. The discipline is encoded in tests, not just docs — drift detection is automatic.
- **Existing 26 templates EXEMPT this sprint.** Migration deferred to OC-8 Clean UI Pass. Avoids a 26-template refactor mid-design-system-rollout. Right call; new templates get tokens from day one, old templates migrate later when the change set is small and reviewable.
- **DDD doc formalizes implicit context.** `ui-shell` was implicit before; now it has a doc listing all aggregates (uiStore, design tokens, mode selector, AISP trace pane, personality picker, latency badge). Makes future DDD work tractable.

## Drop

- **None.** Sprint went exactly as scoped. Agent took 108s wall, all 4 deliverables on-spec, 11/11 tests GREEN, no rework.

## Reframe

- **OC-2.5 Wave 2 (Hero/Feature/Testimonial component rewrite) is now a separate sprint.** Not folded into OC-2.5. Reasoning: this sprint locked the CONTRACT; the COMPONENT WORK consumes it. Splitting them lets each have a clean DoD. The component-rewrite sprint (likely OC-8 or OC-8a) will assert the static-check rule from ADR-087 — no hard-coded `'24px'` / `'48px'` / `'96px'` literals in canonical components.
- **Visual polish 6/10 → 6.5/10 estimated.** Token system alone doesn't move the needle on user-visible polish until OC-2.5 Wave 2 ships. The contract is now real, but the UI hasn't changed yet. Honest reframe: OC-2.5 is INFRASTRUCTURE; OC-2.5 Wave 2 is VISIBLE.
- **OC-4 templates Round 2 is now scoped to USE the tokens.** Each new template's `style:` blocks should reference token-derived values where applicable (or use the component prop API once Wave 2 ships). Test spec for OC-4 should add a check that new templates pass the token audit — not a deep one, just spot-checks on hero padding, spacing-y, etc.

## Carry-forward

| Item | Where it lives next |
|---|---|
| Hero / Feature / Testimonial component rewrite (consumes ADR-087 contract) | OC-2.5 Wave 2 (separate sprint, post-OC-4) |
| Migration of existing 26 templates' `style:` blocks to token references | OC-8 Clean UI Pass |
| Color tokens (theme-color system) | Future ADR (separate decision; ADR-087 is non-color tokens only) |
| Per-mode design variants (Whiteboard / Planning / Agentics) | AW-1..10 work |
| Static-check tooling (eslint rule? Playwright assertion?) for "no hard-coded spacing in canonical components" | OC-2.5 Wave 2 |

## Cumulative state at OC-2.5 seal

- Tests: **450/450 PURE-UNIT GREEN** (was 439 at OC-3)
- ADRs: **89 Accepted** (+ADR-087 — Design Token System; was 88 at OC-3)
- Templates: 26 (unchanged)
- Ruvector: 108 → 109 entries (+1 for P65)
- Bounded contexts formally documented: 2 → 3 (added ui-shell to data-flow + stage-2)
