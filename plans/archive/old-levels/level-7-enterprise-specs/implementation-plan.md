# Level 7: Enterprise Specs — Implementation Plan

## Prerequisites
- Level 6 complete (voice mode working)
- All previous levels functional

## Phase 7.1 — AISP Mode
**Goal:** Toggle enables AISP Crystal Atom prompts for all LLM calls. Measurably lower error rate.
**Definition of Done:**
- AISP mode toggle in settings/toolbar
- When enabled, all LLM prompts use AISP Crystal Atom format
- Measurably lower error rate vs standard prompts (A/B comparison data)
- AISP-formatted prompts produce more precise JSON patches
- Spec output uses full AISP 5.1 Platinum format
- Toggle state persisted

**Research Requirements:**
- AISP 5.1 Platinum specification (see /plans/intial-plans/00.aisp-reference.md)
- Crystal Atom format for prompt construction
- A/B testing methodology for comparing AISP vs natural language prompts
- Ambiguity measurement (Ambig(D) < 0.02 target)

**Deliverables:** AISP mode toggle, AISP-formatted prompt templates, Crystal Atom prompt generator, A/B comparison framework, ambiguity scoring, persistence

## Phase 7.2 — Change Logs
**Goal:** JSON diff version history with timeline and rewind/restore.
**Definition of Done:**
- project_versions table stores JSON diffs per change
- Version timeline UI shows chronological changes
- Each version entry shows: timestamp, change source, summary
- Click version to preview that state
- Rewind/restore to any previous version
- Diff view shows what changed between versions
- Change source tracked (ui, json-editor, llm-chat, llm-voice, llm-listen, import, preset, vibe)

**Research Requirements:**
- JSON diff algorithm (deep-diff or custom)
- Timeline UI component patterns
- Diff visualization approaches
- Storage optimization for version history (deltas vs snapshots)

**Deliverables:** project_versions table + migration, JSON diff utility, version timeline UI, preview at version, rewind/restore, diff viewer, change source tracking

## Phase 7.3 — Full Human Specs
**Goal:** Complete documentation page. Print-friendly. "Copy All for Claude Code" button.
**Definition of Done:**
- Complete documentation page with all pillar docs + section specs
- Print-friendly CSS (clean layout, proper pagination)
- "Copy All for Claude Code" copies formatted spec package
- Table of contents with navigation
- Professional formatting matching enterprise documentation
- All content auto-generated from current config

**Research Requirements:**
- Print-friendly CSS techniques (@media print)
- Document formatting for Claude Code consumption
- Table of contents generation from section headings
- Copy-to-clipboard API for large content

**Deliverables:** Full documentation page, print styles, "Copy All" button, table of contents, professional formatting, auto-generation from config

## Phase 7.4 — AI-First AISP Export
**Goal:** AISP-formatted spec package. Validation scores per section. < 2% ambiguity.
**Definition of Done:**
- AISP-formatted spec package exportable
- Each section has validation score (φ completeness metric)
- Overall ambiguity score displayed (Ambig(D) target < 0.02)
- Validation highlights sections needing improvement
- Export includes: AISP specs, JSON config, human docs, validation report
- Package consumable by Claude Code and other agentic systems
- Quality tier badge (◊⁺⁺, ◊⁺, ◊, ◊⁻) displayed

**Research Requirements:**
- AISP validation scoring algorithm
- Ambiguity measurement implementation
- Quality tier thresholds (◊⁺⁺ ≥ 0.75, ◊⁺ ≥ 0.60, ◊ ≥ 0.40, ◊⁻ ≥ 0.20)
- Agentic system consumption formats

**Deliverables:** AISP export package, validation scoring per section, ambiguity calculator, quality tier badges, improvement suggestions, full export (AISP + JSON + human + validation), download UI
