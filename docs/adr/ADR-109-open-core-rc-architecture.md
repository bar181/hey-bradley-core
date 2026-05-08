# ADR-109 — Open Core v1.0.0-RC1 Architecture

- **Status:** Accepted
- **Date:** 2026-05-01
- **Phase:** P84 / OC-18
- **Cross-refs (primary):** ADR-082 (Open Core RC — public release boundary), ADR-104 (Page-Aware Pipeline — multi-page wire), ADR-108 (AISP Adoption Standard — adoption surface)
- **Cross-refs (secondary):** ADR-053 (INTENT_ATOM — first Crystal Atom), ADR-090 (Mobile UX Redesign), ADR-098 (Template Intelligence Architecture), ADR-107 (OC-CLEANUP Standard)

## Context

84 phases sealed (P11 → P83). 108 ADRs Accepted. ~996+ cumulative PURE-UNIT tests across the full session OC chain (P62 → P83). The v1.0.0-RC1 boundary is defined here: ADR-109 is the **definitive record of what open-core IS and what it is NOT**. Everything below the line is RC1; everything above is Tier-2 commercial or post-RC owner work.

The OC arc (P74 → P83) consolidated the moat: AISP 5-atom Crystal Atom architecture (ADR-053/057/060/064/099), Template Intelligence 3-layer libraries (ADR-098), multi-page wire (ADR-103/104), AISP adoption surface (ADR-108). P84 closes by naming the boundary.

## Decision

ADR-109 names four standards governing v1.0.0-RC1 from this seal forward.

### 1. What ships in open-core v1.0.0-RC1

- **Spec-first AI website builder** with three modes: Listen (PTT mic + Web Speech STT), Chat (template-first routing), Build (DRAFT/EXPERT toggles)
- **AISP Crystal Atom architecture (5+1 atoms):** INTENT, SELECTION, CONTENT, ASSUMPTIONS, plus DECOMP_ATOM (front-of-pipeline multi-clause splitter; ADR-099)
- **BYOK across 3 providers:** Claude, Gemini, OpenRouter (5-adapter matrix incl. simulated + mock; ADR-046)
- **Multi-page support** with page-aware chat pipeline (ADR-103/104) + mobile drawer page selector (ADR-107)
- **41 vertical-positioned templates** (37 baseline + 4 OC-15 agentic-product family; ADR-105)
- **Template Intelligence:** 21 themes + 15 section arrangements + 15 content styles, all with `exampleQueries` (ADR-098)
- **18 section types** including blog + case-study + contact-form (ADR-100)
- **12 blog posts** meeting the ADR-097 literal floor (P82 closure)
- **Static HTML export** + content-addressable share URL stub + ZIP export (ADR-080/081)
- **AISP adoption surface:** README quickstart + `docs/aisp-adoption/` guide tree + `examples/3rd-party-consumer/` polyglot reference impls (TS + Python, stdlib-only; ADR-108)

### 2. What's deferred to Tier-2 commercial

- **Hosted share URL** (real backend on Vercel KV / Supabase); RC1 ships content-addressable stub only
- **HNSW vector-DB learning flywheel** — index re-build + auto-write per agent run; RC1 ruvector is manually-curated static snapshot (126 entries, 0 indexed vectors)
- **Multi-tenant org + ACL** — RC1 is local-only / single-user
- **Native mobile apps** (iOS / Android) — RC1 is responsive-web only
- **Full WCAG 2.1 AAA compliance** — RC1 ships ADR-102 baseline (lazy + dims + aria-labels + ≤800KB)
- **Localization** — RC1 is English-only floor
- **Live-LLM eval harness** — corpus exists (500+ entries; ADR-106) but eval runs are post-RC
- **Tier-2 SaaS dashboard / Agentic Support System** — original Sprints J/K/L deferred per `plans/strategic-reviews/open-core-moat-roadmap.md`

### 3. AISP versioning policy

The AISP `spec` field follows a semver-ish discipline:

- **Minor versions** (`aisp-1.X`): backward-compat for adopters. New optional fields, new atoms, new enum values may land in minor bumps without breaking existing 3rd-party parsers.
- **Major versions** (`aisp-2.0`): breaking changes require an **RFC issue** with motivation + migration path + backward-compat shim plan. RFC governance lands in P85+ if/when first breaking change is proposed.

The polyglot reference impls in `examples/3rd-party-consumer/` (TS + Python, stdlib-only per ADR-108) are the canonical conformance test surface for any future minor bump.

### 4. Post-RC owner-only tasks

The following are **owner-led human work**, not agent-led code sprints:

- Tag `v1.0.0-RC1` and `git push --tags`
- BYOK smoke test: 5 prompts × 3 providers; budget ~$0.01
- Record demo video (script: `docs/launch/demo-video-script.md`)
- Post Show HN (draft: `docs/launch/show-hn-post.md`)
- Submit Product Hunt (copy: `docs/launch/product-hunt-tagline.md`)
- Share with Agentics Foundation beta (20-50 users)
- AISP community outreach campaign (1-2 weeks: Twitter/X, LinkedIn, Reddit, AISP open-spec repo announcement)

## Acceptance gates per decision

1. **D1:** Feature inventory in §1 matches CLAUDE.md "Capabilities" line at P83 seal verbatim. RC1 boundary is the union of P11-P83 sealed scope; nothing post-P83 in-flight.
2. **D2:** Tier-2 deferral list is exhaustive per `plans/strategic-reviews/open-core-moat-roadmap.md` + `plans/deferred-features.md`. No silent drops; every item has a phase-of-origin pointer.
3. **D3:** AISP versioning policy is documented in this ADR + cross-linked from `docs/aisp-adoption/01-bundle-schema.md` (P83 / A2 surface). RFC process is post-RC governance work, not RC1 deliverable.
4. **D4:** Owner launch checklist (`docs/launch/owner-launch-checklist.md`) enumerates §4 tasks. ADR-109 + checklist + EOP triplet is the hard-gate for P84 seal.

## Consequences

**Positive:**
- The v1.0.0-RC1 boundary is now an artifact, not a vibe. Future re-scoping decisions cite ADR-109 to settle "is X in or out of open-core?".
- AISP versioning policy gives 3rd-party adopters a stability contract: minor bumps safe, major bumps gated by RFC.
- Owner work is enumerated and bounded — no scope creep into agent-led sprints post-RC.
- Cross-refs to ADR-082/104/108 chain the open-core arc into a single citable lineage.

**Negative:**
- The Tier-2 deferral list is 8 items; some adopters will read "deferred" as "broken" without context. Mitigation: each item has a rationale and originating-phase pointer in §2.
- AISP RFC governance is documented but not yet operationalized (no `RFC-001` template). Mitigation: RFC process is post-RC work; first RFC issue creates the template.

**Mitigations:**
- ADR-109 cross-refs ADR-082 (RC scope) + ADR-104 (page-aware) + ADR-108 (adoption) — three pillars of the open-core moat. Future readers can chain back through the lineage.
- Owner launch checklist is a separate artifact (`docs/launch/owner-launch-checklist.md`) so post-RC tasks don't drift back into agent sprint planning.
- P84 seal includes EOP triplet (post-review, session-log, retrospective) capturing the OC arc velocity story (P74→P84 in ~10 sprints) for future reference.
