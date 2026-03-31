# Phase 5: Simulated Chat

**North Star:** User types in the chat input, a simulated "Bradley" AI responds, and the website preview visually changes — making it look like real AI is editing the site.

**Status:** WAITING (after Phase 4)
**Prerequisite:** Phase 4 COMPLETE (example websites exist)

---

## Phase 5 Goal

Wire the existing chat input in the left panel bottom bar to accept text, show conversation bubbles, and apply canned JSON patches that produce visible changes in the preview.

---

## Deliverables

1. **Chat input wired** — On Enter: show user message in chat bubble, 500ms delay, show "Bradley" response bubble, apply canned JSON patch.
2. **6+ canned commands:**
   - `dark` / `dark mode` → swap to dark palette
   - `light` / `light mode` → swap to light palette
   - `add [section]` → enable that section type
   - `remove [section]` → disable that section type
   - `headline [text]` / `change headline to [text]` → update hero headline
   - `theme [name]` / `use [name] theme` → applyVibe
3. **Fallback response** — Anything unrecognized: "I understood: '[input]'. Try: 'dark mode', 'add testimonials', or 'headline Your New Title'"
4. **Chat history** — Messages appear in scrollable chat-like UI below the input. Shows user → Bradley flow.
5. **Chat visible in left panel** — Below section list, above bottom bar.

---

## Key Files

| File | Action |
|------|--------|
| `src/lib/cannedChat.ts` | CREATE — keyword → JSON patch mapping |
| `src/components/shell/ChatInput.tsx` | MODIFY — wire up canned responses |
| `src/components/shell/LeftPanel.tsx` | MODIFY — add chat history area |

---

## What Phase 5 Does NOT Do

- Real LLM integration (Phase 9+)
- Listen mode simulation (Phase 6)
- Home/splash page (Phase 6)
- XAI Docs (Phase 7)
