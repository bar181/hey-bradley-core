# Project Configuration — bar181/hey-bradley-core

## Behavioral Rules (Always Enforced)

- Do what has been asked; nothing more, nothing less
- NEVER create files unless they're absolutely necessary for achieving your goal
- ALWAYS prefer editing an existing file to creating a new one
- NEVER proactively create documentation files (*.md) or README files unless explicitly requested
- NEVER save working files, text/mds, or tests to the root folder
- Never continuously check status after spawning a swarm — wait for results
- ALWAYS read a file before editing it
- NEVER commit secrets, credentials, or .env files

## Effort Estimation Rule (post-P19 reality check)

- **Target multi-hour shifts, NOT multi-day shifts.** Observed velocity through P19: ~6 phases sealed per day. Original phase budgets (4-6 days each) were 10-50× conservative.
- Phase plans should carry both the original estimate AND a velocity-corrected estimate ("@vel"). See `plans/implementation/mvp-plan/STATE.md` §2.
- Re-budget at the end of each phase based on actual elapsed time.
- Quality discipline (tests, ADRs, persona scoring, brutal reviews) is the brake — do NOT compress to hit velocity. Velocity emerges when discipline holds.
- Default sprint sizing at velocity: a 3-phase sprint (P21-P23 etc.) ≈ 1 working day; a 5-phase sprint (P27-P31) ≈ 1-2 working days.

## Standard Phase Process (always-do)

Every phase, in order, no exceptions:

1. **Phase execution** — code/docs per the phase plan
2. **End-of-phase** — `08-master-checklist.md` ticks + `STATE.md` row update + `phase-N/session-log.md` results table + `phase-N/retrospective.md` (what to keep / drop / reframe)
3. **Review with fixes** — post-seal review pass; address must-fix items in `fix-pass-N` commits before next phase starts
4. **Preflight for next phase** — scaffold `phase-(N+1)/preflight/00-summary.md` + `checklist.md` + `MEMORY.md`

**Optional EXTRA for major phases (composite-impacting or capstone-relevant):**

5. **Deep-dive brutal review** — 4 parallel reviewer perspectives (UX / Functionality / Security / Architecture) writing a single chunked report at ≤600 LOC per file; recursive ≤3 passes; each pass identifies blockers → fix → re-review until clean
6. **Persona re-score** — Grandma / Framer / Capstone scored against the rubric; record in `phase-N/personas.md`

The standard 1-4 is non-negotiable. Steps 5-6 are decided per-phase by the owner.

## File Organization

- NEVER save to root folder — use the directories below
- Use `/src` for source code files
- Use `/tests` for test files
- Use `/docs` for documentation and markdown files
- Use `/config` for configuration files
- Use `/scripts` for utility scripts
- Use `/examples` for example code

## Project Architecture

- Follow Domain-Driven Design with bounded contexts
- Keep files under 500 lines
- Use typed interfaces for all public APIs
- Prefer TDD London School (mock-first) for new code
- Use event sourcing for state changes
- Ensure input validation at system boundaries

### Project Config

- **Topology**: hierarchical-mesh
- **Max Agents**: 15
- **Memory**: hybrid
- **HNSW**: Enabled
- **Neural**: Enabled

## Project Status

- **Current Phase:** Phase 30 SEALED at 91/100 (Sprint D P2 — Template Persistence); Phase 31 NEXT (Sprint D P3 — Content Generators POC)
- **Codebase:** ~63K total lines (TS/TSX/JSON/MD, excl. node_modules); ~28,400 lines TS/TSX across 227 source files
- **Themes:** 12 (agency, blog, creative, elegant, minimalist, neon, personal, portfolio, professional, saas, startup, wellness)
- **Examples:** 17 (adds blog-standard + capstone to the original 15)
- **Section Types:** 16 (includes blog)
- **Images:** 300 in media library catalog, 13 image effects (8 core + 5 wow-factor)
- **Website Pages:** 4 (About, Open Core, How I Built This, Docs) — all with real content
- **Chat Commands:** 15+ simulated requirements (includes 5 compound commands)
- **Listen Demos:** 4 distinct site types
- **Spec Generators:** 6 with design specs, cross-references, effects info
- **Blueprints:** 7 sub-tabs (North Star, Architecture, Build Plan, Features, Human Spec, AISP, JSON)
- **Center Tabs (EXPERT):** 5 (Preview, Blueprints, Resources, Data, Pipeline)
- **Capabilities:** Multi-page support, ZIP export, blog section type, AISP Crystal Atom output, real LLM adapters (Claude/Gemini/OpenRouter), Web-Speech STT (PTT)
- **ADRs:** 45 ADR files through ADR-054 (DDD Bounded Contexts); ADR-050 promoted from stub to Accepted (Template-First Chat Architecture, P23). Numbering has 11 documented gaps (002-004, 006-009, 034-037) — see `docs/adr/README.md`.
- **Deferred Features:** 34 documented in plans/deferred-features.md; 20 P20 carryforward items in plans/implementation/phase-19/deep-dive/05-fix-pass-plan.md §5
- **Tests:** 63 Playwright cases across 29 spec files (46 targeted active for P19 seal-gate)

### Phase Roadmap

| Phase | Focus | Status |
|-------|-------|--------|
| P11 | Website + enhanced demos + brand/design locks | CLOSED (83/100) |
| P12 | Content Intelligence: site context, 13 effects, Resources tab | CLOSED (78/100) |
| P13 | Advanced Features: blog section, multi-page, export, a11y, 100+ tests | CLOSED (76/100) |
| P14 | Marketing review: 20 issues fixed, AISP validation, UI/UX cleanup | CLOSED (74/100) |
| P15 | Polish + Kitchen Sink + Blog + Novice Simplification | CLOSED (82/100) |
| P16 | Local Database (sql.js + IndexedDB) | CLOSED (86/100) |
| P17 | LLM Provider Abstraction + Env Var + BYOK Scaffold | CLOSED (88/100) |
| P18 | Real Chat Mode (LLM → JSON Patches) | CLOSED (89/100) |
| P18b | Provider Expansion + Observability (5-adapter matrix + llm_logs) | CLOSED (90/100) |
| P19 | Real Listen Mode (Web Speech STT + voice-to-pipeline + 18-item fix-pass) | CLOSED (88/100) |
| P20 | Verify, Cost Caps, MVP Close — CostPill + AbortSignal C20 + mvp-e2e + getting-started + CONTRIBUTING | CLOSED 88/100 (Grandma 76 / Framer 87 / Capstone 91) |
| P21 | **Cleanup + ADR/DDD gap-fill (NEW — inserted post-Wave-2 ratification)** | NEXT (post-P20) |
| P22 | **Public Website Rebuild — BYOK demo + Don Miller blog-style** | CLOSED 81/100 (Grandma 73 / Framer 84 / Capstone 86) |
| P23 | Sprint B Phase 1 — Simple Chat (template-first routing; 3 templates + router + ADR-050) | CLOSED 88/100 (Grandma 76 / Framer 86 / Capstone 92) |
| P24 | Sprint B Phase 2 — section targeting via `/hero-1` keyword scoping (parser + resolver + template scope-honoring; ADR-051 full) | CLOSED 88/100 (Grandma 76 / Framer 87 / Capstone 92) |
| P25 | Sprint B Phase 3 — intent translation (verb/type/ordinal rewrites; idempotent; ADR-052 full) | CLOSED 88/100 (Sprint B complete; ~140m total / ~50× velocity) |
| P26 | Sprint C Phase 1 — AISP Instruction Layer (Crystal Atom + rule-based classifier; ADR-053 full) | CLOSED 89/100 (Capstone 93; +1 from P25 — capstone thesis demo phase) |
| P27 | Sprint C P2 — LLM-Native AISP (Crystal Atom verbatim → LLM; Zod schema; UI panel; ADR-055 + ADR-056; capstone thesis demo) | CLOSED 90/100 (Grandma 76 / Framer 88 / Capstone 96 — plateau broken) |
| P28 | Sprint C P3 — 2-step template selection (SELECTION_ATOM; ADR-057) + carryforward closure (C04 partial / C17 partial / C15 done / C16 deferred ADR-040b) | CLOSED 91/100 (Sprint C complete; Sprint D greenlight CONFIRMED) |
| P29 | Sprint D P1 — Template Library API (decoration over registry; category + kind enums; 4 list/filter APIs; ADR-058) | CLOSED 91/100 (held; Sprint D opener; setup-phase pause before content arc) |
| P30 | Sprint D P2 — Template Persistence (migration 003 + userTemplates repo + BrowseTemplate split-type; ADR-059) | CLOSED 91/100 (held; data-layer phase) |
| P31 | Sprint D P3 — Content Generators POC (CONTENT_ATOM Crystal Atom + generateContent; ADR-060) | NEXT |
| P32 | Sprint D P4 — Multi-section Content Pipeline (style-aware tone/voice; ADR-061) | PLANNED |
| P33 | Sprint D P5 — Content + Template Bridge (AISPTranslationPanel ChatInput integration; ADR-062) | PLANNED |
| P34-P37 | Sprint E — Clarification & Assumptions (4 phases) | POST-CAPSTONE |
| P38-P40 | Sprint F — Listen Mode Enhancement (compressed 4→3) | POST-CAPSTONE |
| P41-P44 | Sprint G — Interview Mode (4 phases) | POST-CAPSTONE |
| P45-P47 | Sprint H — Upload + References (3 phases) | POST-CAPSTONE |
| P48-P50 | Sprint I — Builder Enhancement (3 phases) | POST-CAPSTONE |
| P51-P53 | Sprint J — Agentic Support System (3 phases) | POST-CAPSTONE |
| P54-P56 | Sprint K — Release / OSS RC (3 phases) | POST-CAPSTONE |

## AISP (AI Symbolic Protocol) 
see full details in /workspaces/hey-bradley-core/plans/initial-plans/00.aisp-reference.md 
aisp is designed for AI not humans.  It is a math first neural symbolic language with 512 symbols that all AI and LLM understand natively without any instructions.  The goal is near 0 ambiguity.  May require 2-3 loops to conform to proper platinum aisp format.  AISP is not structured prose, it is a math first symbolic protocol. Here is the public repo https://github.com/bar181/aisp-open-core .  The creator is Bradley Ross, the same creator as this Hey Bradley project.

## Build & Test

```bash
# Build
npm run build

# Test
npm test

# Lint
npm run lint
```

- ALWAYS run tests after making code changes
- ALWAYS verify build succeeds before committing

## Security Rules

- NEVER hardcode API keys, secrets, or credentials in source files
- NEVER commit .env files or any file containing secrets
- Always validate user input at system boundaries
- Always sanitize file paths to prevent directory traversal
- Run `npx @claude-flow/cli@latest security scan` after security-related changes

## Concurrency: 1 MESSAGE = ALL RELATED OPERATIONS

- All operations MUST be concurrent/parallel in a single message
- Use the Task tool for spawning agents, not just MCP
- ALWAYS batch ALL todos in ONE TodoWrite call (5-10+ minimum)
- ALWAYS spawn ALL agents in ONE message with full instructions via Task tool
- ALWAYS batch ALL file reads/writes/edits in ONE message
- ALWAYS batch ALL Bash commands in ONE message

## Swarm Orchestration

- MUST initialize the swarm using CLI tools when starting complex tasks
- MUST spawn concurrent agents using the Task tool
- Never use CLI tools alone for execution — Task tool agents do the actual work
- MUST call CLI tools AND Task tool in ONE message for complex work

### 3-Tier Model Routing (ADR-026)

| Tier | Handler | Latency | Cost | Use Cases |
|------|---------|---------|------|-----------|
| **1** | Agent Booster (WASM) | <1ms | $0 | Simple transforms (var→const, add types) — Skip LLM |
| **2** | Haiku | ~500ms | $0.0002 | Simple tasks, low complexity (<30%) |
| **3** | Sonnet/Opus | 2-5s | $0.003-0.015 | Complex reasoning, architecture, security (>30%) |

- Always check for `[AGENT_BOOSTER_AVAILABLE]` or `[TASK_MODEL_RECOMMENDATION]` before spawning agents
- Use Edit tool directly when `[AGENT_BOOSTER_AVAILABLE]`

## Swarm Configuration & Anti-Drift

- ALWAYS use hierarchical topology for coding swarms
- Keep maxAgents at 6-8 for tight coordination
- Use specialized strategy for clear role boundaries
- Use `raft` consensus for hive-mind (leader maintains authoritative state)
- Run frequent checkpoints via `post-task` hooks
- Keep shared memory namespace for all agents

```bash
npx @claude-flow/cli@latest swarm init --topology hierarchical --max-agents 8 --strategy specialized
```

## Swarm Execution Rules

- ALWAYS use `run_in_background: true` for all agent Task calls
- ALWAYS put ALL agent Task calls in ONE message for parallel execution
- After spawning, STOP — do NOT add more tool calls or check status
- Never poll TaskOutput or check swarm status — trust agents to return
- When agent results arrive, review ALL results before proceeding

## V3 CLI Commands

### Core Commands

| Command | Subcommands | Description |
|---------|-------------|-------------|
| `init` | 4 | Project initialization |
| `agent` | 8 | Agent lifecycle management |
| `swarm` | 6 | Multi-agent swarm coordination |
| `memory` | 11 | AgentDB memory with HNSW search |
| `task` | 6 | Task creation and lifecycle |
| `session` | 7 | Session state management |
| `hooks` | 17 | Self-learning hooks + 12 workers |
| `hive-mind` | 6 | Byzantine fault-tolerant consensus |

### Quick CLI Examples

```bash
npx @claude-flow/cli@latest init --wizard
npx @claude-flow/cli@latest agent spawn -t coder --name my-coder
npx @claude-flow/cli@latest swarm init --v3-mode
npx @claude-flow/cli@latest memory search --query "authentication patterns"
npx @claude-flow/cli@latest doctor --fix
```

## Available Agents (60+ Types)

### Core Development
`coder`, `reviewer`, `tester`, `planner`, `researcher`

### Specialized
`security-architect`, `security-auditor`, `memory-specialist`, `performance-engineer`

### Swarm Coordination
`hierarchical-coordinator`, `mesh-coordinator`, `adaptive-coordinator`

### GitHub & Repository
`pr-manager`, `code-review-swarm`, `issue-tracker`, `release-manager`

### SPARC Methodology
`sparc-coord`, `sparc-coder`, `specification`, `pseudocode`, `architecture`

## Memory Commands Reference

```bash
# Store (REQUIRED: --key, --value; OPTIONAL: --namespace, --ttl, --tags)
npx @claude-flow/cli@latest memory store --key "pattern-auth" --value "JWT with refresh" --namespace patterns

# Search (REQUIRED: --query; OPTIONAL: --namespace, --limit, --threshold)
npx @claude-flow/cli@latest memory search --query "authentication patterns"

# List (OPTIONAL: --namespace, --limit)
npx @claude-flow/cli@latest memory list --namespace patterns --limit 10

# Retrieve (REQUIRED: --key; OPTIONAL: --namespace)
npx @claude-flow/cli@latest memory retrieve --key "pattern-auth" --namespace patterns
```

## Quick Setup

```bash
claude mcp add claude-flow -- npx -y @claude-flow/cli@latest
npx @claude-flow/cli@latest daemon start
npx @claude-flow/cli@latest doctor --fix
```

## Task Tool vs CLI Tools

- The Task tool handles ALL execution: agents, file ops, code generation, git
- CLI tools handle coordination via Bash: swarm init, memory, hooks, routing
- NEVER use CLI tools as a substitute for Task tool agents

## Support

- Documentation: https://github.com/bar181/hey-bradley-core
- Issues: https://github.com/bar181/hey-bradley-core/issues
