# Connections Layer — Phase 1 Understanding

> Date: 2026-05-04 · Branch: `swarm/connections-phase-1`
> Sources: `inventory-existing.md` (A1) + `inventory-claude-plugin.md` (A2) + `inventory-mcp-aisp.md` (A3)
> Author: CONNECTIONS-P1 / Agent A4 (synthesizer)

## Executive summary

Hey Bradley v2.0.0-RC1 already carries the **8-atom AISP suite + markdown-bundle exporter + comprehensive logging + 3-mode workbench**, but every entry-point is a React component or Vite-bundled module — there is **no public CLI/programmatic surface** today. The connections layer must extract the pure-module subset of the codebase (Crystal Atoms, spec generators, `buildClaudeCodeBundle()`) and re-package it for **stdio MCP (Claude Code plugin)**, **HTTP MCP (standalone for Cursor + others)**, and **NPX commands**, with a Phase-4 Rust-crate enhancement track. External standards are mature and well-documented: Claude Code plugin spec is stable (only `name` is required in `plugin.json`); MCP spec dated 2025-11-25 covers stdio + Streamable HTTP transports; AISP is at `𝔸5.1.Platinum@2026-01-09` with separate **density** (δ, higher better) and **ambiguity** (Ambig, lower better) metrics. Five open questions need Phase-2 ADR resolution; **readiness verdict = AMBER** (Phase 2 can start, but two prerequisites should be fetched before code lands).

---

## 1. What exists in Hey Bradley (from A1)

### 1.1 Crystal Atoms (8 — AISP suite COMPLETE per ADR-120)

| Atom | File (LOC) | Σ block | Pure | Production wire |
|------|------------|---------|------|------------------|
| PATCH_ATOM | `prompts/system.ts:37-70` (189) | YES (`aisp-1.2`) | YES | `buildSystemPrompt()` line 161 → `chatPipeline.ts:209` |
| INTENT_ATOM | `aisp/intentAtom.ts:17` (212) | YES | YES | `chatPipeline.ts:354` (`classifyIntent`/`llmClassifyIntent`) |
| SELECTION_ATOM | `aisp/templateSelector.ts:22` (122) | YES | YES | `selectTemplate()` line 72; **ADR-057 LLM dispatcher SUPERSEDED P106/ADR-134** — `templateMatcher.ts` now canonical |
| CONTENT_ATOM | `aisp/contentAtom.ts:33` (184) | YES | YES | `contentGenerator.ts:102` |
| ASSUMPTIONS_ATOM | `aisp/assumptionsAtom.ts:24` (148) | YES | YES | `assumptionsLLM.ts:90` |
| DECOMP_ATOM | `aisp/decompAtom.ts:25` (284) | YES | YES | `chatPipeline.ts:444` short-circuit; `todoExecutor.ts:131` |
| PROCESS_ATOM | `aisp/processAtom.ts:42` (295) | YES | YES | `PlanningChatBar.tsx:44` `classifyProcess()` |
| DDD_ATOM | `aisp/dddAtom.ts:15` (291) | YES | YES | `PlanningChatBar.tsx:58` `classifyContexts()` |
| AGENT_ATOM | `aisp/agentAtom.ts:49` (299) | YES | YES | `PlanningChatBar.tsx:78` `classifyAgents()` |

Barrel: `src/contexts/intelligence/aisp/index.ts` re-exports atoms 2-9. **PATCH_ATOM lives in `prompts/system.ts`, NOT `aisp/`** (historical placement per ADR-045). Each atom ships a deterministic `classifyX()` baseline + `buildXAtom()`/`parseXResponse()` LLM-handoff path that is **inert at v2.0.0-RC1** (CF#4 owner-required). Source: `inventory-existing.md` §1.

### 1.2 Pure connection surfaces already shaped

- `buildClaudeCodeBundle(phase, projectSlug?, onEmit?)` at `src/contexts/specification/exportClaudeCode.ts:203` — markdown bundle emitter; emits ≥6 logical files via `# === FILE: <path> ===` markers; pure module (atoms re-exported via `processMapTypes.ts` + `types.ts` neutral type modules per P106/ADR-134); `ExportEmitCallback` (line 55) preserves atom-pure contract per ADR-122 + ADR-135. Source: A1 §4.
- `validateSectionType()` at `src/lib/schemas/section.ts:38` (P104) — strict-vs-friendly remap pattern: Zod stays strict on canonical 18 types; helper opt-in remaps 10 aliases (article/long-form→text, testimonial/pull-quote→quotes, nav→menu, cta→action, faq→questions, stats→numbers); never throws. Source: A1 §2.
- `validateEventType()` at `src/contexts/persistence/repositories/comprehensiveLogs.ts:75` (P104) — strict validator + `patch_applied → patch_validation` alias remap; 15-value enum (post-P107: 100% wired). Source: A1 §7.
- AISP versioned filename pattern at `shareSpecBundle.ts:50` — `${slug}-aisp-${v}.txt` per ADR-101 D3; full `bundleFilenames()` at line 44 also emits northstar/human-spec/config/manifest variants with `withVersionHeader()` 2-line header. Source: A1 §4.
- 6 spec generators at `src/lib/specGenerators/` — `northStar` / `SADD` / `buildPlan` / `features` / `humanSpec` / `aispSpec` (all pure, all `(config) → string`). Source: A1 §6.
- `tddScaffoldGenerator.buildTDDScaffold()` (P97/ADR-128) + `kissReviewer.buildKissReview()` (P98/ADR-129) — pure exporters joining the bundle. Source: A1 §4.
- `comprehensiveLogs.writeErrorEvent()` (P107/ADR-135) — centralized error capture with BYOK redaction on **both** `message` AND `stack` per ADR-043 + ADR-114 D3. Source: A1 §7.

### 1.3 What's MISSING for the connections layer

1. **No CLI / programmatic entry-point.** Every consumer is a React component or Vite-bundled module. Atoms transitively pull `import.meta.glob` (Vite-only) via `migrations/index.ts` re-exported through `db.ts` — Node consumers need `node:vm` `runInNewContext` workaround (P108/A10). Source: A1 §What's-Missing #1.
2. **No NPX surface.** `package.json` has no `"bin"` entry; `dist/` is a Vite SPA build, not a library. Source: A1 #2.
3. **No MCP server.** Zero `@modelcontextprotocol/*` deps; no `mcp.json`; no JSON-RPC stdio surface. Source: A1 #3.
4. **No Claude Code plugin scaffold.** No `plugin.json`, no `SKILL.md` files, no `hooks/`, no marketplace metadata. Source: A1 #4.
5. **No standalone Rust crate vendored locally.** AISP-related Rust lives in the separate `bar181/aisp-open-core` repo (referenced but not vendored); Hey Bradley repo is TS/TSX only. Source: A1 #5.
6. **AGENT_ATOM `parseAgentResponse` LLM-handoff inert.** All 8 atoms ship deterministic baseline + `buildXAtom()/parseXResponse()` scaffolded but **inert** at v2.0.0-RC1 (CF#4 owner-required). Source: A1 #6.
7. **No public δ-ambiguity scorer in `src/`.** ADR-053 references `<2% ambiguity` discipline but enforcement is contract-only, not measured. No `scoreAmbiguity(spec): δ` helper exists. Source: A1 #7.
8. **No hosted spec URL runtime.** `hostedSpecLink.ts` is `data:` URL only (locked D5); share-by-URL deferred to Tier-2 commercial per ADR-133 D3. Source: A1 #8.
9. **No stable public API contract.** Atoms re-export through 4+ barrel files; no `@hey-bradley/core` package boundary; type stability not declared. Source: A1 #10.

### 1.4 ADR ground-truth (A1 §8 summarized)

| ADR | Title | Key contract |
|-----|-------|--------------|
| ADR-120 | AGENT_ATOM (P94; 8th + final atom) | AISP Σ contract `agents: AgentSpec[]`; Γ R1 |agents| ≤ 7; disjoint `ownedFiles` per wave; AgentProxy adapter only at v2.0.0-RC1 |
| ADR-122 | Export Claude Code Markdown Bundle (P96) | Single `.md` with `# === FILE: <path> ===` markers; ≥6 logical files; bundle IS canonical Hey Bradley output (downstream consumer writes implementation) |
| ADR-126 | Comprehensive LLM Interaction Logging (P100 W2) | 2 tables (`log_events` 30-day, `edit_history` 90-day); 3-level ID hierarchy session/request/event; BYOK redaction at every write boundary; fire-and-forget try/catch |
| ADR-131 | Agentic Workbench RC Architecture (P101) | RC ships at v2.0.0-RC1; persona scoring honest (3 floor breaches not papered); 12-item carry-forward registry CF#1-12 |
| ADR-133 | v2.0.0-RC1 Open Core Boundary (P103) | Open-core scope: zero new deps beyond P84 baseline; sql.js + IndexedDB + BYOK + markdown bundle; Tier-2 deferrals NAMED; AISP versioning policy `aisp-1.X` minor / `aisp-2.0` RFC-gated **(project-local — see §4.5)** |

---

## 2. Claude Code plugin standard (from A2)

### 2.1 plugin.json manifest

Location: `.claude-plugin/plugin.json` (manifest is **OPTIONAL** — auto-discovery from default subdirs if omitted, plugin name = directory basename). When present, only `name` is required (kebab-case, used for `<plugin>:<component>` namespacing in UI). Source: A2 §1, quoting plugins-reference: *"If you include a manifest, `name` is the only required field."*

Optional metadata: `$schema`, `version` (semver; pins to commit SHA if omitted), `description`, `author`, `homepage`, `repository`, `license`, `keywords`. Component-path fields (replace defaults): `skills` / `commands` / `agents` / `hooks` / `mcpServers` / `outputStyles` / `themes` / `lspServers` / `monitors` / `userConfig` / `channels` / `dependencies`. **Path rule: all relative to plugin root, must start with `./`.** Variable substitution available in MCP/hook/LSP commands: `${CLAUDE_PLUGIN_ROOT}`, `${CLAUDE_PLUGIN_DATA}`, `${user_config.KEY}`, `${ENV_VAR}`. Source: A2 §1.

### 2.2 SKILL.md format

Location for plugin skills: `<plugin>/skills/<skill-name>/SKILL.md`. Slash invocation: directory name → `/<skill-name>`. Custom commands have been merged into skills — `.claude/commands/deploy.md` and `.claude/skills/deploy/SKILL.md` both create `/deploy`. Source: A2 §2.

YAML frontmatter (16 fields, all OPTIONAL; only `description` recommended): `name` / `description` / `when_to_use` / `argument-hint` / `arguments` / `disable-model-invocation` / `user-invocable` / `allowed-tools` / `model` / `effort` / `context` / `agent` / `hooks` / `paths` / `shell`. Body: freeform Markdown with shell injection via `` !`<command>` `` and substitutions `$ARGUMENTS`, `$0..$N`, `$<name>`, `${CLAUDE_SKILL_DIR}`. Source: A2 §2.

**Token budgets (verbatim documented):**

- SKILL.md soft cap: ≤500 lines
- Per-entry combined `description + when_to_use`: 1,536 chars
- Skill listing dynamic budget: 1% of context window, fallback 8,000 chars (env `SLASH_COMMAND_TOOL_CHAR_BUDGET`)
- Auto-compaction re-attach: 5,000 tokens per skill, 25,000 tokens combined

For plugin namespacing: `<plugin>:<skill>` shown in UI; bare `/<skill>` invocation unless name conflict. Source: A2 §2 + §5.

### 2.3 Hooks (27-event lifecycle)

Hook types (5): `command` (shell), `http` (POST event JSON), `mcp_tool` (call MCP), `prompt` (single-turn LLM, default Haiku), `agent` (multi-turn, **experimental**, 60s timeout, ≤50 tool turns). Source: A2 §3.

Key events for connections layer: `SessionStart` (matchers: startup/resume/clear/compact), `UserPromptSubmit`, `PreToolUse`/`PostToolUse` (tool-name matchers), `InstructionsLoaded`, `PreCompact`/`PostCompact`. **PreToolUse structured output**: `permissionDecision` ∈ `allow|deny|ask|defer`; `deny` blocks even in `bypassPermissions` mode. Multiple PreToolUse hooks rewriting `updatedInput` race in parallel — last to finish wins (non-deterministic). Source: A2 §3.

Output semantics: exit 0 = action proceeds, stdout injected to context for `UserPromptSubmit`/`UserPromptExpansion`/`SessionStart`; exit 2 = blocked, stderr → Claude feedback. Default timeout 10 minutes (configurable). Source: A2 §3.

### 2.4 Marketplace

Repo layout: `.claude-plugin/marketplace.json` (REQUIRED) lists plugin sources. 5 plugin source types: relative-path (`./*`), `github` (repo + ref/sha), `url`, `git-subdir` (url + path), `npm` (package + version). **No Anthropic-side approval gate** for third-party marketplaces — self-publish is unrestricted aside from 8 reserved names blocking impersonation. Source: A2 §4.

Install: `/plugin marketplace add <source>` + `/plugin install <plugin>@<marketplace>`. Update: `/plugin marketplace update`. Strict mode: default `strict: true` = `plugin.json` is authoritative + marketplace entry supplements; `strict: false` = marketplace entry is entire definition (no plugin.json conflict allowed). Source: A2 §4.

Version resolution order: `plugin.json#version` → marketplace entry `version` → git commit SHA → `unknown`. **Avoid setting `version` in both** — `plugin.json` always wins silently. Source: A2 §4.

### 2.5 Slash command pattern

Forms: `/<skill-name>`, `/<skill-name> arg1 arg2`, `/<skill-name> "multi word arg" second`. Shell-style quoting; `$ARGUMENTS` = full string; `$0..$N` indexed; `$<name>` named (via `arguments:` frontmatter list). If skill omits `$ARGUMENTS`, Claude Code appends `ARGUMENTS: <input>` to body. Plugin namespace: `<plugin>:<skill>` for disambiguation. Source: A2 §5.

---

## 3. MCP standard (from A3)

### 3.1 Transports

**stdio** (preferred — *"Clients SHOULD support stdio whenever possible"*): subprocess; newline-delimited JSON-RPC 2.0 on stdin/stdout (no embedded newlines, no non-MCP stdout); UTF-8 logs to stderr; client closes stdin to terminate. **Use for Claude Code plugin + Cursor.** Source: A3 §A1.

**Streamable HTTP** (replaces deprecated HTTP+SSE since `2024-11-05`): single endpoint supporting POST + GET; `Accept` header MUST list `application/json` AND `text/event-stream`; sessions tracked via `Mcp-Session-Id` header; protocol version negotiated on initialize and echoed via `MCP-Protocol-Version: 2025-06-18` on every subsequent request. **Use for hosted MCP server.** Security: validate `Origin` header (DNS rebinding); local servers bind to `127.0.0.1` not `0.0.0.0`. Source: A3 §A1.

### 3.2 Tool schema

Capability declaration: `{ "capabilities": { "tools": { "listChanged": true } } }`. Tool definition fields: `name` (REQUIRED), `title` (optional display), `description`, `inputSchema` (JSON Schema, REQUIRED), `outputSchema` (optional, for structured results), `annotations` (untrusted hints). Source: A3 §A2.

Tool result has 5 content types: `text`, `image` (base64+mimeType), `audio` (base64+mimeType), `resource_link` (URI+name+desc+mimeType), `resource` (embedded text or blob). Structured content lives in sibling `structuredContent` field; if `outputSchema` declared, server MUST conform + client SHOULD validate; backward-compat → also serialize JSON into TextContent. Source: A3 §A2.

### 3.3 Error model (two-channel)

1. **Protocol errors** — JSON-RPC envelope `{ "error": { "code": -32602, "message": "..." } }`.
2. **Tool execution errors** — in result with `"isError": true` flag, content array describes failure.

The two channels are not interchangeable — protocol errors mean the request was malformed; `isError: true` means the tool ran but failed semantically. Source: A3 §A2.

### 3.4 Server lifecycle

`initialize → tools/list → tools/call`. `tools/list` supports `cursor` pagination (response carries `nextCursor`). `notifications/tools/list_changed` server-pushed when `listChanged` capability declared. Source: A3 §A3.

**Phase 2 prerequisite — initialize payload field-by-field shape lives in `schema.ts`** at `https://github.com/modelcontextprotocol/specification/blob/main/schema/2025-11-25/schema.ts`. WebFetch returned handshake sequence (POST InitializeRequest → InitializeResult + Mcp-Session-Id → POST InitializedNotification → 202) but not the field schema. **Action: Phase 2 must fetch `schema.ts` directly before designing connections-layer client/server init.** Source: A3 §C #1.

### 3.5 TS SDK

WebFetch summary returned **split packages** — `@modelcontextprotocol/server` + `@modelcontextprotocol/client` with helper transport `@modelcontextprotocol/server/stdio`. Public docs widely reference **single combined package `@modelcontextprotocol/sdk`**. **Action: Phase 2 ADR-C04 must verify package naming by reading `package.json` from `github.com/modelcontextprotocol/typescript-sdk` directly before code is written** — A3's split-package quote is likely WebFetch summarizer paraphrase, not literal install. Documented as "verify before code". Source: A3 §A4 + §C #2.

API shape (verified via SDK README): `new McpServer({name, version})` + `server.registerTool(name, {description, inputSchema}, handler)` + `await server.connect(transport)`. Standard Schema validation supports Zod / Valibot / ArkType. Source: A3 §A4.

---

## 4. AISP v5.1 (from A3)

### 4.1 Crystal Atom block sequence

Spec stamp: `𝔸5.1.Platinum@2026-01-09`. Symbol table = `Σ_512` (8 categories × 64 symbols: Ω Transmuters, Γ Topologics, ∀ Quantifiers, Δ Contractors, 𝔻 Domains, Ψ Intents, ⟦⟧ Delimiters, ∅ Reserved). Source: A3 §B1.

**Required block ordering:** `⟦Ω⟧ → ⟦Σ⟧ → ⟦Γ⟧ → ⟦Λ⟧ → ⟦Ε⟧`

**Full sequence with optional context:** `𝔸 ≫ CTX? ≫ REF? ≫ ⟦Ω⟧ ≫ ⟦Σ⟧ ≫ ⟦Γ⟧ ≫ ⟦Λ⟧ ≫ ⟦Χ⟧? ≫ ⟦Ε⟧`

Block semantics (consistent across upstream spec + Hey Bradley atom modules):
- **Ω (Objective)** — top-line goal / north-star intent
- **Σ (Structure)** — typed shape declaration / data contract
- **Γ (Grounding)** — rules, invariants (e.g. `Γ R1: |contexts| ≤ 8`)
- **Λ (Logistics)** — thresholds, fallbacks, retry/escalation
- **Ε (Evidence/Evaluation)** — verifications, proof claims, density
- **Χ (Extension)** — optional extra context

Source: A3 §B1. Hey Bradley's PATCH/INTENT/DDD/AGENT atom headers preserve this layout.

### 4.2 δ density (HIGHER better)

**Formal definition (verbatim):** `δ ≜ λτ⃗.|{t∈τ⃗|t.k∈𝔄}|÷|{t∈τ⃗|t.k≢ws}|` — ratio of valid AISP-symbol tokens to all non-whitespace tokens.

**Tier ladder:**

| Tier | Symbol | Threshold | Use |
|------|--------|-----------|-----|
| Platinum | ◊⁺⁺ | δ ≥ 0.75 | Production specs |
| Gold | ◊⁺ | δ ≥ 0.60 | High-quality docs |
| Silver | ◊ | δ ≥ 0.40 | Working drafts |
| Bronze | ◊⁻ | δ ≥ 0.20 | Initial conversions |
| Reject | ⊘ | δ < 0.20 | Invalid |

Source: A3 §B2.

### 4.3 Ambig (LOWER better; HARD <0.02 production gate)

**Formal definition (verbatim):** `Ambig ≜ λD. 1 - |Parse_u(D)| / |Parse_t(D)|`

**Constraint (verbatim):** `∀D ∈ AISP: Ambig(D) < 0.02`

- Production hard constraint: **< 0.02**
- Phase-3 spec acceptable: **≤ 0.05**

Source: A3 §B2.

> **Terminology correction (per A3 finding #3):** preflight line *"AISP δ < 0.05 ambiguity target"* conflates the two metrics. **δ and Ambig are independent.** A spec can be platinum-dense yet ambiguous, or unambiguous yet bronze-density. Both gates matter. Phase-2 ADRs MUST use precise language:
> - `δ ≥ 0.75` when the gate is **density** (Platinum tier)
> - `δ ≥ 0.40` when the gate is **density** (Silver tier minimum)
> - `Ambig < 0.02` when the gate is **ambiguity** (production hard constraint)
> - `Ambig ≤ 0.05` when the gate is **ambiguity** (Phase-3 spec acceptable)
>
> Preflight should be reframed as: *"Ambig < 0.02 production hard constraint; Ambig ≤ 0.05 acceptable target for Phase-3 specs; δ ≥ 0.40 Silver tier minimum for shipped specs."*

### 4.4 Validation pipeline

**Pipeline (verbatim):** `validate ≜ ⌈⌉ ∘ δ ∘ Γ? ∘ ∂`

Read right-to-left:
1. `∂` — tokenize string → token list
2. `Γ?` — proof search (verify well-formedness via inference rules)
3. `δ` — compute density ratio
4. `⌈⌉` — map density to tier symbol

Sample output: `"✓ VALID (Gold tier, δ=0.64)"`. Source: A3 §B2.

### 4.5 Versioning policy

Stamp format: `𝔸X.Y.name@YYYY-MM-DD` (e.g. `𝔸5.1.Platinum@2026-01-09`). Context marker: `γ ≔ aisp.specification.complete`. Reference set: `ρ ≔ ⟨glossary,types,rules,functions,errors,proofs,parser,agent⟩`. Source: A3 §B3.

> **Versioning policy correction (per A3 finding #2):** the `aisp-1.X` minor backward-compat / `aisp-2.0` RFC-gated phrasing is from Hey Bradley's ADR-109 + ADR-133 (project-local) — it is **NOT** part of the upstream `aisp-open-core` README/AI_GUIDE. Upstream currently ships `𝔸5.1.Platinum@2026-01-09` with no formal SemVer compat contract published. **Phase-2 ADRs MUST NOT over-claim upstream enforcement** — Hey Bradley pins to the dated stamp directly and treats its own versioning policy as downstream. Source: A3 §B3 + §C #4.

### 4.6 Validator implementation paths (open Phase-2 decision)

Three published implementations:

| Option | Surface | Notes |
|--------|---------|-------|
| A | npm `aisp-validator` + `aisp-converter` | Node.js; fits NPX path naturally |
| B | Rust `aisp` crate on crates.io | "Fastest performance"; ships binary `aisp validate` |
| C | WASM bundle of Rust crate | Cross-platform browser embedding |

CLI samples: `npx aisp-converter "Define x as 5"` → `x≜5`; `npx aisp-validator validate spec.aisp`; `aisp validate spec.aisp` (Rust). **Phase-2 ADR-C07 decides which path Hey Bradley standardizes on** (or whether the connections layer wraps multiple). Source: A3 §B4 + §C #8.

---

## 5. Constraints + Phase-2 inputs

### 5.1 Token budgets (gathered)

| Surface | Limit | Source | Authority |
|---------|-------|--------|-----------|
| Pre-session hook context-injection | ≤500 tokens | A2 §3 + preflight | **Hey Bradley project convention** (NOT platform-enforced — A2 explicit gap) |
| SKILL.md body soft cap | ≤500 lines | A2 §2 | Documented in plugins-reference |
| SKILL.md per-entry combined `description + when_to_use` | 1,536 chars | A2 §2 | Documented |
| Skill listing dynamic budget | 1% context window, fallback 8,000 chars | A2 §2 | Documented |
| Auto-compaction per-skill re-attach | 5,000 tokens | A2 §2 | Documented |
| Auto-compaction combined budget | 25,000 tokens | A2 §2 | Documented |

### 5.2 Architecture invariants (carry from existing ADRs)

- **Pure-module discipline** — atoms must NOT import from `src/components/` (per ADR-118 / ADR-121 / ADR-122 / ADR-128 / ADR-129 / ADR-130 / ADR-134). Connections layer extracts pure subset; no React imports leak. Source: A1 §What's-Missing #1.
- **BYOK trust boundary** — no `sk-`/`AIza`/`Bearer ` shapes in any persisted data; `redactKeyShapes()` at every write boundary (per ADR-043 + ADR-114 D3). Source: A1 §7.
- **Fire-and-forget logging contract** — every log write try/catch wrapped, never throws upward (per ADR-126 D4). Source: A1 §8 ADR-126.
- **AISP versioned filename pattern** — `${slug}-aisp-v{version}.txt` per ADR-101 D3. Source: A1 §4.

### 5.3 Phase-2 ADR scope (the 7 ADRs to write)

| ADR | Scope | Key inputs (where to find them) |
|-----|-------|----------------------------------|
| ADR-C01 | Plugin structure + manifest schema | A2 §1 — `plugin.json` only `name` required; component-path conventions; `${CLAUDE_PLUGIN_ROOT}` substitution |
| ADR-C02 | SKILL.md content strategy per skill (5 skills: spec-init, spec-export, adr-new, ddd-map, sprint-plan) | A2 §2 — 16-field frontmatter; 1,536-char per-entry cap; ≤500-line body; 25K-token compaction budget |
| ADR-C03 | Hook strategy + size constraints | A2 §3 — 27-event lifecycle; SessionStart matchers (startup/resume/clear/compact); 500-token convention; PreToolUse `permissionDecision` semantics |
| ADR-C04 | MCP tool definitions (5 tools: get_spec / get_claude_md / validate_aisp / get_ddd / get_agent_scopes) | A3 §A2 — tool schema; 5 result types; 2-channel error model; Phase-2 prerequisite **fetch `package.json` for SDK naming** |
| ADR-C05 | NPX command surface (`init` / `spec` / `export --claude-code` / `score`) | A1 §4 (existing pure exporters) + A3 §B4 (validator paths) |
| ADR-C06 | Shared MCP codebase strategy (one codebase, two deployment targets: plugin-bundled stdio vs standalone HTTP) | A3 §A1 transports + A2 §1 `mcpServers` field |
| ADR-C07 | AISP Rust crate enhancement scope (Crystal Atom builder / DDD extractor / CLAUDE.md formatter / Ambig diff) | A3 §B4 — existing crate provides ∂/Γ?/δ/⌈⌉ engine; new surfaces upstream-vs-companion-crate decision |

---

## 6. Open questions (decide in Phase 2)

1. **Validator runtime path** — npm `aisp-validator` vs Rust `aisp` crate vs WASM bundle (ADR-C07). Trade-offs: npm = NPX-native zero-extra-deps; Rust = fastest + ship binary; WASM = browser-embeddable. Source: A3 §C #8.
2. **MCP TS SDK package naming** — `@modelcontextprotocol/sdk` (single combined) vs `@modelcontextprotocol/server` + `@modelcontextprotocol/client` (split with `/stdio` helpers) — **Phase-2 prerequisite: fetch `github.com/modelcontextprotocol/typescript-sdk` `package.json` directly before ADR-C04 code**. Source: A3 §C #2.
3. **Hook context-injection format** — markdown vs structured JSON for `SessionStart` stdout. A2 doesn't specify; Claude Code accepts any text on stdout (raw injection) but optimal format for token efficiency is undecided. Source: A2 §3.
4. **Crystal Atom dual-path LLM-handoff fire site** — atoms ship `buildXAtom()`/`parseXResponse()` inert at v2.0.0-RC1 (CF#4 owner-required). Connections layer can wait on owner BYOK activation OR supply its own LLM transport (Claude Code provides this natively for the plugin path). Source: A1 §What's-Missing #6.
5. **δ scoring runtime placement** — does it ship as a connections-layer concern (NPX `score` command in ADR-C05), or wait for Phase-4 Rust-crate wave (ADR-C07)? `src/` has no `scoreAmbiguity()` helper today (ADR-053 contract-only). Source: A1 §What's-Missing #7 + A3 §B2.

**Secondary open items** (lower priority, can deferral land mid-Phase-2):

6. **MCP `initialize` payload field schema** — Phase-2 prerequisite to fetch `schema.ts` from MCP spec repo before client/server init code (Source: A3 §C #1).
7. **MCP Resources + Prompts surface** — fetched material focused on Tools (load-bearing). Resources (file-like data; could expose AISP bundle as Resource) + Prompts (templated workflows; could expose `/spec` body) may matter for Claude Code plugin path. Worth fetching `modelcontextprotocol.io/docs/concepts/resources` + `concepts/prompts` if scoped in (Source: A3 §C #6).

---

## 7. Phase 2 readiness verdict

**AMBER** — Phase 2 (Decompose + Architect) can begin writing the 7 ADRs immediately for the structural decisions (plugin layout / hook strategy / shared-codebase / Rust scope / NPX surface / SKILL.md content), but **two prerequisites must land before any code is committed**:

1. **Fetch `schema.ts` from MCP spec repo** to nail down the `initialize` request payload field shape (blocks ADR-C04 + ADR-C06 implementation; OK to start ADR drafts in parallel).
2. **Fetch `package.json` from `modelcontextprotocol/typescript-sdk`** to verify SDK package naming (`@modelcontextprotocol/sdk` vs split). A3 flagged WebFetch summary as likely paraphrase. Blocks ADR-C04 code; not the ADR text itself.

**Track that can start now (GREEN-equivalent):**
- ADR-C01 (plugin.json structure) — A2 §1 is complete and verbatim-cited
- ADR-C02 (SKILL.md content) — A2 §2 frontmatter contract is complete
- ADR-C03 (hook strategy) — A2 §3 is complete; 500-token budget noted as project convention
- ADR-C05 (NPX commands) — A1 §4 exporters + A3 §B4 validator surface both complete
- ADR-C07 (Rust crate scope) — A3 §B4 complete; new surfaces enumerated

**Track that needs prereq before code (AMBER):**
- ADR-C04 (MCP tool definitions) — needs SDK naming verification (Q2) + `schema.ts` fetch (Q6)
- ADR-C06 (shared MCP codebase) — needs same prereqs as ADR-C04

**Open-question count: 5 primary + 2 secondary = 7 total.** None are blocking ADR text drafting; 2 are blocking Phase-3 code commit. Proceed.
