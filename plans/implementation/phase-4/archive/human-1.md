The grounding is solid. The swarm has a clear picture of where the project stands. Let me give you the concise go instruction to paste into the new session.

---

**SWARM: Execute Phase 4 — Canned Demo Mode. This is the "wow factor" phase for the capstone.**

**The grounding is confirmed and accurate. Here are the priorities:**

**P0 — Example Websites (do first, unblocks everything else):**

Create 4 example website JSONs in `src/data/examples/`:

1. **sweet-spot-bakery.json** — Wellness theme, warm colors, food imagery (Unsplash bakery/pastry photos), sections: navbar, hero, features (3 specialties), testimonials (customer quotes), CTA ("Order Now"), footer. Friendly copy: "Handcrafted with love since 2019."

2. **launchpad-ai.json** — SaaS theme, dark mode, tech gradients, sections: navbar, hero, features (3 product features), pricing (3 tiers), FAQ, CTA ("Start Free Trial"), footer. Professional copy: "Ship AI products 10x faster."

3. **sarah-chen-photography.json** — Portfolio theme, full-bleed hero image, sections: navbar, hero (overlay layout), features (3 services), testimonials, CTA ("Book a Session"), footer. Artistic copy: "Moments worth remembering."

4. **greenleaf-consulting.json** — Professional theme, light mode, no hero image, sections: navbar, hero (minimal), value props (3 stats), testimonials, CTA ("Schedule a Consultation"), footer. Corporate copy: "Strategy that grows with you."

Add "Try an Example" section to onboarding page — 4 cards below the theme grid, each showing the example name + 1-line description. Click → `configStore.loadConfig(exampleJSON)` → navigate to `/builder`.

**P1 — Simulated Chat (do second):**

Wire the existing chat input in the left panel bottom bar. On Enter: show user message in a chat bubble, 500ms delay, show "Bradley" response bubble, apply the canned JSON patch. Implement these 6 commands:

- `dark` / `dark mode` → swap to dark palette
- `light` / `light mode` → swap to light palette  
- `add [section]` → enable that section type
- `remove [section]` → disable that section type
- `headline [text]` / `change headline to [text]` → update hero headline
- `theme [name]` / `use [name] theme` → applyVibe

Anything else → "I understood: '[input]'. Try: 'dark mode', 'add testimonials', or 'headline Your New Title'"

**P2 — Listen Simulation (do third — this is the demo centerpiece):**

Toggle LISTEN → dark overlay + red orb → "START LISTENING" → scripted 10-second sequence:
- Typewriter: "Listening..." → "Heard: bakery website with testimonials" → "Parsing..." → "Applying Wellness theme..." → "Building sections..."
- Load sweet-spot-bakery.json at second 9
- Auto-switch to BUILD mode at second 10
- Workflow tab animates in sync (if time)

**P3 — XAI Docs (if time):**

Wire XAI DOCS tab to generate specs from current `configStore.config`. HUMAN view: markdown listing sections + copy + layout. AISP view: `@aisp` formatted output. Both update when JSON changes.

**Quality gate:** The listen simulation must produce a "wow" reaction. If the timing feels off or the orb doesn't look theatrical, iterate before committing. Screenshot the full sequence.

**After Phase 4:** Phase 5 is home page + Vercel deploy. That's the final sprint.