# Prompt Library Coverage Matrix

**Phase:** P59 (post-RC test library)
**Corpus size:** 280+ entries across 4 JSON files
**ADR:** ADR-083

This document tracks what the `tests/prompts/` corpus covers today,
what's deferred to the live-LLM phase, and what gaps are explicitly
acknowledged (not bugs, not roadmap — just honest scope).

---

## Section 1 — What's covered today (P59 corpus)

### 1.1 Persona × atom matrix (6 × 5 = 30 cells)

Counts represent **prompts in `by-persona.json` that exercise each atom**.
Target floor per cell: ≥1. Total entries: 120 (6 personas × 20).

| Persona            | PATCH | INTENT | SELECTION | CONTENT | ASSUMPTIONS |
|--------------------|-------|--------|-----------|---------|-------------|
| grandma            | 6     | 5      | 3         | 4       | 2           |
| framer             | 4     | 5      | 5         | 4       | 2           |
| capstone-reviewer  | 3     | 4      | 4         | 5       | 4           |
| dev                | 5     | 4      | 4         | 4       | 3           |
| designer           | 4     | 4      | 5         | 5       | 2           |
| founder            | 5     | 4      | 4         | 4       | 3           |
| **per-atom total** | 27    | 26     | 25        | 26      | 16          |

ASSUMPTIONS is intentionally underweighted (16 vs 25–27) — it's the
low-confidence tail, not the load-bearing path. Live-LLM phase
explicitly drops ASSUMPTIONS success-rate floor to ≥50% per ADR-083.

### 1.2 Section type × verb matrix (16 × 6 = 96 cells, sparse)

Counts represent prompts in `by-section.json` for each `(section, verb)`
pair. Verbs are the ADR-066 closed set: `add / remove / change / move /
duplicate / clone`. Total entries: 80 (16 sections × 5).

| Section       | add | remove | change | move | duplicate | clone |
|---------------|-----|--------|--------|------|-----------|-------|
| hero          | 1   | 1      | 1      | 1    | 1         | 0     |
| features      | 1   | 1      | 1      | 1    | 1         | 0     |
| pricing       | 1   | 1      | 1      | 1    | 0         | 1     |
| testimonials  | 1   | 1      | 1      | 1    | 1         | 0     |
| cta           | 1   | 1      | 1      | 1    | 0         | 1     |
| footer        | 1   | 1      | 1      | 1    | 0         | 1     |
| nav           | 1   | 1      | 1      | 1    | 0         | 1     |
| about         | 1   | 1      | 1      | 1    | 1         | 0     |
| contact       | 1   | 1      | 1      | 1    | 0         | 1     |
| faq           | 1   | 1      | 1      | 1    | 1         | 0     |
| gallery       | 1   | 1      | 1      | 1    | 1         | 0     |
| team          | 1   | 1      | 1      | 1    | 0         | 1     |
| stats         | 1   | 1      | 1      | 1    | 0         | 1     |
| logos         | 1   | 1      | 1      | 1    | 0         | 1     |
| blog          | 1   | 1      | 1      | 1    | 1         | 0     |
| timeline      | 1   | 1      | 1      | 1    | 0         | 1     |
| **total**     | 16  | 16     | 16     | 16   | 7         | 9     |

Sparse on purpose — `clone` and `duplicate` are mutually exclusive per
section (clone preserves identity, duplicate forks). Total filled cells
80 of 96.

### 1.3 Difficulty distribution (`edge-cases.json` + spread)

| Difficulty   | Count | Source                           |
|--------------|-------|----------------------------------|
| trivial      | 35    | by-persona.json (grandma-arc)    |
| easy         | 65    | by-persona.json + by-atom.json   |
| medium       | 95    | by-section.json + by-atom.json   |
| hard         | 55    | by-atom.json (ASSUMPTIONS-heavy) |
| adversarial  | 30    | edge-cases.json                  |
| **total**    | 280   | corpus floor                     |

---

## Section 2 — What's deferred to live-LLM phase

The P59 corpus is a **library**, not a benchmark. The following are
explicitly out of scope for the corpus itself and are owned by
`docs/testing/live-llm-testing-plan.md`:

- **Real-LLM token cost validation per provider.** AgentProxy returns
  deterministic fixtures with zero cost; live providers each have their
  own pricing. Validating per-call cost stays under threshold needs
  real keys.
- **End-to-end accuracy on the 280 corpus.** AgentProxy returns
  deterministic stubs; live LLMs may produce variations. Accuracy
  measurement is statistical and provider-conditioned — not a corpus
  property.
- **Cross-provider AISP fidelity.** Whether Σ-restriction holds under
  Anthropic vs Google vs OpenAI vs OpenRouter is an empirical
  measurement that requires the matrix to actually run.
- **Personality-tone cross-correlation.** Geek-mode AISP-marker
  surfacing is a real-LLM behavior. AgentProxy fixtures cannot prove
  it; the corpus only labels prompts as "should surface AISP under
  Geek persona" — verification is post-RC.
- **Latency distribution per provider.** Sprint K's badge measures
  dev-mode AgentProxy latency. Real-world ranges require real network
  + real provider variance.

---

## Section 3 — Coverage gaps acknowledged

Honest scope boundaries — not bugs, not roadmap unless explicitly
upgraded:

- **Voice transcripts (Web Speech STT).** Not in corpus. STT output is a
  different data shape (interim + final hypotheses, confidence scores)
  and is exercised by `tests/p19-step*.spec.ts`. Cross-pollinating the
  corpus with STT fixtures was considered and rejected — different
  failure modes, different assertion surface.
- **Multi-turn conversations.** Corpus is single-turn. Each prompt is a
  one-shot input → atom output. Multi-turn (clarification loops,
  reference-back) is an ADR-065 concern that is partially exercised by
  ListenReviewCard but not parameterized into the corpus.
- **Brand context interactions.** Sprint H Λ.brand_voice channel
  (ADR-067) is not parameterized in the corpus. Brand uploads change
  the prompt rendering at runtime; capturing every brand-context shape
  in static JSON would explode the corpus. Brand interactions stay in
  `tests/p44-brand-upload.spec.ts`.

These gaps are **acknowledged**, not **planned**. Upgrading any of
them to corpus-resident requires a new ADR (ADR-083 successor or
sibling).
