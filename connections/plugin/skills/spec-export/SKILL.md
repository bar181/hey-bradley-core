---
name: spec-export
description: Read project-local .heybradley/spec.aisp and emit a CLAUDE.md-formatted markdown bundle per ADR-122 (single .md with `# === FILE: <path> ===` markers covering preamble + process map + human spec + AISP spec + ADRs + agent waves). Pure transform; the spec must already exist.
when_to_use: Use after `/spec-init` (or after editing in heybradley.app) to materialize the bundle into a Claude Code-readable CLAUDE.md. Examples - "/spec-export", "/spec-export --output-path ./CLAUDE.md". Does not generate a fresh spec (use /spec-init) and does not run KISS review.
argument-hint: "[--output-path ./CLAUDE.md]"
arguments: [output-path]
allowed-tools: mcp__heybradley__get_claude_md Write
---

# spec-export

Export an existing AISP spec to a CLAUDE.md markdown bundle (ADR-122).

## Inputs

- `${output-path}` — optional, default `./CLAUDE.md`.
- Source: `.heybradley/spec.aisp` (must exist, Γ R1).

## Steps

1. Resolve target: `${output-path}` if set, else `./CLAUDE.md` (Γ R4).
2. Call MCP `get_claude_md` with `{spec_path: ".heybradley/spec.aisp"}`. Missing file → `ESpecNotFound`.
3. Receive MarkdownBundle: preamble + processMap + humanSpec + aispSpec + adrs[] + agentWaves[].
4. Verify Γ R2 |files| ≥ 6 and Γ R3 each section opens with a unique `# === FILE: <path> ===` marker.
5. Verify Ε V5: NO BYOK key shapes (`sk-`, `AIza`, `Bearer `) leaked to bundle. Redact + warn.
6. Write the bundle string to target via Write. Pure + idempotent (Γ R5).
7. Print stdout: byte count, file count, target path.

A consumer can split the bundle later with one `awk` / `python` line on the FILE marker.

## Cross-refs

ADR-C02 §D2 · ADR-C04 (get_claude_md) · ADR-122 · ADR-101 · ADR-043.
