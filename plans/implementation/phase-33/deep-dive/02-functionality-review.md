# Sprint D — R2 Functionality Review

> **Score:** 84/100
> **Verdict:** PASS (with 2 must-fix items before Sprint E opens)

## Summary

Sprint D's functional surface (P29 library API, P30 persistence, P31-P33 content generators + 2-step bridge) is correct on the happy path and the post-R1 `GENERATE_HEADLINE` rewire works. Two real defects hide in browse-merge id collisions and the `Γ R3` content scan; both are easy fixes but would surface as user-visible bugs the moment a user authors templates or pastes non-`http` URI scheme copy.

## MUST FIX

- **F1: `src/contexts/intelligence/templates/library.ts:124-145` — `listAllForBrowse` does NOT de-duplicate by id.** Registry rows are concat'd with user rows; if a user authors a template named `make-it-brighter` (or a future seed re-uses an id), browse UI shows BOTH. Worse: any consumer doing `getTemplateById` against the merged list (line 87 only walks `TEMPLATE_LIBRARY`, OK there — but a UI list-render keyed by id will have React duplicate-key warnings + ambiguous "Apply" actions). **Fix:** in `listAllForBrowse`, build a `Set<string>` of registry ids and skip user rows whose id collides (or rename them with a `user:` id prefix at insertion in `userTemplates.ts`). Add a test in `p30-template-persistence.spec.ts` that injects a colliding id and asserts dedup behavior.

- **F2: `src/contexts/intelligence/aisp/contentAtom.ts:100` — `Γ R3` URL scan only catches `http(s)://`.** Misses `mailto:`, `ftp://`, `data:`, `javascript:`, `tel:`, `file://`. The atom comment ("XSS protection lives in the patch validator") is correct as a defense-in-depth claim, BUT the test on line 109-112 asserts `Γ R3` rejects URLs as a content-quality signal (no URLs in headlines). A user pasting `set headline to "Email me at mailto:foo@bar.com"` slips past the content scan and produces a malformed headline. **Fix:** broaden to `/(?:[a-z]+:\/\/|mailto:|tel:|data:|javascript:)/i` and add unit cases in `p31-content-generators.spec.ts`.

## SHOULD FIX

- **L1: `src/contexts/intelligence/aisp/contentAtom.ts:103` — JSON-shaped check (`/^\s*[{[]/`) only catches text STARTING with `{`/`[`.** Copy like `Free pricing! {"hack":1}` is accepted. Tighten to also reject if `text.includes('":') && text.includes('}')` for stricter Γ R3.

- **L2: `src/contexts/persistence/repositories/userTemplates.ts:44-57` — `createUserTemplate` does NOT catch SQLite PRIMARY KEY violations.** A duplicate id throws an unhelpful `[SQLITE_CONSTRAINT]` error to the caller. Wrap in try/catch and rethrow as `new Error('[userTemplates] duplicate id: ${input.id}')`, OR document `UPSERT` semantics. No test covers this.

- **L3: `tests/p33-fix-pass-envelope.spec.ts:60-65` — dead/confused code.** `const m = /^/.exec(text)` plus `void m` is a leftover; the test passes accidentally because `text2` happens to contain the word "bold" verbatim and `summary` includes the tone label "bold". This is NOT verifying that the GENERATED CONTENT carries tone — only that the regexp captured the cue. Replace with a case where the user input does NOT include the literal tone word but the section default forces it (e.g. `sectionType: 'hero'` → expects `"(bold/short)"` in summary).

- **L4: `src/contexts/intelligence/aisp/contentGenerator.ts:39` — `QUOTED_PHRASE_RE` upper bound `{1,400}`.** A 401-char quoted phrase silently doesn't match → `extractCopy` returns null → `generateContent` returns null. User sees nothing useful. Should match up to e.g. 600 then fail explicitly via `Γ R1` length check so the rationale path can surface "copy too long for selected length". One-line behavioral improvement.

- **L5: `src/contexts/intelligence/templates/library.ts:62-74` — decoration accepts `t.examples ?? fallback.examples` but the type guard `Array.isArray(t.examples)` is missing.** A template author who accidentally types `examples: 'foo'` (string, not array) breaks `t.examples ?? ...` because string is truthy, so `??` keeps the string. `listTemplatesByKind` later does `.filter` and breaks at runtime. Add `Array.isArray(t.examples) ? t.examples : fallback.examples`.

- **L6: `src/contexts/intelligence/aisp/twoStepPipeline.ts:60-77` — generator path hardcodes `heroHeadingPath` for ALL generator templates.** When P34+ adds a `regenerate-cta` generator, this shortcut targets the hero heading regardless of intent. The TODO comment ("P33+ generators that target other sections will swap this resolver") acknowledges it, but it should at minimum branch on `sectionType !== 'hero'` and refuse rather than silently rewrite the wrong section. As-is it's a footgun for the next phase.

- **L7: `tests/p29-template-library.spec.ts:60` — `expect(generators.length).toBeGreaterThanOrEqual(0)`.** Always true; tests nothing. Should assert `=== 1` after P33 (matches what p33-content-bridge.spec.ts:57 already does).

## Acknowledgments

- **A1: GENERATE_HEADLINE post-R1 rewire is correct.** Envelope calls `generateContent` directly, returns real patches on quoted copy, friendly help on bare phrasing, and the summary includes tone+length so the user understands the inference. R1 F1 closure verified.
- **A2: `parseUserTemplate` correctly returns null on malformed JSON, non-array examples, and non-object payloads (`userTemplates.ts:114-139`).** Defensive parsing is solid.
- **A3: `deleteUserTemplate` correctly handles non-existent ids — `getRowsModified()===0` returns false WITHOUT calling persist().** No spurious DB writes.
- **A4: `runTwoStepPipeline` correctly returns null when `generateContent` fails (line 60), allowing graceful fall-through to the legacy template chain.** Π-pattern preserved.
- **A5: Match-pattern collision audit clean.** GENERATE_HEADLINE's `(?:rewrite|regenerate|generate)` does NOT overlap with CHANGE_HEADLINE's `(?:change|set|update)`. "rewrite the description" does NOT match (no `headline|hero` token). Router order safe.
- **A6: `Γ R1` length cap correctly enforced** (`contentGenerator.ts:99`). Confidence threshold gating (`< 0.7 → null`) is correct.
- **A7: 4-atom AISP architecture (INTENT / SELECTION / CONTENT / PATCH) is consistent across `contentAtom.ts` + `twoStepPipeline.ts` + ADR-060.** Capstone-grade clarity.
- **A8: Migration 003 enum CHECKs (`p30-template-persistence.spec.ts:48-55`) lock the category/kind contract at the DB level — defensive, future-proof.**

## Score

**84/100** — Sprint D is functionally sound, the post-R1 fix-pass closes the most user-visible bug, and the 4-atom AISP shape is coherent. F1 (browse de-dup) is a real correctness defect that surfaces the moment a user authors a template (i.e., the entire P30 raison-d'être). F2 (Γ R3 URI coverage) is a real content-quality gap that the existing tests imply should be caught. SHOULD-FIX items are quality-of-implementation issues, not blockers. Knock out F1+F2 in a 30-minute fix-pass and this is a 90+ phase. Sprint D end-of-sprint review can ship; queue F1+F2 as P33+ fix-pass-2 before Sprint E P1 ships.
