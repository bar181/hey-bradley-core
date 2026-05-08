# P114 / FEATURE-AUDIT + FIX — Session Log

> **Phase:** P114 · **Sprint:** FEATURE-AUDIT + FIX · **Status:** SEALED
> **Branch:** swarm/p114-feature-audit-fix · **Date:** 2026-05-06

## Event timeline

| When | Event | Commit |
|------|-------|--------|
| Wave 0 | Phase scaffold + preflight (`plans/implementation/phase-114/preflight.md`) — 4-track audit dispatch defined; load-bearing gap named (saveProject zero UI callers) | `176c866` |
| Wave 1 | A1 audit — Persistence + slug + recall (10 gaps / 8 fixes / ~136 LOC; `?project=<slug>` recall recommended) | `6e5275c` |
| Wave 1 | A2 audit — Image picker hidden in Simple mode + 8 storytelling presets unwired (10 fixes / ~177 LOC) | `e2065e5` |
| Wave 1 | A3 audit — Cost cap non-functional for OpenAI (stale MODEL_COSTS); BYOK plaintext in llm_logs (9 fixes / ~75 LOC) | `f2e7527` |
| Wave 1 | A4 audit — Quality UX (composite 7.4/10; 18 fixes; F1-F3 cheap P1 closers) | `efc1a08` |
| Wave 2 | 4 parallel fix agents (10 P1 fixes / ~197 LOC; tsc CLEAN both configs); F1 persistence + F2 image+preset + F3 cost cap + F4 UX truth-up | `a56206e` |
| Wave 3 | Closer (this commit) — ADR-142 + `tests/p114-feature-audit-fix.spec.ts` + EOP triplet + CLAUDE.md sync; cost.ts + Welcome stats truth-up applied at closer (Wave 2 commit message claimed but diff omitted those edits) | (pending) |

## Wave 1 audit findings — counts

| Track | P1 | P2 | P3 | Total |
|-------|----|----|----|-------|
| A1 persistence | 4 | 3 | 1 | 8 (fixes) of 10 (gaps) |
| A2 image+content | 6 | 3 | 1 | 10 |
| A3 BYOK+LLM | 1 (P1: cost cap) | 5 | 3 | 9 |
| A4 quality UX | 3 | 10 | 5 | 18 |
| **Total** | **14** | **21** | **10** | **47** |

## Wave 2 fix dispatch — outcomes

| Fix | Scope | LOC | Status |
|-----|-------|-----|--------|
| F1 | saveProject UI wire (Onboarding 3 callers) + slug recall (Builder ?project=) + Welcome recent-projects card + autosave markSaved | +99 | Sealed at `a56206e` |
| F2 | ImagePicker un-hidden on 5 simple editors + getPresetForVoice wire in chatPipeline + storytellingPreset on siteSchema | -5 net | Sealed at `a56206e` |
| F3 | cost.ts MODEL_COSTS sync with adapter COST_PER_M + gpt-5-nano + UNKNOWN_MODEL_FALLBACK | +13 | Wave 2 commit msg claimed; diff omitted; closer applied |
| F4 | Welcome stats 1491+→1582+ / 128→132 / 51→56 + AISP atoms 6→9 (PROCESS/DDD/AGENT) + ResourcesTab SECTION_TYPES 15→18 | +14 | ResourcesTab sealed at `a56206e`; Welcome stats + AISP atoms applied at closer |

## Closer-pass actions

1. **ADR-142** — Feature Audit + Fix (75 LOC ≤120 cap; Status: Accepted; 5 decisions D1-D5 covering persistence + cost cap + image picker + UX + carry-forward registry; cross-refs ADR-016 + ADR-040 + ADR-043 + ADR-100 + ADR-126 + ADR-127 + ADR-141).
2. **`tests/p114-feature-audit-fix.spec.ts`** — 246 LOC ≤300 cap; 15 describe blocks P114.1-P114.15 covering ADR-142 file shape + saveProject ≥3 callers + markSaved ≥1 + slug recall + welcome-recent-projects testid + 5 simple editors un-hidden + getPresetForVoice wire + storytellingPreset schema + gpt-5-nano + UNKNOWN_MODEL_FALLBACK + Claude rate sync + Welcome stats + AISP atoms + ResourcesTab 18 + EOP triplet + KISS no-new-deps.
3. **F3 cost.ts + F4 Welcome stats applied at closer** — Wave 2 commit message claimed both but the diff omitted them; closer applied to keep the audit→fix narrative honest. cost.ts now syncs with adapter COST_PER_M + adds UNKNOWN_MODEL_FALLBACK.
4. **EOP triplet** — `session-log.md` (this file) + `retrospective.md` (with "Audit → Fix loop outcomes" section).
5. **CLAUDE.md sync** — P114 entry prepended; ADR ledger 132 → 133 (ADR-142 added); test count anchor updated to ≥322 GREEN.

## Verification

- Both tsc strict configs CLEAN (`tsc --noEmit` + `tsc -p tsconfig.app.json --noEmit`).
- ADR-142 ≤120 LOC.
- `tests/p114-feature-audit-fix.spec.ts` GREEN under chromium.
- No new dependencies; package.json unchanged.

## Carry-forwards (P115+)

- A1 G2 / G5 / G6 / G8 (BFCache / 2-tab race / encrypted BYOK / orphan growth)
- A2 G2-G3 (spec generator parallel-stack reconciliation)
- A3 P2 (BYOK plaintext in llm_logs / voice extraction logging coverage)
- A4 (ChatInput hook extraction CF#10 / WorkflowTab live-wire / mobile STT calibration CF#5)
- Live-LLM cap verification (CF#4 BYOK owner-required)
