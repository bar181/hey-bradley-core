# P100 W2 — Hey Bradley vs SOTA (Lovable 80/100 baseline)

> **Owner:** Agent C1 — Scoring + SOTA comparison + brutal-honest review (P100 W2 Format Verification track).
> **Repo state:** `claude/verify-flywheel-init-qlIBr` (cwd `/home/user/hey-bradley-core`).
> **Sources:** A1 format-verification (`docs/prompt-audit/format-verification.md`) + B1-B4 scenario traces (`docs/prompt-audit/scenario-{1,2,3,4}-trace.md`) + A7 prompt-quality-report (`docs/prompt-audit/prompt-quality-report.md`) + P100 W2 brutal-honest review (`plans/implementation/phase-100/seal/04-brutal-honest-review.md`).
> **Sibling outputs (do not touch):** A1 format verification (DONE) · B1-B4 scenario traces (DONE) · D1 top-3 fixes (NEXT) · E1 closer (NEXT).

---

## §1 Methodology

7-category SOTA rubric (mirrors A7 §7 + P100 W2 brutal review §1 weights). SOTA baseline: **Lovable chat-to-website = 80/100**, derived from public showcases + informal cell-by-cell scoring (per P100 W2 brutal review §2).

| Category | Weight | What it measures |
|---|---|---|
| Intent accuracy | 20 | Verb + target classification correctness across 40-prompt audit |
| Visual design quality | 20 | Themes / templates / token compliance / render quality |
| Content quality | 15 | Opinionated copy; CONTENT_ATOM tone fidelity; no lorem ipsum |
| JSON patch correctness | 15 | Zod schema match + page-scope correctness + RFC-6902 path validity |
| SQLite log accuracy | 10 | log_events coverage + ID hierarchy + BYOK redaction |
| Pipeline functionality | 10 | 8-atom suite end-to-end across chat / listen / planning |
| UX response quality | 10 | Personality voices + clarification asks + error messages |

Scoring is **honestly revised down from prior 88/100** (P100 W2 seal) because B1-B4 traces exposed five concrete gaps (A7 dead code, listen cleanup not wired, AGENT_ATOM unwired, PROCESS+DDD not persisted, schema CHECK enum gaps) that the prior audit either missed or under-weighted.

---

## §2 Scoring vs SOTA

| Category          | Weight | HB Score | SOTA | Gap  | Notes |
|---|---|---|---|---|---|
| Intent accuracy   | 20pts  | 14       | 16   | -2   | 7/10 prompts target=null in B1 (Scenario 1 §3); A7 helpers dead code (B2 §3); verb gap on `forget`/`need`/`create`/`export` (B1/B3) |
| Visual design     | 20pts  | 17       | 16   | +1   | 21 themes + 41+ templates + ADR-111 ≥8.5 floor; live-render parity untested |
| Content quality   | 13     | 13       | 12   | +1   | Real opinionated copy in scenarios; CONTENT_ATOM + 15 styles per ADR-098 |
| JSON correctness  | 15pts  | 13       | 12   | +1   | Zod min(1).max(20) holds (A1 §2); page-scope via pageIterator (B1 P8); -2 for live-LLM untested per A1 §9 risk #1 |
| SQLite accuracy   | 10pts  | 7        | 8    | -1   | Schema CHECK enum 13 values (`005-comprehensive-logs.sql:36-43`) but fixtures reference `decomp_split` + `export_emit` not in enum (B3 §4 / B1 P10) — silent CHECK rejection on real write |
| Pipeline function | 10pts  | 7        | 8    | -1   | -3 for: A7 helpers DEAD (B2 §3) + listen cleanup NOT wired (B3 §4) + AGENT_ATOM unwired (B4 §4) + PROCESS/DDD not persisted (B4 §3) |
| UX response       | 10pts  | 8        | 8    | 0    | 5 personality voices (ADR-074); teacher mode validated S3; -2 for unmeasurable-goal handling (A7 §8 Improvement 1 deferred) |
| **TOTAL**         | **100**| **79**   | **80**| **-1** | **Below SOTA by 1** — honest revision from prior 88 because B-wave exposed gaps the audit missed |

**Revised composite: 79/100** (down 9 from prior 88/100 P100 W2 seal). The 9-point swing comes from:
- Intent accuracy -3 (rules path under-coverage exposed by B1 §3 categories 1+2: 3/10 confidence=0 + 7/10 target=null)
- JSON correctness -1 (A1 §9 risk #1 schema-rejection cliff weighted higher post-B-wave)
- SQLite accuracy -2 (schema enum mismatch with fixture event types per B3 §4 + B1 P10)
- Pipeline function -3 (4 distinct wiring gaps exposed by B-wave; prior audit scored 10/10 on a not-yet-validated wire)

---

## §3 What worked — Top 5 wins matching or exceeding SOTA

1. **Spec fidelity (8/8 atoms in code).** PATCH + INTENT + SELECTION + CONTENT + ASSUMPTIONS + DECOMP + PROCESS + DDD + AGENT all compile and conform to AISP Σ contracts (B4 §4 confirmed). Γ/Ε invariants hard-throw at runtime — `parseProcessResponse` (`processAtom.ts:221-240`), `parseDDDResponse` (`dddAtom.ts:221-280`), `parseAgentResponse` (`agentAtom.ts:280-299`) all reject invariant violations at the boundary. Lovable's spec is implicit and unauditable. **HB wins decisively on spec fidelity.**

2. **SQLite log infrastructure (ADR-126).** Two-table architecture (`log_events` + `edit_history`) with three-level ID hierarchy (session → request → event). BYOK redaction enforced at every write boundary via `redactKeyShapes()` (`chatPipeline.ts:280` + 11 sites confirmed in W1). Fire-and-forget try/catch never throws upward (`chatPipeline.ts:280-281`). **Cleaner observability surface than Lovable's commercial-only equivalent.**

3. **Multi-page page-aware pipeline (ADR-104 / P79).** B1 P8 confirmed: `chatPipeline.ts:423` calls `decompose(text, aisp, config.pages)` and `resolvePageReference("Add a changelog section to the docs page", pages)` correctly resolves to `targetPage="page-2"` (`intentAtom.ts:133-142`). `prefixPatchPaths` rewrites `/sections/-/...` → `/pages/page-2/sections/-/...` (`pageIterator.ts:44-52`). Page-scope tagging makes the `page_id` column on `log_events` non-null when applicable. Lovable does single-page only by default.

4. **Process map visualization (ProcessMapSVG / ADR-117).** Pure SVG; zero new deps; 4 status colors + 3 edge types + click-to-expand. Renders the AISP phase graph directly from `classifyProcess()` output. **No equivalent in Lovable** — Lovable's UX is preview-iframe-only; no process visualization surface.

5. **Spec-factory framing (markdown bundle export / ADR-122).** `buildClaudeCodeBundle()` emits ≥6 logical files with `# === FILE: <path> ===` markers (B4 confirms 10 files). Bundle IS the canonical Hey Bradley OUTPUT — downstream consumer reads it and writes implementation in their own repo. Lovable's output is the rendered website; HB's output is the spec the website is built from. **Different product positioning; HB wins on LLM-ingestibility for downstream code generation.**

---

## §4 Gaps vs SOTA — Top 5 with file:line + fix recommendations

### 1. **A7 atom helpers DEAD CODE** (severity HIGH — B2 §3 finding)
- **Files:** `intentAtom.ts:195-197` (`UNMEASURABLE_GOAL_RE` + `isUnmeasurableGoal`), `decompAtom.ts:282-284` (`CONTRADICTION_RE` + `hasContradiction`), `assumptionsAtom.ts:144` (`ASSUMPTIONS_FALLBACK_TEMPLATES`)
- **Problem:** All three exported from atom modules; **zero call sites in `chatPipeline.ts` or anywhere under `src/`** per B2 §3 grep. Tests assert their existence but no production wire consumes them. `chatPipeline.ts:380` triggers ASSUMPTIONS via legacy `aisp.confidence < AISP_CONFIDENCE_THRESHOLD || !aisp.target` — not via `isUnmeasurableGoal()`.
- **Impact:** Saves an LLM round-trip on prompts 2/9/10 of B2 ("idk make it better" / "this is wrong fix it" / "make it perfect"). Currently routes to LLM-fallback every time.
- **Fix:** wire into `chatPipeline.ts` after INTENT classify (~line 380): `if (isUnmeasurableGoal(text)) { return assumptionsCanned(ASSUMPTIONS_FALLBACK_TEMPLATES) }`. Estimated **~10 LOC**. Lowest-risk highest-value fix.

### 2. **Listen cleanup transform NOT wired** (severity HIGH — B3 §4 finding)
- **Files:** `webSpeechAdapter.ts:65-70` (raw transcript pass-through; no disfluency strip), `chatPipeline.ts:324`
- **Problem:** `chatPipeline.ts:324` writes `emit(logCtx, 'listen_capture', { raw: redactKeyShapes(text), cleaned: redactKeyShapes(text) })` — **`raw === cleaned` literally** (same string, both redaction-passed). The schema slot exists; the transform is missing. B3 §3 confirmed **0/10 disfluency strips occur** across the listen scenario.
- **Impact:** Verb gap collapses confidence to 0 on `forget`/`need` (B3 prompts 6/9). AgentProxy `example_prompts` lookup misses on disfluent strings (`uh`/`um`/`like`) — fixture-row cleanup is aspirational.
- **Fix:** new pure module `src/contexts/intelligence/stt/transcriptCleanup.ts` exporting `cleanTranscript(raw): string` (disfluency strip + verb-substitution). Wire at `chatPipeline.ts:324`: `cleaned: redactKeyShapes(cleanTranscript(text))`. Estimated **~30 LOC**.

### 3. **AGENT_ATOM unwired in production** (severity MEDIUM — B4 §4 finding)
- **Files:** `agentAtom.ts:299` exports `classifyAgents` + `buildAgentAtom` + `parseAgentResponse`; **zero production call sites outside tests/specs**. `PlanningChatBar.tsx:26` invokes `classifyProcess(text)` only; AGENT atom is missing from the fan-out.
- **Problem:** 8th-and-final atom is dead code. SpecWorkbench (P95 / ADR-121) consumes static `phases: PhaseCard[]` prop, not live `classifyAgents()` output. AISP suite is "complete in code" but only 7 of 8 atoms have a production entry point.
- **Impact:** Planning sessions cannot generate live agent-wave specs; SpecWorkbench cards are pre-canned.
- **Fix:** extend `PlanningChatBar.tsx:24-30` to invoke `AGENT_ATOM` after `PROCESS_ATOM`: `const waveCtx = buildWaveContext(processOutput); const agents = classifyAgents(waveCtx); onAgentSpecsChange?.(agents)`. Estimated **~20 LOC**.

### 4. **PROCESS+DDD outputs not persisted** (severity MEDIUM — B4 §3 finding)
- **Files:** `Planning.tsx:61-65` (`liveMap` + `liveDomainModel` are `useState` only), `PlanningChatBar.tsx:18-32` (no `writeLogEvent` invocation)
- **Problem:** Planning-mode atom outputs are ephemeral. **Reload nukes everything.** No `process_atom_output` / `ddd_atom_output` log-event row is ever written by the production wire — they exist as fixture-declared event types only (B4 §3 / `scenario-4-planning-saas-auth.ts:14-22`). Schema CHECK enum DOES include both event types (`005-comprehensive-logs.sql:36-43` lines 39: `'process_atom_output','ddd_atom_output'`) — the schema is ready; the writes don't happen.
- **Impact:** The W2 LOG-BUILD infrastructure (ADR-126) does NOT extend to Planning surfaces. Multi-turn planning sessions feel amnesiac.
- **Fix:** invoke `writeLogEvent` from `PlanningChatBar.tsx:26-28` after each `classifyProcess` + `classifyContexts` call, with `eventType: 'process_atom_output'` / `'ddd_atom_output'` and `eventData: JSON.stringify(output)`. Estimated **~40 LOC** (includes session/request ID plumbing for Planning mode).

### 5. **Schema CHECK enum gaps for fixture event types** (severity MEDIUM — B3 §4 + B1 P10 finding)
- **Files:** `005-comprehensive-logs.sql:36-43` (CHECK enum has 13 values), `tests/fixtures/scenario-1-axon-cli.ts:82-88` (references `decomp_split`), `tests/fixtures/scenario-3-listen-startup.ts` (references `decomp_split`), `scenario-1-axon-cli.ts:166-170` (references `export_emit`)
- **Problem:** Fixtures reference `decomp_split` (correct schema name is `decomposition`) and `export_emit` (no such event type in the enum). B3 §4 confirms: "real write would either fail CHECK or be silently dropped by the fire-and-forget wrapper." B1 P10 confirms: "`export_emit` not a schema-valid event_type; no chat→export bridge."
- **Impact:** Fire-and-forget try/catch (`chatPipeline.ts:281`) swallows the CHECK violation silently. Fixture-counted rows never land. Audit-vs-reality row-count delta is -11 to -14 per B3 §3 ("Fixture totals: 63 rows / Source-actual totals: ~49-52 rows").
- **Fix (option A):** rename fixture event types to schema-valid values (`decomp_split` → `decomposition`; `export_emit` → `response_summary` or remove). ~5 LOC fixture edits. **Fix (option B):** extend CHECK enum + add migration 006 to add `decomp_split` + `export_emit` (or `export_event`). ~8 LOC.

---

## §5 Format verification result

From A1's `format-verification.md` §9 verdict table:

| Dimension | Verdict |
|---|---|
| Schema match | **PARTIAL** — fixtures conform; live LLM may emit non-conforming envelopes (Zod rejects → `validation_failed`) |
| Async behavior | **GAPS** — AgentProxy is sub-ms; live LLM is 0.5-30s; mutex/timeout/cancel paths untested by fixtures |
| Memory model | **CONFIRMED** — every adapter is single-turn; history lives in system prompt only; no client-side accumulation |
| Error paths | **GAPS** — `rate_limit` / `timeout` / `network` / fenced-output / refusal paths effectively unreachable via AgentProxy |

**Live LLM risks (top-5 from A1 §9 + B-wave additions):**

1. **Schema-rejection cliff** (HIGH — A1 risk #1) — live LLM may emit `op:'move'` or 21+ patches or missing `summary≤140` cap; Zod rejects → `validation_failed`. OUTPUT_RULE doesn't restate `|patches|≤20` or `summary≤140`.
2. **Latency UX gap** (HIGH — A1 risk #2) — fixtures sub-ms vs live 0.5-30s; `inFlight` mutex blocks; current ChatInput / ListenTab UX built on near-instant returns.
3. **Cost cap blast radius** (MEDIUM — A1 risk #3) — `getCapUsd()` defaults $1.00; AgentProxy always `cost_usd: 0`; cost-cap rejection path at `auditedComplete.ts:192-200` never exercised.
4. **Listen cleanup never tested with real disfluencies** (HIGH — B3 §4 add) — `webSpeechAdapter.ts:65-70` does no cleanup; AgentProxy `example_prompts` lookup misses on `uh`/`um`/`like` literally; live STT will surface this immediately.
5. **AGENT_ATOM untested in production path** (MEDIUM — B4 §4 add) — zero call sites outside tests; SpecWorkbench consumes static prop; live LLM enrichment via `buildAgentAtom` is scaffolded but inert.

---

## §6 Comparison to Lovable for visual design from chat

Per owner brief, the marketing-critical comparison:

**Lovable's approach:**
- Shows live preview as user types; visual feedback **< 1s**
- User sees the website re-render in the iframe in near-real-time
- Chat → Render is the headline UX surface
- Spec is implicit (lives inside Lovable's database; user never sees it)

**Hey Bradley's approach:**
- Shows config patches in chat; visual rendering is browser-side; **~600-2000ms simulated** (B1-B4 traces)
- User sees the spec materialize (atoms + DECOMP + page-aware + AISP visibility per ADR-110)
- Spec → Render is the headline UX surface
- AISP bundle is the canonical OUTPUT (per ADR-122); render is downstream

**Visual quality (from sample sites in A3-A6 fixtures):**
- Hey Bradley templates: avg **8.5/10** (per A7 audit; 21 themes / 41+ templates; ADR-111 declares ≥8.5 floor)
- Lovable: avg **8/10** (per Lovable's public showcase; informal cell-by-cell scoring)
- Visual quality gap is small; HB at-or-above SOTA on per-template polish.

**Honest verdict:**

- **Hey Bradley wins on SPEC FIDELITY** — 8 atoms + page-aware + DECOMP + AISP exportable bundle. Lovable's spec is implicit and unauditable. **HB targets the spec-factory-for-Claude-Code use case.**
- **Lovable wins on VISUAL IMMEDIACY** — sub-1s feedback loop is genuinely better UX for the "I just want to see it" moment. **Lovable targets the visual-builder-for-non-devs use case.**
- **Different products with overlapping markets.** On Visual Immediacy as a single category, Lovable would win significantly. On Spec Fidelity as a single category, HB would win significantly. The 79/100 vs 80/100 composite is averaged across all 7 categories; the gap is within noise.

**Where the comparison breaks down:** HB's downstream-LLM-ingestion model means the rendered website is not the product — the spec bundle is. Lovable users measure success by "does the site look right". HB users (per ADR-122) measure success by "did Claude Code build what the bundle described". Apples to apples comparison only works on the slice where both products produce a viewer-facing site directly.

---

## §7 Unknowns requiring real LLM key

Honest list of what cannot be confirmed without live API call:

1. **Real LLM emits Zod-valid response shape consistently.** A1 §5 row 1: `PartchEnvelopeSchema.safeParse` may reject; rate unknown.
2. **Real LLM respects 20-patch cap** (`patches.ts:18` — `min(1).max(20)`). System prompt Γ R7 (`system.ts:55`) declares it; OUTPUT_RULE (`system.ts:71-72`) doesn't restate. Compliance untested.
3. **Real LLM never returns `op:'move'`** (only allowed: `add`/`replace`/`remove` per `patches.ts:9`). RFC-6902 includes `move`/`copy`/`test`; a live model trained on RFC-6902 docs may emit them.
4. **Real LLM latency distribution under realistic prompt mix.** Haiku 4.5 ~500-3000ms per call (P100 W2 brutal review §1); B1 fixture `simulatedLatencyMs` totals 3,830ms across 10 prompts — real session ~10-30s sum (A1 §6).
5. **BYOK rate-limit behavior under real load.** `classifyError` regex covers `/rate\s*limit|429|RESOURCE_EXHAUSTED/` (`adapterUtils.ts:45-47`); never exercised by fixtures.
6. **Cost cap rejection path triggered correctly on real expense.** `auditedComplete.ts:192-200` is the rejection branch; AgentProxy `cost_usd: 0` makes it unreachable. Default $1.00 cap allows ~150 Haiku calls/session.
7. **Markdown-fenced JSON parsing edge case.** Live Claude often wraps responses in ` ```json ... ``` ` blocks; `safeJson` fence-strip (`adapterUtils.ts:26-29`) + `responseParser.ts:14-25` regex handle it — but real-world hit rate untested.
8. **Real disfluency cleanup quality.** No `cleanTranscript` exists in source (B3 §4); live STT vs simulated text divergence is the gap. Verb gap on `forget`/`need` collapses confidence to 0 today (B3 prompts 6/9).

---

## §8 Composite verdict

**Final composite score: 79/100** (honestly revised down from prior 88/100 P100 W2 seal).

**Below SOTA by 1 point.** Specific fixable issues that close the gap:

- Wiring the 3 A7 atom helpers (Gap 1) lifts Intent accuracy +2 → 16/20 (matches SOTA)
- Wiring listen cleanup (Gap 2) lifts Pipeline functionality +2 → 9/10 (matches SOTA)
- Renaming fixture event types (Gap 5 option A) lifts SQLite accuracy +1 → 8/10 (matches SOTA)

Combined effect: **79 + 5 = 84/100** if D1 implements all three lowest-risk fixes. That's +4 over Lovable 80/100 baseline.

**Top-3 fixes recommended for D1 to implement (lowest risk + highest value):**

1. **Wire A7 atom helpers** (Gap 1) — `chatPipeline.ts:~380` adds 3-line guard `if (isUnmeasurableGoal(text)) return assumptionsCanned(ASSUMPTIONS_FALLBACK_TEMPLATES)`. **Estimated 10 LOC. Lifts Intent +2, UX +1.** Lowest risk (additive guard; no behavior change for non-matching prompts).
2. **Wire listen cleanup transform** (Gap 2) — new `transcriptCleanup.ts` pure module; invoke at `chatPipeline.ts:324`. **Estimated 30 LOC. Lifts Pipeline +2.** Medium risk (changes what AgentProxy `example_prompts` lookup sees; may shift hit rate).
3. **Rename fixture event types** (Gap 5 option A) — `decomp_split` → `decomposition`; remove or rename `export_emit` references. **Estimated 5 LOC across 2 fixture files. Lifts SQLite +1.** Lowest risk (test fixtures only; no source changes).

Combined fix-pass: **45 LOC across 4 files**, lifts composite **79 → 84/100**, restores +4 cushion over SOTA.

**Out of scope for D1 (defer to P101+):**
- AGENT_ATOM production wire (Gap 3) — needs new `WaveContext` builder; ~20 LOC + design call.
- Planning-mode persistence (Gap 4) — needs session/request plumbing; ~40 LOC + ADR-126 extension.

---

## Hard-rule compliance

- **READ-ONLY:** zero source/test/ADR/CLAUDE.md edits ✓
- **Doc artifact only; ≤400 LOC:** confirmed via `wc -l` ✓
- **8 sections (§1-§8) all present:** ✓
- **Honest scoring:** revised 88→79 to reflect B-wave findings ✓
- **File:line citations on every gap claim in §4:** ✓ (5 gaps × multiple cites each)
- **No shell commands except read/cat/grep/wc/ls/find used:** ✓

---

## Report

- **LOC:** see footer
- **Composite score:** 79/100 (revised from prior 88; -1 vs SOTA 80)
- **Gaps documented:** 5 (HIGH ×2 + MEDIUM ×3)
- **Top-3 fix recommendations summary:** wire A7 helpers (10 LOC) + wire listen cleanup (30 LOC) + rename fixture event types (5 LOC) = **45 LOC lifts composite to 84/100, +4 vs SOTA**
- **Hard-rule compliance:** PASS (all 6 rules)
