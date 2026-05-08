# Connections Layer — Phase 6 (Log) — Post-Review

> **Phase:** Connections P6 / LOG · **Date:** 2026-05-04
> **Branch:** `swarm/connections-phase-6` (running on `swarm/connections-phase-5` working tree)
> **Predecessor base:** v2.0.0-RC1 sealed at `30c8c11`
> **Author:** CONNECTIONS-P6 / Log Closer
> **Sibling:** Phase 5 (Verify) writing `connections/docs/05-verification.md` in parallel.

## 1. Mandate recap

Build a **connections layer** that exposes Hey Bradley's spec-first workbench to AI coding tools without opening a browser. Promote as: *"The missing first step before Claude Code."* Priority order per `connections/docs/preflight.md`:

1. Claude Code plugin (highest)
2. Standalone MCP server
3. NPX `hey-bradley` CLI
4. Rust crate (`aisp-core` enhancements)

Six-phase decompose+architect+spec+build+verify+log cadence. Phase 4 split across **3 waves** + **a deferred Wave 4** (Rust crate; ADR-C07 D7 upstream cooperation policy).

## 2. What shipped — per phase

### Phase 1 (Understand)
- `connections/docs/preflight.md` (90 LOC) — mandate, agent fan-out, ≤500 LOC caps.
- `connections/docs/inventory-existing.md` (412 LOC) — A1 internal `/src/` inventory.
- `connections/docs/inventory-claude-plugin.md` (526 LOC) — A2 Claude Code plugin standard.
- `connections/docs/inventory-mcp-aisp.md` (374 LOC) — A3 MCP protocol + AISP v5.1 spec.
- `connections/docs/00-understanding.md` (300 LOC) — A4 synthesizer; 5 primary + 2 secondary open questions; **AMBER readiness verdict** with two prereqs (fetch `schema.ts` + verify SDK package naming) noted as blocking code, not ADR drafts.
- **Verdict:** Sealed at commit `0a60433`.

### Phase 2 (Decompose + Architect)
- 7 ADRs at `connections/docs/adr/` covering plugin / SKILL / hooks / MCP tools / NPX / shared MCP codebase / Rust crate scope.
- ADR LOC distribution (all ≤120 cap): C01 71, C02 78, C03 78, C04 73, C05 72, C06 57, C07 104. Sum = 533 LOC across 7 ADRs.
- **Verdict:** Sealed at commit `7f241f0`. Both AMBER prereqs from P1 §7 resolved at P4 Wave 1: SDK package naming verified (`@modelcontextprotocol/sdk@1.28.0` single combined, NOT split — see `connections/plugin/mcp/server.ts:11-16` comment block).

### Phase 3 (Spec)
- 18 AISP Crystal Atom specs at `connections/docs/specs/aisp/` across 4 categories (5 SKILL + 5 MCP + 4 NPX + 4 Rust). LOC range 56-68 each; total 1,131 LOC; every spec carries `⟦Ω⟧⟦Σ⟧⟦Γ⟧⟦Λ⟧⟦Ε⟧` block ordering per upstream AISP §B1.
- **Verdict:** Sealed at commit `003499f`. Specs serve as preflight contracts for Phase 4 implementation.

### Phase 4 (Build) — Wave 1: Plugin layer
- `connections/.claude-plugin/marketplace.json` (21 LOC) — git-subdir entry pointing at `connections/plugin`.
- `connections/plugin/.claude-plugin/plugin.json` (23 LOC) — `name: hey-bradley`, semver `0.1.0`, MIT.
- `connections/plugin/skills/` × 5 SKILL.md files (33-57 LOC each; 191 LOC total) — `spec-init`/`spec-export`/`adr-new`/`ddd-map`/`sprint-plan` per ADR-C02.
- `connections/plugin/hooks/pre-session.json` (25 LOC) — `SessionStart` matchers `startup` + `resume` per ADR-C03 D1; `clear` intentionally OMITTED.
- `connections/plugin/mcp/server.json` (10 LOC) + `server.ts` (92 LOC) — plugin-bundled stdio MCP per ADR-C06 D1; imports shared `TOOL_DEFINITIONS` from `../../mcp/tools/index.js`.
- **Verdict:** Sealed at commit `c2a7254`.

### Phase 4 (Build) — Wave 2: Standalone MCP
- `connections/mcp/index.ts` (109 LOC) — stdio default; HTTP scaffolded but **refuses to run at v0.1.0** per ADR-C06 D4 (needs Mcp-Session-Id + Origin validation + 127.0.0.1 bind hardening).
- `connections/mcp/tools/types.ts` (55 LOC) — `ToolDef`/`ToolName`/`ToolMeta`/`ToolError` + `detectByokLeak()` defence-in-depth scanner.
- `connections/mcp/tools/index.ts` (25 LOC) — barrel exporting `TOOL_DEFINITIONS: ToolDef[5]`.
- `connections/mcp/tools/{get-spec,get-claude-md,validate-aisp,get-ddd,get-agent-scopes}.ts` (56-78 LOC each; 363 LOC total) — 5 tool handlers; **all stamped `v0.1.0 STUB` for live web-app API wire deferred to v0.2.0+ per CF#4**.
- `connections/mcp/package.json` (17 LOC), `tsconfig.json` (25 LOC), `README.md` (72 LOC).
- **Verdict:** Sealed at commit `81c8a6b`. Wave 2 publish-blocker recorded in `README.md:57-62` (extension-less relative imports compile clean under bundler resolution but raw Node ESM needs `.js`).

### Phase 4 (Build) — Wave 3: NPX CLI
- `connections/npx/bin/cli.ts` (81 LOC) — 4-command dispatcher (`init`/`spec`/`export`/`score`) + `--help` + `--version`.
- `connections/npx/commands/{init,spec,export,score,utils}.ts` (64-88 LOC each; 388 LOC total) — per ADR-C05 D2-D5; `score` exit codes 0/1/2 are the load-bearing CI primitive per ADR-C05 D5.
- `connections/npx/package.json` (20 LOC), `tsconfig.json` (18 LOC), `README.md` (75 LOC).
- Compiled `dist/` artifacts present (committed for Wave 4 reuse) — 6 `.js` files mirroring source layout.
- **Verdict:** Sealed at commit `0ddcf0b` (10 files / 585 LOC). Same publish-blocker class as Wave 2 inherited via tsc bundler resolution.

### Phase 4 (Build) — Wave 4: Rust crate (DEFERRED)
- ADR-C07 D7 upstream contribution policy: open issue/PR upstream `bar181/aisp-open-core` first; if accepted upstream, Hey Bradley imports + bumps pin; if declined, ship as Hey-Bradley fork at `connections/aisp-core/`. **60-day window** before fork ships.
- D2-D5 surfaces (`build_crystal_atom` / `extract_ddd_contexts` / `format_claude_md` / `ambig_diff`) all scoped as upstreamable.
- WASM bundle target: ≤500KB compressed binary-size budget.
- **Verdict:** Deferred per ADR-C07 D7 — Wave 4 starts after upstream cycle clears OR 60-day timeout fires.

## 3. File counts + LOC totals (across `connections/` tree)

| Layer | Files | LOC | Notes |
|-------|-------|-----|-------|
| `docs/` (P1 outputs) | 5 | 1,702 | preflight + 3 inventories + understanding |
| `docs/adr/` (P2) | 7 | 533 | C01..C07 — all ≤120 cap |
| `docs/specs/aisp/` (P3) | 18 | 1,131 | 5 SKILL + 5 MCP + 4 NPX + 4 Rust |
| `plugin/` (P4 W1) | 9 | 362 | manifests + 5 skills + hooks + 2 MCP files |
| `mcp/` (P4 W2) | 11 | 638 | tools/ subset + index + package + readme + tsconfig |
| `npx/` (P4 W3) | 11 | 695 | bin + 5 commands + package + readme + tsconfig (source only; `dist/` excluded from this count) |
| **Total (source/docs)** | **61** | **5,061** | |

ESM `dist/` artifacts in `npx/` add 6 files / 437 LOC compiled — recorded for completeness but not part of the auditable source surface.

## 4. ADR cross-ref map

| ADR | Title | Wires | Cross-refs |
|-----|-------|-------|------------|
| C01 | Plugin Structure + Manifest | `plugin/.claude-plugin/plugin.json` + `marketplace.json` | ADR-122, ADR-133, ADR-108 + C02/C03/C06 |
| C02 | SKILL.md Content Strategy | 5 SKILL.md files | ADR-119/120/122 + C01/C04 |
| C03 | Hook Strategy + Size | `plugin/hooks/pre-session.json` | ADR-122/053/126 + C01/C02/C04 |
| C04 | MCP Tool Definitions | 5 tool handlers | ADR-122/126/043/114/120/119 + C02/C06/C07 |
| C05 | NPX Command Surface | 4 CLI commands | ADR-122/114/043/101/126 + C04/C07 |
| C06 | Shared MCP Codebase | `tools/` barrel | ADR-126 + C01/C04/C05/C07 |
| C07 | AISP Rust Crate | (deferred) | ADR-122/134/119/120 + C04/C05/C06 |

## 5. Honest gaps surfaced

### G1 — ESM `.js` extension publish-blocker (`mcp/README.md:57-62`)
B4 sources at `connections/mcp/tools/*.ts` use extension-less relative imports (`from './types'`); compiles clean under tsc `bundler` module resolution but raw Node ESM at runtime requires `.js` on relative specifiers. **Pre-publish requires either post-build extension rewrite OR coordinated Wave 1 source touch-up.** tsc strict gate is GREEN; runtime publish to npm is currently RED.

### G2 — `v0.1.0 STUB` markers across all 5 MCP tool handlers
Every `connections/mcp/tools/*.ts` handler returns deterministic placeholder output. Live web-app API wire (which would invoke the 8-atom pipeline through the real `src/lib/specGenerators/` + `buildClaudeCodeBundle()` chain) is gated on **owner BYOK activation per CF#4**. Plan for v0.2.0: wire each handler to the corresponding pure-module source after first owner BYOK smoke run.

### G3 — NPX `spec --prompt` writes a placeholder, not a generated spec (`npx/commands/spec.ts:10-26`)
Mirror of G2 on the CLI side. `--prompt` mode emits `buildPlaceholder()` markdown with TODO stubs. Validation mode (`npx hey-bradley spec` without `--prompt`) DOES run the deterministic `scoreAisp()` against existing `.heybradley/spec.aisp` — so the `score` command and `spec` re-validate path are real, but `spec --prompt` is stub.

### G4 — HTTP transport refuses to run at v0.1.0 (`mcp/index.ts:94-102`)
ADR-C06 D4 hardening (Mcp-Session-Id + Origin validation + 127.0.0.1 bind) deferred to v0.2.0+. Standalone server explicitly `process.exit(1)` if `--transport http` is passed. stdio works for Cursor / Continue / Cline / Claude Desktop today.

### G5 — Wave 4 Rust crate not landed
ADR-C07 D2-D5 (`build_crystal_atom` / `extract_ddd_contexts` / `format_claude_md` / `ambig_diff`) all deferred per D7 upstream coordination policy. `validate_aisp` MCP tool currently uses local fallback scorer (see `npx/commands/score.ts` for the implementation that the MCP tool will ALSO converge on once Rust ships); cross-platform parity will land at Wave 4.

### G6 — `log_events` CHECK enum lacks `tool_call` slot
ADR-C04 D6 declares every tool emits a `tool_call` event_type to log_events on every invocation, but Hey Bradley's `migrations/005-comprehensive-logs.sql` CHECK enum was finalized at P107 (15 values; 100% covered for the v2.0.0-RC1 surface) and does NOT include `tool_call`. Carry-forward: migration 006 candidate to widen the enum when MCP tools wire into the real `writeLogEvent()` pipeline (post owner BYOK).

### G7 — Resources + Prompts MCP capabilities deferred (00-understanding §6 secondary #7)
Phase 1 captured Tools as the load-bearing surface; Resources (file-like data; could expose AISP bundle as Resource) + Prompts (templated workflows; could expose `/spec` body) were noted as deferrable. Still deferred at v0.1.0; revisit at v0.2.0+ if downstream consumers ask.

### G8 — Live LLM/MCP integration testing absent at this seal
v0.1.0 has tsc strict GREEN on both `mcp/` and `npx/` configs (per `connections/plugin/mcp/server.ts:11-16` finding) but **no end-to-end stdio handshake test against a real MCP client has run**. CF#4 owner BYOK smoke is the gate for first live test (no integration asserts at v0.1.0 seal).

## 6. Acceptance gate status

Phase 5 (Verify) sibling owns `connections/docs/05-verification.md` writing in parallel to this seal. **At time of authorship, no `05-verification.md` exists on disk** (verified 2026-05-04). This Phase 6 record cites Phase 5's outputs as **PENDING — will be cross-linked once Phase 5 lands**.

Self-asserted gates from this Phase 6 perspective (Phase 5 may agree, refine, or contest):

- All 7 ADRs Accepted with cross-refs intact: **PASS**
- All 18 AISP specs ship the `⟦Ω⟧⟦Σ⟧⟦Γ⟧⟦Λ⟧⟦Ε⟧` ordering: **PASS** (per Phase 3 SEAL commit `003499f`)
- Plugin manifest JSON schema-validates: **NOT VERIFIED IN P6** (Phase 5 to confirm)
- MCP server stdio handshake against `@modelcontextprotocol/sdk@1.28.0`: **NOT VERIFIED IN P6** (Phase 5 to confirm)
- NPX `hey-bradley score` exit codes correct: **NOT VERIFIED IN P6** (Phase 5 to confirm)
- BYOK-leak detector blocks `sk-`/`AIza`/`Bearer ` shapes: **PASS BY INSPECTION** (`mcp/tools/types.ts:46-55`)
- ESM publish-blocker resolved: **FAIL** (G1; carry-forward to Wave 1/B4 source touch-up)
- Wave 4 Rust crate landed: **DEFERRED** (G5; ADR-C07 D7 60-day window)

## 7. Carry-forward registry

| ID | Item | Owner | Trigger |
|----|------|-------|---------|
| CN-1 | ESM `.js` extension touch-up across `mcp/tools/*.ts` (G1) | Wave 1/B4 follow-up | Pre-npm-publish |
| CN-2 | Wire 5 MCP tool handlers to real pure modules (G2) | v0.2.0 | Owner BYOK smoke (CF#4) |
| CN-3 | Wire NPX `spec --prompt` to real spec generators (G3) | v0.2.0 | Owner BYOK smoke (CF#4) |
| CN-4 | Harden HTTP transport (G4) | v0.2.0+ | Hosted team-shared use case requested |
| CN-5 | Wave 4 Rust crate ship (G5) | v0.2.0+ | Upstream PR landing OR 60-day timeout |
| CN-6 | Migration 006 — `log_events.event_type += 'tool_call'` (G6) | v0.2.0 | Concurrent with CN-2 |
| CN-7 | Resources + Prompts MCP capabilities (G7) | v0.2.0+ | Downstream consumer ask |
| CN-8 | Live MCP handshake integration test (G8) | v0.2.0 | Owner BYOK smoke (CF#4) |
