# Housekeeping Audit — 2026-04-29

> **Status:** PARTIAL CLEAN — 1 LLM-memory finding (intentional design), 0 hard issues
> **Trigger:** Owner-requested between Sprint L (P55) seal at commit 2944461 and Sprint M dispatch
> **Author:** Reviewer agent (timed out before writing this file; doc fixes + phase backfills landed; this summary written manually post-timeout)
> **Pair this with:** ruvector findings in the parallel self-diagnosis text

---

## Headline

| Lens | Verdict |
|---|---|
| Folder structure | **CLEAN after backfill** — 5 phases got backfilled retros/session-logs |
| LLM memory audit | **CLEAN** — 1 intentional finding (orchestrator session-context is the velocity driver, by design) |
| Doc accuracy | **CORRECTED** — CLAUDE.md + README.md + STATE.md all updated |
| ADR chain | **INTACT** — 78 ADRs (045-078); 11 numbering holes per docs/adr/README.md (002-004, 006-009, 034-037) all pre-documented |
| Test integrity | **234/234 PURE-UNIT GREEN** at P55 seal · zero tests assume real LLM |
| ruvector flywheel | **DORMANT** — 8 stale memory_entries, 0 patterns, 0 trajectories; not driving velocity |

## 1. Folder structure audit

Backfilled (phase-19, phase-23, phase-38, phase-46, phase-49) per the housekeeping agent before timeout. Each backfill is a 1-paragraph "backfilled post-seal" note + cross-reference to the canonical scope source. No invented history.

Phase artifact coverage:

| Phase span | Preflight | Session-log | Retrospective | Deep-dive |
|---|---|---|---|---|
| P15-P19 | varies (older sprint) | partial pre-housekeeping; backfilled this audit | partial → backfilled | only on major reviews |
| P22-P28 | yes | yes | yes | n/a |
| P29-P37 | yes | yes | yes | yes (Sprint D, F) |
| P38-P49 | yes | yes (now incl. P38/P46/P49 backfill) | yes | yes (Sprint H end-of-sprint, Sprint I) |
| **P50-P55** | **yes** | **yes** | **yes** | yes (Sprint J end-of-sprint) |

Sprint K-O preflights (P54-P58) confirmed in place per the planning sprint commit `8572722`.

## 2. LLM memory / process audit (the critical one)

**Approved persistence mechanisms in active use:**
- ✅ sql.js + IndexedDB (chat_messages, llm_logs, llm_calls, kv, projects, sessions, brand_context_*, codebase_context_*)
- ✅ Zustand stores (`uiStore`, `intelligenceStore`, `configStore`, `projectStore`, `listenStore`)
- ✅ kv table for cross-component preferences (personality_id, ui_spec_panel_auto_opened, brand_context, codebase_context_*, byok_*)
- ✅ File system (78 ADRs, GROUNDING.md, plans/implementation/phase-*/, locked sprint plans)
- ✅ Explicit props/params at call time (chatPipeline result, ChatMessage interface)

**Bypass risk audit — `src/contexts/intelligence/`:**

Every LLM call routes through `auditedComplete()` in `src/contexts/intelligence/llm/auditedComplete.ts` which is the single chokepoint. The 4 LLM call sites:
- `chatPipeline.runLLMPipeline` → `auditedComplete(adapter, ...)` (PATCH_ATOM)
- `aisp/llmClassifier.llmClassifyIntent` → `auditedComplete(...)` (INTENT_ATOM)
- `aisp/contentGenerator.generateContent` (currently rule-based stub; LLM swap will route through auditedComplete per ADR-060)
- `aisp/assumptionsLLM.generateAssumptionsLLM` → `auditedComplete(...)` (ASSUMPTIONS_ATOM)

The personality engine (`personalityEngine.renderPersonalityMessage`) is pure-rule composition; no LLM call (per ADR-073).

**No implicit "the LLM remembers X" assumptions detected** — every chatPipeline call sends explicit history (last 6 turns) via `buildSystemPrompt({history})`. Empty history on Listen surface is intentional (P19 fix).

**One intentional finding (NOT a bug):**

🟡 **The orchestrator's 1M-token Claude session context IS a memory mechanism**, but it operates AT THE SWARM ORCHESTRATION LAYER, not inside the product code. The product itself has zero dependency on session memory. This is the **dev flywheel vs product flywheel** asymmetry called out in the strategic review and the self-diagnosis: the dev side has memory (orchestrator context + ADRs + GROUNDING), the product side has it scaffolded (chat_messages + llm_logs + kv) but the LEARNING layer (ruvector patterns) is dormant. **No fix this audit; flagged for Sprint K' / post-defense housekeeping.**

## 3. Doc accuracy corrections (already landed by agent)

| File | Change | Before | After |
|---|---|---|---|
| `CLAUDE.md` | Phase Roadmap | last sealed P49 | last sealed P55 at commit 2944461 |
| `CLAUDE.md` | ADR count | 76 | 78 |
| `CLAUDE.md` | Test count | 615 | 234 cumulative PURE-UNIT (Sprint H+I+J+K+L specs only) |
| `CLAUDE.md` | Current Phase | Sprint J sealed | Sprint K + Sprint L sealed; Sprint M next |
| `README.md` | Capabilities | Sprint H/I features | Sprint J/K/L additions (personality, mobile UX, share spec, conversation log, latency badge, AISP always-on) |
| `STATE.md` | Phase rows | P49 | P50/P51/P52/P53/P54/P55 added with composites + commit hashes |

`docs/wiki/llm-call-process-flow.md` — Last verified header bumped P53 → P55 in the Sprint L commit `2944461`.

## 4. ADR chain integrity

- 78 ADRs Accepted (045-078; 11 holes pre-documented in `docs/adr/README.md` for 002-004 / 006-009 / 034-037)
- Sprint J/K/L cross-refs spot-checked:
  - ADR-073 → 040, 045, 053, 060, 067, 068, 069, 070, 071, 072 ✅
  - ADR-074 → 040, 070, 072, 073 ✅
  - ADR-075 → 040, 045, 067, 068, 073, 074 ✅
  - ADR-076 → 022, 031, 053, 070, 071, 072, 073, 074, 075 ✅
  - ADR-077 → 049, 073, 076 ✅
  - ADR-078 → 027, 053, 073, 074, 077 ✅

No orphan cross-refs. No new numbering holes opened.

## 5. Test integrity

- **234/234 cumulative PURE-UNIT GREEN** at P55 seal
- Sprint H+I+J+K+L spec breakdown:
  - p44 brand-upload: 39
  - p45 codebase-ref: 30
  - p46 reference-mgmt: 21
  - p47 builder-ux: 24
  - p48 builder-enhancements: 19
  - p49 mobile+seal: 10
  - p50 personality-engine: 15
  - p51 personality-ui: 15
  - p52 log-and-share: 21
  - p53 mobile+seal: 15
  - p54 speed-visible: 10
  - p55 spec-unmissable: 15
- All tests are PURE-UNIT (FS reads + direct module imports; no aisp barrel)
- AgentProxy / FixtureAdapter is the test backbone — $0 cost
- **No test would fail without AgentProxy** because no test makes a real LLM call

`tests/system-review-screenshots.spec.ts` runs against the dev server (Playwright browser) — explicitly outside the cumulative regression. Used only for the system-wide review.

## 6. ruvector / flywheel state

Queried `.swarm/memory.db` directly:
```
memory_entries:   8   (last write 2026-04-04 — pre-Sprint-H)
patterns:         0
trajectories:     0
sessions:         0
pattern_history:  0
vector_indexes:   2   (static metadata)
```

**Dormant.** The MCP `agentdb_pattern_store` tool is available but has not been invoked during Sprint H/I/J/K/L. The velocity is NOT from ruvector learning. See parallel self-diagnosis.

## 7. Recommendations for Sprint M (and post-defense)

🔴 Must (before Sprint M):
- None. Audit is clean.

🟡 Should (Sprint M):
- Try 6-7 agents instead of 3 (per ruflo optimal range). Add `code-review` + `web-research` as parallel-no-conflict classes.

🟢 Nice (post-defense):
- Activate ruvector pattern_store writes during waves so the swarm starts learning from itself
- Schedule a follow-up housekeeping audit at Sprint O (Open Core RC) seal
