# P128 — Next Session Grounding

> **Read this first at session start. Do not re-read prior phases.**

## Branch

`swarm/p128-agentics-ui` — DO NOT cut a new branch.
Last known good commit: **`249f1d14a`**.

## Completed this session

- **F1 — Listen mode review card removed.** Patches now fire immediately on silence/stop. Low-confidence path uses the P126 F5 persona-message + Chat-History deep-link pattern. 28/28 tests pass. Build green (792.42 KB gzip). ARCH 12/12. Commit `249f1d14a`.
- **F6 — README (396 lines) + ABSTRACT.md committed.** Capstone-focused first half, getting-started second half. Commit `bd2b13874`.
- **Step-3 template quality lift (separate earlier work).** All 6 non-AISP spec templates ≥80/100 on brutal-honest review (composite 84.7). Commit `521f88d69`.

## Remaining features — priority order

### F3 — BYOK modal (START HERE)

Modal opens from **two triggers**:
1. The BYOK hover panel button (top right). Existing component: `src/components/shell/BYOKPanel.tsx`.
2. The status bar API key area. Existing component: `src/components/shell/StatusBar.tsx`.

Modal contents:
- Header: "Add your Google LLM key for full functionality"
- Current status line: `Active key` (green dot) or `No key — using fallback adapter` (yellow dot)
- Text input for key entry (one-line, monospace)
- Save button → runs **inline smoke test** (1-token Gemini `generateContent` ping with `maxOutputTokens: 4`)
  - PASS → green confirmation `Key active`; key stored to `localStorage` only
  - FAIL → red inline error showing classified failure (`invalid_api_key` / `quota_exhausted` / `network`)
- Disclaimer (small text): "Your key is stored locally only and never sent to our servers."
- Close button (X in top-right of modal) + click-outside-to-dismiss
- ESC key dismisses

**Trust boundary (ADR-043 + ADR-153):**
- Key NEVER appears in IndexedDB, log_events, edit_history, migrations, or any export.
- Apply `redactKeyShapes` at every persistence boundary.
- Verify with grep: `grep -rn "api_key\|apikey\|byok_key" src/contexts/persistence/migrations/`.

Files to read at start:
- `src/components/shell/BYOKPanel.tsx` (P126 F2a — existing hover panel; reuse logic where possible)
- `src/contexts/intelligence/llm/geminiAdapter.ts` (`testConnection()` already does a 4-token ping — wire to that)
- `src/contexts/intelligence/llm/keys.ts` (BYOK storage helpers + `redactKeyShapes`)
- `docs/adr/ADR-043-key-redaction.md`
- `docs/adr/ADR-153-byok-localStorage-only.md`

### F2 — Input mode dropdown (after F3)

Replace separate Chat + Listen buttons in the left panel with a single dropdown.

Options:
- **Chat** (default)
- **Listen**
- **Visual Builder**

Active mode shows as the button label. Switching mode changes the input surface below. Preserve all existing mode functionality exactly. No regressions on chat or listen after this change.

Files: `src/components/left-panel/LeftPanel.tsx` (currently has `TABS` array at line ~22 with `chat`/`listen`/`builder` — convert to a `<select>` or shadcn `Select`).

### F4 — Resizable panels (after F2)

Restore left panel drag-to-resize handle. Add right panel drag handle. Min 240 px each. Max 60% of viewport per panel. Persist resize state in `localStorage` across refresh. Center canvas adjusts fluidly. Test at 1280 / 1440 / 1920 px.

Files: `src/components/shell/AppShell.tsx` (or wherever the three-pane grid lives).

### F5 — Tech-debt sweep (last)

- **ARCH.2 legacy hex** — migrate hardcoded hex in `RealityTab.tsx`, `SpecWorkbench.tsx`, `TopBar.tsx`, `ThemeSimple.tsx` → CSS tokens. Target: hex count ≤ 220 (current ceiling 240).
- **Vite `INEFFECTIVE_DYNAMIC_IMPORT` warnings (5 of them)** — resolve or document with justification. Top offenders include `personalityEngine.ts`, `aisp/index.ts`, `templates/index.ts`. Either drop the dynamic import or drop the static import from the side that's preventing the chunk split.
- **ruvector pin** — confirm `git submodule status upstreams/ruvector` still at `heads/main`.

## Completion gates for P128

- [ ] F3 BYOK modal — two triggers, smoke test PASS+FAIL paths verified, modal dismisses ESC + click-outside
- [ ] F2 mode dropdown — no regressions on chat, listen, or builder
- [ ] F4 panels resizable with localStorage persistence
- [ ] F5 hex count ≤ 220; Vite warnings resolved
- [ ] `npm run build` green, 12/12 ARCH, secrets clean
- [ ] PR `swarm/p128-agentics-ui` → `main` merged
- [ ] Production smoke: `curl -I https://hey-bradley-core.vercel.app/` and `/builder` both return 200

## Key files to read at session start

1. `plans/hitl/phase-128-agentics-ui/preflight.md` — full feature roster + DoD
2. `plans/hitl/phase-128-agentics-ui/session-log.md` — what shipped this session
3. `plans/hitl/phase-128-agentics-ui/next-session-grounding.md` — this file
4. `src/components/shell/BYOKPanel.tsx` — F3 starting point
5. `src/contexts/intelligence/llm/geminiAdapter.ts` — smoke-test path
6. `docs/adr/ADR-043-key-redaction.md` — trust boundary
7. `docs/adr/ADR-153-byok-localStorage-only.md` — BYOK pattern

## Do NOT do at session start

- Do NOT cut a new branch — continue on `swarm/p128-agentics-ui`
- Do NOT re-read all prior phases
- Do NOT restart F1 — it is COMPLETE
- Do NOT restart F6 — it is COMPLETE
- Do NOT skip ADR-043 / ADR-153 redaction guards when wiring F3

## Start directly with

F3 BYOK modal. The hover panel exists — extend it with a modal version that opens from two triggers (BYOK panel button + status bar API key area).
