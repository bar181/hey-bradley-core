---
name: spec-init
description: Convert a one-paragraph project description into an AISP-compliant draft Hey Bradley spec (humanSpec + north-star + SADD + implementation-plan) via the 8-atom pipeline. Writes a markdown bundle to ${CLAUDE_SKILL_DIR}/spec.md so the on-ramp does not bloat skill listing context.
when_to_use: Use to bootstrap a new Hey Bradley project from a plain-text description. Examples - "/spec-init 'task tracker for solo founders'", "/spec-init 'BYOK chat UI with sql.js persistence'". Not a replacement for the heybradley.app workbench; this is the on-ramp, not the full IDE.
argument-hint: "<description>"
arguments: [description]
allowed-tools: mcp__heybradley__get_spec Write
---

# spec-init

You are scaffolding a draft AISP spec for a new Hey Bradley project.

## Inputs

- `$description` — one-paragraph plain-text project description (positional `$1`, required, 10-4000 chars per AISP spec).
- Default tier target: `silver` (`◊`, δ ≥ 0.40, Ambig < 0.05) per AISP §4.2.

## Steps

1. Validate `$description` length is within 10-4000 chars. If not, abort with a short error citing AISP Γ R1/R2.
2. Call MCP tool `get_spec` (defined in ADR-C04) with body:
   - `description: $description`
   - `tier_target: "silver"`
3. Expect an AispBundle response (atoms[], humanSpec, northStar, sadd, implementationPlan). The spec MUST include ⟦Ω⟧⟦Σ⟧⟦Γ⟧⟦Λ⟧⟦Ε⟧ blocks per atom (Γ R5).
4. Verify Γ R3 |spec.atoms| ≥ 5 and Γ R4 tier ⊒ silver. If below silver, surface `ETierBelowTarget` and let the user retry with a richer description.
5. Verify Ε V5: NO BYOK key shapes (`sk-`, `AIza`, `Bearer `) appear anywhere in the bundle. If found, redact and warn.
6. Use the Write tool to save the markdown bundle to `${CLAUDE_SKILL_DIR}/spec.md`.
7. Print a short stdout summary: tier, atom count, ambig score, file path.

## Fallback

If MCP is unavailable (`EMcpUnavailable`), state clearly: "MCP server not reachable. Install the heybradley MCP server (see plugin README) or visit heybradley.app for the full pipeline." Do NOT attempt to fabricate atoms locally.

## Cross-refs

ADR-C02 §D1 · ADR-C04 (get_spec) · ADR-053 · ADR-120 · ADR-122 · ADR-043.
