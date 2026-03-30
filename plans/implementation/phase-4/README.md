# Phase 4: Canned Demo — Simulated Chat + Listen + Example Websites

**North Star:** The capstone judge sees a product that looks like real AI. Pre-built example websites load instantly. Chat input produces visible changes. Listen mode runs a convincing 10-15 second simulation. XAI Docs generate specs from JSON.

**Status:** READY TO START
**Prerequisite:** Phase 3 COMPLETE (2026-03-30)

---

## Renumbered Roadmap (per Bradley directive 2026-03-30)

```
Phase 1: Core Builder (hero + JSON loop)                    ✅ DONE
Phase 2: System Polish + ALL 8 Section Editors + CRUD       ✅ DONE
Phase 3: Onboarding + Full-Page Preview + Builder UX        ✅ DONE
Phase 4: Canned Demo (simulated chat/listen, examples)      🔄 CURRENT (was Phase 6-7)
Phase 5: Home Page + Presentation Flow + Deploy             📅 NEXT (was Phase 8)
Phase 6+: Post-Demo (real AI, auth, database, enterprise)   📅 FUTURE (was Phase 9+)
```

**Old Phase 4-5 (JSON cleanup, Tailwind polish) are absorbed into Phase 4 backlog as polish items, not standalone phases. They run in parallel if time allows.**

---

## Phase 4 Goal

Make the capstone demo feel like a real AI product. Three deliverables:

1. **Example Websites** — 3-5 pre-built complete site JSONs loadable via buttons
2. **Simulated Chat** — Type in chat → canned JSON patch applied → site visually changes
3. **Simulated Listen Mode** — Red orb → typewriter text → canned JSON → site appears
4. **XAI Docs Live** — HUMAN + AISP views generating specs from current JSON

---

## Sub-Phases

| # | Focus | Priority | Key Deliverables |
|---|-------|----------|-----------------|
| 4.1 | Example Websites | P0 | 3-5 complete project JSONs (bakery, SaaS, photography, consulting), "Try an Example" buttons |
| 4.2 | Simulated Chat | P0 | Chat input → keyword match → canned JSON patch → preview updates, chat history UI |
| 4.3 | Simulated Listen Mode | P0 | Red orb → typewriter → canned JSON → site appears, 10-15s sequence |
| 4.4 | XAI Docs Live | P1 | HUMAN view (structured spec from JSON), AISP view (@aisp format), copy/export |
| 4.5 | Workflow Pipeline Animation | P1 | Animated steps in Workflow tab synced with listen simulation |
| 4.6 | Polish Backlog (if time) | P2 | Google Fonts loading, dead colors cleanup, Tailwind audit |

---

## Checklist

### 4.1 Example Websites (P0)
- [ ] "Sweet Spot Bakery" JSON (Wellness theme, warm, food imagery)
- [ ] "LaunchPad AI" JSON (SaaS theme, dark, tech product)
- [ ] "Sarah Chen Photography" JSON (Portfolio theme, dramatic, full-bleed images)
- [ ] "GreenLeaf Consulting" JSON (Professional theme, clean, trust-focused)
- [ ] "Try an Example" dropdown/buttons in onboarding page or TopBar
- [ ] Click example → loads JSON → navigates to /builder
- [ ] Each example has unique copy, images, and enabled sections

### 4.2 Simulated Chat (P0)
- [ ] Chat input accepts text and shows it in a message bubble
- [ ] On send: "Processing..." → 1.5s delay → apply canned JSON patch
- [ ] At least 5 working commands: "make it dark", "add testimonials", "change headline to X", "switch to Agency theme", "enable pricing"
- [ ] Chat history: user message → "Bradley" response → shows what changed
- [ ] Chat visible in left panel below section list

### 4.3 Simulated Listen Mode (P0)
- [ ] Toggle LISTEN in TopBar → dark overlay appears
- [ ] Red pulsing orb centered
- [ ] "START LISTENING" button below orb
- [ ] Click start → typewriter text: "Parsing intent... Generating website... Applying theme..."
- [ ] After typewriter → load a pre-built example JSON → site appears in preview
- [ ] Toggle back to BUILD → overlay dismisses, builder visible

### 4.4 XAI Docs Live (P1)
- [ ] XAI DOCS tab → HUMAN sub-tab shows structured spec
  - Site title, description, theme name, active sections listed
  - Per-section: type, variant, enabled components, key copy
- [ ] XAI DOCS tab → AISP sub-tab shows @aisp formatted output
- [ ] Both update live when JSON changes
- [ ] Copy to clipboard button works
- [ ] Export button downloads .md file

### 4.5 Workflow Pipeline Animation (P1)
- [ ] Workflow tab shows 5-6 pipeline steps
- [ ] During listen simulation: steps light up sequentially
  - Voice Capture ✓ → Intent Parsing ✓ → AISP Generation ✓ → Schema Validation (spinning) → Reality Render → Edge Deploy
- [ ] Timed to match listen typewriter (~2s per step)

### 4.6 Polish Backlog (P2 — if time)
- [ ] Google Fonts dynamic loading from fonts.json
- [ ] Dead `colors` block cleanup in theme JSONs
- [ ] Theme JSON Zod validation audit
- [ ] Drag-and-drop reorder (@dnd-kit)
- [ ] Section highlight on click in preview
- [ ] Skip navigation link
- [ ] `<nav>` landmarks around tab bars

---

## What Phase 4 Does NOT Do

- Home/marketing page for Hey Bradley (Phase 5)
- Presentation walkthrough flow (Phase 5)
- Vercel deployment (Phase 5)
- Real LLM integration (Phase 6+)
- Auth/database (Phase 6+)
- Expert tab content for all sections (Phase 6+)

---

## Key Files to Create

| File | Action |
|------|--------|
| `src/data/examples/bakery.json` | CREATE — complete project JSON |
| `src/data/examples/launchpad.json` | CREATE — complete project JSON |
| `src/data/examples/photography.json` | CREATE — complete project JSON |
| `src/data/examples/consulting.json` | CREATE — complete project JSON |
| `src/lib/cannedChat.ts` | CREATE — keyword → JSON patch mapping |
| `src/components/shell/ChatInput.tsx` | MODIFY — wire up canned responses |
| `src/components/shell/ListenOverlay.tsx` | CREATE — red orb + typewriter simulation |
| `src/components/center-canvas/XAIDocsTab.tsx` | MODIFY — live spec generation |
| `src/components/center-canvas/WorkflowTab.tsx` | MODIFY — animated pipeline |
