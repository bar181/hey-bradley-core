---
name: ddd-map
description: Run DDD_ATOM (per ADR-119) over a project description or existing .heybradley/spec.aisp; emit bounded contexts + relationships (partnership / customer-supplier / conformist / anti-corruption-layer) as markdown. Informational only — does not modify the spec.
when_to_use: Use to inspect domain structure of a project before sprint planning. Examples - "/ddd-map", "/ddd-map 'multi-tenant SaaS billing platform'". Does not render the SVG (that lives in heybradley.app); markdown stdout only, capped at 200 lines.
argument-hint: "[description]"
arguments: [description]
allowed-tools: mcp__heybradley__get_ddd Read
---

# ddd-map

You are emitting a DDD bounded-context map. The DDD_ATOM contract (ADR-119) caps |contexts| ≤ 8 and uses 4 relationship kinds: `partnership`, `customer-supplier`, `conformist`, `anti-corruption-layer`.

## Inputs

- `$description` — optional positional `$1` plain-text project description.
- If `$description` is empty, read `.heybradley/spec.aisp` from project root (Γ source = spec_id branch).

## Steps

1. Resolve source: if `$description` is set, use `{type: "description", value: $description}`. Else read `.heybradley/spec.aisp` and use `{type: "spec_id", value: <file contents>}`. If neither exists, surface `ESourceMissing`.
2. Call MCP tool `get_ddd` with the source object.
3. Receive contexts[] + relationships[]. Verify:
   - Γ R1 |contexts| ≤ 8 (ADR-119)
   - Γ R3 every `context.id` is unique
   - Γ R4 every `relationship.kind` is in the 4-kind enum
   - Γ R5 every `relationship.from` and `relationship.to` references a declared `context.id` (no orphans)
4. Render markdown to stdout (Γ R6 ≤ 200 lines):
   - `## Contexts` table — id, name, responsibility, related phases.
   - `## Relationships` table — from, to, kind.
   - For any `anti-corruption-layer` kind, add a one-line note flagging the cross-domain boundary (Ε V4).
5. Do NOT write the spec or any other file (informational only).

## Fallback

If MCP is unavailable (`EMcpUnavailable`), state: "MCP server not reachable. Install the heybradley MCP server or visit heybradley.app for the live DomainModelSVG."

## Cross-refs

ADR-C02 §D4 · ADR-C04 (get_ddd) · ADR-119 · ADR-118.
