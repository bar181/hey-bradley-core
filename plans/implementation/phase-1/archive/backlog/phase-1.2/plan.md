# Phase 1.2: JSON Templates & Smoke Test — Plan

**Goal:** Create the canonical JSON structure (template + default), prove the right panel → JSON → preview loop works with a Playwright smoke test, and establish the ADRs that govern JSON decisions going forward.

**DoD (from requirements.md — fixed, do not change):**
1. JSON templates folder with README
2. template-config.json (all possible options for site, theme, hero)
3. default-config.json (Hey Bradley example content)
4. Smoke test: right panel toggle → JSON updates → preview updates
5. ADRs 012-016 written
6. Favicon + title "Hey Bradley — Designer Mode"

## Scope
- Three-level JSON hierarchy: site → theme → sections[].components[]
- template-config.json = superset of all possible keys
- default-config.json = Hey Bradley example (renders current Reality preview)
- Playwright smoke test proving the full loop

## What Phase 1.2 Does NOT Do
- Does NOT add new section types
- Does NOT add copy editing
- Does NOT add theme switching (that's 1.3)
- Does NOT add JSON upload or editor validation
- Does NOT change the hero visual design

## Decision Tree for JSON Placement
```
Affects the entire page?          → site level    (title, author, domain)
Affects all sections equally?     → theme level   (colors, fonts, spacing, mode)
Affects one section's structure?  → section level (variant, layout, enabled, order)
Affects one element in a section? → component level (button text, image src, badge style)
```

## Execution Order
1. research-agent FIRST (ADRs inform schema decisions)
2. schema-agent + test-agent PARALLEL (after research completes)
3. integration-agent LAST (wire everything, verify)

## Verification
| # | Check | Method |
|---|-------|--------|
| 1 | default-config.json validates against Zod | Unit test |
| 2 | template-config.json validates against Zod | Unit test |
| 3 | Template ⊇ Default (superset) | Unit test |
| 4 | Data Tab renders new JSON structure | Playwright screenshot |
| 5 | Smoke test: panel → JSON → preview | Playwright |
| 6 | ADRs 012-016 exist | File check |
| 7 | Favicon renders | Visual |
| 8 | Title = "Hey Bradley — Designer Mode" | Visual |
| 9 | src/data/README.md exists | File check |
| 10 | Zero TS errors + clean build | npx tsc && npx vite build |
| 11 | All existing Playwright tests pass | npx playwright test |
