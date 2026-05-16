```
SWARM: Phase 126 — Go Live
Branch: swarm/p126-go-live (cut from main)

════════════════════════════════════════════
PROCESS: understand → research → plan → ADR
→ decompose → TDD → implement → verify → optimize
════════════════════════════════════════════

STEP 0 — Branch + preflight
  git checkout main && git pull origin main
  git checkout -b swarm/p126-go-live
  Create plans/hitl/phase-126-go-live/preflight.md
  Create plans/hitl/phase-126-go-live/session-log.md
  Create plans/hitl/phase-126-go-live/retrospective.md
    (scaffold only, fill at end)

  Phase audit — for each phase 121-125:
    Confirm preflight.md, session-log.md,
    retrospective.md exist.
    Move non-phase-level files to
    plans/hitl/phase-{N}/archive/
    Document any missing files as TODO
    in phase-126-go-live/preflight.md.

════════════════════════════════════════════
FEATURE 1 — Default template → Hey Bradley
════════════════════════════════════════════
  Change the default template from SaaS to
  Hey Bradley branded site (dark, crimson,
  "Describe it. See it." hero).
  Reference: P122 Hey Bradley template spec.
  File: wherever defaultTemplate is defined
  in src/lib/ or src/contexts/.

════════════════════════════════════════════
FEATURE 2 — BYOK hover box (top right)
════════════════════════════════════════════
  New component: src/components/shell/BYOKPanel.tsx
  Position: top-right, always visible, hover to expand.

  Collapsed state:
    Icon + "Add API Key"

  Expanded state:
    "Add your Google LLM key for full functionality"
    "Current setting: default (limited access)"
    <text input placeholder="AIzaSy...">
    <Save button>
      On save: run smoke test (ping Gemini with
      the key, 1-token call).
      If valid: store in localStorage only,
      show green "Key active".
      If invalid: show red error message inline.
    Disclaimer (small text):
      "Your key is stored locally only and
      never sent to our servers."
  ADR: document localStorage-only key storage,
  no server transmission, redaction rules apply.

════════════════════════════════════════════
FEATURE 3 — Chat history in Agentics panel
════════════════════════════════════════════
  New tab "Chat History" in Agentics main panel.
  Log every event: user prompt, LLM call sent,
  LLM response received, patch applied, error.
  Storage: React state + localStorage sync.
  Key: "hey-bradley-session-log"
  Display: reverse chronological, type badges,
  expandable entries, Export JSON button,
  Clear button.

════════════════════════════════════════════
FEATURE 4 — Agentics specs card (on-demand)
════════════════════════════════════════════
  In Agentics main panel, add "Specifications" card.
  Live sections (no LLM, always current):
    JSON, Chat History, site structure.
  On-demand sections (require LLM call):
    North Star, AISP Spec, Build Plan,
    Architecture, Features, Full Specs.
  Show as checklist with status indicators.
  Prominent button: "Create Specifications"
    Triggers each spec in sequence, checks
    each item as it completes.
  Individual refresh buttons per spec section.

════════════════════════════════════════════
FEATURE 5 — Low confidence LLM responses
════════════════════════════════════════════
  In geminiAdapter.ts and listen mode handler:
  If confidence < threshold or intent unclear,
  apply best-guess patch AND append to response:
    Casual tone examples:
    "I had to guess on that one..."
    "Not really sure but here's my best take..."
    "Low confidence — check the details."
  After the note, include a link that opens
  Agentics panel → Chat History tab.
  Apply to both chat mode and listen mode.

════════════════════════════════════════════
FEATURE 6 — Live prompt test
════════════════════════════════════════════
  After all features implemented, run:
  Prompt: "Update the hero section"
  Verify: patch applies, chat history logs it,
  confidence note appears if ambiguous,
  Agentics panel updates correctly.

════════════════════════════════════════════
COMPLETION GATES
════════════════════════════════════════════
  [ ] Default template is Hey Bradley
  [ ] BYOK panel works with smoke test
  [ ] Chat history logs all event types
  [ ] Specs card shows checklist + button
  [ ] Low confidence responses with link
  [ ] Live prompt test passes
  [ ] npm run build — zero errors
  [ ] Phase audit table in preflight.md
  [ ] session-log.md updated throughout
  [ ] retrospective.md completed at end

Report after each feature completes.
Do not bundle — report incrementally.
```