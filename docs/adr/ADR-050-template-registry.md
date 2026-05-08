# ADR-050: Template-First Chat Architecture

**Status:** Accepted
**Date:** 2026-04-27 (P23 Sprint B Phase 1)
**Deciders:** Bradley Ross
**Phase:** P23

## Context

Through P22, every chat input went through `auditedComplete` → adapter → LLM → patch validator → applyPatches. Even trivially-structured intents ("hide the hero", "make it brighter") cost an LLM call, ~500ms latency, and produced an `llm_logs` row.

Sprint B mandate: introduce **real templates** (not regex fixtures wired through the FixtureAdapter interface). Templates short-circuit the LLM entirely on high-confidence matches. They differ from fixtures in three ways:

1. **Where they live in the pipeline:** templates run BEFORE `runLLMPipeline`, not as an adapter implementation
2. **Audit shape:** template hits do NOT write to `llm_calls` or `llm_logs` (zero LLM cost; recorded as `source='template'` in chat_messages instead — P24 will wire this)
3. **Production scope:** templates are first-class production code; fixtures were a DEV-only LLM proxy for offline demos

## Decision

### Architecture

```
user input
  ↓
chatPipeline.submit()
  ↓
tryMatchTemplate(text)        ← NEW (P23)
  ├── confidence ≥ 0.8 + patches.length > 0
  │     → applyPatches → return ok with "(template: <id>)" suffix
  ├── confidence ≥ 0.8 + patches.length === 0 (target absent)
  │     → return friendly empty-patch summary; skip LLM
  └── no match
        → fall through to runLLMPipeline (existing path)
```

### Files

- `src/contexts/intelligence/templates/types.ts` — `Template` + `TemplateMatchResult` + `TemplateMatchContext`
- `src/contexts/intelligence/templates/registry.ts` — 3 first-class templates (P23 baseline)
- `src/contexts/intelligence/templates/router.ts` — `tryMatchTemplate(text)` + `CONFIDENCE_THRESHOLD = 0.8`
- `src/contexts/intelligence/templates/index.ts` — barrel export

### P23 baseline templates (3)

| id | matchPattern | result |
|---|---|---|
| `make-it-brighter` | `make it brighter` / `brighten` / `make the page brighter` | replace `theme/palette/accentPrimary` + `bgSecondary` with brighter cream tokens |
| `hide-section` | `hide the <type>` (hero / blog / footer / features / etc) | `op: replace path: /sections/<n>/enabled value: false` resolved by `findSectionByType` |
| `change-headline` | `change/set/update the headline to "X"` | replace hero heading text resolved by `heroHeadingPath` |

### Confidence

P23 uses binary confidence (regex match = 1.0; no match = 0.0). The threshold (0.8) is a placeholder for Sprint C P26 (AISP intent classifier) which will produce real probabilistic scores. Confidence on `Template` is overridable per-template for future scoring.

### Distinction from fixtures (`src/data/llm-fixtures/step-2.ts`)

| Aspect | Fixtures (FixtureAdapter) | Templates (this ADR) |
|---|---|---|
| Active in production? | DEV / mock-mode only | YES (always-on; first chatPipeline step) |
| Goes through adapter contract? | Yes (FixtureAdapter implements LLMAdapter) | No (short-circuits before adapter dispatch) |
| Writes llm_calls? | Yes (audited as adapter call) | No (P24 will record `source='template'` in chat_messages) |
| Selection mechanism | First-match regex via FixtureAdapter | `tryMatchTemplate` first-match through TEMPLATE_REGISTRY |
| Cost | $0 (mock data) but counted in audit | $0 and not counted as LLM call |

### Trade-offs accepted

- **First-match wins.** Registry order matters with 3 entries. Sprint C will replace this with scored selection.
- **No template UI.** Users won't see "templates" in Settings. The `_(template: <id>)_` suffix in chat summary is the only surface today.
- **No per-template enable/disable.** All templates always-on. Future Settings toggle if needed.
- **Template module is dynamic-imported** in `chatPipeline.submit()` to keep code-split clean and tolerate module load failure gracefully.

## Consequences

- (+) Cheap intents (`make it brighter`, `hide the hero`) cost $0 and run in <50ms instead of ~500ms LLM round-trip
- (+) Deterministic patches for high-frequency intents — no LLM nondeterminism
- (+) Foundation for Sprint C AISP intent classifier (replaces binary confidence with probabilistic score)
- (+) Friendly empty-patch responses for "hide the hero" when active config has no hero (no wasted LLM call)
- (-) Registry ordering matters; future scaling needs scored selection
- (-) Template miss still pays the LLM cost (no caching of misses)
- (-) Template hits don't persist to llm_logs (separate `source='template'` audit deferred to P24)

## Cross-references

- ADR-044 (JSON Patch Contract) — templates emit the same patch envelope shape
- ADR-045 (System Prompt AISP) — Sprint C AISP intent classifier will replace binary confidence
- ADR-049 (Cost-Cap Telemetry) — template hits skip cost accumulation entirely
- ADR-052 (AISP Intent Classifier — proposed) — supersedes / extends router
- `phase-22/wave-1/A2-sprint-plan-review.md` §B — Sprint B P21 plan source

## Status as of P23 seal

- 3 templates registered ✅
- `tryMatchTemplate` wired into `chatPipeline.submit()` BEFORE `runLLMPipeline` ✅
- Confidence threshold 0.8 enforced ✅
- Friendly empty-patch summaries for missing targets ✅
- 5 Playwright cases (`tests/p23-simple-chat.spec.ts`) cover 3 template hits + 1 friendly miss + 1 LLM fallthrough ✅
- Build green; tsc clean ✅
