#!/usr/bin/env bash
# Hey Bradley pre-session hook — inject project context into Claude Code session.
#
# Per ADR-C03:
#   D1 — Fires on SessionStart (startup + resume matchers; clear excluded).
#   D2 — type=command (local sh; no Haiku spend, no MCP round-trip).
#   D3 — ≤500-token cap; 3-section preamble (project/tagline + north-star + AISP atom-set).
#   D4 — Exit 0 = stdout becomes context; exit 2 = stderr becomes Claude feedback (soft fail);
#        any other exit = transcript shows error notice (hard fail).
#   D5 — Defense-in-depth: 400-word `wc -w` proxy ≈ 500 tokens conservative; truncate at 380.
#
# Schema source: https://code.claude.com/docs/en/hooks-guide
# Cross-refs: ADR-122 (.heybradley/spec.aisp emitted by buildClaudeCodeBundle),
#             ADR-053 (AISP Ambig <0.02 production gate),
#             ADR-126 (fire-and-forget; never throws upward).
#
# Idempotent: pure read of .heybradley/spec.aisp; no state mutation; re-runnable.
# BYOK-safe: no API key shapes echoed; spec.aisp is a markdown bundle artifact only.

set -euo pipefail

# Resolve spec path — Claude Code passes ${CLAUDE_PROJECT_DIR} via env at hook fire time.
# Fall back to cwd for direct-invoke testing. Allow SPEC_PATH override for unit tests.
PROJECT_DIR="${CLAUDE_PROJECT_DIR:-${PWD}}"
SPEC_PATH="${SPEC_PATH:-${PROJECT_DIR}/.heybradley/spec.aisp}"

# Per ADR-C03 D3: silent skip when spec absent. User invokes /spec-init (ADR-C02) to bootstrap.
# Empty stdout + exit 0 keeps cold-start clean for non-Hey-Bradley projects.
if [ ! -f "$SPEC_PATH" ]; then
  exit 0
fi

# Soft-fail guard: spec must be readable. Exit 2 routes stderr to Claude feedback.
if [ ! -r "$SPEC_PATH" ]; then
  echo "Hey Bradley: spec.aisp present but unreadable at ${SPEC_PATH}" >&2
  exit 2
fi

# Build preamble in a buffer so we can apply the wc -w defense-in-depth cap before emitting.
buffer=""

# --- Section 1: Project name + tagline (≤50 tokens / ~40 words) ---
# Best-effort regex parse. spec.aisp format per ADR-122 D4 includes a CLAUDE.md preamble
# logical file at "# === FILE: CLAUDE.md ===" which carries Project + Tagline in markdown.
project_name=$(grep -m1 -E '^(# Project:|## Project:)' "$SPEC_PATH" 2>/dev/null \
  | sed -E 's/^#+ Project:[[:space:]]*//' || true)
tagline=$(grep -m1 -E '^(## Tagline:|### Tagline:)' "$SPEC_PATH" 2>/dev/null \
  | sed -E 's/^#+ Tagline:[[:space:]]*//' || true)

buffer+="## Hey Bradley project context"$'\n\n'
buffer+="**Project:** ${project_name:-Untitled}"$'\n'
if [ -n "${tagline:-}" ]; then
  buffer+="**Tagline:** ${tagline}"$'\n'
fi
buffer+=$'\n'

# --- Section 2: North Star summary (≤200 tokens / ~160 words) ---
# Extract block under "## North Star" up to the next "## " heading. Cap at 10 lines / ~160 words.
north_star=$(awk '
  /^## North Star/    { flag=1; next }
  /^## /              { flag=0 }
  flag && NF          { print }
' "$SPEC_PATH" 2>/dev/null | head -10 || true)

if [ -n "${north_star}" ]; then
  buffer+="### North Star"$'\n'
  buffer+="${north_star}"$'\n\n'
fi

# --- Section 3: AISP atom-set status (≤100 tokens / ~80 words) ---
# AISP atoms are denoted by ⟦…⟧ delimiters per AISP reference. Count distinct opens.
# Suite is 8 atoms (PATCH+INTENT+SELECTION+CONTENT+ASSUMPTIONS+DECOMP+PROCESS+DDD+AGENT minus dupes).
# Per ADR-120 the suite is COMPLETE at 8.
atom_count=$(grep -c '^⟦' "$SPEC_PATH" 2>/dev/null || echo 0)
# Strip any trailing whitespace/newlines defensively.
atom_count="${atom_count//[^0-9]/}"
atom_count="${atom_count:-0}"

buffer+="### AISP atoms wired: ${atom_count}/8"$'\n\n'
buffer+='_(Run `/spec-export` to emit a CLAUDE.md bundle. Use `/sprint-plan "scope"` to plan agent waves.)_'$'\n'

# --- Defense-in-depth truncation per ADR-C03 D5 ---
# wc -w proxy: 400-word cap ≈ 500 tokens conservative. Truncate at 380 words and append
# the literal suffix "... [truncated]" so downstream readers see the cut.
word_count=$(printf '%s' "$buffer" | wc -w | tr -d '[:space:]')
word_count="${word_count:-0}"

if [ "$word_count" -gt 400 ]; then
  truncated=$(printf '%s' "$buffer" | awk '
    {
      for (i = 1; i <= NF; i++) {
        if (++n > 380) { exit }
        printf("%s%s", (n == 1 ? "" : " "), $i)
      }
      printf("\n")
    }
  ')
  buffer="${truncated}"$'\n... [truncated]\n'
fi

# Emit. Exit 0 — stdout becomes Claude's context per A2 §3.
printf '%s' "$buffer"
exit 0
