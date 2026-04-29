# Phase 51 — Preflight 00 Summary

> **Phase title:** Sprint J P2 — Picker UI + Onboarding step + Chat-bubble styling
> **Status:** PREFLIGHT
> **Successor of:** P50 (Personality Engine + Composition; sealed at composite TBD)
> **Locked plan:** `plans/implementation/sprint-j-personality/03-sprint-j-locked.md` §P51

## North Star

> **Make the engine visible.** Live toggle works. First-run user is asked. Five
> chat-bubble variants render distinctly. Active personality chip beside the
> simulated/mock pill. ZERO Σ widening (preserved from P50 / ADR-073).

## Scope IN — 3 parallel agents (per `03-sprint-j-locked.md` agent table)

### A4 — PersonalityPicker.tsx + Settings mount + active chip
- NEW `src/components/settings/PersonalityPicker.tsx` (≤220 LOC; arrow-key nav mirroring P48 QuickAddPicker; `role="radiogroup"` + `aria-checked`; live preview reply for "make it brighter")
- `src/components/settings/SettingsDrawer.tsx` (mount above ReferenceManagement; ≤10 LOC delta)
- `src/components/shell/ChatInput.tsx` (active-personality chip beside simulated/mock pill; ≤15 LOC delta)

### A5 — Onboarding step + 5 styled bubble variants
- `src/pages/Onboarding.tsx` (≤80 LOC delta — one new step BEFORE theme pick; reuse PersonalityPicker; default `professional`; skip available)
- `src/components/shell/ChatInput.tsx` (5 styled bubble variants — Tailwind variants only; font weight + emoji density + color accent per personality; ≤30 LOC delta)

### A6 — ADR-074 + ~15 tests
- NEW `docs/adr/ADR-074-personality-picker-and-onboarding.md` (≤120 LOC; cross-ref ADR-070 a11y + ADR-073)
- NEW `tests/p51-personality-ui.spec.ts` (~15 cases — picker exports + Settings mount + Onboarding step + 5 bubble variant Tailwind classes + active chip testid + a11y `radiogroup`/`aria-checked`)

## Scope OUT (P52 / Sprint J Wave 3)

- ConversationLogTab + Share Spec button (P52 / A7+A8+A9)
- Mobile UX bifurcation (P53 / A10+A11+A12)

## Carryforward INTO P51 (from P50)

- **ADR-073 "Status as of P50 seal" backfill** — A6 (or whichever agent commits the P50 seal) backfills the TBD markers with A1 + A2 final status + composite score.
- **A1 / A2 deliverables** — if either A1 (`personalityEngine.ts` + kv + store + system) or A2 (`chatPipeline` + `ChatInput`) timed out or shipped partial, P51 fix-pass closes the gap BEFORE A4/A5/A6 dispatch:
  - P50.4 (5-distinct-outputs) failing → A1 `renderPersonalityMessage` template variety needs a pass
  - P50.13 (system.ts injection) failing → A1 system-prompt block placement
  - P50.14 (chatPipeline `personalityMessage`) failing → A2 defensive try/catch + result population
  - P50.15 (ChatInput testid + data-personality-id) failing → A2 surface render
- **Cumulative regression must be GREEN before P51 dispatches.**

## DoD

- [ ] A4 PersonalityPicker mounted in SettingsDrawer + active chip beside ChatInput pill
- [ ] A5 Onboarding step renders BEFORE theme step + skip path = `professional`
- [ ] A5 5 distinct bubble variants visible in DOM (Tailwind class diff per personality)
- [ ] A6 ADR-074 ≤120 LOC, full Accepted, cross-refs ADR-070 + ADR-073
- [ ] A6 `tests/p51-personality-ui.spec.ts` ~15 cases GREEN
- [ ] tsc clean; full Sprint J cumulative regression GREEN
- [ ] STATE.md row + CLAUDE.md roadmap updated; P51 seal commit + P52 preflight scaffold

## Composite target: 93+ (Sprint J seal-gate per D9)

## Cross-references

- ADR-073 (P50; engine + composition; locked Option B)
- ADR-070 (P47; a11y patterns; PersonalityPicker reuses radiogroup discipline)
- ADR-072 (P49; Tailwind-only mobile precedent — relevant for A5 bubble variants)
- `03-sprint-j-locked.md` §P51 agent table

P51 activates on P50 seal greenlight + cumulative regression GREEN.
