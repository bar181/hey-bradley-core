# ADR-088 — Mode Architecture (Whiteboard / Planning / Agentics)

**Status:** Accepted
**Date:** 2026-04-30
**Phase:** P63 / OC-2 (planning ADR; modes go live at OC-* / AW-5 / AW-10)
**Supersedes:** none
**Cross-refs:** ADR-085, ADR-086, ADR-073, ADR-053

## Context

Hey Bradley today exposes a single UI surface (the Builder + Chat + Listen
trio) that has accidentally collapsed three distinct user intents into one:

1. **Whiteboard** — visualize an idea (live today; founders + designers)
2. **Planning** — design the *process* a team will run (PMs + product leads)
3. **Agentics** — coordinate a swarm of agents through phases/sprints
   (engineers + architects)

The strategic vision (`plans/strategic-reviews/2026-04-30-three-mode-vision.md`)
calls each mode out explicitly. P63 / OC-2 plants the architecture before
any user sees a card; live Planning ships at AW-5 and live Agentics at AW-10.

## Decision

Treat Whiteboard / Planning / Agentics as three **first-class modes** that
share infrastructure but expose mode-specific UI:

1. **Mode discriminator** lives in `uiStore` as
   `appMode: 'whiteboard' | 'planning' | 'agentics' | null` (null = first run)
2. **Mode-specific lazy chunks** — each mode owns its own bundle entry; the
   Whiteboard chunk is the only one shipped today
3. **Shared persistence** — sql.js + IndexedDB serves all three modes; no
   schema fork (see ADR-089 for Agentics extensions)
4. **Shared AISP pipeline** — the 5-atom Crystal Atom contract (ADR-053
   onward) is mode-agnostic; PROCESS_ATOM / DDD_ATOM / AGENT_ATOM are
   *additions* (see ADR-089), not replacements
5. **3-card onboarding** routes the user to the chosen mode and persists
   the choice via `kv['ui_app_mode']`
6. **Backward-compat** — existing users (project in localStorage) land on
   Whiteboard automatically; the 3-card selector is bypassed

## Bounded-context impact (DDD)

No new bounded context. Changes contained within:

- `ui-shell` — adds `appMode` discriminator + `setAppMode` action +
  `ModeSelectorCard` component
- `configuration` — unchanged (same MasterConfig + pages model from ADR-085)
- `intelligence` — unchanged this sprint (AISP atoms remain the 5-atom set;
  Agentics atoms arrive at AW-1)
- `persistence` — unchanged this sprint (kv table absorbs the new key)

No new aggregate; no new repository.

## Out of scope

- Live Planning mode (ships at AW-5 sprint)
- Live Agentics mode (ships at AW-10 sprint)
- Route definitions for `/planning` and `/agentics` (deferred to AW-5 / AW-10)
- Email-capture / waitlist for "Coming soon" cards (Tier-2 commercial)
- Per-mode personality profiles (Sprint J P50 logic preserved as-is)
- Mode-aware command routing in chat / listen (Whiteboard is the only mode)

## Acceptance gates

- `ModeSelectorCard` renders 3 cards with the owner-supplied verbatim copy
- Whiteboard card is live; Planning + Agentics show "Coming soon"
- `uiStore.appMode` field exists, typed `AppMode | null`, defaults to `null`
- `setAppMode(mode)` action persists to `kv['ui_app_mode']`
- Hydration via `loadAppMode()` on store init reads the persisted value
- Existing onboarding flow (Onboarding.tsx) is untouched in this sprint
- `npx tsc --noEmit` clean

## Consequences

**Positive:**
- Platform framing planted before users arrive at OC-1 launch — the 3-mode
  identity is visible from first paint, not retrofitted
- ADR-088 + ADR-089 unblock AW-1..AW-10 build work with a stable target
  (mode discriminator + Agentics schema both committed)
- Whiteboard mode keeps a clean default; nothing in the existing surface
  has to change

**Negative:**
- Backward-compat surface — every persisted-project user must land on
  Whiteboard without seeing the selector; misroute = trust loss
- Two cards ship "disabled" — risk of looking like vaporware if the OC-2
  visual treatment is sloppy

**Mitigations:**
- ModeSelectorCard defaults `hasProject={true}` callers (existing flow)
  to skip the selector entirely; first-run users see the card
- "Coming soon" badge styling matches the existing Onboarding
  `FutureCapabilityCard` precedent (dashed border, reduced opacity) so the
  visual language is already familiar
- Component ships standalone in P63; integration into Onboarding.tsx
  waits for owner UX review (preflight Hard Rule #4)
