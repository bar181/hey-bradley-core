Phase 4 closed at 84% with 23/23 Playwright tests. Strong. The checklist for Phase 5 is clear — 17 acceptance criteria, zero P0 failures to pass. Here's the swarm instruction:

---

**SWARM: Execute Phase 5 — Simulated Chat. The checklist at `phase-5/living-checklist.md` is the authority. Zero P0 failures to close.**

**This is a focused phase — one feature: the chat input produces visible site changes via canned commands.**

**Step 1: Build `src/lib/cannedChat.ts` — the command parser.**

```typescript
// Input: user text string
// Output: { response: string, patch: Partial<MasterConfig> | null, action: string | null }

// Keyword matching rules:
// "dark" or "dark mode"     → { response: "Switching to dark mode...", action: "toggleMode:dark" }
// "light" or "light mode"   → { response: "Switching to light mode...", action: "toggleMode:light" }
// "add [section]"           → { response: "Adding [section]...", action: "addSection:type" }
// "remove [section]"        → { response: "Removing [section]...", action: "removeSection:type" }
// "headline [text]"         → { response: "Updated headline...", patch: hero headline text }
// "theme [name]"            → { response: "Applying [name] theme...", action: "applyVibe:name" }
// anything else             → { response: "I understood: '[input]'. Try: 'dark mode', 'add testimonials', or 'headline Your New Title'", patch: null }
```

Use simple `includes()` or regex matching — don't over-engineer. The section name matching should be fuzzy: "add testimonials", "add testimonial", "add Testimonials" all work. Theme name matching should accept "agency", "Agency", "saas", "SaaS", etc.

**Step 2: Wire into `ChatInput.tsx`.**

The chat input already exists in the left panel bottom bar. On Enter:
1. Add user message to a `chatMessages` array in state (or a new `chatStore`)
2. Show "Processing..." indicator (P1 — a subtle animation or text)
3. After 500ms delay: call `cannedChat(input)` → get response + action/patch
4. Execute the action (call configStore methods) or apply the patch
5. Add "Bradley" response message to chat history
6. Clear the input field

**Step 3: Build chat message UI.**

Below the chat input (or in a scrollable area above it in the left panel), show message history:

```
┌─────────────────────────────────┐
│ You: make it dark               │  ← Right-aligned or distinct bg
│ Bradley: Switching to dark      │  ← Left-aligned or accent bg
│ mode...                         │
│                                 │
│ You: add testimonials           │
│ Bradley: Adding testimonials    │
│ section...                      │
│                                 │
│ You: headline Hello World       │
│ Bradley: Updated headline...    │
├─────────────────────────────────┤
│ 🎤 Tell Bradley what to build… │  ← Input stays at bottom
└─────────────────────────────────┘
```

User messages and Bradley messages must be **visually distinct** (different background color, alignment, or label). Keep it minimal — no avatars, no timestamps. Just bubbles with text.

Chat history is scrollable, shows last 10 messages. Newest at bottom.

**Step 4: Test all 7 commands.**

Manually verify each command produces the expected visible change:
- K1: "dark" → preview switches to dark palette ✓
- K2: "light" → preview switches to light palette ✓
- K3: "add testimonials" → testimonials section appears in preview ✓
- K4: "remove pricing" → pricing section disappears from preview ✓
- K5: "headline Build Something Amazing" → hero headline updates ✓
- K6: "theme agency" → entire theme changes (layout, components, palette) ✓
- K7: "make me a sandwich" → helpful fallback message, no crash ✓

**Step 5: Run Playwright.**

Add at least 3 chat-specific tests:
- Send "dark" → verify palette change
- Send "headline Test" → verify hero text updates
- Send gibberish → verify fallback message appears, no errors

Run full suite — all existing 23 tests must still pass plus the new ones.

**After Phase 5:** Commit, update checklist with pass/fail, write brief log entry. Then proceed to Phase 6 (Listen Simulation) or Phase 7 (Home Page + Deploy) based on time assessment. The listen simulation is the higher-impact demo moment but the home page + deploy is the final deliverable. You decide the order after Phase 5 closes.