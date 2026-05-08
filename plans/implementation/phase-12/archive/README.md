# Phase 12: Tone, Audience, and Content Intelligence

**Prerequisite:** Phase 11 CLOSED (83/100)
**Goal:** Add intelligent content shaping through tone, audience, and site purpose selectors that fundamentally change how specs and previews are generated -- making every output contextually appropriate for its intended use.

---

## Current State Summary

Hey Bradley now has:
- **12 themes** with complete color palettes and font stacks
- **10 examples** across diverse industries (bakery, consulting, fitness, florist, photography, kitchen-sink, launchpad, education, restaurant, blank)
- **258+ images** in the media library
- **4 website pages** (About, Open Core, How I Built This, Docs)
- **10+ chat commands** with multi-section transformations
- **3 listen demos** with voice caption -> build sequences
- **Brand and design locks** for project identity protection
- **6 spec generators** producing North Star, SADD, Build Plan, Features, Human Spec, and AISP output
- **Project save/load** with localStorage + JSON export

What is missing: the builder treats all sites the same regardless of who they're for, what tone they should strike, or what purpose they serve. A SaaS landing page for developers and a bakery website for local customers currently get identical spec language, section suggestions, and copy style. Phase 12 fixes this.

---

## Sprint Plan

### Sprint 1: Tone Selector (P0, 3 hrs)
The tone selector has the **same importance as theme** -- it affects all generated copy, spec language, and content suggestions.

- Add tone selector to the builder UI (same prominence as theme picker)
- Four tones: **Formal**, **Casual**, **Playful**, **Technical**
- Tone stored in MasterConfig as `config.tone`
- Spec generators adapt language based on selected tone:
  - Formal: professional vocabulary, third-person, structured sentences
  - Casual: conversational, second-person, contractions allowed
  - Playful: energetic, emoji-friendly, short punchy sentences
  - Technical: precise terminology, data-driven, specification-oriented
- Preview sections adjust copy style based on tone
- Tone persists in project save/load
- Default tone: Casual (lowest barrier to entry)

### Sprint 2: Audience Picker (P0, 3 hrs)
The audience picker **affects sections, copy, and images** suggested to the user.

- Add audience picker to the builder UI (below tone selector)
- Four audiences: **Consumer**, **Business**, **Developer**, **Enterprise**
- Audience stored in MasterConfig as `config.audience`
- Audience affects:
  - **Section suggestions:** Consumer gets testimonials, gallery, FAQ; Business gets case studies, ROI, team; Developer gets docs, API, changelog; Enterprise gets compliance, SLA, integrations
  - **Copy style:** Consumer = benefits-first; Business = value-proposition; Developer = feature-specs; Enterprise = trust-signals
  - **Image suggestions:** Consumer = lifestyle; Business = professional; Developer = technical; Enterprise = corporate
- Audience persists in project save/load
- Default audience: Consumer

### Sprint 3: Site Purpose Declaration (P0, 3 hrs)
The site purpose **shapes the entire spec output** and section recommendations.

- Add site purpose selector to the builder UI (below audience picker)
- Five purposes: **Portfolio**, **Marketing**, **SaaS**, **Blog**, **Agency**
- Purpose stored in MasterConfig as `config.purpose`
- Purpose affects:
  - **Default sections:** Portfolio = hero + gallery + about + contact; Marketing = hero + features + testimonials + CTA; SaaS = hero + pricing + features + FAQ + docs; Blog = hero + articles + categories + newsletter; Agency = hero + portfolio + team + process + contact
  - **Spec structure:** Purpose-specific templates with relevant sections pre-populated
  - **Navigation style:** Portfolio = minimal; Marketing = conversion-focused; SaaS = feature-rich; Blog = content-first; Agency = portfolio-driven
- Purpose persists in project save/load
- Default purpose: Marketing

### Sprint 4: Brand Guidelines Template + New Examples (P1, 3 hrs)
- Create `brand-guidelines.json` template structure:
  - Voice and tone rules (do's and don'ts)
  - Color usage rules (primary, secondary, accent contexts)
  - Typography rules (heading vs. body, size constraints)
  - Imagery rules (style, subjects, mood)
  - Logo usage rules (minimum size, clear space, backgrounds)
- Brand guidelines stored per project, exported with specs
- 2-3 new examples per audience type:
  - Consumer: e.g., pet store, coffee shop
  - Business: e.g., law firm, accounting
  - Developer: e.g., open-source project, API docs
- Each new example demonstrates tone + audience + purpose combination

### Sprint 5: Quality Pass + Phase Close (P1, 2 hrs)
- Verify all tone/audience/purpose combinations produce distinct outputs
- Build clean, TypeScript clean
- Test count target: 80+ (catch up on test debt)
- Retrospective
- Phase 13 preflight
- Update wiki

---

## Phase 12 Checklist

### Sprint 1: Tone Selector
- [ ] Tone selector UI component created
- [ ] Tone selector placed with same prominence as theme picker
- [ ] `config.tone` field added to MasterConfig schema
- [ ] Formal tone: professional vocabulary, third-person
- [ ] Casual tone: conversational, second-person
- [ ] Playful tone: energetic, punchy
- [ ] Technical tone: precise, data-driven
- [ ] Spec generators adapt language based on tone
- [ ] Preview sections adjust copy style
- [ ] Tone persists in project save/load
- [ ] Default tone set to Casual

### Sprint 2: Audience Picker
- [ ] Audience picker UI component created
- [ ] Audience picker placed below tone selector
- [ ] `config.audience` field added to MasterConfig schema
- [ ] Consumer audience: testimonials, gallery, FAQ suggestions
- [ ] Business audience: case studies, ROI, team suggestions
- [ ] Developer audience: docs, API, changelog suggestions
- [ ] Enterprise audience: compliance, SLA, integrations suggestions
- [ ] Copy style varies by audience
- [ ] Image suggestions vary by audience
- [ ] Audience persists in project save/load
- [ ] Default audience set to Consumer

### Sprint 3: Site Purpose Declaration
- [ ] Site purpose selector UI component created
- [ ] Site purpose selector placed below audience picker
- [ ] `config.purpose` field added to MasterConfig schema
- [ ] Portfolio purpose: gallery-focused defaults
- [ ] Marketing purpose: conversion-focused defaults
- [ ] SaaS purpose: pricing + features + docs defaults
- [ ] Blog purpose: articles + categories + newsletter defaults
- [ ] Agency purpose: portfolio + team + process defaults
- [ ] Spec structure adapts to purpose
- [ ] Navigation style adapts to purpose
- [ ] Purpose persists in project save/load
- [ ] Default purpose set to Marketing

### Sprint 4: Brand Guidelines + New Examples
- [ ] `brand-guidelines.json` template structure defined
- [ ] Voice and tone rules section
- [ ] Color usage rules section
- [ ] Typography rules section
- [ ] Imagery rules section
- [ ] Logo usage rules section
- [ ] Brand guidelines stored per project
- [ ] Brand guidelines exported with specs
- [ ] 2-3 new consumer-audience examples
- [ ] 2-3 new business-audience examples
- [ ] 2-3 new developer-audience examples
- [ ] Each example demonstrates tone + audience + purpose

### Sprint 5: Quality Pass + Phase Close
- [ ] All tone/audience/purpose combinations verified
- [ ] `npx tsc -b` passes
- [ ] `npm run build` succeeds
- [ ] Test count: 80+ total
- [ ] No regressions in existing demos
- [ ] Retrospective written
- [ ] Living checklist updated
- [ ] Session log updated
- [ ] Phase 13 preflight created
- [ ] Wiki updated

---

## Technical Notes

### MasterConfig Schema Changes

```typescript
interface MasterConfig {
  // ... existing fields
  tone?: 'formal' | 'casual' | 'playful' | 'technical';
  audience?: 'consumer' | 'business' | 'developer' | 'enterprise';
  purpose?: 'portfolio' | 'marketing' | 'saas' | 'blog' | 'agency';
  brandGuidelines?: BrandGuidelines;
}
```

### Integration Points
- **Spec generators:** Read tone/audience/purpose from config, adapt language and structure
- **Section suggestions:** Filter and rank based on audience + purpose
- **Preview rendering:** Adjust copy samples based on tone
- **Chat commands:** Tone-aware responses in simulated chat
- **Project save/load:** Include tone/audience/purpose in serialization

---

## Phase 13 Preview: Advanced Features + More Examples

| Feature | Priority |
|---------|----------|
| 10+ new industry-specific examples | P0 |
| Blog article editor with markdown | P0 |
| Image gallery with upload + effects | P1 |
| Custom section builder | P1 |
| A/B variant testing | P2 |
| Multi-page support | P2 |
