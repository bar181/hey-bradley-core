# Gate 1: 90% Reproduction Test — Assessment

**Date:** 2026-04-04
**Test:** Upload GreenLeaf AISP spec to Claude chatbot → generate HTML
**Reference:** `plans/implementation/phase-9/greenleaf-from-aisp.html`

---

## Results

| Category | Score | Notes |
|----------|-------|-------|
| Content similarity | 80% | AISP version added some additional features beyond the spec |
| Theme similarity | 50% | AISP version correctly used green theme for "GreenLeaf" — actually better than our blue/professional palette |
| Typography | Better in AISP | DM Serif Display serif headings + Inter body — more distinctive |
| Layout structure | ~85% | Same section order, similar component structure |
| **Overall reproduction** | **~70%** | Below 90% target |

## Gap Analysis

### Why below 90%:
1. **Color palette mismatch** — Our GreenLeaf example uses Professional theme (blue/corporate). The AISP spec output correctly inferred a green palette for a company called "GreenLeaf." The spec should be more explicit about exact colors.
2. **Typography** — The AISP output chose DM Serif Display + Inter (a better pairing). Our spec should specify exact font families.
3. **Additional features** — The AISP version added features not in our spec (more sections, enhanced content).

### What needs to improve:
1. **Build Plan generator** should include exact hex values for every palette color
2. **Build Plan generator** should specify exact font families and weights
3. **Build Plan generator** should include more pixel-precise spacing values
4. **Consider making the GreenLeaf example actually use green colors** — the name implies it

## Verdict: PARTIAL PASS (70%)
Target is 90%. Need to improve spec generator precision for full pass.
This will be addressed in Phase 10 when LLM integration provides feedback loops.

---

## UI Issues Noted During Review

1. **Left panel missing size adjustment** — no resize handle or width control
2. **Both panels need show/hide toggles** — on all device sizes, not just desktop
