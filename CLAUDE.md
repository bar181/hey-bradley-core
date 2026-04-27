# Claude Code Configuration - RuFlo V3

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

- **Current Phase:** Phase 19 SEALED at 88/100 (commit `03e7aa7`); Phase 20 NEXT
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
- **ADRs:** 38 ADR files through ADR-048 (STT Web Speech API). Numbering has 11 documented gaps (002-004, 006-009, 034-037) — see `docs/adr/README.md`.
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
| P20 | Verify, Cost Caps, MVP Close, Vercel Deploy + 20 P19 carryforward items | NEXT |
| P21 | Sprint B Phase 1 — Simple Chat (natural language input + 2-3 templates + section targeting) | PLANNED |
| P22 | Sprint B Phase 2 — section targeting via `/hero-1` keyword scoping | PLANNED |
| P23 | Sprint B Phase 3 — intent translation (messy → structured to-do) | PLANNED |
| P24 | Sprint C Phase 1 — AISP instruction layer | POST-MVP |
| P25 | Sprint C Phase 2 — AISP intent pipeline | POST-MVP |
| P26 | Sprint C Phase 3 — 2-step template selection | POST-MVP |
| P27-P55 | Sprints D-K — Templates+Content / Clarification / Listen Enhancement / Interview / Upload / Builder / Agentic / Release | POST-MVP |

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
- Use Claude Code's Task tool for spawning agents, not just MCP
- ALWAYS batch ALL todos in ONE TodoWrite call (5-10+ minimum)
- ALWAYS spawn ALL agents in ONE message with full instructions via Task tool
- ALWAYS batch ALL file reads/writes/edits in ONE message
- ALWAYS batch ALL Bash commands in ONE message

## Swarm Orchestration

- MUST initialize the swarm using CLI tools when starting complex tasks
- MUST spawn concurrent agents using Claude Code's Task tool
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

## Claude Code vs CLI Tools

- Claude Code's Task tool handles ALL execution: agents, file ops, code generation, git
- CLI tools handle coordination via Bash: swarm init, memory, hooks, routing
- NEVER use CLI tools as a substitute for Task tool agents

## Support

- Documentation: https://github.com/bar181/hey-bradley-core
- Issues: https://github.com/bar181/hey-bradley-core/issues
