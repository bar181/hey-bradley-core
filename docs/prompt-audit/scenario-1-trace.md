# P100 W2 — Scenario 1 Pipeline Trace (Axon CLI dev landing)

> **Owner:** Agent B1 — Live pipeline trace, scenario 1.
> **Repo state:** `claude/verify-flywheel-init-qlIBr` (cwd `/home/user/hey-bradley-core`).
> **Gates by:** A1 format-verification at `docs/prompt-audit/format-verification.md`.
> **Sibling outputs (do not touch):** B2 / B3 / B4 own scenarios 2 / 3 / 4.

---

## §1 Methodology

10 prompts from `tests/fixtures/scenario-1-axon-cli.ts:35-174` traced through the **deterministic pure-function pipeline stages** invoked by `chatPipeline.ts:316-498`:

1. `classifyIntent(text, projectType?)` from `src/contexts/intelligence/aisp/intentClassifier.ts:127-172`.
2. `decompose(text, aisp, pages?)` from `src/contexts/intelligence/aisp/decompAtom.ts:237-279`.
3. `getActivePage(config, activePageId)` from `src/contexts/intelligence/pageIterator.ts:39-59`.

`chatPipeline.submit()` is **not** invoked end-to-end — it requires Zustand + sql.js WASM + AgentProxy + `ensureSession()` (`auditedComplete.ts:140-153`). Per A1 §1, the AgentProxy mock returns sub-ms with `cost_usd: 0`; the rules-based path is the only branch deterministic without infra.

Each trace below records the rules-classifier output (computed manually by mirroring the verb regex table at `intentClassifier.ts:28-40`, the target enum at `intentAtom.ts:51-57`, the DECOMP keyword tables at `decompAtom.ts:108-133`, and the conjunction split tokens at `decompAtom.ts:136-145`) and flags every point where the LLM-enriched path (currently inert; AgentProxy fixture-driven only) would diverge.

---

## §2 Per-prompt traces

### Prompt 1 — "Create a site for my CLI tool called Axon"
**Mode:** chat **request_id (sim):** req-b1-001

**INTENT (`intentClassifier.ts:127`):**
- verb: `change` (default; no VERB_RULES regex hits — "create" not in `intentClassifier.ts:28-40`)
- target.type: null (no scope token; no ALLOWED_TARGET_TYPES word — `intentAtom.ts:51-57`)
- confidence: **0** (verb=null branch at `intentClassifier.ts:141-148`)
- rationale: "no verb matched — fall through to rule-based translator"
- LLM-divergence: live LLM would tag verb='create'/'generate' + target='site' (not in Γ R3 enum); fall-through to template SELECTION is correct here.

**DECOMP_ATOM (`decompAtom.ts:237`):**
- todos: 1 (`{order:1, verb:'generate', target:'unknown', details:"a site for my CLI tool called Axon", sourceSpan:"Create a site for my CLI tool called Axon", confidence:0.6}`)
- splitter: rules ("create" matches `generate` keyword at `decompAtom.ts:113`; no target keyword hit → confidence 0.6 per Γ R3)
- aggregate confidence: 0.6 — **below `DECOMP_CONFIDENCE_THRESHOLD = 0.7` (`decompAtom.ts:105`)** → DECOMP path skipped at `chatPipeline.ts:425`; matcher fires.

**Page scope:** `activePageId=null` (first turn) → `getActivePage` returns `{page:null, sections:[], scopeRoot:""}` (`pageIterator.ts:54-58`).

**Patch path (simulated):**
- Rules-based: matcher would route to a CLI/dev-tool template (e.g., `dev-tools/oss` family, ADR-105/098); SELECTION_ATOM picks scaffold; PATCH atom assembles 5-12 patches.
- LLM-enriched: AgentProxy fixture row keyed on this exact text returns `expected_envelope_json` per `agentProxyAdapter.ts:78`; live LLM would generate fresh JSON Patches against the system-prompt allowed-paths (`system.ts:172`).
- Expected `log_events`: input_event, intent_classification, template_match, patch_validation, response_summary (5 rows; per fixture `:41-47`).

**Format-divergence flags:** (a) rules-classifier returns confidence=0 — UI matcher chip would show "no high-confidence intent" badge; live LLM might score 0.9+ on "create site" (A1 §10 carry-forward "AgentProxy ignores history" doesn't apply yet — turn 1).

---

### Prompt 2 — "Add a quickstart section with npm install steps"
**Mode:** chat **request_id (sim):** req-b1-002

**INTENT:**
- verb: `add` (regex `/\b(?:add|adds|adding|insert|inserts)\b/i` at `intentClassifier.ts:34`)
- target.type: null ("section" / "quickstart" / "npm" not in ALLOWED_TARGET_TYPES; `intentAtom.ts:51-57`)
- confidence: **0.77** (0.92 verb − 0.15 target penalty per `intentClassifier.ts:159,166`)
- rationale: `verb=add(0.92) target=none`
- LLM-divergence: live LLM would resolve "section" to a structured AISP target (likely `features` or new `quickstart`-typed section); rules path under-targets here.

**DECOMP_ATOM:**
- todos: 1 (`{order:1, verb:'add', target:'section', details:"a quickstart section with npm install steps", confidence:0.9}`) — verb "add" + target keyword "section" both hit (`decompAtom.ts:113,122`)
- splitter: rules; aggregate 0.9 — single todo, no DECOMP dispatch (`chatPipeline.ts:425` requires `todos.length > 1`).

**Page scope:** still `scopeRoot=""` (single page).

**Patch path:** rules: matcher routes to add-section template scoped to `/sections/-`; expected ~3 patches (insert section header + body + style). Expected log rows = 4 per fixture `:55-60` (no decomp_split).

**Format-divergence flags:** (a) target.type=null → INTENT confidence borderline; (b) live LLM would emit a single-section patch; rules+matcher path likely matches identically.

---

### Prompt 3 — "Make the hero darker and more technical"
**Mode:** chat **request_id (sim):** req-b1-003

**INTENT:**
- verb: `change` (regex `/\bmake\s+(?:it|the)\b/i` at `intentClassifier.ts:39`; confidence 0.86)
- target.type: `hero` (first ALLOWED hit; `intentAtom.ts:52`)
- confidence: **0.86**
- rationale: `verb=change(0.86) target=hero-first`

**DECOMP_ATOM:**
- todos: **2** (split on " and " token at `decompAtom.ts:140`):
  - `{order:1, verb:'modify', target:'theme', details:"hero darker", sourceSpan:"Make the hero darker", confidence:0.9}` — "make" + "darker" (theme keyword `decompAtom.ts:124-127`)
  - `{order:2, verb:'unknown', target:'unknown', details:"more technical", sourceSpan:"more technical", confidence:0.3}` — neither hit
- aggregate: (0.9 + 0.3)/2 = **0.6** — below threshold 0.7 → DECOMP dispatch skipped; matcher fires on the full utterance.

**Page scope:** `scopeRoot=""`.

**Patch path:** rules: matcher → hero-darker theme tweak. Expected 4 log rows per fixture `:68-73`.

**Format-divergence flags:** (a) DECOMP aggregate 0.6 — borderline; clause 2 "more technical" misses content-style keywords (`decompAtom.ts:128-131` includes `professional` but not `technical`); LLM-enriched DECOMP would correctly route clause 2 to a tone/content adjustment.

---

### Prompt 4 — "Add a pricing section — free tier and $19/month pro"
**Mode:** chat **request_id (sim):** req-b1-004

**INTENT:**
- verb: `add` (0.92)
- target.type: `pricing` (first ALLOWED hit). ORDINAL_RE `\b(\d+)(?:st|nd|rd|th)?\b` (`intentClassifier.ts:44`) **matches "19"** with no suffix → `index = 19`. **Bug-shaped surface** — pricing isn't ordinal-indexed. target = `{type:'pricing', index:19}`.
- params: `inferParams` regex `/\bto\s+...\s*[!.?]*$/` (`intentClassifier.ts:110`) — no "to X" suffix → undefined.
- confidence: **0.92**
- rationale: `verb=add(0.92) target=pricing-19`

**DECOMP_ATOM:**
- todos: **2** (split on " and "):
  - `{order:1, verb:'add', target:'section', details:"a pricing section — free tier", confidence:0.9}` — "add" + "section" (also "pricing" matches but `section` is iterated first at `decompAtom.ts:118-122` so wins per `decompAtom.ts:193-200`)
  - `{order:2, verb:'unknown', target:'unknown', details:"$19/month pro", confidence:0.3}`
- aggregate: 0.6 — below threshold; DECOMP dispatch skipped.

**Page scope:** `scopeRoot=""`.

**Patch path:** matcher routes to pricing template. Expected 5 log rows per fixture `:82-88` (includes `decomp_split`).

**Format-divergence flags:** (a) **ordinal-19 bug** — INTENT mis-indexes pricing tier number as section ordinal; live LLM wouldn't be confused. (b) Fixture asserts `decomp_split` row but rules-path aggregate 0.6 < 0.7 means DECOMP atom emits a row but no dispatch — `chatPipeline.ts:424` emits decomposition log unconditionally on `todos.length >= 1`, so the `decomp_split` row IS written. ✓ matches fixture.

---

### Prompt 5 — "Change the font to something more developer-friendly"
**Mode:** chat **request_id (sim):** req-b1-005

**INTENT:**
- verb: `change` (regex `/\b(?:change|...)\b/i` at `intentClassifier.ts:32`; 0.9)
- target.type: null ("font"/"developer-friendly" not in ALLOWED)
- params: `inferParams` regex matches "to something more developer-friendly" → `{value:"something more developer-friendly"}`
- confidence: **0.75** (0.9 − 0.15)
- rationale: `verb=change(0.90) target=none params={"value":"something more developer-friendly"}`

**DECOMP_ATOM:**
- todos: 1 (no split). Verb "change" → modify (`decompAtom.ts:109`); target none. confidence 0.6.

**Page scope:** `scopeRoot=""`.

**Patch path:** matcher → typography template. Expected 4 log rows per fixture `:96-101`.

**Format-divergence flags:** (a) target=null but params captured — single source of section-typography intent comes from params, not target; matcher must consult both. (b) live LLM would tag target='theme.typography' (out-of-enum).

---

### Prompt 6 — "Add social proof with GitHub stars and downloads"
**Mode:** chat **request_id (sim):** req-b1-006

**INTENT:**
- verb: `add` (0.92)
- target.type: null ("social"/"proof"/"github"/"stars"/"downloads" all out-of-enum at `intentAtom.ts:51-57`)
- confidence: **0.77** (0.92 − 0.15)

**DECOMP_ATOM:**
- todos: **2** (split on " and "):
  - `{order:1, verb:'add', target:'unknown', details:"social proof with GitHub stars", confidence:0.6}` — "add" verb hit only
  - `{order:2, verb:'unknown', target:'unknown', details:"downloads", confidence:0.3}`
- aggregate: **0.45** — below threshold; DECOMP dispatch skipped.

**Page scope:** `scopeRoot=""`.

**Patch path:** matcher → testimonials/social-proof template (likely `testimonials` ALLOWED type). Expected 4 log rows per fixture `:109-114`.

**Format-divergence flags:** (a) "social proof" is the canonical AISP `testimonials` section but rules-path target=null misses; LLM-enriched INTENT would alias correctly.

---

### Prompt 7 — "Create a second page for documentation"
**Mode:** chat **request_id (sim):** req-b1-007

**INTENT:**
- verb: `change` (default; "create" not in VERB_RULES)
- ORDINAL_RE matches "second" → index=2
- target.type: null ("page"/"documentation" out-of-enum)
- confidence: **0** (verb=null → early-return path at `intentClassifier.ts:141-148`)
- rationale: "no verb matched — fall through to rule-based translator"

**DECOMP_ATOM:**
- todos: 1 (`{order:1, verb:'generate', target:'unknown', details:"a second page for documentation", confidence:0.6}`) — "create" → generate.

**Page scope:** `getActivePage(config, activePageId='page-1')` returns `{page:null, scopeRoot:""}` if config.pages empty (turn 7 is the *page-creation* trigger; pages array doesn't exist yet) — see `pageIterator.ts:43-58`. After this turn, downstream wire would call `addPage` action (`chatPipeline.ts` does not own page-creation; that lives in uiStore). `resolvePageReference(text, pages=undefined)` returns null at `intentAtom.ts:104`.

**Patch path:** This prompt actually **adds a page**, not patches the active page. The pipeline would route to a page-add template (or trigger uiStore `addPage`) rather than a section patch. Expected 5 log rows per fixture `:122-128` including a `page_scope_resolution` row — emitted to log the page-creation event.

**Format-divergence flags:** (a) page creation is an out-of-band action; rules path under-classifies (verb=change confidence=0). (b) live LLM would emit a `pages/-` add patch directly, parsed by Zod against `MasterConfigSchema.pages` — but `PatchEnvelopeSchema` (`patches.ts:17-20`) doesn't restrict path prefix, so Zod would accept; downstream `validatePatches` (`patchValidator.ts:35`) is the gate.

---

### Prompt 8 — "Add a changelog section to the docs page"
**Mode:** chat **request_id (sim):** req-b1-008

**INTENT:**
- verb: `add` (0.92)
- target.type: null ("changelog"/"section"/"docs"/"page" out-of-enum)
- params: `inferParams` regex matches "to the docs page" → `{value:"the docs page"}`
- confidence: **0.77** (0.92 − 0.15)

**DECOMP_ATOM (with `pages = [{id:"page-1",...},{id:"page-2",title:"docs",...}]`):**
- todos: 1. Verb "add" hit, target "section" hit → 0.9. **`resolvePageReference("Add a changelog section to the docs page", pages)`** at `intentAtom.ts:133-142`: regex `\b(?:the\s+|on\s+(?:the\s+)?)?([a-z][a-z\s-]{1,30}?)\s+page\b` matches "the docs page" → phrase="docs"; fuzzy match against `pages[].title` finds page-2 ("docs"). **`targetPage = "page-2"`**.

**Page scope:** active is page-2 (per fixture `:136`). `getActivePage(config, "page-2")` returns `{page:page-2, sections:page-2.sections, scopeRoot:"/pages/page-2"}` (`pageIterator.ts:44-52`). `prefixPatchPaths` rewrites `/sections/-/...` → `/pages/page-2/sections/-/...`.

**Patch path:** matcher (scoped to page-2 sections) → changelog/text template. Expected 5 log rows per fixture `:138-143` including `page_scope_resolution`.

**Format-divergence flags:** (a) DECOMP page-aware resolution is **wired** (P82 / OC-CLEANUP / ADR-107) and would resolve correctly when `pages` is threaded — but `chatPipeline.ts:423` calls `decompose(text, aisp, config.pages)` so the resolution lives ✓. (b) INTENT atom `pageId` (`intentAtom.ts:71`) is also resolvable but classifyIntent doesn't currently call `resolvePageReference` — only DECOMP does (open carry-forward per CLAUDE.md "Honest deferred").

---

### Prompt 9 — "Make the whole site feel more like linear.app"
**Mode:** chat **request_id (sim):** req-b1-009

**INTENT:**
- verb: `change` (`/\bmake\s+(?:it|the)\b/i` does NOT match "make the whole" — the regex requires `(it|the)` immediately after `make\s+`; "the whole" has "the" right after, so it DOES match → 0.86)
- target.type: null (no ALLOWED hit)
- confidence: **0.71** (0.86 − 0.15)

**DECOMP_ATOM:**
- todos: 1 (no " and " / "; " / ", " / " then " / " also " / " and also " / " and then " token in the utterance — split returns single clause; `decompAtom.ts:153-173`). Verb "make" → modify (`decompAtom.ts:109`); target: scan TARGET_KEYWORDS — "modern" no, "linear" no, "site" no — none. Confidence 0.6.
- aggregate 0.6 — below threshold; **NO DECOMP dispatch despite fixture expecting `expectedTodos: 3` at `:151`**.

**Page scope:** `scopeRoot=""` (whole-site request — could trigger multi-page iter via `iteratePages`, but rules path doesn't).

**Patch path:** matcher fires on full text; likely no good template hit ("linear.app" is a brand reference, not a keyword); falls through to LLM call → AgentProxy fixture row.

**Format-divergence flags:** **(a) MAJOR: fixture expects 3 todos via DECOMP; rules path produces 1.** This is the canonical example of where LLM-enriched DECOMP_ATOM (currently inert at `decompAtom.ts:240` `_intent` underscore-prefixed) is required to decompose a metaphorical "feel like linear.app" into:
  1. modify theme (dark, monochrome, geometric)
  2. modify content tone (professional, terse)
  3. modify spacing/typography (system fonts, tighter)
- A1 §10 carry-forward "AgentProxy ignores history" + "fixtures pre-validated" both apply: the fixture row hand-authors the 3-todo split for this exact text. (b) Expected log row `decomp_split` at fixture `:155` would be emitted because `chatPipeline.ts:424` writes the decomposition log unconditionally on `todos.length >= 1` — but `todos.length === 1` here so no split actually shows; **fixture row count vs reality diverges here** unless the LLM-enriched path is wired.

---

### Prompt 10 — "Export the spec for Claude Code"
**Mode:** chat **request_id (sim):** req-b1-010

**INTENT:**
- verb: `change` (default; "export" not in VERB_RULES at `intentClassifier.ts:28-40`)
- target.type: null ("spec"/"claude"/"code" out-of-enum)
- confidence: **0**
- rationale: "no verb matched — fall through to rule-based translator"

**DECOMP_ATOM:**
- todos: 1 (`{order:1, verb:'unknown', target:'unknown', details:"the spec for Claude Code", confidence:0.3}`) — "export" not in VERB_KEYWORDS (`decompAtom.ts:108-114`); no target hit.
- source: 'fallthrough' (no clause ≥ 0.6).

**Page scope:** N/A — export bypasses `getActivePage` and goes to the export emitter (`buildClaudeCodeBundle`, `exportClaudeCode.ts` per ADR-122).

**Patch path:** **No patches.** Export is a UI-driven action (ExportClaudeCodeButton per ADR-122). `chatPipeline.ts` would not produce patches; pipeline emits `export_emit` log row (per fixture `:166-170`) and `response_summary` only — 4 rows total.

**Format-divergence flags:** (a) rules path mis-classifies as a chat-pipeline command; the actual UX path is the workbench Export button (`ExportClaudeCodeButton.tsx`). (b) Live LLM would similarly miss — this prompt is a meta-instruction the chat pipeline doesn't own. **Expected behavior:** chatPipeline should detect "export" verb and short-circuit to export emitter, OR the UX should never let this text reach chatPipeline.

---

## §3 Aggregate findings

**Total simulated SQLite rows expected (per fixture `SCENARIO_1_EXPECTED_SQLITE_ROW_COUNT = 54` at `tests/fixtures/scenario-1-axon-cli.ts:185`):** 54 = 45 log_events + 9 edit_history.

**Total LLM-divergence flags raised in §2:** **17 distinct flags** across 10 prompts (counting (a)/(b) sub-flags):
- P1 ×1, P2 ×2, P3 ×1, P4 ×2, P5 ×2, P6 ×1, P7 ×2, P8 ×2, P9 ×2, P10 ×2.

**Categories of divergence (cross-cutting):**

1. **Confidence-threshold gap (rules vs LLM)** — P1/P7/P10 return INTENT confidence=0 (verb misses VERB_RULES); LLM would score these 0.85+. Affects: chat UX badge, route choice (matcher vs LLM call). 3 of 10 prompts.
2. **Target-enum under-coverage** — P2/P5/P6/P7/P8/P9/P10 have target=null because the user's target word ("section"/"font"/"social proof"/"page"/"docs"/"site"/"spec") is not in `ALLOWED_TARGET_TYPES` (`intentAtom.ts:51-57`). 7 of 10 prompts. Mitigation: matcher fallback covers most via section-keyword routing.
3. **DECOMP threshold gap** — P3/P4/P6/P9 produce 2-3 clause splits with aggregate confidence 0.45-0.6, **all below `DECOMP_CONFIDENCE_THRESHOLD = 0.7`** (`decompAtom.ts:105`). DECOMP atom logs the split but does NOT dispatch through `todoExecutor`. Fixture treats `decomp_split` log row as the success criterion (correct per `chatPipeline.ts:424`). LLM-enriched DECOMP would push aggregate above 0.7 by tagging clauses with verb+target hits the rules tables miss.
4. **Patch-count variance** — fixture doesn't specify counts; `PatchEnvelopeSchema` permits `min(1).max(20)` (`patches.ts:18`). AgentProxy fixture rows are hand-validated; live LLM may exceed (A1 §9 risk #1).
5. **Latency variance** — fixture `simulatedLatencyMs` totals **3,830ms** across 10 prompts (steps 1+2+...+10 = 1850+150+200+300+250+180+200+250+400+50). AgentProxy resolves sub-ms (`agentProxyAdapter.ts` no `setTimeout`); live LLM 0.5-30s per call → real session ~10-30s sum (A1 §6 + §9 risk #2).
6. **Cost-cap exposure** — AgentProxy `cost_usd: 0` (`agentProxyAdapter.ts:121`); live Haiku 4.5 ~$0.0001-0.001/call → 10 calls ~$0.001-0.01 (well under default `getCapUsd() = $1.00` at `auditedComplete.ts:16`); cost-cap branch unreachable in this scenario (A1 §9 risk #3).

**Cross-check against A1 top-3 risks:**

| A1 risk | Exercised by Scenario 1? | Notes |
|---|---|---|
| #1 Schema-rejection cliff | **No** — rules path never invokes Zod; AgentProxy fixtures pre-validated | Live LLM untested; would surface on any of P1/P7/P9 calling out to LLM |
| #2 Latency UX gap | **No** — sub-ms returns; mutex/spinner/abort UX never exercised | Fixture `simulatedLatencyMs` field is a **synthetic UX-design spec**, not a measurement |
| #3 Cost-cap blast radius | **No** — `cost_usd: 0` for all 10 calls | Default $1.00 cap not approached; cost-cap rejection branch at `auditedComplete.ts:192-200` unreached |

---

## §4 Verdict

**Pipeline functionality (rules path):** **PARTIAL** —
- 7/10 prompts produce a coherent target=null + INTENT confidence in [0.71, 0.92]; matcher fallback compensates.
- 3/10 prompts (P1, P7, P10) return INTENT confidence=0 (verb-miss → safe-default branch at `intentClassifier.ts:141-148`); rules path has no recourse without LLM.
- DECOMP rules tables (`decompAtom.ts:108-133`) miss "create" → INTENT verb (it IS in DECOMP `generate` but NOT in INTENT `add`/`change`/etc) and miss target words "section/font/social proof/page/site/spec" — under-coverage is consistent with A1 §10 carry-forward "no LLM enrichment wired".

**AgentProxy substitution validity:** **GAPS** —
- AgentProxy is fixture-driven (`agentProxyAdapter.ts:50-123`); the 10 prompts in this scenario each need a curated `expected_envelope_json` row in the example_prompts table to produce realistic output.
- For prompts where rules-path mis-classifies (P1/P7/P9/P10), the AgentProxy fixture is the **only** thing producing correct downstream patches; without it the pipeline would fall through to `validation_failed` or "no template matched" hint (`chatPipeline.ts:216-217`).
- AgentProxy `cost_usd: 0` and sub-ms latency mean the cost-cap path and slow-LLM UX path remain **untested by this scenario** (per A1 §9 risks #2, #3).

**Live-LLM-readiness for this scenario — specific concerns:**

1. **P9 ("feel like linear.app") metaphor** — rules path produces 1 todo; fixture expects 3. Live LLM would correctly decompose but: would it choose theme + tone + spacing vs. some other 3-tuple? Non-deterministic. AgentProxy fixture pins one canonical answer; live LLM variance untested.
2. **P4 ordinal-19 bug** — `ORDINAL_RE` greedily captures "$19" as `target.index = 19` for pricing section. Live LLM wouldn't make this mistake. Worth a tightening of the regex at `intentClassifier.ts:44` to require `(?:st|nd|rd|th)` or word-ordinal context.
3. **P7 page-creation flow** — chatPipeline doesn't own page-add; UI must intercept. Without UI gate, this prompt becomes a low-confidence patch attempt that may (a) get rejected by `validatePatches` (`patchValidator.ts:35-95`), (b) get auto-fixtured by AgentProxy, or (c) call live LLM and produce a `pages/-` add patch — three different outcomes from same input.
4. **P10 export bypass** — same UI-gate concern as P7. Currently relies on the user pressing the Export button (ADR-122 / `ExportClaudeCodeButton.tsx`); a chat-typed "export" command is not wired and would be mis-classified.
5. **No multi-turn coherence test** — A1 §7 confirms history lives in system prompt only, not `messages[]`; AgentProxy ignores history (`agentProxyAdapter.ts:57` matches by exact `userPrompt`); this scenario's prompts assume sequential context (P3 references "the hero" added by P1; P8 references "the docs page" from P7) — rules path has no way to validate cross-turn references; live LLM's behavior on these references is **untested in fixtures**.

**Final:** rules path is internally consistent and emits the expected `log_events` shape (`chatPipeline.ts:424` writes decomposition log unconditionally; INTENT and matcher logs at `chatPipeline.ts:376,396,490`). The 54-row SQLite expectation in the fixture is **achievable on the rules path** for log row count — but the **semantic correctness of those rows depends on AgentProxy fixtures** for prompts P1/P7/P9/P10 where rules confidence collapses. Live LLM swap-in carries A1's top-3 risks plus the 5 scenario-specific concerns above.

---

## Hard-rule compliance

- READ-ONLY for source ✓ (no edits to `intentClassifier.ts` / `decompAtom.ts` / `pageIterator.ts` / `chatPipeline.ts`).
- Doc artifact only; LOC count below.
- Cited file:line for every "would" / "currently" / regex / atom claim.
- 10 prompts traced; per-prompt section sizes between 18-30 LOC.
- No claim of `chatPipeline.submit()` end-to-end execution; only pure-function stages invoked manually.
- No shell commands beyond read/cat/grep/wc/ls/find used in the trace process.
