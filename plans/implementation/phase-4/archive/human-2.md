Looking at both screenshots — the light mode has serious visibility issues. The left panel buttons and section text are nearly invisible against the white/light background. The "Add Section" dashed button blends in. The top nav LISTEN/BUILD toggle is hard to parse. Let me give you focused swarm instructions.

**SWARM: Two fixes needed before continuing Phase 5. These are P0 — the builder is unusable in light mode.**

**Fix 1: Light Mode Visibility (P0)**

The builder chrome (left panel, right panel, top bar) needs proper contrast in light mode. Reference the Harvard brand palette: https://identityguide.hms.harvard.edu/brand-design/colors

Use these specific colors for the builder chrome:

| Element | Light Mode | Dark Mode |
|---------|-----------|-----------|
| Top bar background | Harvard Crimson `#A51C30` | Dark crimson `#6B1020` or `#1a1a2e` |
| Top bar text/icons | White `#FFFFFF` | White `#FFFFFF` |
| Left panel background | `#F7F5F2` (warm off-white) | `#1a1a2e` (current dark) |
| Left panel text | `#1E1E1E` (near black) | `#E8E4DF` (warm light) |
| Left panel selected row | Crimson `#A51C30` bg with white text | Current accent highlight |
| Left panel section icons | `#6B7280` (gray-600) | Current muted |
| Right panel background | `#FFFFFF` | `#1a1a2e` |
| Right panel labels | `#374151` (gray-700) | Current muted |
| Buttons (default) | `#A51C30` bg, white text | Crimson accent on dark |
| Buttons (secondary) | `#E8E4DF` bg, `#1E1E1E` text, 1px `#D1CBC3` border | Current dark secondary |
| "Add Section" dashed | `#D1CBC3` border, `#6B7280` text | Current |
| Toggle active (LISTEN/BUILD) | White text on crimson pill | Current |
| Toggle inactive | `#6B7280` text, transparent bg | Current |

**The key principle:** In light mode, the builder chrome uses warm off-white backgrounds with dark text and crimson accents. No white-on-white. No invisible buttons. Every interactive element must have sufficient contrast.

**Fix 2: Chat Keywords Visibility**

The chat commands work but there's no way for the user to discover what commands are available. Add a simple hint system:

When the chat input is empty and focused, show a small helper below it:

```
┌─────────────────────────────────────┐
│ 🎤 Tell Bradley what to build...  ➤ │
├─────────────────────────────────────┤
│ Try: "dark mode" · "add pricing"   │
│      "headline Hello" · "theme agency" │
└─────────────────────────────────────┘
```

This is just a `text-xs text-muted` hint div below the input. It appears when the input is empty/focused, hides when the user starts typing. No modal, no dialog — just inline hints.

**For the next iteration (later in Phase 5):** Create a `src/data/chat-commands.json` with all available commands, their keywords, descriptions, and categories. This enables: a `/help` command that lists all options, richer command matching (content changes, style changes, section-specific commands), and eventually the canned demo's more dramatic scripted sequences.

**Do these two fixes, then continue with the Phase 5 checklist.** The chat commands already work — these fixes make them discoverable and make the builder usable in both modes.