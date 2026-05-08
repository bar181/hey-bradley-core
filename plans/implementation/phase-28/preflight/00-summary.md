# Phase 28 — Preflight 00 Summary

> **Phase title:** Sprint C Phase 3 — 2-step Template Selection + Carryforward Cleanup
> **Status:** PREFLIGHT (activates post-P27 seal)
> **Successor of:** P27 (Sprint C P2 — LLM-native AISP) sealed at composite **90/100** — plateau broken
> **Successor:** P29 (Sprint D opener — Templates + Content)

## North Star

> **Sprint C closes by completing the AISP loop: first AISP-driven LLM call picks the best-fit template/theme; second AISP-driven LLM call modifies content with full chat context. AND the carryforward debt (C04/C15/C16/C17) is closed before Sprint D opens.**

## Scope IN

### Sprint C P3 deliverables
- **Stage 1 LLM call**: AISP-scoped template selection — given user input + classified intent, picks best-fit template from registry by AISP-driven scoring
- **Stage 2 LLM call**: content modification with full chat history context (not just user input)
- Cost-cap aware (each stage check; both stages skip if over cap)
- ADR-057 (2-step AISP Pipeline)
- +5 unit tests (mocked LLM)

### Carryforward cleanup (per P27 R4 brutal-review penalty — must-fix before Sprint D)
- **C04** ListenTab.tsx 4-component split (785 → <500 LOC each)
- **C17** `parseMasterConfig` Zod helper (replaces 21 `as unknown as` casts in configStore.ts)
- **C15** Lock import path against malicious example_prompts seeds
- **C16** Migration 003 FK on llm_logs.session_id (or document deferral with rationale)

### Effort estimate

- Sprint C P3 (2-step pipeline): ~1h
- C04 ListenTab split: ~1h (~250 LOC × 4 components)
- C17 Zod helper: ~30m (parseMasterConfig + replace casts)
- C15 import lock: ~15m
- C16 FK migration OR deferral: ~15m
- ADR-057 + tests + retro + seal: ~30m
- **Total: ~3.5h** (vs 4-6 days × 4 phases = ~16-24× velocity)

## Scope OUT

- Sprint D (Templates + Content) — opens at P29
- Multi-intent in same chat (Sprint D)
- Vercel deploy (owner-triggered)
- C11 mobile carousel + C12 AISP Blueprint sub-tab refresh (P22 carries; cosmetic; defer to OSS RC polish)

## Files (planned)

| File | Type | Purpose |
|---|---|---|
| `src/contexts/intelligence/aisp/twoStepPipeline.ts` | NEW | Stage 1 (template select) + Stage 2 (content modify) |
| `src/contexts/intelligence/chatPipeline.ts` | EDIT | call 2-step pipeline when both stages will fit cost-cap |
| `src/components/left-panel/ListenTab.tsx` | SPLIT | break into Tab + Surface + History + Controls (~200 LOC each) |
| `src/lib/schemas/masterConfigParser.ts` | NEW | `parseMasterConfig(json)` Zod helper |
| `src/store/configStore.ts` | EDIT | use `parseMasterConfig` instead of casts (~21 sites) |
| `src/contexts/persistence/exportImport.ts` | EDIT | sanitize import to prevent example_prompts seed override |
| `src/contexts/persistence/migrations/003-fk-llm-logs.sql` | NEW (OR docs/adr/ADR-016 amendment if deferred) |
| `docs/adr/ADR-057-two-step-aisp-pipeline.md` | NEW | full Accepted |
| `tests/p28-two-step-pipeline.spec.ts` | NEW | 5+ pure-unit cases |

## DoD

- [ ] 2-step pipeline (template select + content modify) wired between AISP-LLM and template router
- [ ] ListenTab split into 4 files, each <500 LOC; existing `data-testid` selectors preserved; P19+P22 ListenTab tests still green
- [ ] `parseMasterConfig` Zod helper used in configStore (≥18 of 21 cast sites converted)
- [ ] Import path lock prevents example_prompts seed override
- [ ] Migration 003 FK shipped OR documented deferral (amendment to ADR-016 / ADR-053)
- [ ] +5 pure-unit Playwright cases
- [ ] ADR-057 full Accepted
- [ ] Build + tsc green; full regression green
- [ ] Retro + STATE + Sprint D P29 preflight scaffold

## Composite target

- Grandma 76+ (held; UX surface mostly unchanged)
- Framer 88+ (held / +1 if cleanup audit feels obvious)
- Capstone 96+ (held / +1 if 2-step pipeline visible in panel)
- **Target: 90+ (Sprint D greenlight gate)**

## Cross-references

- ADR-053 (AISP Intent Classifier — rules; P26)
- ADR-056 (LLM-Native AISP Understanding; P27)
- ADR-055 (AISP Conversion + Verification; P27)
- P27 retrospective: `phase-27/retrospective.md` §"What to reframe"

---

**Phase 28 closes Sprint C AND clears the must-fix carryforward queue. Sprint D opens clean at P29.**
