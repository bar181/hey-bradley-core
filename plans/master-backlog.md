# Hey Bradley — Master Backlog

**Created:** 2026-04-04
**Authority:** This document + `plans/initial-plans/08-10` + `phase-8/human-clean-up-1.md`
**Capstone:** May 2026

---

## Stage 1: Presentation (Target: 1 week before capstone)

### P0 — Must Have

| # | Task | Source | Status |
|---|------|--------|--------|
| S1-01 | **Fix AISP spec B- → A+**: Remove 30-char truncation, remove slice(0,4), add content.heading/subheading | spec-review-findings.md | TODO |
| S1-02 | **Build 6 modular spec generators** (North Star, SADD, Implementation Plan, Features, Human Spec, AISP) as pure functions in `src/lib/specGenerators/` | human-clean-up-1.md §1A | TODO |
| S1-03 | **North Star generator**: Vision, PMF, personas, success criteria — reads like a real product doc | Req 08 | TODO |
| S1-04 | **SADD generator**: Architecture, tech stack, component tree, data model, deployment | Req 08 | TODO |
| S1-05 | **Implementation Plan generator**: Phase-by-phase build instructions with exact copy, image URLs, component props, variant names, padding values — 90% LLM reproduction | Req 08 | TODO |
| S1-06 | **Features generator**: Every section as user story with acceptance criteria | Req 08 | TODO |
| S1-07 | **Human Spec generator**: Full text, spacing/typography, section backgrounds, headings — fix all 5 B+ gaps | spec-review-findings.md | TODO |
| S1-08 | **AISP Spec generator**: Crystal Atom with full Ω,Σ,Γ,Λ,Ε — Platinum tier (95+/100) via aisp_validate | spec-review-findings.md | TODO |
| S1-09 | **Update XAIDocsTab** with 6 sub-tabs for each generator | human-clean-up-1.md §1A | TODO |
| S1-10 | **Image library expansion**: 200+ images as JSON with metadata (tags, mood, description, ai_prompt_context) | human-clean-up-1.md §1C | TODO |
| S1-11 | **Video library**: 40+ videos as JSON with metadata | human-clean-up-1.md §1C | TODO |
| S1-12 | **Kitchen Sink example**: ALL section types, ALL variants, ALL image effects | human-clean-up-1.md §1B | TODO |
| S1-13 | **FitForge Fitness example** (Creative/dark, video hero) | human-clean-up-1.md §1B | TODO |
| S1-14 | **Bloom & Petal Florist example** (Personal/light, split hero) | human-clean-up-1.md §1B | TODO |
| S1-15 | **Blank Canvas example** (Minimalist, hero only) | human-clean-up-1.md §1B | TODO |
| S1-16 | **Chat simulation sequences per example** (personalized typewriter) | human-clean-up-1.md §1B | TODO |
| S1-17 | **Listen simulation sequences per example** (personalized orb+captions) | human-clean-up-1.md §1B | TODO |
| S1-18 | **Onboarding page example cards** (6-8 clickable cards with mini-preview) | human-clean-up-1.md §1B | TODO |
| S1-19 | **Chat/Listen dropdown example selector** | human-clean-up-1.md §1B | TODO |
| S1-20 | **Manual spec→LLM→HTML test**: Paste Implementation Plan into Claude Code, verify 90% reproduction | human-clean-up-1.md §8.5 | TODO |

### P1 — Should Have

| # | Task | Source | Status |
|---|------|--------|--------|
| S1-21 | **Design/Content mode toggle** (lock icon in TopBar, designLocked in uiStore) | human-clean-up-1.md §1D | TODO |
| S1-22 | **8 image effects CSS** (Ken Burns, slow pan, zoom hover, parallax, gradient overlay, glass blur, grayscale-hover, vignette) | human-clean-up-1.md §1C | TODO |
| S1-23 | **Enhanced ImagePicker**: Full-screen modal with category sidebar, grid thumbnails, effect picker, preview | human-clean-up-1.md §1C | TODO |
| S1-24 | **5 Playwright tests** (demo simulator, chat buttons, listen mode, preview toggle, light/dark) | Phase 7 TD3 | TODO |
| S1-25 | **Console cleanup**: Remove 23 debug console statements from 7 files | Phase 7 TD4 | TODO |
| S1-26 | **Plans folder cleanup**: Archive level-x, merge phases/, clean boilerplate | human-clean-up-1.md §0 | TODO |
| S1-27 | **ADR-029**: Spec Generation Architecture decision record | human-clean-up-1.md §7 | TODO |

### P2 — Nice to Have

| # | Task | Source | Status |
|---|------|--------|--------|
| S1-28 | Malformed JSON handling in Data tab | Phase 7 EC4 | TODO |
| S1-29 | Remaining themes carousel on onboarding | Req 08 M8 | TODO |

---

## Stage 2: Pre-LLM MVP (After Presentation)

| # | Task | Source | Status |
|---|------|--------|--------|
| S2-01 | Image upload (drag-and-drop or file picker → base64 or Supabase Storage) | Req 08/human-clean-up-1 §2 | TODO |
| S2-02 | Brand image management (logo, favicon, og:image) | human-clean-up-1 §2 | TODO |
| S2-03 | Complete theme locking (per-project brand guidelines enforcement) | human-clean-up-1 §2 | TODO |
| S2-04 | Full enterprise spec templates (responsive breakpoints, animation specs) | human-clean-up-1 §2 | TODO |
| S2-05 | Section variant completeness (all 8 variants per section type rendering) | human-clean-up-1 §2 | TODO |
| S2-06 | Custom hex color input (brand hex → palette slots) | Phase 5/6 retro TD | TODO |
| S2-07 | Newsletter form webhook (ActionNewsletter → configurable URL) | Phase 5/6 retro TD | TODO |
| S2-08 | SEO fields (title, description, og:image in Site Settings panel) | human-clean-up-1 §2 | TODO |
| S2-09 | Project save/load (named projects in localStorage or file export/import) | human-clean-up-1 §2 | TODO |
| S2-10 | Pricing variants (monthly/annual toggle, comparison table) | human-clean-up-1 §2 | TODO |
| S2-11 | Fix `(section.content as any)` type casting (62+ instances) | Phase 7 TD8 | TODO |

---

## Stage 3: LLM MVP (Post Pre-LLM)

| # | Task | Source | Status |
|---|------|--------|--------|
| S3-01 | Chat → Claude API → JSON patches (natural language → site changes) | Req 09 §1 | TODO |
| S3-02 | Listen → Whisper STT → Claude → JSON patches (voice → site builds) | Req 09 §1 | TODO |
| S3-03 | AISP in system prompts (Crystal Atom format → structured responses) | Req 09 §1 | TODO |
| S3-04 | Context-aware responses (Claude sees current project JSON) | Req 09 §1 | TODO |
| S3-05 | Image selection via AI (Claude recommends from metadata library) | Req 09 §1 | TODO |
| S3-06 | Copy suggestion engine (3 alternatives per text element, tone controls) | Req 09 §1 | TODO |
| S3-07 | Error handling (API fallback, rate limiting, retry) | Req 09 §1 | TODO |
| S3-08 | Streaming responses with typewriter display | Req 09 §1 | TODO |

---

## Stage 4: Open Core Completion

| # | Task | Source | Status |
|---|------|--------|--------|
| S4-01 | AISP intent routing (Crystal Atom → handler routing) | Req 09/10 | TODO |
| S4-02 | Agent coordination (content + layout + images as separate Claude calls) | Req 09 | TODO |
| S4-03 | Template generation (AI generates section templates from AISP specs) | Req 09 | TODO |
| S4-04 | Spec export for Claude Code (one-click all 6 docs) | Req 09 | TODO |
| S4-05 | Free tier (3 projects, 5 sections, basic themes) | human-clean-up-1 §4 | TODO |
| S4-06 | Pro tier (unlimited, all themes, custom colors, priority) | human-clean-up-1 §4 | TODO |
| S4-07 | Enhanced visuals (serif fonts, eyebrow labels, fluid typography, generous spacing) | spec-review-findings.md §6-9 | TODO |
| S4-08 | Core pillar spec generation (North Star, Architecture, Implementation, Design Bible) | Req 09 §2 | TODO |
| S4-09 | Chat upload button (images, docs, brand guidelines extraction via LLM) | Req 09 §1 | TODO |
| S4-10 | 200-image + 30-video curated library with style/mood/suitableFor metadata | Req 09 §3 | TODO |

---

## Stage 5: Post-Open-Core

| # | Task | Source | Status |
|---|------|--------|--------|
| S5-01 | AISP intent agents (HeroAgent, PricingAgent, etc.) | Req 10 §1 | TODO |
| S5-02 | Diamond tier AISP (<1% ambiguity, intent-driven) | Req 10 §1 | TODO |
| S5-03 | Multi-page support (About, Contact, Blog, Product pages) | human-clean-up-1 §5 | TODO |
| S5-04 | Marketplace (community themes, templates, image packs) | human-clean-up-1 §5 | TODO |
| S5-05 | White label (resellable for agencies) | human-clean-up-1 §5 | TODO |
| S5-06 | REST API for programmatic site generation | human-clean-up-1 §5 | TODO |
| S5-07 | SSO / Enterprise auth (Supabase + SAML/OIDC) | human-clean-up-1 §5 | TODO |
| S5-08 | Version control (git-like project history with branching) | human-clean-up-1 §5 | TODO |
| S5-09 | Collaboration (multi-user editing with conflict resolution) | human-clean-up-1 §5 | TODO |
| S5-10 | Conversion funnel optimization via LLM | Req 10 §4 | TODO |
| S5-11 | Competitor analysis via LLM | Req 10 §5 | TODO |

---

## Presentation DoD (20-Item Checklist)

| # | Criterion | Verification | Status |
|---|-----------|-------------|--------|
| 1 | Welcome page loads in < 2s with CTA always clickable | Vercel production test | DONE |
| 2 | 10 themes selectable, each visually distinct | Click through all 10 | DONE |
| 3 | Builder: edit headline → preview updates instantly | Live demo | DONE |
| 4 | Builder: toggle component → appears/disappears | Live demo | DONE |
| 5 | Chat: type command → site changes with typewriter | Live demo (canned) | DONE |
| 6 | Listen: "Watch a Demo" → orb → site builds → wow | Live demo (canned) | DONE |
| 7 | 6-8 example websites loadable, visually distinct | Click through | TODO (4/8) |
| 8 | XAI DOCS: 6 tabs generate real specs from JSON | Open each tab | TODO (2/6) |
| 9 | North Star spec reads like real vision doc | Professor reviews | TODO |
| 10 | Implementation Plan has section-by-section build instructions | Professor reviews | TODO |
| 11 | AISP spec shows Crystal Atom with all 5 components | Professor reviews | TODO |
| 12 | Copy spec → paste into Claude → 90% reproduction | Test offline | TODO |
| 13 | Full-page preview shows complete multi-section site | Preview mode | DONE |
| 14 | Mobile responsive (splash + preview mode) | Test at 375px | DONE |
| 15 | 47+ Playwright tests passing | npx playwright test | DONE |
| 16 | Zero console errors during demo flow | Browser console | TODO |
| 17 | Kitchen Sink shows ALL effects and variants | Load example 7 | TODO |
| 18 | Image selector has 200+ images with categories | Open ImagePicker | TODO |
| 19 | Design/Content mode toggle works | Lock design | TODO |
| 20 | 15-minute demo flows without "known issue" moments | Full rehearsal | TODO |

**Current: 8/20 DONE, 12 TODO**

---

## File Reference

| Document | Location |
|----------|----------|
| Req 08 (MVP Presentation) | `plans/initial-plans/08.mvp-presentation-requirements.md` |
| Req 09 (Post-MVP Open Core) | `plans/initial-plans/09.post-mvp-open-core.md` |
| Req 10 (Private AISP) | `plans/initial-plans/10.private-advanced-aisp.md` |
| Comprehensive directive | `plans/implementation/phase-8/human-clean-up-1.md` |
| Spec review findings | `plans/implementation/phase-7/spec-review-findings.md` |
| Roadmap | `plans/implementation/roadmap.md` |
