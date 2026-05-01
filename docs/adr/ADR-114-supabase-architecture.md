# ADR-114 — Supabase Architecture Decision

- **Status:** Accepted
- **Date:** 2026-05-01
- **Phase:** P89 / TIER2-FOUNDATION
- **Cross-refs:** ADR-016 (Local Database sql.js), ADR-043 (API Key Trust Boundaries), ADR-082 (Open Core RC), ADR-109 (Open Core RC Architecture)

> **Tier-2 planning document — not part of open-core v1.0.0.**
> Implementation source archived at `plans/tier-2/supabase/` per P89b correction.
> Open-core build (this repo's `main` branch) has zero Supabase code references.
> See `plans/tier-2/README.md` for the open-core / Tier-2 boundary.

## Context

v1.0.0-RC1 sealed. Open-core uses local sql.js + IndexedDB persistence (ADR-016). BYOK keys live in localStorage with strict trust boundaries (ADR-043) — keys never cross to a remote server, ever. Tier-2 commercial track begins here with this phase (P89 / TIER2-FOUNDATION) as the architectural gate.

Supabase chosen as the backend-as-a-service for the commercial track because it provides: managed Postgres, OAuth providers, Row-Level Security (RLS), JWT auth, edge functions (future), and real-time subscriptions (future). The chosen scope for P89 is auth + persistence only — real-time and edge functions are explicitly deferred.

The architecture must preserve open-core invariants: BYOK keys never leave the client; the local-only mode (no `VITE_SUPABASE_URL` env var present) runs identically to v1.0.0-RC1 with zero behavioral change. Commercial users opt-in via env config; the Supabase JS SDK is loaded behind a feature flag and is absent from the open-core build path.

## Decisions

### Decision 1 — Auth strategy

- **Magic link** as PRIMARY auth flow (passwordless email; lowest friction; no password-reset surface)
- **Google OAuth** as SECONDARY (one-tap; reduces signup drop-off for users with Google accounts)
- **NO password-based auth** (avoids password-reset flows + breach exposure + storage of password hashes)
- Session: JWT access token + refresh token managed by Supabase JS SDK; **1-hour access expiry**, **30-day refresh**
- Sign-out: full token revocation on logout (both access and refresh)

### Decision 2 — Schema

Tables (5):

```sql
-- users (managed by Supabase auth.users; we add public.users for app-specific fields)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- projects
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  config JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- sessions (chat / listen sessions, FK to projects)
CREATE TABLE public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT now(),
  ended_at TIMESTAMPTZ
);

-- team_members (multi-tenant; deferred to P92 commercial; included for forward-compat)
CREATE TABLE public.team_members (
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'editor', 'viewer')),
  added_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (project_id, user_id)
);

-- share_specs (hosted share URL feature; activated P91)
CREATE TABLE public.share_specs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  share_hash TEXT UNIQUE NOT NULL,
  bundle JSONB NOT NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

RLS policies (high-level):
- `users`: row visible to its own `auth.uid()` only
- `projects`: row visible to owner OR team member; UPDATE restricted by role
- `sessions`: row visible to owner only
- `team_members`: row visible to project members
- `share_specs`: row visible to anyone with `share_hash` (public-by-link); only owner can DELETE

### Decision 3 — BYOK key storage

- API keys (Claude, Gemini, OpenRouter) **STAY in localStorage** per ADR-043
- **NO** `api_key` / `apikey` / `byok_key` columns in any Supabase table
- Schema discipline: explicit denylist on key-shaped column names enforced via schema review (no runtime check needed)
- BYOK trust boundary preserved: client → LLM provider direct; **Supabase never sees keys**

### Decision 4 — Migration path (local sql.js → Supabase)

- User-initiated, idempotent, zero-data-loss
- Step 1: existing JSON-export endpoint serializes all sql.js tables (project, sessions, llm_logs, kv) per existing `exportImport.ts` surface
- Step 2: client uploads JSON to a Supabase RPC `import_local_data(payload jsonb)`
- Step 3: RPC inserts into Supabase tables with conflict-handling (`ON CONFLICT DO NOTHING` for idempotency)
- Step 4: client switches to Supabase mode (feature flag toggle)
- Failure mode: partial import → rollback via transaction; user retries

### Decision 5 — Open-core users (local sql.js path UNCHANGED)

- **No** Supabase JS SDK dependency added to open-core build
- `VITE_SUPABASE_URL` env var ABSENT → app runs identically to today (byte-equivalent behavior)
- All persistence calls route through existing `src/contexts/persistence/db.ts` + repositories
- No code in `src/` depends on `@supabase/*` packages without being behind a feature flag

### Decision 6 — Commercial users (Supabase opt-in)

- `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` env vars present → Supabase mode active
- Account creation flow: magic link → user lands → optionally migrate local data → projects synced to Supabase
- Local sql.js still runs as a write-through cache for offline durability (sync up on reconnect)
- BYOK keys remain client-side only; Supabase mode does **NOT** change key handling
- Feature flag check at app boot: presence of both env vars is required to activate; missing either falls back to open-core local mode

## Out of scope

- Real-time subscriptions (Tier-2 phase 2)
- Edge functions (Tier-2 phase 2)
- Server-side rendering (not planned)
- Billing / Stripe integration (separate sprint)
- Multi-tenant team workspaces (P92; `team_members` schema reserved here)
- Hosted share URL runtime (P91; `share_specs` schema reserved here)

## Acceptance gates

- ADR ≤180 LOC
- Status: **Accepted**
- 6 decisions enumerated
- Schema SQL well-formed (referenceable by A5 to write `schema.sql`)
- BYOK key storage explicitly forbidden from schema

## Consequences

- **Positive:** clean tier-2 boundary; opt-in commercial track; no open-core behavior change; BYOK trust preserved; portable Postgres schema; auth UX is low-friction (magic link primary).
- **Negative:** schema changes require migration plan post-P89; Supabase vendor lock for managed-auth + RLS conveniences; magic-link UX depends on email deliverability.
- **Mitigations:** schema is portable Postgres SQL — could move to self-hosted Postgres later with minimal change; auth via Supabase JS SDK is replaceable behind a thin adapter; email deliverability monitored post-launch and Google OAuth secondary path absorbs failures.
