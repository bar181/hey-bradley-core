# Phase 59 — Retrospective

## Keep

- Library-not-benchmark framing for the corpus. P59 asserts shape, not
  quality. Quality belongs to the live-LLM sprint. Conflation was the
  trap; ADR-083 names the boundary explicitly.
- Closed-enum schema on every dimension (atom / verb / target / route /
  persona / difficulty). Catches drift at insert, not at assertion.
- JSON-as-source / table-as-derived. Cold authoring stays in JSON;
  runtime queries hit the seeded table. Idempotent UPSERT keeps it
  honest.
- A4 scope strictly additive — ADR + docs + EOP. Zero typecheck risk.
  Mirrors P58/O4 pattern.

## Drop

- Live-LLM testing in-phase. Defense passes on AgentProxy fixtures;
  forcing live keys into a pre-defense run was the temptation that the
  moat-arc velocity check resisted. Stays a separate sprint.
- Generator-authored corpus. Considered and rejected — averages toward
  the LLM prior, kills persona voice. Hand-authored is the right cost.

## Reframe

- **Corpus is the memory layer for the pipeline, not for the LLMs.**
  AgentProxy is the unit-of-mechanics; the corpus is what teaches a
  future contributor what shapes the pipeline accepts.
- **Post-RC is the right place for this.** Open-core arc closed at P58;
  P59 opens the consolidation track running parallel to ROADMAP_NEXT.
