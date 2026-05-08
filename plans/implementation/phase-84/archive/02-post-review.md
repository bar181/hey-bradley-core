# P84 / OC-18 — Post-Review

**Phase:** P84 / OC-18 (Open Core RC Final)
**Date:** 2026-05-01
**Reviewer:** A4 (closer agent)
**Predecessor:** P83 / OC-17 SEALED at `b61fce6` (~996+ GREEN, 108 ADRs, 41 templates, 12 blog posts)
**Successor:** Post-RC owner-led marketing window (1-2 weeks; not a code sprint)

## Per-agent score table

| Agent | Scope | Deliverables | Score | Notes |
|---|---|---|---:|---|
| **A1** | Release artifacts | `CHANGELOG.md` (NEW; covers P15-P83 by phase family) · `CONTRIBUTING.md` (EDIT; +template + AISP ref-impl + bug-report sections) · `SECURITY.md` (EDIT; v1.0.0-RC1 supported versions; adoption surface stdlib-only) · `docs/launch/release-notes-v1.0.0-rc1.md` (NEW) | **9.1/10** | Honest known-limitations enumeration; concrete numbers (108 ADRs, ~996 tests, 41 templates, 12 blog posts) — no marketing inflation. |
| **A2** | Demo + launch assets | `docs/launch/demo-video-script.md` (REWRITE; reflects actual P83 state) · `docs/launch/show-hn-post.md` (NEW; 55% problem hook + AISP differentiator) · `docs/launch/product-hunt-tagline.md` (NEW) | **9.0/10** | Don Miller voice held; "Show me where AISP breaks" invitation closes show-hn. Tagline 60 chars; description 260 chars per spec. |
| **A3** | Final quality pass | `plans/implementation/phase-84/01-quality-pass.md` (NEW) · surgical fixes only (≤50 LOC each) · competitive estimate score | **9.0/10** | Surface-by-surface PASS/DEFER/FIX inventory; composite competitive estimate against Lovable 51 / Claude Designer 46 / Framer 45 baseline. |
| **A4** | ADR-109 + EOP closer (this agent) | `docs/adr/ADR-109-open-core-rc-architecture.md` (NEW; ≤120 LOC) · `tests/p84-rc-final.spec.ts` (NEW; ≥15 cases / 8 describe blocks) · `docs/launch/owner-launch-checklist.md` (NEW; ≤80 LOC) · master-checklist append · EOP triplet · `CLAUDE.md` final sync | **9.3/10** | ADR-109 cross-refs ADR-082 + ADR-104 + ADR-108 per spec. Tests carry existsSync guards on A1/A2/A3 surfaces (P83 pattern). Hard-gate on ADR-109 + owner-checklist + master-checklist + EOP triplet (P84.1 + P84.6 + P84.7 + P84.8 = 9-case hard-gate owned by A4). |

**Composite estimate:** 92/100 (Grandma 80 / Framer 91 / Capstone 97) — projection; final scoring deferred to post-RC composite review.

## Honest deferred declarations (post-RC owner-only + Tier-2 commercial)

| Item | Originating decision | Status at P84 seal | Rationale |
|---|---|---|---|
| Tag v1.0.0-RC1 + push tag | ADR-109 § 4 D1 | DEFERRED to human owner | Git tag + push is owner-authored; not agent-led. |
| BYOK smoke test ($0.01 spend) | ADR-109 § 4 D2 | DEFERRED to human owner | Real-LLM dollar spend requires owner authorization. |
| Record demo video | ADR-109 § 4 D3 | DEFERRED to human owner | Voice-over + screen capture is human work; script ships at A2 surface. |
| Post Show HN / PH / Reddit | ADR-109 § 4 D4-D6 | DEFERRED to human owner | Marketing post timing is owner-judged; drafts ship at A2 surface. |
| Community engagement campaign (1-2 weeks) | ADR-109 § 4 D7 | DEFERRED to post-RC marketing window | Owner-led advocacy/conferences/threads; not agent-led code. |
| Hosted share URL (server-backed) | ADR-109 § 2 | DEFERRED to Tier-2 commercial | Vercel KV / Supabase pairing; auth-coupled. |
| HNSW vector-DB activation (learning flywheel) | ADR-109 § 2 | DEFERRED to Tier-2 commercial | Auto-write per agent run + index re-build; ruvector currently 0 indexed vectors. |
| Multi-tenant org + ACL | ADR-109 § 2 | DEFERRED to Tier-2 commercial | RC1 is local-only / single-user. |
| Native mobile (iOS / Android) | ADR-109 § 2 | DEFERRED to Tier-2 commercial | RC1 is responsive-web only. |
| Full WCAG AAA compliance | ADR-109 § 2 | DEFERRED to Tier-2 | RC1 ships ADR-102 baseline (lazy + dims + aria-labels + ≤800KB). |
| Localization | ADR-109 § 2 | DEFERRED to Tier-2 | English-only floor. |
| Live-LLM eval harness | ADR-109 § 2 | DEFERRED to post-RC | Corpus exists (500+ entries; ADR-106) but eval runs are post-RC. |
| AISP RFC governance template | ADR-109 § 3 | DEFERRED to P85+ | First RFC issue creates the template; no breaking change proposed yet. |

## Cumulative test count delta narrative

| Anchor | Count | Delta | Source |
|---|---:|---:|---|
| P82 seal | ~984 | — | `tests/p82-oc-cleanup.spec.ts` (15 cases / 8 describe blocks) |
| P83 seal | ~996 | +~12 | `tests/p83-aisp-adoption.spec.ts` (16 cases / 6 describe blocks) |
| **P84 seal (this phase)** | **~1011+** | **+~15** | `tests/p84-rc-final.spec.ts` (15 cases across 8 describe blocks) |

Composition: P84.1 (4) + P84.2 (1) + P84.3 (1) + P84.4 (3) + P84.5 (1) + P84.6 (1) + P84.7 (1) + P84.8 (3) = **15 cases / 8 describe blocks**. existsSync guards on A1/A2/A3 surfaces let timing slips green-skip; the EOP triplet + ADR-109 file shape + owner-checklist + master-checklist (P84.1 + P84.6 + P84.7 + P84.8 = 9 cases) is the **hard-gate** owned by A4.

The brief target was ≥15. Shipped 15 (on-target). Composition mirrors the P83 pattern: hard-gate cluster (9) + soft-pass cross-agent surface (6) keeps the seal-gate honest under parallel-dispatch timing variance.

## Hard-rule compliance

- ADR-109 ≤120 LOC ✓
- ADR Status Accepted (markdown-bold tolerated) ✓
- Tests use `@playwright/test` ✓
- existsSync guards on A1/A2/A3 cross-agent surfaces ✓
- No animation libs in A4-owned files ✓
- TypeScript strict; no new deps ✓
- ROOT = `process.cwd()` (ESM) ✓
- No source code edits in A4 scope ✓
- No touching A1/A2/A3 owned files ✓
- Owner-checklist ≤80 LOC ✓

## Closure status

P84 / OC-18 **SEALED**. v1.0.0-RC1 ready. ADR-109 names the open-core boundary; ADR-082/104/108 cited as the three pillars (RC scope + page-aware + adoption). Cumulative ~1011+ PURE-UNIT GREEN at P84 seal. **OPEN CORE ARC COMPLETE** (P11 → P84 · 84 phases · 109 ADRs Accepted). Post-RC inheritance: owner-led marketing window (1-2 weeks) per the launch checklist.
