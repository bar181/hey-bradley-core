# Levels 2-7: Future Phases Overview

**Status:** PLANNED — Not started until Level 1 human review passes

---

## Level 2: Full Site Builder (Phases 2.1-2.3)

**Entry Criteria:** Level 1 complete + human review passed
**Agents:** 10-13 parallel

### Phase 2.1 — Vibe Onboarding
- [ ] Onboarding page with 6+ vibe cards (live mini-previews)
- [ ] "Describe your site" textarea (placeholder for L5.4)
- [ ] "Start from scratch" option
- [ ] Vibe switcher within builder

### Phase 2.2 — All Core Sections (8 types)
- [ ] Pricing: 2-tier, 3-tier, comparison-table
- [ ] Footer: simple, multi-column, minimal
- [ ] Testimonials: cards, carousel, quote-single
- [ ] FAQ: accordion, two-column
- [ ] Value Props: icons-text, numbers, cards
- [ ] Section registry updated
- [ ] Per-section Zod schemas
- [ ] Section add/remove/duplicate
- [ ] Drag-and-drop reorder (@dnd-kit)

### Phase 2.3 — Builder UX Polish
- [ ] Section sidebar navigator
- [ ] Quick actions (move up/down, duplicate, delete)
- [ ] Named project save/load
- [ ] First-time tooltips
- [ ] Accessibility audit
- [ ] "Grandson can show grandma everything"

---

## Level 3: Specification Engine (Phases 3.1-3.2)

**Entry Criteria:** Level 2 complete

### Phase 3.1 — Pillar Docs
- [ ] Auto-generate North Star, Architecture, Implementation Plan from config
- [ ] HUMAN view (structured markdown)
- [ ] AISP view (Crystal Atom format)
- [ ] Live updates when config changes

### Phase 3.2 — Site-Level Specs
- [ ] Per-section spec generators
- [ ] Download zip (pillar docs + section specs + config.json)
- [ ] Claude Code formatted output

---

## Level 4: Auth & Database (Phases 4.1-4.3)

**Entry Criteria:** Level 3 + Supabase infrastructure decision

### Phase 4.1 — Supabase Auth + DB
- [ ] Login/signup UI
- [ ] Project dashboard
- [ ] Swap LocalStorageAdapter → SupabaseAdapter
- [ ] Add PostHog/Mixpanel analytics
- [ ] Add Sentry error monitoring

### Phase 4.2 — Templates from DB
- [ ] Vibe presets from database
- [ ] Section templates from database
- [ ] Image upload via Supabase Storage

### Phase 4.3 — LLM Pillar Doc Generation
- [ ] Paste requirements → LLM generates pillar docs
- [ ] Auto-select vibe + populate sections

---

## Level 5: LLM Functionality (Phases 5.1-5.4)

**Entry Criteria:** Level 4 + **explicit human approval for API costs**

### Phase 5.1 — Chat Bot (Hero)
- [ ] Chat input → LLM → JSON patch → hero updates
- [ ] chatStore.ts for message history
- [ ] Per-user rate limiting

### Phase 5.2 — Copy Suggestions
- [ ] Click section → LLM suggests 3 copy options

### Phase 5.3 — Section Inference
- [ ] Two-step LLM: classify intent → generate patch
- [ ] No section selection required

### Phase 5.4 — Onboarding Purpose
- [ ] "Describe your website" → LLM auto-builds

---

## Level 6: Voice Mode (Phases 6.1-6.3)

**Entry Criteria:** Level 5

### Phase 6.1 — Microphone Button
- [ ] Web Speech API STT
- [ ] Transcript populates chat input

### Phase 6.2 — Listen Mode (Task Queue)
- [ ] Continuous listening, periodic LLM calls (~15s)
- [ ] User approves tasks before applying

### Phase 6.3 — Virtual Whiteboard
- [ ] Auto-apply mode, no approval gate
- [ ] Site updates as user talks

---

## Level 7: Enterprise Specs (Phases 7.1-7.4)

**Entry Criteria:** Level 6

### Phase 7.1 — AISP Mode
- [ ] Toggle enables AISP Crystal Atom prompts
- [ ] Measurably lower error rate

### Phase 7.2 — Change Logs
- [ ] project_versions table with JSON diffs
- [ ] Version timeline with rewind/restore

### Phase 7.3 — Full Human Specs
- [ ] Complete documentation page
- [ ] Print-friendly, "Copy All for Claude Code"

### Phase 7.4 — AI-First AISP Export
- [ ] AISP-formatted spec package
- [ ] Validation scores per section
- [ ] < 2% ambiguity

---

## Dependency Graph

```
Phase 0 → 1.0 → 1.1 → 1.2 → 1.3
                                 │
                                 ▼
                           2.1 → 2.2 → 2.3
                                         │
                               ┌─────────┤
                               ▼         ▼
                         3.1 → 3.2     4.1
                                         │
                               ┌─────────┤
                               ▼         ▼
                             4.2       4.3
                               │
                               ▼
                         5.1 → 5.2 → 5.3 → 5.4
                                               │
                                               ▼
                                         6.1 → 6.2 → 6.3
                                                         │
                                                         ▼
                                                   7.1 → 7.2 → 7.3 → 7.4
```
