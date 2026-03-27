# Visual Design References — Hey Bradley

## Design Identity: "Warm Precision"
Scandinavian design studio crossed with a Bloomberg terminal.

## Component Reference Map

### Shell & Navigation

| Component | Primary Reference | Secondary Reference | What to Match |
|-----------|------------------|--------------------|--------------|
| **Top Bar** | [Linear](https://linear.app) | [Framer](https://framer.com) | Minimal toolbar, version badge, icon density without clutter |
| **Mode Toggles** | [Raycast](https://raycast.com) | iOS Segmented Controls | Monospace + pill shape, clear active/inactive states |
| **3-Panel Layout** | [VS Code](https://code.visualstudio.com) | [Cursor](https://cursor.sh) | Resizable panels, warm resize handles |
| **Status Bar** | [VS Code](https://code.visualstudio.com) | [Warp Terminal](https://warp.dev) | Monospace indicators, protocol version, latency |
| **Chat Input** | [ChatGPT](https://chat.openai.com) | [v0.dev](https://v0.dev) | Mic + text input + send, clean bottom bar |

### Left Panel

| Component | Primary Reference | What to Match |
|-----------|------------------|--------------|
| **Draft Panel (Vibe Cards)** | [Notion Templates](https://notion.so) | Card selection with subtle border highlight |
| **Draft Panel (Section List)** | [Framer Layers](https://framer.com) | Numbered items with drag handles |
| **Expert Panel (Properties)** | [Framer Properties](https://framer.com) | Enterprise-density, label-left value-right rows |
| **Expert Panel (Project Tree)** | [VS Code Explorer](https://code.visualstudio.com) | Collapsible tree with file/component icons |
| **Expert Panel (Accordions)** | [Figma Right Panel](https://figma.com) | LAYOUT/CONTENT/STYLE sections |

### Center Canvas

| Component | Primary Reference | What to Match |
|-----------|------------------|--------------|
| **Reality Preview** | [Webflow Canvas](https://webflow.com) | Click-to-select borders, section hover states |
| **Data Tab (JSON)** | [VS Code Editor](https://code.visualstudio.com) | Warm syntax highlighting, line numbers |
| **XAI Docs (Human)** | [Stripe Docs](https://stripe.com/docs) | Clean structured documentation, copy buttons |
| **XAI Docs (AISP)** | [GitHub Code View](https://github.com) | Syntax highlighted code, orange keywords |
| **Workflow Pipeline** | [Vercel Deploy](https://vercel.com) | Sequential steps with check/spinner/clock states |

### Right Panel

| Component | Primary Reference | What to Match |
|-----------|------------------|--------------|
| **Draft Context** | [Notion Properties](https://notion.so) | Simple headline + layout selector |
| **Expert Context** | [Figma Inspector](https://figma.com) | Full CSS properties, accordion sections |

### Listen Mode

| Component | Primary Reference | What to Match |
|-----------|------------------|--------------|
| **Red Orb** | [Apple Siri](https://apple.com/siri) | Ambient glow, breathing animation |
| **Red Orb** | [Humane AI Pin](https://humane.com) | Minimal AI interface, pulsing light |
| **Dark Overlay** | [Arc Browser Spaces](https://arc.net) | Smooth dark transition, theatrical feel |
| **Typewriter** | [Terminal/CLI](https://warp.dev) | Character-by-character, monospace, system voice |

### Section Templates

| Section | Primary Reference | What to Match |
|---------|------------------|--------------|
| **Hero** | [Linear.app](https://linear.app) | Bold heading, clean CTA, generous spacing |
| **Features Grid** | [Tailwind UI](https://tailwindui.com) | 3-col cards with icons, consistent card height |
| **Pricing** | [Stripe Pricing](https://stripe.com/pricing) | Clean tier comparison, highlighted recommended |
| **CTA Banner** | [Linear.app](https://linear.app) | Bold heading + single accent CTA |
| **Footer** | [Vercel](https://vercel.com) | Multi-column links, social icons, copyright |
| **Testimonials** | [Linear.app](https://linear.app) | Quote cards with avatar + role |
| **FAQ** | [Stripe Support](https://stripe.com) | Clean accordion, two-column layout |
| **Value Props** | [Vercel Features](https://vercel.com) | Icon + number + description cards |

## Color Palette Quick Reference

```
Builder Chrome (warm light):
  bg:       #faf8f5    surface:    #f5f0eb
  border:   #e8e0d8    accent:     #e8772e
  text:     #2d1f12    secondary:  #8a7a6d
  muted:    #b5a99d    accent-lt:  #fce8d8

Listen Mode (dark):
  bg:       #0a0a0f    orb:        #ef4444

Code/Data:
  key:      #e8772e    string:     #4a9d6e
  number:   #2d1f12    bracket:    #8a7a6d

Semantic:
  success:  #4a9d6e    warning:    #d4a12e
  error:    #c44a4a

Vibe Presets:
  warm:     #e8772e, #c44a3a, #d4a12e
  ocean:    #3b82f6, #6366f1, #2563eb
  forest:   #22c55e, #16a34a, #4ade80
```

## Typography Quick Reference

| Role | Font | Size | Weight | Transform |
|------|------|------|--------|-----------|
| Page heading | DM Sans | 18px | 600 | none |
| Section label | JetBrains Mono | 12px | 500 | UPPERCASE |
| Property label | JetBrains Mono | 11px | 400 | UPPERCASE |
| Property value | JetBrains Mono | 12px | 500 | none |
| Input text | DM Sans | 14px | 400 | none |
| Tab label | JetBrains Mono | 12px | 500 | UPPERCASE |
| Status bar | JetBrains Mono | 11px | 400 | UPPERCASE |
| JSON content | JetBrains Mono | 13px | 400 | none |
| AI typewriter | JetBrains Mono | 14px | 400 | none |
