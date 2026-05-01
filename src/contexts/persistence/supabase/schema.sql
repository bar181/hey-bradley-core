-- P89 / TIER2-FOUNDATION (A5) — Supabase schema.
-- Per ADR-114 D2.
-- Apply via: supabase db push (after VITE_SUPABASE_URL is configured + P90
-- runtime ships).

-- 1. users (FK to auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. projects
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  config JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_projects_owner ON public.projects(owner_id);

-- 3. sessions
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  ended_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_sessions_project ON public.sessions(project_id);

-- 4. team_members (multi-tenant; full activation P92)
CREATE TABLE IF NOT EXISTS public.team_members (
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'editor', 'viewer')),
  added_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  PRIMARY KEY (project_id, user_id)
);

-- 5. share_specs (hosted share URL feature; activated P91)
CREATE TABLE IF NOT EXISTS public.share_specs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  share_hash TEXT UNIQUE NOT NULL,
  bundle JSONB NOT NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_share_specs_hash ON public.share_specs(share_hash);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.share_specs ENABLE ROW LEVEL SECURITY;

-- users: row visible to its own auth.uid() only
CREATE POLICY users_self_read ON public.users
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY users_self_update ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- projects: owner OR team member can read; owner can write
CREATE POLICY projects_member_read ON public.projects
  FOR SELECT USING (
    auth.uid() = owner_id
    OR EXISTS (SELECT 1 FROM public.team_members tm WHERE tm.project_id = id AND tm.user_id = auth.uid())
  );
CREATE POLICY projects_owner_write ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY projects_owner_update ON public.projects
  FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY projects_owner_delete ON public.projects
  FOR DELETE USING (auth.uid() = owner_id);

-- sessions: row visible to its user only
CREATE POLICY sessions_self_read ON public.sessions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY sessions_self_write ON public.sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- team_members: row visible to project members
CREATE POLICY team_members_member_read ON public.team_members
  FOR SELECT USING (
    auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM public.team_members tm WHERE tm.project_id = team_members.project_id AND tm.user_id = auth.uid())
  );

-- share_specs: anyone with share_hash can read (public-by-link); only project owner can write
CREATE POLICY share_specs_public_read ON public.share_specs
  FOR SELECT USING (true);
CREATE POLICY share_specs_owner_write ON public.share_specs
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.owner_id = auth.uid())
  );
CREATE POLICY share_specs_owner_delete ON public.share_specs
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND p.owner_id = auth.uid())
  );

-- BYOK keys: per ADR-114 D3, NO column for client API keys in any table.
-- Trust boundary: client → LLM provider direct; Supabase never sees keys.
