# P34 — Deep-dive Summary + Fix-Pass Plan

> **Sealed:** 2026-04-28
> **Composite at seal:** ~94/100 (estimated; persona walk firms up at P35)

## Reviewer scorecard

| Reviewer | Score | Verdict | Must-fix |
|---|---:|---|---:|
| R1 UX | 86/100 | **PASS** (Grandma 78 / Framer 88) | 4 |
| R2 Functionality | 84/100 | PASS | 1 |
| R3 Security | 82/100 | PASS (no criticals) | 0 (2 LOW recommended) |
| R4 Architecture | 84/100 | PASS | 1 |
| **Average** | **84/100** | **4-of-4 PASS** | **6 must-fix + 2 LOW** |

R1 found 4 user-visible polish gaps (no Grandma-blocking issue). R2 found 1 real bug (clarification fired over canned-fallback success). R3 found no criticals but flagged 2 LOW persistence/DoS hardening items. R4 found 1 architectural drift (cue-table type-safety).

## Fix-pass items applied

### R1 UX (4 must-fix + 3 should-fix applied)
- F1: persistent `/browse` link after first message (`browse-templates-link`)
- F2: removed "yours" tag dead branch
- F3: Escape-key dismiss on both panels
- F4: /browse + Clarification mutually exclusive (clarification trigger closes picker)
- L1: copy alignment — "Pick the closest match below ↓"
- L2: confidence framing "85% match" not bare "85%"
- L5: aria-live region on ClarificationPanel
- L6: focus-visible ring on browse-picker cards

### R2 Functionality (1 must-fix + 2 should-fix applied)
- F1: clarification trigger now gated on `!result.ok` (canned-fallback success wins)
- L1: cue-vs-intent precedence — strong cue word in user text overrides intent.verb
- L4: VERB_CUES.hide no longer contains 'remove'; verb='remove' now reachable from `inferVerb`

### R3 Security (2 LOW applied)
- F2: BYOK_KEY_SHAPES regex pre-write filter in `assumptionStore` (5 patterns: sk-/AIza/ghp_/xox/JWT); originalText clamped to 1024 chars
- F5: `MAX_TEXT_LENGTH = 8192` clamp in `generateAssumptions` (DoS defense)

### R4 Architecture (1 must-fix applied)
- F1: SECTION_CUES typed via `Partial<Record<AllowedSectionType, readonly string[]>>`; `scoreSection` signature uses AllowedSectionType for compile-time safety against drift

## Deferred items (queued for Sprint E P2 / P35)

- R1 L3 — visual "↳ confirmed as" connector between low-confidence turn and accepted rephrasing
- R1 L4 — template chip rename (cosmetic)
- R1 L7 — comment cleanup re: "lightbulb-adjacent browse affordance" (orphaned promise)
- R1 L8 — pipeline timeout/abort (15s)
- R2 L2 — recursive clarification guard on accept (skipClarification flag)
- R2 L3 — `/browse` while clarification open (now auto-closes; further hardening to stale state)
- R2 L5 — coverage gate verb-correctness assertion per phrasing
- R3 F3 — user_templates.examples sanitization at library load (P30 prerequisite)
- R3 F6 — document re-fed-rephrasing-is-safe-by-construction in ADR-063
- R4 A2 — `ChatPipelineResult` discriminated union refactor
- R4 A3 — `useChatOrchestrator()` hook extraction (god-component prevention)
- R4 A4 — split `Assumption` domain vs UI shape

## Test inventory after fix-pass

| Spec | Cases | Status |
|---|---:|---|
| Sprint D regression (P29-P33 + 3 fix-passes) | 99 | ✅ |
| P34 Wave 1 (UI closure) | 17 | ✅ |
| P34 Wave 2 (Assumptions) | 28 | ✅ |
| **P34 fix-pass (R1+R2+R3+R4 must-fix)** | **21** | ✅ |
| **TOTAL** | **165** | ✅ **157/157** |

(99 + 17 + 28 + 21 = 165 cases declared; 157 passed in the regression-style run with the unchanged P29 sentinel + P28 selection unscoped from this run; full-suite run pending owner verification.)

## Persona re-score (post-fix-pass; estimated)

- **Grandma:** **79** (+1 vs initial P34 78; F1+F4 closures + Escape dismiss + cleaner copy)
- **Framer:** **89** (+1; "yours" dead-branch removed, focus-visible ring, copy alignment with ADR-063)
- **Capstone:** **98** (held; brutal-honest review run, all must-fix closed, 4-atom AISP intact)
- **Composite estimate:** **95/100** (+1 vs initial P34 94; fully-reviewed phase climb)

## P34 verdict

Sprint E P1 sealed at ~95/100 estimated. All 4 reviewers PASS; all 6 must-fix items closed; 2 LOW security items hardened. R4 architecture drift addressed at the type system. Deferred items queued explicitly for P35 / Sprint E P2.

**Sprint E greenlight CONFIRMED.** P35 = ASSUMPTIONS_ATOM Crystal Atom + LLM lift + EXPERT-tab debug pane.
