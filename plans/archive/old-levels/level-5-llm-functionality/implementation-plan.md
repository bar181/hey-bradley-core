# Level 5: LLM Functionality — Implementation Plan

## Prerequisites
- Level 4 complete (Supabase auth, database, LLM proxy available)
- Requires explicit human approval before starting (LLM costs money)

---

## Phase 5.1 — Chat Bot (Hero Only)

**Goal:** Chat input sends text to LLM, receives JSON patch, hero section updates. Simple changes under 2 seconds.

**Definition of Done:**
- chatStore created for message history (Zustand)
- Chat input sends text to LLM via Supabase Edge Function
- LLM returns JSON patch targeting hero section
- Patch validated by Zod before applying to configStore
- Hero updates within 2 seconds of input
- Error handling for invalid patches (retry or user message)
- Chat history visible in left panel

**Research Requirements:**
- Two-step LLM flow: Step 1 classifies intent (<500ms), Step 2 generates patch (<1.5s)
- JSON patch format design for LLM output
- Prompt engineering for reliable JSON generation
- Claude API tool_use for structured output
- Error recovery strategies for malformed LLM responses

**Deliverables:**
- `chatStore.ts` — Zustand store for message history, loading state, error state
- Intent classifier service — Step 1 LLM call for intent classification
- Patch generator service — Step 2 LLM call for JSON patch generation
- Chat input to LLM pipeline — end-to-end message flow
- Zod validation schemas for JSON patches
- Error handling and retry logic
- Chat history UI in left panel

---

## Phase 5.2 — Copy Suggestions

**Goal:** Click section, type changes, LLM suggests 3 copy options with best-practice marketing rules.

**Definition of Done:**
- Clicking a section and editing text triggers copy suggestion flow
- LLM generates 3 copy alternatives per request
- Suggestions appear in a popover/dropdown near the edit point
- User can click to accept a suggestion (applies immediately)
- Suggestions follow copywriting best practices (clarity, CTA strength, brevity)
- Debounced to avoid excessive API calls (minimum 1.5s pause before trigger)

**Research Requirements:**
- UX patterns for inline AI suggestions (GitHub Copilot, Notion AI, Grammarly)
- Copywriting best-practice rules for marketing sites (AIDA, PAS, headline formulas)
- Debounce/throttle patterns for LLM suggestion triggers
- Cost optimization — avoid triggering on every keystroke

**Deliverables:**
- Copy suggestion service — LLM call with copywriting system prompt
- Suggestion UI component — popover with 3 alternatives
- Debounced trigger logic — 1.5s pause detection before API call
- Copywriting rules prompt — embedded best practices for marketing copy
- Accept/dismiss UX — click to apply, escape or click-away to dismiss

---

## Phase 5.3 — Section Inference

**Goal:** LLM infers target section from natural language alone. No need for user to select a section first.

**Definition of Done:**
- User types natural language in chat (e.g., "make the pricing section dark")
- LLM Step 1 classifies: target section + change type + confidence score
- If confidence < 0.7, asks clarification question
- LLM Step 2 generates patch for identified section
- Works across all 8 section types (hero, features, pricing, testimonials, CTA, FAQ, footer, navigation)
- Workflow tab shows pipeline progress (intent classification, patch generation, application)
- Handles ambiguous commands gracefully

**Research Requirements:**
- Intent classification prompt design for 8 section types + global theme changes
- Confidence threshold calibration (0.7 baseline, may need adjustment)
- Clarification UX design — inline chat question vs modal
- Multi-section command handling (e.g., "make hero and pricing dark")
- Section synonym mapping (e.g., "banner" = hero, "plans" = pricing)

**Deliverables:**
- Enhanced intent classifier — supports all 8 section types + theme
- Confidence-based routing — high confidence auto-executes, low confidence asks
- Clarification UI — inline chat question with section options
- Section-aware patch generator — generates patches for any section type
- Workflow tab integration — pipeline progress visualization

---

## Phase 5.4 — Onboarding Purpose

**Goal:** "Describe your website" textarea accepts natural language, LLM parses and populates all sections with appropriate vibe.

**Definition of Done:**
- Onboarding textarea accepts natural language description (200-500 char target)
- LLM processes description into structured config matching configStore schema
- Appropriate vibe auto-selected based on description tone/industry
- All relevant sections auto-populated with generated content
- User sees progressive build (sections appearing one by one)
- Result is fully editable — not locked or read-only
- Works for 60-70% of marketing site descriptions on first attempt

**Research Requirements:**
- Prompt engineering for description to full config generation (single LLM call vs multi-step)
- Progressive rendering UX (streaming SSE or step-by-step section population)
- Fallback behavior for ambiguous or insufficient descriptions
- Vibe classification from natural language (mapping tone words to vibe presets)
- Industry detection for better default content

**Deliverables:**
- Enhanced onboarding UI — textarea with character count and example prompts
- Description to config LLM pipeline — parses description into full site config
- Progressive build animation — sections appear sequentially with fade-in
- Vibe auto-selection — maps description tone to available vibes
- Section auto-population — fills all sections with contextually relevant content
