# Hey Bradley — Master Backlog Classification (SUPERSEDED)

**Date:** 2026-03-30 | **Superseded by:** `phase-4/backlog-renumbered.md`
**Note:** Phase numbering was renumbered on 2026-03-30. See Phase 4 folder for current roadmap.

---

## Classification Key

| Stage | Label | Definition | Timeline |
|-------|-------|-----------|----------|
| **1** | **POC** | Core functionality that proves the concept works. Must function end-to-end. | Phases 3-5 (~4-5 days) |
| **2** | **Canned Demo** | Pre-built examples + simulated AI features. Looks like the real product but uses scripted responses. | Phases 6-7 (~2 days) |
| **3** | **Presentation Demo** | Polish layer for the capstone defense. Home page, guided walkthrough, deploy to Vercel. Simulation of a working product. | Phase 8 (~1-2 days) |
| **4** | **Post-Demo** | Real functionality built after capstone. MVP, open core, production, future. | Phases 9-14+ |

---

## POC (Phases 3-5) — Must Work for Real

### Phase 3: Onboarding + Full-Page Preview + Builder UX

| # | Item | Priority | Status |
|---|------|----------|--------|
| 3.1 | Onboarding page with 10 theme cards → navigates to builder | P0 | Not started |
| 3.2 | Navbar section (renderer + SIMPLE editor + auto-anchor links) | P0 | Not started |
| 3.3 | Full-page preview mode (hide panels, stack all sections) | P0 | Not started |
| 3.4 | 2nd variant per section (FeaturesCards, CTASplit, etc.) | P1 | Not started |
| 3.5 | Drag-and-drop reorder (@dnd-kit) | P1 | Not started |
| 3.6 | Builder UX polish (section highlight, tooltips) | P2 | Not started |

### Phase 4: JSON Templates Finalization

| # | Item | Priority | Status |
|---|------|----------|--------|
| 4.1 | Master template JSON with all possible keys | P1 | Not started |
| 4.2 | Per-section template JSONs with sample content | P1 | Partially done (theme JSONs have sections) |
| 4.3 | Options JSONs (images, videos, fonts, palettes, icons) | P1 | Partially done (palettes/fonts exist) |
| 4.4 | Theme JSON audit — validate all 10 against Zod | P1 | Not started |
| 4.5 | Dead `colors` block cleanup in theme JSONs | P2 | Not started |
| 4.6 | JSON hierarchy documentation | P2 | Not started |

### Phase 5: Tailwind/shadcn Cleanup + Polish

| # | Item | Priority | Status |
|---|------|----------|--------|
| 5.1 | Replace inline `style={{}}` with Tailwind classes | P1 | Not started |
| 5.2 | Replace custom inputs with shadcn components | P2 | Mostly done |
| 5.3 | Google Fonts dynamic loading from fonts.json | P1 | Not started |
| 5.4 | Font cascade fix (all renderers inherit theme font) | P1 | Broken since Phase 1 |
| 5.5 | Responsive polish at 375px / 768px / 1280px | P1 | Partially done (hamburger navbar) |
| 5.6 | P0 + P1 accessibility fixes | P1 | P0 done, P1 remaining |
| 5.7 | Light mode preview contrast fix | P2 | Not started |

---

## Canned Demo (Phases 6-7) — Simulated Features

### Phase 6: Example Websites + Simulated Chat

| # | Item | Priority | Status |
|---|------|----------|--------|
| 6.1 | 3-5 complete example website JSONs (bakery, SaaS, photography, consulting) | P0 | Not started |
| 6.2 | "Try an Example" buttons in onboarding or TopBar | P0 | Not started |
| 6.3 | Simulated chat: keyword → canned JSON patch (5+ commands) | P0 | Not started |
| 6.4 | Chat history UI (user message → "Bradley" response → applied changes) | P1 | Not started |
| 6.5 | Media picker dialog (image/video browse with thumbnails) | P1 | Deferred from Phase 2 |

### Phase 7: Simulated Listen Mode + XAI Docs

| # | Item | Priority | Status |
|---|------|----------|--------|
| 7.1 | Listen mode simulation (red orb → typewriter → canned JSON loads) | P0 | Not started |
| 7.2 | Workflow pipeline animation (Voice Capture → Intent → AISP → Render) | P0 | Not started |
| 7.3 | XAI Docs HUMAN view (structured spec from current JSON) | P0 | Not started |
| 7.4 | XAI Docs AISP view (@aisp formatted output) | P1 | Not started |
| 7.5 | Copy/export on XAI Docs views | P1 | Not started |

---

## Presentation Demo (Phase 8) — Capstone Defense Polish

### Phase 8: Home Page + Presentation Flow + Deploy

| # | Item | Priority | Status |
|---|------|----------|--------|
| 8.1 | Home/marketing page for Hey Bradley itself | P0 | Not started |
| 8.2 | Presentation flow (guided 15-min walkthrough sequence) | P0 | Not started |
| 8.3 | Final UI polish pass (typography, spacing, animations, loading states) | P1 | Not started |
| 8.4 | Deploy to Vercel (hey-bradley.vercel.app) | P0 | Not started |
| 8.5 | OG image, meta tags, favicon | P1 | Not started |
| 8.6 | README with screenshots and demo link | P2 | Not started |
| 8.7 | Accessibility dialog (Doc 07 spec: textScale, contrast, reduceMotion) | P2 | Not started |

---

## Post-Demo — Real Product (After Capstone)

### MVP / Open Core

| # | Item | Phase | Priority | Notes |
|---|------|-------|----------|-------|
| 9.1 | Right panel JSON-driven (controls from JSON schemas, not hardcoded React) | 9 | P1 | Reduces maintenance of 8 editor files |
| 9.2 | Expert tab for all sections (advanced controls, per-component overrides) | 9 | P1 | Currently just palette + font |
| 10.1 | SQLite local database | 10 | P1 | Migration files, seed from JSON templates |
| 10.2 | Project save/load from database | 10 | P1 | Replace localStorage |

### Real AI Features

| # | Item | Phase | Priority | Notes |
|---|------|-------|----------|-------|
| 11.1 | Chat: text → Claude API → JSON patches | 11 | P0 | Real LLM replaces canned responses |
| 11.2 | Listen: Whisper STT → Claude → JSON patches | 11 | P0 | Real voice replaces simulation |
| 11.3 | Copy suggestions (LLM suggests 3 copy options per field) | 11 | P1 | Power-user feature |
| 11.4 | Section inference (LLM infers target section from text) | 11 | P2 | Removes need for explicit section selection |

### Production Infrastructure

| # | Item | Phase | Priority | Notes |
|---|------|-------|----------|-------|
| 12.1 | AISP viewer per section | 12 | P1 | Pro tier feature |
| 12.2 | CSS variable viewer | 12 | P2 | Developer feature |
| 13.1 | Supabase auth + login/signup | 13 | P0 | Required for multi-user |
| 13.2 | Cloud persistence (Supabase) | 13 | P0 | Replace localStorage |
| 13.3 | Image/video upload (Supabase Storage) | 13 | P1 | Currently URL-only |
| 13.4 | Project sharing (read-only link) | 13 | P2 | Community feature |

### Future / Enterprise

| # | Item | Phase | Priority | Notes |
|---|------|-------|----------|-------|
| 14.1 | API access (REST) | 14+ | P2 | Headless CMS integration |
| 14.2 | SSO/SAML | 14+ | P3 | Enterprise auth |
| 14.3 | Custom AISP rules | 14+ | P3 | Org-specific specifications |
| 14.4 | Template marketplace | 14+ | P3 | Community + paid themes |
| 14.5 | White label | 14+ | P3 | Remove Hey Bradley branding |
| 14.6 | Export to static HTML | 14+ | P2 | Standalone site download |

---

## Summary: What Matters When

```
NOW (Phase 3):     Onboarding + full-page preview + navbar = "it looks like a website builder"
SOON (Phase 4-5):  JSON cleanup + Tailwind polish = "it looks professional"
DEMO (Phase 6-7):  Canned chat + listen simulation + XAI Docs = "it looks like AI"
DEFENSE (Phase 8): Home page + presentation flow + deploy = "it's ready to present"
AFTER (Phase 9+):  Real AI + database + auth = "it's a real product"
```

## Critical Path to Capstone

```
Phase 3 (onboarding + preview) ──→ Phase 6 (examples + chat) ──→ Phase 8 (home + deploy)
          ↑ MOST IMPORTANT              ↑ WOW FACTOR                 ↑ FINAL POLISH
```

Phases 4 and 5 (JSON cleanup + Tailwind polish) can run in parallel or be interleaved with Phase 6-7. Phase 7 (listen mode + XAI Docs) is high-impact for the demo but not on the critical path — the demo can work without listen simulation if time is tight.
