# ADR-113 — Section Type Visual Quality Standard

- **Status:** Accepted
- **Date:** 2026-05-01
- **Phase:** P88 / SECTION-VISUAL-Q
- **Cross-refs (primary):** ADR-087 (Design Token System), ADR-091 (Canonical Component Quality), ADR-094 (Professional Grade Standard), ADR-100 (Section Type Completeness)

## Context

ADR-100 (P75 / OC-7) widened the section enum to 18 types — adding
`case-study` and `contact-form` alongside the pre-existing `menu`. The
P75 sprint shipped the type widening + JSON-shape conformance, but did
not put the new component templates through the ADR-094 ≥8.5 polish
rubric. ADR-111 (P86 / OC-POLISH-W4) declared the open-core library at
professional grade across user-visible surfaces, but the polish-wave-4
scope was the chat / listen / mobile shell — the section-template
components were not explicitly audited.

P88 closes that audit gap and, in the same sprint, closes the P86
carry-forward on `MobileListenFullscreen.tsx` (seven hard-coded hex
literals surfaced by P86 / A2 recon; deferred at P86 close because the
A2 dispatch focused on Welcome.tsx). ADR-113 names the standard that
governs section-type visual quality from this seal forward.

## Decision — the 4 section-visual standards

### 1. All 18 section types score ≥8.5 on the ADR-094 rubric

Every section type in the enum (per ADR-100) — including `menu`,
`case-study`, `contact-form`, and the 15 originals — MUST score ≥8.5
on the ADR-094 professional-grade rubric: typography rhythm, spacing
tokens, hover/focus states, contrast, accessibility. P88 / A1 audits
the three explicitly-named at-risk components (`menu` via
`NavbarCentered.tsx` / `NavbarSimple.tsx`, `case-study` via
`CaseStudyCards.tsx`, `contact-form` via `ContactFormSimple.tsx`).
Surfaces below 8.5 land on the carry-forward backlog with rationale.

### 2. menu / case-study / contact-form visual quality verified

The three section types added or pre-existing-but-unaudited at P86
close ship verified token compliance (`var(--hb-*)` references, no
ad-hoc hex literals), canonical hover-lift + focus-visible patterns
per ADR-091 (`transition-colors` / `hover:` / `focus-visible:` classes
present on each), and real copy (no `lorem ipsum`, no `TODO`, no
placeholder strings). P88 spec gate (P88.2) enforces presence of at
least one `transition-colors|hover:|focus-visible:` class per file.

### 3. MobileListenFullscreen tokenized — closes P86 carry-forward

`src/components/shell/MobileListenFullscreen.tsx` ships zero hard-coded
6-character hex literals after P88. The seven sites identified in P86
recon (`bg-[#faf8f5]`, `bg-[#2d1f12]`, `text-[#faf8f5]`,
`ring-[#6b5e4f]`, `bg-[#2d1f12]/30`, `text-[#6b5e4f]`,
`hover:bg-[#6b5e4f]`) migrate to existing `var(--hb-*)` tokens. P88
spec gate (P88.3) asserts `body.match(/#[0-9a-fA-F]{6}\b/g)?.length ||
0 === 0`. Visual identity preserved — color drift forbidden.

### 4. Future section types must ship with token compliance from day one

Any new section type added to the enum (e.g., `pricing-grid`,
`testimonial-quote`, `faq-accordion` — all Tier-2 candidates) MUST
ship with token-derived spacing/colors per ADR-087 + ADR-091 from
day-one PR. No carry-forward debt for new section types post-P88.
ADR-113 §4 is the citable rejection criterion for new-section-type
PRs that introduce hex literals or skip the ADR-091 hover-lift /
focus-visible primitives.

## Out of scope (Tier-2 / deferred)

- Animated section transitions (slide-in, fade-on-scroll, stagger) — Tier-2 commercial polish layer; would require Framer Motion / GSAP, banned by ADR-094 KISS continuation
- Per-section accessibility AAA (color-contrast 7:1, screen-reader landmark redundancy) — post-RC; AA is the open-core floor
- Section-level theming overrides (per-section color palette injection) — Tier-2 commercial; current section types inherit theme tokens uniformly
- Live visual regression testing (Percy / Chromatic / Playwright snapshot) — Tier-2 commercial; PURE-UNIT spec gate is the open-core proxy

## Acceptance gates per decision

1. **D1:** Every section type in the ADR-100 enum either shows a
   `transition-colors|hover:|focus-visible:` class in its template
   component or sits explicitly on the carry-forward backlog with
   rationale. Spec gate (P88.2) samples the three at-risk components.
2. **D2:** Each of `CaseStudyCards.tsx`, `ContactFormSimple.tsx`, and
   one of `NavbarCentered.tsx` / `NavbarSimple.tsx` contains at least
   one canonical interaction primitive class. Spec gate enforces.
3. **D3:** `MobileListenFullscreen.tsx` contains zero matches of
   `/#[0-9a-fA-F]{6}\b/`. Spec gate (P88.3) enforces. Visual-identity
   preservation verified by code-review at A2 self-report.
4. **D4:** Any new section-type PR cites ADR-113 §4 and ships token
   compliance from day one. Reviewers cite ADR-113 §4 as rejection
   criterion otherwise.

## Consequences

**Positive:**
- The section-type catalog now carries the same ≥8.5 professional-grade
  bar as the chat/listen/mobile shell. The library-wide polish
  declaration (ADR-111) becomes literally library-wide.
- The P86 carry-forward on `MobileListenFullscreen.tsx` token migration
  closes inside the open-core arc rather than leaking to commercial
  Tier-2. Carry-forward ledger shrinks by one P1 item.
- ADR-113 §4 establishes the citable forward-discipline standard. Future
  section-type expansions inherit token compliance as the entry bar.

**Negative:**
- The audit scope is the three at-risk types; the other 15 section
  types are presumed-passing without explicit re-scoring this sprint.
  Mitigation: ADR-091 + ADR-094 + ADR-095 already declared the floor
  on those components in earlier polish waves (P65b / P67 / P67b /
  P67c); P88 §1 widens that floor to the new arrivals.

**Mitigations:**
- Cross-refs ADR-087 (token system), ADR-091 (canonical), ADR-094
  (rubric), ADR-100 (enum completeness) — four pillars governing what
  section visual quality means, where it applies, what it scores, and
  which types are in scope.
- Spec gate (`tests/p88-section-visual.spec.ts`) is automatable and
  citable — passing doesn't guarantee a great visual render but
  failing guarantees a regression in token compliance or canonical
  primitives. Code-review discipline closes the gap from "passes the
  proxy" to "ships at ≥8.5".
