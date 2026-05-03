# P108 / TEST-RUNTIME-SHIFT — Preflight

> **Phase:** P108 · **Sprint:** TEST-RUNTIME-SHIFT · **Date:** 2026-05-04
> **Predecessor:** P107 / LOG-INTEGRITY-EXPANSION sealed at `c5a25e6` (137/137 cumulative GREEN)

## Mandate

Close the test-trustworthiness gaps surfaced by Track D. Three concerns:

1. **D7 — `tests/p76-spec-export-quality.spec.ts` is EMPTY** (0 test calls despite P76 / OC-9 seal claim of ADR-101 enforcement). Fill it with real tests.
2. **D4 — Zero mobile viewport runs** — `playwright.config.ts` has only Chromium/Desktop project. Add 375 / 390 / 428px mobile viewport projects.
3. **D1 + D3 — Zero behavioral coverage for runtime helpers** — `cleanTranscript`, `validateEventType`, `validateSectionType` each have zero behavioral tests; only source-grep `existsSync` checks. Add real unit tests that import + invoke the helpers.

## Out of scope

- ADR README rebuild → P109
- 1,038 existsSync soft-pass guard reduction → post-launch (would require refactoring most spec files)
- Live-LLM smoke (CF#4) / STT (CF#5) — owner-required

## Agents · 2 waves

### Wave 1 — 3 parallel disjoint-scope agents

#### A8 — Fill empty tests/p76-spec-export-quality.spec.ts
**Owns:**
- `tests/p76-spec-export-quality.spec.ts` — replace empty file with real tests per ADR-101 (Spec Export Quality Standard)
  - Verify canonical export modal CTAs exist (regex on UI components)
  - Verify versioned AISP filename pattern (`aisp-{slug}-{date}.json` shape)
  - Verify static HTML5 export validity (load `staticHtmlExport.ts`; verify schema)
  - Verify ≥3-heading spec generators
- ≥10 cases / ≥4 describes
**Cap:** ≤200 LOC

#### A9 — Mobile viewport projects
**Owns:**
- `playwright.config.ts` — add 3 projects: `mobile-iphone-se` (375px), `mobile-iphone-12` (390px), `mobile-iphone-12-pro-max` (428px)
- Use Playwright's `devices` import or custom `viewport: { width: N, height: 800 }` configs
- DO NOT change the existing Desktop Chromium project (preserve baseline)
- Add a `mobile-only` project filter so existing specs skip mobile when they don't need it (use `testMatch` or `grep` patterns — opt-in)
- NEW spec `tests/p108-mobile-smoke.spec.ts` (≥5 cases) that exercises mobile viewports — at least one screenshot test of Welcome.tsx + Onboarding.tsx + a mode page at 375px (use page.goto + page.screenshot OR page.locator visibility checks)
**Cap:** config delta ≤30 LOC + new spec ≤120 LOC

#### A10 — Behavioral coverage for runtime helpers
**Owns:**
- `tests/p108-helpers-behavioral.spec.ts` (NEW; ≥12 cases / ≥4 describes)
  - `cleanTranscript` — import from `@/contexts/intelligence/stt/transcriptCleanup`; ≥4 cases (strips "uh"/"um"/"you know"/"like"; preserves quoted strings; idempotent on already-clean input; empty string returns empty)
  - `validateEventType` — import from `@/contexts/persistence/repositories/comprehensiveLogs`; ≥4 cases (valid 15 types pass; `patch_applied` aliases to `patch_validation`; unknown returns null; non-string input returns null)
  - `validateSectionType` — import from `@/lib/schemas/section`; ≥4 cases (valid 18 types pass; `article` aliases to `text`; `testimonial` aliases to `quotes`; unknown returns null)
  - Use Playwright `test()` shape with `import` of helpers (relative paths or `@/` alias depending on what works)
**Cap:** ≤200 LOC

### Wave 2 — Closer

#### A11 — ADR-136 + EOP + CLAUDE.md sync
**Owns:**
- `docs/adr/ADR-136-test-runtime-shift.md` (NEW; ≤120 LOC; Status: Accepted)
  - 3 decisions: (1) `tests/p76-spec-export-quality.spec.ts` filled with real ADR-101 enforcement tests; (2) mobile viewport projects added to playwright.config.ts (375/390/428); (3) behavioral coverage for `cleanTranscript` + `validateEventType` + `validateSectionType` (closes Track D D1+D3)
  - Cross-refs: ADR-101, ADR-127, ADR-126
- `plans/implementation/phase-108/seal/{02-post-review,session-log,retrospective}.md`
- `CLAUDE.md` sync (P108 entry + Phase Roadmap + ADR-136 + test count anchor)
- NO new test spec — closer is docs-only (Wave 1 agents own all the test work)

## Hard rules

1. NO new dependencies (Playwright already supports devices)
2. Both tsc strict configs clean after seal
3. Existing 120-test cumulative regression preserved (do NOT modify other spec files)
4. Mobile viewport projects MUST be opt-in (don't break existing Desktop-only specs)
5. EOP triplet at `plans/implementation/phase-108/seal/`
6. KISS — ADR ≤120 LOC

## Acceptance gates

- p76-spec-export-quality.spec.ts NOT empty; ≥10 cases GREEN
- playwright.config.ts has 4 projects (Desktop + 3 mobile); mobile project tests pass
- ≥12 helper-behavioral cases GREEN
- ADR-136 Accepted citing ADR-101 + ADR-127 + ADR-126
- Cumulative regression: 137 + ≥27 (P108 wave) ≥ 164 GREEN
- Both tsc strict configs clean
