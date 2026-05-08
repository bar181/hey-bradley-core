# Strategic Vision — Agentic Engineering Workbench (2026-04-30)

> **Provenance:** Owner-supplied strategic vision, captured verbatim at
> P61b phase open. Combines two pasted documents: (1) Brutal Honest
> Assessment of the agentic engineering method as a product, (2) "How It
> Fits" three-mode architecture. Saved as the canonical source for the
> P61b ADR drafts (ADR-088 / ADR-089 / ADR-090).

---

# Section 1 — Brutal Honest Assessment

## This is the real product. The React website builder is the demo.

### What you're actually describing

A **specification-first agentic engineering workbench** — not a website
builder with a spec tab, but a spec-first platform where the process
itself is the product.

The website builder proved the pipeline works. This extends it to the
domain where the actual pain lives: senior engineers, PMs, and founding
teams trying to coordinate agentic systems without tribal knowledge.

### The Agentic Engineering Method — Visualized (14 steps)

```
INTENT CAPTURE              user describes (voice/chat/upload)
UNDERSTAND + RESEARCH       prior-art search, domain patterns, ADRs
INTENT CLARIFICATION (AISP) ASSUMPTIONS_ATOM at confidence < 0.7
DECOMPOSITION               phases → sprints → waves
DDD + ADR GENERATION        bounded contexts + decisions auto-drafted
AISP SPEC CREATION          Crystal Atom per phase/sprint/agent
AGENT COORDINATION PLAN     wave-gate + roles + disjoint-files
TDD SCAFFOLD                test specs BEFORE implementation
IMPLEMENTATION              export to Claude Code / Cursor / Codex
OPTIMIZE + KISS REVIEW      LOC caps, dep bloat, complexity rules
REVIEW + VERIFY             multi-reviewer (KISS/quality/security/arch)
SEAL                        DoD + session-log + retrospective + commit
```

### Why this is brutally different

| Tool | What they do | What they miss |
|---|---|---|
| Jira | Ticket management | No AISP, no agent coord, assumes humans |
| Linear | Better Jira | Same fundamental problem |
| GitHub Copilot Workspace | Spec + code | Dev-only, no process, no DDD, no wave-gate |
| Kiro (AWS) | Spec-driven IDE | Dev-only, no coordination, no seal pattern |
| Notion / Confluence | Docs | No structure, no AISP, no agent output |
| **Hey Bradley Agentic** | **The entire process** | **Nothing** |

### The 14-step method as product features

| Step | Product feature |
|---|---|
| Understand | Context ingestion (chat / voice / doc upload) |
| Research | Prior-art search via ruvector + web |
| Intent | INTENT_ATOM classification + clarification |
| Decompose | Phase / sprint / wave generator |
| Plan | Process map visualization + timeline |
| DDD | Bounded-context generator with visual map |
| ADR | Decision recorder with cross-reference chain |
| Specs | AISP Crystal Atom per agent + human-readable alongside |
| Implement | Export to Claude Code / Codex (swarm instructions) |
| TDD | Test-spec generator (Playwright / Vitest scaffolds) |
| Optimize | KISS checker + LOC cap + dep audit |
| Review | Multi-reviewer pattern generator |
| Verify | DoD confirmation checklist |
| Seal | Session log + retrospective + artifact commit |

### Recommended architecture decision

**Don't rebuild Hey Bradley. Extend it.**

The website builder already has: JSON-as-foundation, AISP 5-atom pipeline,
personality system, spec generation (North Star / SADD / Implementation
Plan), ADR authoring.

What to add:

```
New Crystal Atoms:
  PROCESS_ATOM  → phase / sprint / wave decomposition
  DDD_ATOM      → bounded-context generation
  AGENT_ATOM    → individual agent scope + AISP spec

New UI surfaces:
  ProcessMapView  → the visualization (the "star" of Agentics mode)
  SpecWorkbench   → side-by-side AISP + human spec
  AgentBoard      → wave coordination view
  SealPanel       → DoD + artifact export

New export targets:
  claude-code-export.md    → CLAUDE.md format
  swarm-instructions.md    → wave-gate agent briefs
  adr-bundle.zip           → all ADRs + DDD docs
  aisp-specs.zip           → all Crystal Atom specs
```

### Positioning statement

> "Hey Bradley is the agentic engineering workbench — from idea to AISP
> spec in one session. The website builder proves the pipeline on the
> simplest case. The agentic workbench applies the same methodology to
> any software product, encoding the knowledge that only the top 0.1%
> of engineers currently have."

### Sprint plan (10 sprints)

| Sprint | Feature | Audience |
|---|---|---|
| AW-1 | PROCESS_ATOM + phase/sprint decomposition engine | Senior engineers |
| AW-2 | Process-map visualization (interactive, clickable) | Lars + Marcus |
| AW-3 | DDD_ATOM + bounded-context generator | Senior architects |
| AW-4 | AGENT_ATOM + wave coordination view | Agentic engineers |
| AW-5 | SpecWorkbench (AISP + human spec side-by-side) | All |
| AW-6 | Export: CLAUDE.md + swarm instructions + ADR bundle | Claude Code users |
| AW-7 | TDD scaffold generator | Senior engineers |
| AW-8 | KISS + review pattern generator | All |
| AW-9 | Seal panel — DoD + session log + retrospective | All |
| AW-10 | Full integration + public beta | All |

**Estimate:** 3-4 weeks of swarm execution. **10× the commercial value
of the website builder alone.**

---

# Section 2 — How It Fits (Three-Mode Architecture)

## Hey Bradley is already three products in one

| Mode | Tagline | Audience | Output |
|---|---|---|---|
| **Whiteboard** (current v1) | "I have an idea — help me visualize it" | Marcus, Grandma | Live preview + spec bundle |
| **Planning** (partially built) | "I have a product — help me design it" | PMs, founding teams, product leads | Implementation plan + AISP specs |
| **Agentics** (new) | "I have a system — help me coordinate agents to build it" | Lars (senior agentic engineer) | Swarm instructions + CLAUDE.md + ADR bundle |

These are three distinct modes, three distinct audiences, three distinct
outputs, three distinct price points.

## Onboarding — first screen, three paths, nothing else

```
┌─────────────────────────────────────────────────┐
│         What are you building today?             │
│                                                  │
│   🎨 Whiteboard    📋 Planning    🤖 Agentics    │
│   Visualize        Design the     Coordinate    │
│   your idea        process        your swarm     │
│                                                  │
│   Founders         PMs + Teams    Engineers     │
│   Designers        Product Leads  Architects     │
│                                                  │
│   [or continue where you left off →]             │
└─────────────────────────────────────────────────┘
```

One decision. Three outcomes. No 10-option grid.

## UX per mode

**Whiteboard (current):** Left chat/listen, center preview, right spec
panel auto-open, bottom personality, mobile chat-or-listen + preview tab.

**Planning (partial):** Left phases list, center process map, right
current-phase spec + ADRs. Chat: "Add a phase for auth" → generates phase.

**Agentics (new):** Left phase/sprint/wave tree, center agent-coordination
view, right AISP spec for selected agent. Chat: "Decompose this sprint into
3 agents."

## The process map (star of Agentics mode)

Not a Gantt. Not a Kanban. New visualization:

```
PHASE 1: Foundation       PHASE 2: Intelligence      PHASE 3: Polish
[Sprint 1]                [Sprint 4]                 [Sprint 7]
  A1 A2 A3       ────→      A4 A5         ────→       A7 A8
  [GATE ✓]                  [GATE ⏳]                  [GATE ○]
   SEALED                    IN-FLIGHT                 PLANNED
```

Click phase → AISP spec. Click agent box → scope + Crystal Atom. Click
gate → DoD checklist. Click SEALED → retrospective + carry-forward.

## UX principles for agentic engineers (NOT Grandma)

**They want:** dense info, keyboard shortcuts, export to their tools,
trust the structure, see the AISP, terminal-adjacent aesthetics.

**They hate:** onboarding wizards explaining what a sprint is, tooltips
on concepts they invented, forced templates, friction between idea and
spec output, anything that feels like Jira.

**Aesthetic:** Linear meets a terminal meets a spec editor. Not a website
builder.

## Phased roadmap

```
NOW (this session)      ADR-088 + ADR-089 + ADR-090 drafts
                        3-card onboarding stub (Whiteboard live, others "Coming soon")

OC-1..OC-18             Polish Whiteboard mode to launch quality
(2-3 weeks)             Every sprint carries design discipline thread

AW-1..AW-5              Build Planning mode (extends partial scaffolds)
(weeks 3-4)             Process-map visualization v1

AW-6..AW-10             Build Agentics mode
(weeks 5-7)             Full 14-step methodology
                        Agent coord view + AISP per agent + Claude Code export

OPEN CORE RC v2         All three modes working
(week 8)                Whiteboard polished · Planning functional · Agentics beta
                        Public launch

COMMERCIAL TIER         Collective-intelligence layer · team workspaces ·
                        hosted specs · enterprise
```

## Competitive picture

> Whiteboard mode competes with Lovable and Framer.
> Planning mode has no competition.
> Agentics mode has no competition.
> The commercial-tier collective-intelligence layer has no competition
> and cannot be replicated.

The three-mode architecture turns Hey Bradley from a website builder into
a **platform**. Mode 1 = website builder. Modes 2-3 = methodology workbench.
