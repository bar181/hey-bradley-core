# Hey Bradley — Agentic System Init & Capabilities Reference

## Purpose
This document confirms understanding of the agentic infrastructure available for building Hey Bradley and establishes the init protocol for new sessions.

## Agentic System Capabilities

### RuFlo v3 (claude-flow)
- **What:** Multi-agent swarm coordination platform
- **Topology:** hierarchical-mesh (configured for this project)
- **Max Agents:** 15 (project config), recommended 7-13 per swarm
- **Strategy:** Specialized — clear role boundaries per agent
- **Consensus:** Raft (leader maintains authoritative state)
- **Key Commands:**
  - `npx @claude-flow/cli@latest swarm init --topology hierarchical --max-agents 8 --strategy specialized`
  - `npx @claude-flow/cli@latest agent spawn -t coder --name my-coder`
  - `npx @claude-flow/cli@latest memory search --query "pattern"`

### AgentDB (Memory)
- **What:** Persistent memory with HNSW-indexed vector search
- **Search Speed:** 150x-12,500x faster than linear scan
- **Features:** Pattern store/search, semantic routing, session management, hierarchical recall
- **Use Cases:** Store coding patterns, recall architecture decisions, share context across agents

### RuVector (Embeddings)
- **What:** Vector embedding generation and search
- **Features:** Generate embeddings, semantic search, hyperbolic embeddings, neural embeddings
- **Use Cases:** Semantic code search, pattern matching, similarity comparison

### Claude-Flow Agent Types (Available)
| Category | Agents |
|----------|--------|
| Core Dev | coder, reviewer, tester, planner, researcher |
| Specialized | security-architect, security-auditor, memory-specialist, performance-engineer |
| Swarm | hierarchical-coordinator, mesh-coordinator, adaptive-coordinator |
| GitHub | pr-manager, code-review-swarm, issue-tracker, release-manager |
| SPARC | sparc-coord, sparc-coder, specification, pseudocode, architecture |

### Intelligence Hooks
- **Pre/Post Task:** Automatic hooks for quality checks
- **Pattern Learning:** Learn from successful and failed approaches
- **Model Routing:** 3-tier routing (WASM booster → Haiku → Sonnet/Opus)
- **Session Management:** Save/restore session state

### Browser Automation
- **What:** Playwright-compatible browser automation via MCP
- **Features:** Open, click, fill, screenshot, evaluate, snapshot
- **Use Cases:** End-of-phase UI/UX testing, visual regression

## Project Init Protocol

When starting a new session on Hey Bradley, agents should:

### Step 1: Read Context (Required)
```
Read these files in order:
1. /workspaces/hey-bradley-core/CLAUDE.md (behavioral rules)
2. /workspaces/hey-bradley-core/plans/implementation/README.md (project summary)
3. /workspaces/hey-bradley-core/plans/implementation/rubrics/master-rubric.md (current progress)
4. The specific level's implementation-plan.md for the current work
5. The specific level's log.md for what's been done
6. The specific level's rubric.md for current scores
```

### Step 2: Assess Current State
```
- What phase are we on?
- What's the last log entry?
- What rubric items are incomplete?
- Are there any blockers noted?
- What did the last retrospective recommend?
```

### Step 3: Plan the Work
```
- What deliverables remain for the current phase?
- What can be parallelized?
- What agent types are needed?
- What research is required?
```

### Step 4: Execute
```
- Spawn 7-13 agents in parallel via Task tool
- Use CLI tools for swarm coordination
- Follow CLAUDE.md behavioral rules
- Update log.md as work progresses
- Update rubric.md as requirements are met
```

### Step 5: Validate
```
- Run Playwright tests for the completed phase
- Update rubric scores
- Complete retrospective
- Human review gate (if applicable)
```

## Key Project Files Reference

| File | Purpose | Location |
|------|---------|----------|
| CLAUDE.md | Agent behavioral rules | /workspaces/hey-bradley-core/CLAUDE.md |
| North Star | Vision and positioning | /plans/initial-plans/01.north-star.md |
| Architecture | Data model, ADRs, DDD | /plans/initial-plans/02.architecture.md |
| Implementation Plan | 21 phases, deliverables | /plans/initial-plans/03.implementation-plan.md |
| Design Bible | Visual specification | /plans/initial-plans/04.design-bible.md |
| Swarm Protocol | Agent rules and laws | /plans/initial-plans/05.swarm-protocol.md |
| File Structure | DDD, AISP specs | /plans/initial-plans/06.ddd-file-structure.md |
| AISP Reference | AISP 5.1 Platinum spec | /plans/initial-plans/00.aisp-reference.md |
| Expert Feedback | UI/UX feedback | /plans/feedback/initial/1.google-overall.md |
| Mockup Screenshots | Visual targets | /plans/screen-caps/initial-lovable-ai-studio/ |

## Design System Quick Reference

| Token | Value | Usage |
|-------|-------|-------|
| Background | #faf8f5 | Warm off-white page bg |
| Surface | #f5f0eb | Cards, panels, inputs |
| Accent | #e8772e | Active tabs, CTAs, selected |
| Text Primary | #2d1f12 | Warm dark brown |
| Text Secondary | #8a7a6d | Descriptions, hints |
| Listen BG | #0a0a0f | Listen mode dark overlay |
| Orb | #ef4444 | Pulsing red AI presence |
| Font UI | DM Sans | UI text |
| Font Mono | JetBrains Mono | Labels, code, status |

## Tech Stack (Approved Only)
Vite + React 18 + TypeScript + Tailwind CSS 3 + shadcn/ui + Zustand + Zod + React Router v6 + react-resizable-panels + Lucide React + clsx + tailwind-merge + class-variance-authority + uuid

**No unapproved packages.** See CLAUDE.md for the full approved list and explicitly forbidden packages.
