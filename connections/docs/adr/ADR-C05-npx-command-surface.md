# ADR-C05: NPX Command Surface

> **Status:** Accepted
> **Date:** 2026-05-04
> **Phase:** Connections P2 / Decompose+Architect
> **Cross-refs:** ADR-122 (Export Claude Code Markdown Bundle), ADR-114 (Tier-2 boundary; sql.js browser-only), ADR-043 (BYOK trust boundary), ADR-101 (Spec Export Quality / AISP versioned filenames), ADR-126 (Comprehensive logging fire-and-forget contract), ADR-C04 (MCP tool definitions), ADR-C07 (AISP validator runtime)

## Context

Hey Bradley v2.0.0-RC1 ships pure exporters (`buildClaudeCodeBundle()` per ADR-122; 6 spec generators at `src/lib/specGenerators/`; AISP versioned filenames per ADR-101) but `package.json` has no `"bin"` entry and `dist/` is a Vite SPA build, not a library — there is **no terminal-invocable surface** for AI-coding-tool users who want to scaffold/refresh/export/score a Hey Bradley spec without opening the web app (Phase-1 understanding §1.3 #2). The connections layer adds an NPX package as the third priority surface (per `connections/docs/preflight.md`) — slot below the Claude Code plugin (ADR-C01) and standalone MCP server (ADR-C06) but above the Phase-4 Rust-crate scope (ADR-C07). This ADR records the four-command surface, scaffold layout, and CI-friendly exit-code contract.

## Decisions

### D1 — Package name + invocation

Package name `hey-bradley` (unscoped; falls back to `@bar181/hey-bradley` if the unscoped name is unavailable on npm); invocation is `npx hey-bradley <command> [flags]` — zero global install required (per A1 §1.3 #2 — no `"bin"` exists today; this ADR establishes one); `package.json#bin` points at `dist/cli.js`; Node 18+ LTS hard floor (matches Hey Bradley web-app baseline + MCP TS SDK requirement); published tarball ≤2MB target (per preflight) — atoms-pure subset only, no React/Vite runtime; license MIT to match repo.

### D2 — `init` command

Purpose: scaffold `.heybradley/` directory in project root for a fresh consumer project. Files created: `.heybradley/spec.aisp` (empty placeholder ready for `/spec-init` or web-app paste), `.heybradley/config.json` (`{ projectName, tierTarget: "silver"|"gold"|"platinum", version: "0.1.0" }`), `.heybradley/.gitignore` (excludes `log.json` + any local SQLite cache so logs stay out of version control). Idempotent: skip if `.heybradley/` exists with a one-line warning; `--force` overwrites; `--name <slug>` sets `projectName` directly (skips prompt); writes are atomic (temp-file + rename). No network calls — fully offline.

### D3 — `spec` command

Purpose: generate spec from prompt OR refresh + re-validate existing spec. Usage `npx hey-bradley spec --prompt "describe project" [--tier silver|gold|platinum] [--offline] [--output <path>]`. Behavior: if `--prompt` provided → calls web-app API (default) or local rules-only classifier (when `--offline` set or web app unreachable) and writes `.heybradley/spec.aisp`; if no `--prompt` → re-validates existing `.heybradley/spec.aisp` and prints `δ` density + `Ambig` ambiguity + tier symbol per ADR-C07 validator runtime. `--tier` defaults silver; `--output` overrides default `.heybradley/spec.aisp` write path. AISP filename pattern follows ADR-101 D3 versioned suffix when `--output` ends in `.txt` (e.g. `myproject-aisp-v1.txt`). Offline-mode rules-only classifier scope deferred to Phase 4.

### D4 — `export --claude-code` command

Purpose: convert `.heybradley/spec.aisp` into a Claude Code markdown bundle per ADR-122. Usage `npx hey-bradley export --claude-code [--output ./CLAUDE.md] [--phase <id>]`. Output is a single markdown file with `# === FILE: <path> ===` markers (mirrors `buildClaudeCodeBundle()` from `src/contexts/specification/exportClaudeCode.ts:203` — same emitter, repackaged for Node) — ≥6 logical files: CLAUDE.md preamble + process map + human spec + AISP spec + ADR refs + agent waves. Default output path `./CLAUDE.md` in cwd (NOT `.heybradley/CLAUDE.md` — bundle is project-root surface for downstream Claude Code consumers per ADR-122 D3). Future flags `--zip` and `--directory` deferred to Tier-2 per ADR-122 D2 (markdown bundle is canonical at open-core; ZIP/directory split adds File System Access dep which violates ADR-114 + ADR-133 no-new-deps). `--phase` selects specific PhaseCard when multiple exist (default: latest sealed).

### D5 — `score` command

Purpose: score current `.heybradley/spec.aisp` and emit `δ` density + `Ambig` ambiguity + tier verdict; CI-friendly via deterministic exit codes. Usage `npx hey-bradley score [--strict] [--json]`. Behavior: calls aisp-validator per ADR-C07 chosen runtime (npm `aisp-validator` / Rust `aisp` crate / WASM bundle — selection ADR-C07 owns). Exit codes: **0** = tier ≥ silver (`δ ≥ 0.40`) AND `Ambig < 0.05`; **1** = tier < silver OR `Ambig ≥ 0.05` (failed; CI-blocking); **2** = `.heybradley/spec.aisp` missing or unparseable. `--strict` flag tightens to gold tier (`δ ≥ 0.60`) + `Ambig < 0.02` (production hard constraint per AISP v5.1 §4.3 + 00-understanding §4.3). Terminology precision per A3 finding #3: `δ` and `Ambig` are independent metrics — both gates checked, never conflated.

### D6 — Common conventions

All commands respect `.heybradley/config.json` for project-local settings (tierTarget, projectName, telemetry opt-in marker reserved for Phase 4+). Logging: writes append-only JSON lines to `.heybradley/log.json` (NOT SQLite — npm package stays Node-portable; sql.js is browser-only per ADR-114 D5; this preserves the open-core boundary). Output: human-readable terminal output (default; ANSI colors when stdout is a TTY) + `--json` flag for machine-readable structured output (CI parsing / agent ingestion). BYOK trust boundary per ADR-043 + ADR-114 D3: keys read from environment (`ANTHROPIC_API_KEY` / `GOOGLE_API_KEY` / `OPENAI_API_KEY`) on each invocation, **never** persisted to `.heybradley/` files; `redactKeyShapes()` (per ADR-126 D3) applied to any error message containing key-shaped substrings before being written to `log.json`. Fire-and-forget log writes wrapped try/catch per ADR-126 D4 — log failure never crashes the command.

## Consequences

**Positive**

- Zero-install workflow (`npx hey-bradley <cmd>`) lowers adoption friction — matches Claude Code plugin install pattern (ADR-C01)
- Four commands + `--json` flag = scriptable CI surface (`score` exit codes are the load-bearing CI primitive)
- Config-file convention (`.heybradley/config.json`) extensible for Phase 4+ user preferences without breaking the `hey-bradley` command surface
- `export --claude-code` reuses existing pure exporter (`buildClaudeCodeBundle()`) — single source of truth across web app + plugin + NPX
- BYOK + redaction discipline matches the rest of the codebase (ADR-043 + ADR-114 D3 + ADR-126 D3) — keys never touch disk via NPX path
- Node 18+ LTS floor matches MCP TS SDK requirement — single Node version contract across NPX + ADR-C04 MCP server

**Negative**

- Adds first `package.json#bin` entry to repo (today there is none) — published tarball must stay ≤2MB target which constrains how much pure-module surface can ship without restructuring
- Atoms transitively pull `import.meta.glob` (Vite-only) via `migrations/index.ts` re-exported through `db.ts` (per A1 §What's-Missing #1) — NPX bundle must either restructure `src/contexts/persistence/migrations/` re-exports OR replicate the P108/A10 `node:vm` `runInNewContext` workaround at build time
- `--offline` rules-only classifier scope deferred to Phase 4 — Phase 2/3 NPX users without network access can `init` + `score` but cannot `spec --prompt` until owner activates BYOK or Phase 4 ships local classifier
- `.heybradley/log.json` is append-only and ungated — long-running consumer projects need their own rotation strategy (NPX package does not prune; deliberately mirrors ADR-126 retention policy as out-of-scope for the CLI)

## Cross-refs

- **ADR-122** (Export Claude Code Markdown Bundle) — `export --claude-code` reuses `buildClaudeCodeBundle()` per D4; markdown-bundle-not-ZIP boundary preserved
- **ADR-114** (Supabase / Tier-2 Boundary) — `.heybradley/log.json` JSON-not-SQLite per D6 keeps open-core sql.js boundary intact
- **ADR-043** (BYOK Trust Boundary) — keys env-only, never persisted per D6
- **ADR-101** (Spec Export Quality) — versioned `*-aisp-v{n}.txt` filename pattern honored per D3 `--output` flag
- **ADR-126** (Comprehensive Logging) — fire-and-forget try/catch + `redactKeyShapes()` discipline carried into NPX per D6
- **ADR-C04** (MCP tool definitions) — NPX commands and MCP tools share underlying pure-module callers (`buildClaudeCodeBundle()` + AISP validator); `score` and `validate_aisp` MCP tool emit identical δ/Ambig values
- **ADR-C07** (AISP validator runtime) — D5 `score` and D3 `spec` re-validation both delegate to whichever runtime ADR-C07 selects

## Open questions deferred

- AISP validator runtime selection (npm `aisp-validator` vs Rust `aisp` crate vs WASM bundle) — **ADR-C07**
- Offline-mode rules-only classifier scope (D3 `--offline` flag full implementation) — **Phase 4** (Rust crate enhancement wave)
- Phase 4+ `userConfig` schema in `config.json` (model preference, density target, telemetry opt-in) — deferred
- `--zip` and `--directory` flags on `export` (Tier-2 per ADR-122 D2) — deferred
- `log.json` rotation/retention policy (mirrors ADR-126's out-of-CLI-scope decision) — deferred
