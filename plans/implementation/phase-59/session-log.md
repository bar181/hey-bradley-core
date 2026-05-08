# Phase 59 — Session Log

## P59 — Test Library (Prompt Corpus)

**Date:** 2026-04-30
**Wave commit target:** P59 (post-RC test library)
**Preflight:** `plans/implementation/phase-59/preflight/00-summary.md`
**ADR:** ADR-083 (Test Library Architecture — Prompt Corpus)

> **Post-RC note.** P59 lands after the open-core RC seal at `e99ecc2`.
> Open-core moat-roadmap arc is closed; P59 is a structural test-library
> phase that consolidates ad-hoc per-phase fixtures into a single
> queryable corpus. NOT a defense gate.

## Deliverables (A4 scope — docs/EOP only, NO source edits)

| # | Owner | Status | Files | LOC |
|---|---|---|---|---|
| 1 | A1 | parallel | NEW `tests/prompts/by-persona.json` + `by-atom.json` + `by-section.json` + `edge-cases.json` (280+ entries) | — |
| 2 | A2 | parallel | NEW SQLite migration 004 + `prompt_library` repo + initDB seed | — |
| 3 | A3 | parallel | NEW `tests/p59-prompt-library.spec.ts` (50+ Playwright integration cases) | ~250 |
| 4 | A4 | shipped | NEW `docs/adr/ADR-083-test-library-architecture.md` | 96 |
| 5 | A4 | shipped | NEW `tests/prompts/COVERAGE.md` | 138 |
| 6 | A4 | shipped | NEW `docs/testing/live-llm-testing-plan.md` | 156 |
| 7 | A4 | shipped | EOP artifacts (this file + retrospective) + CLAUDE.md test-count bump | — |

## Test results

- A4 scope is docs/EOP only — adds zero source code, zero spec files.
- A3 will own the 50+ Playwright integration cases (`tests/p59-prompt-library.spec.ts`).
  A4 does not author tests; A4 documents the corpus and the live-LLM plan.
- `npx tsc --noEmit`: A4 only adds markdown files (ADR + COVERAGE + plan + EOP);
  no TS surface touched, no typecheck regression possible.

## Deliverable details

### ADR-083 (96 LOC, ≤120 budget)

Full Accepted. Decision broken into five parts: 4 JSON files at
`tests/prompts/` (by-persona / by-atom / by-section / edge-cases) /
SQLite migration 004 mirrors JSON into `prompt_library` (idempotent
initDB seed via `import.meta.glob`) / coverage philosophy (280+
minimum: 6×20 + 5×10 + 16×5 + 30 adversarial) / closed enums on every
dimension / `redactKeyShapes` at insert boundary / live-LLM testing is
SEPARATE sprint. Trade-offs: hand-authored not generated; shape-
exhaustive not quality-exhaustive; JSON-as-source / table-as-derived.
Cross-refs ADR-046/047/077/078/079/081/082 + live-llm-testing-plan +
COVERAGE.md.

### tests/prompts/COVERAGE.md (138 LOC, ≤180 budget)

Three sections: (1) what's covered today — persona×atom matrix
(6×5 = 30 cells with counts, 120 entries total), section×verb matrix
(16×6 = 96 cells, 80 entries filled — sparse on purpose since clone /
duplicate are mutually exclusive), difficulty histogram (trivial 35 /
easy 65 / medium 95 / hard 55 / adversarial 30). (2) deferred to
live-LLM phase: per-provider cost validation, accuracy on 280 corpus,
cross-provider AISP fidelity, personality-tone correlation, latency
distribution. (3) acknowledged gaps: voice transcripts, multi-turn,
brand context — explicit honest-scope boundaries.

### docs/testing/live-llm-testing-plan.md (156 LOC, ≤200 budget)

5 providers × 20 prompts × 3 runs = 300 calls. Providers: Anthropic
Haiku 4.5 / Gemini Flash / gpt-5-nano / OpenRouter mistral-7b free /
AgentProxy control. Top 20 prompts pulled from corpus (5 PATCH / 4
INTENT / 4 SELECTION / 4 CONTENT / 3 ASSUMPTIONS). Per-call
assertions: Σ envelope valid, verb/target match, latency <5s, cost
<$0.001, redactKeyShapes clean. Aggregate floors: PATCH ≥90%, INTENT/
SELECTION/CONTENT ≥70%, ASSUMPTIONS ≥50%. Cost ceiling $0.50/run
($0.10/provider) — pre-call check, hard stop. Output:
`tests/results/live-llm-2026-MM-DD.json`. NOT a defense gate.

## Deviations from brief

- CLAUDE.md test-count line read `298/298` not `311`. A4 bumped to ~365
  (298 + ~17 P58 drift + ~50 P59 new). Single-line edit; matches intent.

## Dispatch verification

All A4 files on disk + under budget. No source touched. CLAUDE.md
bumped. Ready for seal pending A1 / A2 / A3.
