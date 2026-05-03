# Phase 13 Living Checklist

**Last updated:** 2026-04-05  
**Status:** IN PROGRESS — Sprints 1-4 COMPLETE, Sprint 5 active  

---

## Sprint 1: Content Expansion (P0)

### Listen Demo
- [x] Food blog listen demo sequence added
- [x] Sets tone=casual, purpose=blog, audience=consumer
- [x] Loads fun-blog example

### New Examples
- [x] Real estate agency example (Summit Realty Group)
- [x] Law firm example (Barrett & Associates)
- [x] Both registered in examples/index.ts
- [x] Both have siteContext filled (purpose/audience/tone/brand)
- [x] 15+ examples total (15)

### Media Library Expansion
- [x] 42+ new image entries added to images.json
- [x] 300+ total images in media catalog (300)
- [x] Categories covered: food, real estate, legal, nature, tech, people, abstract

---

## Sprint 2: Blog Section Type (P0)

### ADR
- [x] ADR-034 written (plans/implementation/phase-13/adr-034-blog-section.md)

### Schema + Defaults
- [x] 'blog' added to section type enum
- [x] Blog section defaults with 3 sample articles
- [x] BlogArticle interface: title, excerpt, author, date, tags, featuredImage

### Templates (4 variants)
- [x] BlogCardGrid.tsx (default — 3-column card grid)
- [x] BlogListExcerpts.tsx (vertical list with images)
- [x] BlogFeaturedGrid.tsx (featured article + grid below)
- [x] BlogMinimal.tsx (text-only, typography-focused)
- [x] All templates use theme CSS variables
- [x] All templates responsive

### Editor
- [x] BlogSectionSimple.tsx created
- [x] Layout variant selector (4 options)
- [x] Article list with title/excerpt/author inputs
- [x] Featured image via ImagePicker
- [x] Show/hide dates toggle
- [x] Show/hide tags toggle
- [x] Add/remove article buttons

### Wiring
- [x] SimpleTab routes to BlogSectionSimple
- [x] Template renderer maps blog variants
- [x] fun-blog example updated to use blog section

---

## Sprint 3: Multi-Page Architecture (P1)

- [x] ADR-035 written
- [x] PageConfig interface defined
- [x] MasterConfig.pages[] (backward compatible, optional)
- [x] Page management UI in left panel
- [x] Add/remove pages (home protected)
- [x] Independent section lists per page
- [x] Preview with nav (MultiPageNav)
- [ ] Hash routing (#/about, #/services) — v1 uses store-based nav switching (acceptable)
- [x] Specs generate per-page (Build Plan)
- [x] Page templates (About, Contact, Blog defaults)
- [x] Existing single-page configs still work

---

## Sprint 4: Export + Accessibility (P1)

### Export
- [x] ADR-036 written
- [x] Export button in toolbar (TopBar)
- [x] ZIP: all specs (6 specs + JSON + README)
- [x] Browser Blob API download

### Accessibility
- [x] A11y audit documented (13 issues found and fixed)
- [x] Color contrast checked (WCAG AA)
- [x] Alt text on images
- [x] Heading hierarchy
- [x] Keyboard navigation (focus-visible rings fixed)
- [x] Critical a11y issues fixed

---

## Sprint 5: Quality Pass + Phase Close

- [ ] `npx tsc --noEmit` passes
- [ ] `npm run build` succeeds
- [ ] 100+ Playwright tests
- [ ] Persona review (Agentic 80+, Grandma 55+, Capstone 82+)
- [ ] Retrospective written
- [ ] Session log finalized
- [ ] Wiki page created
- [ ] CLAUDE.md updated
- [ ] Phase 14 preflight created
