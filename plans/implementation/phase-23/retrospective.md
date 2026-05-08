# Phase 23 Retrospective — Sprint B Phase 1: Simple Chat

> **Final composite:** 88/100 (Grandma 76 / Framer 86 / Capstone 92) — held vs P20
> **Sealed:** 2026-04-27 (~80m actual; ~4× velocity)

## What worked

- **3-file module pattern.** `types.ts` + `registry.ts` + `router.ts` + `index.ts` barrel. Each file ≤90 LOC. KISS-aligned.
- **Template short-circuit BEFORE LLM call** in `chatPipeline.submit()`. Dynamic import keeps the templates module code-split; tolerates module load failure gracefully (falls through to LLM as before). Zero risk of regression for existing chat path.
- **Friendly empty-patch envelope** when target absent (e.g. "hide the nonexistent-section-type"). Skips LLM AND surfaces a helpful suggestion. Better UX than silently calling the LLM and getting a confused response.
- **`_(template: <id>)_` summary suffix.** One-line transparency about which path was taken without bloating the chat UI.
- **C18 LRU bound** landed in 15 minutes — tiny SQL helper + 1-line wire-up at initDB. Closes performance carryforward at low cost.
- **C14 sentinel test** parses migrations/*.sql + exportImport.ts to enforce schema-evolution canary. Catches future "added a `prompt_text` column without registering the table for export-strip" mistakes automatically.
- **ADR-050 distinguishes templates from fixtures** clearly. Side-by-side comparison table in §"Distinction from fixtures" makes the architectural separation explicit.

## What to keep

- **Dynamic-import-with-graceful-fallback** for new pipeline-extension modules. Pattern: `try { const mod = await import('...'); ... } catch { /* fall through */ }`. Lets new code ship without risk of breaking the existing path.
- **Confidence threshold abstraction** even when it's binary (1.0/0.0) today. Future Sprint C scoring drops in cleanly without changing call sites.
- **Per-template `confidence?: number`** override on the Template type. Lets edge-case templates (e.g. ambiguous matchers) opt into a higher bar before short-circuiting.

## What to drop

- (none — clean run)

## What to reframe

- **Test flakiness on simple-chat spec.** All 5 tests retry-pass; root cause is dynamic-import race + configStore `resetToDefaults` race in `evaluate()`. **Reframe**: Sprint B testing should prefer router-as-pure-unit testing over chatPipeline round-trip integration tests. Add P24 carryforward: `tests/p24-templates-router-unit.spec.ts` that exercises `tryMatchTemplate(text)` in isolation against a stubbed configStore.
- **First-match-wins template selection.** Works at 3 entries; the registry will grow. Sprint C P26 explicitly replaces this with scored selection, but P24 (section targeting) is unaffected. Keep first-match-wins through Sprint B; lift to scored-selection at Sprint C kickoff.

## Velocity actuals

| Activity | Estimated | Actual | Multiplier |
|---|---:|---:|---:|
| A1 templates module | 1.5h | ~25m | 4× |
| A2 wiring | 1h | ~10m | 6× |
| A3 ADR + tests | 1h | ~20m | 3× |
| C18 + C14 cleanup | 1h | ~15m | 4× |
| Retro + STATE + seal | 1h | ~10m | 6× |
| **Total** | 5.5h | **~80m** | **~4×** |

Slightly slower than P20 (~7×) — the test-flakiness debug ate ~10 minutes. Acceptable.

## Observations

- **Template-first architecture validates the AISP thesis** in concrete code. The Crystal Atom in `prompts/system.ts` defines the symbolic grammar; templates are the deterministic-on-rails realization. Sprint C will close the loop by having an AISP intent classifier produce probabilistic matches over the same template registry.
- **Cost discipline scales.** P20 added the cost-cap UI; P23 templates make $0 the default for high-frequency intents. Capstone narrative: "we don't just cap cost, we eliminate it for the cases we know."
- **Dynamic-import + graceful-fallback** is a good pattern for evolution. Future pipeline extensions (multi-step, AISP intent classifier, etc.) can use the same shape: dynamic import → try the new path → fall through to existing path on failure.

## Next phase

P24 — Sprint B Phase 2 (Section targeting via `/hero-1` keyword scoping). ADR-051 to document. Templates take an optional `targetPath` override.

Phase 23 sealed at composite **88/100**.
