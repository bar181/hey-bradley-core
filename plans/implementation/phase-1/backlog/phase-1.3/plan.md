# Phase 1.3: Three Starter Themes — Plan

**Goal:** Create 3 visually distinct themes that prove theme selection cascades through JSON → preview. Each theme must feel like a completely different website.

**DoD (fixed):**
1. 3 theme presets selectable in SIMPLE tab → STYLE accordion
2. Each visually distinct (different colors, fonts, layouts, mood)
3. Theme selection updates site, theme, layout, hero styling
4. Copy stays fixed ("Build Websites by Just Talking")
5. Each theme has Unsplash/Pexels image URL
6. Data Tab JSON reflects changes
7. Reality Tab re-renders < 200ms
8. Playwright test passes for all 3 themes

## The Three Themes

| Theme | Mode | Layout | Font | Mood |
|-------|------|--------|------|------|
| Midnight Modern | dark | centered | Inter / Space Grotesk | Premium SaaS (Stripe/Linear) |
| Warm Sunrise | light | split (text left, image right) | DM Sans | Approachable (Notion/Basecamp) |
| Electric Gradient | dark | centered, gradient text | Plus Jakarta Sans | Bold startup (Arc/Raycast) |

## Copy (Same Across All Themes)
- Eyebrow: "Hey Bradley 2.0 is Live"
- Headline: "Build Websites by Just Talking"
- Subtitle: "Describe what you want, watch it appear in real-time, and get production-ready specs — all without writing a single line of code."
- Primary CTA: "Start Building"
- Secondary CTA: "See How It Works"
- Trust: "Loved by 200+ creators and developers"

## Scope
- SIMPLE mode only (Expert tab left as-is)
- No copy editing, no custom colors, no additional layouts beyond centered + split

## Agents
1. theme-agent: 3 theme JSON files + applyVibe + copy update
2. ui-agent: Theme cards in STYLE accordion + mini-preview + hero variant support
3. test-agent: Playwright test for theme cascade loop
