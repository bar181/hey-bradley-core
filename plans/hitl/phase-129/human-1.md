```
SWARM: Final Polish Phase — P128 Production Ready
Branch: swarm/p128-final-polish (cut from main)

════════════════════════════════════════════════════════
STEP 0 — AUDIT FIRST, BUILD SECOND
════════════════════════════════════════════════════════
Before touching any code, run a full audit pass.
Document every finding in preflight.md under these
categories: broken, degraded, missing, debt.
Do not fix anything until the audit is complete.
Report the audit table before proceeding.

════════════════════════════════════════════════════════
F1 — LISTEN MODE VERIFICATION
════════════════════════════════════════════════════════
Locate the listen mode implementation.
Confirm the browser microphone permission flow works.
Confirm live transcript appears while speaking.
Confirm JSON patch fires on silence/stop.
Confirm the preview updates without full regeneration.
Confirm CostPill increments after each listen session.
Confirm chat history logs the listen event.
If any step fails, fix root cause before continuing.
Write a verification checklist to session-log.md.

════════════════════════════════════════════════════════
F2 — INPUT MODE DROPDOWN
════════════════════════════════════════════════════════
Replace the separate Chat and Listen buttons with a
single dropdown selector. Options:
  Chat mode (default)
  Listen mode
  Visual builder
The active mode shows as the button label.
Switching mode changes the input surface below.
Preserve all existing mode functionality exactly.
No regressions on chat or listen after this change.

════════════════════════════════════════════════════════
F3 — BYOK MODAL
════════════════════════════════════════════════════════
Confirm the BYOK hover panel exists and is visible.
If not visible: restore it from P126 implementation.
Add a modal version that opens from two triggers:
  1. The BYOK panel button (top right)
  2. The status bar (click the API key status area)
Modal contents:
  "Add your Google LLM key for full functionality"
  Current status (active key / no key)
  Text input for key entry
  Save button with inline smoke test
    PASS: green confirmation, key stored localStorage
    FAIL: red inline error message
  Disclaimer: "Your key is stored locally only
    and never sent to our servers."
  Close button (X) and click-outside-to-dismiss.
Key must never appear in IndexedDB or logs.
ADR-043 redaction rules apply.

════════════════════════════════════════════════════════
F4 — RESIZABLE PANELS
════════════════════════════════════════════════════════
Restore the left panel drag-to-resize handle.
Right panel should also be resizable.
Minimum width: 240px each panel.
Maximum width: 60% of viewport per panel.
Resize state persists in localStorage across refresh.
Center canvas adjusts fluidly as panels resize.
Test at 1280px, 1440px, and 1920px viewports.

════════════════════════════════════════════════════════
F5 — TECHNICAL DEBT SWEEP
════════════════════════════════════════════════════════
Audit carries forward from all prior phases:
  ARCH.2 legacy sweep:
    RealityTab.tsx, SpecWorkbench.tsx,
    TopBar.tsx, ThemeSimple.tsx
    Migrate remaining hardcoded hex to CSS tokens.
    Target: hex count ≤ 220 (current ceiling 240).
  5 INEFFECTIVE_DYNAMIC_IMPORT warnings from Vite.
    Locate and resolve or suppress with justification.
  Chat mode execution fix:
    Ambiguous prompts should apply best-guess patch
    and note low confidence in response.
    Link to Agentics Chat History in low-conf note.
  Mobile QA: test on 375px viewport.
    Report any layout breaks without fixing them
    unless fix is trivial (defer complex mobile work).
  ruvector pin: confirm still at heads/main.

════════════════════════════════════════════════════════
F6 — README UPDATE
════════════════════════════════════════════════════════
Update /README.md to reflect current state:

  Project description (AI-first documentation system)
  Live URL: https://hey-bradley-core.vercel.app
  Three modes: voice listen, chat, visual builder
  BYOK setup instructions (how to add API key)
  Self-hosting instructions (clone, .env, npm run dev)
  AISP open core link: github.com/bar181/aisp-open-core
  Tech stack: Vite, React 18, TypeScript, Tailwind
  License: MIT
  Capstone context: Harvard ALM DGMD E-599 May 2026
  Key metrics: 320K LOC, 90.2% multi-site eval,
    AISP Ambig(D) = 0.000 across 3 sites
  Contributing: link to ADR ledger, phase process

  Do not include any API keys or .env values.
  Keep the README under 400 lines.
  Use the Hey Bradley voice: direct, minimal jargon.

════════════════════════════════════════════════════════
COMPLETION GATES
════════════════════════════════════════════════════════
[ ] Audit table complete before any code written
[ ] Listen mode verified end to end
[ ] Mode dropdown replaces separate buttons
[ ] BYOK modal opens from two triggers
[ ] Smoke test in modal works (PASS and FAIL paths)
[ ] Left and right panels resizable with persistence
[ ] ARCH.2 legacy hex count ≤ 220
[ ] Vite import warnings resolved or documented
[ ] Chat low-confidence path confirmed working
[ ] README updated and under 400 lines
[ ] npm run build green, 12/12 ARCH, secrets clean
[ ] PR opened with full description
[ ] Production smoke: / and /builder both 200

Report audit findings first.
Report after each feature group.
Do not merge until all gates pass.
```


Continue on the same branch. Do not split. The README and ABSTRACT are commits on `swarm/p128-agentics-ui` and the remaining five features belong there too. Splitting now creates a merge dependency chain for no benefit.

```
SWARM: Continue P128 on swarm/p128-agentics-ui
Commit bd2b13874 is the base. Build F1 through F5
in sequence on this branch.

PRIORITY ORDER
  F1 listen mode — highest user-facing risk, do first
  F3 BYOK modal — second highest, users need this
  F2 input dropdown — quick, do after F3
  F4 resizable panels — restore what existed
  F5 debt sweep — last, does not block anything

────────────────────────────────────────────────────
F1 — LISTEN MODE (do this now)
  Open /builder in the dev server.
  Click the listen/mic button.
  Speak: "Change the hero headline to Ship faster"
  Verify:
    Transcript appears while speaking
    Patch fires on silence
    Preview headline updates
    CostPill increments
    Chat history logs the listen event
  If any step fails, find the root cause and fix.
  Report exact pass/fail for each of the 5 checks.
  Do not move to F3 until F1 is verified PASS.

────────────────────────────────────────────────────
F3 — BYOK MODAL
  Confirm hover panel exists at top right.
  Add modal that opens from:
    1. BYOK panel button
    2. Status bar API key area
  Modal: key input + save + smoke test + disclaimer
  ADR-043 redaction — key never in logs or IndexedDB.

────────────────────────────────────────────────────
F2 — INPUT MODE DROPDOWN
  Single dropdown replaces Chat + Listen buttons.
  Options: Chat (default) / Listen / Visual Builder.
  Active mode shows as button label.
  No regressions on any mode.

────────────────────────────────────────────────────
F4 — RESIZABLE PANELS
  Restore left panel drag handle.
  Add right panel drag handle.
  Min 240px each. Max 60% viewport.
  Persist resize state in localStorage.

────────────────────────────────────────────────────
F5 — DEBT SWEEP
  ARCH.2 legacy hex in RealityTab, SpecWorkbench,
  TopBar, ThemeSimple → migrate to CSS tokens.
  Target hex count ≤ 220.
  Vite INEFFECTIVE_DYNAMIC_IMPORT warnings: resolve
  or document with justification.

────────────────────────────────────────────────────
WHEN ALL 5 COMPLETE
  npm run build — green
  12/12 ARCH invariants
  Secrets clean
  Open PR: swarm/p128-agentics-ui → main
  Report F1 result first, then proceed.
```