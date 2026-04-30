# P61b — Post-MVP Agentic Workbench Planning (Preflight)

> **Phase:** P61b — Post-MVP Agentic Workbench Planning (planning-only)
> **Date opened:** 2026-04-30
> **Status:** OPEN — preflight written; execution gates below
> **Parallel to:** P61 (Launch Planning, OPEN at `64e305c`)
> **Predecessor:** P60.5 (`dabc638`) + P61 launch plan (`b1a9652`)
> **Successor:** AW-1..AW-10 execution AFTER OC-1..OC-18 public RC seal

---

## Why this phase exists NOW

Owner-supplied strategic vision (2026-04-30) reframes Hey Bradley as a
**three-mode platform**, not a website builder:

- **Whiteboard mode** (current v1) — visualize an idea (the open-core RC
  shipping at OC-18)
- **Planning mode** (partially built in `plans/` tree) — design phase /
  sprint / wave decomposition
- **Agentics mode** (new) — encode the 14-step agentic engineering
  methodology as a product surface

The architecture decisions for modes 2 and 3 must be **made now**, before
OC-1 ships, so the existing code doesn't accidentally block them. Build
work waits until after public RC (OC-18); planning work happens here.

---

## Three-mode architecture (summary; full vision in `01-strategic-vision-2026-04-30.md`)

| Mode | Audience | Output | Status |
|---|---|---|---|
| Whiteboard | Marcus (founder), Grandma (novice) | Live preview + spec bundle | shipping at OC-18 |
| Planning | PMs, founding teams, product leads | Implementation plan + AISP specs | partially exists in `plans/` tree, not yet user-facing |
| Agentics | Lars (senior agentic engineer), architects | Swarm instructions + CLAUDE.md + ADR bundle | new — AW track |

---

## ADR numbering — collision resolved

Owner's pasted vision references **ADR-085 (Mode architecture)** and
**ADR-086 (Agentics data model)**. **Both numbers are already taken** by
P61 commits at `b1a9652`:

- ADR-085 = Multi-Page MVP (P61, OC-11)
- ADR-086 = Process Pages Content/Runtime Split (P61, OC-14/OC-15)
- ADR-087 = RESERVED for OC-5 Mobile UX redesign (pending owner UX-spec)

**Renumbered for the agentic-workbench track:**

- ADR-088 — Mode Architecture (Whiteboard / Planning / Agentics as three first-class modes)
- ADR-089 — Agentics Data Model (extend existing SQLite schema; no replacement)
- ADR-090 — Export Format (CLAUDE.md, swarm instructions, ADR bundle, AISP specs zip)

All three drafted **only after** the owner gives go (see `03-pre-oc1-decisions.md`).

---

## Deliverables (this preflight)

| File | LOC actual | Purpose |
|---|---:|---|
| `preflight/00-summary.md` (this file) | ~95 | Phase scope + ADR collision resolution + sequencing |
| `01-strategic-vision-2026-04-30.md` | ~230 | Owner-supplied brutal-honest assessment + how-it-fits picture, saved verbatim |
| `02-aw-sprint-roadmap.md` | ~140 | 10 AW sprints outlined; sequencing dependency on OC-1..18 |
| `03-pre-oc1-decisions.md` | ~85 | The "three things to do NOW" pending owner go: ADR-088, ADR-089, 3-card onboarding stub |

**Total in phase-61b/: ~550 LOC.**

---

## Sequencing (dependency on P61 launch plan)

```
NOW (this session)              P61b planning + ADR drafts (THIS PHASE)
                                  ↓
2 weeks post-defense             OC-1 .. OC-11 + OC-CLEANUP execution
                                  ↓
End of week 3 post-defense       OC-12 .. OC-18 + Public RC v1.0.0
                                  ↓
Weeks 4-7 post-defense           AW-1 .. AW-10 execution (Planning + Agentics modes)
                                  ↓
Week 8 post-defense              Open Core RC v2 (all three modes live)
                                  ↓
Commercial Tier-2                Collective intelligence + team workspaces + hosted
```

**Hard rule:** AW work does NOT start until OC-18 seals. P61b is
planning-only; build work waits.

---

## Execution gates (when to dispatch AW sprints)

1. ADR-088 + ADR-089 + ADR-090 Accepted (after owner go)
2. 3-card onboarding stub component scaffolded in OC-2 (pre-allocates the
   mode-selector real estate; Planning + Agentics show "Coming soon" until
   AW-1 lands)
3. OC-1..OC-18 sealed; public RC `v1.0.0` tagged
4. Then AW-1 preflight at `plans/implementation/phase-N/`

---

## Out of scope for THIS phase

- Writing AW-N preflights (those happen at AW-N execution start)
- Touching code (planning-only)
- Drafting ADR-088/089/090 without owner go
- Three-card onboarding stub component (waits for OC-2 dispatch with
  pre-allocated mode-selector slot)
