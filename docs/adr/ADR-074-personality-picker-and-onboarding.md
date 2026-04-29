# ADR-074: Personality Picker UI + First-Run Onboarding Step

**Status:** Accepted
**Date:** 2026-04-29 (P51 Sprint J Wave 2)
**Deciders:** Bradley Ross
**Phase:** P51

## Context

P50 (ADR-073) shipped the invisible engine — a pure-rule
`renderPersonalityMessage(envelope, personalityId, intentTrace)` composing a
secondary chat-bubble voice AFTER PATCH_ATOM resolves, with zero Σ widening.
P51 makes the engine visible. Sprint J's wow-factor metric (locked plan §D9)
is "user picks a personality on first run, feels the product change voice in
real time, and toggles personalities mid-chat producing visibly distinct,
screenshotable replies." None of that lands unless P51 ships three coupled
surfaces: a Settings picker, a first-run onboarding step, and per-personality
chat-bubble styling. Σ stays inviolable across all three.

## Decision

### PersonalityPicker.tsx (Settings drawer surface)

`src/components/settings/PersonalityPicker.tsx` (≤220 LOC) renders a 5-card
2-col grid (`max-sm:grid-cols-1`). Each card pulls `PERSONALITY_PROFILES[id]`
for `label` + `description` + `emoji` and computes a deterministic live preview
via `renderPersonalityMessage(SAMPLE_ENVELOPE, id, SAMPLE_INTENT)` truncated to
≈120 chars. The engine is the single source of truth — the picker NEVER
duplicates per-mode strings. Selecting a card calls `setPersonality(id)` on
`intelligenceStore`, which writes through to `kv['personality_id']` per ADR-040.

A11y mirrors ADR-070 (P47 builder a11y patterns): `role="radiogroup"` on the
container; `role="radio"` + `aria-checked` per card; arrow-key grid nav (←/→
±1, ↑/↓ ±2 to traverse rows); roving `tabIndex`. Test ids: `personality-picker`
on the group + `personality-card-{id}` per card. Mounted as the FIRST section
in `SettingsDrawer.tsx` (above ReferenceManagement).

### Onboarding extension (first-run step BEFORE theme pick)

`src/pages/Onboarding.tsx` early-returns a dedicated personality step when
neither `kv['onboarding_personality_asked'] === '1'` nor a persisted
`getPersonalityId()` is set. The step reuses `PersonalityPicker` verbatim
(no duplicated UI) and offers two CTAs: "Continue" (records the asked flag,
advances to the existing themes/examples panel) and "Skip — keep it
professional" (calls `setPersonality('professional')` then advances). KV not
ready at mount (pre-init) is treated as "already asked" so onboarding never
blocks. Test id: `onboarding-personality-step`.

### Five chat-bubble styles (Tailwind variants only — no new components)

`src/components/shell/ChatInput.tsx` adds a pure `bubbleStyleClass(id)`
switch returning Tailwind class strings keyed off `msg.personalityId`,
plus `data-bubble-style="{id}"` on the bubble wrapper for test
addressability. The 5 variants:

- `professional` — clean default, no extra accent
- `fun` — `border-l-4 border-hb-accent` accent + emoji prefix
- `geek` — `font-mono text-hb-text-primary` + navy tone
- `teacher` — warm `bg-hb-accent/5` background tint
- `coach` — `font-semibold` + accent text emphasis

Tailwind-only discipline mirrors ADR-072 (P49 mobile precedent). No new
component files. No new dependencies.

### Active-personality chip in chat header

`ChatInput.tsx` renders a small chip beside the existing `chat-simulated-pill`
showing `PERSONALITY_PROFILES[active].emoji + label`. Test id:
`chat-active-personality-chip`. Pattern mirrors the brand-voice chip from P46.

## Trade-offs

- **Friction of asking on first run.** Mitigated by the explicit Skip CTA
  defaulting to `professional` (zero clicks past the step) and a one-time
  asked-flag so returning users never re-encounter it.
- **Live-preview means engine call per render.** The preview runs five
  pure-function `renderPersonalityMessage` calls per picker mount. Cost is
  negligible (no LLM, no IO); the renders are cached implicitly by React
  reconciliation; preview text is a deterministic function of profile data.
- **Tailwind-only bubble styling vs per-personality components.** Tailwind
  variants keep the diff under 30 LOC in ChatInput and avoid component
  proliferation. Cost: visual variety is bounded by Tailwind primitives — fine
  at this maturity, revisitable post-capstone.

## Consequences

- (+) Personality is visibly toggleable end-to-end: Settings picker → Onboarding
  first-run → per-bubble style → header chip.
- (+) Screenshot-worthy demo unlocked (Sprint J wow-factor gate; locked plan §D9).
- (+) No existing onboarding flow disrupted — the step is gated and additive;
  themes/examples panel renders unchanged after the step closes.
- (+) Σ stays inviolable. PATCH_ATOM contract preserved across
  ADR-045/053/057/060/064/067/068/073/074. Zero migration. Zero new fixtures.
- (+) Picker is a leaf component depending only on the engine + store + kv —
  no new bounded contexts added (ADR-054 honored).
- (-) Adds a one-time first-run prompt, accepting the small friction cost in
  exchange for the wow-factor payoff (locked plan §D9 owner sign-off).

## Cross-references

- **ADR-040** — kv repository (`onboarding_personality_asked` flag persistence
  seam; `personality_id` getter/setter shared with engine).
- **ADR-054** — DDD bounded contexts (picker is a pure UI leaf, no new context).
- **ADR-070** — P47 a11y patterns (`role="radiogroup"` + roving `tabIndex` +
  arrow-key grid nav re-applied verbatim here).
- **ADR-072** — P49 Tailwind-only mobile precedent (no new components / no new
  deps for the 5 bubble styles).
- **ADR-073** — P50 personality engine + composition (this ADR's upstream;
  picker + onboarding consume `PERSONALITY_PROFILES` + `renderPersonalityMessage`
  unchanged).

## Status as of P51 seal

- A4 PersonalityPicker + SettingsDrawer mount + active-personality chip: shipped.
- A5 Onboarding personality step + 5 styled bubble variants (`bubbleStyleClass` switch + `data-bubble-style`): shipped.
- A6 ADR-074 + `tests/p51-personality-ui.spec.ts` (~15 cases) + EOP artifacts: shipped.
- Composite Sprint J P51 score: TBD (filled at P51 seal commit).
