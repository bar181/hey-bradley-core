# Hey Bradley — Renumbered Phase Roadmap

**Date:** 2026-03-30
**Reason:** Phases renumbered to reflect actual execution order. Old Phase 4-5 (JSON/Tailwind polish) absorbed as backlog items. Old Phase 6-7 (canned demo) promoted to Phase 4.

---

## Active Roadmap

| Phase | Focus | Status | Old # |
|-------|-------|--------|-------|
| **1** | Core Builder (hero + JSON loop) | DONE (2026-03-29) | 1 |
| **2** | System Polish + ALL 8 Section Editors + CRUD | DONE (2026-03-30) | 2 |
| **3** | Onboarding + Full-Page Preview + Builder UX | DONE (2026-03-30) | 3 |
| **4** | **Canned Demo** (examples, chat sim, listen sim, XAI Docs) | NEXT | was 6-7 |
| **5** | **Home Page + Presentation Flow + Deploy** | After 4 | was 8 |
| **6+** | **Post-Demo** (real AI, auth, DB, expert mode, enterprise) | Future | was 9-14+ |

## What Happened to Old Phases 4-5?

Old Phase 4 (JSON Templates Finalization) and Old Phase 5 (Tailwind/shadcn Cleanup) were polish work. They are now **backlog items in Phase 4.6** and will be done if time allows or post-capstone. Rationale: clean JSON and perfect Tailwind don't change what the demo shows. Simulated AI features do.

## Backlog (Absorbed from Old Phases 4-5)

| Item | Priority | Notes |
|------|----------|-------|
| Google Fonts dynamic loading | P2 | System fonts work as fallback |
| Dead `colors` block cleanup in theme JSONs | P2 | No runtime impact |
| Theme JSON Zod validation audit | P2 | Themes work, just not formally validated |
| Master template JSON | P3 | Nice-to-have for documentation |
| Tailwind inline style replacement | P3 | Cosmetic, not functional |
| Drag-and-drop section reorder | P2 | Arrow buttons work |
| Skip navigation link | P2 | a11y improvement |
| `<nav>` landmarks | P2 | a11y improvement |
| Section highlight on click | P3 | UX polish |
| Light mode preview contrast fix | P3 | Builder chrome issue |

## Phase 6+ Post-Demo Roadmap

| Phase | Focus |
|-------|-------|
| 6 | Expert mode for all sections + JSON-driven right panel |
| 7 | Real LLM: Chat → Claude API → JSON patches |
| 8 | Real Voice: Whisper STT → Claude → patches |
| 9 | SQLite local database, replace localStorage |
| 10 | Supabase auth + cloud persistence |
| 11+ | Marketplace, API, enterprise, white label |
