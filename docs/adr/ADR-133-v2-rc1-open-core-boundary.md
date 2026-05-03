# ADR-133 — v2.0.0-RC1 Open Core Boundary

- **Status:** Accepted
- **Date:** 2026-05-03
- **Phase:** P103 / RC-RELEASE
- **Cross-refs (primary):** ADR-082 (Open Core RC v1 — public release boundary), ADR-109 (v1.0.0-RC1 Architecture — boundary precedent), ADR-122 (Export Claude Code Markdown Bundle), ADR-131 (Agentic Workbench RC Architecture), ADR-132 (Final QA + Token Migration — sibling closer)
- **Cross-refs (secondary):** ADR-104 (Page-Aware Pipeline), ADR-108 (AISP Adoption Standard), ADR-126 (Comprehensive Log Infrastructure)

## Context

P103 closes the v2.0.0-RC1 release-prep arc opened at P102. ADR-131 (P101 / AW-RC) recorded what the **Agentic Workbench architecturally IS**; ADR-132 (P102 / FINAL-QA) records persona re-score after token migration + Agentics live-wire; **ADR-133 (this doc) is the definitive boundary record** — what ships at v2.0.0-RC1 vs what is explicitly Tier-2 or post-RC owner work.

ADR-109 established this pattern at v1.0.0-RC1. ADR-133 extends it to v2: same "boundary as artifact, not vibe" discipline; same RFC-gated AISP versioning; same enumerated owner task list. v2 differs from v1 by adding the three-mode product, the 8-atom AISP suite (was 5+1), and the markdown spec bundle as headline output.

## Decisions

### Decision 1 — v2.0.0-RC1 ship boundary

The release ships:

- **3 modes routed** — `/builder` (Whiteboard) + `/planning` + `/agentics`. Verified `src/main.tsx`. AppShell route-derived per ADR-116.
- **8 Crystal Atoms wired** with ≥1 production import site each: PATCH + INTENT + SELECTION + CONTENT + ASSUMPTIONS + DECOMP + PROCESS + DDD + AGENT. The AISP suite is COMPLETE.
- **132 ADRs Accepted** on disk (IDs ADR-001 — ADR-133 with documented gaps 002-004 / 006-009 / 034-037 / 123-125 reserved + 3 P21 stub-then-superseded duplicates).
- **~1320+ pure-unit tests GREEN** (P101 ~1300+ baseline + P102 final-QA delta ~+20).
- **7-step methodology** — Research → Decompose → Architect → Spec → Plan → Build → Reflect — encoded in Agentics mode + the markdown spec bundle.
- **Asset surface from v1.0.0-RC1 baseline preserved**: 43 templates (41 + 2 E2E-validation) / 21 themes / 18 section types / 12 blog posts.

### Decision 2 — Open-core scope

- **Zero new dependencies beyond the P84 / v1.0.0-RC1 baseline.** No JSZip, no archiver, no `@supabase/supabase-js`, no animation libraries (framer-motion / gsap / lottie / @react-spring / animejs all denylisted), no full-markdown parsers (marked / remark / react-markdown not consumed by SealPanel).
- **Persistence is sql.js + IndexedDB** — local-only, single-user. Schema migrations 001-005.
- **BYOK trust boundary preserved per ADR-043.** Keys never cross to logs (`redactKeyShapes` at every write boundary per ADR-126), never to Supabase scaffolding (zero `api_key|apikey|byok_key` columns in `supabase/schema.sql`; archived to `plans/tier-2/` per P89b), never to the markdown bundle.
- **Headline output is the markdown spec bundle** per ADR-122 — single `.md` with `# === FILE: <path> ===` markers, ≥6 logical files, downstream consumer reads bundle and writes implementation in their own repo.
- **`v2.0.0-RC1` open-core path is byte-equivalent to v1.0.0-RC1 + Agentic Workbench surfaces.** No regression to Whiteboard.

### Decision 3 — Tier-2 deferrals named explicitly

- **Supabase persistence** — ADR-114 + ADR-115 retained as Tier-2 planning docs at `plans/tier-2/supabase/`; src/ implementation removed at P89b.
- **Multi-tenant teams + ACL** — RC ships local-only / single-user.
- **HNSW vector-DB activation** — ruvector is manually-curated static snapshot (126 entries, 0 indexed vectors); auto-write per agent run + HNSW re-index deferred to learning-flywheel runtime.
- **AI-powered review** — KISS reviewer (ADR-129) ships rules-based; LLM-judge enrichment deferred (waits on first owner BYOK smoke run).
- **Commercial SaaS dashboard / Agentic Support System** — original Sprints J/K/L thesis-era scope deferred per `plans/strategic-reviews/open-core-moat-roadmap.md`.
- **Native mobile apps (iOS / Android)** — RC is responsive-web only.
- **Full WCAG 2.1 AAA** — RC ships ADR-102 baseline + ADR-091 canonical-component quality.
- **Localization** — English-only floor.
- **Build-time EOP pre-bake** — Vite plugin reading `plans/implementation/phase-{N}/seal/` deferred per ADR-130 D3 / CF#6.
- **Live-LLM eval harness** — corpus exists (500+ entries; ADR-106) but eval runs are post-RC.

### Decision 4 — Owner-required post-RC tasks

The following are **owner-led human work**, not agent-led code sprints:

- Tag `v2.0.0-RC1` and `git push --tags`.
- **CF#4 — Live LLM BYOK smoke** ($0.05 budget): 5 prompts × 3 providers (Claude / Gemini / OpenRouter); verifies the 5 LIVE-LLM divergence risks named in ADR-127 §9.
- **CF#5 — Real STT calibration**: Web Speech runtime activation is BYOK-gated; first owner run records WER baseline.
- Record demo video (script: `docs/launch/demo-video-script.md`).
- Post Show HN (draft: `docs/launch/show-hn-post.md`) + Product Hunt (`docs/launch/product-hunt-tagline.md`) + Reddit + LinkedIn + Twitter/X.
- Share with Agentics Foundation beta (20-50 users).
- AISP community campaign (1-2 weeks): Twitter/X, LinkedIn, Reddit, AISP open-spec repo.

Full enumeration in `docs/launch/owner-launch-checklist.md`.

### Decision 5 — Carry-forwards CLOSED in P102 (vs ADR-131 registry)

| # | Carry-forward | Status at v2.0.0-RC1 |
|---|---------------|----------------------|
| CF#1 | AGENT_ATOM production wire | **CLOSED** (P97 / ADR-128) |
| CF#2 | PROCESS+DDD persistence | **CLOSED** (P99 / ADR-130) |
| CF#3 | Verb classifier coverage | **CLOSED** (P101 W1) |
| CF#4 | Live LLM verifications | **OWNER-REQUIRED** (post-RC BYOK smoke) |
| CF#5 | Real STT calibration | **OWNER-REQUIRED** (post-RC) |
| CF#6 | Build-time EOP pre-bake | **TIER-2** (Vite plugin; ADR-130 D3) |
| CF#7 | Welcome + Onboarding token migration | **CLOSED** (P102 / ADR-132) |
| CF#8 | Agentics live-map wire | **CLOSED** (P102 / ADR-132) |
| CF#9 | SVG legend strips (ProcessMap + DomainModel) | **POST-LAUNCH** (out of P102 KISS budget) |
| CF#10 | `useChatPipeline` hook extraction | **POST-LAUNCH** |
| CF#11 | Status palette tokens `--hb-status-{sealed,deferred}` | **CLOSED** (P102 / A3) |
| CF#12 | Log enum housekeeping | **CLOSED** (P102 / A3 — INTENT_FUTURE block) |

4 of 6 P102-candidate items closed (CF#7 + CF#8 + CF#11 + CF#12); CF#9 + CF#10 deferred to post-launch as out-of-budget polish.

### Decision 6 — AISP versioning policy (carry from ADR-109 § 3)

The AISP `spec` field follows semver-ish discipline (unchanged from v1):

- **Minor versions** (`aisp-1.X`): backward-compat for adopters. New optional fields, new atoms, new enum values may land in minor bumps without breaking existing 3rd-party parsers.
- **Major versions** (`aisp-2.0`): breaking changes require an **RFC issue** with motivation + migration path + backward-compat shim plan.
- **Current bundle marker** (`aisp-bundle-vN`) aligns with phase number; the AISP `spec` version remains `aisp-1.X` at v2.0.0-RC1 — the suite COMPLETION at 8 atoms is an additive minor evolution, not a breaking change. The polyglot reference impls in `examples/3rd-party-consumer/` (TS + Python, stdlib-only per ADR-108) remain the canonical conformance test surface.

## Acceptance Gates

1. ADR-133 exists at `docs/adr/ADR-133-v2-rc1-open-core-boundary.md`; ≤180 LOC; Status: Accepted.
2. Cross-refs ADR-082 + ADR-109 + ADR-122 + ADR-131 + ADR-132 (sibling closer).
3. P103 EOP triplet present at `plans/implementation/phase-103/seal/{02-post-review,session-log,retrospective}.md`.
4. CLAUDE.md sync: ADR-132 + ADR-133 ledger entries; test count ~1320+; CF#7 / CF#8 / CF#11 / CF#12 marked CLOSED; CF#4 / CF#5 OWNER-REQUIRED; CF#9 / CF#10 POST-LAUNCH.
5. v1.0.0-RC1 boundary precedent (ADR-109) cited; v2 ship inventory matches CHANGELOG `[v2.0.0-RC1]` highlights line.

## Consequences

**Positive:** v2.0.0-RC1 boundary is now an artifact. Future re-scoping decisions cite ADR-133 to settle "is X in or out of v2 open-core?". Owner work is enumerated and bounded — no scope creep into agent sprints post-RC. Carry-forward registry is honest at the seal: 8 of 12 CFs closed, 2 owner-required, 1 Tier-2, 1 explicitly deferred polish.

**Negative:** CF#9 (SVG legend strips) + CF#10 (useChatPipeline hook extraction) shipping deferred — small polish items that didn't fit the P102 30-LOC fix budget. Tier-2 deferral list is 9 items; mitigation per ADR-109 holds (each item has rationale + originating-phase pointer).

**Mitigations:** ADR-133 cross-refs ADR-082 + ADR-109 + ADR-122 + ADR-131 + ADR-132 — five-pillar lineage (open-core RC v1 boundary → v2 boundary → AW architecture → final QA → bundle export). Owner launch checklist (`docs/launch/owner-launch-checklist.md`) is a separate artifact so post-RC tasks don't drift back. P103 seal triplet captures the P102 + P103 combined-sprint velocity story for future reference.
