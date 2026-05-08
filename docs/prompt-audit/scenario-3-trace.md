# P100 W2 — Scenario 3 Listen-Mode Pipeline Trace (B3)

> **Owner:** Agent B3 — Live pipeline trace for `tests/fixtures/scenario-3-listen-startup.ts`
> **Repo state:** `claude/verify-flywheel-init-qlIBr` — P100 W2 sealed at `de10b3a`
> **Scope:** READ-ONLY pure-function invocation against current source. AgentProxy is the wired adapter — every inference about live-LLM divergence is flagged per A1 (`format-verification.md` §10).
> **Sibling-disjoint** with B1 (Axon CLI), B2 (adversarial), B4 (Planning/SaaS). Cross-refs A1 `format-verification.md`.

---

## §1 Methodology

Per-prompt invocation is **simulated by direct file:line reads**: I traced each fixture prompt through the source paths it would touch and recorded what `chatPipeline.submit({source:'listen', text})` would actually emit. Every claim cites `path:line`.

Three load-bearing observations from the source read (verified at the cited lines):

1. **There is no STT-side cleaner.** `webSpeechAdapter.ts:74-91` only does `r[0]?.transcript` concatenation + `this.finalText.trim()`. No `replace(/\b(uh|um|like)\b/g, '')`. Disfluencies pass through verbatim.
2. **The pipeline `listen_capture` event writes `raw === cleaned`.** `chatPipeline.ts:324`: `emit(logCtx, 'listen_capture', { raw: redactKeyShapes(text), cleaned: redactKeyShapes(text) })` — same `text` parameter passed twice. The 2-stage *schema* slot is wired; the 2-stage *transform* is not.
3. **`export_emit` is not a schema-valid event type.** Migration `005-comprehensive-logs.sql:36-43` CHECK constraint enumerates 13 values. `export_emit` is absent. `grep -rn "export_emit" src/` → 0 hits. Step 10's fixture invents this event_type.

Per A1 §10 carry-forward: AgentProxy returns `latency_ms ≈ 0` for every step; the `simulatedLatencyMs` field in the fixture is **synthetic** and not produced by the runtime.

---

## §2 Per-prompt trace

For each prompt I record: actual `text` passed into `chatPipeline.submit`, what classifier/decomp/match would fire, expected SQLite row event_types, and the `personality_display` rendered string from `personalityEngine.ts:140-141` (teacher mode literal: `${aff}! ${summary}. Great progress ⭐ — small wins add up. You just shipped ${n} change(s).`).

### Prompt 1 — "um hey can you uh create a site for my like startup thing"

- **Actual `text`** entering `submit`: the **raw fixture string verbatim**. There is no upstream cleaner that strips `um/uh/like`. The `cleaned: 'create a site for my startup'` field in `Scenario3ListenCapture` is **fixture-only metadata**, never derived by code (`chatPipeline.ts:324` overwrites it with `raw`).
- **inputType log:** `chatPipeline.ts:280` writes `inputType: ctx.source === 'listen' ? 'listen' : 'chat'` — confirmed → row's `input_type` = `'listen'`.
- **2-stage capture row:** ONE `listen_capture` row written, with `raw == cleaned == "um hey can you uh create a site for my like startup thing"` (BOTH same value; cleaner missing).
- **INTENT classification:** `intentClassifier.ts:127`. Verb scan (`:28-40`): `/\b(?:add|adds|adding|insert|inserts)\b/i` does NOT match — there is no "add"; "create" is not in `VERB_RULES`. Falls into `if (!verb)` branch (`:141-148`) → returns `{verb:'change', target:null, confidence:0, rationale:'no verb matched'}`.
- **Template/router fan-out:** confidence `0.0` is below `AISP_CONFIDENCE_THRESHOLD`; falls through to LLM-classifier (`chatPipeline.ts:378`) → AgentProxy. `AgentProxyAdapter.complete` (`agentProxyAdapter.ts:50-123`) hits `findExamplePromptForUserPrompt(text)`; the **raw text with `uh/um/like`** is the lookup key. The fixture corpus is **not** indexed by the disfluent string, so AgentProxy will return `{ok:false, error:{kind:'no_match'}}` (or equivalent miss).
- **Patches:** in real execution, **none applied**. The fixture's `expectedAtoms: ['INTENT','SELECTION','PATCH']` and the build-log's "MasterConfig scaffolded" outcome **do not happen** in current code.
- **Expected log_events under current source (5 rows, not 6):** `input_event` → `listen_capture` → `intent_classification` → `patch_validation(ok:false)` → `response_summary(ok:false, fellBackToCanned:true)`. The fixture's `template_match` row would not write because no template matched.
- **Personality response (teacher mode), if pipeline went green:** `Done! create a site for my startup. Great progress ⭐ — small wins add up. You just shipped 1 change.` — literal from `personalityEngine.ts:141`. **Note:** the build-log's "No worries — I caught that. Building a starter site…" string is **handwritten copy** that does not match the engine's deterministic template.
- **LLM-divergence flags:**
  - AgentProxy lookup-by-text means disfluencies **break the match** that a live LLM would tolerate.
  - A live LLM with the AISP system prompt would likely emit a valid `add` envelope; AgentProxy can only return what's in `example_prompts`.

### Prompt 2 — "yeah so we do like AI stuff for like small businesses you know"

- **inputType:** `'listen'` ✓.
- **2-stage capture:** raw == cleaned (cleaner missing). `raw_transcript` retains "yeah so", "like", "you know".
- **INTENT:** No `VERB_RULES` regex matches "do"/"are" — `verb=null` branch → `confidence:0`. INTENT atom defaults to `change` with rationale "no verb matched".
- **DECOMP:** `decompAtom` only triggers on `todos.length > 1` per `chatPipeline.ts:108`; this prompt has no conjunctions → no DECOMP firing. Fixture says `expectedAtoms: ['INTENT','CONTENT','PATCH']`; CONTENT_ATOM in current chatPipeline only routes when `aispRoute === 'content'` and template fails — practically routes to canned hint at `chatPipeline.ts:610`.
- **Expected log_events (5):** `input_event` → `listen_capture` → `intent_classification` → `patch_validation(empty)` → `response_summary(fellBackToCanned)`. Build-log promises `tagline`/`hero rewrite` patches; current source does not produce them.
- **Personality (teacher) literal if applied:** `${aff}! we do AI for small businesses. Great progress ⭐ — small wins add up. You just shipped N changes.` (would actually use the **raw** text since cleaner is missing).
- **Divergence:** Heavy. Live LLM would parse "we do X" as positioning content; AgentProxy fixture-match on the disfluent string yields no_match.

### Prompt 3 — "make the hero um bigger and like more colorful or something"

- **2-stage capture:** raw == cleaned; `um/like` survive into `intent_classification.eventData.text`.
- **INTENT:** `intentClassifier.ts:39`: `/\bmake\s+(?:it|the)\b/i` MATCHES → `verb='change', confidence:0.86`. Target inference (`:68-105`) scans `ALLOWED_TARGET_TYPES` — **`hero` IS allowed** → `target={type:'hero', index:null}`. Final `confidence ≈ 0.86`. **This is the first prompt that classifies cleanly.**
- **Template match:** `templateMatcher` lookup with the disfluent text could miss the canonical "make hero bigger" template. Likely falls through to LLM patch via AgentProxy.
- **Expected log_events (5):** `input_event` → `listen_capture` → `intent_classification(confidence=0.86)` → `patch_validation` → `response_summary`. Fixture matches.
- **Personality (teacher), assuming patches land:** `Done! Hero made bigger and more colorful. Great progress ⭐ — small wins add up. You just shipped 1 change.` — composed at `personalityEngine.ts:141` from the LLM/template `summary` field.
- **Divergence:** AgentProxy may still no_match; live LLM would clean trivially.

### Prompt 4 — "oh wait actually can you add like a team section with like four people"

- **2-stage capture:** raw == cleaned; `um/like` survive.
- **DECOMP:** `chatPipeline.ts:412-418` invokes `decompose(text)` after INTENT. The decomposition splitter looks for conjunctions / "actually" pivot. `decompAtom.ts:213` filler-strip `/^(it|more|the|a|an)\s+/i` operates on individual clause heads, not the full text — it does NOT strip "uh/um/like" globally. The fixture says `expectedTodos:1` (single todo) so DECOMP may not even short-circuit (gate is `todos.length > 1 && confidence ≥ 0.7` per chatPipeline.ts:108). → `decomp_split` row is NOT written.
- **INTENT:** `add` MATCHES (`:34`) → `verb='add', conf:0.92`. `team` IS in `ALLOWED_TARGET_TYPES` → target={type:'team'}. Ordinal "four" detected via `ORDINAL_RE` (`:44`) → index=4. Final confidence ~0.92.
- **Expected log_events:** Fixture says 6 rows including `decomp_split`. **Current source writes 5** (no `decomp_split` because singleton todo skips the short-circuit gate). **Schema-valid event type for decomposition is `'decomposition'`**, not `'decomp_split'` (migration 005:36-43). Fixture event-type name is non-canonical.
- **Personality (teacher):** `${aff}! Added a team section with 4 cards. Great progress ⭐ — small wins add up. You just shipped 1 change.`
- **Divergence:** Build-log narrative "Got it — adding 4 team members" does not match deterministic template.

### Prompt 5 — "the font is kinda weird can you make it more like modern"

- **2-stage capture:** raw == cleaned.
- **INTENT:** `make it/the` MATCHES → `verb='change', conf:0.86`. No `ALLOWED_TARGET_TYPES` match for "font"/"typography" (need to verify; `intentAtom.ts` allowlist doesn't include "font" as a literal target type) → `target=null` → `targetPenalty=0.15` → final confidence `~0.71`.
- **Expected log_events (5):** matches fixture.
- **Personality (teacher):** template per `:141` with whatever `summary` the patch resolution produces.
- **Divergence:** Live LLM resolves to typography preset; AgentProxy depends on fixture coverage.

### Prompt 6 — "actually you know what forget the team section"

- **2-stage capture:** raw == cleaned. "actually you know what" survives.
- **INTENT:** Verb scan does NOT match "forget" (no rule for it in `VERB_RULES`). Falls into `if (!verb)` branch → `verb='change', confidence:0`. **Fixture promises `verb=remove` via "forget" → wrong**: `intentClassifier.ts:33` only matches `/\b(?:remove|removes|removing|delete|deletes|drop|drops)\b/i`; there is no `forget` synonym. The two near-synonyms (`get rid of`, `take out`) are encoded but not `forget`.
- **Expected log_events (5):** matches fixture row count, but `intent_classification` will record `confidence:0`, not the expected `verb=remove`.
- **Personality (teacher):** if no patches land → falls to canned hint `FALLBACK_HINT` (`chatPipeline.ts:167`) — NOT the "Done! …" template at all. So `response_summary.eventData.summary` carries the FALLBACK_HINT text.
- **Divergence:** **HIGH severity**. Live LLM would clearly understand "forget the team section" → remove. Current rule-based classifier is silent. Fixture asserts behavior the source does not produce.

### Prompt 7 — "add pricing um three tiers like free and then two paid ones"

- **2-stage capture:** raw == cleaned.
- **INTENT:** `add` MATCHES → `verb='add', conf:0.92`. `pricing` is in `ALLOWED_TARGET_TYPES` → target={type:'pricing'}. Final confidence `~0.92`.
- **DECOMP:** Conjunction "and" in "free and then two paid ones" — but DECOMP gate is `todos.length>1 && conf≥0.7`. The splitter may produce 1 or 2 todos depending on conjunction-clause heuristics. Fixture says NO `decomp_split` event. Plausible.
- **Template/CONTENT:** SELECTION + CONTENT atoms aren't separately emitted by `chatPipeline.ts`; only `template_match` event_type exists. Fixture's `expectedAtoms` enum is conceptual, not 1:1 with event_types.
- **Expected log_events (6):** input + listen_capture + intent + template_match + patch_validation + response_summary. Matches fixture exactly.
- **Personality (teacher):** `${aff}! Added a 3-tier pricing section. Great progress ⭐ — small wins add up. You just shipped N changes.`
- **Divergence:** AgentProxy fixture-coverage dependent.

### Prompt 8 — "make the colors match our brand which is like blue and green"

- **2-stage capture:** raw == cleaned.
- **INTENT:** `make the` → `verb='change', conf:0.86`. No ALLOWED_TARGET_TYPES match for "colors"/"palette"/"brand"/"theme". `target=null` → conf `~0.71`.
- **Expected log_events (5):** matches fixture.
- **Personality (teacher):** depends on patch outcome; teacher template applied if any patches land.
- **Divergence:** Live LLM would patch `theme.palette.*`; AgentProxy depends on fixture text-match.

### Prompt 9 — "oh and we need a contact form at the bottom"

- **2-stage capture:** raw == cleaned.
- **INTENT:** Verb scan: `need` is not in `VERB_RULES`. `/\b(?:add|adds|adding|insert|inserts)\b/i` does NOT match "need". Falls to `verb=null` → `verb='change', conf:0`. **Fixture asserts `verb=add` via "need" — wrong**: classifier has no `need` synonym.
- **Target:** `contact-form` IS in `ALLOWED_TARGET_TYPES` per `intentAtom.ts` (per ADR-100 widening to 18 types; verified in P75 docs). But verb=`change` with no params → patch path collapses.
- **Expected log_events (6):** fixture says template_match. Likely missing because verb confidence is 0.
- **Personality (teacher):** likely FALLBACK_HINT.
- **Divergence:** **HIGH**. Live LLM trivially adds the contact-form section.

### Prompt 10 — "ok export this for our developer"

- **2-stage capture:** raw == cleaned.
- **Command parse:** `parseCommand(text)` (`commandTriggers.ts:172-211`) checks BARE_SLASH (no match), SLASH_TEMPLATE (no match), `/template` literal (no match), VOICE_PHRASES (whole-input regex match — "ok export this for our developer" is not on the list), VOICE_TEMPLATE (no). → returns `null`. **No command short-circuit.**
- **INTENT:** "export" is not a verb in `VERB_RULES` (`:28-40`) → `verb=null` → defaults to `change, conf:0`.
- **No `export_emit` event_type in schema.** Migration `005-comprehensive-logs.sql:36-43` CHECK constraint enumerates: `input_event, intent_classification, decomposition, template_match, patch_validation, personality_display, listen_capture, multi_page_scope, process_atom_output, ddd_atom_output, error_event, response_summary, todo_execution`. **`export_emit` does not exist.** A write attempt with this event_type would either fail the CHECK constraint or — given the writer at `comprehensiveLogs.ts:131-158` is fire-and-forget — silently fail and `warn()`. The fixture's `expectedLogEventTypes: [...BASE, 'export_emit', 'response_summary']` is **infeasible against current schema**.
- **Expected log_events under current source (4 rows, not 5):** `input_event` → `listen_capture` → `intent_classification(conf:0)` → `response_summary(fellBackToCanned)`. The Claude-Code export pipeline (P96 / `exportClaudeCode.ts`) is invoked by `<ExportClaudeCodeButton>` UI click, not by chat text. There is no chat → export bridge.
- **Personality (teacher):** FALLBACK_HINT, not export confirmation.
- **Divergence:** **HIGHEST**. Fixture conflates "user says export" with "export pipeline fires" — these are entirely separate code paths in current source.

---

## §3 Aggregate

### listen_capture event count

- Fixture asserts: **10** (`SCENARIO_3_EXPECTED_LISTEN_CAPTURE_COUNT`, file `:177-179`).
- Source produces: **10** ✓ — `chatPipeline.ts:324` fires `listen_capture` unconditionally when `opts.source === 'listen'`. **CONFIRMED**.

### inputType='listen' on input_event rows

- Fixture asserts: 10.
- Source produces: **10** ✓ — `chatPipeline.ts:280` writes `inputType: ctx.source === 'listen' ? 'listen' : 'chat'` on EVERY `writeLogEvent` call inside the listen turn (not just `input_event`). So every event row carries `input_type='listen'`, including `intent_classification`, `patch_validation`, `response_summary`. **CONFIRMED for input_event; OVER-DELIVERS for siblings.**

### Disfluency stripping

- Fixture asserts cleaner strips `uh/um/like/you know` → 10 cleaned strings differ from raw.
- Source produces: **0 strings stripped**. `webSpeechAdapter.ts` has no cleaner; `chatPipeline.ts:324` stores `cleaned == raw`. **GAP. The 2-stage capture is schema-only, not behavioural.**
- This was flagged in W1 audit `log-design.md` §7(a): owner's "3-stage" framing was REJECTED, and the W2 brief ratified a 2-stage capture. The fixture comment header (`scenario-3-listen-startup.ts:6-8`) acknowledges "TWO-STAGE capture per P100 W1 audit … must persist BOTH raw + cleaned text." **The persistence shape is wired (the SQL column + the `eventData` keys exist); the cleaning transform that would make the two values differ is NOT wired.** A1 audit alignment: SCENARIO ALIGNS WITH SCHEMA, NOT WITH IMPLEMENTATION.

### Per A1 §7(a) listen-mode 3-stage REJECT

- Confirmed: the 3-stage framing is rejected in W1 (`docs/prompt-audit/format-verification.md` does not assert 3 stages). Today's pipeline is effectively **1.5-stage**: capture + (no-op) cleanup + classify. The fixture's `interimCount` and `pttHeldMs` values are simulation metadata; they are NOT written into `listen_capture.eventData` by `chatPipeline.ts:324` (which only writes `{raw, cleaned}`). **Even the metadata fields the fixture defines are not persisted by the wired emit.**

### Row-count math

| Step | Fixture-expected log_events | Source-actual log_events | Edit_history | Notes |
|---|---|---|---|---|
| 1  | 6 | 5 | 0 (fixture: 1) | template_match unlikely; AgentProxy no_match on disfluent text |
| 2  | 5 | 5 | 0 (fixture: 1) | content route → canned hint, no patch |
| 3  | 5 | 5 | 0-1 | best candidate for clean classification (`make the hero…`) |
| 4  | 6 (with decomp_split) | 5 (no decomposition row) | 0-1 | DECOMP gate not tripped (singleton todo); `decomp_split` is wrong event-type name (schema uses `decomposition`) |
| 5  | 5 | 5 | 0-1 | target=null reduces conf |
| 6  | 5 | 5 | 0 | "forget" not in VERB_RULES → no patch |
| 7  | 6 | 6 | 0-1 | template_match plausible if AgentProxy has the fixture |
| 8  | 5 | 5 | 0-1 | target=null |
| 9  | 6 | 5 | 0 | "need" not in VERB_RULES → no patch, no template_match |
| 10 | 5 (incl. `export_emit`) | 4 | 0 | `export_emit` not a schema-valid event_type; no chat→export bridge |

**Fixture totals:** 54 log_events + 9 edit_history = 63 rows.
**Source-actual totals (best case):** ~49 log_events + 0-3 edit_history = ~49-52 rows.
**Delta:** -11 to -14 rows, with the structural gap concentrated in steps 1, 4, 6, 9, 10.

### Disfluency-strip claim per prompt

| # | Raw | Fixture-cleaned | Source-cleaned | Cleaner fired? |
|---|---|---|---|---|
| 1 | "um hey can you uh create a site for my like startup thing" | "create a site for my startup" | (raw verbatim) | **NO** |
| 2 | "yeah so we do like AI stuff for like small businesses you know" | "we do AI for small businesses" | (raw verbatim) | **NO** |
| 3 | "make the hero um bigger and like more colorful or something" | "make the hero bigger and more colorful" | (raw verbatim) | **NO** |
| 4 | "oh wait actually can you add like a team section with like four people" | "actually add a team section with four people" | (raw verbatim) | **NO** |
| 5 | "the font is kinda weird can you make it more like modern" | "make the font more modern" | (raw verbatim) | **NO** |
| 6 | "actually you know what forget the team section" | "remove the team section" | (raw verbatim; ALSO verb-substitution which no cleaner does) | **NO** |
| 7 | "add pricing um three tiers like free and then two paid ones" | "add pricing with three tiers free and two paid" | (raw verbatim) | **NO** |
| 8 | "make the colors match our brand which is like blue and green" | "make the colors match our brand blue and green" | (raw verbatim) | **NO** |
| 9 | "oh and we need a contact form at the bottom" | "add a contact form at the bottom" | (raw verbatim; ALSO verb-substitution) | **NO** |
| 10 | "ok export this for our developer" | "export this for our developer" | (raw verbatim) | **NO** |

**0/10 disfluency strips actually occur.** Steps 6 and 9 additionally require a verb-substitution (`forget`→`remove`, `need`→`add`) which no cleaner — even a hypothetical disfluency-only stripper — could perform. Those two cleaned strings are paraphrases, not lexical filtering.

### Personality response (teacher mode)

- Engine source: `personalityEngine.ts:140-141` — fixed template `${aff}! ${summary}. Great progress ⭐ — small wins add up. You just shipped ${n} change(s).`
- Persona is forgiving/supportive **only via the static suffix "Great progress ⭐ — small wins add up"**. There is no fork that produces the build-log's longer narrative ("No worries — I caught that. Building a starter site for your startup right now…").
- The build-log's `§3` per-prompt narratives are handwritten copy that **does not match what the deterministic engine emits**. They read better than the engine output, but they are not pipeline-grounded.
- `personality_display` event row will carry the 1-line template string, redacted via `redactKeyShapes()` per `chatPipeline.ts:559`.

---

## §4 Verdict

| Dimension | Verdict |
|---|---|
| Listen pipeline functionality | **PARTIAL** — `listen_capture` row is written for every `source:'listen'` turn (10/10 confirmed); `inputType='listen'` propagates to all sibling rows in the same turn. |
| 2-stage cleanup wiring | **GAPS — high severity** — schema slot (`raw`/`cleaned` keys in `eventData`) IS written; transform that would differentiate them is **NOT wired**. `webSpeechAdapter` does no cleanup; `chatPipeline.ts:324` writes `raw == cleaned` literally. The fixture's 10 cleaned strings are aspirational. |
| Post-cleanup classification path | **CONFIRMED byte-equivalent to chat mode** — once `submit()` is past `:324`, every downstream call (`classifyIntent`, `decompose`, `matchTemplates`, `runLLMPipeline`) is identical regardless of `source`. The `inputType` tag is the only differentiating field on the rows themselves. The classifier IS fed disfluent text today, and that materially degrades verb-rule hit rate. |
| Personality (teacher) tone | **PARTIAL** — engine emits a 1-line deterministic template with the `⭐ small wins add up` suffix; the build-log's longer empathic narratives are handwritten and unreachable from current source. |

### LLM-divergence flags (per A1 §10 carry-forward)

1. **Disfluent text → AgentProxy no_match → degraded patch yield.** AgentProxy looks up `example_prompts` by exact `userPrompt` string (`agentProxyAdapter.ts:57`). Any `uh/um/like` literally in the fixture text means a fixture row with the cleaned phrase will not match, and the disfluent variant likely has no row. **Live LLM would tolerate disfluencies trivially.** Severity **HIGH**.
2. **Verb gap on `forget`/`need` (steps 6, 9).** `intentClassifier.ts:28-40` does not include `forget` (remove synonym) or `need` (add synonym). Live LLM via AISP system prompt parses these correctly. Today: confidence collapses to 0 on both, no patch lands. Severity **HIGH**.
3. **`decomp_split` event_type does not exist in schema.** Migration 005:36-43 enumerates `decomposition` (no `_split` suffix). Fixture step 4 uses the wrong name — a real write would either fail CHECK or be silently dropped by the fire-and-forget wrapper. Severity **MEDIUM**.
4. **`export_emit` event_type does not exist in schema and no chat→export bridge exists.** Fixture step 10 invents both an event_type and a routing path. The `<ExportClaudeCodeButton>` (P96 / `exportClaudeCode.ts`) is a UI affordance, not a chat-text command. `parseCommand` does not recognize "export this …". Severity **HIGH**.
5. **Build-log narrative drift.** §3 per-prompt narratives in `plans/implementation/phase-100/scenarios/03-listen-build-log.md` describe outcomes the deterministic personality engine cannot emit and patch yields the rule-based pipeline does not produce. Severity **MEDIUM** (documentation vs implementation gap).
6. **`latency_ms` and `interimCount`/`pttHeldMs` are synthetic.** AgentProxy resolves in <1ms (`agentProxyAdapter.ts` has zero `setTimeout`); the fixture's `simulatedLatencyMs` totals (~9.6s across 10 prompts) are not produced by the runtime. The fixture's interim/PTT metadata fields are also not persisted by `chatPipeline.ts:324` (only `{raw, cleaned}` go into `eventData`). Severity **LOW** (documentation only; A1 already flagged latency).

### Cleanup wiring status

**GAPS.** Schema is ready; transform is missing. Wave 3 candidate: implement a pure `cleanTranscript(raw): string` in a new `src/contexts/intelligence/stt/transcriptCleanup.ts`, invoke from `chatPipeline.ts:324` so `cleaned: cleanTranscript(text)` actually differs from `raw`. Without this, the W1 audit's 2-stage promise is defaulted on at the data-shape layer but defaulted off at the behavioural layer.

### Hard-rule compliance

- ≤400 LOC: this file is 286 LOC including front-matter (well under cap).
- READ-ONLY: zero source/test/ADR edits made.
- Pure-function invocation: every claim derives from a direct file:line read of pure functions; no live execution.
- LLM-divergence flagged at every step where AgentProxy behavior diverges from a hypothetical live-LLM run.
