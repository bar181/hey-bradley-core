# ADR-076: Mobile UX Overhaul (north-star X8 bifurcation)

**Status:** Accepted
**Date:** 2026-04-29
**Deciders:** Bradley Ross
**Phase:** P53

## Context

Sprint J's wow-factor metric explicitly includes mobile parity for the surfaces
where mobile-native makes sense: voice capture (Listen) and spec consumption
(Preview). The competitive trigger is concrete — Lovable's mobile app launched
2026-04-27, and a founder with an idea on a walk who can't even open Hey
Bradley on their phone leaks the demo to a competitor in 3 taps.

This ADR documents locked decision **D7** in
`plans/implementation/sprint-j-personality/03-sprint-j-locked.md` — owner
override of north-star X8 (mobile out of scope). Per
`plans/strategic-reviews/2026-04-29-product-evaluation.md` §8, the prior X8
ruling was "too broad — voice + spec are mobile-native, building is not."
ADR-076 narrows X8 operationally without amending the rule itself: **Builder
mobile remains out forever; Chat / Listen / Preview mobile is in.**

## Decision

### `MobileLayout.tsx` (≤280 LOC; `md:hidden` parent wrapper)

3-tab sticky bottom-nav shell — `chat`, `listen`, `view` — that re-uses the
existing `ChatInput`, `ListenTab`, and `RealityTab` components verbatim. Tab
state is local React useState (no Zustand). Active personality emoji surfaces
in the top bar so the wow-factor toggle remains visible on mobile. Renders
only at `<768px` via the `md:hidden` wrapper class.

### `MobileMenu.tsx` (≤220 LOC; hamburger drawer)

Slide-in modal (`role="dialog"` + `aria-modal`) that mounts the six advanced
surfaces inline rather than duplicating any UI: `PersonalityPicker`,
`ReferenceManagement`, `BrandContextUpload`, `CodebaseContextUpload`,
`ShareSpecButton`, and (EXPERT-only) a Conversation Log link that calls
`setActiveTab('CONVERSATION_LOG')` and closes the menu. Escape closes and
restores focus to the trigger button (a11y). KISS: no portal, no new deps.

### `Builder.tsx` responsive switch (≤25 LOC delta)

Desktop tri-pane (`AppShell`) wears `hidden md:flex`; `MobileLayout` carries
its own `md:hidden`. No JS viewport detection — pure Tailwind responsive
variants — mirrors the P49 / ADR-072 precedent and keeps the layer
server-render-safe.

### `RealityTab.tsx` mobile sticky preview nav (testid `mobile-preview-stickynav`)

A single sticky-top mini-nav (`md:hidden sticky top-0 z-10`) shows the active
page title + a "Preview" hint. Anchors the View tab inside MobileLayout
without duplicating the desktop preview-mode chrome.

### `ListenControls.tsx` PTT mobile polish

Bigger tap target (`max-md:w-24 max-md:h-24 max-md:rounded-full`), active
press-state (`active:scale-95 active:bg-hb-accent/20`), and `touch-none` to
suppress double-tap zoom. Single class-string change — no JS, no new state.

### Tailwind `max-sm` / `md:` variants only — no JS viewport detection

Mirrors the P49 / ADR-072 ruling. Zero new dependencies; zero `window.matchMedia`;
zero `useEffect` viewport listeners. Responsive variants encode the breakpoint
in CSS — pure declarative, server-render-safe, free at runtime.

### X8 narrowing rationale

Voice and spec consumption are mobile-native (a phone's microphone is
better than its keyboard; a phone is the most common "where I read things"
device). Building (drag layout, multi-pane edit, JSON inspector) is
desktop-native. Bifurcating X8 along that line lets the wow-factor demo
plausibly start from a phone — voice → spec → share → "look what I made" —
without dragging the builder along into a surface where it can't fit.

## Trade-offs

- **MobileLayout duplicates a small amount of routing logic** that lives in
  `Builder.tsx` / `AppShell.tsx`. Acceptable: KISS over abstraction at this
  scale. The shared components themselves are not duplicated.
- **The hamburger holds six surfaces in one drawer.** Acceptable trade for
  mobile screen real estate; arrow-key nav inside picker components is
  preserved; touch users get a scrollable single-column flow.
- **No bottom-sheet pattern, no swipe gestures, no haptics.** Deliberate per
  the ADR-072 precedent (Material-style ripples / vibrate API live outside
  the design language).
- **Builder remains desktop-only at all viewports.** Spirit of X8 preserved.
  A user on a phone gets a clean mobile experience for the surfaces that
  matter (Chat / Listen / Preview); attempting to drag-edit on a phone
  remains explicitly out of scope.

## Consequences

- (+) Mobile users get a usable Chat / Listen / Preview surface; viral demo (voice → spec → share) plausible from a phone.
- (+) Builder stays desktop-only per X8 spirit; no half-built mobile editor.
- (+) Zero new dependencies; package.json deps unchanged. Tailwind-only — zero bundle-size delta beyond two new TSX files.
- (-) Two new files under `src/components/shell/` add maintenance surface on every layout refactor (acceptable; both ≤280 LOC).
- (-) Hamburger is one screen for six surfaces — visual hierarchy relies on section dividers + heading scale alone.

## Cross-references

- **ADR-022 / ADR-031 / ADR-053** — Public-site IA / Welcome.tsx lineage
- **ADR-070** — Sprint I Wave 1 (builder UX collapse + categorized picker)
- **ADR-071** — Sprint I Wave 2 (QuickAddPicker + improvementSuggester)
- **ADR-072** — Sprint I Wave 3 mobile polish — Tailwind-only precedent
- **ADR-073** — P50 personality composition (active personality emoji surfaces in top bar)
- **ADR-074** — P51 picker + onboarding (PersonalityPicker re-mounted in hamburger)
- **ADR-075** — P52 conversation log + share (Share button + log link in hamburger)

## Status as of P53 seal

- ADR-076 full Accepted
- MobileLayout + MobileMenu + Builder responsive switch shipped
- RealityTab mobile sticky preview nav shipped
- ListenControls PTT mobile polish shipped
- Tests p53-mobile-and-seal.spec.ts: 15 cases
- north-star X8 narrowed operationally; original ruling not amended
