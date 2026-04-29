# ADR-072: Sprint I Wave 3 — Mobile Polish + C11 Closure

**Status:** Accepted
**Date:** 2026-04-29 (P49 Sprint I P3)
**Deciders:** Bradley Ross
**Phase:** P49

## Context

Sprint I Waves 1 + 2 (P47 / ADR-070 and P48 / ADR-071) shipped builder-mode UX
polish and the quick-add + improvement-suggester pair. Wave 3 (P49) closes the
oldest open carryforward — **C11** (mobile/<600px UX), originally deferred at
P22 when the public Welcome page shipped without a narrow-viewport pass.

Two parallel concerns drive Wave 3:

1. **Welcome.tsx (public marketing)** — the three-mode card grid (`md:grid-cols-3`)
   collapsed to a single column on `<sm`, but stacked vertically as a long
   scroll without snap behaviour or per-card framing.
2. **Builder-mode touch parity** — `:hover` affordances (action bar buttons,
   AddSectionDivider, drag handle) had no `:active` fallback for touch users
   who never get a hover state.

This ADR records the Wave 3 decisions made by A7 (parallel to A8's review +
seal artifacts).

## Decision

### C11 closure — Welcome.tsx vertical-snap carousel (`<640px`)

The three-mode grid collapses to a vertical snap-list at `max-sm` (Tailwind's
≤639px breakpoint, the closest match to the original P22 `<600px` target):

- Layout: `max-sm:grid-cols-1 max-sm:snap-y max-sm:snap-mandatory max-sm:overflow-y-auto max-sm:max-h-[80vh]`.
- Cards: `max-sm:snap-center max-sm:min-h-[60vh] max-sm:flex max-sm:flex-col max-sm:justify-center`.
- **No JS viewport detection.** Pure Tailwind responsive variants. Zero new
  state, zero new event listeners, zero new dependencies.

### Touch parity — `active:` variants on hover-driven affordances

Builder surfaces that previously relied on `hover:` for visual feedback now
carry matching `active:` variants:

- `SectionsSection.tsx` action-bar buttons (move-up / move-down / duplicate /
  delete): `active:bg-hb-surface-hover` + `active:text-red-400` on the trash
  icon. Drag handle: `active:cursor-grabbing` + `active:text-hb-text-muted`.
- `RealityTab.tsx` `AddSectionDivider`: `active:text-hb-accent` +
  `active:border-hb-accent/50` (already shipped in P47 — verified intact).
- `QuickAddPicker.tsx` cards: `:focus` ring (`focus:ring-1 focus:ring-hb-accent`)
  serves as the touch press feedback — touch tap fires focus, focus shows
  ring. No `active:` variant added; documented as deliberate.

### Deliberate non-extensions

- **No new dependency.** `package.json` does NOT add `@dnd-kit/*`, `embla*`,
  `swiper*`, or `react-aria`. The Tailwind primitives are sufficient.
- **No JS viewport detection / `window.matchMedia`.** Responsive variants
  encode the breakpoint in CSS — pure declarative, server-render-safe.
- **No haptics, no vibrate API, no PWA manifest changes.** Out of Wave 3
  scope; tracked as a deferred `mobile-haptics` item for Sprint K (RC).
- **QuickAddPicker mobile grid responds via `max-sm:grid-cols-1`** (already
  in place; verified by the test gate — see `tests/p49-mobile-polish.spec.ts`
  P49.4).

## Trade-offs

- **`max-sm` (≤639px) vs original `<600px` target.** The 39px delta is
  acceptable — modern phones cluster at 360 / 375 / 390 / 414px CSS px;
  iPad-mini-portrait (768px) deliberately stays on the desktop layout.
- **Pure-CSS carousel vs JS-driven carousel (Embla, Swiper).** A JS carousel
  would unlock pagination dots + edge-fade. Snap-list is one-line CSS, zero
  bundle cost, native scroll inertia. KISS wins.
- **`active:` on touch is fire-and-forget** — no haptic, no ripple. Matches
  the rest of the builder-mode design language (no Material ripples
  anywhere); deliberate.

## Consequences

- (+) C11 closes — oldest open carryforward sealed (P22 → P49, ~7 phases of
  carry).
- (+) Touch users on phones / tablets get visual feedback on every press —
  no silent affordances.
- (+) Zero bundle-size delta; zero new dep audit surface.
- (+) Wave 3 unblocks Sprint J (Agentic Support System) to ship without
  re-litigating mobile polish in its planning.
- (-) `max-sm:max-h-[80vh] max-sm:min-h-[60vh]` can over-fill a narrow
  desktop window resized below 640px. Acceptable for v1; revisit at RC.
- (-) `prefers-reduced-motion` is NOT respected on `hover:scale-[1.03]` in
  QuickAddPicker — flagged as a should-fix in the Sprint I review
  (`plans/implementation/phase-49/deep-dive/01-sprint-i-review.md`).

## Cross-references

- **ADR-022** — Public website / marketing pages (the surface C11 originally
  applied to; Welcome.tsx lives in this lineage).
- **ADR-031** — Public-site IA (sibling marketing ADR; same lineage).
- **ADR-070** — Sprint I Wave 1 (builder UX collapse + categorized picker).
- **ADR-071** — Sprint I Wave 2 (QuickAddPicker + improvementSuggester).
- **ADR-053** — Public Site IA (Welcome.tsx is the entry node).

## Status as of P49 seal

- A7 Welcome.tsx C11 vertical-snap carousel: shipped.
- A7 SectionsSection + RealityTab `active:` touch parity: shipped (P47 carry +
  P49 reinforcement).
- A7 QuickAddPicker `max-sm:grid-cols-1`: shipped.
- A8 ADR-072 (this file) + `tests/p49-mobile-polish.spec.ts` + Sprint I
  brutal-honest review + wiki refresh: shipped.
- Composite Sprint I score: **91/100** (Grandma 83 / Framer 91 / Capstone 99).
- Cumulative regression count carries forward to Sprint J P50+.
