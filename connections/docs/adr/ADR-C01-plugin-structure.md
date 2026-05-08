# ADR-C01: Plugin Structure and Manifest Schema

> **Status:** Accepted
> **Date:** 2026-05-04
> **Phase:** Connections P2 / Decompose+Architect
> **Cross-refs:** ADR-122 (Export Claude Code Markdown Bundle), ADR-C02 (SKILL.md content), ADR-C03 (Hook strategy), ADR-C06 (Shared MCP codebase)

## Context

Hey Bradley v2.0.0-RC1 ships the 8-atom AISP suite + `buildClaudeCodeBundle()` markdown exporter as pure modules, but every entry-point is a React component or Vite-bundled module — there is no programmatic surface a Claude Code user can invoke from the terminal. The connections layer adds a Claude Code plugin as the highest-priority surface (per `connections/docs/preflight.md`) so users can `/spec-init` from inside Claude Code without opening the web app. This ADR records the structural + manifest decisions; sibling ADRs C02-C07 detail content (skills/hooks/MCP/NPX/Rust).

## Decisions

### D1 — Plugin name + manifest

Plugin id is `hey-bradley` (kebab-case; sole required `plugin.json` field per A2 §1); marketplace handle is `bar181/hey-bradley` (GitHub-namespaced); manifest lives at `connections/plugin/.claude-plugin/plugin.json` and ships optional metadata `version`, `description`, `author`, `license: "MIT"`, `repository`, `homepage`, `keywords` for discovery — `name` stays the only authoritative required field.

### D2 — Component layout

Plugin root `connections/plugin/` carries the four canonical component subdirs: `skills/` (5 dirs `spec-init`/`spec-export`/`adr-new`/`ddd-map`/`sprint-plan` each with `SKILL.md` per ADR-C02), `agents/` (`spec-agent.md` skeleton only at Phase 2 — autonomous body is Phase 4+ scope), `hooks/hooks.json` (SessionStart + PreToolUse config per ADR-C03), and `.mcp.json` referencing the bundled stdio MCP server at `${CLAUDE_PLUGIN_ROOT}/mcp/server.js` (one codebase shared with standalone `connections/mcp/` per ADR-C06).

### D3 — Versioning convention

`plugin.json#version` is authoritative semver per A2 §1 ("Setting this pins the plugin to that version string"); first publish ships `0.1.0` (pre-1.0 connections layer); minor bump on functional surface change (new skill/MCP tool), patch bump on bugfix, major reserved for breaking schema changes; git tags align (`connections/v0.1.0`); `marketplace.json` entry omits `version` to avoid the silent-precedence trap A2 §4 names.

### D4 — Marketplace publish path

Self-published via GitHub (no Anthropic approval gate per A2 §4); `marketplace.json` lives at `connections/.claude-plugin/marketplace.json` (NOT repo root — keeps Hey Bradley web app the canonical root surface and scopes the marketplace to the connections layer); plugin source type `github` with `repo: "bar181/hey-bradley-core"` and `path: "connections/plugin"` via `git-subdir`; install command is `/plugin marketplace add bar181/hey-bradley-core` then `/plugin install hey-bradley@hey-bradley` (marketplace `name: "hey-bradley"`).

### D5 — Variable substitution discipline

All internal paths use `${CLAUDE_PLUGIN_ROOT}` (per A2 §1 — install dir changes on update, never persist absolute paths); persistent state (BYOK key cache, telemetry opt-in marker) writes to `${CLAUDE_PLUGIN_DATA}` (`~/.claude/plugins/data/{id}/`); `${user_config.*}` reserved for Phase 4+ tunable settings (model preference, AISP density target) — Phase 2 ships zero `userConfig` entries; never hardcode absolute paths.

### D6 — Slash command namespace

Skills are accessible via the bare `/spec-init` form (per A2 §5 — plugin-bundled skills bind to `/<skill>` directly unless name conflicts) AND the namespaced `/hey-bradley:spec-init` fallback for disambiguation when a user has a name collision; all 5 skill directories use kebab-case names matching their slug; `arguments:` frontmatter declares positional names per skill (per ADR-C02) so users get `$ARGUMENTS` plus `$<name>` ergonomics.

## Consequences

**Positive**

- Single canonical install path (`/plugin install hey-bradley@hey-bradley`) — no ambiguity for users
- `plugin.json` minimal-by-design — only `name` required, sole-source-of-truth for version, no marketplace conflict per A2 §4 trap
- Component layout matches Claude Code defaults — auto-discovery works even if `plugin.json` deleted (per A2 §1)
- Marketplace scoped to `connections/` keeps Hey Bradley web-app root unchanged (ADR-133 boundary preserved)
- `${CLAUDE_PLUGIN_ROOT}` discipline survives plugin updates without persistent-path breakage

**Negative**

- Marketplace at `connections/.claude-plugin/marketplace.json` is non-standard placement (vs repo root) — users must discover via README pointer; mitigated by adoption-doc cross-link in ADR-108
- `git-subdir` source type adds one indirection vs flat `github` source — slightly more complex for Tier-2 commercial fork scenarios
- Bare-form `/spec-init` collides with any user/project skill of same name — namespace fallback is documented but adds cognitive load

## Cross-refs

- **ADR-122** (Export Claude Code Markdown Bundle) — `spec-export` skill wraps `buildClaudeCodeBundle()` per D2
- **ADR-C02** (SKILL.md content) — defines body of the 5 skill files declared in D2
- **ADR-C03** (Hook strategy) — defines `hooks/hooks.json` shape declared in D2
- **ADR-C06** (Shared MCP codebase) — defines `.mcp.json` server path declared in D2
- **ADR-133** (v2.0.0-RC1 Open Core Boundary) — connections layer respects open-core no-new-deps discipline
- **ADR-108** (AISP Adoption Standard) — README updates point at marketplace install path

## Open questions deferred

- Skill body content + `allowed-tools` per skill — **ADR-C02**
- Hook `SessionStart` token-injection format (markdown vs JSON) — **ADR-C03**
- MCP tool definitions + SDK package naming — **ADR-C04**
- NPX command surface (`init`/`spec`/`export`/`score`) — **ADR-C05**
- Stdio vs HTTP transport split for plugin-bundled vs standalone MCP — **ADR-C06**
- AISP Rust crate vs npm `aisp-validator` validator runtime — **ADR-C07**
- Phase 4+ `userConfig` schema (model preference, density target, telemetry opt-in) — deferred
