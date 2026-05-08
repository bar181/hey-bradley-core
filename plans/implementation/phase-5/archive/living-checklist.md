# Phase 5: Living Checklist — Chat Intelligence + Listen Integration

**Last Updated:** 2026-04-03 (after Session 3)

---

## Phase 5A — Jargon Removal + Foundation

| # | Check | Severity | Status |
|---|-------|----------|--------|
| JR1 | Panel labels rewritten (Hero→Main Banner, CTA→Action Block, etc.) | P0 | DONE |
| JR2 | ImagePicker created (24 images, 6 categories) | P0 | DONE |
| JR3 | Themes trimmed to 8, SaaS→Tech Business | P1 | DONE |
| JR4 | Welcome page copy rewritten in plain English | P1 | DONE |
| JR5 | "Simulate Input" → "Watch a Demo" | P1 | DONE |
| JR6 | Status bar cleaned up | P2 | DONE |

## Phase 5A Extended — Section Rename + Enhanced Tools

| # | Check | Severity | Status |
|---|-------|----------|--------|
| SR1 | Section types renamed (features→columns, cta→action, testimonials→quotes, faq→questions, value_props→numbers, navbar→menu) | P0 | DONE |
| SR2 | New gallery section type added | P1 | DONE |
| SR3 | ImagePicker v2 (50 images, 10 videos, effects tab) | P0 | DONE |
| SR4 | Color palette selector (10 curated palettes) | P1 | DONE |
| SR5 | Column count bug fixed (FeaturesGrid hardcoded) | P0 | DONE |
| SR6 | Action section enabled by default | P1 | DONE |

## Phase 5B+5C — 31 Variant Renderers

| # | Check | Severity | Status |
|---|-------|----------|--------|
| VR1 | Columns: 8 variants (Cards, Image Cards, Icon+Text, Minimal, Numbered, Horizontal, Gradient, Glass) | P0 | DONE |
| VR2 | Action: 4 variants (Centered, Split, Gradient, Newsletter) | P0 | DONE |
| VR3 | Quotes: 4 variants (Cards, Single, Stars, Minimal) | P0 | DONE |
| VR4 | Questions: 4 variants (Accordion, Two Column, Cards, Numbered) | P0 | DONE |
| VR5 | Numbers: 4 variants (Counters, Icons, Cards, Gradient) | P0 | DONE |
| VR6 | Gallery: 4 variants (Grid, Masonry, Carousel, Full Width) | P0 | DONE |
| VR7 | Footer: 3 variants (Multi-Column, Simple Bar, Minimal) | P0 | DONE |
| VR8 | All editors updated with layout card pickers | P0 | DONE |

## Simulated Chat v2

| # | Check | Severity | Status |
|---|-------|----------|--------|
| SC1 | 15+ recognized command patterns (up from 7) | P0 | TODO |
| SC2 | Multi-word intent detection works ("make the background blue") | P1 | TODO |
| SC3 | Compound commands work ("add testimonials and make it dark") | P1 | TODO |
| SC4 | Contextual responses reference what changed | P1 | TODO |
| SC5 | Typing indicator has personality (not just "Processing...") | P2 | TODO |
| SC6 | All existing 7 commands still work (no regressions) | P0 | TODO |

## Chat History Panel

| # | Check | Severity | Status |
|---|-------|----------|--------|
| CH1 | Scrollable conversation history in Chat tab | P0 | TODO |
| CH2 | Messages persist across tab switches (Builder/Chat/Listen) | P0 | TODO |
| CH3 | Clear history button works | P1 | TODO |
| CH4 | Session-scoped storage survives page navigation | P1 | TODO |
| CH5 | Visual timestamp grouping ("just now", "earlier") | P2 | TODO |

## Listen Mode Integration

| # | Check | Severity | Status |
|---|-------|----------|--------|
| LI1 | Listen transcript feeds into command parser | P0 | TODO |
| LI2 | Recognized spoken command applies JSON patch to builder | P0 | TODO |
| LI3 | Orb pulses on command recognition | P1 | TODO |
| LI4 | Transcript shows "Applying: [command]..." on recognition | P1 | TODO |
| LI5 | Unrecognized speech shows in transcript but does not modify builder | P0 | TODO |

## Unified Command Layer

| # | Check | Severity | Status |
|---|-------|----------|--------|
| UC1 | Shared command parser used by both Chat and Listen | P0 | TODO |
| UC2 | Consistent response messages across typed and spoken input | P1 | TODO |
| UC3 | Adding a new command in one place works for both inputs | P1 | TODO |

---

## Phase 5 Pass Criteria

| Severity | Rule | Result |
|----------|------|--------|
| P0 failures | BLOCKING | **TBD** |
| P1 failures | < 3 allowed | **TBD** |
| P2 failures | Informational | **TBD** |

## Progress Summary

- **5A (Jargon Removal):** 6/6 DONE
- **5A Extended (Section Rename):** 6/6 DONE
- **5B+5C (Variant Renderers):** 8/8 DONE
- **Simulated Chat v2:** 0/6 TODO
- **Chat History Panel:** 0/5 TODO
- **Listen Mode Integration:** 0/5 TODO
- **Unified Command Layer:** 0/3 TODO
- **Overall:** 20/39 items complete
