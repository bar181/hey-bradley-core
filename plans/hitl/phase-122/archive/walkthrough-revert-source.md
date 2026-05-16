# P122 / W9 — Walkthrough Revert: Original Phase-1-15 Source Reference

> **Search outcome:** Closest match to the owner-described "original" 3-pane walkthrough is **`plans/implementation/phase-1/archive/human-feedback/human-1.md`** (the original "Phase 1 — CORE BUILDER (The Deterministic Shell)" spec) combined with **`plans/implementation/phase-3/archive/updated-north-star.md`** (which describes the listen-mode demo flow). No standalone `walkthrough.html` artifact exists in phase-1-15 — the 3-pane concept was always architectural (`Commander | Reality | Engine Room`) rather than a marketing walkthrough page.

## What the original spec described (verbatim excerpts)

From `phase-1/archive/human-feedback/human-1.md` (Phase 1 — Sub-Phase 1.3 Listen Mode):

> "Create the `AIAvatar` component: A 3-layer CSS blur/glow effect that pulses its frequency based on a `isThinking` state... Build the **Typewriter Service**: A component that takes strings and renders them character-by-character in a monospace, system-brevity style. **The Wow:** Clicking 'Start Listening' turns the left panel into a dark, pulsing AI command center while the website stays 'lit' in the center."

From `phase-3/archive/updated-north-star.md` line 31:

> "Simulated listen mode (click → red orb → typewriter → canned JSON → site builds)"

From `phase-3/archive/updated-north-star.md` line 166:

> "Toggle Listen → red orb appears → click 'Start Listening' → typewriter text: 'Parsing intent... Generating bakery website... Applying Warm theme...' → canned JSON loads → site appears. The entire sequence is scripted. No actual STT or LLM."

From `phase-4/archive/human-4.md` line 23:

> "**Listen** | Red pulsing orb + caption area | **OFF** (collapsed/hidden) | Reality (full width — preview expands)"

## Owner direction (`plans/hitl/phase-122/human-2.md` 2026-05-08, items 31-34)

> "The walkthrough needs to revert back to the original (eg left side was the prompts (needs to be updated with the red pulsing glow), then show animated mock typewriter mode to show updates, and on right side show a mobile site as the preview)"

## Locked spec for `Walkthrough.tsx`

| Pane | Width | Content | Animation |
|---|---|---|---|
| Left | ~30% | 4-6 prompt cards (typed-input style) | Active card has `orb-pulse` red glow; others `opacity: 0.5`. Auto-cycle every 4s. |
| Center | ~30% | Monospace mock typewriter | CSS step animation, ~38ms/char, blinking caret. Resets per cycle. |
| Right | ~40% | Mobile-shaped frame (~390px, rounded-3xl) | Stylised site preview that swaps each cycle. |

Reuse the global `@keyframes orb-pulse` defined in `src/index.css:134-139` (Harvard crimson). Do NOT invent a new orb animation.

`prefers-reduced-motion: reduce` freezes the FIRST prompt as active, typewriter shows full result, preview at first state — all 3 panes still render, just no motion.

## Sample prompt copy (matches Hey Bradley tone)

1. "Make me a coffee shop site, warm and not pretentious"
2. "Add a pricing section with 3 tiers"
3. "Make the hero crimson with a darker subhead"
4. "Add a contact form below the gallery"
5. "Switch to a serif heading font"
