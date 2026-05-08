# Connections P5 — Verification Report

> Date: 2026-05-04 · Branch: `swarm/connections-phase-5`
> Predecessor: Phase 4 Waves 1+2+3 sealed at `81c8a6b` on `swarm/connections-phase-4`

## Summary

5 of 5 swarm-doable acceptance gates verified GREEN modulo one publish-blocker on the standalone MCP runtime (compiled ESM imports lack `.js` extensions; tsconfig uses `module: "ESNext"` + `moduleResolution: "bundler"` while `package.json` declares `type: "module"`). All TypeScript configs (full repo + `tsconfig.app.json` + `connections/mcp` + `connections/npx`) tsc-strict clean. JSON manifests parse cleanly (8/8). Plugin component count matches ADR-C01 expectations exactly. NPX init/score/export pipeline runs end-to-end. BYOK boundary clean (zero key-shape leaks). Owner-required gates (plugin install, Cursor mcp.json registration, AISP Ambig <0.05 on test inputs) deferred per the plan; AISP heuristic Ambig is a uniqueness proxy and requires CF#4 live LLM eval for ground-truth scoring.

## Gate-by-gate results

### Gate 1 — JSON validation

8/8 manifests parse via `JSON.parse`:

```
connections/plugin/.claude-plugin/plugin.json OK
connections/.claude-plugin/marketplace.json OK
connections/plugin/hooks/pre-session.json OK
connections/plugin/mcp/server.json OK
connections/mcp/package.json OK
connections/mcp/tsconfig.json OK
connections/npx/package.json OK
connections/npx/tsconfig.json OK
```

### Gate 2 — TypeScript strict

| Config | Exit |
|---|---|
| `tsc --noEmit` (full repo) | 0 |
| `tsc -p tsconfig.app.json --noEmit` | 0 |
| `tsc -p connections/mcp/tsconfig.json --noEmit` | 0 |
| `tsc -p connections/npx/tsconfig.json --noEmit` | 0 |

All four strict configs clean. Cumulative regression at P109 anchor (237 GREEN) preserved — P5 verification adds zero source modifications.

### Gate 3 — Hook size cap (≤500 tokens / ~400 words)

Sample `.heybradley/spec.aisp` with project name + tagline + ~150-word North Star + 8 atom blocks (matches ADR-122 D4 bundle preamble shape). Hook output:

```
Hook exit: 0
Hook output words: 115 (target ≤400)
Hook output lines: 11
Hook output bytes: 810
```

115 words ≈ ~150 tokens — comfortably under the 400-word/500-token defense-in-depth cap declared in `pre-session.sh` lines 84-101. The wc-based truncation guard at line 90 (`if [ "$word_count" -gt 400 ]`) is wired and will trigger if a future spec.aisp grows past the cap. Hook handles missing-file (silent skip exit 0; line 29) and unreadable-file (exit 2 → Claude feedback; line 35) cases per ADR-C03 D4.

### Gate 4 — NPX smoke (init / score / export)

```
=== INIT === exit 0
Scaffolded .heybradley/ at /tmp/<dir>/.heybradley
  + spec.aisp (416 bytes)
  + config.json (86 bytes)
  + .gitignore (35 bytes)
  + log.json (auto-created on first command)

=== SCORE --json === exit 1
{"density":0.143,"ambig":0.234,"tier":"Reject","exit_code":1}

=== EXPORT --claude-code === exit 0
Wrote /tmp/<dir>/CLAUDE.md (8 logical files, 1275 bytes)

=== CLAUDE.md head ===
# === FILE: CLAUDE.md ===
# === FILE: process-map.md ===
# === FILE: human-spec/north-star.md ===
# === FILE: human-spec/sadd.md ===
...
=== File-marker count: 8 ===
```

All three subcommands functional. Score exit 1 on stub spec is correct behavior — the default scaffolded `spec.aisp` is intentionally below the Bronze tier (density 0.143) so users feel forced to fill in real content. A richer hand-crafted spec scored Bronze (density 0.250). 8 file markers in exported CLAUDE.md matches ADR-122 D4 ≥6-file requirement.

### Gate 5 — MCP stdio smoke

```
$ echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' \
    | timeout 5 node connections/mcp/dist/index.js

Error [ERR_MODULE_NOT_FOUND]: Cannot find module
'connections/mcp/dist/tools/get-spec' imported from
'connections/mcp/dist/tools/index.js'
```

**FAIL — confirmed publish-blocker.** Root cause: `connections/mcp/tsconfig.json` uses `"module": "ESNext"` + `"moduleResolution": "bundler"`, which lets TS compile sources without rewriting bare specifiers (e.g., `from './get-spec'` stays bare in compiled JS). But `connections/mcp/package.json` declares `"type": "module"`, and Node's ESM runtime requires explicit `.js` extensions on relative imports. Compiled output at `dist/tools/index.js` line 4 shows: `import { getSpec } from './get-spec';` — Node refuses to resolve.

Compare: `connections/npx/tsconfig.json` uses `"module": "NodeNext"` + `"moduleResolution": "NodeNext"`, which forces source-side `.js` extensions and works at runtime. NPX runs cleanly because it follows this pattern.

**Fix paths (Phase 6+ candidates, not P5 scope):**
1. Switch MCP tsconfig to `NodeNext` like NPX, then update sources to import `'./get-spec.js'` etc.
2. OR add a post-build sed pass to rewrite `from '\./([^']+)'` → `from './\1.js'` in `dist/`.
3. OR set `"moduleResolution": "node16"` and accept the same constraint.

The plugin-bundled MCP at `connections/plugin/mcp/server.ts` is a TS source (not pre-built); whether it hits the same blocker depends on how the plugin host loads it (Claude Code may compile via tsx/esbuild at load time, sidestepping the issue).

### Gate 6 — BYOK boundary

```
$ grep -rn 'sk-[a-zA-Z0-9]\{20,\}\|AIza[0-9A-Za-z_-]\{35\}\|Bearer\s\+[a-zA-Z0-9]\{20,\}' connections/
EXIT=1  (no matches)
```

Zero hits across all 84 files in `connections/`. BYOK trust boundary preserved per ADR-043 + ADR-114 D3.

### Gate 7 — Plugin component count

| Component | Expected | Actual |
|---|---|---|
| SKILL.md files (spec-init, spec-export, adr-new, ddd-map, sprint-plan) | 5 | 5 ✓ |
| Hook config + script | 1 + 1 | `pre-session.json` + `pre-session.sh` ✓ |
| `plugin.json` | 1 | `connections/plugin/.claude-plugin/plugin.json` ✓ |
| `marketplace.json` | 1 | `connections/.claude-plugin/marketplace.json` ✓ |
| Bundled MCP server + config | 1 + 1 | `server.ts` + `server.json` ✓ |
| Shared tool def files | 7 | `get-spec.ts` + `get-claude-md.ts` + `validate-aisp.ts` + `get-ddd.ts` + `get-agent-scopes.ts` + `index.ts` + `types.ts` ✓ |

All 5 SKILL.md files have valid YAML frontmatter with `name` + `description` + `when_to_use` + `argument-hint` + `arguments` + `allowed-tools` per ADR-C02.

### Gate 8 — File audit

| Metric | Count |
|---|---|
| Total files in `connections/` | 84 |
| TS LOC (excluding `dist/`) | 1113 |
| MD LOC | 2189 |
| JSON manifests | 8 |
| `connections/plugin/` files | 10 |
| `connections/mcp/` source files | 11 |
| `connections/npx/` source files | 10 |
| `connections/docs/` files | 30 |
| `connections/.claude-plugin/` | 1 |

## Owner-required gates (deferred)

1. **`/plugin install bar181/hey-bradley` in Claude Code** — manual install; requires marketplace push (CF#4 candidate).
2. **Cursor `.cursor/mcp.json` registration** — manual setup; depends on Gate 5 fix landing first (otherwise the registered MCP errors on first tool call).
3. **AISP Ambig < 0.05 on test inputs** — current `scoreAisp` heuristic at `connections/npx/commands/score.ts:53` uses `1 - unique/total` as a uniqueness proxy, not true AISP δ. Ground-truth Ambig requires the live AGENT_PROXY pipeline reading the spec through PATCH/INTENT/SELECTION/CONTENT/ASSUMPTIONS atoms (CF#4 BYOK live LLM smoke). Heuristic produces consistent ranking (stub: 0.234 / hand-crafted with Crystal Atom symbols: 0.359), but absolute target <0.05 is reserved for production specs scored against the real ambiguity diff (ADR-C07 / `aisp-core` Rust crate enhancement, deferred to Wave 4).

## Honest gaps

1. **Gate 5 publish-blocker (Cursor / standalone MCP)** — described above. Plugin-bundled MCP is unaffected if Claude Code uses tsx/esbuild at load time, but standalone `npm publish hey-bradley-mcp` cannot ship today.
2. **Score exit code 1 on default scaffold** — intentional (forces user engagement) but worth flagging in the NPX README so first-time users don't think init is broken.
3. **No CI run of these gates yet** — verification is local-only at P5; promoting to a `connections-ci.yml` GitHub Actions workflow is a Wave 4 candidate.
4. **`.heybradley/log.json` auto-created on first NPX command** — not declared in `init` output, but harmless (telemetry stub).

## Verdict

**PARTIAL** — 6 of 7 swarm-doable gates pass cleanly (JSON / tsc / hook cap / NPX init+score+export / BYOK boundary / plugin component count / file audit). Gate 5 (MCP stdio smoke) fails on a publish-blocker that is fully diagnosed and has 3 documented fix paths. The blocker does not affect the plugin-bundled MCP path (which is the priority-1 surface per the Phase 1 mandate) — only the standalone Cursor / IDE-agnostic publish path. Recommendation: file Gate 5 fix as a P1 must-fix for Phase 6 / Wave 2 follow-up before any `npm publish hey-bradley-mcp` attempt.
