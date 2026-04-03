# Hey Bradley — Master Implementation Plan

**Project:** Hey Bradley
**Program:** Harvard ALM in Digital Media Design (Capstone)
**Author:** Bradley Ross
**Target Completion:** May 2026
**Status:** Phase 6 COMPLETE. Phase 7 (Final Demo Polish) next. Capstone demo May 2026.

---

## 1. PROJECT OVERVIEW

### Vision

> "A whiteboard that listens, builds what you describe in real-time, and secretly writes enterprise specs behind the scenes."

Hey Bradley is a JSON-driven marketing website specification platform. Users interact with a visual builder (or speak to it), and the system simultaneously produces two outputs:

1. **Live visual previews** of the marketing site being configured
2. **Enterprise-grade AISP specification documents** that can be pasted directly into Claude Code to produce a production site

### Pipeline

```
Ideation --> Hey Bradley --> Specs + JSON --> Claude Code --> Production Site
```

### Product-Market Fit Equation

All three components are required. Remove any one and the product loses its differentiation:

```
PMF = Builder Mode + Listen Mode + Spec Documents
```

- **Builder Mode** provides the hands-on visual configuration experience
- **Listen Mode** provides the voice-driven "whiteboard that listens" interaction
- **Spec Documents** bridge the gap between ideation and production code

### What Hey Bradley Is NOT

- NOT a Wix/Squarespace competitor (does not host or deploy sites)
- NOT a Figma competitor (does not provide freeform design tools)
- NOT a code editor (users never see or write code)
- NOT an e-commerce platform (focuses on marketing/landing pages)

---

## 2. CURRENT STATE ASSESSMENT

### Repository Contents

The repository contains 6 specification documents that define the complete product vision and technical architecture:

| # | Document | Location |
|---|----------|----------|
| 00 | AISP Reference | `/plans/intial-plans/00.aisp-reference.md` |
| 01 | North Star | `/plans/intial-plans/01.north-star.md` |
| 02 | Architecture | `/plans/intial-plans/02.architecture.md` |
| 03 | Implementation Plan | `/plans/intial-plans/03.implementation-plan.md` |
| 04 | Design Bible | `/plans/intial-plans/04.design-bible.md` |
| 05 | Swarm Protocol | `/plans/intial-plans/05.swarm-protocol.md` |
| 06 | DDD File Structure | `/plans/intial-plans/06.ddd-file-structure.md` |

### Supporting Materials

- **Screen captures of mockups** exist in `/plans/screen-caps/initial-lovable-ai-studio/` (12 mockup images covering build mode, listen mode, JSON view, docs view, workflow view, splash screens)
- **Expert feedback** received and stored in `/plans/feedback/initial/`
- **Phase-level plans** fully defined in `/plans/phases/` (6 phase documents + ADR, DDD, testing, and design subdirectories)
- **Implementation directory structure** scaffolded at `/plans/implementation/` with 7 level folders, rubrics, and testing directories

### What Exists Now

- **100+ source files** in `/src` (~20,000+ lines of TypeScript/React)
- **15 section types, 47+ variants** (62 template files)
- **10 themes, 10 palettes, 5 fonts**
- **4 example websites** (bakery, SaaS, photography, consulting)
- **Demo simulator** with timed section reveals
- **AISP Platinum spec generation** (HUMAN + AISP views)
- **26 Playwright tests** passing
- **Vercel CI/CD** deployed from main
- **Persona score: 78+/100**

---

## 3. TECH STACK

### Core Framework

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Build Tool | Vite | Fast dev server, HMR, optimized builds |
| UI Framework | React 18 | Component-based UI with concurrent features |
| Language | TypeScript | Type safety across the entire codebase |

### Styling & Components

| Library | Purpose |
|---------|---------|
| Tailwind CSS 3 | Utility-first styling, warm cream design system |
| shadcn/ui (Radix primitives) | Accessible, composable component library |

### State & Validation

| Library | Purpose |
|---------|---------|
| Zustand | Lightweight, predictable state management |
| Zod | Runtime schema validation for JSON configs |
| React Router v6 | Client-side routing |

### UI Utilities

| Library | Purpose |
|---------|---------|
| react-resizable-panels | Split-pane layout (editor/preview) |
| @dnd-kit | Drag-and-drop section reordering |
| Lucide React | Consistent iconography |

### Future Integrations (Level 4+)

| Technology | Purpose | Level |
|-----------|---------|-------|
| Supabase | Auth, database, file storage | Level 4 |
| Claude API | LLM-powered chat, copy, inference | Level 5 |
| Web Speech API | Voice input for Listen Mode | Level 6 |

---

## 4. ARCHITECTURE SUMMARY

### ADR-001: JSON as Single Source of Truth

Every piece of site configuration lives in a single JSON object. The preview renders from JSON. The spec documents generate from JSON. Editing the JSON updates both outputs simultaneously.

### Two-Mode UI System

The interface operates across two independent axes that combine into four composite states:

| | DRAFT | EXPERT |
|---|---|---|
| **BUILD** | Simple visual builder, minimal controls | Full tree + JSON editors, all panels |
| **LISTEN** | Voice input, minimal UI, auto-apply | Voice input with approval queue, full panels |

### Four Center Tabs

| Tab | Content |
|-----|---------|
| REALITY | Live visual preview of the configured site |
| DATA | Raw JSON editor with syntax highlighting |
| XAI DOCS | Generated specification documents (Human + AISP views) |
| WORKFLOW | Task queue, change history, agent status |

### Three-Layer Architecture

```
Input Layer (UI controls, voice, chat)
        |
        v
State Layer (Zustand store, JSON config, Zod validation)
        |
        v
Output Layer (Preview renderer, spec generators, export)
```

### DDD Bounded Contexts

| Context | Responsibility |
|---------|---------------|
| **Builder** | UI components, section management, drag-and-drop, preview rendering |
| **Intelligence** | LLM integration, voice processing, chat management, inference |
| **Specification** | Document generation, AISP formatting, export packaging |
| **Persistence** | Storage adapters (localStorage, Supabase), project management |

An **import firewall** enforces that bounded contexts communicate only through defined interfaces, never by importing internal modules directly.

---

## 5. IMPLEMENTATION ROADMAP

### 7 Levels, 21 Phases

#### Level 1: Core Builder (Phases 1.0-1.3)

The foundation. After Level 1, the product should look and feel like a real, polished application.

| Phase | Name | Goal | Agents |
|-------|------|------|--------|
| 0 | Scaffold & Tooling | Vite project, dependencies, folder structure, linting | 2 seq |
| 1.0 | Shell & Navigation | AppShell, sidebar, toolbar, warm cream design system | 7 parallel |
| 1.1 | Hero + JSON Core Loop | Hero section editing, live JSON sync, preview rendering | 8 parallel |
| 1.2 | All Tabs + Listen Mode | REALITY/DATA/XAI DOCS/WORKFLOW tabs, Listen mode UI | 10 parallel |
| 1.3 | Polish + Persistence | Animations, localStorage, error boundaries, accessibility | 7 parallel |

**Human Review Gates:**
- After Phase 1.0: "Does it look like a real product?"
- After Phase 1.2: **CAPSTONE DEMO CHECKPOINT** (must be visually stunning)
- After Phase 1.3: Level 1 complete, ready for Level 2?

#### Level 2: Full Site Builder (Phases 2.1-2.3)

| Phase | Name | Goal |
|-------|------|------|
| 2.1 | Vibe Onboarding | Onboarding page with 6+ vibe cards, live mini-previews, "describe your site" textarea |
| 2.2 | All Core Sections (8 types) | Pricing, Footer, Testimonials, FAQ, Value Props; section registry, Zod schemas, drag-and-drop reorder |
| 2.3 | Builder UX Polish | Section sidebar navigator, quick actions, named project save/load, first-time tooltips, accessibility audit |

#### Level 3: Specification Engine (Phases 3.1-3.2)

| Phase | Name | Goal |
|-------|------|------|
| 3.1 | Pillar Docs | Auto-generate North Star, Architecture, Implementation Plan from config; HUMAN and AISP views; live updates |
| 3.2 | Site-Level Specs | Per-section spec generators, download zip (pillar docs + section specs + config.json), Claude Code formatted output |

#### Level 4: Auth & Database (Phases 4.1-4.3)

| Phase | Name | Goal |
|-------|------|------|
| 4.1 | Supabase Auth + DB | Login/signup UI, project dashboard, swap LocalStorageAdapter to SupabaseAdapter, analytics + error monitoring |
| 4.2 | Templates from DB | Vibe presets from database, section templates from database, image upload via Supabase Storage |
| 4.3 | LLM Pillar Doc Generation | Paste requirements, LLM generates pillar docs, auto-select vibe + populate sections |

#### Level 5: LLM Functionality (Phases 5.1-5.4)

**Entry Criteria: Explicit human approval for API costs**

| Phase | Name | Goal |
|-------|------|------|
| 5.1 | Chat Bot (Hero) | Chat input to LLM to JSON patch to hero updates; chatStore for message history; per-user rate limiting |
| 5.2 | Copy Suggestions | Click section, LLM suggests 3 copy options |
| 5.3 | Section Inference | Two-step LLM: classify intent then generate patch; no section selection required |
| 5.4 | Onboarding Purpose | "Describe your website" text input triggers LLM auto-build |

#### Level 6: Voice Mode (Phases 6.1-6.3)

| Phase | Name | Goal |
|-------|------|------|
| 6.1 | Microphone Button | Web Speech API STT, transcript populates chat input |
| 6.2 | Listen Mode (Task Queue) | Continuous listening, periodic LLM calls (~15s intervals), user approves tasks before applying |
| 6.3 | Virtual Whiteboard | Auto-apply mode with no approval gate; site updates as user talks |

#### Level 7: Enterprise Specs (Phases 7.1-7.4)

| Phase | Name | Goal |
|-------|------|------|
| 7.1 | AISP Mode | Toggle enables AISP Crystal Atom prompts, measurably lower error rate |
| 7.2 | Change Logs | project_versions table with JSON diffs, version timeline with rewind/restore |
| 7.3 | Full Human Specs | Complete documentation page, print-friendly, "Copy All for Claude Code" |
| 7.4 | AI-First AISP Export | AISP-formatted spec package, validation scores per section, < 2% ambiguity |

### Dependency Graph

Levels 1-3 are sequential. Levels 3 and 4 can run in parallel. Levels 5-7 are sequential and depend on Level 4 (Supabase). See `/plans/intial-plans/03.implementation-plan.md` for the full dependency diagram.

---

## 6. SUCCESS CRITERIA

### Core Experience Metrics

| Metric | Target |
|--------|--------|
| Time to first meaningful result | < 30 seconds from landing |
| Mode switching (BUILD/LISTEN, DRAFT/EXPERT) | Instant, smooth, no data loss |
| Config change to visual update | < 100ms |

### Visual & Design Quality

| Metric | Target |
|--------|--------|
| Overall design quality | Indistinguishable from Framer/Linear/Vercel's marketing quality |
| Listen Mode visual impact | "The dark screen with the glowing red orb" must feel cinematic |
| Warm cream aesthetic | Consistent across every surface, every component |

### Specification Output Quality

| Metric | Target |
|--------|--------|
| Spec-to-site fidelity | Pasting generated specs into Claude Code produces a site that matches the preview |
| AISP ambiguity score | < 2% per section |
| Document completeness | All pillar docs + section specs generated from a single JSON config |

### Accessibility & Usability

| Metric | Target |
|--------|--------|
| Grandma test | "Grandson can show grandma everything" in BUILD/DRAFT mode |
| Expert satisfaction | Power users can access full tree, raw JSON, and AISP docs without friction |

---

## 7. DESIGN SYSTEM: "WARM PRECISION"

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| Warm cream chrome | `#faf8f5` | Primary background, all chrome surfaces |
| Orange accent | `#e8772e` | Primary action buttons, active states, links |
| Dark brown text | `#2d1f12` | All body text, headings, labels |

### Listen Mode (Dark Override)

| Token | Hex | Usage |
|-------|-----|-------|
| Near-black background | `#0a0a0f` | Full-screen backdrop in Listen Mode |
| Pulsing red orb | `#ef4444` | Central animated indicator, breathing animation |

Listen Mode is the ONLY dark UI state. The rest of the application always uses the warm cream palette. This is NOT a dark mode toggle; it is a distinct interaction mode with its own visual language.

### Typography

| Font | Usage |
|------|-------|
| DM Sans | All UI text: headings, body, buttons, inputs |
| JetBrains Mono | Structural labels, code blocks, status indicators, JSON editor |

### Typography Rules

- All structural labels use **monospace + uppercase** (e.g., `REALITY`, `DATA`, `BUILD`, `LISTEN`)
- Body text uses DM Sans at regular weight
- No font mixing within a single element

---

## 8. AGENTIC SYSTEM CAPABILITIES

The project uses RuFlo v3 for multi-agent orchestration during development:

| System | Capability |
|--------|-----------|
| **RuFlo v3** | Multi-agent swarm coordination with hierarchical-mesh topology |
| **RuVector** | HNSW-indexed vector search for pattern matching across codebase and memory |
| **AgentDB** | Persistent memory with semantic routing, cross-session continuity |
| **Claude-Flow** | Agent lifecycle management, task orchestration, memory coordination |

### Swarm Configuration

| Parameter | Value |
|-----------|-------|
| Topology | Hierarchical-mesh |
| Max Agents | 7-13 parallel (varies by phase) |
| Strategy | Specialized (clear role boundaries per agent) |
| Consensus | Raft (leader maintains authoritative state) |
| Memory | Hybrid (HNSW + neural embeddings) |

### 3-Tier Model Routing (ADR-026)

| Tier | Handler | Latency | Use Cases |
|------|---------|---------|-----------|
| 1 | Agent Booster (WASM) | <1ms | Simple transforms (skip LLM entirely) |
| 2 | Haiku | ~500ms | Simple tasks, low complexity (<30%) |
| 3 | Sonnet/Opus | 2-5s | Complex reasoning, architecture, security (>30%) |

---

## 9. KEY FILES REFERENCE

### Specification Documents

| File | Purpose |
|------|---------|
| `/plans/intial-plans/00.aisp-reference.md` | AISP protocol reference and Crystal Atom format |
| `/plans/intial-plans/01.north-star.md` | Product vision, user stories, PMF definition |
| `/plans/intial-plans/02.architecture.md` | Technical architecture, state management, data flow |
| `/plans/intial-plans/03.implementation-plan.md` | Original implementation roadmap |
| `/plans/intial-plans/04.design-bible.md` | Visual design system, colors, typography, components |
| `/plans/intial-plans/05.swarm-protocol.md` | Agent orchestration protocol for development |
| `/plans/intial-plans/06.ddd-file-structure.md` | Domain-Driven Design structure and bounded contexts |

### Phase Plans

| File | Purpose |
|------|---------|
| `/plans/phases/README.md` | Phase index with status table |
| `/plans/phases/00-scaffold.md` | Phase 0: Project scaffold and tooling |
| `/plans/phases/01-shell.md` | Phase 1.0: Shell and navigation |
| `/plans/phases/02-hero-json-loop.md` | Phase 1.1: Hero section + JSON core loop |
| `/plans/phases/03-tabs-listen.md` | Phase 1.2: All tabs + Listen mode |
| `/plans/phases/04-polish-persistence.md` | Phase 1.3: Polish and persistence |
| `/plans/phases/05-levels-2-7-overview.md` | Levels 2-7 overview and dependency graph |

### Architecture Decision Records

| File | Purpose |
|------|---------|
| `/plans/phases/adr/README.md` | ADR index |
| `/plans/phases/adr/001-json-single-source.md` | JSON as single source of truth |
| `/plans/phases/adr/005-zustand-state.md` | Zustand for state management |
| `/plans/phases/adr/009b-warm-light-chrome.md` | Warm light chrome design decision |

### Supporting Directories

| Directory | Purpose |
|-----------|---------|
| `/plans/phases/ddd/` | DDD bounded context documentation |
| `/plans/phases/testing/` | TDD London School testing strategy |
| `/plans/phases/design/` | Component design references |
| `/plans/screen-caps/initial-lovable-ai-studio/` | 12 mockup screen captures |
| `/plans/feedback/initial/` | Expert feedback on initial designs |

### Implementation Tracking

| Directory | Purpose |
|-----------|---------|
| `/plans/implementation/level-1-core-builder/` | Level 1 phase tracking |
| `/plans/implementation/level-2-full-site-builder/` | Level 2 phase tracking |
| `/plans/implementation/level-3-specification-engine/` | Level 3 phase tracking |
| `/plans/implementation/level-4-auth-database/` | Level 4 phase tracking |
| `/plans/implementation/level-5-llm-functionality/` | Level 5 phase tracking |
| `/plans/implementation/level-6-voice-mode/` | Level 6 phase tracking |
| `/plans/implementation/level-7-enterprise-specs/` | Level 7 phase tracking |
| `/plans/implementation/rubrics/` | Scoring rubrics for phase completion |
| `/plans/implementation/testing/` | End-of-phase testing artifacts |

### Project Configuration

| File | Purpose |
|------|---------|
| `/CLAUDE.md` | Claude Code agent configuration and behavioral rules |
| `/.claude-flow.json` | RuFlo v3 swarm configuration |

---

## 10. PHASE-LEVEL IMPLEMENTATION GUIDE

### Phase Subfolder Template

Each phase within a level directory follows a consistent structure:

```
level-N-name/
  phase-N.X-name/
    implementation-plan.md    # Detailed task breakdown, acceptance criteria
    log.md                    # Step-by-step record of all work performed
    rubric.md                 # Scoring matrix for requirements and quality
    retrospective.md          # Post-phase review with Playwright test results
```

### File Purposes

#### implementation-plan.md
The detailed breakdown of every task in the phase, including acceptance criteria, agent assignments, and file-level deliverables. This is the authoritative source for what must be built.

#### log.md
A chronological record of all steps taken, decisions made, what worked, and what did not. This file serves a critical purpose: **AI continuity**. When a new conversation or agent picks up work on a phase, the log provides full context without requiring the agent to re-discover project state.

Contents include:
- Commands run and their results
- Design decisions and their rationale
- Problems encountered and how they were resolved
- Files created or modified
- Test results

#### rubric.md
A scoring matrix that evaluates:
- Requirements completion (did every acceptance criterion pass?)
- Code quality (types, tests, lint, architecture compliance)
- Visual quality (does it match the design bible?)
- Performance (does it meet the < 100ms update target?)

#### retrospective.md
An end-of-phase review that uses **Playwright** for automated UI/UX/functionality testing. The retrospective captures:
- Playwright test results (screenshots, assertions, interaction recordings)
- Visual regression comparisons against mockups
- Performance measurements
- Lessons learned for subsequent phases

---

## 10.1 Quality Gates (Mandatory After Every UI Change)

| # | Check | Command | Catches |
|---|-------|---------|---------|
| 1 | TypeScript compiles | `npx tsc --noEmit` | Type errors |
| 2 | Production builds | `npx vite build` | Bundle errors |
| 3 | Visual smoke tests | `npx playwright test` | Raw HTML, broken renders |
| 4 | Screenshot review | Check `tests/screenshots/` | Layout breaks |
| 5 | Bidirectional sync | Change control → verify JSON updates | Broken data loop |

---

## 11. CURRENT STATUS (Updated 2026-04-03)

### Completed Phases

| Phase | Focus | Completed | Score |
|-------|-------|-----------|-------|
| 1 | Core Builder | 2026-03-29 | 77% |
| 2 | System Polish + Section Editors + CRUD | 2026-03-30 | 82% |
| 3 | Onboarding + Preview + Builder UX | 2026-03-30 | 73% |
| 4 | Splash + Theme Picker + Listen Mode | 2026-04-02 | — |
| 5 | Visual Polish + Section Expansion | 2026-04-03 | 67% |
| 6 | Canned Demo + Deploy Prep | 2026-04-03 | 78% |

### Next Steps

```
Phase 7: Final Demo Polish (welcome page, light mode, edge cases, Playwright) — ~2 days
Phase 8: Capstone Presentation Prep (slides, Vercel prod deploy, README) — ~1 day
```

---

*This document is the master reference for the Hey Bradley implementation. All AI agents should read this file first when joining a conversation about this project.*
