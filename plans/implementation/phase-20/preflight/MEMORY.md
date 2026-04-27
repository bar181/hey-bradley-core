# P20 Preflight — Cross-Session Memory Anchor

> **Purpose:** If a future session resumes P20 work in a fresh context, this file is the single read that hydrates the state.
> **Equivalent to:** `ruvector` keys `state/p19-seal`, `state/p20-preflight`, `pattern/brutal-review`, `pattern/path-resolution`.
> **Format:** dense; meant to be loaded into LLM context not skimmed by a human.

---

## STATE: P19 SEALED

```yaml
phase: 19
status: SEALED
seal_commit: 03e7aa7
fix_pass_2_commit: 772c154
doc_audit_commit: c73422b
composite: 88
personas: { grandma: 70, framer: 84, capstone: 88 }
playwright_targeted: 46/46
playwright_total: 63 across 29 spec files
build: { main_gzip: 599.85, total_gzip: ~700, budget: 800 }
real_llm_cost_to_date: $0
quality_trajectory: [74, 82, 86, 88, 89, 90, 88]
adrs_count: 38 files, highest 048
adr_numbering_holes: [002, 003, 004, 006, 007, 008, 009, 034, 035, 036, 037]
new_adrs_continue_at: 049+
```

## STATE: P20 PREFLIGHT

```yaml
phase: 20
status: PREFLIGHT
plan_doc: plans/implementation/mvp-plan/06-phase-20-mvp-close.md
preflight_doc: plans/implementation/phase-20/preflight/00-summary.md
revised_dod_count: 26 (original 14 + 12 carryforward absorbed)
estimated_effort: 5-7 days
real_llm_budget: $0 dev + $0.01 post-tag-smoke

four_known_blockers:
  - id: scope_lock
    severity: BLOCKER
    fix: 30-min decision call; 12 carryforward items dispositioned in 01-scope-lock.md §1
  - id: cost_cap_not_wired
    severity: BLOCKER (Day 1)
    fix: ADR-049 + CostPill.tsx + LLMSettings cap-edit + auditedComplete kv-read; 02-fix-decomposition.md §A
  - id: adr_047_slot_conflict
    severity: BLOCKER (10m doc fix)
    fix: P20 plan renames "ADR-047 cost-cap" → "ADR-049 cost-cap"; existing ADR-047-llm-logging-observability stays
  - id: security_md_missing
    severity: BLOCKER (Day 2)
    fix: Author SECURITY.md; 02-fix-decomposition.md §B; closes DoD item 8 + C06 + C07

p19_carryforward_disposition:
  pull_into_p20_dod: [C01_image_fixtures, C02_help_handler, C06_openrouter_hint, C15_import_lock, C16_llm_logs_fk, C20_abort_signal]
  pull_into_p20_polish: [C04_listentab_split, C11_mobile_carousel, C12_aisp_refresh, C14_sentinel_test, C17_zod_parser, C18_audit_lru]
  drop_to_post_mvp: [C03_multi_intent, C05_service_facade, C08_vitest_tdd, C09_raw_fetch, C10_welcome_split, C19_eslint_v9]
  already_done: [C13_clear_local_data]  # shipped P16; doc fix only
  promoted_to_p20_dod: [C07_security_md]  # already DoD item 8
```

## PATTERN: brutal-review-discipline

```yaml
pattern: parallel-brutal-review-then-fix-pass
context: pre-seal of any phase that adds a new user surface
trigger: phase composite drops vs prior phase OR persona target missed
procedure:
  1. dispatch 4 parallel reviewer agents (UX/Functionality/Security/Architecture) with explicit "optimism forbidden" prompt
  2. consolidate findings into chunked deep-dive (≤500 LOC per chunk)
  3. categorize: must-fix-now / pull-in-fix-pass / carryforward / drop
  4. dispatch single fix-pass agent with prioritized queue
  5. verify build + targeted Playwright + secrets-guard
  6. update master-checklist with closure ticks
  7. commit → seal → push → DoD agent
example:
  phase: 19
  pre_review_composite: 84 (internal)
  post_review_composite: 66 (4 reviewers consolidated)
  post_fix_pass_composite: 88
  net_delta: +4 vs internal seal; -2 vs P18b but recovered honestly
  total_effort: ~3.5 hours fix-pass + ~30 min review consolidation
```

## PATTERN: path-resolution-vs-hardcoded-index

```yaml
pattern: resolve-config-paths-by-type-not-index
context: any LLM fixture or canned-chat handler that emits JSON patches
trigger: multiple active configs (default-config + blog-standard) with different section orderings
problem: hardcoded `/sections/1/components/1` corrupts on configs where index 1 is a different section type
solution:
  - file: src/data/llm-fixtures/resolvePath.ts (P19 fix-pass-2 F1)
  - api: heroHeadingPath(config), blogArticlePath(config, field)
  - failure_mode: friendly empty-patch envelope when section/component absent
  - test_pattern: tests/p19-fix-hero-on-blog-standard.spec.ts (asserts hero updates AND blog unchanged)
caveat:
  - AgentProxyAdapter still uses migrations/001-example-prompts.sql with hardcoded paths
  - P20 carryforward C01 includes seed migration update to mirror FixtureAdapter
```

## PATTERN: error-kind-ui-mapping

```yaml
pattern: map-infra-error-kinds-to-conversational-copy
context: chat or listen surface that surfaces LLM-pipeline failures
problem: collapsing all failures into a single "try one of these" canned hint loses signal
solution:
  - file: src/lib/mapChatError.ts (P19 fix-pass-2 F2)
  - covers: cost_cap, timeout, precondition_failed, rate_limit
  - falls_through: validation_failed → canned hint (semantically: "I didn't catch that")
  - falls_through: unknown → canned hint (preserves graceful degradation)
companion: src/components/left-panel/ListenTab.tsx mapListenError (6 STT kinds)
test_pattern: tests/p19-fix-mapchaterror.spec.ts (one parametrized case per kind)
```

## PATTERN: chunked-deep-dive

```yaml
pattern: chunked-assessment-≤500-LOC
context: comprehensive review output that risks being a 2K-LOC unread wall-of-text
solution:
  - 00-summary.md: executive scorecard + must-fix queue + carryforward (~250 LOC)
  - 01-XX-findings.md per reviewer (~400 LOC each)
  - 05-fix-pass-plan.md: file-by-file action items (~350 LOC)
  - cross-link via "see 01-ux-findings.md §3" anchors
example: plans/implementation/phase-19/deep-dive/00-05-*.md (6 files, ~2,400 LOC total, none >500)
companion: this preflight uses the same pattern (00 + 01 + 02 + MEMORY.md)
```

## PATTERN: $0-dev-cost-with-real-llm-pipeline

```yaml
pattern: zero-real-llm-cost-during-development
context: building a real-LLM feature without burning dev budget
solution:
  - FixtureAdapter (regex-matched canned envelopes)
  - AgentProxyAdapter (DB-backed; reads from example_prompts corpus)
  - simulated-mode + mock-mode pills surface adapter identity in UI
  - VITE_LLM_LIVE_SMOKE=1 gates the rare real-API smoke test post-deploy
result: $0 across P15-P19 (5 phases of LLM-feature development)
risk_residual: real-API quirks (CORS, rate-limit shapes) not surfaced until Step 4 smoke
mitigation: schedule Step 4 ($0.01 budget) BEFORE final tag, not after
```

## INDEX: where to find things

```yaml
plans:
  state: plans/implementation/mvp-plan/STATE.md
  master_checklist: plans/implementation/mvp-plan/08-master-checklist.md
  p19_deep_dive: plans/implementation/phase-19/deep-dive/00-summary.md
  p19_session_log: plans/implementation/phase-19/session-log.md
  p20_plan: plans/implementation/mvp-plan/06-phase-20-mvp-close.md
  p20_preflight: plans/implementation/phase-20/preflight/00-summary.md (this folder)

source:
  fixtures: src/data/llm-fixtures/{step-1,step-2,resolvePath}.ts
  adapters: src/contexts/intelligence/llm/{claude,gemini,openrouter,fixture,agentProxy,simulated}Adapter.ts + adapterUtils.ts
  pipeline: src/contexts/intelligence/chatPipeline.ts + auditedComplete.ts
  validator: src/contexts/intelligence/llm/patchValidator.ts
  apply: src/store/configStore.ts (applyPatches selector)
  stt: src/contexts/intelligence/stt/{sttAdapter,webSpeechAdapter}.ts
  store: src/store/{intelligenceStore,listenStore,configStore,projectStore}.ts
  ui_chat: src/components/shell/ChatInput.tsx + mapChatError.ts
  ui_listen: src/components/left-panel/ListenTab.tsx
  persistence: src/contexts/persistence/{db,exportImport}.ts + migrations/*.sql + repositories/*.ts

tests:
  targeted_seal_gate: tests/p18*.spec.ts + tests/p18b*.spec.ts + tests/p19*.spec.ts
  fix_pass_2: tests/p19-fix-{hero-on-blog-standard,mapchaterror,css-injection}.spec.ts

adrs:
  index: docs/adr/README.md (post-doc-audit c73422b)
  highest_existing: ADR-048 (Web Speech)
  next: ADR-049 (cost-cap; P20 Day 1)

claudemd: CLAUDE.md (post-doc-audit c73422b — Phase Roadmap shows P15-P19 CLOSED, P20 NEXT)
```

## NEXT ACTION (if resuming)

1. **Read** `plans/implementation/phase-20/preflight/00-summary.md` (top to bottom)
2. **Then** `01-scope-lock.md` §4 approval checklist (user signs off)
3. **Then** kick off Day 1: `02-fix-decomposition.md` §A cost-cap wiring
4. **DoD agent** runs at end of Day 7 against revised 26-item checklist

---

**Last updated:** 2026-04-27 post-`c73422b`. Update on every P20 phase boundary.
