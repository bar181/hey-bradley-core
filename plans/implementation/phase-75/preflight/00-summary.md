# P75 / OC-7 — Section Type Closure (Preflight)

> **Phase:** P75 · **Sprint:** OC-7 · **Date:** 2026-05-01
> **Predecessor:** P74 sealed at `819be2e` (873 GREEN, 99 ADRs)
> **Companion:** P76 / OC-9 (Spec Quality + Export Polish, parallel)

## Honest reframe

Owner brief: "Add menu, case-study, contact-form section types." Recon shows **menu already exists** in `SectionType` enum at `src/lib/schemas/section.ts:6` — it's used by every existing template as the navbar. **Only 2 new types needed: `case-study` + `contact-form`.** Final SectionType count: 16 → 18.

## 3 parallel agents

### A1 — 2 new section types (case-study + contact-form)
**Owns:**
- `src/lib/schemas/section.ts` (EDIT — add 2 types to enum)
- `src/lib/schemas/intent.ts` (EDIT — add to intent target enum if needed)
- `src/templates/case-study/CaseStudyCards.tsx` (NEW — section component)
- `src/templates/contact-form/ContactFormSimple.tsx` (NEW — section component)
- `src/components/right-panel/simple/CaseStudySectionSimple.tsx` (NEW — section editor)
- `src/components/right-panel/simple/ContactFormSectionSimple.tsx` (NEW — section editor)
- `src/components/left-panel/QuickAddPicker.tsx` (EDIT — add 2 cards with thumbnails)

### A2 — Gallery audit + migration
**Owns:**
- `src/data/examples/*.json` (READ all 31 JSON templates; identify gallery sections that should be case-study)
- For misuses: convert in-place to case-study type with appropriate component shape
- Verify gallery section retains distinct visual treatment (image-first, not card-with-text)

### A3 — Tests + ADR-100 + EOP
**Owns:**
- `docs/adr/ADR-100-section-type-completeness.md` (NEW; ≤120 LOC)
- `tests/p75-section-type-closure.spec.ts` (NEW; ≥15 cases)
- `plans/implementation/phase-75/{02-post-review.md, session-log.md, retrospective.md}`
- CLAUDE.md sync (ADRs → 100; section types 16 → 18; tests +15)

## Hard rules
1. NO new dependencies
2. NO Framer Motion / GSAP / Lottie / React Spring / animejs
3. case-study + contact-form components follow canonical-component pattern (ADR-091): import tokens, hover-lift, no hardcoded spacing
4. Case-study schema: `headline + body + outcomeMetric + clientName + media`
5. Contact-form schema: `name input + email input + message textarea + submit button` (form-style; no real submission — just visual; submission is Tier-2)
6. NO shell commands inside agents
7. TypeScript-strict
