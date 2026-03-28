# Level 4: Auth & Database — Rubric

> Scoring criteria for evaluating Level 4 implementation quality.

## Scoring Scale
| Score | Meaning |
|-------|---------|
| 0 | Not implemented |
| 1 | Partially implemented, major gaps |
| 2 | Implemented with minor issues |
| 3 | Fully implemented, meets all criteria |

---

## Phase 4.1 — Supabase Auth + Database

| # | Requirement | Score (0-3) | Notes |
|---|-------------|-------------|-------|
| 4.1.1 | Supabase project configured with auth and database schema | | |
| 4.1.2 | Login page functional with email + social auth | | |
| 4.1.3 | Signup page functional with email verification | | |
| 4.1.4 | Project dashboard displays user's projects with create/open/delete | | |
| 4.1.5 | SupabaseAdapter implements IProjectRepository interface | | |
| 4.1.6 | RLS policies prevent cross-user data access | | |
| 4.1.7 | Auto-save writes to Supabase with debouncing (no data loss) | | |
| 4.1.8 | Analytics (PostHog/Mixpanel) tracks key user actions | | |
| 4.1.9 | Error monitoring (Sentry) captures and reports errors | | |
| 4.1.10 | Database migration scripts are versioned and repeatable | | |
| 4.1.11 | Auth state persists across page refreshes | | |

**Phase 4.1 Total:** __ / 33

---

## Phase 4.2 — Templates from Database

| # | Requirement | Score (0-3) | Notes |
|---|-------------|-------------|-------|
| 4.2.1 | Templates table created and populated with vibe presets | | |
| 4.2.2 | Vibe presets load from Supabase on onboarding page | | |
| 4.2.3 | Section templates stored in database and retrievable | | |
| 4.2.4 | Dynamic loading replaces hardcoded template imports | | |
| 4.2.5 | Template management API supports CRUD operations | | |
| 4.2.6 | Offline fallback loads local presets when Supabase unavailable | | |
| 4.2.7 | Template preview images stored in Supabase Storage | | |

**Phase 4.2 Total:** __ / 21

---

## Phase 4.3 — LLM Pillar Doc Generation

| # | Requirement | Score (0-3) | Notes |
|---|-------------|-------------|-------|
| 4.3.1 | Requirements text input UI with clear instructions | | |
| 4.3.2 | Supabase Edge Function proxies LLM calls securely | | |
| 4.3.3 | Prompt templates produce accurate, structured output | | |
| 4.3.4 | Auto-selects appropriate vibe based on requirements | | |
| 4.3.5 | Auto-populates all sections from requirements content | | |
| 4.3.6 | Generated content is fully editable after population | | |
| 4.3.7 | Cost tracking records token usage and estimated cost per call | | |
| 4.3.8 | Rate limiting prevents abuse (per-user, per-hour) | | |

**Phase 4.3 Total:** __ / 24

---

## Overall Metrics

| Metric | Target | Actual |
|--------|--------|--------|
| Phase 4.1 Score | >= 27 / 33 | |
| Phase 4.2 Score | >= 18 / 21 | |
| Phase 4.3 Score | >= 20 / 24 | |
| **Combined Score** | **>= 65 / 78** | |
| Auth login/signup time | < 3s | |
| Auto-save debounce | 1-2s | |
| RLS policies block cross-user access | Yes | |
| Template load time (cached) | < 500ms | |
| LLM generation time | < 15s | |
| API keys never exposed client-side | Yes | |
| Offline fallback works | Yes | |
