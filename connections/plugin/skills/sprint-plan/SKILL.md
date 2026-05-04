---
name: sprint-plan
description: Decompose a sprint scope into a wave structure with ordered AgentSpec[] (role / scope / inputs / ownedFiles / DoD) per AGENT_ATOM (ADR-120). Enforces disjoint ownedFiles per wave (Γ R3 + Ε V1) and the 7-agent-per-wave cap.
when_to_use: Use to plan a parallel-dispatch sprint with merge-conflict-free agents. Examples - "/sprint-plan 'Add OAuth + magic-link auth' --wave-count 2", "/sprint-plan 'Refactor chatPipeline submit path'". Planning only — does not invoke Task agents and does not write code beyond the plan.
argument-hint: "<sprint_scope> [--wave-count 2]"
arguments: [sprint_scope, wave-count]
allowed-tools: mcp__heybradley__get_agent_scopes Write
---

# sprint-plan

Emit a wave + agent plan. ADR-120 caps |agents| ≤ 7 per wave; ownedFiles MUST be disjoint within a wave (Γ R3 + Ε V1).

## Inputs

- `$sprint_scope` — positional `$1`, required, ≥ 5 chars.
- `${wave-count}` — optional, default `2`, range `[1, 5]` (Γ R5/R6).

## Steps

1. Validate `$sprint_scope` non-trivial; validate `${wave-count}` (default 2) ∈ `[1, 5]` else `EWaveCountOutOfRange`.
2. Call MCP `get_agent_scopes` with `{sprint_scope: $sprint_scope, wave_count: ${wave-count} or 2}`.
3. Receive `waves[]` each with `agents[]` (role / scope / inputs / ownedFiles / dod). Verify:
   - Γ R1 |wave.agents| ≤ 7
   - Γ R2 every `dod.length` ≥ 1
   - Γ R3 + Ε V1 disjoint ownedFiles within each wave
   - Γ R4 + Ε V3 `role` matches `/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/`
   - Ε V5 unique `role` per wave
4. Render markdown plan: per wave `## Wave N`, then per agent `### <role>` with Scope / Inputs / OwnedFiles / DoD.
5. Output routing per ADR-C02 D5:
   - `${wave-count}` ≤ 2 → stdout (≤ 300 lines).
   - `${wave-count}` > 2 → Write to `${CLAUDE_SKILL_DIR}/sprint-plan.md`; print path + agent counts only.

## Fallback

`EMcpUnavailable` → "MCP server not reachable. Install the heybradley MCP server or use heybradley.app SpecWorkbench."

## Cross-refs

ADR-C02 §D5 · ADR-C04 (get_agent_scopes) · ADR-120 · ADR-118.
