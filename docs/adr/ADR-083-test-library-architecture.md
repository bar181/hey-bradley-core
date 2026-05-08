# ADR-083: Test Library Architecture (Prompt Corpus)

**Status:** Accepted
**Date:** 2026-04-30
**Deciders:** Bradley Ross
**Phase:** P59 (post-RC test library — comes after the open-core RC seal at `e99ecc2`)

## Context

P59 establishes the canonical prompt corpus that AgentProxy and the
live-LLM testing sprint both consume. Up to RC, test discipline was
source-level + AgentProxy fixtures (244 PURE-UNIT cases across the
moat-arc waves; 311 cumulative through P58). That corpus was authored
ad-hoc per phase — fine for moat-priority shipping cadence, but it
left no single artifact a future contributor could read to understand
"what shapes of prompt does this system actually accept."

P59 extends ad-hoc fixtures into a structured 280-entry corpus indexed
by persona, atom, section type, and edge-case dimension. The corpus is
hand-authored (not generated) so persona voice survives. It is a
**library**, not a benchmark — the goal is exhaustive shape coverage of
the AgentProxy + pipeline mechanics, not LLM-quality scoring. Quality
scoring is a separate concern handled by the live-LLM sprint
(`docs/testing/live-llm-testing-plan.md`).

## Decision

### Four JSON files at `tests/prompts/`

Same data, four access dimensions:

- `by-persona.json` — 6 personas × 20 prompts (grandma, framer, capstone-reviewer, dev, designer, founder)
- `by-atom.json` — 5 atoms × 10 prompts (PATCH, INTENT, SELECTION, CONTENT, ASSUMPTIONS)
- `by-section.json` — 16 section types × 5 prompts where applicable
- `edge-cases.json` — 30 adversarial entries (prompt-injection, oversized, malformed, off-topic, key-shape leak)

Cross-indexes share a stable `prompt_id` so the same row can be
retrieved through any dimension without duplication at the assertion
layer.

### SQLite migration 004 mirrors JSON into `prompt_library`

Migration 004 adds the `prompt_library` table; `initDB` seeds it
idempotently from the JSON files via `import.meta.glob` at startup.
Runtime queries (Sprint K latency badge replay, A3 Playwright cases)
hit the table; cold-start authoring stays in JSON. JSON is the source
of truth; the table is a derived index.

### Coverage philosophy: 280+ minimum corpus

`6 personas × 20 prompts + 5 atoms × 10 + 16 section types × 5 + 30
adversarial = 280` entries minimum. Coverage is exhaustive on the
**shape** dimension, not a quality benchmark.

### Closed enums on every dimension

`atom`, `verb`, `target`, `route`, `persona`, `difficulty` are all
closed enums in `tests/prompts/schema.json`. Anything outside the enum
is rejected at schema-validation time — we don't store free-form
strings. This keeps the corpus indexable and the live-LLM assertion
matrix bounded.

### `redactKeyShapes` at insert boundary

Even though the corpus is hand-authored and reviewed, the insert path
runs `redactKeyShapes` (defence-in-depth carry-forward from ADR-047).
A compromised contributor cannot smuggle a real key into the seed JSON
and have it land in `prompt_library` verbatim.

### Live-LLM testing is a SEPARATE sprint

P59 ships the corpus + the AgentProxy mechanics that consume it. Live
LLMs against the corpus is `docs/testing/live-llm-testing-plan.md` —
post-RC, owner-BYOK-gated, NOT a defense gate. AgentProxy proves the
**pipeline**; live testing proves the **LLMs**. Different concerns.

## Trade-offs

- **Hand-authored, not generated.** Labor-intensive (~6h drafting per
  persona arc) but persona voice survives. A generator would average
  the corpus toward the LLM's prior; that's a benchmark, not a library.
- **Coverage is shape-exhaustive, not quality-exhaustive.** We assert
  AgentProxy + pipeline mechanics behave on every documented shape. We
  do **not** assert that any given LLM produces correct output for any
  given prompt. That's the live-LLM sprint's job.
- **JSON-as-source-of-truth, table-as-derived.** Cold-start latency
  hit on every initDB seed (idempotent UPSERT). Acceptable because
  prompt count is bounded at ~280 and seed runs once per session.

## Cross-references

- **ADR-046** — multi-provider LLM matrix (corpus is the input; matrix is the output).
- **ADR-047** — audit/observability + `redactKeyShapes` boundary carryforward.
- **ADR-077 / ADR-078 / ADR-079 / ADR-081** — moat sprints whose prompts are pulled into the corpus.
- **ADR-082** — Open Core RC seal; P59 is the post-RC test-library phase.
- `docs/testing/live-llm-testing-plan.md` — separate sprint; consumes top 20 corpus prompts.
- `tests/prompts/COVERAGE.md` — coverage matrix + gaps.

## Consequences

- (+) One canonical artifact a future contributor reads to understand what shapes the pipeline accepts.
- (+) Live-LLM sprint can run without authoring its own prompts — pulls top 20 from `by-atom.json` directly.
- (+) Closed-enum schema means corpus drift is caught at insert, not at assertion.
- (+) Corpus is queryable by personas (capstone-review demo) and by atoms (LLM-quality matrix) without duplicating data.
- (-) Hand-authoring labor must be re-paid each time a new persona, atom, or section type lands. Mitigation: schema enforces the obligation; CI fails if a new enum value lands without corpus rows.
