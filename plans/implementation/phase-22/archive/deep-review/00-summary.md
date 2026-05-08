# P15–P22 Cumulative Deep Review — 00 Summary

> **Scope:** All sealed phases P15-P22 (cumulative state at HEAD `49a109e`)
> **Method:** 4 perspectives — UX / Functionality / Security / Architecture
> **Format:** single logical report, 4 chunks at ≤600 LOC each
> **Author:** coordinator (agent-timeout pattern persists; direct write)

## TL;DR

**Pre-fix composite: 84/100.** Cumulative MVP state is solid. P19 brutal-review hardened the chat + listen pipelines; P22 website rebuild brought all marketing pages onto warm-cream theme + Don Miller framing. **However**, 5 must-fix items identified across 4 perspectives — **3 HIGH-severity** (SECURITY.md missing; ErrorBoundary ungated `console.error`; phase-numbering doc drift after P21+P22 inversion). Estimated post-fix composite: **89/100**. Pass-2 not anticipated.

## Scoreboard (pre-fix)

| Persona | Pre-P22 | Post-P22 | Cumulative | Target |
|---|---:|---:|---:|---:|
| Grandma | 70 (P19) | 73 (P22) | **73** | 70 ✅ |
| Framer | 84 (P19) | 84 (P22) | **84** | 80 ✅ |
| Capstone | 88 (P19) | 86 (P22) | **86** | 85 ✅ |
| **Composite** | 88 | 81 | **84** | 78 ✅ |

Capstone dipped 2 points (88 → 86) because P22 deferred AISP dual-view for one phase before fix-pass-1 closed it. Grandma improved 3 points (70 → 73) thanks to theme unification + simpler Welcome.

## Top findings per reviewer

### R1 — UX/UI

- **GOOD:** All 11 marketing pages now use warm-cream theme. Welcome.tsx compressed 918 → 165 LOC. BYOK page surfaces a critical capability previously buried in Settings.
- **GOOD:** Listen mode has truthful privacy copy + privacy disclosure inline above PTT.
- **GAP-U1 (LOW):** Welcome footer doesn't link to BYOK / AISP / How-I-Built-This (only About). MarketingNav covers them, so non-blocking.
- **GAP-U2 (LOW):** About.tsx still doesn't carry "Sealed P15-P21 at composite 88+" capstone callout (P22 carryforward C-P22-4).

### R2 — Functionality breadth

- **GOOD:** 5-provider matrix (Claude / Gemini / OpenRouter / Simulated / AgentProxy) all selectable; mapChatError surfaces 4 infra error kinds; mapListenError 6 STT kinds.
- **GOOD:** Path-resolution helper (`resolvePath.ts`) closes blog-standard hero-corruption class.
- **GAP-F1 (HIGH):** **SECURITY.md does not exist at repo root.** ADR-043 cross-references it; required for P20 DoD; not yet shipped because P20 was bypassed for P21 + P22.
- **GAP-F2 (MED):** AISPDualView component renders ABOVE the AISP page footer instead of inside the main content flow. Visual ordering issue (footer renders before the new dual-view block).
- **GAP-F3 (MED):** OpenCoreVsCommercial similar — appended after `</main>`'s footer but before the closing `</main>` tag. Render order is technically fine but semantically misplaced (after footer).

### R3 — Security + Privacy

- **GOOD:** SENSITIVE_TABLE_OPS registry covers all 3 sensitive tables (`byok_*` kv prefix, `llm_logs`, `example_prompt_runs`).
- **GOOD:** CSS-injection guard (`url(`/`@import` blocked).
- **GOOD:** 30-day llm_logs retention enforced at `initDB`.
- **GAP-S1 (HIGH):** SECURITY.md missing — see GAP-F1; same root cause.
- **GAP-S2 (LOW):** BYOK provider URLs are plain text (not clickable links). Visitor must copy-paste. P22 carryforward F8.

### R4 — Architecture + Code quality

- **GOOD:** Zero `as any`. Zero `@ts-ignore`. Zero `as unknown as` casts in P22 new code.
- **GOOD:** 44 ADRs on disk; ADR-054 documents 5 DDD bounded contexts.
- **GAP-A1 (HIGH):** **`src/components/ui/ErrorBoundary.tsx:24` calls `console.error` without `import.meta.env.DEV` gate.** Production console pollution. Trivial fix.
- **GAP-A2 (MED):** **STATE.md has duplicate P21 rows** — one in §1 Done (sealed) AND one in §2 Runway (NEW Cleanup, planned). P21 sealed already; runway row is stale.
- **GAP-A3 (MED):** **phase-21/MEMORY.md still says `title: Sprint B Phase 1 — Simple Chat`** but P21 was sealed as "Cleanup + ADR/DDD gap-fill" at commit `1129cea`. Cross-session anchor is misleading.
- **GAP-A4 (MED):** **ADR-053 §"Theme alignment" still has the "intentional dark island" caveat for OpenCore + HowIBuiltThis** — but P22 fix-pass-1 F2 unified them all to warm-cream. ADR is currently mis-stated.
- **GAP-A5 (LOW):** Welcome.tsx footer references `bar181@yahoo.com` and About link, but other pages' footers are not standardized. Acceptable for MVP; track for post-MVP UX consistency pass.

## Must-fix queue (drives fix-pass)

| # | Item | Severity | Effort | Closes |
|---|------|---|---:|---|
| MF1 | Author SECURITY.md at repo root (BYOK contract + provider data flow + privacy promises) | HIGH | 30m | F1, S1 |
| MF2 | Gate ErrorBoundary console.error with import.meta.env.DEV | HIGH | 2m | A1 |
| MF3 | Move AISPDualView render block to BEFORE the AISP footer (semantic ordering) | MED | 5m | F2 |
| MF4 | Move OpenCoreVsCommercial similarly | MED | 5m | F3 |
| MF5 | Sync phase-21/MEMORY.md to "Cleanup + ADR/DDD gap-fill" title + actuals | MED | 5m | A3 |
| MF6 | Remove duplicate P21 row from STATE.md §2 Runway (P21 sealed; goes to §1 only) | MED | 5m | A2 |
| MF7 | Amend ADR-053 §"Theme alignment" to drop the dark-island caveat (now obsolete after F2) | MED | 5m | A4 |
| MF8 | BYOK provider URLs clickable (`<a href>` w/ rel="noopener") | LOW | 5m | S2 |
| MF9 | About.tsx "Sealed P15-P22 at composite 81+" callout | LOW | 5m | U2 |

**Total fix-pass effort:** ~70 min.

## P20 elephant in the room

P20 (MVP Close) hasn't actually executed. CostPill UI, mvp-e2e tests, Vercel deploy, persona re-score are all still on the todo list. **P21 + P22 jumped ahead** because they were doc/UI work that didn't gate on cost-cap wiring or Vercel deploy.

**Decision needed (post-deep-review):** Either run P20 next (cost-cap + SECURITY.md + Vercel) OR formally re-sequence P20 to a later slot. Recommend running P20 next to maintain the MVP-close milestone before Sprint B work begins. **MF1 SECURITY.md authoring above can be the first deliverable of P20** OR pre-shipped here in fix-pass; recommend pre-shipping (closes 2 HIGH-severity items).

## Composite estimate post-fix

- Grandma: 73 → 75 (+2 from About callout)
- Framer: 84 → 86 (+2 from BYOK URLs + AISP dual-view ordering)
- Capstone: 86 → 90 (+4 from SECURITY.md visible + AISP dual-view properly placed)
- **Composite: 84 → 89** (+5)

## Cross-references

- P19 deep-dive: `phase-19/deep-dive/00-summary.md` (template for this pattern)
- P22 brutal-review pass-1: `phase-22/brutal-review/pass-1/00-summary.md`
- ADR-054: `docs/adr/ADR-054-ddd-bounded-contexts.md`
- A1 capability audit: `phase-22/wave-1/A1-capability-audit.md` §B (HIGH-severity gaps; MF1 confirms)

## Reading guide

| File | LOC | Purpose |
|---|---:|---|
| `00-summary.md` (this) | ~200 | Composite + per-reviewer top + must-fix queue |
| `01-ux-functionality.md` | ~250 | R1 + R2 detailed findings |
| `02-security-architecture.md` | ~300 | R3 + R4 detailed findings |
| `03-fix-pass-plan.md` | ~250 | File-by-file decomposition for MF1-MF9 |
