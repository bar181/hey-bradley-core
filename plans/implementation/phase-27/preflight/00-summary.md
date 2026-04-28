# Phase 27 — Preflight 00 Summary

> **Phase title:** Sprint C Phase 2 — AISP Intent Pipeline (LLM-driven classification)
> **Status:** PREFLIGHT (activates post-P26 seal)
> **Successor of:** P26 (Sprint C P1 — AISP Crystal Atom + rule-based classifier) sealed at composite 89
> **Successor:** P28 (Sprint C P3 — 2-step template selection)

## North Star

> **When the rule-based AISP classifier is below confidence threshold, the SAME Crystal Atom is sent to the LLM as the system prompt. The LLM returns a structured Intent that conforms to the atom's Σ schema. Thesis demonstration: "LLMs understand AISP natively."**

## Pipeline becomes (P27)

```
user input
  ↓
classifyIntent (rule-based, P26)        ← runs first; $0 cost
  ├── confidence ≥ 0.85 → emit Intent → router → patch
  └── confidence < 0.85 → llmClassifyIntent (NEW P27)
       ↓
     LLM call w/ INTENT_ATOM as system prompt
       ↓
     Response parsed via Zod (Intent shape)
       ↓
     ├── Zod-valid + confidence ≥ 0.85 → emit Intent → router → patch
     └── Zod-invalid OR confidence < 0.85 → fall through to P25 + LLM patch generator
```

## Scope IN (P27)

- `src/contexts/intelligence/aisp/llmClassifier.ts` — new module
- `llmClassifyIntent(text)` calls existing LLM adapter with `INTENT_ATOM` as system prompt
- Zod schema for the LLM response (mirrors Crystal Atom Σ)
- Cost-cap aware: classifier respects existing per-session cap; uses cheap model (Haiku / Gemini Flash)
- Updates `chatPipeline` to call llmClassifyIntent when rule-based AISP returns confidence < threshold
- ADR-054b (LLM-driven AISP classification) — minor amendment to ADR-053, OR new ADR-055
- +5 unit tests (mocked LLM)

## Scope OUT (P28+)

- 2-step template selection (P28 — first LLM picks theme; second LLM modifies)
- Multi-intent handling (Sprint D)
- Per-verb confidence threshold tuning

## Effort estimate

- ~30m llmClassifier module
- ~15m chatPipeline integration
- ~30m ADR + 5 tests
- ~15m retro + seal
- **Total: ~1.5h** at velocity

## Files (planned)

| File | Type | Purpose |
|---|---|---|
| `src/contexts/intelligence/aisp/llmClassifier.ts` | NEW | LLM-driven classifier; uses INTENT_ATOM |
| `src/lib/schemas/intent.ts` | NEW | Zod schema for parsed Intent response |
| `src/contexts/intelligence/chatPipeline.ts` | EDIT | call llmClassifyIntent on low rule-based confidence |
| `docs/adr/ADR-053-aisp-intent-classifier.md` | EDIT | append "Status as of P27" amendment |
| `tests/p27-aisp-llm.spec.ts` | NEW | 5+ pure-unit + mocked-LLM cases |

## DoD

- [ ] `llmClassifyIntent(text)` calls adapter w/ INTENT_ATOM system prompt
- [ ] Zod-validate response against Intent shape (Σ schema)
- [ ] Cost-cap check before LLM call; skip if over cap
- [ ] chatPipeline runs LLM AISP only when rule-based AISP confidence < threshold
- [ ] +5 unit tests with mocked adapter (no real LLM cost)
- [ ] ADR amendment (Status as of P27)
- [ ] Build green; tsc clean
- [ ] Retro + STATE + P28 preflight

## Composite target

- Grandma 76+ (held)
- Framer 87+ (held)
- Capstone 94+ (+1 from P26; LLM+AISP loop is the full thesis demonstration)
- **Target: 89-90/100**

## Cross-references

- ADR-053 (AISP Intent Classifier; sealed P26)
- ADR-045 (System Prompt AISP; P18) — pattern for embedding AISP atom in system prompt
- P26 retrospective: `phase-26/retrospective.md`
- `bar181/aisp-open-core ai_guide` — Crystal Atom canonical spec

---

**Phase 27 activates immediately on owner greenlight.** Sprint C continues.
