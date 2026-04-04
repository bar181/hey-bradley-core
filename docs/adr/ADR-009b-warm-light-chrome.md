# ADR-009b: Warm Light Chrome (Supersedes ADR-009)

**Status:** Accepted
**Date:** 2026-03-27
**Deciders:** Bradley Ross

## Context

Earlier designs prescribed a dark slate theme. The final mockups revealed a warm cream/off-white builder chrome that creates approachability while maintaining engineering credibility through monospace typography.

## Decision

The builder UI uses a **warm light cream palette**. Only the Listen Mode overlay goes dark.

### Color System
```css
Builder chrome:         #faf8f5 (warm off-white)
Surface/cards:          #f5f0eb (slightly darker warm)
Borders:                #e8e0d8 (warm beige)
Selected section:       #e8772e dashed border (orange)
Accent (active tabs):   #e8772e (warm orange)
Text primary:           #2d1f12 (warm dark brown)
Text secondary:         #8a7a6d (warm muted brown)
Monospace labels:       Uppercase, tracking-wide, monospace

Listen mode overlay:    #0a0a0f (near-black)
Listen mode orb:        #ef4444 → radial gradient blur
```

### Typography
- **UI font**: DM Sans (warmer than Inter, less overused)
- **Mono font**: JetBrains Mono (engineering credibility)
- **All structural labels**: monospace + uppercase
- **All user-editable content**: DM Sans
- **All code/data**: monospace

## Consequences

**Positive:**
- Warm = approachable (grandma persona)
- Monospace labels = engineering credibility (Framer/enterprise persona)
- Listen mode dark contrast creates the "theatrical moment"
- Orange accent is distinctive (not blue like Figma/Notion/Linear)

**Negative:**
- Warm cream is harder to get right than dark mode (contrast ratios need care)
- Two distinct visual modes (warm/dark) require more CSS
