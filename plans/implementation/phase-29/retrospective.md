# Phase 29 Retrospective — Sprint D P1 (Template Library API)

> **Final composite:** 91/100 (held vs P28; intentional setup-phase pause before content arc)
> **Sealed:** 2026-04-28 (~25m actual; ~5× velocity)
> **Sprint D Phase 1 of 5.**

## What worked

- **Decomposition first.** P29 preflight bundled library + content-generators into one phase; splitting the library out gave a tight 25m phase with crisp DoD and zero scope ambiguity. Sprint D now has 5 well-scoped phases instead of 1 over-loaded P29 + 4 follow-ons.
- **Decoration over migration.** `TEMPLATE_LIBRARY` is `TEMPLATE_REGISTRY.map(...)` — no DB rows, no breaking change to P23-P28 consumers. `tryMatchTemplate` and `runTwoStepPipeline` continue using `Template`; library API is purely additive.
- **`kind` axis as P31 prep.** Adding `kind: 'patcher' | 'generator'` now means the 2-step pipeline can dispatch via a single `if (template.kind === 'generator')` in P31 — no rewiring.
- **PURE-UNIT pattern continues to deliver.** 8 tests / first-pass green / zero flake / 5m to write. The pattern locked in by P24 is paying compound interest.
- **Hand-curated `BASELINE_META`.** At 3 templates, this is fine; declaration boilerplate would dwarf the data. Migration shim for the legacy P23 templates only — future templates declare metadata inline in the registry.

## What to keep

- **"Library is decoration" pattern.** Consider it for other registry-style modules (themes, examples) where browse APIs land later than the registry itself.
- **Default fallback metadata.** `BASELINE_META[t.id] ?? { category: 'content', examples: [], kind: 'patcher' }` means new registry entries don't crash the library — they just default to the most-conservative classification. Critical for additive evolution.
- **`readonly` everywhere.** TEMPLATE_LIBRARY is `readonly TemplateMeta[]`; APIs return `readonly TemplateMeta[]`. Prevents accidental mutation in consumers.

## What to drop

- **Phase-budget over-estimation.** Original P29 preflight estimated 2h. Actual was 25m. The decomposition-first move (split into P29-only library + later phases) is the real reason — the original estimate was for a 5-deliverable phase; we shipped the smallest 3.
- **Tempting "do more in P29 since we're fast".** Resist. The composite hold at 91 is correct: this phase ships infrastructure that earns its score in P31-P33. Climbing the composite for foundational plumbing is anti-pattern.

## What to reframe

- **Sprint D phasing now tightened.** Original A2-sprint-plan-review §D had 5 phases at coarse granularity. Now: P29 library (DONE) / P30 persistence / P31 content POC / P32 multi-section / P33 bridge + UI wiring. Each phase has 1 ADR, 1 module, 5+ tests, ≤30m at velocity.
- **Capstone narrative addition.** "Library is decoration" is a teachable pattern — it joins "Σ-restricted Crystal Atom" and "PURE-UNIT testing" in the architectural-discipline section of the capstone presentation.

## Velocity actuals

| Activity | Estimated | Actual | Multiplier |
|---|---:|---:|---:|
| library.ts module + APIs | 30m | ~5m | 6× |
| ADR-058 | 30m | ~5m | 6× |
| 8 PURE-UNIT tests | 30m | ~5m | 6× |
| Seal artifacts | 30m | ~10m | 3× |
| **Total** | 2h | **~25m** | **~5×** |

## Sprint trajectory P23-P29

| Phase | Title | Composite | Capstone | Tests |
|---|---|---:|---:|---:|
| P23 | Sprint B P1 — Templates | 88 | 92 | 7 |
| P24 | Sprint B P2 — Scoping | 88 | 92 | 10 |
| P25 | Sprint B P3 — Intent translate | 88 | 92 | 7 |
| P26 | Sprint C P1 — AISP rules | 89 | 93 | 9 |
| P27 | Sprint C P2 — AISP LLM + UI | 90 | 96 | 9 |
| P28 | Sprint C P3 — 2-step + cleanup | 91 | 96 | 6 |
| **P29** | **Sprint D P1 — Library API** | **91** | 96 | **8** |

Composite: 88→88→88→89→90→91→**91**. First held-flat in Sprint D series. Capstone held at 96 (Sprint D foundation work; climb expected at P31 first generator + P33 full UI bridge).

## Observations

- **Test count climbing.** P28→P29 = 6→8 PURE-UNIT cases. Cumulative Sprint B-D = 56 cases / 7 specs / first-pass green / zero browser flake. The pattern is the asset.
- **Bundle delta = 0.** Adding a library module of ~75 LOC moved gzip 0 KB. Tree-shaking is doing its job; consumers that don't import library.ts pay nothing.
- **3 ADRs on track for Sprint D.** ADR-058 (library) shipped. ADR-059 (persistence), ADR-060 (content POC), ADR-061 (multi-section), ADR-062 (UI bridge) staged.

## Next phase

**P30 — Sprint D P2 (Template Persistence).** User-generated templates persist to IndexedDB via migration 003-templates.sql. `TEMPLATE_LIBRARY` becomes the union of registry + DB rows. ADR-059.

Phase 29 sealed at composite **91/100**. Sprint D opener clean.
