# Level 4: Auth & Database — Implementation Plan

## Prerequisites
- Level 3 complete (spec engine working)
- Level 2 complete (full builder)

## Phase 4.1 — Supabase Auth + Database
**Goal:** Login/signup, project dashboard, swap LocalStorageAdapter for SupabaseAdapter, auto-save to Supabase.
**Definition of Done:**
- Supabase project configured with auth and database
- Login/signup pages functional with email + social
- Project dashboard shows user's projects
- SupabaseAdapter implements IProjectRepository
- Auto-save writes to Supabase (debounced)
- RLS policies protect user data
- Analytics (PostHog/Mixpanel) integrated
- Error monitoring (Sentry) integrated

**Research Requirements:**
- Supabase Auth setup with React
- Row Level Security (RLS) policy design
- JSONB column design for config storage
- PostHog/Mixpanel React integration
- Sentry error boundary setup

**Deliverables:** Supabase project setup, Auth pages (Login, Signup), Dashboard page, SupabaseAdapter, RLS policies, analytics integration, error monitoring

## Phase 4.2 — Templates from Database
**Goal:** Vibe presets and section templates from database instead of hardcoded files.
**Definition of Done:**
- Templates table populated with vibe presets
- Section templates stored in database
- Onboarding page loads vibes from Supabase
- Template management API works
- Fallback to local presets if offline

**Research Requirements:**
- Supabase real-time subscription for template updates
- Image storage for template previews (Supabase Storage)
- Caching strategy for template data

**Deliverables:** templates table, vibe presets migration, section templates migration, dynamic loading in onboarding, template management, offline fallback

## Phase 4.3 — LLM Pillar Doc Generation
**Goal:** Paste requirements text, LLM generates pillar docs, selects vibe, and populates sections.
**Definition of Done:**
- Text input for pasting requirements
- LLM processes requirements and generates structured output
- Auto-selects appropriate vibe
- Auto-populates all sections from requirements
- Generated content is editable
- Cost tracking for LLM calls

**Research Requirements:**
- Anthropic Claude API setup (server-side proxy via Supabase Edge Functions)
- Prompt engineering for requirements to config mapping
- Rate limiting and cost management
- API key security (never client-side)

**Deliverables:** Requirements input UI, Supabase Edge Function for LLM proxy, prompt templates, auto-vibe selection, auto-section population, cost tracking
