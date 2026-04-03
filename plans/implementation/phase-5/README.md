# Phase 5: Chat Intelligence + Listen Integration

**North Star:** The chat becomes smart enough to feel real, listen mode feeds into the builder, and users can browse their conversation history — completing the "talk to Bradley, watch it build" loop.

**Status:** IN PROGRESS
**Prerequisite:** Phase 4 COMPLETE (splash page, theme picker, listen mode orb, light mode polish, ModeToggle cleanup)

---

## Phase 5 Goal

Upgrade the simulated chat from basic keyword matching to keyword detection with canned JSON patches that feel intelligent, add persistent chat history in a scrollable panel, and wire listen mode output into the builder so spoken words produce visible site changes.

---

## Deliverables

1. **Simulated Chat v2 — keyword detection with canned JSON patches**
   - Expand beyond 7 commands to 15+ recognized patterns
   - Multi-word intent detection: "make the background blue", "change colors to ocean theme"
   - Compound commands: "add testimonials and make it dark"
   - Contextual responses that reference what changed: "Done — switched to dark mode and your hero section updated"
   - Typing indicator with personality (not just "Processing...")

2. **Chat history panel**
   - Scrollable conversation history in the Chat tab
   - Persist messages across tab switches (Builder/Chat/Listen)
   - Clear history button
   - Session-scoped storage (survives page navigation within session)
   - Visual timestamp grouping (e.g., "just now", "earlier")

3. **Listen mode → Builder integration**
   - Wire the listen tab's simulated transcript output into the canned chat command parser
   - When listen mode "hears" a recognized command, apply the JSON patch to the builder
   - Visual feedback: orb pulses on recognition, transcript shows "Applying: [command]..."
   - Fallback: unrecognized speech shows in transcript but does not modify the builder

4. **Chat/Listen unified command layer**
   - Extract command parsing into a shared service used by both Chat and Listen
   - Single source of truth for recognized commands and their JSON patches
   - Consistent response messages regardless of input source (typed vs spoken)

---

## Key Files

| File | Action |
|------|--------|
| `src/lib/cannedChat.ts` | MODIFY — expand keyword detection, add compound commands |
| `src/lib/commandParser.ts` | CREATE — shared command parsing service |
| `src/components/shell/ChatInput.tsx` | MODIFY — chat history panel, timestamps, clear button |
| `src/components/left-panel/ListenTab.tsx` | MODIFY — wire transcript to command parser |
| `src/store/chatStore.ts` | CREATE — persistent chat history state |

---

## What Phase 5 Does NOT Do

- Real LLM integration (Phase 9+)
- XAI Docs or workflow pipeline (Phase 7)
- Deploy to Vercel (Phase 8)
- Authentication or database (Phase 9+)
