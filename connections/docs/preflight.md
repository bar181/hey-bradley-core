# Connections Layer — Phase 1 (Understand) Preflight

> **Phase:** Connections P1 / UNDERSTAND · **Date:** 2026-05-04
> **Branch:** `swarm/connections-phase-1`
> **Predecessor:** v2.0.0-RC1 sealed at `30c8c11` on `claude/verify-flywheel-init-qlIBr`

## Mandate

Build a **connections layer** that exposes Hey Bradley's spec-first workbench to AI coding tools without opening a browser. Promote as: *"The missing first step before Claude Code."*

Priority order:
1. **Claude Code plugin** (highest) — slash commands, skills, hooks, bundled MCP
2. **MCP server (standalone)** — Cursor + others; shares tool definitions with plugin
3. **NPX package** — `npx hey-bradley init/spec/export/score`
4. **Rust crate** — `aisp-core` enhancements (Crystal Atom builder, DDD extractor, CLAUDE.md formatter, ambiguity diff)

## Phase 1 deliverable

`connections/docs/00-understanding.md` — honest inventory:
- What exists in `/src/` (Crystal Atoms, MasterConfig, pipeline, exports) with file:line citations
- What gaps exist (no aspirational claims)
- External knowledge needed (Claude Code plugin format, MCP protocol, AISP v5.1 symbols)
- Constraints (token budgets, hook size, AISP δ < 0.05 ambiguity target)

## Phase 1 agents (3 parallel + 1 synthesizer)

### A1 — Internal inventory (`/src/` + ADRs)
**Output:** `connections/docs/inventory-existing.md` (≤400 LOC)

Scope:
- 8 Crystal Atoms surface (PATCH/INTENT/SELECTION/CONTENT/ASSUMPTIONS/DECOMP/PROCESS/DDD/AGENT) — exports, pure-module discipline, where wired
- MasterConfig schema (`src/lib/schemas/`)
- chatPipeline + listenPipeline entry points
- Export surfaces: markdown bundle (`exportClaudeCode.ts`), static HTML, JSON, AISP versioned filename pattern
- Three modes: Whiteboard / Planning / Agentics — what each owns
- Spec generators (humanSpec / north-star / SADD / implementation-plan / process-map / agent waves)
- Persistence layer: log_events + edit_history (post-P107: 15-value enum 100% covered)
- Existing ADRs to read: ADR-120 (AGENT_ATOM), ADR-122 (Export Claude Code markdown bundle), ADR-126 (Comprehensive logging), ADR-131 (Agentic Workbench RC), ADR-133 (v2.0.0-RC1 boundary)

### A2 — External: Claude Code plugin reference
**Output:** `connections/docs/inventory-claude-plugin.md` (≤400 LOC)

WebFetch sources:
- `https://code.claude.com/docs/en/plugins-reference` — plugin.json manifest schema
- `https://docs.claude.com/en/docs/claude-code/skills` — SKILL.md format
- `https://docs.claude.com/en/docs/claude-code/hooks-guide` — hook events + schema
- `https://docs.claude.com/en/docs/claude-code/plugin-marketplaces` — marketplace structure

Capture:
- plugin.json required + optional fields
- SKILL.md frontmatter contract + body conventions
- Hook event names (pre-session, post-tool, etc.) + payload shapes
- Marketplace publish flow + URL structure
- Slash command naming + invocation pattern

### A3 — External: MCP protocol + AISP v5.1
**Output:** `connections/docs/inventory-mcp-aisp.md` (≤400 LOC)

WebFetch sources:
- `https://modelcontextprotocol.io/specification` — MCP protocol spec
- `https://modelcontextprotocol.io/quickstart/server` — server quickstart
- `https://modelcontextprotocol.io/docs/concepts/transports` — stdio vs HTTP
- `https://github.com/bar181/aisp-open-core` — README + AI_GUIDE.md (AISP v5.1 symbols, δ scoring)

Capture:
- MCP transports (stdio for plugin / HTTP for hosted)
- Tool schema (name + description + inputSchema + outputSchema)
- JSON-RPC envelope shape
- Error response conventions
- AISP v5.1 Crystal Atom Σ Γ Λ Ε structure
- δ ambiguity score formula + target (< 0.02 for production specs; < 0.05 acceptable)
- aisp-validator CLI surface (if exists)

### A4 — Synthesizer (Wave 2; sequential after A1-A3)
**Output:** `connections/docs/00-understanding.md` (≤500 LOC)

Merge A1+A2+A3 into single understanding document with sections:
1. Executive summary (3-4 sentences)
2. What exists (from A1)
3. External standards (from A2 + A3)
4. Gaps + constraints (honest)
5. Phase 2 inputs (what ADR-C01..ADR-C07 will need to decide)

## Hard rules

1. RESEARCH ONLY — no source code modifications anywhere
2. WebFetch agents must cite source URLs in their inventory
3. Internal inventory must cite file:line for every claim
4. ≤400 LOC per inventory file; ≤500 LOC for synthesizer
5. NO aspirational claims — only what's actually present in repo or external spec
