# Sprint D — R4 Architecture Review
> **Score:** 84/100
> **Verdict:** PASS

## Summary

Sprint D's 4-atom AISP architecture (INTENT → SELECTION → CONTENT → PATCH) is genuinely coherent and the split-type pattern (TemplateMeta vs BrowseTemplate) is the right call given function-field non-serializability. The phase decomposition is honest engineering rather than padding, but the decoration-over-registry approach has accumulated three parallel metadata paths (Template fields, BASELINE_META, BrowseTemplate) that need consolidation before Sprint E.

## MUST FIX

- F1: `src/contexts/intelligence/templates/library.ts:62-74` — Three-tier metadata resolution (Template fields → BASELINE_META → hard fallback) is functional but `BASELINE_META` is now dead-weight: only 3 P23 IDs use it and none can ever be modified. Either inline the metadata onto those 3 Template entries (delete BASELINE_META) or formalize it as a deprecated migration shim with a TODO-removal phase. Current state quietly invites a fourth lookup path.
- F2: `src/contexts/intelligence/aisp/twoStepPipeline.ts:62-65` — `heroHeadingPath(config)` is hardcoded inside the generator branch; ADR-062 acknowledges this ("future generators will swap this resolver") but the dispatch site has no extension hook. A single `kind === 'generator'` branch that always resolves to hero will break the moment a second generator ships. Introduce a `resolveTargetPath(sectionType, config)` indirection now or carry an explicit ADR-062 follow-up ticket.
- F3: `docs/adr/ADR-059-template-persistence.md:75` + `library.ts:108-115` — `BrowseTemplate` is a structural projection of `TemplateMeta` minus runtime fields plus `source`. The repository's row shape (id/name/category/kind/examples_json/payload_json) is a third structural twin. Three near-identical types for "template metadata" risks drift; a shared `TemplateMetaCore` interface that both extend would reduce surface.

## SHOULD FIX

- L1: `contentAtom.ts:26-53` — CONTENT_ATOM Σ declares `Length:{value, max_chars∈{60,160,400}}` but only `value` is part of the runtime `GeneratedContent` (line 80-88). The atom's Σ and the TS reflection are not isomorphic; reader needs to know `LENGTH_MAX_CHARS` (line 74-78) is the canonical max-chars source. Either fold `max_chars` into `GeneratedContent` or add an explicit ADR comment that Σ describes the *contract* and TS reflects only *output*.
- L2: ADR-062 §"TwoStepResult.generated optional field" + `twoStepPipeline.ts:25-31` — `TwoStepResult` shape is now `{step1, step2, generated?, totalConfidence}`. The `generated` field is generator-path-only and `step2.applied` semantics differ between paths (patcher: patches.length>0; generator: always true). A discriminated union `{kind:'patcher', ...} | {kind:'generator', generated, ...}` would type-narrow at consumers (AISPTranslationPanel) and prevent guard-forgetting.
- L3: ADR-058 §Categories closed at 3 + ADR-061 19-section table — The category enum (`theme|section|content`) and the SECTION_CONTENT_DEFAULTS table (19 entries) are both "closed by convention" but maintained in different files with no compile-time linkage to INTENT_ATOM `ALLOWED_TARGET_TYPES`. ADR-061 explicitly notes the drift risk. Add a typescript `satisfies` assertion or unit test enforcing `Object.keys(SECTION_CONTENT_DEFAULTS) ⊆ ALLOWED_TARGET_TYPES`.
- L4: ADR-059 §"FK to projects: deferred" — Symmetry with ADR-040b is clean, but `user_templates` has no `project_id` column at all. If templates are user-scoped (not project-scoped), that's an implicit decision worth one sentence; if they're meant to be project-scoped eventually, the column should exist null-able now to avoid a future migration-004 split.
- L5: ADR-060 §Σ-restriction rationale — The 4-atom comparison table is clarifying, but PATCH_ATOM is described as having the "widest Σ" with no Γ/Λ/Ε structure shown. Add a footnote confirming PATCH_ATOM (ADR-045) was authored to the same Crystal Atom shape so the "4 atoms cohere" claim survives audit.

## Acknowledgments

- A1: **Bounded-context discipline holds.** Persistence (`migrations/003`, `repositories/userTemplates.ts`) does not import from intelligence; intelligence (`library.ts`, `twoStepPipeline.ts`) does not import from persistence — the `loadUserRows` callback injection (`library.ts:124-126`) is the textbook DDD seam and it's correct.
- A2: **Decoration-over-registry was the right call.** P29 shipping `TemplateMeta extends Template` with a fallback table preserved P23-P28 consumers verbatim. ADR-058 §"Why a decoration, not a refactor" pre-empts the obvious critique honestly.
- A3: **Σ stability across stub/LLM is real architectural foresight.** ADR-060 §"intentionally not LLM-backed at P31" with identical contract for stub and LLM means P33 generator path is testable without token spend, and the swap is implementation-only. This is genuinely well-sequenced.
- A4: **5-phase decomposition is honest.** P29 (API surface), P30 (persistence + split-type), P31 (atom + stub), P32 (defaults table), P33 (kind dispatch + first generator) — each phase ships an artifact that survives independently and could be reverted in isolation. This is not stretched trivial work; the alternative was a 1500-LOC PR that nobody could review.
- A5: **`generate-headline` end-to-end through 4 atoms** in P33 is the architectural keystone. The pipeline (`twoStepPipeline.ts:57-77`) flows section type from INTENT_ATOM → CONTENT_ATOM → PATCH_ATOM cleanly. The `Math.min(selection.confidence, generated.confidence)` (line 75) is the right composition rule for a multi-stage probabilistic pipeline.
- A6: **ADR cross-references form a clean DAG.** 058→059→060→061→062 each explicitly cites its predecessor; ADR-062 reaches back to 045/053/057/058/060/061 acknowledging the full dependency cone. No orphan references found.
- A7: **`TwoStepResult.generated` documented as opt-in for future UI** (ADR-062 §"No AISPTranslationPanel UI work in P33") rather than smuggled in. Discipline on deferred surface.

## Score

84/100 — Sprint D delivers the 4-atom AISP architecture with bounded-context coherence, honest phase decomposition, and a working end-to-end generator path. Deductions: -8 for the three parallel metadata paths (F1+F3) which are the architectural debt this sprint accumulated, -4 for the hardcoded `heroHeadingPath` dispatch (F2) that breaks the "future generators plug in via single registry entry" claim from ADR-062 §Consequences, -2 for `TwoStepResult` shape sprawl that should have been a discriminated union (L2), -2 for the three "closed-enum maintained in separate files" drift hazards (L3). The architecture is production-shaped; the cleanup is one half-day of work and should land as the first item of Sprint E or a Sprint-D fix-pass before the brutal-honest persona re-score.
