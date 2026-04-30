# Three-Mode Vision (Active Strategic Reference) — 2026-04-30

> **Canonical source:** `plans/implementation/phase-61b/01-strategic-vision-2026-04-30.md`
> **Purpose:** Active strategic reference driving the next ~5 OC sprints
> (OC-2 onboarding through OC-7 section-type closure). Every sprint
> preflight in this window must cross-reference this doc.
> **Owner-supplied:** 2026-04-30, re-affirmed at OC-1 seal (`6a86d5c`).

---

## TL;DR

Hey Bradley is **three products in one**, accidentally collapsed into a
single UI today. The 18-sprint OC arc (post-defense launch plan) and the
10-sprint AW arc (post-MVP Agentic Workbench) build the platform around
this three-mode architecture.

| Mode | Tagline | Audience | Output | Status |
|---|---|---|---|---|
| **Whiteboard** (current v1) | "I have an idea — help me visualize it" | Marcus (founder), Grandma (novice) | Live preview + spec bundle | shipping at OC-18 |
| **Planning** (partial scaffolds) | "I have a product — help me design it" | PMs, founding teams, product leads | Implementation plan + AISP specs | partial in `plans/`; AW-1..5 productizes |
| **Agentics** (new) | "I have a system — help me coordinate agents to build it" | Lars (senior agentic engineer) | Swarm instructions + CLAUDE.md + ADR bundle | AW-6..10 |

---

## Onboarding — the 3-card stub (OC-2 deliverable)

```
What are you building today?

🎨 Whiteboard       📋 Planning         🤖 Agentics
Visualize           Design the          Coordinate
your idea           process             your swarm

Founders            PMs + Teams         Engineers
Designers           Product Leads       Architects
```

One decision, three outcomes. No 10-option grid.

- Whiteboard card → live (today's app)
- Planning card → "Coming soon" + waitlist
- Agentics card → "Coming soon" + waitlist
- "Continue where you left off →" if a project exists

This stub plants the architecture before users arrive. Real Planning
mode lights up at AW-5; real Agentics mode at AW-10. Public RC v2 ships
all three.

---

## UX principles per mode (carry into OC-2..6)

**Whiteboard (current — needs polish via OC-1..11):**
Left chat/listen toggle · center preview · right spec auto-open · bottom
personality · mobile chat-or-listen + preview tab.

**Planning (lit up post-AW-5):**
Left phases list · center process map · right phase spec + ADRs · chat
"Add a phase for auth" → generates phase.

**Agentics (lit up post-AW-10):**
Left phase/sprint/wave tree · center agent-coordination view · right
AISP spec for selected agent · chat "Decompose this sprint into 3
agents". Aesthetic: Linear meets a terminal meets a spec editor.

---

## The competitive picture

> Whiteboard mode competes with Lovable and Framer.
> Planning mode has no competition.
> Agentics mode has no competition.
> The commercial-tier collective-intelligence layer cannot be replicated.

The three-mode architecture turns Hey Bradley from a website builder
into a **platform**.

---

## Sprint impact (which sprints carry which thread)

| Sprint | Mode threading |
|---|---|
| OC-2 Onboarding Redesign | **Primary**: lands the 3-card stub (Whiteboard live, others "Coming soon"). Pre-allocates Planning/Agentics surfaces. |
| OC-3 Templates Round 1 | Whiteboard mode templates only (Planning/Agentics templates are AW work). |
| OC-4 Templates Round 2 (search) | Search filter must accommodate future mode-tagged templates. |
| OC-5 Mobile UX (BLOCKED on UX spec) | Mobile pattern must support all 3 modes (single-mode + mode switcher). |
| OC-6 Listen 50-prompt | Whiteboard listen surface; Planning + Agentics listen patterns are AW work. |
| OC-7 Section-Type Closure | Add menu / case-study / contact-form — Whiteboard scope; Planning/Agentics get phase / sprint / wave / agent section types in AW. |

---

## Pre-OC1 architectural commitments (decision pending owner go in `phase-61b/03-pre-oc1-decisions.md`)

1. **ADR-088** — Mode Architecture (3 modes as first-class citizens)
2. **ADR-089** — Agentics Data Model (extend SQLite schema, migration 005)
3. **ModeSelectorCard scaffold** — for OC-2 onboarding sprint

These three lock in the design space for AW work without waiting for
OC-18. They are PLANNING decisions; build work on AW waits for OC-18 seal.
