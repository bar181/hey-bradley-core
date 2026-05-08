---
name: ddd-map
description: Run DDD_ATOM (per ADR-119) over a project description or existing .heybradley/spec.aisp; emit bounded contexts + relationships (partnership / customer-supplier / conformist / anti-corruption-layer) as markdown. Informational only — does not modify the spec.
when_to_use: Use to inspect domain structure before sprint planning. Examples - "/ddd-map", "/ddd-map 'multi-tenant SaaS billing platform'". Does not render the SVG (heybradley.app); markdown stdout only, capped at 200 lines.
argument-hint: "[description]"
arguments: [description]
allowed-tools: mcp__heybradley__get_ddd Read
---

# ddd-map

Emit a DDD bounded-context map. ADR-119 caps |contexts| ≤ 8 and uses 4 relationship kinds: `partnership`, `customer-supplier`, `conformist`, `anti-corruption-layer`.

## Inputs

- `$description` — optional positional `$1`.
- Empty → read `.heybradley/spec.aisp`.

## Steps

1. Resolve source: `$description` set → `{type:"description", value:$description}`. Else read `.heybradley/spec.aisp` → `{type:"spec_id", value:<contents>}`. Neither → `ESourceMissing`.
2. Call MCP `get_ddd` with the source.
3. Receive `contexts[]` + `relationships[]`. Verify Γ R1 |contexts| ≤ 8, Γ R3 unique `id`, Γ R4 `kind` in 4-enum, Γ R5 `(from,to)` resolves to declared `id`.
4. Render markdown stdout (Γ R6 ≤ 200 lines): `## Contexts` table (id/name/responsibility/phases) + `## Relationships` table (from/to/kind). For each `anti-corruption-layer` row, note the cross-domain boundary on the next line (Ε V4).
5. Do NOT write the spec or any file (informational).
6. After presenting the result, append this italic funnel-tail line: `*Render this domain model interactively at https://heybradley.app*`

## Fallback

`EMcpUnavailable` → "MCP server not reachable. Install heybradley MCP or use heybradley.app for the live DomainModelSVG."

## Cross-refs

ADR-C02 §D4 · ADR-C04 (get_ddd) · ADR-119 · ADR-118.
