# ADR-C06: Shared MCP Codebase Strategy

> **Status:** Accepted
> **Date:** 2026-05-04
> **Phase:** Connections P2 / Decompose+Architect
> **Cross-refs:** ADR-126 (Comprehensive LLM Interaction Logging), ADR-C01 (Plugin structure), ADR-C04 (MCP tool definitions), ADR-C05 (NPX surface), ADR-C07 (AISP Rust crate scope)

## Context

Hey Bradley's connections layer ships **two MCP deployment targets**: a plugin-bundled stdio server inside the Claude Code plugin (per ADR-C01 / `connections/plugin/.mcp.json`) and a standalone server (`connections/mcp/`) that supports both stdio (Cursor + IDE-agnostic) and HTTP (hosted team-shared) transports per A3 §A1. The MCP spec explicitly supports both transports on the same JSON-RPC tool surface, and A2 §1 lets the plugin manifest reference any local MCP via `mcpServers` / `${CLAUDE_PLUGIN_ROOT}` substitution. If the two surfaces drift, tool definitions diverge, schemas fall out of sync, and the BYOK + logging contracts (ADR-126) get duplicated. This ADR pins the codebase to a single source of truth for tool definitions and decides how the build outputs split.

## Decisions

### D1 — One codebase, two transports

A single tool-definition module at `connections/mcp/tools/` exports `TOOL_DEFINITIONS: ToolDef[]` covering all 5 tools per ADR-C04 (`get_spec` / `get_claude_md` / `validate_aisp` / `get_ddd` / `get_agent_scopes`); the plugin-bundled MCP at `connections/plugin/mcp/server.ts` imports this module and starts stdio transport per A3 §A1 ("Clients SHOULD support stdio whenever possible"); the standalone MCP at `connections/mcp/index.ts` imports the SAME module and selects stdio OR Streamable HTTP transport at runtime via CLI flag / env var per D4; tool schemas, handlers, and result content types stay byte-equivalent across both surfaces.

### D2 — Tool registration pattern

Each tool exports `{ name, description, inputSchema, outputSchema, handler }` from its own file under `connections/mcp/tools/<tool-name>.ts` (one tool per file; per ADR-C04 §D2); a barrel index at `connections/mcp/tools/index.ts` aggregates the 5 tools into the `TOOL_DEFINITIONS` array; both transport entry-points register identically by iterating `TOOL_DEFINITIONS` and calling `server.registerTool(toolDef.name, toolDef, toolDef.handler)` per the MCP TS SDK API verified in inventory §3.5; handlers contain ZERO transport-specific logic — no `req.headers`, no stdin/stdout writes, no HTTP response shaping; transport adapters own all envelope concerns.

### D3 — Build outputs

Plugin path compiles in-place: TS source in `connections/plugin/mcp/` is built by the plugin's own `npm run build` (or shipped as ESM-with-types if Claude Code's plugin runtime supports it directly), with `${CLAUDE_PLUGIN_ROOT}/mcp/server.js` as the resolved entry per A2 §1 substitution; standalone path publishes as `hey-bradley-mcp` npm package (sibling to the main `hey-bradley` CLI per ADR-C05 — distinct binary, distinct install) launched via `npx hey-bradley-mcp` or pinned `npm i -g hey-bradley-mcp`; both build paths share `connections/mcp/tools/` as their single source of truth (one file edited, both surfaces reflect it after rebuild — no copy-paste, no drift).

### D4 — Transport selection (standalone only)

Standalone defaults to **stdio** (matches plugin behavior; works in any IDE that pipes stdin/stdout — Cursor, Continue, Cline, Claude Desktop) per A3 §A1 preference; HTTP mode opts in via `--transport http --port 3737` CLI flag OR `MCP_TRANSPORT=http` + `MCP_PORT=3737` env vars; HTTP mode honors A3 §A1 Streamable HTTP requirements — `Mcp-Session-Id` header for session tracking, `MCP-Protocol-Version: 2025-06-18` echo on every request, `Accept: application/json, text/event-stream`, and `Origin` validation + `127.0.0.1` bind by default to mitigate DNS rebinding; HTTP target use case is hosted team-shared spec generation (multi-IDE agents calling one MCP server); HTTP transport ships in **v0.2.0+** of the standalone package — v0.1.0 is stdio-only to keep the MVP surface tight.

### D5 — Versioning + compatibility

Both surfaces ship the same `tools-version` constant (semver-coupled to the connections-layer release tag); tool schema changes are versioned — adding an optional input field is a minor bump, removing or renaming any field is a major bump per the MCP `tools/list_changed` capability semantics in A3 §A3; the plugin's `plugin.json` (per ADR-C01 D3) declares a min `mcp-tools-version` it expects via a custom metadata field; the standalone server advertises its version on the `tools/list` response (server `serverInfo.version` per the MCP initialize handshake) so clients can detect drift; mismatched versions log a warning via `writeLogEvent` (D6) but do NOT hard-block tool calls — graceful degradation honors A3's "Tool execution errors" two-channel model rather than failing the JSON-RPC envelope.

### D6 — Logging + observability

All MCP tools call `writeLogEvent` per ADR-126 when running inside the Hey Bradley web-app context (browser sql.js DB present); standalone npm package writes to local `.heybradley/log.json` per ADR-C05 D6 since sql.js is browser-only and the standalone runtime is Node; both paths use `redactKeyShapes()` per ADR-043 + ADR-114 D3 at every write boundary so `sk-` / `AIza` / `Bearer ` token shapes never reach disk; BYOK boundary is strict — `_meta.session_id` correlation per A3 §A2 annotations is opt-in (caller must pass it) and NEVER persists API keys to either log surface; fire-and-forget contract per ADR-126 D4 wraps every log write in try/catch so a logging failure cannot escape into the JSON-RPC error channel.

## Consequences

**Positive**

- Single source of truth for tool definitions — one edit, both surfaces reflect it after rebuild; eliminates the drift class P106/ADR-134 had to clean up post-fact for atom→view inversion
- Plugin-bundled stdio + standalone stdio + standalone HTTP all share the same handlers — BYOK + logging contracts authored once, audited once
- Cursor / Continue / Cline / Claude Desktop all work via standalone stdio without per-IDE adaptation; hosted team-shared use case unlocked by HTTP without forking the codebase
- Tool schema bumps are visible in BOTH the plugin manifest declaration AND `tools/list serverInfo.version`, so version drift surfaces at handshake time, not at first failed call

**Negative**

- Two build outputs (plugin in-place compile + standalone npm package) means CI matrix doubles and release coordination is required; mitigated by treating `connections/mcp/tools/` as the canonical source and gating release on both builds passing
- HTTP transport adds DNS-rebinding + Origin validation surface area not present in stdio; deferring HTTP to v0.2.0+ keeps v0.1.0 surface auditable
- Plugin-bundled MCP cannot use HTTP (Claude Code plugin runtime is stdio-only per A2 §1 `mcpServers` semantics); acceptable since plugin already runs in-process with the user's Claude Code session

## Open questions deferred

1. **MCP TS SDK package name** — Phase 4 prereq fetch per inventory §3.5; once SDK package naming is verified (`@modelcontextprotocol/sdk` single combined vs split server/client), both surfaces install the same dep at the same pinned version
2. **HTTP transport hardening for team-shared use** — v0.2.0+ scope: rate-limiting, auth strategy (none vs shared-secret vs OAuth), CORS allowlist, multi-tenant session isolation if more than one team shares one server; v0.1.0 ships HTTP behind an explicit `--transport http` opt-in flag for solo hosted use only
3. **Tool schema migration tooling** — when D5 major-bump fires, do we ship a `migrate-mcp-tools` CLI helper or rely on the version mismatch warning alone? Deferred to first real schema change.
