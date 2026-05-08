# Phase 27 Retrospective — Sprint C P2: LLM-Native AISP Understanding

> **Final composite:** 90/100 (Grandma 76 / Framer 88 / Capstone 96) — **plateau broken (+2 vs P26 89)**
> **Sealed:** 2026-04-27 (~45m actual; ~2.7× velocity)
> **Capstone-thesis demonstration phase complete.**

## What worked

- **Crystal Atom verbatim as LLM system prompt.** `INTENT_ATOM` is sent unchanged — no English wrapper, no translation. The 5-line JSON-shape directive at the bottom is the only English; the AISP atom IS the contract.
- **Zod schema mirrors Σ exactly.** TypeScript-level enforcement of the verb enum + target type set + 1-based-index constraint + confidence range. LLM responses that violate Σ get rejected at parse time, never reach the template router.
- **Cost-cap pre-check on AISP-LLM call.** Skips the LLM AISP step when sessionUsd ≥ 90% of cap — preserves budget for the actual chat completion. Prevents the AISP layer from starving the patch generator.
- **AISPTranslationPanel as a pure component.** Props in / JSX out / `data-testid` instrumented. Trivial to unit-test; reusable across future surfaces (ChatInput, ListenTab, debug overlay).
- **ADR-055 worked example.** Authoring the P15-P26 trajectory in proper AISP format (Ω/Σ/Γ/Λ/Ε with `≜`/`≡`/`∎`) demonstrates the Ambig(D)<0.02 thesis with a concrete artifact reviewers can inspect.
- **Plateau broken.** 88→88→88→89→**90**. Capstone reviewer sees three first-class AISP artifacts (atom + classifier + UI) plus a 30-line AISP-format doc. The thesis is no longer abstract.

## What to keep

- **Atom-as-data + classifier-as-function + UI-as-component** triple structure. Each AISP-related capability gets exactly one of each. Keeps the AISP module from growing into a god-folder.
- **Pure-unit Zod tests with mocked responses.** No LLM cost in test runs. 6 enum / range / shape cases give high coverage in <100 LOC.
- **ADR pairing (055 sibling to 056).** Conversion-rubric ADR + thesis-claim ADR together form the AISP doctrine for the repo.

## What to drop

- (none)

## What to reframe

- **Carryforward debt is now blocking.** R4 brutal-review penalty (-1 to architecture score) is the canary. **Reframe** P28 as a Sprint C P3 + cleanup-pass hybrid: ship 2-step template selection AND close C04 (ListenTab split) + C17 (Zod helper) + C15 (import lock) + C16 (FK). If that bloats P28, split cleanup into a P28.5 housekeeping phase BEFORE Sprint D opens.

## Velocity actuals

| Activity | Estimated | Actual | Multiplier |
|---|---:|---:|---:|
| ADR-055 + AISP worked example | 30m | ~10m | 3× |
| A1 LLM classifier + Zod | 30m | ~15m | 2× |
| Wiring | 15m | ~5m | 3× |
| A2 UI panel | 30m | ~5m | 6× |
| A3 ADR-056 + 9 tests | 30m | ~10m | 3× |
| **Total** | 2h | **~45m** | **~2.7×** |

## Sprint trajectory P23-P27

| Phase | Title | Composite | Effort | Capstone |
|---|---|---:|---:|---:|
| P23 | Sprint B P1 — Templates | 88 | 80m | 92 |
| P24 | Sprint B P2 — Scoping | 88 | 35m | 92 |
| P25 | Sprint B P3 — Intent translate | 88 | 25m | 92 |
| P26 | Sprint C P1 — AISP atom + rules | 89 | 35m | 93 |
| **P27** | **Sprint C P2 — AISP LLM + UI** | **90** | **45m** | **96** |

Capstone score climbed +4 over Sprint C (92→96). The thesis is now visible in code AND in UI.

## Observations

- **Sprint C breaks composite plateau** because it's the first sprint with USER-FACING AISP. Sprint B was infrastructure; Sprint C is product.
- **R4 architecture penalty is the right signal** — the system is asking for cleanup before more growth. P28 should respect that.
- **9 pure-unit tests in 10 minutes** confirms the testing-discipline-as-flywheel claim. Each pure-unit test is ~1 min to write; integration tests cost 5-10×.
- **AISP triad in repo** (`INTENT_ATOM` + `llmClassifyIntent()` + `AISPTranslationPanel`) is the capstone defense surface. Reviewer can inspect each.

## Next phase

**P28 — Sprint C Phase 3 (2-step Template Selection + Carryforward Cleanup).** Per R4 finding: bundle Sprint C close with C04/C15/C16/C17 cleanup. If scope grows, defer template-selection to P29 (Sprint D opener) and run P28 as dedicated cleanup.

Phase 27 sealed at composite **90/100**. **Plateau broken; Sprint C P3 next; carryforward debt called out.**
