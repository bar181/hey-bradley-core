# Phase 7: XAI Docs + Workflow Pipeline

**North Star:** The builder generates real specification documents from the current JSON config, and the workflow pipeline visualizes the simulated AI process.

**Status:** WAITING (after Phase 6)
**Prerequisite:** Phase 6 COMPLETE (listen simulation works)

---

## Phase 7 Goal

Wire the XAI DOCS and WORKFLOW tabs to show live, meaningful content derived from the current project config.

---

## Deliverables

### XAI Docs Live
- **HUMAN sub-tab** — Structured spec from current JSON:
  - Site title, description, theme name, active sections listed
  - Per-section: type, variant, enabled components, key copy
- **AISP sub-tab** — `@aisp` formatted output from current JSON
- Both update live when JSON changes
- Copy to clipboard button works
- Export button downloads `.md` file

### Workflow Pipeline Animation
- Workflow tab shows 5-6 pipeline steps
- During listen simulation (Phase 6): steps light up sequentially
  - Voice Capture → Intent Parsing → AISP Generation → Schema Validation (spinning) → Reality Render → Edge Deploy
- Timed to match listen typewriter (~2s per step)
- Steps show green check when complete

---

## Key Files

| File | Action |
|------|--------|
| `src/components/center-canvas/XAIDocsTab.tsx` | MODIFY — live spec generation |
| `src/components/center-canvas/WorkflowTab.tsx` | MODIFY — animated pipeline |
| `src/lib/generateSpec.ts` | CREATE — JSON → HUMAN spec transformer |
| `src/lib/generateAISP.ts` | CREATE — JSON → @aisp format transformer |

---

## What Phase 7 Does NOT Do

- Real AISP protocol validation (post-demo)
- Vercel deployment (Phase 8)
- Presentation walkthrough flow (Phase 8)
