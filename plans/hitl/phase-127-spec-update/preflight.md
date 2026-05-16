# P127 / SPEC UPDATE PIPELINE — Preflight

> **Mission:** Build the backend pipeline that turns a MasterConfig into a
> 7-document spec bundle, using LLM-driven generation with strict templates,
> chunking, and quality gates. UI integration (the Agentics "Update the
> Specifications" card with green/yellow badges + progress bar + checklist)
> is the next-session deliverable; this phase ships the engine the UI will
> call.
>
> **Branch:** `swarm/p127-spec-updater` (cut from `main` after PR #5 merges).

---

## 1. Owner-locked decisions

- **Spec order:** AISP first (drives every other spec). Then North Star, Features, Architecture, CSS, Build Plan, Human Spec.
- **AISP is two-step:** Step 1 emit content in AISP format · Step 2 quality recheck against the AISP guide (math-first, ⟦Ω⟧⟦Σ⟧⟦Γ⟧⟦Λ⟧⟦Ε⟧ blocks, prose only when required, target Σ_512 symbol set, Ambig(D) < 0.02).
- **CSS and content are separate calls.** CSS = design tokens / palette / typography in JSON shape. Content = narrative for the North Star. Don't conflate.
- **Don't send raw long-form content to the LLM.** Parse deterministically from MasterConfig fields. The LLM only sees a structural summary + brief.
- **Chunking by priority.** If a spec needs multiple sections, dispatch them in priority order (e.g., North Star: elevator pitch first, then audience, then win condition).
- **Limited options per section.** Each spec template enumerates the allowed sections/fields. LLM must respond only with those keys — no free-form additions.
- **$10 budget.** Estimated spend per full 3-site run: ~$0.15.
- **Save chat history with clock time per call** in `runs/{site}/chat-history.jsonl`.

## 2. Feature roster

| # | Feature | Scope | Status |
|---|---|---|---|
| **F1** | ADR-156 — Spec update pipeline | Document the 7-spec architecture, AISP two-step, CSS-vs-content split, chunking strategy, template-driven prompts, validation gates | pending |
| **F2** | Prompt templates | One JSON-format template per spec type: { systemPrompt, exampleOutput, validation, allowedSections, chunkStrategy }. Located in `templates/` | pending |
| **F3** | Spec updater script | `scripts/p127-spec-updater.mjs` — reads MasterConfig, runs ordered pipeline, applies chunking, runs AISP two-step, validates each output, saves MD + chat history + timing | pending |
| **F4** | Determinitistic parsers | Helpers that extract structural info from MasterConfig without LLM — section types, counts, palette hex, typography, brand strings | pending |
| **F5** | Validation gates | Per-spec structural validator (regex/JSON) that confirms required blocks present before marking spec "fresh" | pending |
| **F6** | Run on 3 P126 examples | Generate full spec bundles for blog / portfolio / marketing using `iter-3-verified/output/{site}/final-config.json` as input | pending |
| **F7** | Per-site report | `runs/{site}/index.md` summarizing all 7 specs + costs + timing + validation status | pending |

## 3. ADRs to write

| ADR | Topic | Trigger |
|---|---|---|
| **ADR-156** | Spec update pipeline (ordering · AISP two-step · CSS/content split · chunking · template-driven prompts · validation) | F1 |

## 4. Pipeline architecture

```
                        ┌────────────────────────────────────────┐
                        │      MasterConfig (current site)       │
                        └──────────────────┬─────────────────────┘
                                           ▼
                          ┌──── Deterministic parsers ────┐
                          │  · site/brand strings         │
                          │  · section types + counts     │
                          │  · palette hex                │
                          │  · typography                 │
                          │  · component summary          │
                          └────────────────┬──────────────┘
                                           ▼
   ┌─────────────────────────────────────────────────────────────────┐
   │   Spec pipeline (in priority order, gated by validation)        │
   │                                                                 │
   │   1. AISP (2-step)                                              │
   │      a. emit content in AISP format                             │
   │      b. quality recheck against AISP guide                      │
   │      output: aisp.md (≥5 required blocks)                       │
   │                                                                 │
   │   2. North Star                                                 │
   │      input: structural summary + AISP Ω block                   │
   │      output: north-star.md (elevator + audience + win condition)│
   │                                                                 │
   │   3. Features                                                   │
   │      input: structural summary + section component counts       │
   │      output: features.md (5-15 items, name + desc + priority)   │
   │                                                                 │
   │   4. Architecture (SADD)                                        │
   │      input: structural summary + AISP Γ block                   │
   │      output: architecture.md (bounded contexts + data flow)     │
   │                                                                 │
   │   5. CSS / Design tokens (JSON shape)                           │
   │      input: theme palette + typography from config              │
   │      output: css.md (JSON code block with tokens)               │
   │                                                                 │
   │   6. Build Plan                                                 │
   │      input: features list                                       │
   │      output: build-plan.md (phased table)                       │
   │                                                                 │
   │   7. Human Spec                                                 │
   │      input: all prior outputs (compressed)                      │
   │      output: human-spec.md (≤2 page narrative summary)          │
   └─────────────────────────────────────────────────────────────────┘
                                           ▼
                          ┌──── Per-site artifacts ────┐
                          │  specs/*.md (7 files)      │
                          │  chat-history.jsonl        │
                          │  timing.json               │
                          │  cost.json                 │
                          │  validation.json           │
                          │  index.md                  │
                          └────────────────────────────┘
```

## 5. DoD — completion gates

- [ ] **F1** ADR-156 committed
- [ ] **F2** 7 templates authored (one per spec type) + AISP-quality template
- [ ] **F3** `scripts/p127-spec-updater.mjs` runs cleanly
- [ ] **F4** Deterministic parsers produce a fixture-driven structural summary
- [ ] **F5** Validation gates fire (FAIL on missing required blocks)
- [ ] **F6** Full run completed for blog / portfolio / marketing — all 7 specs PASS validation per site
- [ ] **F7** Per-site `index.md` reports written
- [ ] **Build** stays green (we don't touch production code paths this phase — script-only)
- [ ] **session-log.md** updated throughout
- [ ] **retrospective.md** completed at seal

## 6. Quality bar — per-spec validation

| Spec | Must contain | Hard fail if missing |
|---|---|---|
| **AISP** | `⟦Ω`, `⟦Σ`, `⟦Γ`, `⟦Λ`, `⟦Ε` blocks; `≜` defs; ≥1 `∀` quantifier | any of the 5 ⟦⟧ headers absent |
| **North Star** | "elevator pitch:" line; "audience:" line; "win condition:" line; ≤30 lines | any of 3 headers missing |
| **Features** | numbered/bulleted list of 5-15 items each with name + description + priority | <5 items or no priority |
| **Architecture (SADD)** | "bounded contexts" section; "data flow" section; ≥3 contexts named | either section missing |
| **CSS** | JSON code block with `palette`, `typography`, `spacing` keys | non-JSON or missing key |
| **Build Plan** | markdown table with ≥3 phases, columns: phase / scope / DoD | table absent or <3 rows |
| **Human Spec** | ≤300 words, prose, no jargon, no AISP symbols | over 300 words OR contains ⟦⟧ |

## 7. Budget + chunking rules

- $10 phase budget. 7 specs × 3 sites = 21 calls + 3 AISP-quality rechecks = 24 calls. Expected spend ≈ $0.15.
- For any spec whose required output exceeds ~2000 tokens, split into 2 calls. AISP is the only spec where this is plausible today.
- The structural summary sent to the LLM is capped at 4KB. If MasterConfig is larger, the deterministic parser compresses it (drops component-level props text, keeps types + counts + brand fields).

## 8. UI deferral note

This phase ships ONLY the backend pipeline. The Agentics card with green/yellow badges, "Update the Specifications" button, per-spec progress bar, and checklist UI is the next phase's main effort. The pipeline outputs (validation status + timing per spec) are the data feed the UI will consume.

## 9. Risks

- **AISP quality drift:** LLM may emit symbols outside Σ_512. Mitigation: validation regex + two-step (recheck call).
- **Determinitistic parser misses brand fields:** Mitigation: explicit field allow-list in `parsers.mjs` + unit-test on the 3 P126 fixtures.
- **Large prompts blow context:** Mitigation: 4KB cap + drop-content-keep-structure compressor.
- **Cost overrun:** 24 calls × <$0.005 each ≈ $0.12; well under $10 cap.

## 10. Rollback plan

This phase touches only:
- `scripts/p127-spec-updater.mjs` (new file)
- `plans/hitl/phase-127-spec-update/` (new tree)
- ADR-156 (new file)

No production code modified. Rollback = `git revert` the single P127 commit.
