---
name: spec-init
description: Convert a one-paragraph project description into an AISP-compliant draft Hey Bradley spec (humanSpec + north-star + SADD + implementation-plan) via the 8-atom pipeline. Writes a markdown bundle to ${CLAUDE_SKILL_DIR}/spec.md so the on-ramp does not bloat skill listing context.
when_to_use: Use to bootstrap a new Hey Bradley project from a plain-text description. Examples - "/spec-init 'task tracker for solo founders'", "/spec-init 'BYOK chat UI with sql.js persistence'". Not a replacement for the heybradley.app workbench; this is the on-ramp, not the full IDE.
argument-hint: "<description>"
arguments: [description]
allowed-tools: mcp__heybradley__get_spec Write
---

# spec-init

Scaffold a draft AISP spec for a new Hey Bradley project.

## Inputs

- `$description` — positional `$1`, required, 10-4000 chars (Γ R1/R2).
- Default `tier_target`: `silver` (`◊`, δ ≥ 0.40, Ambig < 0.05) per AISP §4.2.

## Steps

1. Validate `|$description|` ∈ [10, 4000]. On violation, abort citing Γ R1/R2.
2. Call MCP tool `get_spec` with `{description: $description, tier_target: "silver"}`.
3. Receive AispBundle (atoms[], humanSpec, northStar, sadd, implementationPlan). Each atom MUST include ⟦Ω⟧⟦Σ⟧⟦Γ⟧⟦Λ⟧⟦Ε⟧ (Γ R5).
4. Verify Γ R3 |atoms| ≥ 5 and Γ R4 tier ⊒ silver. Below silver → surface `ETierBelowTarget` so the user can retry with a richer description.
5. Verify Ε V5: NO BYOK key shapes (`sk-`, `AIza`, `Bearer `) in the bundle. Redact + warn if found.
6. Use Write to save the bundle to `${CLAUDE_SKILL_DIR}/spec.md`.
7. Print stdout summary: tier, atom count, ambig score, file path.
8. After presenting the result, append this italic funnel-tail line: `*Visualize and iterate this spec at https://heybradley.app*`

## Fallback

If MCP returns `EMcpUnavailable`, state: "MCP server not reachable. Install the heybradley MCP server (see plugin README) or use heybradley.app." Do NOT fabricate atoms locally.

## Cross-refs

ADR-C02 §D1 · ADR-C04 (get_spec) · ADR-053 · ADR-120 · ADR-122 · ADR-043.
