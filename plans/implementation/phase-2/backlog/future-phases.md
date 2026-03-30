# Future Phases Backlog — Corrected Roadmap

**Last Updated:** 2026-03-29
**Authority:** `human-1.md` corrected the swarm's original plan.

---

## Corrected Phase Sequence

```
Phase 1: Core Builder (hero + JSON loop)                    ✅ DONE
Phase 2: System Polish + ALL 8 Section Editors + CRUD       🔄 CURRENT
Phase 3: Onboarding + Drag-and-Drop + Builder UX            📅 NEXT
Phase 4: Specs + Presentation Mode + Accessibility           📅 CAPSTONE
Phase 5: Expert Mode (Pro tier)                              📅 POST-CAPSTONE
Phase 6+: LLM + Auth + Enterprise                           📅 FUTURE
```

---

## Phase 3: Full Site Builder UX

**Goal:** Turn Hey Bradley from a "section editor" into a "website builder." A grandmother can build a 5-section marketing site in 3 minutes.

| # | Feature | Details |
|---|---------|---------|
| 3.1 | Onboarding page | Theme selection grid at `/`, "describe your site" textarea, "start from scratch" button |
| 3.2 | Drag-and-drop reorder | @dnd-kit for section reorder in left panel + main preview |
| 3.3 | Full-page preview | Hide panels, show complete multi-section page with smooth scroll |
| 3.4 | Builder UX polish | Tooltips, quick actions per section (move/duplicate/delete), first-time hints |
| 3.5 | Section templates | Pre-built section content per theme (not just empty sections) |
| 3.6 | Export to static HTML | Download standalone HTML with inlined styles (stretch goal) |

**DoD:** A grandmother selects a theme on the onboarding page, lands in the builder with 5 pre-filled sections, reorders them via drag-and-drop, previews the full page, and exports.

---

## Phase 4: Specification Engine + Capstone Demo

**Goal:** The "AI-first documentation" capstone story. Specs generate from JSON. Presentation mode for the demo.

| # | Feature | Details |
|---|---------|---------|
| 4.1 | XAI Docs HUMAN view | Structured spec generated from current config (North Star, Architecture, Impl Plan) |
| 4.2 | XAI Docs AISP view | `@aisp` formatted syntax with orange highlighting |
| 4.3 | Workflow tab | Mock pipeline stepper with animated step progression |
| 4.4 | Listen mode visual | Red orb, dark overlay, START LISTENING button, pulse animation |
| 4.5 | Accessibility dialog | Doc 07 spec: appearance, textScale, contrast, reduceMotion, a11yWidget |
| 4.6 | Presentation mode | Full-screen demo: walkthrough sequence, keyboard navigation, transitions |
| 4.7 | Demo presets | 3-5 pre-built complete websites for capstone demo |

**Note:** Accessibility dialog is here (Phase 4), NOT Phase 2. It's important but doesn't block the builder experience. The capstone demo benefits more from working sections than settings dialogs.

---

## Phase 4.5: Component-Level Layout Options (Per Section)

**Goal:** Each section's Layout accordion offers component-level visual options — card formats, button styles, image treatments. Research top Tailwind/shadcn patterns.

| Section | Layout Options (Top 4-6 Formats) |
|---------|----------------------------------|
| Features | Card: flat, bordered, shadow, image-top. Grid: 2/3/4 cols. Icon position: left/top |
| Pricing | Card: flat, elevated, gradient-border. Highlight: ring, badge, scale |
| Testimonials | Card: quote-card, avatar-top, avatar-left. Layout: grid, carousel, single |
| FAQ | Style: accordion, two-column, plain-list. Divider: line, none |
| Value Props | Style: big-number, icon-circle, icon-square. Layout: 3/4 cols, horizontal |
| Footer | Style: centered, multi-column, minimal. Columns: 2/3/4 |
| CTA | Style: centered, split, gradient-bg, newsletter. Size: compact/full-width |

**Research needed:** Top card component formats from Tailwind UI and shadcn. Each section should offer 4-6 pre-built component layouts (not custom CSS — pick from a curated set).

**Architecture:** Store selected format in `section.layout.componentFormat` (e.g., `"card-bordered"`, `"card-shadow"`). Renderer maps format to Tailwind classes.

---

## Phase 5: Expert Mode (Open Core Pro Tier)

**Goal:** Advanced controls for power users. Every section gets an EXPERT tab.

| # | Feature | Open Core |
|---|---------|-----------|
| 5.1 | Expert tab per section type | Pro |
| 5.2 | AISP viewer per section | Pro |
| 5.3 | CSS variable viewer | Pro |
| 5.4 | Raw JSON editor per section | Pro |
| 5.5 | Advanced layout controls (direction, align, gap, padding) | Pro |
| 5.6 | Component-level styling (per-component overrides) | Pro |
| 5.7 | Animation controls (entrance, scroll effects) | Pro |

---

## Phase 6+: LLM + Auth + Enterprise (Post-Capstone)

### LLM Integration (Community/Pro)
| Feature | Tier | Details |
|---------|------|---------|
| Chat mode | Community (limited) | Natural language → JSON patches |
| Voice/Listen mode | Community (limited) | Voice-to-spec, real-time updates |
| Unlimited LLM | Pro | No rate limits, advanced prompts |
| Batch generation | Pro | Generate entire multi-section site from description |

### Auth + Database (Pro)
| Feature | Tier | Details |
|---------|------|---------|
| Supabase auth | Pro | Login/signup, user profiles |
| Cloud persistence | Pro | Save to Supabase, versioning |
| Image/video upload | Pro | Supabase storage, thumbnails |
| Project sharing | Pro | Share URL (read-only) |
| Multi-project | Pro | Multiple projects per user |

### Enterprise
| Feature | Details |
|---------|---------|
| API access | REST API for headless CMS integration |
| SSO/SAML | Enterprise authentication |
| Custom AISP rules | Org-specific specification rules |
| Audit log | Track all changes with user attribution |
| White label | Remove Hey Bradley branding |
| Template marketplace | Community templates + paid themes |
| Custom domain deployment | Deploy to custom domain |

---

## MVP Milestone (Capstone Demo)

The MVP is the Harvard capstone demo. It intersects Phases 3 + 4.

**MVP Checklist:**
- [ ] 8 section types working with SIMPLE editors (Phase 2)
- [ ] Onboarding page with theme selection (Phase 3)
- [ ] Full-page preview mode (Phase 3)
- [ ] Presentation mode for demo defense (Phase 4)
- [ ] XAI Docs generating specs from JSON (Phase 4)
- [ ] 3 demo preset websites (Phase 4)
- [ ] Listen mode visual working (Phase 4)

**Timeline estimate:** Phase 2 (2-3 days) → Phase 3 (2-3 days) → Phase 4 (2-3 days) = ~1 week to MVP.

---

## Prioritization

1. Does it make a grandmother's experience better? → Phase 2-3
2. Does it make the capstone demo better? → Phase 4
3. Does it add power-user depth? → Phase 5
4. Does it require infrastructure? → Phase 6+
