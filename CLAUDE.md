# Project Configuration — bar181/hey-bradley-core

> **Scope, rules, and reference pointers only.** Phase narrative + ADR roll-up + test counts live elsewhere — see [Reference Index](#reference-index) at the bottom.

---

## 1. Project Scope

Hey Bradley is a **JSON-driven website spec platform**. A non-technical user describes their site (chat or voice) → an LLM returns a small JSON-Patch → the renderer mutates a typed config → React redraws. The platform's *output* is a complete, handoff-ready spec bundle (CLAUDE.md + DDD contexts + ADRs + AISP atoms + TDD scaffold + agent waves) that any downstream coding agent can implement.

**Three modes:**

| Mode | Surface | Audience |
|---|---|---|
| **Whiteboard** (`/`) | Builder + Live preview | End user — describe, see, ship |
| **Planning** (`/planning`) | Process map + DDD domain model | Product team — see the architecture before code |
| **Agentics** (`/agentics`) | SpecWorkbench + Export | Engineer / coding agent — consume the spec bundle |

**Non-goals (open core):** no backend, no auth, no multi-tenant, no shared cloud projects, no SSO, no native mobile, no live STT calibration runtime. Those are Tier-2 commercial deferrals.

**AISP** (AI Symbolic Protocol) is the math-first symbolic spec language layered through the pipeline. Reference: [bar181/aisp-open-core](https://github.com/bar181/aisp-open-core) and `plans/initial-plans/00.aisp-reference.md`.

---

## 2. Behavioral Rules (Always Enforced)

- Do what has been asked; nothing more, nothing less.
- ALWAYS prefer editing an existing file over creating a new one.
- NEVER create files (especially `*.md` / README) unless explicitly necessary or asked.
- NEVER save working files, tests, or scratch markdown to the repo root — use the directories in §5.
- NEVER commit secrets, credentials, or `.env` files. Run `bash scripts/check-secrets.sh` before commit.
- ALWAYS read a file before editing it.
- ALWAYS run tests after code changes; ALWAYS verify build before committing.
- Never poll a swarm or sleep waiting for agent results — trust async return.

---

## 3. Standard Phase Process (Mandatory, Every Phase)

Every phase MUST produce three artifacts under `plans/implementation/phase-N/` (or `plans/hitl/phase-N/` for HITL phases):

1. **`preflight.md`** — checklist of work + plan + DoD + known unknowns *before* execution starts.
2. **`session-log.md`** — running log of everything the swarm/owner did. **This is the primary source agents use to understand the phase later.** Log decisions, dispatches, fixes, dead-ends, the lot.
3. **`retrospective.md`** — self-eval at seal: what shipped, what slipped, carry-forwards, plan corrections to feed forward.

Optional (major phases only):
- 4-reviewer brutal-honest deep-dive (UX / Functionality / Security / Architecture; ≤600 LOC per chunk; recursive ≤3 passes).
- Persona re-score (Grandma / Framer / Capstone) per the rubric in `docs/quality-rubric.md` if it exists, else inline.

**Velocity guardrail:** target multi-hour shifts, not multi-day shifts. Re-budget at end of each phase based on actuals. Quality discipline (tests, ADRs, brutal reviews) is the brake — do NOT compress to chase velocity.

---

## 4. Flywheel Repos (Reference)

Hey Bradley sits on a 3-repo flywheel. Submodules under `upstreams/` are reference-only, shallow-pinned at submodule add time.

| Repo | Path / URL | Role |
|---|---|---|
| **AISP** | [bar181/aisp-open-core](https://github.com/bar181/aisp-open-core) | Math-first neural-symbolic protocol (~512 symbols). Defines the spec contract; LLMs parse it natively. NOT a submodule — referenced via README + `plans/initial-plans/00.aisp-reference.md`. |
| **RuVector** | `upstreams/ruvector` · [ruvnet/RuVector](https://github.com/ruvnet/RuVector) | Self-learning vector + GNN memory DB (Rust + WASM). Runtime memory backend. Currently a manually-curated static snapshot inside `.swarm/`; HNSW activation deferred to Tier-2 commercial learning runtime. |
| **RuFlo** | `upstreams/ruflo` · [ruvnet/ruflo](https://github.com/ruvnet/ruflo) | Multi-agent orchestration platform for Claude Code. Spawns swarms, routes tasks, coordinates hooks. Used via the `claude-flow` CLI bound to it. |

See `plans/flywheel-index.md` for init steps and current pin status.

---

## 5. File Organization

- `/src` — application source (TypeScript / TSX)
- `/tests` — Playwright + unit specs
- `/docs` — long-form docs (ADRs, audits, launch assets, AISP adoption guide)
- `/plans` — implementation plans, phase folders, strategic reviews, HITL gates
- `/connections` — plugin / NPX / MCP packaging surfaces
- `/scripts` — utility scripts (gates, pre-commit checks, seed generators)
- `/upstreams` — submoduled flywheel repos (read-only reference)

---

## 6. Project Architecture

- **Domain-Driven Design** with bounded contexts (see `docs/adr/ADR-054-ddd-bounded-contexts.md`).
- Files **≤ 500 lines** by default; per-component caps codified by ADR (e.g., `ChatInput.tsx` ≤ 750 per ADR-095).
- Typed interfaces for all public APIs; Zod at every boundary.
- **TDD London School** (mock-first) for new code where practical.
- **Event sourcing** for state changes — JSON-Patch is the contract.
- **BYOK trust boundary**: API keys NEVER leave `localStorage` and NEVER cross the persistence boundary into log_events / edit_history / migrations / exports. See ADR-043 + ADR-114 D3.
- **Atom purity**: `src/contexts/intelligence/aisp/*` MUST NOT import from `src/components/*`. Types live at `src/contexts/specification/types.ts` + `src/contexts/intelligence/aisp/processMapTypes.ts` (ADR-134).

### Swarm config

- **Topology:** hierarchical-mesh
- **Max agents:** 15
- **Memory:** hybrid (sql.js + IndexedDB)
- **HNSW:** enabled (currently un-indexed; static snapshot only — activation = Tier-2)
- **Neural:** enabled (rules-based deterministic baselines; LLM-enriched paths gated on owner BYOK smoke run)

---

## 7. Build & Test

```bash
npm run build       # Vite + tsc strict (must be clean before commit)
npm test            # Playwright full suite
npm run lint        # ESLint + Prettier
npm run check:gates # invariants + ADR-lint chain
bash scripts/run-gates.sh   # same chain via shell wrapper
```

After security-related changes: `npx @claude-flow/cli@latest security scan`.

---

## 8. Security Rules

- NEVER hardcode API keys, secrets, or credentials in source.
- NEVER commit `.env` or any file containing secrets.
- Validate user input at every system boundary (Zod schemas).
- Sanitize file paths to prevent directory traversal.
- BYOK keys live in `localStorage` only; redact via `redactKeyShapes` at every persistence boundary (ADR-043).

---

## 9. Concurrency: 1 MESSAGE = ALL RELATED OPERATIONS

- All independent operations MUST be parallel in a single message.
- Use the **Task tool** for spawning agents — never CLI tools alone.
- Batch ALL todos in ONE TodoWrite call (5–10+ minimum).
- Batch ALL file reads/writes/edits in ONE message.
- Batch ALL Bash commands in ONE message.

---

## 10. Swarm Orchestration

- Hierarchical topology for coding swarms.
- `maxAgents` 6–8 for tight coordination.
- `specialized` strategy for clear role boundaries.
- `raft` consensus for hive-mind (leader maintains authoritative state).
- Frequent checkpoints via `post-task` hooks.
- Shared memory namespace across all agents.

```bash
npx @claude-flow/cli@latest swarm init --topology hierarchical --max-agents 8 --strategy specialized
```

### Execution rules

- ALWAYS use `run_in_background: true` for all agent Task calls.
- ALWAYS put ALL agent Task calls in ONE message for parallel execution.
- After spawning, STOP — do NOT add more tool calls or check status.
- Never poll `TaskOutput` or check swarm status.
- When agent results arrive, review ALL results before proceeding.

### 3-tier model routing (ADR-026)

| Tier | Handler | Latency | Cost | Use cases |
|---|---|---|---|---|
| **1** | Agent Booster (WASM) | <1ms | $0 | Simple transforms (var→const, add types) — skip LLM |
| **2** | Haiku | ~500ms | $0.0002 | Simple tasks, complexity <30% |
| **3** | Sonnet/Opus | 2–5s | $0.003–0.015 | Complex reasoning, architecture, security >30% |

Check for `[AGENT_BOOSTER_AVAILABLE]` or `[TASK_MODEL_RECOMMENDATION]` flags before spawning agents. Use `Edit` tool directly when `[AGENT_BOOSTER_AVAILABLE]`.

---

## 11. Quick CLI Reference

```bash
# Memory (HNSW search)
npx @claude-flow/cli@latest memory store --key "pattern-auth" --value "JWT with refresh" --namespace patterns
npx @claude-flow/cli@latest memory search --query "authentication patterns"
npx @claude-flow/cli@latest memory list --namespace patterns --limit 10

# Swarm + agent lifecycle
npx @claude-flow/cli@latest swarm init --v3-mode
npx @claude-flow/cli@latest agent spawn -t coder --name my-coder
npx @claude-flow/cli@latest doctor --fix

# MCP wiring
claude mcp add claude-flow -- npx -y @claude-flow/cli@latest
npx @claude-flow/cli@latest daemon start
```

60+ specialized agents available (coder / reviewer / tester / planner / researcher / security-architect / sparc-coder / pr-manager / etc.). See `agents/` for the registry.

---

## 12. Current Phase Pointer

| Item | Value |
|---|---|
| **Main** | `0d44a17b0` — v2.0.0-RC1 merged to `main` 2026-05-08 (PR #1, no-squash, 359 commits preserved) |
| **Tag** | `v2.0.0-RC1` (points at prep commit `0818e42b6`) |
| **Last sealed** | **P121 / HITL Pre-Merge Gate** — see `plans/hitl/phase-121/retrospective.md` |
| **Active** | **P122 / UX-OVERHAUL** — staged 40 → 50/100 UI lift; nav locked, Hey Bradley dark/crimson default template, ListenPreview component, builder critical fixes; see `plans/hitl/phase-122/preflight.md` |
| **Next** | **P123** — UI continuation 50 → 65/100 (panel proportions, resizable panels, public below-fold) |
| **Then** | **P124** — Gemini demo mode (`/api/demo-chat`, server-side key, IP rate limit, dollar cap; owner provides key at start) |
| **Capstone** | Harvard ALM defense complete — 10/10, May 2026 |

---

## 13. Reference Index

> **Where the long-tail content lives.** Don't paste history into this file — link out.

| Topic | Location |
|---|---|
| **Project status snapshot** (P56→latest, phase table) | `plans/implementation/mvp-plan/STATE.md` |
| **Per-phase narrative** | `plans/implementation/phase-N/{preflight,session-log,retrospective}.md` |
| **HITL gates** | `plans/hitl/phase-N/` |
| **ADR ledger** (140 files; ADR-001…ADR-149 with documented gaps) | `docs/adr/README.md` |
| **AISP reference** | `plans/initial-plans/00.aisp-reference.md` + [bar181/aisp-open-core](https://github.com/bar181/aisp-open-core) |
| **AISP adoption guide** | `docs/aisp-adoption/` |
| **Flywheel init / pin status** | `plans/flywheel-index.md` |
| **Master backlog** (cross-phase) | `plans/master-backlog.md` |
| **Tier-2 deferrals** | `plans/tier-2/` + `plans/deferred-features.md` |
| **Strategic reviews** (deep-dives, gap audits) | `plans/strategic-reviews/` |
| **Launch assets** (CHANGELOG, release notes, owner checklist) | `docs/launch/` |
| **Quality rubric** (Grandma / Framer / Capstone scoring) | inline in retrospectives + `plans/strategic-reviews/2026-04-29-sprint-j-system-wide/` |

---

## 14. Support

- Documentation: https://github.com/bar181/hey-bradley-core
- Issues: https://github.com/bar181/hey-bradley-core/issues
- AISP open-core: https://github.com/bar181/aisp-open-core
- Capstone: Harvard ALM Digital Media Design — Bradley Ross, May 2026

---

*This file is the entry point. If you need history, narrative, or counts, follow the [Reference Index](#reference-index). Keep this file ≤ ~250 lines.*
