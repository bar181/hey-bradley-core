# Sprint D — R1 UX Review

> **Reviewer:** R1 UX
> **Score:** 68/100 (Grandma equivalent)
> **Verdict:** **FAIL** at Grandma ≥76 / Framer ≥85 — Grandma 68 (−8), Framer 78 (−7)

## Summary

Sprint D shipped real plumbing (4-atom AISP, library API, persistence, section defaults, kind dispatch) and the engineering is honest in the ADRs — but **the user-facing surface regressed**. The new `generate-headline` template is reachable from the chat, matches user phrasing ("rewrite the headline"), and then hands the user developer-speak ("Generator templates need to run through the 2-step pipeline. Try the chat instead of direct routing.") because `runTwoStepPipeline` is **never called** from `chatPipeline.ts`. The "deferral" in the session log understates the impact: this isn't "no UI yet" — it's an actively user-broken affordance shipped to production. Library APIs (`listAllForBrowse`, `listTemplatesByKind`, `TEMPLATE_LIBRARY`) and `AISPTranslationPanel` (P27) have **zero importers** anywhere in `src/components/` or `tests/` integration specs. The 93/100 composite is engineering-honest; the Grandma 76 ceiling persona-score in the session log is **not earned**.

## Findings

### MUST FIX (blockers)

**F1 — `generate-headline` surfaces developer-speak to end users (CRITICAL).**
File: `src/contexts/intelligence/templates/registry.ts:152-156` + `src/contexts/intelligence/chatPipeline.ts:207-218`.
When a user types "rewrite the headline", `tryMatchTemplate` (router.ts:31) matches the GENERATE_HEADLINE regex and invokes its envelope. The envelope returns `{patches: [], summary: 'Generator templates need to run through the 2-step pipeline. Try the chat instead of direct routing.'}`. `chatPipeline.ts` line 207-218 catches the empty-patch case as "friendly empty-patch" and renders the summary verbatim plus `_(template: generate-headline)_` debug suffix to the typewriter. A Grandma user sees: *"Generator templates need to run through the 2-step pipeline. Try the chat instead of direct routing. (template: generate-headline)"* — three categories of jargon (generator/2-step pipeline/template) and an internal id leak. **`runTwoStepPipeline` is never called from chatPipeline**: I grepped `src/contexts/intelligence/chatPipeline.ts` and only `selectTemplate` references appear (line 175, 181 — these are AISP-rules confidence checks, NOT 2-step calls). Fix: either (a) call `runTwoStepPipeline` BEFORE `tryMatchTemplate` in chatPipeline.ts when `aisp` indicates a content verb ("rewrite"/"regenerate"), or (b) until the 2-step path is wired, **remove GENERATE_HEADLINE from TEMPLATE_REGISTRY** so the pattern doesn't reach the user, and add the help message to FALLBACK_HINT instead. The current state ships a UX dead-end disguised as a feature.

**F2 — AISPTranslationPanel is orphaned (zero importers).**
File: `src/components/shell/AISPTranslationPanel.tsx`. ADR-062 line 57 says "AISPTranslationPanel ChatInput integration (deferred to a dedicated UI mini-phase) will display the generated tone/length/confidence so users see WHY a particular copy was chosen." ADR-062 line 63 says "The panel exists (ADR-056 P27) but is opt-in and doesn't yet surface 2-step output." Reality: `grep -rn "AISPTranslationPanel" src/ tests/` returns ONLY the file's own definition + 2 doc-comment self-references in twoStepPipeline.ts and contentGenerator.ts. The panel has **no importers, no integration test, no E2E**. "Opt-in" is the wrong word; it doesn't appear anywhere a user could opt into it. The Capstone thesis claim that "AISP is user-visible" (per ADR-056) is only true if the user clones the repo, opens the file, and reads JSX. Fix: either delete the file (honest) or wire it into ChatInput.tsx behind an EXPERT-tab toggle in P34. The ADR language must stop saying "exists / opt-in" — it doesn't exist for users.

**F3 — Library APIs (`listAllForBrowse`, `listTemplatesByKind`, `getTemplateById`) have zero UI surface.**
Files: `src/contexts/intelligence/templates/library.ts:62-145`, `src/contexts/persistence/repositories/userTemplates.ts`. Five public APIs (`listTemplates`, `listTemplatesByCategory`, `listTemplatesByKind`, `getTemplateById`, `listAllForBrowse`) plus a CRUD repo are tested at the unit level (P29: 8 tests; P30: 9 tests) but consumed by zero React components. ADR-058 line 53 acknowledges "**No UI surface in P29.** The library API is plumbing; consumer UI (browse picker) lands in Sprint D P30 alongside the persistence layer." P30 didn't ship a picker either — `BrowseTemplate` projection exists but no `<TemplatePicker>` anywhere in `src/components/`. Net: a user has zero discoverability of the 4 templates, no way to know `category: 'content'` exists, no way to see the 4 declared `examples` on `generate-headline`. The persona-score Grandma 76 is propped up by P28 functionality, NOT P29-P33 additions. Fix: either ship a minimal picker in the EXPERT-tab Resources panel (a 1-screen list that calls `listAllForBrowse` + renders examples) OR be brutally honest in the session log and STATE.md that Sprint D is library/persistence-only and Grandma stayed at 76 because the new surface is invisible — don't claim a Sprint D delta on Grandma. The session log says Grandma 76 "held; UI surface unchanged in P33" — that's correct for P33 but the WHOLE SPRINT shipped without a Grandma-visible delta.

**F4 — Examples array on GENERATE_HEADLINE points at no UI.**
File: `src/contexts/intelligence/templates/registry.ts:145-150`. `examples: ['rewrite the headline', 'regenerate hero copy', 'rewrite headline with brand voice', 'rewrite the headline more bold']` is declared but consumed by zero browse UI (per F3). The "Try an Example" dialog in `ChatInput.tsx:431` (`data-testid="try-example-btn"`) draws from `EXAMPLE_SITES` (whole-site examples), NOT from template examples. A Grandma user has no way to discover the 4 phrasings that would invoke the new generator. Fix: either wire `listTemplates()` → "Try a Command" sub-section of the example dialog, or strip the `examples` field until consumed — currently it's dead code that creates a false impression of completeness in code review.

### SHOULD FIX (LOW)

**L1 — Fallback hint hasn't been updated for Sprint D.**
File: `src/contexts/intelligence/chatPipeline.ts:47-53` + `src/components/shell/ChatInput.tsx:251-257`. FALLBACK_HINT lists 5 examples — none mention "rewrite the headline" or any generator phrasing. New users hitting the fallback path get directed at P15-P19 features only. Fix: add `'Rewrite the hero headline (bolder)'` to the hint list.

**L2 — `generateContent` returning `null` is silent for the user.**
File: `src/contexts/intelligence/aisp/contentGenerator.ts:83-119` + `twoStepPipeline.ts:60`. When `generateContent` returns null (no quoted phrase, length-cap fail, forbidden content, confidence below threshold), `twoStepPipeline.ts:60` returns null, the entire 2-step result is null, and the caller falls through. There's no specific error category — the user sees the same fallback as a complete miss. Even WITH the F1 fix, a user who types `rewrite the headline more bold` (no quoted phrase) will get the silent fallback. The QUOTED_PHRASE_RE regex (`contentGenerator.ts:39`) DEMANDS a quoted phrase as a hard precondition — comment line 76 says "no LLM in this stub will hallucinate copy from thin air" but the user gets no message explaining "I need a quoted phrase, e.g. rewrite the headline to 'X'". Fix: when `extractCopy()` returns null, return a sentinel `GeneratedContent | { error: 'needs_quoted_phrase' }` discriminated union; surface user-friendly hint.

**L3 — User can't see WHY a tone was chosen.**
File: `src/contexts/intelligence/aisp/contentDefaults.ts:45-65`. ADR-061 line 47-50 acknowledges "playful + warm overlap. 5 tones is the right granularity for now". Section defaults pick `bold/short` for hero, `warm/short` for footer, etc. — but the user sees no rationale. `GeneratedContent.rationale` exists (`contentAtom.ts:88`) and `contentGenerator.ts:115-117` populates it ("extracted quoted copy (X chars) + tone cue matched"), but no UI consumer renders it. Even when F1 + F2 are fixed, the AISPTranslationPanel doesn't know about the `generated` field — its props (line 16-23 of AISPTranslationPanel.tsx) only carry `intent`, `source`, `userText`. Fix: extend `AISPTranslationPanelProps` with optional `generated?: GeneratedContent` and render tone/length/rationale when present. ADR-062's claim that the panel "will display the generated tone/length/confidence so users see WHY" is a future-tense promise, not a Sprint D delivery.

**L4 — Migration 003 metadata is unviewable by users.**
File: `src/contexts/persistence/migrations/003-user-templates.sql`. Migration adds the `user_templates` table but no UI lets a user create, view, or delete a row. `userTemplates.ts` exposes CRUD but has zero callers in `src/components/`. A "save this as a template" chat affordance was the natural P30 demo and didn't ship. Fix: at minimum, add a debug pane in EXPERT-tab Data showing `listUserTemplates()` rows so the persistence is at least observable.

### Honest acknowledgments

**A1 — ADR-062 line 63 is honest about the AISPTranslationPanel deferral.** The line "The panel exists (ADR-056 P27) but is opt-in and doesn't yet surface 2-step output. Deferred to dedicated UI mini-phase post-Sprint-D" is technically true that the file exists — but "opt-in" is misleading because no user can opt in (no toggle, no consumer). Acceptable for ADR purposes; misleading for persona-score purposes.

**A2 — ADR-058 line 53 honestly defers the picker UI.** "No UI surface in P29. The library API is plumbing; consumer UI (browse picker) lands in Sprint D P30" — direct admission. P30 didn't ship the picker either, but ADR-059 doesn't claim it did. Honest.

**A3 — ADR-060 line 64-68 is honest about the stub.** "This is intentionally not LLM-backed at P31. The Σ surface and Γ rules are validated end-to-end in pure-unit tests; LLM wiring lands at P33 (AISPTranslationPanel + ChatInput bridge) using the same shape." That P33 claim DID NOT LAND (per ADR-062 line 61), so the "lands at P33" forecast is now outdated. ADR-060 should be amended with a status footnote pointing at ADR-062's deferral.

**A4 — `BrowseTemplate` split-type design is correct.** library.ts:108-145 separates runtime templates (with `matchPattern: RegExp` + `envelope: fn`) from JSON-serializable browse metadata. This is the right call for persistence — the criticism is not the type, it's that nobody renders it.

**A5 — The 4-atom AISP architecture (INTENT→SELECTION→CONTENT→PATCH) is genuine engineering progress** and the ADRs (053, 057, 060, 062) are coherent. The Capstone-thesis composite (98) is defensible *as engineering*. The criticism is purely UX-surface. Distinguish capstone-evaluator score (technically valid) from end-user-Grandma score (not earned).

## Persona scores

- **Grandma: 68/100** (rationale: regression from 76 baseline. F1 alone — surfacing "Generator templates need to run through the 2-step pipeline. Try the chat instead of direct routing. (template: generate-headline)" to a non-technical user — is a -8 hit. F2 + F3 + F4 confirm Sprint D added zero discoverable user-visible features. Without F1 fix, every "rewrite my headline" attempt by a real user would generate a support ticket. Persona-score 76 in the session log is unsupported by the codebase. Floor at 68 because P28 baseline still works for non-content commands.)

- **Framer: 78/100** (rationale: a designer who cares about copy quality would type "rewrite the headline more bold" expecting the new generator to fire — and would get F1's developer-speak. The promised tone/length transparency (ADR-062 line 57: "users see WHY a particular copy was chosen") is not in the UI. Section defaults table (ADR-061) is excellent design thinking but invisible to designers. Floor at 78 because the engineering plumbing is real and a fix for F1 + L3 in a single mini-phase would push Framer to 88+.)

## Recommended fix-pass scope (P33+ mini-phase)

Three blocker fixes minimum, in priority order:
1. **F1** — wire `runTwoStepPipeline` into `chatPipeline.ts` between AISP classification and `tryMatchTemplate`, OR remove `GENERATE_HEADLINE` from the registry until 2-step is wired (≤30m).
2. **F2 + L3** — wire AISPTranslationPanel into ChatInput.tsx, extend props to accept `generated?: GeneratedContent`, render tone/length/rationale (≤45m).
3. **F4 + F3** — add a minimal "Try a Command" sub-section to the example dialog backed by `listTemplates()` so the 4 templates + their examples become discoverable (≤30m).

Total estimated fix-pass: ~1.75 hours at observed velocity. Without these, Sprint D's persona-score claim of Grandma 76 is fiction; with them, Grandma climbs to ~80 and Framer to ~88.

---

*Reviewer note:* The brutal-honest mandate forced me to call F1 a blocker because the user impact is direct, not theoretical — type the command, see the jargon. The Sprint D engineering is real and the ADR documentation is conscientious. The gap is the UI mini-phase that was deferred at every Sprint D phase boundary. Either ship it next, or stop scoring Grandma climbs.
