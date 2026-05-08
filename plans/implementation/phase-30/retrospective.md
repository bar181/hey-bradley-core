# Phase 30 Retrospective — Sprint D P2 (Template Persistence)

> **Final composite:** 91/100 (held; data-layer phase)
> **Sealed:** 2026-04-28 (~30m / ~3× velocity)

## What worked

- **Split-type pattern.** `TemplateMeta` for runtime / `BrowseTemplate` for browse UI. User rows can't carry function fields (regex / envelope) so forcing one type would have required runtime materialization that doesn't ship until P31. Two thin types > one fat one.
- **Injected `loadUserRows` callback.** `library.ts` stays DB-free at module load; pure-unit tests pass without sql.js boot. Production callers wire DB on first use.
- **FS-level migration tests.** Asserting DDL shape + CHECK constraints + indexes via regex on the SQL file is honest and runs in milliseconds. Doesn't replace integration tests but covers schema regressions cheaply.

## What to keep

- **Migration symmetry with ADR-040b.** No FK to projects; application-layer invariant only. Consistent across `llm_logs` (P18b) and now `user_templates` (P30).
- **Opaque `payload_json`.** P30 doesn't define what generators look like. P31 will. Persisting raw JSON is a reasonable shim until the schema crystallizes.

## What to drop

- Nothing. Phase shipped clean.

## What to reframe

- **Browse UI deferred.** The `BrowseTemplate` API is plumbing; no consumer yet. Acceptable — UI surface lands when content generators (P31) give users a reason to browse.

## Velocity actuals

| Activity | Est | Actual | × |
|---|---:|---:|---:|
| migration + repo | 15m | ~5m | 3× |
| library merge | 15m | ~5m | 3× |
| ADR-059 + 9 tests | 30m | ~10m | 3× |
| seal | 15m | ~10m | 1.5× |
| **Total** | 1.5h | **~30m** | **~3×** |

## Sprint trajectory P23-P30

| Phase | Title | Composite | Tests |
|---|---|---:|---:|
| P29 | Sprint D P1 — Library API | 91 | 8 |
| **P30** | **Sprint D P2 — Persistence** | **91** | **9** |

Held at 91 (intended). Composite climb resumes at P31 (first content generator) and P33 (UI bridge).

## Next phase

**P31 — Sprint D P3 (Content Generators POC).** CONTENT_ATOM Crystal Atom + `generateContent` + first `kind: 'generator'` template. ADR-060.
