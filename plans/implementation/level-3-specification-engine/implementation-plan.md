# Level 3: Specification Engine — Implementation Plan

## Prerequisites
- Level 2 complete (all 8 section types, CRUD, vibe onboarding, UX polish)

## Phase 3.1 — Pillar Docs (XAI Docs Tab)
**Goal:** Auto-generate North Star, Architecture, and Implementation Plan specs from current JSON config. Rendered in XAI DOCS tab.
**Definition of Done:**
- Spec templates generate content from configStore state
- HUMAN view renders structured markdown in XAI DOCS tab
- AISP view renders @aisp Crystal Atom format
- Copy/export buttons work for both views
- Specs update live when config changes
- Generated specs are accurate and useful

**Research Requirements:**
- Template literal function patterns for spec generation
- AISP Crystal Atom format reference (see /plans/intial-plans/00.aisp-reference.md)
- Markdown rendering approaches without heavy dependencies

**Deliverables:** Spec template functions (northStar.ts, architecture.ts, implPlan.ts), HUMAN view renderer, AISP view renderer, copy/export functionality, live config subscription

## Phase 3.2 — Site-Level Detail Specs
**Goal:** Per-section specs with exact content and CSS config. Downloadable package for Claude Code.
**Definition of Done:**
- Per-section spec generators produce detailed specifications
- Download produces zip (pillar docs + section specs + config.json)
- Output formatted for Claude Code consumption
- All section types covered by spec generators
- Export is complete and self-contained

**Research Requirements:**
- jszip library API for client-side zip creation
- Claude Code input format requirements
- Section spec template design

**Deliverables:** Per-section spec generator for each of 8 section types, zip download (pillar docs + section specs + config.json), Claude Code formatted output, download UI in XAI DOCS tab
