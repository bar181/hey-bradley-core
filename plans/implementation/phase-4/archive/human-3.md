Great question. The left panel is trying to do three things at once: section navigation (builder), chat input, and listen toggle. Tabs would clean this up significantly. Let me think through the options.

**The answer: Yes, tabs on the left panel. But only 2 tabs, not 3.**

Here's why: Listen mode is a *state* of the entire app (the dark overlay takes over the screen), not a *panel* you navigate to. It should stay as a toggle in the TopBar, not become a tab. Chat and Builder are the two things that compete for left panel space.

**Proposed left panel redesign:**

```
┌─────────────────────────────────┐
│  [📋 Builder]  [💬 Chat]        │  ← 2 tabs at top of left panel
├─────────────────────────────────┤
│                                 │
│  (Tab content below)            │
│                                 │
└─────────────────────────────────┘
```

**Builder tab (default):**
```
┌─────────────────────────────────┐
│  [📋 Builder]  [💬 Chat]        │
├─────────────────────────────────┤
│  ✦ Theme                        │
│  ★ Hero              👁         │
│  ⊞ Features          👁         │
│  $ Pricing            👁         │
│  → Call to Action     👁         │
│  ♥ Testimonials       👁         │
│  ? FAQ                👁         │
│  ◆ Value Props        👁         │
│  ▪ Footer             👁         │
│  ┈ ┈ ┈ ┈ ┈ ┈ ┈ ┈ ┈ ┈ ┈ ┈ ┈ ┈ │
│  + Add Section                  │
└─────────────────────────────────┘
```

Clean. No chat input at the bottom eating space. No listen toggle competing. Just sections.

**Chat tab:**
```
┌─────────────────────────────────┐
│  [📋 Builder]  [💬 Chat]        │
├─────────────────────────────────┤
│                                 │
│  Bradley: Welcome! Try typing   │
│  "dark mode" or "add pricing"   │
│                                 │
│  You: make it dark              │
│  Bradley: Switching to dark     │
│  mode... ✓                      │
│                                 │
│  You: add testimonials          │
│  Bradley: Adding testimonials   │
│  section... ✓                   │
│                                 │
│  (scrollable message history)   │
│                                 │
├─────────────────────────────────┤
│  Try: "dark mode" · "headline"  │  ← Hint text (when input empty)
│ 🎤 Tell Bradley what to build…│  ← Input pinned at bottom
└─────────────────────────────────┘
```

The chat gets the full panel height for message history. The input stays pinned at the bottom. The hint text shows available commands.

**Where does Listen go?**

Listen stays in the TopBar as the `[LISTEN | BUILD]` toggle — exactly where it is now. When you toggle to LISTEN, the dark overlay covers the entire builder (left, center, right panels). It's not a "tab" you switch to — it's a mode that transforms the whole screen. This is already how it works.

**Where does History go?**

The TopBar already has a clock icon placeholder (from Phase 1). History (prompt history, change log) goes there as a future dropdown or slide-over panel. Not in the left panel tabs — it's a reference tool, not a primary workflow.

**Summary of the change:**

| Element | Current Location | New Location |
|---------|-----------------|-------------|
| Section list | Left panel (main area) | Left panel → Builder tab |
| Chat input | Left panel (pinned bottom) | Left panel → Chat tab (full panel) |
| Listen toggle | Left panel (pinned bottom) | TopBar only (already there) |
| Chat history | Doesn't exist | Left panel → Chat tab (scrollable) |
| Prompt history | TopBar clock icon (placeholder) | TopBar clock icon (future) |

**This is a clean separation:** Builder tab = see and navigate your sections. Chat tab = talk to Bradley. Listen = TopBar toggle that takes over the screen. History = TopBar dropdown (future).

**SWARM: Add 2 tabs to the top of the left panel: Builder and Chat. Move section list to Builder tab, move chat input + message history to Chat tab. Remove chat input and listen toggle from the bottom pinned area. Listen toggle stays in TopBar only. This is a ~1 hour structural change. Do it before continuing with the remaining Phase 5 checklist items.**