# Prompt Library Coverage Matrix

**Phase:** P81 / OC-16 (corpus expansion 280 → 511)
**Corpus size:** 511 entries across 6 JSON files
**ADRs:** ADR-083 (P59 baseline), ADR-106 (P81 expansion — multi-page + template-triggers categories)

This document tracks what the `tests/prompts/` corpus covers today,
what's deferred to the live-LLM phase, and what gaps are explicitly
acknowledged (not bugs, not roadmap — just honest scope).

## Section 0 — File map (P81)

| File                       | Entries | Focus                                                          |
|----------------------------|---------|----------------------------------------------------------------|
| `by-atom.json`             | 85      | Per-atom dispatch (PATCH / INTENT / SELECTION / CONTENT / ASSUMPTIONS / DECOMP) |
| `by-section.json`          | 126     | Section × verb matrix (incl. P75 case-study + contact-form, P80 agentic-product sections) |
| `by-persona.json`          | 155     | Persona × atom matrix (incl. P81 agentic-engineer + Lars expansion) |
| `edge-cases.json`          | 65      | Adversarial + listen-mode disfluencies + DECOMP multi-clause   |
| `multi-page.json` (NEW)    | 45      | Multi-page targeting (`pageId`-bearing entries; P78/P79 wire)  |
| `template-triggers.json` (NEW) | 35  | Template intelligence triggers (P72 / P73 / P80 libraries)     |
| **TOTAL**                  | **511** | corpus floor (≥500)                                            |

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
| easy         | ~115  | by-persona.json + by-atom.json + multi-page.json |
| medium       | ~195  | by-section.json + by-atom.json + multi-page.json + template-triggers.json |
| hard         | ~85   | by-atom.json (ASSUMPTIONS + DECOMP) + by-persona.json |
| edge         | ~35   | edge-cases.json (P81 disfluencies + multi-clause) + multi-page.json |
| adversarial  | 30    | edge-cases.json (legacy P59)     |
| **total**    | 511   | corpus floor (≥500)              |

### 1.4 Multi-page targeting (`multi-page.json` — NEW P81)

45 entries exercising the page-aware patch-routing path landed by P78
(ADR-103, page selector + `activePageId`) and P79 (ADR-104, page-aware
chat pipeline + `pageIterator` module + `scopeRoot` prefix at apply
sites). Every entry carries `expectedTarget.pageId` so the matcher and
applyPatches stage can be tested against page-naïve regressions.

| Sub-category               | Count | Examples                                          |
|----------------------------|-------|---------------------------------------------------|
| Section on specific page   | 17    | "change page 2 hero", "hide gallery on page 3"    |
| Page lifecycle (add/remove)| 9     | "add a pricing page", "delete the contact page"   |
| Page rename                | 5     | "rename page 2 to about"                          |
| Page navigation            | 6     | "switch to home page", "go to the pricing page"   |
| Cross-page operations      | 4     | "duplicate hero from page 1 to page 2"            |
| All-pages scope            | 3     | "change footer on every page", `pageId: "all"`    |
| Active-page resolver       | 1     | "rewrite hero on the active page"                 |
| **total**                  | **45**| ≥40 floor                                         |

`pageId` value space: `home`, `about`, `contact`, `pricing`, `careers`,
`page-2`, `page-3`, `page-4`, `all`, `active`. Matches P78 schema
(`pages[].id`) and P79 `pageIterator.getActivePage(...)` resolver.

### 1.5 Template-trigger phrasings (`template-triggers.json` — NEW P81)

35 entries exercising the SELECTION_ATOM dispatch path. Each entry maps
a natural-language trigger phrase to the SELECTION atom — the matcher
is then expected to rank candidates from the P72/P73 template
intelligence libraries (21 themes / 15 sections / 15 content styles
per ADR-098 + P73 fix-pass). Coverage includes the 4 P80 agentic-product
templates and the 3 P73 new themes.

| Library family                    | Count | Examples                                          |
|-----------------------------------|-------|---------------------------------------------------|
| Theme triggers (incl. P73 +3)     | 11    | "dark feminine", "industrial modern", "neon"     |
| Section arrangements (P73 +3)     | 4     | "course-landing", "booking calendar", "newsroom" |
| Content styles (P73 +3)           | 3     | "instructional", "punchy social", "sales pressure" |
| Agentic-product (P80 +4)          | 4     | "agent marketplace", "ai coding copilot", etc.   |
| Brand mimicry (Linear/Stripe)     | 2     | "make it look like Linear/Stripe"                 |
| Fuzzy quality phrases             | 5     | "more fun", "more agency vibes", "minimalist"    |
| Persona-style triggers            | 2     | "don miller style", "law firm site"               |
| Vertical templates (legacy)       | 4     | "wellness", "bakery", "personal brand"            |
| **total**                         | **35**| ≥30 floor                                         |

These prompts are **selection-atom-only** by design — they should NOT
be classified as PATCH/INTENT/CONTENT. Live-LLM phase will measure
whether matcher rank-1 hits the implied template ≥75% of the time;
corpus only labels the dispatch atom.

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
