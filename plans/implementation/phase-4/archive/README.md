# Phase 4: Example Websites

**North Star:** Users can instantly load polished, complete example websites to see Hey Bradley's capabilities without building from scratch.

**Status:** READY TO START
**Prerequisite:** Phase 3 COMPLETE (2026-03-30), Light/Dark fix COMPLETE (2026-03-31)

---

## Renumbered Roadmap (per Bradley directive 2026-03-31)

```
Phase 1: Core Builder (hero + JSON loop)                         DONE
Phase 2: System Polish + ALL 8 Section Editors + CRUD            DONE
Phase 3: Onboarding + Full-Page Preview + Builder UX             DONE
Phase 4: Example Websites (pre-built site JSONs)                 CURRENT
Phase 5: Simulated Chat (keyword → canned JSON patches)          NEXT
Phase 6: Home Page + Listen Simulation (splash + red orb demo)   NEXT
Phase 7: XAI Docs + Workflow Pipeline                            NEXT
Phase 8: Deploy + Presentation Flow                              NEXT
Phase 9+: Post-Demo (real AI, auth, database, enterprise)        FUTURE
```

---

## Phase 4 Goal

Create 4 pre-built example website JSONs and wire them into the onboarding page so users can load a complete, polished site with one click.

---

## Deliverables

1. **"Sweet Spot Bakery" JSON** — Wellness theme, warm colors, food imagery (Unsplash bakery/pastry photos), sections: navbar, hero, features (3 specialties), testimonials, CTA ("Order Now"), footer. Friendly copy.
2. **"LaunchPad AI" JSON** — SaaS theme, dark mode, tech gradients, sections: navbar, hero, features (3 product features), pricing (3 tiers), FAQ, CTA ("Start Free Trial"), footer. Professional copy.
3. **"Sarah Chen Photography" JSON** — Portfolio theme, full-bleed hero image, sections: navbar, hero (overlay layout), features (3 services), testimonials, CTA ("Book a Session"), footer. Artistic copy.
4. **"GreenLeaf Consulting" JSON** — Professional theme, light mode, sections: navbar, hero (minimal), value props (3 stats), testimonials, CTA ("Schedule a Consultation"), footer. Corporate copy.
5. **"Try an Example" UI** — Section on onboarding page below theme grid, 4 cards showing example name + 1-line description. Click loads JSON and navigates to /builder.

---

## Key Files

| File | Action |
|------|--------|
| `src/data/examples/bakery.json` | CREATE |
| `src/data/examples/launchpad.json` | CREATE |
| `src/data/examples/photography.json` | CREATE |
| `src/data/examples/consulting.json` | CREATE |
| `src/pages/Onboarding.tsx` (or equivalent) | MODIFY — add example cards |
| `src/store/configStore.ts` | MODIFY — wire `loadConfig()` for examples |

---

## What Phase 4 Does NOT Do

- Simulated chat (Phase 5)
- Listen mode simulation (Phase 6)
- Home/splash page (Phase 6)
- XAI Docs live spec generation (Phase 7)
- Workflow pipeline animation (Phase 7)
- Vercel deployment (Phase 8)
