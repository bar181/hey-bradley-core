# ADR-070: Builder UX Enhancement

**Status:** Accepted
**Date:** 2026-04-29 (P47 Sprint I P1)
**Deciders:** Bradley Ross
**Phase:** P47

## Context

Sprint H sealed at avg 89.7 (P44 88 / P45 91 / P46 90), shipping the full
reference lifecycle (upload → store → inject → manage). End-of-sprint reviewer
feedback (R1 UX) flagged builder discoverability as the next ceiling: the
left-panel section list grew to 16 section types and the right-panel section
editors lacked accessible labels and focus management. None of this affects
the AISP pipeline or LLM contract — it is pure builder-mode UX polish.

P47 (Sprint I Wave 1) closes that gap with two parallel agent slots: A1 polishes
the `SectionsSection` row + add-section picker; A2 hardens accessibility
across the right-panel section editors. This ADR records the contract.

## Decision

### Section-list polish (A1 — `SectionsSection.tsx`)

Three coupled enhancements to the left-panel section list:

1. **Collapse/expand per row.** Each section row carries a chevron toggle that
   collapses its inline preview. State is held in a `useState<Set<string>>()`
   keyed by section id. The first section is open by default to keep the
   "what is this?" affordance visible for new users; subsequent rows are
   collapsed by default to reduce visual load on long lists.
2. **Categorized add-section picker.** The add-section grid groups the 16
   section types into 4 visible categories: *Hero & CTA*, *Content*,
   *Social Proof*, *Layout*. A persistent "All" tab keeps the existing flat
   grid as a fallback. Active category lives in a `useState<string>('All')`.
3. **Arrow-key navigation in the list.** Each row carries an `onKeyDown`
   handler that routes `ArrowUp` / `ArrowDown` to the prev / next row and
   `Enter` / `Space` to the collapse toggle, mirroring the WAI-ARIA listbox
   pattern. No new dep — hand-rolled.

### Right-panel a11y (A2 — `right-panel/simple/*.tsx`)

1. **ARIA labels on every editor.** `SectionSimple.tsx` and the per-type
   editors (`CTASectionSimple`, `FeaturesSectionSimple`,
   `TestimonialsSectionSimple`, …) carry either `aria-label`, `aria-labelledby`,
   or `<label htmlFor=` form patterns on every interactive control. Headings
   reference the editor via `id` so screen readers announce the section type
   on focus.
2. **Focus management on add/delete.** When a new section row is added the
   first input inside the new editor receives focus via a `useRef` +
   `focus()` in an effect. When a section is deleted, focus moves to the
   previous row to preserve keyboard flow.
3. **Escape closes popovers (no keyboard traps).** `ImagePicker.tsx` and
   `FontSelector.tsx` carry an `onKeyDown` handler that dismisses the
   popover on `Escape` and returns focus to the trigger. No focus-trap
   library — single-element popovers do not need one.

## Trade-offs

- **Collapsed-by-default could hide content from new users.** Mitigated by
  keeping the first section open and by leaving the chevron visually
  prominent on every row.
- **Category picker adds one click** vs the existing flat grid. Mitigated by
  the persistent "All" tab — power users skip categories entirely.
- **Hand-rolled arrow-key nav** vs adopting `react-aria` / `@dnd-kit`.
  Deliberate KISS choice: drag is already implemented natively (P15) and the
  listbox keyboard contract is ~30 LOC. Adopting `react-aria` would pull
  ~60 KB of unused surface for two interactions.
- **`focus()` in an effect** can race with parent re-renders. Mitigated by
  guarding on a one-shot `focusOnAdd` flag that resets after the first run.

## Consequences

- (+) Discoverability for the 16-section catalog jumps — Grandma persona is
  expected to climb on the *"how do I add a Pricing section?"* probe.
- (+) Right-panel a11y compliance milestone — every editor is now
  screen-reader navigable. Foundation for a future WCAG audit phase.
- (+) Foundation for Sprint I+ Wave 3 (mobile pass) — the collapse pattern
  is the natural primitive for narrow-viewport rendering.
- (-) Visual regression risk in narrow viewports (collapsed rows + category
  tabs both compete for vertical space). Mitigated by Wave 3 mobile pass.
- (-) Shipping two coupled agent slots in one phase — review burden lands
  on a single 4-reviewer brutal pass at sprint close.

## Cross-references

- **ADR-022** — Section Type Registry (the 16-type catalog A1 categorizes).
- **ADR-040** — Local SQLite Persistence (kv table; collapse state is
  ephemeral, NOT persisted — deliberate, keeps storage clean).
- **ADR-053** — INTENT_ATOM (target taxonomy aligns with the 4 categories).
- **ADR-067** — Brand Context Upload (Sprint H opener; UX precedent for
  Settings drawer mounting pattern reused on the right panel).
- **ADR-068** — Codebase Reference Ingestion (Sprint H sibling).
- **ADR-069** — Context Management (Sprint H closer; established the
  manifest-only-reads + per-row clear-button motif this ADR mirrors at the
  section-row level).

## Status as of P47 seal

- A1 `SectionsSection.tsx` collapse/expand + categorized picker + arrow-key
  nav: TBD (seal commit).
- A2 `right-panel/simple/*.tsx` ARIA + focus + Escape: TBD (seal commit).
- A3 ADR-070 (this file) + `tests/p47-builder-ux.spec.ts`: shipped.
- Cumulative regression count + persona re-score recorded at sprint close
  (Sprint I Wave 3, P49+).
