# A2 — Image + Spec Creation + Content Generation Audit

> **Phase:** P114 / FEATURE-AUDIT · **Wave:** 1 · **Agent:** A2 · **Mode:** RESEARCH-ONLY
> **Date:** 2026-05-06 · **Sibling scopes:** A1 persistence · A3 BYOK+LLM · A4 UX

## Q1 — Image selector UX

### Where image picking happens
- `src/components/right-panel/simple/ImagePicker.tsx:60-495` — modal portal dialog. 720×560 px, opens on trigger button. Tabs: Photos / Videos / Effects. Category sidebar (10 categories + "all") + search across `tags|description|mood`. Two `pickerMode` variants: `'full'` (all tabs + upload) vs `'library-only'` (catalog grid only — used by hero `backgroundImage` slot in DRAFT/SIMPLE mode at `SectionSimple.tsx:267-272`).
- Library size confirmed via raw counts on disk: **300 images** + **41 videos** + **13 effects** (`src/data/media/{images,videos,effects}.json`; `wc` of `"id":` keys).
- Effects: 8 core (gradient-overlay, ken-burns, slow-pan, zoom-hover, parallax, glass-blur, grayscale-hover, vignette) + 5 wow (holographic, tilt-3d, sepia-to-color, reveal-slide, fade-in-scroll). Per-section via `section.style.imageEffect` (`ImagePicker.tsx:130-135` + `ImageSectionSimple.tsx:122`). NOT per-image.

### G1 (BLOCKING) — SIMPLE-mode users cannot change images on most section types
The 5 type-specific Simple editors (`ImageSectionSimple` / `GallerySectionSimple` / `TeamSectionSimple` / `LogosSectionSimple` / `BlogSectionSimple`) all gate ImagePicker behind `!isDraft` where `isDraft = rightPanelTab === 'SIMPLE'` (`uiStore.ts:261` defaults to `'SIMPLE'`). Concrete sites:
- `ImageSectionSimple.tsx:118-128` — `{!isDraft && <ImagePicker .../>}`
- `GallerySectionSimple.tsx:200-213` — same pattern
- `TeamSectionSimple.tsx:216` — same
- `LogosSectionSimple.tsx:202` — same
- `BlogSectionSimple.tsx:287` — same (with explanatory DRAFT comment block at `:278`)

A novice user (default `'SIMPLE'` tab) sees the heading/description fields but no way to swap the image. Only the hero `backgroundImage` slot inside `SectionSimple.tsx:267` falls through with `pickerMode="library-only"`. Comment at `SectionSimple.tsx:248-254` explicitly names this as "narrowed MVP" — but the cap was never widened post-MVP.

### Other notes
- Default-image fallback: when `imageUrl` is empty, the trigger button shows a generic `<Image>` icon (`ImagePicker.tsx:210-213`); section preview shows nothing (the `imageUrl &&` check at `ImageSectionSimple.tsx:106-117`). No catalog-default fallback wired.
- Search is shallow tag/desc/mood text match only (`ImagePicker.tsx:88-94`); no color/palette/aspect-ratio filter.
- Upload zone is hidden in `library-only` mode (`ImagePicker.tsx:328`) — appropriate, but means novice flow has zero upload affordance even for the hero background.

## Q2 — Spec generators

Six pure markdown/AISP emitters at `src/lib/specGenerators/` (LOC: northStar 272 / SADD 211 / buildPlan 206 / features 292 / humanSpec 231 / aispSpec 220; total 1432 LOC). Wired into `XAIDocsTab.tsx:22-29` (EXPERT center tabs) and a single AISP-only mount at `AISPTab.tsx:131`. Output shape `(config: MasterConfig) => string`. JSON tab is config dump (no generator).

P95-P99 / Agentic Workbench (Planning/Agentics modes) ships a separate stack:
- `SpecWorkbench.tsx:202-219` (`buildKissReview`) + `:220-235` (`buildTDDScaffold`) + Export Claude Code button (`ExportClaudeCodeButton.tsx:51`) + SealPanel (`Agentics.tsx:230` mount).
- Process map (`ProcessMapSVG`) + Domain model (`DomainModelSVG`) consume `classifyProcess` (`PlanningChatBar.tsx:44`) and `classifyContexts` (`Planning.tsx:118`, `PlanningChatBar.tsx:70`).

### G2 (P2) — Spec generators output is single-shot prose, not phase-aware
The 6 Whiteboard generators (`generateNorthStar` etc.) take `MasterConfig` and emit prose; they have NO awareness of `voiceAttributes`, `storytelling preset`, or DDD/PROCESS atom output. Compare: P110/A2 Claude Code bundle stitches `ddd-contexts.md` + `adr-bundle/` + `tdd-scaffold.md` from `phase.dddOutput` / `phase.processOutput` — but the WHITEBOARD-side spec tabs have no parallel signal-pull. The architectural narrative seen in Agentics mode does NOT reach the Whiteboard XAIDocsTab.

### G3 (P3) — JSON tab is raw dump
`XAIDocsTab.tsx:28` ships JSON as a `null` generator path. The display path (lines below `:30`) uses `JSON.stringify(config, null, 2)` — useful for debugging, useless as a spec output. Could become "structured spec JSON" with the same atom-derived sections.

## Q3 — 8 Crystal Atoms wire status (table)

Method: `grep -rln "from.*aisp/<atom>"` on `src/` excluding `aisp/<atom>` self-imports and `*.spec.ts`. Counts are non-self importers.

| Atom | File | Production importers | Wire status | Evidence |
|------|------|----------------------|-------------|----------|
| **PATCH_ATOM** | `prompts/system.ts` | 0 (atom is exported as STRING into system prompt) | LIVE — embedded into the LLM system prompt; AGENT-CALLABLE not import-callable | `chatPipeline.ts:15` imports `buildSystemPrompt`; PATCH_ATOM Σ enforced via Zod patch validator at `applyPatches.ts` |
| **INTENT_ATOM** | `aisp/intentAtom.ts` | **9** | LIVE — full pipeline | `chatPipeline.ts:21,355,393`; `routeClassifier.ts:22`; `templateSelector.ts:19`; `assumptionsLLM.ts:32`; `llmClassifier.ts:20`; `decompAtom.ts` chain |
| **SELECTION_ATOM** | `aisp/templateSelector.ts` | **0** non-self | INERT — orphan since P72/OC-TI superseded SELECTION_ATOM with `templateMatcher.ts` (ADR-098); `templateSelector.ts:22-55` still builds a SELECTION_ATOM string but no caller imports it. P106/ADR-134 SUPERSEDED ADR-057 in implementation, deleted `twoStepPipeline.ts`, but left `templateSelector.ts` on disk |
| **CONTENT_ATOM** | `aisp/contentAtom.ts` | 1 (`contentDefaults.ts:12` types-only) | INERT IN PRODUCTION FLOW — `contentGenerator.ts:102` is the deterministic stub; called at `templates/registry.ts:167` ("generator templates"). No active production path emits `kind: 'generator'`; chatPipeline comment at `:683` says "wired in P38" but the `runLLMPipeline` patcher path is what fires today |
| **ASSUMPTIONS_ATOM** | `aisp/assumptionsAtom.ts` | 0 atom-direct, but `generateAssumptionsLLM` (assumptionsLLM.ts) reaches **2 production sites**: `ChatInput.tsx:25,423` + `useListenPipeline.ts:26,149` | LIVE via LLM-side wrapper — atom is consumed at the LLM dispatch layer, not directly by chatPipeline |
| **DECOMP_ATOM** | `aisp/decompAtom.ts` | **3** | LIVE — `chatPipeline.ts:22,470` (multi-clause splitter); `todoExecutor.ts` (orchestration); `agentAtom.ts:21` (semantic ref) |
| **PROCESS_ATOM** | `aisp/processAtom.ts` | **3** | LIVE in Planning mode only — `PlanningChatBar.tsx:44`; `Planning.tsx`; `agentAtom.ts:5,68` cascade |
| **DDD_ATOM** | `aisp/dddAtom.ts` | **4** | LIVE in Planning mode only — `PlanningChatBar.tsx:5,58,70`; `Planning.tsx:37,118`; `agentAtom.ts` |
| **AGENT_ATOM** | `aisp/agentAtom.ts` | **1** | LIVE in Planning mode only — `PlanningChatBar.tsx:5,68,78` (`classifyAgents` per-context fan-out closes P101 CF#1) |

### Rollup
- 5 of 9 atoms LIVE (INTENT, ASSUMPTIONS-via-LLM, DECOMP, PROCESS, DDD, AGENT — counting AGENT) ; PATCH lives via prompt embedding.
- **2 atoms are INERT in production**: SELECTION_ATOM (orphan since P72), CONTENT_ATOM (registered but never fires — patcher path always wins).
- Whiteboard mode wires INTENT + DECOMP + ASSUMPTIONS-LLM + PATCH (via system prompt) = 4 atoms.
- Planning/Agentics wires PROCESS + DDD + AGENT = 3 atoms (no INTENT/DECOMP).
- The two stacks DO NOT share atoms — Whiteboard chat doesn't feed Planning's process map; Planning chat doesn't write to Whiteboard project state.

## Q4 — Content generation quality

### "make the hero punchier" routing
Trace in `chatPipeline.ts:355-470`:
1. `classifyIntent(effectiveText, projectType)` → INTENT_ATOM lock at `:393` (low-confidence falls through to LLM classify at `:407` if BYOK keys present)
2. Voice extraction `extractVoice` at `:427` — fires only when `source==='chat'` AND verb=add OR target absent AND current voiceAttributes empty (`:421-437`); "make hero punchier" has verb=update + target=hero, so voice extraction does NOT fire here
3. `classifyRoute(...)` at `:458` — content vs design vs ambiguous
4. DECOMP at `:465-470` (single-clause; no split)
5. `matchTemplates(effectiveText, scopedConfig)` at `:565` — chooses a template with confidence
6. If high confidence: `applyTemplateMatch` (`:589` area) directly mutates section copy/style — no CONTENT_ATOM call
7. If low confidence + BYOK: `runLLMPipeline` (`:719`) hits PATCH_ATOM via system prompt

So "make the hero punchier" goes: INTENT → ROUTE → MATCH → APPLY. **No CONTENT_ATOM fires.** The deterministic copy comes from `templateApplier.ts` rule tables, not from a tone-aware generator.

### Listen mode routing
- `useListenPipeline.ts:149` calls `generateAssumptionsLLM` directly (LLM-only path) and feeds `cleanTranscript`'d text into chatPipeline. Voice attributes are NOT extracted from transcript here — `extractVoice` is chat-only at `chatPipeline.ts:421`.
- Routes through PATCH_ATOM (LLM patches) when ASSUMPTIONS confidence is high; through ASSUMPTIONS_ATOM clarify-card when low.

### G4 (P2) — Voice extraction fires on too narrow a window
`chatPipeline.ts:421-437` only extracts voice when `source==='chat'` AND `(verb==='add' || !target)` AND target type ∈ {hero, text, undefined} AND `currentVoice.length === 0`. This means:
- Listen mode never gets voice extraction (covered in P127 `cleanTranscript`, but voiceAttributes stays empty).
- Once voice is set once, future prompts can never refine/replace it — the extractor never re-fires.
- "Add a contrarian blog post" with target=blog skips extraction (not in eligible target types).

### G5 (P2) — voice cue table is small
`voiceExtraction.ts:23-50` ships 16 single-keyword cues + 6 bigram cues. Common voice-shifters absent: "snarky", "wry", "irreverent", "earnest", "academic-rigor", "sales-y", "minimalist-prose", "long-form", "literary", "investigative", "first-person", "second-person". For a 12K-word library of opinionated copy, the cue surface is order-of-magnitude small.

## Q5 — Storytelling preset wire (or lack thereof)

### Status: SHIPPED AS DEAD-CODE LIBRARY
- 8 archetypes shipped at `src/data/storytelling/{index.ts:9-76,presets.ts}` per ADR-141 D2 (don-miller-storybrand / theron-miller-hard-twist / founder-direct / academic-rigor / dry-humor-narrator / beers-and-pizza-casual / investigative-deep-dive / contrarian-tech).
- Helpers `getPresetByName(name)` + `getPresetForVoice(voiceAttributes[])` exported (`index.ts:38,52`).
- **Production importers: ZERO.** Verified via `grep -rn "STORYTELLING_PRESETS\|getPresetByName\|getPresetForVoice\|from.*storytelling" src/ --include="*.ts" --include="*.tsx"` excluding `/data/storytelling/`. No hits.
- 5 P113 example sites (`src/data/examples/{podcaster-indie, course-creator-tech, contrarian-blog, indie-author-fiction, research-newsletter}.json`) cite a preset by id in their JSON, but only as static metadata — no runtime path reads it.
- `voiceExtraction.ts` returns `voiceAttributes` (e.g. `["confident", "direct", "understated"]`) which is the EXACT shape `getPresetForVoice` accepts — but no code calls `getPresetForVoice(extracted.voiceAttributes)` anywhere in the pipeline.

### G6 (P1) — Preset lookup never fires
Wire opportunity at `chatPipeline.ts:428` (already inside the voice-extraction conditional): after applying the `voiceAttributes` patch, also call `getPresetForVoice(voice.voiceAttributes)` and stash the matched preset id on the site config (e.g. `site.storytellingPresetId`). Downstream the matcher / applier / contentGenerator could read it. Without this, the 217 LOC of `presets.ts` + the 5 opinionated example sites' preset citations are decorative metadata only.

### G7 (P3) — No chat-side "use Don Miller voice" affordance
A user can't say "use Don Miller voice" and have anything happen. INTENT_ATOM has no preset-lookup verb; storytelling presets aren't surfaced in the AISP system prompt; chat suggestions don't list them. Listen mode certainly can't reach them.

## Master fix list

| # | Fix | LOC est | Priority | Closes |
|---|-----|---------|----------|--------|
| 1 | Drop `!isDraft` ImagePicker gate on the 5 Simple section editors (use `pickerMode="library-only"` for SIMPLE, `"full"` for EXPERT) | ~30 (5 files × ~6 LOC) | **P1** | G1 — novice users currently can't change images |
| 2 | Wire `getPresetForVoice` after voice extraction; stash `site.storytellingPresetId` on config | ~12 (chatPipeline.ts + masterConfig.ts schema field) | **P1** | G6 — storytelling presets are dead code |
| 3 | Widen voice-extraction eligibility: re-fire when current voice differs from extracted; allow listen mode source; expand target whitelist | ~15 (chatPipeline.ts conditional) | **P2** | G4 — voice fires on too narrow a window |
| 4 | Expand `voiceExtraction.ts` cue tables: +12-15 single + +4-6 bigrams (snarky/wry/irreverent/earnest/literary/long-form/...) | ~25 (voiceExtraction.ts) | **P2** | G5 — small cue surface |
| 5 | Have XAIDocsTab generators consume PROCESS/DDD output when present (read from project store; placeholder text when absent) | ~30 (one helper + 6 generator edits) | **P2** | G2 — Whiteboard specs ignore atom output |
| 6 | Delete or reactivate `aisp/templateSelector.ts` (SELECTION_ATOM orphan) | ~5 deletion (or ~40 if reactivate) | **P3** | INERT atom #1 |
| 7 | Remove or wire CONTENT_ATOM `kind:'generator'` path; today only `kind:'patcher'` fires from chatPipeline | ~5 deletion (or ~50 wire) | **P3** | INERT atom #2 |
| 8 | Add catalog-default fallback in image preview when section has no image (`ImageSectionSimple.tsx:106` area) | ~10 | **P3** | image-empty UX |
| 9 | XAIDocsTab JSON tab → emit structured spec JSON instead of raw config dump | ~20 | **P3** | G3 — JSON dump |
| 10 | Surface chat-side "voice picker" suggestion chip listing the 8 storytelling preset names | ~25 | **P3** | G7 — no preset affordance |

**Total P1: ~42 LOC. P1+P2: ~127 LOC. All: ~177 LOC** (assumes orphan-deletion choices for #6 and #7).

## Verdict

The image-selector pipeline is technically complete (300 imgs / 41 vids / 13 effects, search, categories, upload zone) but has a load-bearing UX bug: **SIMPLE mode hides the picker on every Simple-tab section editor except hero background** — the default novice tab is exactly the one where the picker is gated off (G1, P1).

The atom layer ships 9 atoms but only 5 fire in Whiteboard production and 3 fire in Planning production; **SELECTION_ATOM and CONTENT_ATOM are inert orphans**. The two stacks (Whiteboard chat / Planning chat) DO NOT share atoms — calling them all "AISP" oversells the unification.

The biggest quality miss is the storytelling preset library (P113/D2): 8 presets + 217 LOC of voice patterns ship with **zero production importers**. The voice extractor populates `voiceAttributes`, but `getPresetForVoice` is never called — fixable in ~12 LOC at `chatPipeline.ts:428` (G6, P1).

Spec generators (Whiteboard XAIDocsTab × 6) emit reasonable prose but have no awareness of PROCESS/DDD/AGENT output — Planning's atom-derived narrative does NOT reach the Whiteboard spec surface (G2, P2).

Recommended P114 Wave 2 dispatch: fix #1 (image picker gate) + #2 (preset wire) as the two P1 closures (~42 LOC). Defer #3-#5 to a Wave 3 if budget permits; #6-#10 are nice-to-have polish.
