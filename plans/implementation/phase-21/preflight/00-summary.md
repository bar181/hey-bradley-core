# Phase 21 — Preflight 00 Summary

> **Phase title:** Sprint B Phase 1 — Simple Chat (natural language input + first real templates)
> **Status:** PREFLIGHT (activates post-P20-seal)
> **Owner directive (Option A, sequential numbering, no gaps):** Phase 21 IS Sprint B Phase 1. Earlier "MVP planning" content is demoted to Phase α (pre-P21 housekeeping) below.
> **Prerequisite:** P20 sealed (composite ≥88, master checklist 100% green for P15-P20) AND Phase α housekeeping complete.
> **Successor:** P22 (Sprint B Phase 2 — section targeting) → P23 (Sprint B Phase 3 — intent translation).

> **Velocity reality check (from owner):** *"P15 through P19 + P18b — 6 phases sealed in under one day. Time estimates in this conversation have been consistently 10-50x too conservative."* Adjust effort projections accordingly throughout.

---

## Phase 21 deliverables (the actual coding phase)

Phase 21 is the **first coding phase of Sprint B (Simple Chat)**. It is NOT the planning phase.

- Natural-language chat input handling **2-3 hardcoded templates** ("make it brighter", "hide the hero", "warmer colors")
- Template registry seeded with 2-3 real entries (not just regex fixtures)
- Section-targeting groundwork (`/hero-1` keyword path matching)
- Test count target: **+5 cases** (P21 baseline at velocity)
- 1 ADR for template registry (proposed ADR-050; ADR-049 reserved for cost-cap from P20)

---

## ⭐ TOP PRIORITY — External-Observation Sprint Plan (FOR REVIEW)

The following draft is the **authoritative post-P18 sprint plan** provided by the owner. Phase 21's first review action is to validate, refine, and lock this plan into the canonical roadmap docs.

### Reality-check first

**P15 through P19 + P18b — 6 phases sealed in under one day.** Estimates have been 10-50× too conservative. All Sprint A-K timing should assume this velocity, not the original 4-6-day-per-phase budgets.

### What Shipped Today

| Phase | Score | Delivered |
|---|---|---|
| P15 | 82 | DRAFT/EXPERT modes, UX polish |
| P16 | 86 | Local SQLite persistence |
| P17 | 88 | LLM provider abstraction + BYOK |
| P18 | 89 | Real chat pipeline (AISP Crystal Atom) |
| P18b | 90 | 5-provider matrix + LLM logging |
| P19 | 88 | Listen mode (Web Speech API) |

**P20 in flight — MVP close.**

### Sprint Plan — Post P18 (Original + Actual)

#### Sprint A — Chat Foundation
| Phase | Milestone | Status |
|---|---|---|
| P18 | LLM → JSON patch → live preview | ✅ Sealed |
| P18b | 5-provider matrix + logging | ✅ Sealed |
| P19 | Listen mode — voice → pipeline | ✅ Sealed |
| P20 | MVP close — cost-cap, SECURITY.md, Vercel, personas | 🔄 In Flight |

#### Sprint B — Simple Chat
| Phase | Milestone | Status |
|---|---|---|
| P21 | Natural language input + 2-3 real templates | ⏳ Next |
| P22 | Section targeting (`/hero-1` scoping) | ⏳ |
| P23 | Intent translation — messy input → structured to-do | ⏳ |

#### Sprint C — AISP Chat
| Phase | Milestone | Status |
|---|---|---|
| P24 | AISP instruction layer — shows human translation steps | ⏳ |
| P25 | Intent pipeline — AISP determines intent, reformats prompt | ⏳ |
| P26 | 2-step template selection — theme pick → modify | ⏳ |

#### Sprint D — Templates + Content
| Phase | Milestone | Status |
|---|---|---|
| P27 | Template library — browse + apply | ⏳ |
| P28 | Template creation from conversation | ⏳ |
| P29 | Content generation POC — LLM writes hero copy | ⏳ |
| P30 | Content pipeline — all section types | ⏳ |
| P31 | Content + template bridge | ⏳ |

#### Sprint E — Clarification & Assumptions
| Phase | Milestone | Status |
|---|---|---|
| P32 | Assumptions engine — ambiguity detection + confidence score | ⏳ |
| P33 | Clarification UX — 3 button options + free-text option 4 | ⏳ |
| P34 | Options picker — visual theme selector mid-chat | ⏳ |
| P35 | Assumption persistence — saved to project context | ⏳ |

#### Sprint F — Listen Mode Enhancement
| Phase | Milestone | Status |
|---|---|---|
| P36 | Listen + intent pipeline (P25 reuse) | ⏳ |
| P37 | Listen review mode — transcript + actions side by side | ⏳ |
| P38 | Listen + chat bridge — voice and text unified | ⏳ |
| P39 | Listen polish + error states | ⏳ |

#### Sprint G — Interview Mode
| Phase | Milestone | Status |
|---|---|---|
| P40 | Interview POC — LLM asks questions via text | ⏳ |
| P41 | Interview voice — TTS + mic full loop | ⏳ |
| P42 | Interview → project JSON auto-populated | ⏳ |
| P43 | Interview + assumptions bridge | ⏳ |

#### Sprint H — Post-MVP Upload + References
| Phase | Milestone | Status |
|---|---|---|
| P44 | Style guide + brand voice upload | ⏳ |
| P45 | Reference codebase ingestion | ⏳ |
| P46 | Google site builder bridge | ⏳ |

#### Sprint I — Builder Enhancement
| Phase | Milestone | Status |
|---|---|---|
| P47 | UX improvements based on user feedback | ⏳ |
| P48 | Best practices from existing builders | ⏳ |
| P49 | Areas-for-improvement surfaced post-MVP | ⏳ |

#### Sprint J — Agentic Support System
| Phase | Milestone | Status |
|---|---|---|
| P50 | Existing codebase analysis tool | ⏳ |
| P51 | Hard architecture problem solver | ⏳ |
| P52 | Multi-level agentic engineer support | ⏳ |

#### Sprint K — Release
| Phase | Milestone | Status |
|---|---|---|
| P53 | Performance + error handling | ⏳ |
| P54 | Final persona scoring | ⏳ |
| P55 | Open-source RC — public repo, license, contributing guide | ⏳ |

**At today's velocity (6 phases per day), Sprints A–C are realistically completable before defense. Sprint D begins post-defense.**

---

## Reconciliation note: Sprint F deviation

Earlier P20 preflight v2 (`phase-20/01-strategic-alignment.md` §2.2) proposed re-sequencing Sprints B-K each -5 phases earlier because Listen mode was pulled from Sprint F (P36-P39) into P19. The owner's authoritative draft above does NOT shift Sprints B-K. Instead it:

- **Keeps original phase numbering** for Sprints B through K
- **Re-purposes Sprint F (P36-P39) as "Listen Mode Enhancement"** — improvements on top of what P19 already shipped
- Sprint G (Interview Mode) stays at P40-P43

**Action item Phase-21 §1:** update `phase-20/01-strategic-alignment.md` §2.2 to match this — Sprint F retitled, no -5 shift.

---

## Pre-execution checklist (housekeeping before P21 starts coding)

> **Phase α / pre-flight housekeeping** — these tasks happen BEFORE P21 codes anything but are NOT a separate numbered phase. Run in the same session as P20 seal. Phase 21 IS the Simple Chat coding phase (see "Phase 21 deliverables" above).

## Phase α (housekeeping, pre-P21) — Top-priority deliverables

### 1. Lock the sprint plan
- [ ] Update `plans/implementation/phase-18/roadmap-sprints-a-to-h.md` to match the authoritative draft above (Sprint F retitled to "Listen Mode Enhancement"; statuses updated)
- [ ] Update `plans/implementation/phase-18/strategic-vision.md` Full Sprint Roadmap table likewise
- [ ] Update `plans/master-backlog.md` Stage-3 LLM-MVP rows against new sprint sequencing
- [ ] Update `plans/implementation/phase-20/01-strategic-alignment.md` §2.2 (correct the re-sequencing claim)

### 2. Re-affirm capstone gates
- [ ] Sprints A-C realistically completable before May 2026 defense
- [ ] Capstone-presentation surface = sealed P15-P20 + Sprint B + Sprint C if velocity holds
- [ ] Sprint D begins post-defense (NOT a capstone gate)

### 3. Per-sprint preflight scaffolding
- [ ] Create `plans/implementation/phase-21/preflight/01-sprint-b.md` — natural-language inputs, 2-3 templates, section targeting (P21-P23)
- [ ] Create `plans/implementation/phase-21/preflight/02-sprint-c.md` — AISP instruction layer, intent pipeline (P24-P26)
- [ ] Stub `plans/implementation/phase-21/sprint-d-onwards.md` — backlog reference for post-defense work

### 4. Reality-check estimates
- [ ] Audit `06-phase-20-mvp-close.md` "5-7 days" estimate (reality says <1 day at P19 velocity)
- [ ] Audit `phase-20/preflight/01-scope-lock.md` Day 1-7 schedule (collapse where possible)
- [ ] Document new estimation rule in `CLAUDE.md`: "Phase effort estimates target multi-hour shifts, not multi-day shifts"

### 5. Open questions for Phase 21 review
- [ ] Should Sprint B (P21-P23) start IMMEDIATELY post-P20-seal in same session, or pause for owner sign-off?
- [ ] At 6-phases-per-day velocity, is the original phase-18-plan's "Test discipline" target (`+5 cases/phase`) still right, or should we tighten?
- [ ] Sprint F (Listen Enhancement) — keep at P36-P39 even though base is shipped? Or compress to a single phase?

---

## Phase 21 — Activation gates

Phase 21 activates AFTER:
- P20 sealed (composite ≥88; master checklist 100% green for P15-P20)
- Vercel deploy live; URL recorded
- Persona reviews complete (Grandma 70 / Framer 80 / Capstone 88)
- 26+2 P20 DoD items all ticked

Phase 21 outputs:
- Locked authoritative `roadmap-sprints-a-to-h.md` (Sprint F retitled; statuses current)
- Locked `strategic-vision.md` (all 12 open Qs resolved; sprint table reflects reality)
- Sprint B + Sprint C preflight docs ready for execution
- Reality-checked velocity estimate written into CLAUDE.md
- Single-sentence go/no-go decision: start Sprint B in same session OR pause

---

## Cross-references

- `plans/implementation/phase-18/roadmap-sprints-a-to-h.md` (canonical sprint definition; needs update per §1)
- `plans/implementation/phase-18/strategic-vision.md` (commercial positioning; needs update per §1)
- `plans/implementation/phase-20/01-strategic-alignment.md` (P19 deviation analysis; needs §2.2 correction)
- `plans/implementation/phase-20/preflight/00-summary.md` (P20 readiness; activation gate for this phase)
- `plans/master-backlog.md` (4-stage backlog; cross-check Stage 3 against new sprint plan)

---

## Reading guide for phase-21/

| File | Purpose |
|---|---|
| `preflight/00-summary.md` (this file) | Top-priority owner draft + reconciliation tasks |
| `checklist.md` (NEW) | Tickable phase-21 deliverables across §1-§5 above |
| `MEMORY.md` (NEW) | Cross-session anchor with sprint-plan state |

---

**Author:** scaffolded post-P20-preflight per owner directive.
**Last updated:** 2026-04-27 (P20 preflight v2 commit `a86b235`).
**Next file:** `checklist.md`
