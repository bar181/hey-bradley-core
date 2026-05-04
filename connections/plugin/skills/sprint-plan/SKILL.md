---
name: sprint-plan
description: Decompose a sprint scope into a wave structure with ordered AgentSpec[] (role / scope / inputs / ownedFiles / DoD) per AGENT_ATOM (ADR-120). Enforces disjoint ownedFiles per wave (Γ R3 + Ε V1) and the 7-agent-per-wave cap.
when_to_use: Use to plan a parallel-dispatch sprint with merge-conflict-free agents. Examples - "/sprint-plan 'Add OAuth + magic-link auth' --wave-count 2", "/sprint-plan 'Refactor chatPipeline submit path'". Planning only — does not invoke Task agents and does not write code beyond the plan markdown.
argument-hint: "<sprint_scope> [--wave-count 2]"
arguments: [sprint_scope, wave-count]
allowed-tools: mcp__heybradley__get_agent_scopes Write
---

# sprint-plan

You are emitting a wave + agent plan. AGENT_ATOM contract (ADR-120) caps |agents| ≤ 7 per wave; ownedFiles MUST be disjoint within a wave (Γ R3 + Ε V1).

## Inputs

- `$sprint_scope` — sprint scope (positional `$1`, required, ≥ 5 chars).
- `${wave-count}` — optional named arg, default `2`, range `1..5` (Γ R5 + R6).

## Steps

1. Validate `$sprint_scope` is non-trivial. Validate `${wave-count}` (default 2) ∈ `[1, 5]`. Otherwise surface `EWaveCountOutOfRange`.
2. Call MCP tool `get_agent_scopes` with `{sprint_scope: $sprint_scope, wave_count: ${wave-count} or 2}`.
3. Receive waves[] each with agents[] (role / scope / inputs / ownedFiles / dod). Verify:
   - Γ R1 |wave.agents| ≤ 7 per wave
   - Γ R2 every `agent.dod.length` ≥ 1
   - Γ R3 + Ε V1 disjoint-ownedFiles within each wave (intersection across agents in the same wave = ∅)
   - Γ R4 + Ε V3 every `agent.role` matches kebab-case `/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/`
   - Ε V5 unique `agent.role` within the same wave
4. Render markdown plan: per wave `## Wave N`, then per agent `### <role>` with `Scope`, `Inputs`, `OwnedFiles`, `DoD` subsections.
5. Output routing per ADR-C02 D5:
   - If `${wave-count}` ≤ 2 → print plan markdown to stdout (≤ 300 lines).
   - If `${wave-count}` > 2 → Write the plan to `${CLAUDE_SKILL_DIR}/sprint-plan.md` and print only path + agent counts.

## Fallback

If MCP is unavailable (`EMcpUnavailable`), state: "MCP server not reachable. Install the heybradley MCP server or use heybradley.app for the live SpecWorkbench."

## Cross-refs

ADR-C02 §D5 · ADR-C04 (get_agent_scopes) · ADR-120 · ADR-118.
