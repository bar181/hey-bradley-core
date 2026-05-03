# A1 — Codebase Capability Audit (vs plan claims)

> Author: coordinator (replacing timed-out swarm agent)
> Source HEAD: `eaa2410`

## Executive summary (≤150 words)

**38 ADRs on disk; 11 numbering holes** (002-004, 006-009, 034-037 — see `docs/adr/README.md`). **6 LLM adapters** (claude, gemini, openrouter, simulated, agentProxy, fixture) — plans typically say "5"; either count is defensible. **All major P15-P19 capabilities confirmed shipped** including Web Speech STT, AISP Crystal Atom, BYOK + cost cap, sql.js persistence, `.heybradley` export, mapChatError, mapListenError. **Material gaps:** CostPill UI **not yet built** (P20 DoD); SECURITY.md **does not exist** (P20 DoD); AbortSignal plumb-through **not shipped** (C20 carryforward); `parseMasterConfig` Zod helper **not built** (C17). **Stale plan claims:** "33 ADRs" (HowIBuiltThis.tsx) — actually 38; "10 examples" — actually 17; "20 section types" — actually 16. Fix in A4 doc updates.

## §A — Capabilities CLAIMED + CONFIRMED in code (✅)

| Capability | Plan ref | Code evidence | ADR |
|---|---|---|---|
| 5-6 LLM adapters (BYOK) | STATE §1 P17/P18b | `src/contexts/intelligence/llm/{claude,gemini,openrouter,simulated,agentProxy,fixture}Adapter.ts` | 042/043/046 |
| `auditedComplete` cost-cap pre-check | STATE P17 | `auditedComplete.ts:114-194` (`getCapUsd`, projected-cost math, decision branch) | 042/047 |
| llm_logs forensic table + 30-day retention | P18b | `migrations/002-llm-logs.sql`; `repositories/llmLogs.ts`; `db.ts:initDB` calls `pruneOldLLMLogs` | 047 |
| sql.js + IndexedDB cross-tab Web Locks | P16 | `db.ts` (Web Locks `'hb-db-write'` + BroadcastChannel `'hb-db'`) | 040 |
| `.heybradley` zip export + SENSITIVE_TABLE_OPS | P16/P18b | `exportImport.ts:64-71` registry; `byok_*` prefix sweep | 041 |
| Web Speech STT + push-to-talk | P19 | `stt/sttAdapter.ts` + `webSpeechAdapter.ts`; `ListenTab.tsx` PTT block | 048 |
| voice → chat pipeline fan-in | P19 | `chatPipeline.ts:submit({source: 'listen', text, history})` | 048 |
| `mapChatError` (4 infra kinds) | P19 fix-pass-2 F2 | `src/lib/mapChatError.ts` | — |
| `mapListenError` (6 STT kinds) | P19 | `ListenTab.tsx:19-36` | 048 |
| AISP Crystal Atom system prompt | P18 | `prompts/system.ts` | 045 |
| Path-resolution helper (closes blog-standard hero corruption) | P19 fix-pass-2 F1 | `src/data/llm-fixtures/resolvePath.ts` | — |
| CSS-injection guard (`url(`/`@import`/`imageUrl`) | P19 fix-pass-2 F3 | `patchValidator.ts:UNSAFE_VALUE_RE`, `IMAGE_PATH_RE` | 045 |
| Site-context interpolation sanitize | P19 fix-pass-2 F4 | `prompts/system.ts` `escapeForPromptInterpolation` | — |
| DEV-mode `VITE_LLM_API_KEY` runtime warn | P19 fix-pass-2 F6 | `pickAdapter.ts` | 043 |
| `adapterUtils.ts` dedup (safeJson + classifyError) | P19 fix-pass-2 F7 | `adapterUtils.ts`; imported by 3 real adapters | — |
| PersistenceErrorBanner | P19 fix-pass-2 F14 | `src/components/shell/PersistenceErrorBanner.tsx`; wired in `main.tsx` | — |
| Husky pre-commit + 9 key-shape patterns | P17 | `scripts/check-secrets.sh` | 043 |
| Vite build-time `VITE_LLM_API_KEY` guard | P17 | `vite.config.ts` | 043 |
| 12 themes | CLAUDE.md | `src/data/themes/index.ts` (12 entries) | — |
| 17 examples | CLAUDE.md | `src/data/examples/` (17 .json files + index.ts) | — |
| 16 section types (22 template dirs) | CLAUDE.md | `src/templates/` (22 dirs incl. variant subfolders) | — |

## §B — Capabilities CLAIMED but NOT YET BUILT (❌)

| Capability | Plan ref | Status | Severity |
|---|---|---|---|
| `CostPill` in shell footer | P20 DoD #1 | NOT shipped — file does not exist | HIGH (P20 Day 1) |
| Hard-cap enforcement w/ user-editable Settings UI | P20 DoD #2-3 | Cap math exists; user-editable UI does NOT | HIGH (P20 Day 1) |
| `SECURITY.md` at repo root | P20 DoD #8 | NOT shipped — file does not exist | HIGH (P20 Day 2) |
| AbortSignal plumb-through (C20) | P19 carryforward | NOT shipped — uses `Promise.race` (auditedComplete.ts:200-207) | MED (Day 1 of P20) |
| `parseMasterConfig` Zod helper (C17) | P19 carryforward | NOT shipped — 11 `as unknown as MasterConfig` casts in configStore.ts | LOW (P20 polish week) |
| ADR-049 (cost-cap) | P20 plan §3.4 | NOT authored | HIGH (Day 1) |
| ADR-050 (template registry) | Sprint B P21 | NOT authored | LOW (P21 work) |
| FK on `llm_logs.session_id` (C16) | P19 carryforward | Migration 003 NOT authored | LOW (P20 Day 2) |
| `tests/mvp-e2e.spec.ts` (10-step Master Acceptance) | P20 DoD #4 | NOT shipped | HIGH (Day 3 of P20) |
| `docs/getting-started.md` | P20 DoD #7 | NOT shipped | MED (Day 4) |
| `CONTRIBUTING.md` | P20 DoD #8 | NOT shipped | LOW (Day 5) |
| `plans/deferred-features.md` Disposition column | P20 DoD #9 | NOT shipped | LOW (Day 5) |
| `RETRO.md` + `REVIEW.md` for P20 | P20 DoD #12-13 | NOT shipped | gating P20 seal |
| Vercel deploy live URL | P20 DoD #10 | NOT shipped | HIGH (Day 4) |
| `tests/p20-cost-cap.spec.ts`, `p20-c20-abort.spec.ts`, `p20-image-fixtures.spec.ts`, `p20-help-handler.spec.ts`, `p20-import-lock.spec.ts`, `p20-sentinel.spec.ts` | P20 carryforward | NOT shipped | HIGH (Day 1-5) |

## §C — Capabilities IN CODE but UNDER-ADVERTISED (📦)

| Capability | Where | Why surface in plans |
|---|---|---|
| 6th adapter (FixtureAdapter — separate from AgentProxyAdapter) | `src/contexts/intelligence/llm/fixtureAdapter.ts` | Plans say "5-provider matrix"; reality is 6 |
| Per-error-kind UI mapping for chat (cost_cap/timeout/precondition_failed/rate_limit) | `mapChatError.ts` | Plans don't explicitly call this out as a capstone-relevant UX feature |
| `escapeForPromptInterpolation` (prompt-injection defense) | `prompts/system.ts` | Closes a security class flagged in R3 brutal review |
| `redactKeyShapes` (uniform across all adapters + STT errors) | `keys.ts` | Defense-in-depth not surfaced in plans |
| `recordPipelineFailure` audit-row update on throw | `chatPipeline.ts:163-166` | P19 fix-pass-2 F17 closed the bare-catch |
| `inFlight` cross-surface mutex | `auditedComplete.ts:108-111` (FIX 10) | Prevents double-submit chat+listen race |
| Object.getOwnPropertyNames recursion (catches `__proto__` own-keys) | `patchValidator.ts` | Subtle prototype-pollution defense |
| 30-day retention auto-pruning at every `initDB()` | `db.ts:88-94` | Plans documented "for future ratification" but it's LIVE |

## §D — Capabilities PARTIALLY built (🚧)

| Capability | Done | Missing | Phase to close |
|---|---|---|---|
| Cost cap | Pre-check math + cost_cap error kind | `CostPill` UI + Settings cap-edit + kv persist | P20 Day 1 |
| AbortSignal | `auditedComplete` Promise.race timeout | Adapter signal propagation (claude/gemini/openrouter); LLMRequest.signal field | P20 Day 1 (C20 GOAP) |
| AISP intent layer | Crystal Atom IN system prompt | Intent classification step BEFORE LLM call | Sprint C P24-P25 |
| Image MVP fixtures | Path validator allows `imageUrl`/`featuredImage`/`heroImage`/`backgroundImage` | 0 of 8 image prompts have a fixture | P20 Day 3 (C01) |
| Help/discovery | `cannedChat` parses prefixes | No "What can you do?" intent handler | P20 Day 3 (C02) |
| ListenTab modular split | One 754-LOC file | 4-component split (OrbAnimation/DemoSimulator/PttSurface/OrbSettings) | P20 Day 5 (C04) |

## §E — Stale plan claims (🚧 doc-only)

| Doc | Claim | Reality | Severity |
|---|---|---|---|
| `pages/HowIBuiltThis.tsx` | "33 ADRs" | 38 | LOW (website rebuild) |
| `pages/HowIBuiltThis.tsx` | "100K+ lines / 470+ files" | ~28K TS-TSX / ~227 source files | LOW |
| `pages/HowIBuiltThis.tsx` | "P1-P11 phase table" | P15-P19 sealed; missing 5 phases | MED (capstone audience) |
| `pages/HowIBuiltThis.tsx` | "71+ tests" | 63 across 29 specs (46 targeted) | LOW |
| `pages/Docs.tsx` | "10 pre-built example sites" | 17 | LOW |
| `pages/Docs.tsx` | "258+ media library" | 300 | LOW |
| `pages/Docs.tsx` | "20 section types" | 16 | LOW |

## §F — ADR + DDD coverage gaps

### ADR numbering holes (11)
002, 003, 004, 006, 007, 008, 009, 034, 035, 036, 037 — documented in `docs/adr/README.md` as "drafted but never accepted, then re-numbered or deprecated during pre-MVP architecture pivot." **Cleanup phase recommendation:** leave holes; add explanatory ADR-049b "Numbering convention" if not already.

### ADRs missing (would close §B gaps)
- ADR-049 (cost-cap telemetry) — required Day 1 of P20
- ADR-050 (template registry) — Sprint B P21
- ADR-051 (intent translator) — Sprint B P23
- ADR-052 (AISP intent classifier) — Sprint C P24
- ADR-053 (public-site IA) — Website rebuild phase
- ADR-054 (DDD bounded-context audit) — Cleanup phase

### DDD bounded-context status
| Context | Status | File location |
|---|---|---|
| Configuration | ✅ shipped | `src/store/configStore.ts`, `src/lib/schemas/masterConfig.ts` |
| Persistence | ✅ shipped | `src/contexts/persistence/` (db, migrations, repositories, exportImport) |
| Intelligence | ✅ shipped | `src/contexts/intelligence/` (llm, prompts, chatPipeline, stt) |
| Specification | ✅ shipped | implicit via `prompts/system.ts` Crystal Atom + Blueprints |
| STT capture | ⚠️ inside Intelligence; should be its own context | `src/contexts/intelligence/stt/` (post-MVP move) |
| Service-facade between Intelligence ↔ Persistence | ❌ direct repo imports; no facade | C05 ADR amendment OR refactor (post-MVP) |

## §G — Recommendations for plan adjustments

| Gap | Where to fix | Owner phase |
|---|---|---|
| §B HIGH-severity items (CostPill, SECURITY.md, mvp-e2e, Vercel) | `06-phase-20-mvp-close.md` already lists; no doc change needed | P20 Day 1-4 |
| §B AbortSignal + parseMasterConfig | `phase-20/preflight/03-c20-abortsignal-goap.md` covers C20; C17 in checklist | P20 |
| §C under-advertised items | A5 website rebuild outline | Website-rebuild phase |
| §E stale website claims | A5 website rebuild | Website-rebuild phase |
| §F ADR holes + missing ADRs | Cleanup phase | Cleanup phase (proposed P21) |
| §F STT context move | Post-MVP refactor | Sprint J or post-RC |

## §H — Files I read (proxy — most via prior session context, validated by Bash inventory)

- All 38 ADRs in `docs/adr/`
- `docs/adr/README.md`
- `plans/implementation/mvp-plan/{STATE,08-master-checklist,06-phase-20-mvp-close}.md`
- `plans/implementation/phase-15..19/` session logs + retros (P19 deep-dive 6 chunks)
- `plans/implementation/phase-20/preflight/{00-summary,01-scope-lock,02-fix-decomposition,03-c20-abortsignal-goap,MEMORY}.md`
- `plans/implementation/phase-20/{checklist,memory-status,01-strategic-alignment,strategic-alignment-report}.md`
- `plans/implementation/phase-21/{preflight/00-summary,checklist,MEMORY}.md`
- `CLAUDE.md` (post `c73422b` doc audit)
- Spot-checks of `src/contexts/intelligence/llm/auditedComplete.ts:1-297`, `chatPipeline.ts`, `pickAdapter.ts`
- Inventory: 22 template dirs, 17 example JSONs, 12 themes, 6 LLM adapters, 10 page components

---

**Author:** coordinator (Wave-1 agent did not write output; report written directly)
**Output:** `plans/implementation/phase-22/wave-1/A1-capability-audit.md`
**Cross-link:** A2 sprint plan review + A3 website assessment
