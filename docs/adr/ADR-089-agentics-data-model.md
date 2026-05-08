# ADR-089 — Agentics Data Model (Phases / Sprints / Waves / Agents)

**Status:** Accepted
**Date:** 2026-04-30
**Phase:** P63 / OC-2 (planning ADR; migration applies at AW-1 sprint open)
**Supersedes:** none
**Cross-refs:** ADR-088, ADR-085, ADR-016, ADR-064

## Context

ADR-088 commits Hey Bradley to three first-class modes. The Agentics mode
needs to persist a richer object graph than Whiteboard or Planning:

- **Phases** (e.g., P63) — the top-level execution unit, project-scoped
- **Sprints** (e.g., OC-2) — coherent work bundles within a phase
- **Waves** — a single agent dispatch within a sprint
- **Agents** — individual agent runs (coder, reviewer, tester, etc.)
- **Gates** — acceptance criteria each wave must satisfy
- **Seals** — phase-level sign-offs (composite scores, persona scores)

The current SQLite schema (P16 + ADR-016) covers MasterConfig, AISP atoms,
and the `kv` table. None of the Agentics shapes have a home yet.

## Decision

**Extend the existing schema; do not fork.** Migration 005 (designed here,
applied at AW-1) adds six FK-linked tables under the existing project root:

```
phases     (id, project_id, slug, status, opened_at, sealed_at, composite_score)
  └─ sprints     (id, phase_id, slug, status, opened_at, closed_at, scope_md)
       └─ waves      (id, sprint_id, ordinal, dispatched_at, completed_at)
            └─ agents     (id, wave_id, agent_type, prompt_hash, started_at,
                              completed_at, tokens_used, latency_ms, success)
       └─ gates      (id, sprint_id, name, status, evidence_path)
  └─ seals       (id, phase_id, score, signer, signed_at, retro_md_path)
```

Plus: `aisp_atoms` table extends to carry **PROCESS_ATOM / DDD_ATOM /
AGENT_ATOM** types via the existing `atom_type` discriminator column —
no schema change to that table, just three new enum values.

## Bounded-context impact (DDD)

No new bounded context. Changes contained within:

- `persistence` — adds 6 tables under migration 005; `phase` is the new
  aggregate root for the Agentics graph (project still owns phase as
  parent FK; phase is a *child* of project but a *root* of the
  sprint/wave/agent subgraph)
- `intelligence` — adds 3 new atom types to the existing aisp_atoms
  taxonomy; no new repository
- `ui-shell` — unchanged this sprint (Agentics UI lives in AW-10)
- `configuration` — unchanged (master_config + pages from ADR-085 coexist;
  phase decompositions are *project-level*, not page-level)

No new aggregates beyond the phase root. Sprints / waves / agents /
gates / seals are child entities of phase.

## Out of scope (Tier-2 commercial)

- Hosted phase persistence (sql.js stays local-only)
- Multi-tenant phase ownership / sharing
- Real-time agent run sync across browsers
- Agent prompt + completion full-text search (HNSW index over agent
  prompts is a Tier-2 learning-flywheel feature)
- Cross-project phase analytics

## Acceptance gates

- Migration 005 file is **scaffolded but NOT applied** in P63 / OC-2
- The schema design above is documented in this ADR with FK shape
- `aisp_atoms.atom_type` taxonomy lists the 3 new types in a comment
  block (PROCESS_ATOM / DDD_ATOM / AGENT_ATOM) — *no enum constraint
  added yet* (constraint applies at AW-1 along with migration)
- `schema_version` bump deferred to AW-1 sprint open
- This ADR cross-refs ADR-088 (mode architecture) + ADR-085
  (multi-page MVP) + ADR-016 (sql.js persistence)

## Consequences

**Positive:**
- AW-1..AW-10 build work has a target schema; no schema-design
  bikeshed during the build sprints
- Extending an existing schema (rather than forking) means the same
  backup / export / sync paths cover Agentics for free
- Phase / sprint / wave / agent shapes mirror the project's own
  governance (CLAUDE.md ##Standard Phase Process) — eating the
  team's own dogfood in the schema

**Negative:**
- Schema commitment without immediate validation — if AW-1 finds
  the shape wrong, a migration 006 corrective ships before any
  user data lands
- Six new tables expand the DDL footprint by ~30%; reviewer cost
  for migration 005 will be non-trivial

**Mitigations:**
- Migration file is design-only until AW-1 — no user data depends
  on this schema until that sprint lands; corrective migrations
  are cheap
- AW-1 preflight will re-verify the shape against any AW-roadmap
  drift since P63 seal (per `phase-61b/02-aw-sprint-roadmap.md`)
- Field types favor `TEXT` over enums where feasible (status,
  agent_type) so future taxonomy additions don't require migrations
