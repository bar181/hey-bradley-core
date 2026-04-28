# Phase 32 Retrospective — Sprint D P4 (Multi-section Pipeline)

> **Composite:** 92/100 (held; +1 Framer)
> **Sealed:** 2026-04-28 (~20m / ~3× velocity)

## What worked

- **Section type as runtime hint, not Σ field.** CONTENT_ATOM Σ stayed unchanged (P31 contract intact). Defaults shape *inputs* to generation, not the *output schema*. Clean.
- **4-tier resolution order.** Cue word → caller → section → hard fallback. Each layer documented; user voice always wins.
- **Type alignment with INTENT_ATOM.** SectionType enum mirrors ALLOWED_TARGET_TYPES so chatPipeline can pass `target.type` through without translation.

## What to keep

- **Hand-curated defaults table.** At 19 sections this is fine. Brand-voice tuning (post-MVP) becomes a per-project override layer on top.
- **Backward-compat discipline.** sectionType is optional; P31 callers unchanged. Same pattern from P29 (TemplateMeta default fallback).

## What to drop

- Nothing.

## What to reframe

- **Framer +1 is genuine.** With section-aware defaults, demo prompts like `set hero "Stop guessing"` produce *bold/short* output instead of *neutral/short* — reads more like real marketing copy. Even with deterministic stub.

## Velocity

| Activity | Est | Actual | × |
|---|---:|---:|---:|
| contentDefaults | 15m | ~5m | 3× |
| generator edit | 10m | ~3m | 3× |
| ADR-061 + 11 tests | 25m | ~10m | 2.5× |
| seal | 15m | ~5m | 3× |
| **Total** | 1h | **~20m** | **~3×** |

## Sprint D trajectory

| Phase | Title | Composite | Tests |
|---|---|---:|---:|
| P29 | Library API | 91 | 8 |
| P30 | Persistence | 91 | 9 |
| P31 | Content POC | 92 | 15 |
| **P32** | **Multi-section** | **92** | **11** |

Cumulative Sprint D: 43 PURE-UNIT tests / first-pass green / zero browser flake.

## Next phase

**P33 — Sprint D P5 (UI Bridge).** Final Sprint D phase. AISPTranslationPanel ChatInput integration; LLM swap; first generator template registered; 2-step pipeline dispatch. ADR-062.
