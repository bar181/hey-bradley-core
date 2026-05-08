# ADR-106 — Prompt Library Completeness Standard

- **Status:** Accepted
- **Date:** 2026-05-01
- **Phase:** P81 / OC-16
- **Cross-refs (primary):** ADR-083 (Test Library Architecture — P59 baseline corpus), ADR-098 (Template Intelligence Architecture — `exampleQueries` matcher input), ADR-099 (DECOMP_ATOM — multi-clause splitter)
- **Cross-refs (secondary):** ADR-064 (ASSUMPTIONS_ATOM — low-confidence tail), ADR-066 (Listen route closed-verb set)

## Context

P59 (per ADR-083) shipped a **280-entry prompt corpus** under `tests/prompts/` across 4 JSON files (`by-atom.json`, `by-section.json`, `by-persona.json`, `edge-cases.json`). The corpus was sized for the post-RC live-LLM eval harness — a deliberately conservative floor. Migration `004-prompt-library.sql` already wires SQLite seeding for runtime BYOK matrix tests.

Since P59, the surface area has grown materially:
- **Multi-page** (ADR-085 / ADR-103 / ADR-104) — page-targeting prompts ("change page 2 hero", "rename page 3", "add a pricing page") are not represented.
- **Template Intelligence** (ADR-098 / ADR-073 audit) — soft-trigger prompts ("make it more fun", "switch to don miller style", "more agency vibes") that hit the 3-layer matcher (theme / section / content) are absent.
- **Agentic-Product templates** (ADR-105 — P80) — 4 new vertical-positioned templates (ai-agent-marketplace, ai-coding-copilot, ai-workflow-platform, ai-support-copilot) introduce section-prompt phrasings the corpus has never seen.
- **DECOMP_ATOM** (ADR-099) — multi-clause utterances ("make it brighter and add pricing and change the font") need realistic input fixtures for the conjunction-split path.
- **Listen-mode realistic transcripts** — the disfluencies, restarts, and natural-speech artifacts the Web-Speech STT actually produces (ADR-065 / ADR-066) are under-represented.

ADR-106 sets a **completeness floor** for the corpus before live-LLM eval (Tier-2 OC-12) goes live.

## Decision

### 1. Corpus floor at 500 entries — LLM-training-ready surface

The combined entry count across all corpus files MUST be ≥500. This is the seal-gate. Live-LLM eval harness (Tier-2 OC-12) is the consumer; HNSW indexing of the corpus (Tier-2) is the downstream optimization.

### 2. Six corpus files — two new categories

```
tests/prompts/
├── by-atom.json         (existing — extended for multi-page + DECOMP)
├── by-section.json      (existing — extended for agentic-product sections)
├── by-persona.json      (existing — extended for Lars / agentic-engineer)
├── edge-cases.json      (existing — extended for listen-mode transcripts)
├── multi-page.json      (NEW — page-targeting category)
└── template-triggers.json  (NEW — template-intelligence triggers)
```

The two new files isolate categories whose semantics are orthogonal to the original 4-file split (atom / section / persona / edge-cases). Mixing them into the existing files would have blurred the matrix.

### 3. Schema standard — every entry carries the same 8-field shape

```json
{
  "id": "string (unique within file)",
  "input": "string (realistic, production-quality)",
  "expectedAtom": "INTENT | ASSUMPTIONS | SELECTION | CONTENT | PATCH | DECOMP",
  "expectedVerb": "string (closed-verb set per ADR-066 / ADR-099)",
  "expectedTarget": "string? (section id or 'n/a')",
  "expectedRoute": "design | content | listen | n/a",
  "persona": "grandma | framer | capstone-reviewer | dev | designer | founder | lars | n/a",
  "difficulty": "easy | medium | hard | edge"
}
```

The schema is enforced by `tests/p81-prompt-library.spec.ts` (P81.4 — Per-file schema soundness; tolerant smoke check on the first entry of each file rather than every entry, so corpus authors can extend without churn).

## Out of scope (Tier-2 / post-RC carry-forwards)

- **Live-LLM eval harness** — DEFERRED to Tier-2 / OC-12. The corpus is the input; the runner that scores LLM responses against `expectedAtom` / `expectedVerb` is post-RC.
- **HNSW indexing of the corpus** — DEFERRED to Tier-2 commercial learning runtime per `plans/implementation/phase-61/03-ruvector-state.md`. Corpus is plain JSON; vector embedding is downstream.
- **Corpus localization (i18n)** — DEFERRED to post-RC. English-only floor for v1.
- **Cross-language disfluency coverage** — DEFERRED. Listen-mode transcripts are English-only.

## Acceptance gates

1. Combined corpus entry count ≥500 across the 6 JSON files.
2. `tests/prompts/multi-page.json` exists and is non-empty.
3. `tests/prompts/template-triggers.json` exists and is non-empty.
4. Each corpus JSON file has at least one entry carrying `id` + `input` + `expectedAtom` keys (tolerant smoke check).
5. Migration `src/contexts/persistence/migrations/004-prompt-library.sql` exists and is referenced by the persistence layer.
6. ADR-106 Accepted; cross-refs ADR-083 / ADR-098 / ADR-099.
7. ≥15 P81 tests GREEN in `tests/p81-prompt-library.spec.ts`.
8. No animation-library imports in any P81-owned source (Framer Motion / GSAP / Lottie / React Spring / animejs).

## Consequences

**Positive:**
- LLM-training-ready surface — once Tier-2 eval harness goes live, 500 entries is the floor that lets us measure atom-routing accuracy with statistical signal.
- Two new categories (multi-page, template-triggers) isolate their semantics — corpus authors can extend without cross-cutting churn.
- Tolerant smoke-check schema enforcement (first-entry-only per file) lets corpus authors add entries without coupling to the test spec.
- Closes Gap 7 (P2 high-leverage) from the 25-gap roadmap (`plans/strategic-reviews/2026-05-01-comprehensive-review-3-gaps-resolutions.md`).

**Negative:**
- Corpus diff is large (+220 entries) — JSON file sizes grow ~2× their P59 baselines.
- Two new files mean two new `existsSync` guards in the test spec (small but real surface).
- Realistic listen-mode transcripts include disfluencies that don't match the closed-verb set verbatim — caught via `difficulty: edge` tagging, not schema rejection.

**Mitigations:**
- File-by-file smoke check (not per-entry strict schema) keeps the seal-gate honest while leaving room for corpus growth.
- Two new files means clean blame-trail when corpus gets extended further (post-RC i18n, cross-language).
- `existsSync` guards on A1's surfaces in the P81 test spec keep the seal-gate honest under parallel-dispatch timing.
