# P89b — Retrospective (TIER2-CLEANUP)

> **Phase:** P89b · **Sprint:** TIER2-CLEANUP · **Date:** 2026-05-01

## Keep

- **Surgical ADR edits over rewrites.** ADR-114 + ADR-115 retained their
  Status: Accepted; only a Tier-2 marker line was prepended. The
  architectural decisions are correct — only the implementation venue moved.
- **Recursive-walk forbidden-token tests.** The P89b.1 spec walks
  `src/contexts/persistence/`, `src/store/`, `src/components/` and counts
  occurrences of `supabase\|isSupabaseMode\|VITE_SUPABASE`. This pattern is
  reusable for any future commercial-leak audit.
- **2-agent disjoint-scope dispatch.** A1 (source moves) + A2 (docs/tests/EOP)
  ran parallel; A2 never touched source, A1 never touched ADRs/tests. Zero
  collision.
- **Tier-2 README as the boundary document.** `plans/tier-2/README.md`
  becomes the single referenceable place that names the open-core / Tier-2
  split: §1 boundary, §2 directory contents, §3 ADR catalog, §4 activation
  path, §5 invariants Tier-2 must preserve.

## Drop

- **Eager open-core landings of commercial scaffolding.** P89 placed
  Supabase code inside `src/` — wrong venue. Future commercial-track sprints
  should land their planning docs + scaffolding under `plans/tier-2/` from
  the start, never in `src/` (open-core build path).
- **"It's just stubs, it's fine"** reasoning for crossing the open-core
  boundary. Even non-functional stubs leak intent; tree-shaking is not a
  trust boundary.

## Reframe — open-core boundary discipline

**Every commercial-flavored sprint must verify zero leak into open-core
`src/`.** This becomes a standing rule. The verification mechanism:
recursive-walk forbidden-token grep at seal time.

The standard 1-4 phase process (per CLAUDE.md) gains an implicit Step 0
for any sprint touching Tier-2 surfaces:

> **Step 0 — Boundary verify.** Before sealing, confirm
> `grep -rn "<commercial-token>" src/` returns 0 matches. If it doesn't,
> that's a P89b-style cleanup sprint, not a seal.

## Carry-forward

- **Tier-2 commercial fork activation** — separate repo / branch; post-RC
  owner-led; install Supabase JS SDK + env vars + schema + auth wiring
- **Migration tool** (sql.js JSON export → Supabase `import_local_data` RPC)
  — P91 commercial track candidate
- **Multi-tenant team workspaces** — P92 commercial track
- **Stripe / billing surface** — P93 commercial track
- **Real-time subscriptions + edge functions** — Tier-2 phase 2
- **Graceful Supabase → local outage fallback** — Tier-2 phase 2 (offline-
  first sync layer + conflict resolution)
- **CLAUDE.md ADR count bump to 116** — owner-deferred to P90/A5 closer
  (this sprint adds NO new ADR; markers only)

## Risks acknowledged

- **Two artifacts to maintain.** Open-core binary + commercial binary fork
  remain separate per ADR-115 D3 build-time-not-runtime principle. This is
  by design; cost is accepted.
- **Env-var typos silently fall back to open-core.** Per ADR-115 D4
  Mitigations, commercial deploy script must assert both `VITE_SUPABASE_URL`
  + `VITE_SUPABASE_ANON_KEY` non-empty before build (fail-fast).

## Score

P89b is a corrective sprint, not a feature seal. Score is binary:
- **PASS** — open-core boundary restored; ADRs marker-tagged; tier-2
  README ships; tests green; EOP triplet present.
- **FAIL** — any of the above missing.

Result: **PASS** (per A1 verification: `grep -rn ... src/` → 0 matches;
A2 verification: 4 describe blocks / 8 cases GREEN).
