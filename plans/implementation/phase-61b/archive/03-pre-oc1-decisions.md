# P61b — Pre-OC1 Decisions Pending Owner Go

> **Date:** 2026-04-30 · **Status:** AWAITING OWNER CONFIRMATION
> **Block on:** owner reads this file + types "go" before agent dispatch

---

## What the strategic vision asked for

End of `01-strategic-vision-2026-04-30.md` Section 2:

> "Want the swarm to draft ADR-085 + ADR-086 + the three-card onboarding
> stub right now?"

Answer: **the swarm is ready, but ADR-085 / ADR-086 are already taken.**
Renumbered to ADR-088 / ADR-089. Two ADR drafts + one component scaffold.

---

## The three pre-OC1 deliverables

### 1. ADR-088 — Mode Architecture (planning-only ADR; ~120 LOC max)

**Decision to capture:** Whiteboard / Planning / Agentics are three
first-class modes that share a common pipeline (5-atom AISP, persistence,
LLM matrix) but expose mode-specific UI surfaces.

**Drafted contents:**

- Mode discriminator in `uiStore` (`appMode: 'whiteboard' | 'planning' | 'agentics'`)
- Mode-specific routes / lazy-loaded chunks
- Shared persistence layer (sql.js) absorbs all three; no schema split
- Shared AISP pipeline; PROCESS_ATOM / DDD_ATOM / AGENT_ATOM are
  additions, not replacements
- 3-card onboarding routes to the chosen mode
- Backward compat: existing single-mode users land on Whiteboard by default

### 2. ADR-089 — Agentics Data Model (planning-only ADR; ~120 LOC max)

**Decision to capture:** how phases / sprints / waves / agents are
stored in the existing SQLite schema. **Extend, don't replace.**

**Drafted contents:**

- Migration 005 adds: `phases`, `sprints`, `waves`, `agents`, `gates`,
  `seals` tables (all FK-linked)
- `aisp_atoms` table extends to carry PROCESS / DDD / AGENT atom types
- `master_config.pages` (from ADR-085) coexists; phase decompositions
  are project-level, not page-level
- Export format anchors at the `phases` root → `swarm-instructions.md`
- Migration runner already auto-bumps `schema_version` (per existing
  P16 pattern)

### 3. Three-card onboarding stub component

**Decision to capture:** plant the 3-mode UI architecture in OC-2
(onboarding redesign sprint), even though Planning + Agentics modes
won't be live until AW-5 / AW-10.

**Drafted contents:**

- New component: `src/components/onboarding/ModeSelectorCard.tsx`
- Three cards: Whiteboard (live) · Planning (soon) · Agentics (soon)
- Soon-cards: muted styling, "Coming week N" badge, email-capture for
  waitlist (kvSet → 'mode-waitlist-planning' / 'mode-waitlist-agentics')
- Selected mode persists to `uiStore.appMode` + kv['ui_preferred_mode']
- Backward-compat: existing users skip the card (already have a project)

This is **scaffolded into OC-2**, not shipped at P61b. P61b only authors
the component spec for OC-2 to consume.

---

## Why these three, not more

Anything beyond these three risks pre-judging Agentics mode UX before the
owner has live OC-1..OC-18 in production. The three pre-OC1 deliverables
**preserve the design space**; further AW work waits for OC-18 seal.

In particular, NOT in scope here:
- ADR-090 Export Format (waits for AW-6 sprint context)
- PROCESS_ATOM / DDD_ATOM / AGENT_ATOM Crystal-Atom specs (drafted at
  AW-1 / AW-3 / AW-4 sprint open)
- Process-map visualization design (waits for AW-2)
- SpecWorkbench layout (waits for AW-5)
- Any code in `src/` (planning-only phase)

---

## Owner go-ahead protocol

Before agent dispatch, the owner reviews:

1. This file (`03-pre-oc1-decisions.md`)
2. `01-strategic-vision-2026-04-30.md` (the captured vision — verify
   nothing was distorted)
3. `02-aw-sprint-roadmap.md` §"Three-card onboarding stub" (the OC-2
   integration point)

Then types one of:

- **"Draft all three"** → swarm dispatches ADR-088, ADR-089, and the
  ModeSelectorCard scaffold spec
- **"Draft ADRs only"** → swarm dispatches ADR-088 + ADR-089; ModeSelectorCard
  scaffold waits for OC-2 preflight
- **"Draft mode architecture only"** → ADR-088 only; ADR-089 + scaffold
  defer to AW-1 preflight
- **"Wait — I want to revise the vision first"** → no dispatch; owner
  edits `01-strategic-vision-2026-04-30.md` and re-asks

---

## What happens after the go

| Owner says | Agent dispatches | Wall time |
|---|---|---|
| "Draft all three" | 1 agent · ADR-088 (~100 LOC), ADR-089 (~100 LOC), `docs/ux/oc2-mode-selector-spec.md` (~80 LOC) | ~30 min |
| "Draft ADRs only" | 1 agent · ADR-088 + ADR-089 | ~20 min |
| "Draft mode architecture only" | 1 agent · ADR-088 | ~10 min |

Pure-write agents, no shell commands, single-commit landing per ADR.
Same pattern as P60.5 quick win at `dabc638`.

---

## Standing by

Three files written + committed. Awaiting owner go.
