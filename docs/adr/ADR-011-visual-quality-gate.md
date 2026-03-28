# ADR-011: Mandatory Visual Quality Gate

## Status: ACCEPTED (2026-03-28)

## Context
Phase 1.1 shipped a Data Tab that rendered raw HTML class names as visible text. The TypeScript compiler and Vite build both passed — the bug was purely visual. No agent caught it because no agent looked at the rendered output.

Build passing ≠ UI working. A new quality gate is required.

## Decision

### Cardinal Sin #13
"Shipping visible UI without running a Playwright visual check = automatic rejection."

### Required Verification Steps (after every UI change)
| # | Check | Tool | Catches |
|---|-------|------|---------|
| 1 | TypeScript compiles | `npx tsc --noEmit` | Type errors |
| 2 | Production builds | `npx vite build` | Bundle errors |
| 3 | Visual smoke tests | `npx playwright test` | Raw HTML, broken renders, missing content |
| 4 | Screenshot review | Agent examines screenshots | Layout breaks, empty states |
| 5 | No debug artifacts | Grep rendered output | "lorem", "TODO", raw class names |
| 6 | All tabs navigable | Playwright clicks each tab | Dead tabs, crash on navigate |
| 7 | Bidirectional sync | Change control → verify JSON. Edit JSON → verify preview. | Broken data loop |

### Test File
Visual smoke tests live at `tests/visual-smoke.spec.ts` and run via `npx playwright test`.

## Consequences
- Every agent completing a UI task MUST run `npx playwright test` before marking the task complete
- Screenshots are stored in `tests/screenshots/` for human review
- Failed visual tests block the commit
