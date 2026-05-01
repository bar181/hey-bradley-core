# Hey Bradley Tier-2 (Commercial Track)

> Status: planning + scaffolding. Not part of open-core v1.0.0-RC1.
> Last updated: 2026-05-01.

## §1 The boundary

**Open core (this repo, `main` branch — sealed at v1.0.0-RC1 per P84):**

- Local persistence only: `sql.js` + IndexedDB.
- BYOK keys (Claude / Gemini / OpenRouter) live in `localStorage`.
- ALL data — projects, sessions, AISP bundles, llm_logs — stays on the user's
  device. No backend. No auth. No telemetry. No phone-home.
- Static-HTML export is the only egress; user owns the artifact.

**Tier-2 commercial track (this directory + a separate fork or branch):**

- Managed Postgres via Supabase (auth + RLS + JWT + edge functions).
- Magic-link primary auth + Google OAuth secondary (no passwords).
- Multi-tenant team workspaces (P92).
- Hosted share URLs (P91).
- HNSW vector search activation (deferred from open-core per ADR-082).
- Real-time subscriptions + edge functions (Tier-2 phase 2).
- Telemetry opt-in + billing surface (Stripe; P93).

**Critical invariant: BYOK keys NEVER cross to Tier-2.** Per ADR-043 and
ADR-114 Decision 3, API keys stay client-side in every mode. Commercial
deployments preserve the trust boundary; the Supabase schema carries an
explicit denylist on `api_key` / `apikey` / `byok_key` column names — the
client → LLM-provider direct call is never proxied through Tier-2.

## §2 What's in this directory

- `supabase/index.ts` — TypeScript stub interfaces matching the
  `@supabase/supabase-js` surface. Stubs throw at runtime; ready for the real
  SDK to be wired by the commercial fork.
- `supabase/auth.ts` — magic-link + Google-OAuth function signatures. Stubs
  throw `not yet wired` until the commercial fork installs the SDK.
- `supabase/schema.sql` — 5-table schema (`users` / `projects` / `sessions` /
  `team_members` / `share_specs`) + RLS policies; ready to apply via
  `supabase db push` once the commercial fork activates.
- `featureFlag-archived.ts` — `isSupabaseMode()` reading
  `import.meta.env.VITE_SUPABASE_URL`; archived from open-core `src/` per the
  P89b correction.

## §3 ADR catalog

- **ADR-114** — Supabase Architecture Decision (auth strategy + 5-table
  schema + RLS + BYOK trust boundary + sql.js → Supabase migration path).
  Status: Accepted. Flagged Tier-2 planning doc.
- **ADR-115** — Feature Flag Architecture (`VITE_SUPABASE_URL` build-time
  env-var presence selects backend; build-time-not-runtime; no mixed mode).
  Status: Accepted. Flagged Tier-2 planning doc.

Both ADRs remain Accepted — the architectural decisions are correct; only
the implementation venue moved out of `src/`.

## §4 Activation path

The Tier-2 commercial fork (separate repo or branch) wires the runtime:

1. `npm install @supabase/supabase-js` — the dep open-core never installs.
2. Set `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` env vars at build.
3. Apply `supabase/schema.sql` via `supabase db push` (creates the 5 tables
   + RLS policies + indices).
4. Wire `featureFlag-archived.ts` back into `src/contexts/persistence/`.
5. Implement runtime in `auth.ts` — replace stubs with real
   `createClient(...)` calls + magic-link + OAuth handlers.
6. Wire migration tool: `exportImport.ts` JSON export → Supabase
   `import_local_data(payload jsonb)` RPC (idempotent;
   `ON CONFLICT DO NOTHING`).

The open-core fork remains untouched. v1.0.0-RC1 ships unchanged; users
running open-core never see Supabase code (tree-shaking removes any unused
branches if they exist on the same source tree).

## §5 Open-core invariants Tier-2 must preserve

- **BYOK keys client-side only** (ADR-043). No `api_key` / `apikey` /
  `byok_key` columns; no proxy of LLM calls through Tier-2 backend.
- **AISP bundle schema stable across `aisp-1.X`** (ADR-108). Minor versions
  must remain backward-compatible; major version bumps require an RFC.
- **Spec quality ≥ open-core baseline** (ADR-101). Static-HTML export
  remains valid HTML5; AISP filenames remain versioned.
- **Performance ≥ open-core baseline** (ADR-102). Bundle gzip ≤800KB;
  routes lazy-loaded; images lazy with explicit dims.
- **ADR-091 canonical component quality** holds for any new commercial UI
  (hover-lift, focus-visible, token-derived spacing/colors).
