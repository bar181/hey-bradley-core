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

- **Current Phase:** P72 / OC-TI SEALED — 5-agent dispatch (A1 themeLibrary + A2 sectionLibrary + A3 contentLibrary + A4 templateMatcher/templateApplier + A5 closer with test spec + EOP + CLAUDE.md sync). 3-layer Template Intelligence Architecture (ADR-098) layered ON TOP of existing 37 MasterConfig starter packs (no replacement; SELECTION_ATOM flow intact). Layer 1 Theme: **18 themes** in `src/contexts/intelligence/templates/themeLibrary.ts` (warm-minimal · dark-tech · bright-playful · corporate-clean · retro-bold · …); Layer 2 Section: **12 arrangements** in `sectionLibrary.ts` (saas-landing · personal-brand · agency-portfolio · podcast-show · …); Layer 3 Content: **12 styles** in `contentLibrary.ts` (don-miller-story · elevator-pitch · article · fun-casual · professional · technical · …). `templateMatcher.ts` exports `matchTemplates` + `TEMPLATE_CONFIDENCE_THRESHOLD = 0.8` (ASSUMPTIONS_ATOM round-trip below threshold). `templateApplier.ts` emits `JsonPatch[]` against `/theme/colors/*`, `/sections/{id}/*`, and `/_pendingContentStyle` staging path. HNSW activation deferred to Tier-2 commercial per ADR-098 §Out of scope — keyword-tag matcher with `vectorDescription` swap-in surface. **~794+ cumulative PURE-UNIT GREEN** (was ~774; +~20 new from `tests/p72-template-intelligence.spec.ts`, ~30-48 cases across 11 describe blocks). NOTE: A1's P72 ruvector entry pending — leave for OC-CLEANUP follow-up. Predecessors: P70/P71 (~774 GREEN); P68/P69 (`753beb5`); P67c (`8d46ddf`); P67b (`37933e8`); P67 (`17c9635`); P66 Polish Wave 1 (`34699d4`); P66/OC-MKTG (`62af4a4`); P65b (`e7b6af2`); P65 (`261d840`); P64 (`0701b37`); P63 (`ac6f973`); P62 (`6a86d5c`). Open planning: P61 (`64e305c`/`b1a9652`) + P61b (`8025878`). ADR ledger: ADR-087 Design Tokens; ADR-088 Mode Architecture; ADR-089 Agentics Data Model; ADR-090 Mobile UX Redesign (P69 / OC-5); ADR-091 Canonical Component Quality; ADR-092 Polish Sprint Architecture; ADR-093 Component Decomposition Standard; ADR-094 Professional Grade Standard; ADR-095 Library-Wide Polish Standard; ADR-096 Template Library Expansion (P68 / OC-4); ADR-097 Blog Content Strategy (P71 / OC-13); **ADR-098 Template Intelligence Architecture (P72 / OC-TI)**. ADR-076 SUPERSEDED. Carry-forward: Web Speech wire-up for MobileListenFullscreen; bottom-sheet drag refinement; +3 templates to reach literal 40+ (`OC-4 round 3`); useChatPipeline hook (P67d); OC-CLEANUP marketing-site mobile (ADR-090 decision 5); build-step RSS generator (replaces static stub); +2 stretch posts to reach literal 12+; **OC-DECOMP (intent → todo decomposition; pre-pipeline accumulator)**; **OC-TI Wave 2 (matcher UI surface — ranked candidates in chat thread)**; **HNSW activation (Tier-2 commercial)**; **chatPipeline full wire if A4 deferred**; **A1 P72 ruvector backfill**. NEXT: OC-DECOMP / OC-TI Wave 2 / OC-12 live-LLM / Polish Wave 4 / OC-9 Export polish — owner choice.
- **Codebase:** ~63K total lines (TS/TSX/JSON/MD, excl. node_modules); ~28,400 lines TS/TSX across 227 source files
- **Themes:** 12 (agency, blog, creative, elegant, minimalist, neon, personal, portfolio, professional, saas, startup, wellness)
- **Examples:** 37 (17 baseline + 3 OC-3 + 11 OC-4: 4 healthcare/wellness + 4 creator/personal + 3 dev-tools/OSS)
- **Section Types:** 16 (includes blog)
- **Images:** 300 in media library catalog, 13 image effects (8 core + 5 wow-factor)
- **Website Pages:** 4 (About, Open Core, How I Built This, Docs) — all with real content
- **Blog Posts:** 10 (4 P58 baseline + 6 P71 expansion per ADR-097; voice + length + cadence + distribution standards codified)
- **Chat Commands:** 15+ simulated requirements (includes 5 compound commands)
- **Listen Demos:** 4 distinct site types
- **Spec Generators:** 6 with design specs, cross-references, effects info
- **Blueprints:** 7 sub-tabs (North Star, Architecture, Build Plan, Features, Human Spec, AISP, JSON)
- **Center Tabs (EXPERT):** 5 (Preview, Blueprints, Resources, Data, Pipeline)
- **Capabilities:** Multi-page support, ZIP export, blog section type, AISP Crystal Atom output, real LLM adapters (Claude/Gemini/OpenRouter), Web-Speech STT (PTT), Template Intelligence (3-layer: theme/section/content, ADR-098)
- **ADRs:** 98 Accepted on disk. Range ADR-045 through ADR-098. Recent additions: ADR-082 (Open Core RC, P58), ADR-083 (Test Library Architecture, P59), ADR-084 (Comprehensive QA Architecture, P60), ADR-085 (Multi-Page MVP, P61), ADR-086 (Process Pages content/runtime split, P61), ADR-087 (Design Token System, P65 / OC-2.5), ADR-088 (Mode Architecture, P63 / OC-2), ADR-089 (Agentics Data Model, P63 / OC-2), ADR-090 (Mobile UX Redesign, P69 / OC-5; supersedes ADR-076), ADR-091 (Canonical Component Quality, P65b / OC-2.5 Wave 2), ADR-092 (Polish Sprint Architecture, P66 Wave 1), ADR-093 (Component Decomposition Standard, P67 / Polish Wave 2), ADR-094 (Professional Grade Standard, P67b / Close the Gap), ADR-095 (Library-Wide Polish Standard, P67c), ADR-096 (Template Library Expansion Standard, P68 / OC-4), ADR-097 (Blog Content Strategy, P71 / OC-13), **ADR-098 (Template Intelligence Architecture, P72 / OC-TI)**. ADR-076 (Sprint J 3-tab nav) SUPERSEDED by ADR-090. Numbering has 11 documented gaps (002-004, 006-009, 034-037) plus 3 stub-then-superseded duplicates (ADR-051/052/053 each have a P21 stub + a later Accepted file under the same number; see `docs/adr/README.md`).
- **Deferred Features:** 34 documented in plans/deferred-features.md; 20 P20 carryforward items in plans/implementation/phase-19/deep-dive/05-fix-pass-plan.md §5
- **Tests:** Cumulative **~794+/~794+ PURE-UNIT GREEN at P72 (OC-TI) seal** (392 P60 baseline + 3 P60.5 + 10 P62 OC-1 + 20 P63 OC-2 + 14 P64 OC-3 + 11 P65 OC-2.5 + 31 P65b OC-2.5 Wave 2 + 47 P66 Polish Sprint Wave 1 + 42 P67 Polish Wave 2 + 34 P67b Close the Gap + 22 P67c Library-Wide Polish + 74 P68 Templates Round 2 + 30 P69 Mobile Redesign + 0 P70 OC-CLEANUP + ~44 P71 OC-13 Blog Expansion + ~20-48 P72 OC-TI Template Intelligence). P70 is a docs-only cleanup sprint (zero new tests by design). P72 spec is `tests/p72-template-intelligence.spec.ts` — 11 describe blocks, ~30-48 individual test() cases. P59 baseline = 298 Sprint N at `c00c2b7` + ~17 P58 RC + ~51 P59 prompt-library per ADR-083. P60 added 26 specs. Full corpus is 890+ tests across 75+ spec files (includes legacy + skipped suites); ~794+ is the curated PURE-UNIT seal-gate cumulative-regression subset.
- **Ruvector Memory:** **126 entries** at P70 open (P61 baseline 104 + later phase/learning rows + P70 A1 backfill of ADR-087..096 patterns). Vector index `default` (768-dim cosine) + `patterns` (768-dim cosine) BOTH show **0 vectors — HNSW NOT INDEXED**. No auto-write hook on agent runs. Ruvector is a **manually-curated static snapshot**, NOT a flywheel — search via SQL `LIKE` works; HNSW search non-functional. Activation (HNSW re-index + auto-write per agent run) intentionally deferred to commercial Tier-2 learning runtime per `plans/implementation/phase-61/03-ruvector-state.md`.

### Open-Core Moat Priorities

1. **Speed visible** — Sprint K / P54 / ADR-077 (latency badge surfaces sub-second response)
2. **Spec unmissable** — Sprint L / P55 / ADR-078 (AISP always-on + atom animations)
3. **Premium templates** — Sprint M / P56 / ADR-079 (3-5 strongly opinionated templates)
4. **Shareable output** — Sprint N / P57 / ADR-081 (static HTML export + hosted spec URL)

### Deferred to Commercial (Tier-2)

- Multi-page sites (beyond current scope)
- OAuth + Supabase persistence
- Vector DB learning runtime (HNSW re-index pending)
- Tier-2 flagship dashboard / SaaS apps
- Agentic Support System (Sprints J/K/L originals)

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
| P31 | Sprint D P3 — Content Generators POC (CONTENT_ATOM Crystal Atom + generateContent stub; ADR-060) | CLOSED 92/100 (+1; 4-atom AISP architecture in production) |
| P32 | Sprint D P4 — Multi-section content pipeline (section-aware tone/length defaults; ADR-061) | CLOSED 92/100 (held; Framer +1) |
| P33 | Sprint D P5 — Content + Template Bridge (kind dispatch + first generator template + ADR-062); SPRINT D CLOSE | CLOSED 93/100 (+1; Sprint D complete; 4-atom AISP in production) |
| P33+ | End-of-Sprint-D Brutal-Honest Review + 3 fix-passes (12/12 must-fix closed; 99/99 tests GREEN) | CLOSED — persona re-score deferred to post-UI mini-phase |
| P34 | Sprint E P1 — UI Closure + Assumptions Engine + brutal-honest review fix-pass (6 must-fix + 2 LOW closed) | CLOSED 95/100 estimated post-fix (Grandma 79 / Framer 89 / Capstone 98); 157/157 tests GREEN; Sprint E greenlight CONFIRMED |
| P35 | Sprint E P2 — ASSUMPTIONS_ATOM Crystal Atom + LLM lift + EXPERT trace pane + BYOK matrix completion (OpenAI added; ADR-064) | CLOSED 96/100 estimated (Grandma 79 / Framer 91 / Capstone 99); **5-atom AISP in production**; 211/211 tests GREEN |
| P36 | Sprint F P1 — Listen + AISP Unification (review-first voice UX; ListenReviewCard + ListenClarificationCard + listenActionPreview; ADR-065) | CLOSED 96/100 estimated (Grandma 81 / Framer 89 / Capstone 99); 255/255 tests GREEN; 31/35 prompt coverage |
| P37 | Sprint F P2 — Command Triggers + Content/Design Route Split + ListenTab refactor + carryforward closure (ADR-066) | CLOSED 91/100 estimated post-fix-pass (Grandma 82 / Framer 90 / Capstone 99); 408/408 tests GREEN; 35/35 prompt coverage; ListenTab 947→84 LOC |
| P38 | Sprint F P3 — Sprint F SEAL — end-of-sprint 4-reviewer brutal review + fix-pass + presentation gate | CLOSED at `3049b05` |
| P44 | Sprint H P1 — Brand Context Upload (ADR-067) | CLOSED — Sprint H Wave 1 |
| P45 | Sprint H P2 — Codebase Reference Ingestion (ADR-068) | CLOSED — Sprint H Wave 2 |
| P46 | Sprint H P3 — Reference Management UI + Sprint H SEAL (ADR-069 + end-of-sprint fix-pass) | CLOSED at `a83ba8a` |
| P47 | Sprint I P1 — Builder UX polish + a11y (ADR-070) | CLOSED — Sprint I Wave 1 (`4edae30`) |
| P48 | Sprint I P2 — Quick-add picker + Improvement Suggestions (ADR-071) | CLOSED — Sprint I Wave 2 (`85f341e`) |
| P49 | Sprint I P3 — Mobile polish + C11 closure + Sprint I SEAL (ADR-072) | CLOSED at `e08bc94` |
| P50 | Sprint J P1 — Personality Engine + Composition (no Σ widening; ADR-073) | CLOSED — Sprint J Wave 1 (`a12fd57`) |
| P51 | Sprint J P2 — Personality Picker UI + Onboarding step + 5 bubble styles (ADR-074) | CLOSED — Sprint J Wave 2 (`6d3f27e`) |
| P52 | Sprint J P3 — Conversation Log EXPERT tab + Share Spec clipboard (ADR-075) | CLOSED — Sprint J Wave 3 (`c806af4`) |
| P53 | Sprint J P4 — Mobile UX overhaul (3-tab nav + hamburger; ADR-076) + **Sprint J SEAL** | CLOSED at `644200a` — system-wide composite 89.75 PASS |
| P54 | **Sprint K — Make The Speed Visible** (latency capture + UI badge; moat priority #1; ADR-077) | CLOSED at `44cc36c` — Sprint K Wave 1 |
| P55 | **Sprint L — Make The Spec Unmissable** (AISP always-on + atom animations + spec primary tab; moat priority #2; ADR-078) | CLOSED at `2944461` — Sprint L Wave 1 |
| P56 | **Sprint M — Premium Templates** (3-5 strongly opinionated templates + design discipline; moat priority #3; ADR-079) | CLOSED at `3398702` — Sprint M Wave 1 |
| P57 | **Sprint N — Shareable Output** (static HTML export + hosted spec URL; moat priority #4; ADR-080 + ADR-081 supersedes ADR-075) | CLOSED — Wave 1 public-site refresh at `e692204`; Wave 2 Sprint N at `c00c2b7` (cumulative 298/298 PURE-UNIT GREEN) |
| P58 | **Sprint O — Open Core RC** (README/CLAUDE final + demo video + Agentics Foundation beta + `v1.0.0-RC1` public release) | CLOSED — `v1.0.0-RC1` sealed |
| P59 | **Test Library — Prompt Corpus** (280-entry canonical corpus for AgentProxy + live-LLM testing arc; ADR-083) | CLOSED at `f81474c` — 366/366 PURE-UNIT GREEN |
| P60 | **Comprehensive QA Architecture** (50 personality + 80 LLM matrix + flagship + 2 persona templates + 4 per-concern specs + reviewer-impression + competitive; ADR-084) | CLOSED — 392/392 PURE-UNIT GREEN; steps 1-3 sealed at `7ab9e02`/`0dc2afa`/`6f28a22` |
| P68 / OC-4 | **Templates Round 2** (11 new templates + visual-style filter; ADR-096) | CLOSED at `753beb5` (parallel with P69) |
| P69 / OC-5 | **Mobile UX Redesign** (single-surface chat + inline mic + bottom sheet; ADR-090 supersedes ADR-076) | CLOSED at `753beb5` (parallel with P68) |
| P70 / OC-CLEANUP | **Cleanup sprint** — ruvector audit + phase-folder audit + marketing-page scoring + HEADLINE_STATS truth-up | CLOSED — pure docs/scoring, zero feature work, 0 new tests |
| P71 / OC-13 | **Blog Expansion** — 4 → 10 posts + ADR-097 Blog Content Strategy + read-time/share/tag-filter + RSS stub | CLOSED — ~44 PURE-UNIT tests; cumulative ~774 GREEN |
| (deferred) | Sprint G (Interview), Sprint H (Upload+Refs), Sprint I remainder, original Sprint J (Agentic Support System), Tier-2 SaaS-dashboard flagship, learning-flywheel runtime | DEFERRED to commercial track per `plans/strategic-reviews/open-core-moat-roadmap.md` |

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
