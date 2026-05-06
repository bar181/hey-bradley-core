# P113 — Retrospective

> **Phase:** P113 · **Sprint:** QUALITY-PUSH · **Date:** 2026-05-06
> **Branch:** swarm/p113-quality-push
> **Outcome:** ADR-141 Accepted; 26 P113 tests GREEN; cumulative ≥306 GREEN

## Quality push outcomes

### AISP density (the structured-prose question)

The audit asked: is AISP currently structured prose dressed in symbols, or genuine Σ-formal markup that any LLM parses identically? Answer pre-P113: closer to structured prose — 3 high-traffic atoms scored Bronze or Reject under `scoreAisp()`. Answer post-P113: the format IS suitable when symbol density is exercised.

| Atom | Before | After | Tier | Ambig | LOC delta |
|------|--------|-------|------|-------|-----------|
| PATCH_ATOM | 0.188 (Reject) | 0.549 | Silver | 0.01 | ~15 |
| INTENT_ATOM | 0.262 (Bronze) | 0.516 | Silver | 0.01 | ~12 |
| PROCESS_ATOM | 0.266 (Bronze) | 0.607 | **Gold** | 0.01 | ~13 |

Honest verdict: the regex-symbol-density jump shows AISP atoms can hit Silver+ without bloat; PROCESS hit Gold with the same change pattern. The full Σ_512 verdict still pends ADR-C07 Wave 4 (the TS heuristic stopgap covers ~40 of 512 symbols; under-counts on more-exotic atoms).

### Storytelling library (avoiding the generic)

8 presets shipped under `src/data/storytelling/`:

1. don-miller-storybrand (hero/problem/guide/plan)
2. theron-miller-hard-twist (anecdote → unexpected pivot → earned)
3. founder-direct (specific numbers, restrained-not-bro)
4. academic-rigor (claim/evidence/counterargument/sources)
5. dry-humor-narrator (specific + dry + over-precise)
6. beers-and-pizza-casual (paragraphs, real talk)
7. investigative-deep-dive (lead with question, follow thread)
8. contrarian-tech (consensus is X; here's why wrong)

Each preset cites which surface types it suits best (`bestFor`) and ships a ~50-word real prose sample in voice. Mapping to the 5 new example sites:

- podcaster-indie → dry-humor-narrator (over-precise specifics; named characters)
- course-creator-tech → founder-direct (cohort numbers, specific curriculum)
- contrarian-blog → contrarian-tech (consensus framing + sharp opinions)
- indie-author-fiction → theron-miller-hard-twist (sensory opening + earned pivot)
- research-newsletter → academic-rigor (citations, counterarguments, limits)

Chat + listen + builder pipelines can reference presets by id via `getPresetByName('contrarian-tech')` or by inferring from existing `voiceAttributes` via `getPresetForVoice([...])`. P113 wires the library as a public surface; chat-pipeline consumption is a P114+ option, not a P113 requirement.

### Voice extraction (closes chat-blog gap)

Pre-P113: chat blogs scored 7.0/10; listen blogs 9.5/10. The asymmetry came from listen mode running `cleanTranscript` (ADR-127) which produced disfluency-stripped voice signal — chat mode had no equivalent.

Post-P113: when `chatPipeline.submit()` fires with `source==='chat'` AND the prompt is whole-site/initial AND current `site.voiceAttributes` is empty, the rules-based extractor scans 16 single-keyword cues (`punchy`, `dry`, `contrarian`, `founder`, `academic`, ...) and 6 bigram cues (`"founder voice"`, `"sharp opinions"`, `"plain spoken"`, ...) — when ≥1 cue fires with confidence > 0.5, a JSON-Patch lands `replace /site/voiceAttributes` BEFORE downstream paths so template-matcher / decomp / LLM all see populated voice context.

Honest carry-forward: the extractor is rules-based, not LLM-enriched. CF#4 (BYOK live LLM) ships richer voice inference; P113's stopgap closes the floor.

### What's still deferred

- **Full Σ_512 → ADR-C07 Wave 4.** The TS heuristic in P112 / ADR-140 lets us report honest tier numbers today but under-counts symbols outside its 40-symbol subset.
- **LLM-enriched voice extraction → CF#4 BYOK.** Live runs unlock content-generator quality lift on top of the rules baseline.
- **Auto-route presets to chat content generators → P114+.** The library is wired as a public surface; consumers at the content-generation seam are P114+ if signal warrants.

## Keep / drop / reframe

### Keep

- **4-agent disjoint-scope Wave 1 dispatch.** Same pattern that landed P110-P112 cleanly. Each agent owned a discrete file set with no shared edits; closer (A5) integrated.
- **Density-verified-against-stopgap.** Rather than "we added some symbols," every atom edit was verified against `scoreAisp()` with explicit before/after numbers. Honest measurement.
- **Real prose in samplePassages.** No Lorem; no stub text; ~50 words in voice. The library demonstrates each archetype rather than describing it.
- **JSON-Patch for voice extraction.** Re-uses the existing patch-apply path so logging + redaction + atom-purity are all handled by paths that already exist.

### Drop

- **The "make AISP feel formal by adding lots of symbols" framing.** The win wasn't symbols-for-symbols-sake; the win was *replacing prose constraints with their AISP-symbol equivalents while preserving semantics*. Future atom edits should follow the same equivalent-rewrite rule, not "add ∀ everywhere."

### Reframe

- **The storytelling library is the new opinionation surface.** Earlier sprints added templates (P56, P68, P80) — that scaled section variety. P113 adds *voice variety* via presets that map to existing voiceAttributes. Future sprints should think "what's the voice gap?" before "what's the section gap?"

## Carry-forwards (next phase candidates)

1. **WASM crate landing (ADR-C07 Wave 4)** — replaces `src/lib/aisp-score/` stopgap with canonical scorer; 60-day upstream window from P112.
2. **CF#4 BYOK live-LLM smoke** — owner-action; unlocks voice-extraction LLM enrichment + AISP atom round-trip evaluation.
3. **Auto-routing presets to chat content generators** — when chat-mode picks `voiceAttributes`, content generators consult `getPresetForVoice()` to pull `openingPattern` / `bodyPattern` / `closePattern` for blog post / about-page / landing-page generation. P114+.
4. **Husky pre-commit wire (owner-action)** — `bash scripts/run-gates.sh || exit 1` into `.husky/pre-commit`; carry-forward from ADR-138 D3 / ADR-139 D3 / ADR-140 D3 (sandbox-blocked at agent level).

## Acceptance gates (final)

- [x] ADR-141 Accepted with cross-refs ADR-C07 + ADR-126 + ADR-127 + ADR-134 + ADR-140
- [x] 3 atoms hit Silver+ tier (PATCH 0.549 / INTENT 0.516 / PROCESS 0.607)
- [x] Each atom Ambig <0.02 (all 0.01)
- [x] 8 storytelling presets shipped with required 7-field shape + 30-100 word samplePassage
- [x] 5 NEW example sites; EXAMPLE_SITES = 56; each site has voiceAttributes ≥3
- [x] Voice extraction module + ≥1 chatPipeline call site
- [x] Atom-purity preserved (zero React + zero fs in new modules)
- [x] ≥15 P113 tests GREEN (26 actual)
- [x] Cumulative regression ≥306 GREEN
- [x] EOP triplet present + retrospective has "Quality push outcomes" section
- [x] CLAUDE.md sync includes P113 + ADR-141
