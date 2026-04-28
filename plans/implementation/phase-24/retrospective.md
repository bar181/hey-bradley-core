# Phase 24 Retrospective — Sprint B Phase 2: Section Targeting

> **Final composite:** 88/100 (Grandma 76 / Framer 87 / Capstone 92) — held vs P23
> **Sealed:** 2026-04-27 (~35m actual; ~3.5× velocity)

## What worked

- **Pure-unit tests for the parser + resolver.** 10/10 GREEN on first run, no browser, no flakiness. Lesson from P23 simple-chat-spec flakiness directly applied.
- **Single-regex parser.** `/([a-z][a-z-]*?)(?:-(\d+))?\b/i` handles `/hero-1`, `/blog-2`, `/footer` (no index), case-insensitive — KISS.
- **Disabled-section skip in resolver.** `resolveScopedSectionIndex` walks ENABLED sections only; matches user intent ("the second hero THAT'S VISIBLE") not array index.
- **Backward compat clean.** `make-it-brighter` ignores scope; P23 tests pass unchanged. Templates that DO honor scope use `scope?? findSectionByType(...)` fallback chain.
- **ADR-051 cross-references ADR-052** (AISP Intent Classifier — proposed) explicitly. Scope tokens become AISP grounding hints when Sprint C lands. Future-friendly.

## What to keep

- **Pure-unit testing pattern for new modules.** When a module has no React/DOM dependency, test it via direct import (Playwright still works as the runner; just no `page.goto`). 10× faster + deterministic.
- **Match-cleanText design.** Scope parser strips the token from text; templates match against cleaned text. Lets `hide /hero-1` and `hide the hero-1` use the same template regex.
- **Friendly empty-patch with echoed scope-string.** "I can't find a `hero-3` section to hide" tells the user exactly what they typed AND what didn't resolve.

## What to drop

- (none — clean run)

## What to reframe

- **`change-headline` regex was tightened** to allow the headline phrase to be optional when scope provides the target. Pattern: `change|set|update (?:the)? (?:headline)? to "X"`. Edge case: `set X to Y` could now match without the user thinking about scope. Acceptable for P24; revisit at Sprint C if AISP intent classifier produces alternative parses.

## Velocity actuals

| Activity | Estimated | Actual | Multiplier |
|---|---:|---:|---:|
| Scoping module | 30m | ~10m | 3× |
| Template extension | 30m | ~10m | 3× |
| ADR-051 + 10 tests | 30m | ~10m | 3× |
| Retro + STATE + seal | 30m | ~5m | 6× |
| **Total** | 2h | **~35m** | **~3.5×** |

Slightly slower than the velocity peak (~7×) because the scope/regex design needed careful thought to handle the disabled-section-skip semantics. Acceptable.

## Observations

- **Sprint B is delivering compounding value.** P23 templates short-circuit cheap intents. P24 makes templates work on multi-instance configs. P25 (Intent Translation) will let templates handle messier phrasings ("get rid of the second blog" → maps to `hide /blog-2`). Each phase makes the previous phase more powerful.
- **Pure-unit testing has 10× velocity advantage** vs Playwright integration tests for parser-style modules. Apply this pattern to all future "logic-layer module" work.
- **Multi-instance configs (kitchen-sink)** become first-class addressable. The Capstone narrative now includes "deterministic precision targeting" alongside cost optimization.

## Next phase

P25 — Sprint B Phase 3 (Intent Translation: messy → structured to-do). Introduces intent classifier middleware BEFORE template router. ADR-051 stub already exists from P21 — will be promoted to full Accepted at P25 kickoff (or split into ADR-051a / ADR-051b as needed).

Phase 24 sealed at composite **88/100**.
