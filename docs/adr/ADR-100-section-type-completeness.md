# ADR-100 — Section Type Completeness Standard

- **Status:** Accepted
- **Date:** 2026-05-01
- **Phase:** P75 / OC-7
- **Cross-refs:** ADR-079 (Premium Templates), ADR-091 (Canonical Component Quality), ADR-096 (Template Library Expansion), ADR-098 (Template Intelligence Architecture)

## Context

Through P58 (Open Core RC) and the OC-3 / OC-4 template waves the open-core shipped with **16 section types**: hero, menu, columns, pricing, action, footer, quotes, questions, numbers, gallery, logos, team, image, divider, text, blog. The P74 brutal-honest comprehensive review (`plans/strategic-reviews/2026-05-01-comprehensive-review-2-design-ux.md`) flagged two recurring expressive gaps:

1. **Portfolio + agency verticals** repeatedly forced text-heavy "case study with outcome metric" content into `gallery`, which is image-first and loses the narrative.
2. **Lead-capture verticals** (consultancy, services, course-landing) had no native form section — owners hand-rolled CTA text or stretched the `action` section.

OC-7 closes both gaps. `menu` was already in the enum (used as the navbar by every existing template); recon confirmed only **2 new types** are needed.

## Decision

Open-core canonical section types are **18**:

`hero · menu · columns · pricing · action · footer · quotes · questions · numbers · gallery · logos · team · image · divider · text · blog · case-study (NEW) · contact-form (NEW)`

### case-study

- Schema: `headline + body + outcomeMetric + clientName + media`
- Replaces gallery in agency / portfolio templates where the section is text-led with one supporting image and an outcome.
- Component: `CaseStudyCards.tsx` — canonical-component grade per ADR-091 (token-derived spacing, hover-lift, no hardcoded colors).

### contact-form

- Schema: `name input + email input + message textarea + submit button`
- **Visual-only**: emits no real network submission. Submission, validation library, captcha, and persistence are explicitly Tier-2 commercial.
- Component: `ContactFormSimple.tsx` — canonical-component grade.

### Bar for future section types

A new section type may be proposed iff:

1. It appears (or would appear) across **≥3 vertical templates**.
2. It cannot be expressed as a variant of an existing type (e.g. a "stats banner" is just `numbers` styled differently — not a new type).
3. It ships with full canonical-component discipline (ADR-091): token-derived design, hover-lift transitions, decomposed sub-components if >150 LOC, accessible by default.

## Bounded-context impact

- `configuration` — `SectionType` enum widening (+2)
- `ui-shell` — 2 new section components, 2 new SectionSimple editors, QuickAddPicker card additions

## Out of scope

- Real form submission, validation, captcha, anti-spam (Tier-2)
- Per-vertical custom section types (e.g. "menu-card" for restaurants — handled by content + theme tuning, not a new type)
- Community-contributed types (no contribution path in open-core)

## Acceptance gates

- `SectionType` enum contains 18 entries including `case-study` and `contact-form`
- Both new components exist under `src/templates/{case-study,contact-form}/`
- Both new editors exist under `src/components/right-panel/simple/`
- QuickAddPicker shows both with `data-testid="quick-add-case-study"` and `data-testid="quick-add-contact-form"`
- A2's gallery audit pass complete (P75 / Track A2)

## Consequences

**Positive:**
- Portfolio + agency templates can finally express case-study narrative natively.
- Lead-capture verticals (consultancy, course-landing, booking-calendar) can ship a real form section visually.
- `case-study` distinguishes outcome-bearing narrative from `gallery` image-first display — semantic clarity for the matcher (ADR-098).

**Negative:**
- 18 types is now the new "complete" bar — owners may push for more without clearing the gates above.
- `contact-form` is visual-only and will frustrate users expecting actual submission; copy must be honest about Tier-2 boundary.

**Neutral:**
- Cross-references ADR-079 (premium templates) — case-study is a premium-template enabler.
- Cross-references ADR-098 (template intelligence) — new section types must surface in `sectionLibrary.ts` exampleQueries when relevant.
