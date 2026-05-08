# Phase 30 — Session Log (Sprint D P2 — Template Persistence)

> **Sealed:** 2026-04-28 (single session, ~30m actual)
> **Composite:** 91/100 (held; data-layer phase — no UX surface)
> **Sprint D mid-arc.**

## Wave 1 — Template Persistence

### A1 Migration 003 ✅
- `src/contexts/persistence/migrations/003-user-templates.sql` (NEW, ~30 LOC)
- `user_templates(id PK, name, category, kind, examples_json, payload_json, created_at, updated_at)`
- CHECK constraints on `category` + `kind` enums
- Indexes on `category` + `kind` for filter queries
- Idempotent on re-init (runner skips when `schema_version > num`)
- FK to projects deferred per ADR-040b symmetry; application-layer invariant in `createUserTemplate`

### A2 userTemplates repo ✅
- `src/contexts/persistence/repositories/userTemplates.ts` (NEW, ~120 LOC)
- 5 functions: `createUserTemplate` / `listUserTemplates` / `getUserTemplate` / `deleteUserTemplate` / `parseUserTemplate`
- `listUserTemplates(filter?)` accepts `{category, kind}` for filtered queries
- `parseUserTemplate(row)` returns `null` on JSON parse failure (graceful for tampered rows)
- All mutations call `void persist()` to write IndexedDB
- Read paths use prepared statements + `stmt.getAsObject()` consistent with examplePrompts repo

### A3 BrowseTemplate split-type ✅
- `src/contexts/intelligence/templates/library.ts` (EDIT, +50 LOC)
- NEW `BrowseTemplate` interface (id + name + category + kind + examples + source)
- NEW `listAllForBrowse(loadUserRows)` — registry-baked + user-authored unified browse view
- Injectable `loadUserRows` callback keeps `library.ts` DB-free at module load (pure-unit-test friendly)
- Backward compat: P29 `TemplateMeta` + 4 list APIs unchanged

### A4 ADR-059 ✅
- `docs/adr/ADR-059-template-persistence.md` full Accepted
- Documents migration + repo + split-type decision (`TemplateMeta` for runtime / `BrowseTemplate` for browse UI)
- Privacy: opt-in user content (NOT stripped from `.heybradley` exports — consistent with chat_messages)
- FK deferral cross-references ADR-040b
- `payload_json` left opaque to library at P30; P31+ defines generator schema

### A5 Tests ✅
- `tests/p30-template-persistence.spec.ts` (NEW, 9 cases) — PURE-UNIT
- Coverage: migration file presence + DDL shape + CHECK enums + indexes / repo CRUD surface / browse merge with registry + user rows / order preservation / per-row metadata
- **All 9 GREEN first-pass.**

## Verification

| Check | Status | Detail |
|---|---|---|
| `tsc --noEmit` (via build) | ✅ PASS | clean |
| `npm run build` | ✅ PASS | built in 2.07s; main 519 KB gzip (chunk-restructure noted; total bundle stable) |
| `tests/p30-template-persistence.spec.ts` | ✅ 9/9 first-pass |
| All P15-P29 source intact | ✅ | additive-only; library decoration extends, doesn't replace |

## Persona re-score (delta from P29 91/100)

- **Grandma:** 76 (held; data-layer only — no UX surface)
- **Framer:** 89 (held; templates surface unchanged from user POV until UI lands)
- **Capstone:** 96 (held; persistence is groundwork for content arc)
- **Composite:** **91/100** (held — second consecutive setup-phase pause as planned)

## P30 DoD final accounting

| # | Item | Status |
|---|---|---|
| 1 | Migration 003 + table + indexes | ✅ DONE |
| 2 | userTemplates repo CRUD | ✅ DONE |
| 3 | BrowseTemplate type + listAllForBrowse | ✅ DONE |
| 4 | ADR-059 full Accepted | ✅ DONE |
| 5 | ≥5 PURE-UNIT tests | ✅ DONE (9 cases) |
| 6 | Build green; tsc clean; backward-compat | ✅ PASS |
| 7 | session-log + retro + STATE + CLAUDE + P31 preflight | ✅ DONE |

## Effort actuals

| Activity | Estimated | Actual | Multiplier |
|---|---:|---:|---:|
| migration 003 + repo | 15m | ~5m | 3× |
| library merge + lazy-init | 15m | ~5m | 3× |
| ADR-059 + 9 tests | 30m | ~10m | 3× |
| seal artifacts | 15m | ~10m | 1.5× |
| **Total P30** | 1.5h | **~30m** | **~3×** |

## Carryforward to P31 (acceptable post-P30)

- **C04** ListenTab full <500 LOC split (still queued)
- **C17** remaining 10 logic-layer casts
- **C11** vertical mobile carousel
- **C12** AISP Blueprint sub-tab refresh
- AISPTranslationPanel ChatInput integration (planned for P33)
- Vercel deploy live URL (owner-triggered)

## Successor

**P31 — Sprint D P3 (Content Generators POC).** First `kind: 'generator'` template. CONTENT_ATOM Crystal Atom (Σ-restricted to `{text, tone, length}`). `generateContent(template, context)` replaces 2-step Step 2 when `template.kind === 'generator'`. ADR-060.

P30 SEALED at composite **91/100**. Sprint D mid-arc on track.
