# Hey Bradley — Renumbered Phase Roadmap v2

**Date:** 2026-03-31
**Reason:** Old Phase 4 (canned demo) was too large. Split into 5 focused phases (4-8), each with own checklist, retrospective, and full UI/UX review.

---

## Active Roadmap

| Phase | Focus | Status | Old # |
|-------|-------|--------|-------|
| **1** | Core Builder (hero + JSON loop) | DONE (2026-03-29) | 1 |
| **2** | System Polish + ALL 8 Section Editors + CRUD | DONE (2026-03-30) | 2 |
| **3** | Onboarding + Full-Page Preview + Builder UX | DONE (2026-03-30) | 3 |
| **4** | **Example Websites** (4 pre-built site JSONs + "Try an Example" UI) | CURRENT | was 4.1 |
| **5** | **Simulated Chat** (keyword → canned JSON patches, chat history) | NEXT | was 4.2 |
| **6** | **Home Page + Listen Simulation** (splash page + red orb demo) | NEXT | was 4.3 + old 8 |
| **7** | **XAI Docs + Workflow Pipeline** (live specs, animated pipeline) | NEXT | was 4.4-4.5 |
| **8** | **Deploy + Presentation Flow** (Vercel, 15-min walkthrough, polish) | NEXT | was old 8 |
| **9+** | **Post-Demo** (real AI, auth, DB, expert mode, enterprise) | Future | was 9+ |

## What Changed from v1

- Old Phase 4 (canned demo) split into Phase 4 (examples), Phase 5 (chat), Phase 6 (home + listen), Phase 7 (XAI docs + workflow)
- Old Phase 5 (home + deploy) split: home page moved to Phase 6, deploy moved to Phase 8
- Each phase now has: README, living-checklist, log, and will get retrospective + UI/UX review on close

## Backlog (Absorbed from Old Phases 4-5)

| Item | Priority | Notes |
|------|----------|-------|
| Google Fonts dynamic loading | P2 | System fonts work as fallback |
| Dead `colors` block cleanup in theme JSONs | P2 | No runtime impact |
| Theme JSON Zod validation audit | P2 | Themes work, just not formally validated |
| Drag-and-drop section reorder | P2 | Arrow buttons work |
| Skip navigation link | P2 | a11y improvement |
| `<nav>` landmarks | P2 | a11y improvement |
| Section highlight on click | P3 | UX polish |

## Phase 9+ Post-Demo Roadmap

| Phase | Focus |
|-------|-------|
| 9 | Expert mode for all sections + JSON-driven right panel |
| 10 | Real LLM: Chat → Claude API → JSON patches |
| 11 | Real Voice: Whisper STT → Claude → patches |
| 12 | SQLite local database, replace localStorage |
| 13 | Supabase auth + cloud persistence |
| 14+ | Marketplace, API, enterprise, white label |

## Reference Materials for Phase 6

- Splash page code: `plans/implementation/phase-1/human-feedback/love-example-spash.md`
- Screencaps: `plans/implementation/phase-3/screencaps/splash-0.png` through `splash-5.png`
- Brad Pixar avatar: `plans/implementation/phase-3/screencaps/brad_pixar.webp`
