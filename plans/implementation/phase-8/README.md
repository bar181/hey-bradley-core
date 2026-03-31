# Phase 8: Deploy + Presentation Flow

**North Star:** Hey Bradley is deployed to a public URL and has a guided walkthrough flow for the 15-minute capstone presentation.

**Status:** WAITING (after Phase 7)
**Prerequisite:** Phase 7 COMPLETE

---

## Phase 8 Goal

Final sprint. Polish, deploy, and create a presentation-ready demo flow.

---

## Deliverables

### Presentation Flow
- Guided sequence: Home → Onboarding → Pick theme → Edit hero → Toggle sections → Show Data Tab → Show XAI Docs → Show Listen simulation → Show Workflow → "Questions?"
- 15-minute walkthrough works without bugs
- Smooth transitions between modes

### Final UI Polish
- Typography consistency audit
- Spacing audit
- Animation smoothness
- Loading states
- Empty states

### Vercel Deploy
- Production build at hey-bradley.vercel.app
- og:image, meta tags, favicon
- README updated with screenshots and demo link

### Polish Backlog (if time)
- Google Fonts dynamic loading from fonts.json
- Dead `colors` block cleanup in theme JSONs
- Theme JSON Zod validation audit
- Drag-and-drop reorder (@dnd-kit)
- Section highlight on click in preview
- Skip navigation link + `<nav>` landmarks

---

## What Phase 8 Does NOT Do

- Real LLM integration (Phase 9+)
- Auth/database (Phase 9+)
- Expert tab content for all sections (Phase 9+)
