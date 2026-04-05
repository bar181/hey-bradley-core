# Phase 13 Living Checklist

**Last updated:** 2026-04-05  
**Status:** IN PROGRESS — Sprint 1+2 active  

---

## Sprint 1: Content Expansion (P0)

### Listen Demo
- [ ] Food blog listen demo sequence added
- [ ] Sets tone=casual, purpose=blog, audience=consumer
- [ ] Loads fun-blog example

### New Examples
- [ ] Real estate agency example (Summit Realty Group)
- [ ] Law firm example (Barrett & Associates)
- [ ] Both registered in examples/index.ts
- [ ] Both have siteContext filled (purpose/audience/tone/brand)
- [ ] 15+ examples total

### Media Library Expansion
- [ ] 42+ new image entries added to images.json
- [ ] 300+ total images in media catalog
- [ ] Categories covered: food, real estate, legal, nature, tech, people, abstract

---

## Sprint 2: Blog Section Type (P0)

### ADR
- [ ] ADR-034 written (plans/implementation/phase-13/adr-034-blog-section.md)

### Schema + Defaults
- [ ] 'blog' added to section type enum
- [ ] Blog section defaults with 3 sample articles
- [ ] BlogArticle interface: title, excerpt, author, date, tags, featuredImage

### Templates (4 variants)
- [ ] BlogCardGrid.tsx (default — 3-column card grid)
- [ ] BlogListExcerpts.tsx (vertical list with images)
- [ ] BlogFeaturedGrid.tsx (featured article + grid below)
- [ ] BlogMinimal.tsx (text-only, typography-focused)
- [ ] All templates use theme CSS variables
- [ ] All templates responsive

### Editor
- [ ] BlogSectionSimple.tsx created
- [ ] Layout variant selector (4 options)
- [ ] Article list with title/excerpt/author inputs
- [ ] Featured image via ImagePicker
- [ ] Show/hide dates toggle
- [ ] Show/hide tags toggle
- [ ] Add/remove article buttons

### Wiring
- [ ] SimpleTab routes to BlogSectionSimple
- [ ] Template renderer maps blog variants
- [ ] fun-blog example updated to use blog section

---

## Sprint 3: Multi-Page Architecture (P1)

- [ ] ADR-035 written
- [ ] PageConfig interface defined
- [ ] MasterConfig.pages[] (backward compatible)
- [ ] Page management UI in left panel
- [ ] Add/remove/reorder pages
- [ ] Independent section lists per page
- [ ] Preview with nav links
- [ ] Hash routing (#/about, #/services)
- [ ] Specs generate per-page
- [ ] 2-3 page templates
- [ ] Existing single-page configs still work

---

## Sprint 4: Export + Accessibility (P1)

### Export
- [ ] ADR-036 written
- [ ] Export button in toolbar
- [ ] ZIP: all specs (MD + AISP) + config.json
- [ ] Browser Blob API download

### Accessibility
- [ ] A11y audit documented
- [ ] Color contrast checked (WCAG AA)
- [ ] Alt text on images
- [ ] Heading hierarchy
- [ ] Keyboard navigation
- [ ] Critical a11y issues fixed

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
