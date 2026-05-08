# Phase 29 — Session Log (Sprint D P1 — Template Library API)

> **Sealed:** 2026-04-28 (single session, ~25m actual)
> **Composite:** 91/100 (held; library API is plumbing — UX-invisible until P30)
> **Sprint D opener.**

## Decomposition rationale

The P29 preflight originally scoped *Template Library + first content generator* into a single phase. Per CLAUDE.md "small steps" mandate + KISS, P29 was decomposed to ship ONLY the library decoration; content generators were deferred to P31 inside the same Sprint D arc. ADR-058 documents the new boundary: P29 ships `kind: 'patcher' | 'generator'` typing + library APIs, P31 ships the first generator. Net cost: zero — Sprint D total scope unchanged, internal phasing tightened.

**Revised Sprint D phasing:**
- **P29** Template Library API (decoration + categories + kinds) — ADR-058 ✅
- **P30** Template Persistence (user-generated templates → IndexedDB) — ADR-059
- **P31** Content Generators POC (CONTENT_ATOM + generateContent) — ADR-060
- **P32** Multi-section Content Pipeline (style-aware tone) — ADR-061
- **P33** Content + Template Bridge (AISPTranslationPanel wire) — ADR-062

## Wave 1 — Template Library API

### A1 library.ts ✅
- `src/contexts/intelligence/templates/library.ts` (NEW, ~75 LOC)
- `TemplateMeta extends Template` with `category` + `examples` + `kind`
- `TEMPLATE_LIBRARY` decorated registry (readonly array; module-load construction)
- 3 baseline templates categorized via `BASELINE_META`:
  - `make-it-brighter` → theme + patcher
  - `hide-section` → section + patcher
  - `change-headline` → content + patcher
- 4 APIs: `listTemplates` / `listTemplatesByCategory` / `listTemplatesByKind` / `getTemplateById`
- Default fallback for un-categorized future registry entries (`category: 'content'`, `kind: 'patcher'`, `examples: []`) — additive backward-compat

### A2 ADR-058 ✅
- `docs/adr/ADR-058-template-library-api.md` full Accepted
- Documents library-as-decoration pattern (no schema migration; `BASELINE_META` is the shim for the 3 P23 templates)
- Categories: `theme | section | content` — closed enum at 3; future amendments via ADR
- Kinds: `patcher | generator` — generator slot reserved for P31
- Trade-offs: hand-curated `BASELINE_META` (fine at 3 templates); P30 will introduce row-declared metadata for user-generated templates

### A3 Tests ✅
- `tests/p29-template-library.spec.ts` (NEW, 8 cases) — PURE-UNIT; zero browser; deterministic
- Coverage: full list / category filter (theme/section/content) / kind filter (patcher all 3 / generator zero) / lookup hit / lookup miss → null / metadata population invariants
- **All 8 GREEN first-pass.** Pattern continues from P24-P28: hardcoded constants + direct atomic-module imports (no barrel imports of default-config.json).

## Verification

| Check | Status | Detail |
|---|---|---|
| `tsc --noEmit` (via build) | ✅ PASS | clean |
| `npm run build` | ✅ PASS | built in ~2s; main 558 KB gzip (+0.0 KB delta — decoration is module-load, not bundle-impacting beyond ~75 LOC) |
| `tests/p29-template-library.spec.ts` | ✅ 8/8 first-pass |
| All P15-P28 source intact | ✅ | additive-only; library decorates but does not mutate registry |

## Persona re-score (delta from P28 91/100)

- **Grandma:** 76 (held; library API is plumbing — no UX surface)
- **Framer:** 89 (held; same template count, same prompt coverage)
- **Capstone:** 96 (held; library is foundational infra for the content arc P31-P33; the kind dispatcher is the hook)
- **Composite:** **91/100** (held; intentionally non-climbing — this is a setup phase)

## Sprint D opener — what changed

- **`kind` axis introduced** — 2-step pipeline can now dispatch on `template.kind` in P31 without any wiring change beyond a single conditional
- **Library API surface defined** — UI consumers (P30 picker, future browse screens) plug in without touching the registry
- **`category` axis introduced** — opens style-aware content (P32) and tone-metadata-on-templates without schema breakage

## P29 DoD final accounting

| # | Item | Status |
|---|---|---|
| 1 | Template Library decorated registry | ✅ DONE |
| 2 | TemplateMeta type + category + kind enums | ✅ DONE |
| 3 | 4 list/filter/lookup APIs | ✅ DONE |
| 4 | 3 baselines categorized + tagged `kind: 'patcher'` | ✅ DONE |
| 5 | ADR-058 full Accepted | ✅ DONE |
| 6 | ≥5 PURE-UNIT tests | ✅ DONE (8 cases) |
| 7 | Build green; tsc clean; backward-compat | ✅ PASS |
| 8 | session-log + retro + STATE + CLAUDE + P30 preflight | ✅ DONE |

## Effort actuals

| Activity | Estimated | Actual | Multiplier |
|---|---:|---:|---:|
| library.ts module | 30m | ~5m | 6× |
| ADR-058 | 30m | ~5m | 6× |
| 8 PURE-UNIT tests | 30m | ~5m | 6× |
| seal artifacts (session-log + retro + STATE + CLAUDE + P30 preflight) | 30m | ~10m | 3× |
| **Total P29** | 2h | **~25m** | **~5×** |

## Carryforward to P30 (acceptable post-P29)

- **C04** ListenTab full <500 LOC split (queued; awaits dedicated cleanup pass)
- **C17** remaining 10 logic-layer casts (deepMerge / applyPatches)
- **C11** vertical mobile carousel (P22 cosmetic)
- **C12** AISP Blueprint sub-tab refresh (P22 cosmetic)
- **AISPTranslationPanel ChatInput integration** — wire 2-step pipeline output into the panel (planned for P33)
- **Vercel deploy live URL** (owner-triggered)

## Successor

**P30 — Sprint D P2 (Template Persistence).** User-generated templates persist to IndexedDB via migration 003-templates.sql; `TEMPLATE_LIBRARY` becomes registry-union-with-DB. ADR-059.

P29 SEALED at composite **91/100**. Sprint D underway.
