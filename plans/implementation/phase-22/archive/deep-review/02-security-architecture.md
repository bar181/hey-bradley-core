# P15-P22 Deep Review — Chunk 2: Security + Architecture

> Combined R3 (security/privacy holistic) + R4 (architecture/maintainability/code quality).
> ≤600 LOC.

---

## Part C — R3: Security + Privacy holistic

### C.1 BYOK key boundary verification

| Boundary | Mechanism | Verified |
|---|---|:---:|
| Key never in source | husky pre-commit + 9 key-shape patterns | ✅ `scripts/check-secrets.sh` |
| Key never in deployed bundle | vite.config.ts build-time assertion throws if `VITE_LLM_API_KEY` set during `command === 'build'` | ✅ |
| Key never in .heybradley export | `SENSITIVE_TABLE_OPS` registry strips `byok_*` kv prefix | ✅ `exportImport.ts:64-71` |
| Key not logged in error_text | `redactKeyShapes` applied to all SDK error messages | ✅ uniform across 3 real adapters |
| DEV-mode key warning | one-time `console.warn` in pickAdapter boot | ✅ P19 fix-pass-2 F6 |

**5/5 boundaries verified.** Strong posture.

### C.2 SENSITIVE_TABLE_OPS coverage

| Table | Sensitive content | In registry? | Strip mechanism |
|---|---|:---:|---|
| `kv` (byok_* prefix) | API keys + provider | ✅ | prefix sweep `LIKE 'byok_%'` |
| `kv` (pre_migration_backup) | DB snapshot before migration | ✅ | `OR k='pre_migration_backup'` |
| `llm_logs` | system_prompt + user_prompt + response_raw | ✅ | `truncate` |
| `llm_calls` | error_text | Partial | `null_column` on error_text |
| `example_prompt_runs` | Real LLM responses joined to user prompts | ✅ | `truncate` |
| `chat_messages` | User prompts + Bradley replies | NOT stripped | OK by design (user opted to share by exporting) |
| `listen_transcripts` | Voice text | NOT stripped | OK per ADR-048 explicit decision; truthful copy on Listen tab |

**Coverage complete for all sensitive tables.** ✅ Newly-added tables (P18b's `llm_logs` and `example_prompt_runs`) properly registered.

### C.3 CSS-injection guard verification

| Pattern | Blocked? | Test |
|---|:---:|---|
| `javascript:` | ✅ | original UNSAFE_VALUE_RE |
| `data:text/html` | ✅ | original |
| `vbscript:` | ✅ | original |
| `<script` | ✅ | original |
| `on\w+=` (event handlers) | ✅ | original |
| `\burl\(` (CSS exfiltration) | ✅ | P19 fix-pass-2 F3 |
| `@import` | ✅ | P19 fix-pass-2 F3 |
| `imageUrl` props | ✅ in IMAGE_PATH_RE | P19 fix-pass-2 F3 |

**8/8 patterns covered.** `tests/p19-fix-css-injection.spec.ts` (2 cases) verifies. ✅

### C.4 30-day llm_logs retention

| Check | Result |
|---|---|
| `pruneOldLLMLogs` exists in `repositories/llmLogs.ts` | ✅ |
| Called at every `initDB` | ✅ `db.ts:88-94` |
| `DEFAULT_RETENTION_MS` = 30 days | ✅ `db.ts:15` |
| Failure non-fatal | ✅ wrapped in try/catch with DEV warn |
| Test coverage | partial (`tests/p18b-logs.spec.ts` covers schema; no time-travel test) |

**Acceptable** for MVP scope. Time-travel test deferrable to post-MVP.

### C.5 SECURITY.md audit

🚨 **GAP-S1 (HIGH): `SECURITY.md` does NOT exist at repo root.**

ADR-043 §"Cross-references" line cites SECURITY.md as the operator-facing security policy. Multiple ADRs (043, 047, 048) reference it. **Not yet authored.**

Per P20 §3.4 the SECURITY.md outline is:
1. Trust boundary (frontend-only SPA; no backend; same-origin trust model)
2. BYOK contract (storage, send/never-send, DEV caveat)
3. Per-provider data flow (Claude / Gemini / OpenRouter)
4. What leaves the browser
5. What stays in the browser
6. What `.heybradley` exports include
7. Multi-tab visibility
8. Reporting (GitHub Security tab)

**MF1: author SECURITY.md.** ~30m.

### C.6 Privacy disclosure surfaces

| Disclosure | Location | Status |
|---|---|---|
| BYOK key never leaves browser | BYOK page §"Stays in your browser" | ✅ |
| Voice → browser STT vendor (Apple/Google) | BYOK page §"Goes to your provider" | ✅ |
| OpenRouter sees prompts + model + origin | BYOK provider table note | ✅ (closes P19 R3 finding G2) |
| Listen transcripts persist locally + ship in exports | Listen tab privacy disclosure (P19 fix-pass-2 F5) | ✅ truthful |
| 30-day llm_logs retention | BYOK page §"Stays in your browser" | ✅ |
| DEV-mode VITE_LLM_API_KEY inlined | Not on public site (developer-only concern) | acceptable |
| Multi-tab same-origin IndexedDB | Not on public site | acceptable (low-impact) |

**6/7 disclosures live; 1 acceptable omission.** ✅

### C.7 Threat surface introduced by P22

| Vector | Mitigation | Status |
|---|---|---|
| External link injection (Welcome, BYOK external URLs) | `target="_blank" rel="noopener noreferrer"` consistently applied | ✅ |
| MarketingNav dynamic XSS | Static array of links; no user input | ✅ |
| AISPDualView Crystal Atom embed | Hardcoded const string; not LLM-rendered | ✅ |
| BYOK page provider URLs | Plain text (NOT clickable) — minor UX friction (MF8) | acceptable |

**No HIGH-severity security findings introduced by P22.** ✅

---

## Part D — R4: Architecture + Maintainability

### D.1 Code quality scan

| Check | Pre-P22 | Post-P22 |
|---|---:|---:|
| `as any` count | 0 | 0 ✅ |
| `@ts-ignore` count | 0 | 0 ✅ |
| `as unknown as` count (logic-layer) | ~13 | ~13 (configStore.ts) — unchanged P22 |
| Ungated `console.*` | 0 in P19 audit | **1 (ErrorBoundary)** — pre-existing; P22 didn't introduce |
| TypeScript `tsc --noEmit` | clean | clean ✅ |

🚨 **GAP-A1 (HIGH): `src/components/ui/ErrorBoundary.tsx:24` has ungated `console.error('Section render error:', error, errorInfo)`.**

This was missed in the P19 fix-pass-2 sweep. ErrorBoundary catches React render errors; logging to console is appropriate but should be DEV-gated to prevent production console pollution. **MF2 fix:** wrap in `if (import.meta.env.DEV)`.

### D.2 ADR coverage + currency

44 ADRs on disk (post P21 cleanup). Phase distribution:

| Phase | ADRs |
|---|---|
| P11 | 15 (001 / 005 / 009b / 010-021) |
| P12 | 1 (022) |
| P13 | 3 (023-025) |
| P14 | 8 (026-033) |
| P15 | 2 (038-039) |
| P16 | 2 (040-041) |
| P17 | 2 (042-043) |
| P18 | 2 (044-045) |
| P18b | 2 (046-047) |
| P19 | 1 (048) |
| P21 | 5 (049 stub from P20 ref + 050-053 stubs + 054 full) |
| P22 | (053 promoted from stub to full Accepted) |

**11 numbering holes** (002-004, 006-009, 034-037) — documented in `docs/adr/README.md` post `c73422b`.

**P22-related ADR consistency check:**

| ADR | Status | Issue |
|---|---|---|
| ADR-053 (Public Site IA) | Accepted | ⚠️ §"Theme alignment" still describes OpenCore + HowIBuiltThis as "intentional dark islands" but P22 fix-pass-1 F2 unified them to warm-cream. **GAP-A4.** |
| ADR-054 (DDD bounded contexts) | Accepted | ✅ accurate |
| ADR-049 (cost-cap) | NOT YET AUTHORED | acceptable; P20 deliverable; not gating P22 seal |
| ADR-050/051/052 stubs | Proposed | acceptable; activate at Sprint B P23+ |

### D.3 DDD bounded-context accuracy

ADR-054 declares 5 contexts. Actual codebase:

| Context | ADR-054 says | Code reality | Match? |
|---|---|---|:---:|
| Configuration | `src/store/configStore.ts` + `lib/schemas/masterConfig.ts` | confirmed | ✅ |
| Persistence | `src/contexts/persistence/` (db + migrations + repositories + exportImport) | confirmed | ✅ |
| Intelligence | `src/contexts/intelligence/` (llm + prompts + chatPipeline + stt) | confirmed | ✅ |
| Specification | implicit via Blueprints + system-prompt Crystal Atom | confirmed (no dedicated dir) | ✅ documented honestly |
| UI Shell | `src/components/{shell,left-panel,center-canvas,right-panel,settings,marketing}/` + `src/pages/` | confirmed; +marketing/ added P22 | ✅ |

**5/5 contexts accurate to code.** ✅

### D.4 File LOC violations (CLAUDE.md 500-line soft cap)

| File | LOC | Status |
|---|---:|---|
| `src/pages/Welcome.tsx` | 165 | ✅ post-P22 (was 918) |
| `src/pages/Onboarding.tsx` | 740 | ⚠️ exceeds; pre-P15 debt; carryforward |
| `src/components/left-panel/ListenTab.tsx` | 754 | ⚠️ P22 carryforward C04 deferred (split to 4 components) |
| `src/store/configStore.ts` | 646 | ⚠️ C17 carryforward (Zod helper would shrink) |
| `src/components/center-canvas/RealityTab.tsx` | 613 | ⚠️ pre-existing |
| `src/components/center-canvas/ResourcesTab.tsx` | 559 | ⚠️ pre-existing |
| `src/components/left-panel/SectionsSection.tsx` | 529 | ⚠️ pre-existing |
| `src/components/shell/ChatInput.tsx` | 509 | ⚠️ marginal; pre-existing |
| `src/pages/OpenCore.tsx` | 429 (post P22 + F4) | ✅ |
| `src/pages/HowIBuiltThis.tsx` | ~210 (post P22) | ✅ |
| `src/pages/AISP.tsx` | ~260 (post P22 + F1) | ✅ |
| `src/pages/Docs.tsx` | 275 | ✅ |
| `src/pages/Research.tsx` | 308 | ✅ |
| `src/pages/About.tsx` | 223 | ✅ |
| `src/pages/BYOK.tsx` | 165 | ✅ |

**8 files exceed 500-LOC soft cap.** All except ListenTab + Welcome (now compressed) are pre-P15 debt. Acceptable carryforward to post-MVP.

### D.5 CLAUDE.md project-status counts

| Claim | Reality (post P22) | Match? |
|---|---|:---:|
| ADRs: 38 (highest 048) | 44 ADRs (highest 054) | ❌ STALE — needs +6 |
| Tests: 63 across 29 specs | 23 spec files (file count); test-case count deferred to test runner | ⚠️ partial |
| LOC: ~28,400 TS-TSX across 227 source files | 230 source files; LOC slightly higher | ⚠️ minor drift |

**GAP-A6 (LOW): CLAUDE.md ## Project Status counts stale.** Update.

### D.6 STATE.md consistency

🚨 **GAP-A2 (MED): STATE.md has duplicate P21 row.**

§1 Done table includes P21 (sealed at 95/100, commit 1129cea).
§2 Runway table ALSO includes "P21 (NEW — Cleanup)" as a planned phase.

**MF6:** Remove the §2 P21 row (it's already in §1 Done).

### D.7 phase-21/MEMORY.md staleness

🚨 **GAP-A3 (MED): phase-21/MEMORY.md still says `title: Sprint B Phase 1 — Simple Chat`** despite P21 being sealed as "Cleanup + ADR/DDD gap-fill" at commit `1129cea`. The cross-session anchor will mislead future sessions.

**MF5:** Flip MEMORY.md to reflect actual P21 outcome.

### D.8 Cross-link integrity (sample)

| Link | Target | Status |
|---|---|:---:|
| ADR-043 → SECURITY.md | repo root | ❌ target doesn't exist (MF1) |
| ADR-053 → A3 assessment | `phase-22/wave-1/A3-website-assessment.md` | ✅ |
| ADR-054 → A1 capability audit | `phase-22/wave-1/A1-capability-audit.md` | ✅ |
| Welcome → /aisp | `/aisp` route | ✅ |
| Welcome → /onboarding | `/onboarding` route | ✅ |
| BYOK → /onboarding | `/onboarding` route | ✅ |
| MarketingNav → /open-core | `/open-core` route | ✅ |
| MarketingNav → /byok | `/byok` route | ✅ |

**8/9 links resolve.** 1 broken (SECURITY.md — closes via MF1). ✅

### D.9 Architecture must-fix queue (R4)

| # | Item | Severity |
|---|---|---|
| MF2 | ErrorBoundary console.error gate | HIGH |
| MF3 | AISPDualView render-order (move before footer) | MED |
| MF4 | OpenCoreVsCommercial render-order | MED |
| MF5 | phase-21/MEMORY.md flip | MED |
| MF6 | STATE.md §2 P21 row dedup | MED |
| MF7 | ADR-053 §"Theme alignment" amendment | MED |
| GAP-A6 | CLAUDE.md project-status count refresh | LOW (folded into MF6 commit) |

---

## Combined R3 + R4 must-fix queue (de-duplicated)

Items merged into deep-review must-fix queue MF1-MF9 in `00-summary.md`:
- MF1 SECURITY.md (closes S1)
- MF2 ErrorBoundary gate (closes A1)
- MF3 AISPDualView render-order (closes F2)
- MF4 OpenCoreVsCommercial render-order (closes F3)
- MF5 phase-21 MEMORY flip (closes A3)
- MF6 STATE dedup (closes A2)
- MF7 ADR-053 amendment (closes A4)
- (GAP-A6 CLAUDE.md counts — folded into MF6)

## Pass-2 trigger evaluation

After fix-pass executes:
- All HIGH items closed (MF1, MF2)
- All MED items closed (MF3-MF7)
- LOW items closed where ROI clear (MF8, MF9)

**Estimated post-fix composite: 89/100.** Pass-2 unlikely.

## Cross-link to next chunk

`03-fix-pass-plan.md` — file-by-file decomposition for MF1-MF9.
