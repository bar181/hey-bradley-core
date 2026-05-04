---
name: adr-new
description: Scaffold a new ADR (Architecture Decision Record) file with auto-incremented ID, Status:Proposed, today's date, and the 4 required sections (Context / Decisions / Consequences / Cross-refs). Self-contained — runs without the MCP server.
when_to_use: Use when adding a new architectural decision to the project's `docs/adr/` ledger. Examples - "/adr-new 'Adopt sql.js for local persistence'", "/adr-new 'Three-tier model routing'". Does not write the decisions themselves — user fills those in. Does not auto-link cross-refs.
argument-hint: "<title>"
arguments: [title]
allowed-tools: Bash(ls docs/adr/*) Read Write
---

# adr-new

You are scaffolding a new ADR file. This skill is self-contained — no MCP server required (D3 ships even if MCP absent, ADR-C02).

## Inputs

- `$title` — decision title (positional `$1`, required, 5-80 chars per Γ R1/R2).

## Steps

1. Validate `$title` length is 5-80 chars. Reject otherwise.
2. List `docs/adr/ADR-*.md` filenames (Bash `ls docs/adr/ADR-*.md`). Parse the integer ID from each `ADR-NNN-...md` and compute `next_id = max(IDs) + 1` (Γ R3 + R4 — IDs monotonically increase, no gap reuse). If `docs/adr/` does not exist, surface `EAdrDirNotFound`.
3. Compute `slug = kebab-case($title)` (lowercase, replace whitespace + non-alphanum with `-`, collapse repeats, trim leading/trailing `-`) per Γ R5.
4. Build filename: `docs/adr/ADR-${next_id_padded3}-${slug}.md`. Reject if already exists (Γ R3 + EIdCollision).
5. Write the scaffold (≤120 LOC per Ε V5). Header MUST include `Status: Proposed` (Ε V2) and today's date. Body MUST include 4 sections: `## Context` / `## Decisions` / `## Consequences` / `## Cross-refs` (Γ R6 + Ε V1).
6. Print stdout: new ADR path + ID.

## Scaffold template

```markdown
# ADR-NNN: <Title>

> Status: Proposed
> Date: YYYY-MM-DD
> Cross-refs: (fill in)

## Context

(Why is this decision needed? What forces are at play?)

## Decisions

### D1 — <decision name>

(What did we decide? Be specific and testable.)

## Consequences

(What follows from this decision? Pros, cons, risks.)

## Cross-refs

(List related ADRs by ID + a one-line note each.)
```

## Cross-refs

ADR-C02 §D3 · ADR-C01 · ADR-109 · ADR-133.
