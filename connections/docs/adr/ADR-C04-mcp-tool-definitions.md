# ADR-C04: MCP Tool Definitions

> **Status:** Accepted
> **Date:** 2026-05-04
> **Phase:** Connections P2 / Decompose+Architect
> **Cross-refs:** ADR-122 (Export Claude Code Markdown Bundle), ADR-126 (Comprehensive LLM Interaction Logging), ADR-C02 (SKILL.md content), ADR-C06 (Shared MCP codebase), ADR-C07 (AISP Rust crate scope)

## Context

The connections layer exposes Hey Bradley's pure-module subset (8 Crystal Atoms + `buildClaudeCodeBundle()` + spec generators) as MCP tools so Claude Code, Cursor, and other MCP-aware clients can drive the spec factory programmatically. ADR-C02 defines five plugin-bundled skills (`spec-init`, `spec-export`, `adr-new`, `ddd-map`, `sprint-plan`); each skill reaches for exactly one MCP tool to do the load-bearing work — a 1-1 mapping that makes failure modes legible and lets `inventory-existing.md §4` shape contracts flow through unchanged. This ADR records the five tool names, their input/output schemas, error semantics, and the BYOK + LLM-handoff conventions shared across all of them.

## Decisions

### D1 — `get_spec`

Generates a Hey Bradley AISP-compliant spec from a plain-text project description. **inputSchema:** `{ description: string (10-4000 chars, REQUIRED), include_aisp: boolean (default true), tier_target: enum("bronze","silver","gold","platinum", default "silver") }`. **outputSchema (sketch):** `{ slug, humanSpec, northStar, sadd, implementationPlan, aisp[], tier, ambig, density }` — exact field set finalized in Phase 4 once the spec-generator pure modules at `src/lib/specGenerators/` (`inventory-existing.md §6`) are wrapped. **Errors:** description shorter than 10 chars → JSON-RPC `-32602 invalid params`; spec generation timeout → result with `isError: true` + text content describing the failure (per `inventory-mcp-aisp.md §A2` two-channel model). This is the on-ramp tool every other skill chains off of; it backs the `/spec-init` skill.

### D2 — `get_claude_md`

Converts a stored spec into a CLAUDE.md markdown bundle per ADR-122. **inputSchema:** `{ spec_id: string (REQUIRED), include_atoms: boolean (default true), include_adrs: boolean (default true) }`. **outputSchema:** mirrors the existing `ExportClaudeCodeBundle` interface at `src/contexts/specification/exportClaudeCode.ts:28` — `{ markdown: string, files: { path, content }[], slug: string, filename: string }` — the connections layer wraps `buildClaudeCodeBundle(phase, projectSlug?, onEmit?)` (line 203) without modifying its contract per ADR-122 D3 (atom-pure preserved). **Errors:** unknown `spec_id` → `-32602`. Bundle remains canonical Hey Bradley OUTPUT per ADR-122 D3 — downstream MCP client reads bundle and writes implementation in their own repo. Backs `/spec-export`.

### D3 — `validate_aisp`

Scores AISP Crystal Atom text — returns δ density + Ambig + tier. **inputSchema:** `{ aisp_text: string (REQUIRED), target_tier: enum (optional) }`. **outputSchema:** `{ density: number, ambig: number, tier: enum("Platinum","Gold","Silver","Bronze","Reject"), parse_total: int, parse_unique: int, errors: string[] }` — fields mirror the upstream `validate ≜ ⌈⌉ ∘ δ ∘ Γ? ∘ ∂` pipeline (`inventory-mcp-aisp.md §B2`). **Errors:** unparseable AISP returns soft error inside the result (`tier: "Reject"`, `ambig: 1.0`, `errors[]` populated) rather than JSON-RPC error — validation failures are semantic, not protocol failures. **Validator runtime path is deferred to ADR-C07** (npm `aisp-validator` vs Rust `aisp` crate vs WASM bundle) — this ADR fixes only the tool surface, not the implementation. Backs `/sprint-plan` density gate.

### D4 — `get_ddd`

Runs DDD_ATOM over a project description or stored spec; returns bounded contexts + relationships. **inputSchema:** `{ source: { type: enum("description","spec_id"), value: string } }` (single discriminated-union field; both branches REQUIRED). **outputSchema:** mirrors the `DomainModel` interface at `src/contexts/intelligence/aisp/dddAtom.ts:59` — `{ contexts: { name, role, description }[], relationships: { from, to, kind, rationale }[] }` where `kind ∈ partnership|customer-supplier|conformist|anti-corruption-layer` per ADR-119 Γ R4. Wraps `classifyContexts()` (line 15) → `toDomainModel()`. **Errors:** unknown `spec_id` → `-32602`; description shorter than 10 chars → `-32602`. Backs `/ddd-map`.

### D5 — `get_agent_scopes`

Runs AGENT_ATOM over a sprint scope description; returns wave structure with disjoint-ownedFiles agent specs. **inputSchema:** `{ sprint_scope: string (REQUIRED), wave_count: int (optional, default 2, max 5) }`. **outputSchema:** `{ waves: { id, agents: { role, scope, ownedFiles[], dod[] }[] }[] }` — mirrors `AgentSpec` at `src/contexts/intelligence/aisp/agentAtom.ts:31` with the AISP Σ contract per ADR-120 (Γ R1 |agents| ≤ 7 + Γ R3 disjoint `ownedFiles` per wave + Ε V1 disjoint-ownedFiles invariant). Wraps `classifyAgents(WaveContext)` (line 49). **Errors:** `wave_count > 5` → `-32602`; empty `sprint_scope` → `-32602`; classifier produces overlapping `ownedFiles` → result with `isError: true` (defensive — Ε V1 invariant violation is a tool-level semantic failure). Backs `/sprint-plan`.

### D6 — Common conventions

All five tools share these contracts: **(a) Transport** — stdio for the plugin-bundled MCP server (per `inventory-mcp-aisp.md §A1` *"Clients SHOULD support stdio whenever possible"*); HTTP variant deferred to ADR-C06. **(b) Session correlation** — every tool accepts an optional `_meta.session_id` field at the top of `params` so callers can correlate tool calls into the existing 3-level ID hierarchy (`session_id → request_id → event_id`) per ADR-126 D2; tool emits a `tool_call` row to `log_events` on every invocation, `redactKeyShapes()` applied on inputs AND outputs at the write boundary per ADR-126 D3 + ADR-043 + ADR-114 D3. **(c) Two-channel error model** — JSON-RPC `error` for protocol failures (unknown tool, malformed params, missing required fields); result `isError: true` for semantic failures (atom couldn't classify, validation rejected the input, invariant violated); the channels are not interchangeable per `inventory-mcp-aisp.md §A2`. **(d) BYOK trust boundary** — tool inputs and outputs MUST NOT carry `sk-`, `AIza`, or `Bearer ` shapes; server-side validator strips/rejects on detection (defence-in-depth — clients should not be passing keys via tool args). **(e) LLM-handoff inert at v0.1.0** — atoms expose `buildXAtom()` + `parseXResponse()` paths but they are scaffolded inert per CF#4 (`inventory-existing.md §What's-Missing #6`); v0.1.0 tools use the deterministic `classifyX()` baseline only. Live-LLM activation via owner BYOK runtime lands in connections layer Phase 4+.

## Consequences

**Positive**

- 5 tools map 1-1 to the 5 ADR-C02 skills — failure modes are legible, no skill needs to chain multiple tools at v0.1.0
- Output schemas mirror existing pure-module interfaces (`ExportClaudeCodeBundle`, `DomainModel`, `AgentSpec`) — zero net new contract surface; Phase 4 implementation reuses src/ shapes verbatim
- Two-channel error model (per `inventory-mcp-aisp.md §A2`) keeps protocol-failure vs semantic-failure separation legible to MCP clients
- `_meta.session_id` plus existing `redactKeyShapes()` reuses ADR-126 logging pipeline without schema churn — log_events CHECK enum needs a `tool_call` slot at Phase 4 (carry-forward, not a P2 ADR change)
- Validator runtime decoupled (D3 → ADR-C07) — tool surface stable across npm/Rust/WASM choice

**Negative**

- 1-1 skill-to-tool mapping increases coupling — adding a sixth skill needs a sixth tool unless an existing one widens (mitigated by skill-side composition in v1.0+)
- Tool-output schemas are sketches — exact field set finalized at Phase 4 prereq (fetch MCP TS SDK `package.json` + `schema.ts` per `00-understanding.md §7` AMBER prereqs); ADR text uses "(sketch)" / "see Phase 4" markers per the brief
- LLM-handoff inert means v0.1.0 cannot enrich classifier output with live-LLM judgment — owner-required BYOK activation is the gate (CF#4)
- `validate_aisp` softer error model (semantic failure inside result) is less ergonomic than JSON-RPC error for MCP clients that branch on protocol errors only — documented for plugin authors

## Cross-refs

- **ADR-122** — `get_claude_md` wraps `buildClaudeCodeBundle()` without modifying its contract
- **ADR-126** — `_meta.session_id` correlates tool calls into existing log pipeline; `redactKeyShapes()` on inputs/outputs
- **ADR-C02** — defines the 5 skills these tools back; tool-name-to-skill-name mapping is intentional 1-1
- **ADR-C06** — shared MCP codebase serves both stdio (plugin) and HTTP (standalone) deployments of these 5 tools
- **ADR-C07** — fixes `validate_aisp` validator runtime (npm/Rust/WASM)
- **ADR-043** + **ADR-114 D3** — BYOK trust boundary applies at every tool input/output
- **ADR-120** — AGENT_ATOM Σ/Γ contract (|agents| ≤ 7, disjoint ownedFiles) drives `get_agent_scopes` outputSchema
- **ADR-119** — DDD_ATOM 4 relationship kinds drive `get_ddd` outputSchema enum

## Open questions deferred

- `validate_aisp` validator runtime (npm `aisp-validator` vs Rust `aisp` crate vs WASM bundle) — **ADR-C07**
- MCP TS SDK package naming (`@modelcontextprotocol/sdk` single combined vs `@modelcontextprotocol/server` + `/client` split) — Phase 4 prereq fetch from `github.com/modelcontextprotocol/typescript-sdk` (`00-understanding.md §7` AMBER)
- MCP `initialize` handshake payload field schema — Phase 4 prereq fetch from `github.com/modelcontextprotocol/specification/blob/main/schema/2025-11-25/schema.ts`
- `log_events` CHECK enum addition for `tool_call` event_type — Phase 4 carry-forward (migration 006 candidate)
- Live-LLM enrichment via `buildXAtom()/parseXResponse()` paths — owner-required BYOK runtime activation (CF#4)
- Resources + Prompts MCP capabilities (file-like data; templated workflows) — deferred per `00-understanding.md §6` secondary open item #7
