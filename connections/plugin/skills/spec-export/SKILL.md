---
name: spec-export
description: Read project-local .heybradley/spec.aisp and emit a CLAUDE.md-formatted markdown bundle per ADR-122 (single .md with `# === FILE: <path> ===` markers covering preamble + process map + human spec + AISP spec + ADRs + agent waves). Pure transform; the spec must already exist.
when_to_use: Use after `/spec-init` (or after editing a spec in heybradley.app) to materialize the bundle into a Claude Code-readable CLAUDE.md. Examples - "/spec-export", "/spec-export --output-path ./CLAUDE.md". Does not generate a fresh spec (use /spec-init) and does not run KISS review.
argument-hint: "[--output-path ./CLAUDE.md]"
arguments: [output-path]
allowed-tools: mcp__heybradley__get_claude_md Write
---

# spec-export

You are exporting an existing AISP spec to a CLAUDE.md markdown bundle (ADR-122 format).

## Inputs

- `${output-path}` — optional named arg. Defaults to `./CLAUDE.md`.
- Spec source: project-local `.heybradley/spec.aisp` (must exist + be readable, Γ R1).

## Steps

1. Resolve target path: `${output-path}` if set, else `./CLAUDE.md` (Γ R4).
2. Call MCP tool `get_claude_md` with `spec_path: ".heybradley/spec.aisp"`. If the file is missing, abort with `ESpecNotFound`.
3. Receive a MarkdownBundle: preamble + processMap + humanSpec + aispSpec + adrs[] + agentWaves[].
4. Verify Γ R2 |bundle.files| ≥ 6 and Γ R3 every section opens with a `# === FILE: <path> ===` marker (unique per file, ADR-122 D2).
5. Verify Ε V5: NO BYOK key shapes leaked from spec to bundle (`sk-`, `AIza`, `Bearer `). Redact + warn if any are present.
6. Write the bundle string to the target path via Write. Transform is pure + idempotent (Γ R5).
7. Print stdout: byte count, logical-file count, target path.

## Notes

- Bundle output is large (file write, not stdout) — see ADR-C02 D2 token-budget routing.
- A consumer can later split the bundle with one `awk` / `python` line on the FILE marker.

## Cross-refs

ADR-C02 §D2 · ADR-C04 (get_claude_md) · ADR-122 · ADR-101 · ADR-043.
