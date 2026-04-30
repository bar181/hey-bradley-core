# P63 / OC-2 — Onboarding Redesign (3-Card Mode Selector) Preflight

> **Phase:** P63 · **Sprint:** OC-2 (P1 launch-blocking)
> **Date opened:** 2026-04-30
> **Status:** OPEN — owner-supplied 3-card copy unblocks dispatch
> **Predecessor:** P62 / OC-1 sealed at `6a86d5c` (405/405 GREEN)
> **Strategic vision:** `plans/strategic-reviews/2026-04-30-three-mode-vision.md`
> **Pre-OC1 commitments source:** `plans/implementation/phase-61b/03-pre-oc1-decisions.md`

---

## Owner-supplied 3-card copy (verbatim)

```
What are you building today?

🎨 Whiteboard       📋 Planning         🤖 Agentics
Visualize           Design the          Coordinate
your idea           process             your swarm

Founders            PMs + Teams         Engineers
Designers           Product Leads       Architects
```

Plus: "Continue where you left off →" link if a project exists.

---

## Scope (this sprint)

The owner re-affirmed the strategic vision at OC-1 seal and provided
the 3-card copy. This unblocks the three pre-OC1 architectural
commitments queued in `phase-61b/03-pre-oc1-decisions.md`. Dispatching
all three in a single agent wave:

1. **ADR-088** — Mode Architecture (planning ADR, ≤120 LOC)
2. **ADR-089** — Agentics Data Model (planning ADR, ≤120 LOC)
3. **ModeSelectorCard** — React component scaffold (~150 LOC)
4. **uiStore.ts patch** — add `appMode` discriminator + setter
5. **Test spec** — `tests/p63-oc2-mode-selector.spec.ts` (PURE-UNIT, 6+ cases)

**NOT in this sprint:**
- Integration into existing `Onboarding.tsx` flow (waits for owner UX review of the rendered component)
- Email-capture / waitlist for "Coming soon" cards (Tier-2 commercial)
- Live routing to Planning or Agentics modes (those modes don't exist until AW-5 / AW-10)
- Personality picker changes (Sprint J P50 logic preserved)

---

## Hard rules

1. **NO copy changes** to existing onboarding text. The 3 cards are NEW
   surface; existing personality step stays intact.
2. **NO route definition** for `/planning` or `/agentics` paths. Cards
   for those modes show "Coming soon" + waitlist signup *placeholder*.
3. **NO live waitlist signup** — render a disabled button with "Email
   capture coming soon" tooltip. Tier-2 commercial owns the real waitlist.
4. **NO route changes** in `App.tsx` or router config. The component
   renders inline; integration into `Onboarding.tsx` waits.
5. **NO uiStore field renames** — only adds `appMode: 'whiteboard' | 'planning' | 'agentics' | null`.
6. **NO migration** to SQLite. `appMode` persists via existing kv pattern (`kv['ui_app_mode']`).
7. **NO shell commands inside agent.**

---

## Acceptance gates

- ADR-088 + ADR-089 Accepted on disk; cross-refs ADR-085 / ADR-086 / ADR-073 / ADR-053
- ModeSelectorCard component renders 3 cards with correct copy, icons, audience labels
- Whiteboard card → calls `setAppMode('whiteboard')` + closes selector
- Planning + Agentics cards → render "Coming soon" + disabled waitlist placeholder
- "Continue where you left off" link visible IFF project exists (props-driven)
- uiStore exposes `appMode` + `setAppMode` + persists to `kv['ui_app_mode']`
- Test spec: 6+ PURE-UNIT cases passing
- `npx tsc --noEmit` clean

---

## Successor

OC-3 Templates Round 1 — no owner blocker. Dispatchable immediately
after OC-2 seals. Adds 3-5 new templates at the design ceiling (per
OC-1 retrospective: visual-polish multiplier is new ceiling-quality
templates, not re-polishing the floor).
