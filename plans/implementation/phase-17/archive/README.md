# Phase 17: Full Feature Review ADR + Pilot Audit

**Prerequisite:** Phase 16 CLOSED  
**Goal:** Create the Architecture Decision Record (ADR) that defines the complete review process for every section, button, and feature in Hey Bradley — then pilot it on one feature to validate the checklist before the full sweep in Phase 18.

## Core Deliverables

### ADR: Comprehensive Feature Review Process
- ADR document defining the review methodology for all UI elements
- Standardized checklist template per section/feature covering:
  - Visual rendering (does it look correct in all themes?)
  - Functional behavior (does every button/toggle/input do what it should?)
  - SIMPLE vs EXPERT mode (correct controls in each mode?)
  - Data flow (do changes persist in JSON, preview, specs?)
  - Edge cases (empty state, max length, special characters)
  - Responsive behavior (mobile, tablet, desktop)
  - Accessibility (keyboard nav, screen reader, focus management)
  - Cross-theme compatibility (all 12 themes render correctly)
  - Cross-example compatibility (section works in all 10 examples)
  - Spec generation impact (does this section produce correct spec output?)
  - AISP encoding (Crystal Atom reflects section state accurately?)
- Testing template: manual QA script + automated test requirements per feature
- Severity classification: P0 (broken), P1 (degraded), P2 (cosmetic), P3 (enhancement)
- Sign-off criteria: what "done" means for each feature

### Pilot Review: One Feature End-to-End
- Select one representative feature (e.g., Hero section) for the pilot audit
- Execute the full checklist against this one feature
- Document all findings: passed, failed, needs work
- Refine the checklist template based on pilot learnings
- Produce the final checklist template that Phase 18 will use for every feature
- Estimate time-per-feature to inform Phase 18 planning

### Deliverable Files
- `plans/adrs/adr-0XX-feature-review-process.md` — the ADR
- `plans/implementation/phase-17/review-checklist-template.md` — reusable template
- `plans/implementation/phase-17/pilot-review-hero.md` — pilot audit results
- `plans/implementation/phase-17/pilot-retrospective.md` — what changed after the pilot
