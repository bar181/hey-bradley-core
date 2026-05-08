# P100 W2 — Scenario 2 Trace (Adversarial Edge Cases) — Agent B2

> **Owner:** Agent B2 — live pipeline trace of `tests/fixtures/scenario-2-edge-cases.ts` against the rules-based AISP path.
> **Repo state:** `claude/verify-flywheel-init-qlIBr` — P100 W2 sealed at `de10b3a`.
> **Sibling-disjoint:** B1 owns Axon CLI dev; B3 owns listen mode; B4 owns Planning SaaS auth. This file is the only B2-owned artifact.

---

## §1 Methodology

Cannot literally invoke `chatPipeline.submit()` from Node — it depends on `useConfigStore` (browser zustand), `sql.js` (DB worker), and `BroadcastChannel` (DOM). Instead, three pure-function pipeline stages were invoked directly via `tsx` against the verbatim 10 fixture prompts (`tests/fixtures/scenario-2-edge-cases.ts:47-168`):

1. `classifyIntent(text, null)` — `src/contexts/intelligence/aisp/intentClassifier.ts:127-172`. `projectType=null` per default codebase-context absence (`chatPipeline.ts:351-372`).
2. `decompose(text, intent)` — `src/contexts/intelligence/aisp/decompAtom.ts:237-279`. `pages` argument omitted → P74 byte-equivalent path.
3. A7 atom helpers — `isUnmeasurableGoal` (`intentAtom.ts:197`), `hasContradiction` (`decompAtom.ts:284`), `ASSUMPTIONS_FALLBACK_TEMPLATES` (`assumptionsAtom.ts:144-148`).

LLM-divergence points (uncovered by the rules path) are flagged per-prompt in §2:

- **D1**: `llmClassifyIntent` second-pass at `chatPipeline.ts:381-388` — fires when rules-confidence `< 0.85` OR `target === null`. AgentProxy returns vetted fixtures only; no real LLM call exercised here.
- **D2**: `generateAssumptions` LLM lift at `assumptionsLLM.ts` (not invoked in B2; ASSUMPTIONS pipeline branch lives downstream of low-confidence intent in the actual chat flow).
- **D3**: `classifyRoute(...)` at `chatPipeline.ts:411` — pure-rule, runs unconditionally; B2 traces do not invoke it but route is reportable from text cues.

Constants confirmed at runtime:

- `AISP_CONFIDENCE_THRESHOLD = 0.85` (`intentAtom.ts:159`)
- `CONTRADICTION_RE = /\b(?:remove|delete|drop|hide)\b[^.;]*\band\s+add\s+(?:it|them|that|the\s+\w+)\s+back\b/i` (`decompAtom.ts:282-283`)
- `UNMEASURABLE_GOAL_RE = /\b(?:make\s+(?:it|this|the\s+site)\s+(?:perfect|better|nicer|amazing|awesome|cool|great)|fix\s+(?:it|this)|this\s+is\s+wrong|idk\s+make)/i` (`intentAtom.ts:195-196`)

ASSUMPTIONS-trigger gate condition (per `chatPipeline.ts:380`): `aisp.confidence < AISP_CONFIDENCE_THRESHOLD || !aisp.target`. Note: this gate enters the **LLM-fallback re-classification** branch first (D1); ASSUMPTIONS surfacing is downstream when both paths fail.

---

## §2 Per-prompt traces (10 adversarial)

### Prompt 1 — `"make it brighter and more fun and add pricing and change the font to something nice"`

- **INTENT**: verb=`change` conf=`0.90` target=`{type:'pricing',index:null}` params=`{value:"something nice"}` → **above 0.85 + has target** → no ASSUMPTIONS.
- **DECOMP**: 4 todos (`brighter→theme/0.9`, `fun→tone/0.6`, `pricing→section/0.9`, `font to something nice→unknown/0.6`); aggregate `0.75 ≥ 0.7` → short-circuit fires; expected `partial`.
- **ASSUMPTIONS check**: NOT triggered (0.90 ≥ 0.85, target present). Fixture expects no ASSUMPTIONS → **MATCH**.
- **CONTRADICTION_RE**: `false` (correct; not adversarial here).
- **UNMEASURABLE_GOAL_RE**: `false` (correct).
- **Vague target**: target resolved cleanly to `pricing` (first allowed-type hit); **MATCH**.
- **Verdict**: matches fixture `partial`/4-todos/`high` confidence band.

### Prompt 2 — `"idk make it better"`

- **INTENT**: verb=`change` conf=`0.71` (`make_it` synonym → 0.86 base − 0.15 target penalty) target=`null` → **below 0.85 OR no target** → triggers LLM-fallback (D1). Real LLM may or may not classify; fallthrough → ASSUMPTIONS path expected.
- **DECOMP**: 1 todo (whole utterance/`unknown`/`modify`/0.6); short-circuit gate `>1 ∧ ≥0.7` NOT satisfied → falls to template-matcher → SELECTION → ASSUMPTIONS.
- **ASSUMPTIONS check**: triggered (0.71 < 0.85, target null). Fixture expects ASSUMPTIONS → **MATCH**.
- **UNMEASURABLE_GOAL_RE**: `true` (caught by `idk\s+make` branch + `make...better` branch). **A7 helper would correctly flag this** — but it is **NOT WIRED** to chatPipeline (see §3).
- **Vague target**: `null` (correct — graceful fallback through template-matcher → ASSUMPTIONS).
- **Verdict**: matches fixture `clarification`. A7 helper detects but is unused.

### Prompt 3 — `"CHANGE EVERYTHING TO DARK MODE NOW"`

- **INTENT**: verb=`change` conf=`0.75` (0.90 verb − 0.15 target penalty) target=`null` (the words "EVERYTHING/DARK/MODE/NOW" are not in `ALLOWED_TARGET_TYPES`) → **below 0.85** → triggers D1 LLM-fallback.
- **DECOMP**: 1 todo (`modify`/`theme`/0.9 — "dark" hits theme keyword table at `decompAtom.ts:124-126`); single-todo → no short-circuit.
- **ASSUMPTIONS check**: triggered by rules path (`0.75 < 0.85`, target null). Fixture expects `succeed` (no ASSUMPTIONS) → **MISMATCH** at rules layer. Fixture appears to assume the LLM-fallback (D1) successfully classifies "everything→theme" and returns confidence ≥ 0.85. The rules path alone would surface a clarification picker.
- **CONTRADICTION_RE**: `false` (correct).
- **UNMEASURABLE_GOAL_RE**: `false` (correct — "everything" not in pattern).
- **Vague target**: `null`; `theme` IS in `ALLOWED_TARGET_TYPES` but `findAllTargetTypes` only matches whole-word `theme`/`color`/etc. — `dark mode` does not lexically include `theme`. Real fix: D1 LLM-fallback OR widening ALLOWED_TARGET_TYPES synonym table.
- **Verdict**: rules path falls short; fixture's `succeed` outcome is achievable only via D1 LLM hop or a synonym-table extension. **Carry-forward candidate**.

### Prompt 4 — `"add some stuff below the hero"`

- **INTENT**: verb=`add` conf=`0.92` target=`{type:'hero',index:null}` (matched anywhere in text per `findAllTargetTypes`) → **above 0.85 with target** → does NOT trigger ASSUMPTIONS.
- **DECOMP**: 1 todo (`add`/`section`/0.9 — "hero" hits section table); single-todo → no short-circuit.
- **ASSUMPTIONS check**: NOT triggered by rules. Fixture expects `clarification` → **MISMATCH** at rules layer. Rules path treats "hero" anchor as the target and would proceed to template/SELECTION.
- **UNMEASURABLE_GOAL_RE**: `false`. Note: "stuff" is the truly vague token but the regex doesn't catch it. **Helper gap** — could be widened.
- **Vague target**: rules return `hero` (a positional anchor, not the actual additive target); the user wants to add unspecified content **below** the hero. The rules path conflates anchor with target.
- **Verdict**: rules misclassify; fixture's `clarification` outcome only triggered by a richer "what to add" detector that distinguishes positional anchor vs. target. **Carry-forward candidate**.

### Prompt 5 — `"make the hero say something about AI but keep it professional but also fun"`

- **INTENT**: verb=`change` conf=`0.86` (`make_it` → 0.86 base, no target penalty since "hero" matched) target=`{type:'hero',index:null}`. Note: 0.86 ≥ 0.85 — **just barely above threshold** so NO ASSUMPTIONS.
- **DECOMP**: 2 todos (`hero say about AI but keep it professional but/section/0.9`, `fun/tone/0.6`); aggregate `0.75 ≥ 0.7` → short-circuit fires.
- **ASSUMPTIONS check**: NOT triggered. Fixture expects no ASSUMPTIONS (path is INTENT→CONTENT→PATCH per fixture) → **MATCH** on ASSUMPTIONS gate.
- **CONTRADICTION_RE**: `false`. Note: tone conflict (`professional but also fun`) is a real contradiction in spirit but the regex pattern requires the specific `remove…and add…back` shape. **Helper gap**.
- **UNMEASURABLE_GOAL_RE**: `false` (correct).
- **Vague target**: target resolved to `hero` cleanly.
- **Verdict**: rules short-circuit on DECOMP rather than routing through CONTENT_ATOM. Fixture's `succeed` via CONTENT path is divergence with rules path → DECOMP wins; **partial mismatch on routing** but outcome class (`succeed`) compatible.

### Prompt 6 — `"remove the pricing and add it back but cheaper"`

- **INTENT**: verb=`remove` conf=`0.95` target=`{type:'pricing',index:null}` → **above 0.85 with target** → no ASSUMPTIONS.
- **DECOMP**: 2 todos (`pricing/section/remove/0.9`, `back but cheaper/unknown/add/0.6`); aggregate `0.75 ≥ 0.7` → short-circuit fires.
- **ASSUMPTIONS check**: NOT triggered. Fixture expects no ASSUMPTIONS → **MATCH**.
- **CONTRADICTION_RE**: `true` — pattern hits on `remove the pricing and add it back`. ✅ **A7 helper detects correctly** (`decompAtom.ts:282-284`).
- **UNMEASURABLE_GOAL_RE**: `false` (correct).
- **Vague target**: resolved to `pricing` (first hit).
- **Verdict**: matches fixture `succeed`/2-todos/`med`. **A7 CONTRADICTION_RE is functionally correct but not wired** to alter pipeline behavior (see §3).

### Prompt 7 — `"make page 2 look like page 1 but different"`

- **INTENT**: verb=`null` (no verb regex matches: `make page` is not in the synonym table — only `make it` / `make the` qualify; `look like` is not a verb). Returns `confidence=0` with safe default `verb='change'` and `target=null`.
- **DECOMP**: 1 todo (`modify`/`unknown`/0.6 — `make` matches `modify` keyword table at `decompAtom.ts:109` because the table accepts bare `make` after `make it`); single-todo → no short-circuit.
- **ASSUMPTIONS check**: triggered (confidence 0 < 0.85, target null). Fixture expects ASSUMPTIONS + `page_scope` log event → **MATCH on ASSUMPTIONS**; `page_scope` event wired via `aisp.target?.pageId` branch at `chatPipeline.ts:397-404` — would NOT fire here because target is null. **Page-scope detection misses the cross-page reference** (`page 2`/`page 1`).
- **CONTRADICTION_RE**: `false`. The "but different" cancels "look like" — semantic contradiction but regex requires `remove…add…back` shape. **Helper gap**.
- **UNMEASURABLE_GOAL_RE**: `false` (correct).
- **Vague target**: `null` → graceful fallthrough to ASSUMPTIONS path.
- **Verdict**: matches fixture `clarification`. Page-scope log event is **NOT emitted** by rules (cross-page reference detection requires `resolvePageReference` to be called with a `pages` array — wired only when `intent.target.pageId` is set, which it isn't here).

### Prompt 8 — `"add a blog but not really a blog more like updates"`

- **INTENT**: verb=`change` conf=`0.90` (note: `add` regex DOES match here too at higher priority `0.92`, but `change` at 0.90 wins per first-rule-wins because… actually the rules table `intentClassifier.ts:30-39` has `change` AFTER `add`. Re-checking: fixture trace shows `verb=change(0.90) target=blog-first` — likely `make` synonym fired before `add` because `add` is checked at line 34 vs. `make_it` at line 39. Actual run confirmed: `change`/0.90/`blog`. Above 0.85 with target → no ASSUMPTIONS.
- **DECOMP**: 1 todo (`add`/`section`/0.9 — "blog" hits section table); single-todo → no short-circuit.
- **ASSUMPTIONS check**: NOT triggered. Fixture expects no ASSUMPTIONS → **MATCH**.
- **CONTRADICTION_RE**: `false` (correct — "but not really a blog more like updates" is qualifier not contradiction).
- **UNMEASURABLE_GOAL_RE**: `false` (correct).
- **Vague target**: resolved to `blog`.
- **Verdict**: matches fixture `succeed`/`med`. ADR-100 blog section wins via template path.

### Prompt 9 — `"this is wrong fix it"`

- **INTENT**: verb=`null` (`fix` not in verb table; `wrong` not in target table). Returns confidence=0, default `change`/null target.
- **DECOMP**: 1 todo (`unknown`/`unknown`/0.3 — neither verb nor target matched); aggregate 0.3 < 0.7, source=`fallthrough`. No short-circuit.
- **ASSUMPTIONS check**: triggered (0 < 0.85, target null). Fixture expects ASSUMPTIONS → **MATCH**.
- **CONTRADICTION_RE**: `false` (correct).
- **UNMEASURABLE_GOAL_RE**: `true` — caught by `fix\s+(?:it|this)` AND `this\s+is\s+wrong` branches. ✅ **A7 helper detects correctly**.
- **Vague target**: `null` → graceful fallback. Note that `ASSUMPTIONS_FALLBACK_TEMPLATES` (id=`revert-last-change`/`reset-to-default-theme`/`clarify-target` per `assumptionsAtom.ts:144-148`) **exactly matches** the fixture's `expectedAssumptions` array (`['revert last change', 'reset to default theme', 'tell me what is wrong (clarify target)']`). The A7 fallback templates were authored as the canonical answer for this specific prompt class — but are not consumed.
- **Verdict**: matches fixture `clarification`. A7 helpers detect AND have the matching fallback template, but pipeline doesn't use them.

### Prompt 10 — `"make it perfect"`

- **INTENT**: verb=`change` conf=`0.71` (`make_it` 0.86 − 0.15 target penalty) target=`null` → **below 0.85 OR no target** → triggers D1 LLM-fallback / ASSUMPTIONS.
- **DECOMP**: 1 todo (`modify`/`unknown`/0.6 — "perfect" not in target table); single-todo → no short-circuit.
- **ASSUMPTIONS check**: triggered (0.71 < 0.85, target null). Fixture expects ASSUMPTIONS → **MATCH**.
- **CONTRADICTION_RE**: `false` (correct).
- **UNMEASURABLE_GOAL_RE**: `true` — caught by `make\s+(?:it|this|the\s+site)\s+(?:perfect|...)` branch. ✅ **A7 helper detects correctly**.
- **Vague target**: `null` → graceful fallback.
- **Verdict**: matches fixture `clarification`. A7 helper is the textbook detector for this prompt — but not wired.

---

## §3 Aggregate

| Metric | Expected (fixture / A4) | Observed (rules path) | Match? |
|---|---|---|---|
| ASSUMPTIONS-trigger count (rules-gate `<0.85 ∨ !target`) | ~5 | **5** (prompts 2, 3, 7, 9, 10) | **MATCH on count** — but composition diverges: fixture expects ASSUMPTIONS on 2/4/7/9/10 (5 prompts); rules trigger on 2/3/7/9/10. Prompts 3 & 4 swap. Prompt 3 (`CHANGE EVERYTHING TO DARK MODE NOW`) trips rules-gate but fixture expects `succeed` (D1 LLM hop must succeed); prompt 4 (`add some stuff below the hero`) does NOT trip rules-gate (anchor "hero" mistaken for target) but fixture expects `clarification`. |
| `CONTRADICTION_RE` hit count | 1 (prompt 6) | **1** (prompt 6) | **MATCH** ✅ |
| `UNMEASURABLE_GOAL_RE` hit count | 1 (prompt 10) | **3** (prompts 2, 9, 10) | **OVERSHOOT** — pattern catches `idk\s+make` (prompt 2: `idk make it better`) and `this\s+is\s+wrong` + `fix\s+(?:it|this)` (prompt 9: `this is wrong fix it`), in addition to `make\s+it\s+perfect` (prompt 10). Pattern is broader than the fixture's expected single-prompt scope. Behavior is correct (all 3 prompts ARE unmeasurable goals), but the A7 author's intent of a 1-hit-per-fixture detector is not what the regex produces. |
| Vague-target fallback count (`target === null` after rules) | ~3 | **5** (prompts 2, 3, 7, 9, 10) | **OVERSHOOT** — same as ASSUMPTIONS-trigger composition. Three "true vague" prompts (2/9/10 — no anchor) plus two "anchor present but not extracted" cases (3 — "everything" not in enum; 7 — no verb). The fallback path (LLM hop OR ASSUMPTIONS) is graceful in all 5 cases — no crashes, no exceptions. |
| DECOMP short-circuit fires | 3 (prompts 1, 6 from fixture; observed: 1, 5, 6) | **3** (1, 5, 6) | Composition slightly diverges — fixture flags prompts 1 and 6 as DECOMP atoms; observed adds prompt 5 because aggregate-confidence threshold of 0.7 is met (0.9 + 0.6) / 2 = 0.75. |

### A7 helper wiring status (the load-bearing question)

```
$ grep -rn "isUnmeasurableGoal\|UNMEASURABLE_GOAL_RE\|hasContradiction\|CONTRADICTION_RE\|ASSUMPTIONS_FALLBACK_TEMPLATES" src/
src/contexts/intelligence/aisp/assumptionsAtom.ts:144  (definition)
src/contexts/intelligence/aisp/decompAtom.ts:282       (definition)
src/contexts/intelligence/aisp/decompAtom.ts:284       (definition)
src/contexts/intelligence/aisp/intentAtom.ts:195       (definition)
src/contexts/intelligence/aisp/intentAtom.ts:197       (definition)
```

**Zero call sites in `chatPipeline.ts` or anywhere else under `src/`.** A7 ships the regexes + fallback templates as additive exports only. The chat pipeline does NOT import or invoke them.

`chatPipeline.ts:380` triggers ASSUMPTIONS via the **legacy** condition `aisp.confidence < AISP_CONFIDENCE_THRESHOLD || !aisp.target` — not via `isUnmeasurableGoal()`.

`chatPipeline.ts` does NOT import `hasContradiction` — DECOMP fires the same pre-A7 way (multi-clause split + `0.7` aggregate).

`assumptionsLLM.ts` and `generateAssumptions` do NOT consume `ASSUMPTIONS_FALLBACK_TEMPLATES` — the rule-based fallback at `assumptionsRules.ts` (P34) is unchanged.

→ **A7 atom helpers are dead-code-with-tests as of P100 W2.** Per A7's own `prompt-quality-report.md` §8, two of five proposed atom improvements (multi-clause priority weighting + page-ref cross-validation) were explicitly deferred as P101 candidates; the three that DID ship (`UNMEASURABLE_GOAL_RE`, `CONTRADICTION_RE`, `ASSUMPTIONS_FALLBACK_TEMPLATES`) ship as additive exports only with hard-gate tests asserting their existence — but no wiring step. **P101 carry-forward**: import the three helpers in `chatPipeline.ts` and route accordingly (e.g., `if (isUnmeasurableGoal(text)) { return assumptionsCanned(ASSUMPTIONS_FALLBACK_TEMPLATES) }`).

---

## §4 Verdict

**Did the rules-based path handle adversarial input gracefully?** ✅ **YES.**

- Zero crashes across 10 adversarial prompts (no exceptions, no `undefined`-deref).
- Every prompt produced a structured `{verb, target, confidence}` envelope from `classifyIntent` and a structured `{todos, source, confidence}` from `decompose`.
- Vague / unmeasurable / contradictory inputs all gracefully default: target=`null` paired with `confidence < 0.85` (or `0`), routing to the LLM-fallback (D1) → ASSUMPTIONS branch.
- Shouting input (prompt 3) is correctly lowercased by regex `i` flags.
- Conjunction-stacked input (prompt 1) correctly splits into 4 todos at `and` boundaries.
- Page-aware reference (prompt 7) does NOT trigger `page_scope` because the rules-classifier doesn't surface `target.pageId` from raw "page 2" text — `resolvePageReference` is wired but consumed only when `intent.target.pageId` is already set. **Carry-forward**: bind page-resolution into `inferTarget` directly.

**Are A7's atom helpers actually consumed anywhere?** ❌ **NO — dead code awaiting wiring.**

- `UNMEASURABLE_GOAL_RE` / `isUnmeasurableGoal`: defined at `intentAtom.ts:195-197`, zero call sites under `src/`. Functionally correct (3/3 unmeasurable prompts detected) but the pipeline routes via the legacy `confidence < 0.85` gate.
- `CONTRADICTION_RE` / `hasContradiction`: defined at `decompAtom.ts:282-284`, zero call sites under `src/`. Functionally correct (1/1 contradiction prompt detected) but `decompose()` is unmodified.
- `ASSUMPTIONS_FALLBACK_TEMPLATES`: defined at `assumptionsAtom.ts:144-148`, zero call sites under `src/`. Templates exactly match fixture-expected assumptions for prompt 9 — but `assumptionsLLM` / `assumptionsRules` do not consume them.

**P101 carry-forward (per A7 §8 and confirmed here):**

1. Wire `isUnmeasurableGoal(text)` into `chatPipeline.ts:~380` as a fast-path gate **before** the LLM-fallback hop — saves one LLM round-trip on prompts 2/9/10.
2. Wire `hasContradiction(text)` into `decompose()` to mark contradictory todo pairs (e.g., flip the `add it back but cheaper` todo's status to `requires-clarification` instead of `applied`).
3. Wire `ASSUMPTIONS_FALLBACK_TEMPLATES` into `assumptionsRules.ts` as the canonical fallback when LLM lift fails AND prompt matches an unmeasurable-goal pattern.
4. Bind `resolvePageReference` directly into `inferTarget` so cross-page references (`page 2`) surface `target.pageId` without requiring a separate manual resolution step.
5. Widen `ALLOWED_TARGET_TYPES` synonym table to include `everything`/`dark mode` → `theme` so prompt-3-class inputs hit the rules path cleanly.

**Hard-rule compliance:**

- ≤400 LOC: ✅ (this file is ~290 LOC).
- 10 adversarial prompts traced: ✅ (§2 lists all 10 with full per-prompt trace).
- Sibling-disjoint (B1/B3/B4 untouched): ✅ (only file touched is `docs/prompt-audit/scenario-2-trace.md`).
- Methodology + special checks documented: ✅ (§1 + §2 special-check fields per prompt).
- A7 wiring status flagged: ✅ (§3 and §4 — explicit P101 carry-forward).
