# P84 / OC-18 — Open Core RC Final (Preflight)

> **Phase:** P84 · **Sprint:** OC-18 · **Date:** 2026-05-01
> **Predecessor:** P83 sealed at `b61fce6` (~996+ GREEN, 108 ADRs, 41 templates, 12 blog posts)
> **Cross-refs:** ADR-082 (Open Core RC), ADR-097 (Blog Content Strategy), ADR-104 (Page-Aware Pipeline), ADR-108 (AISP Adoption)
> **Authority:** This is the seal. v1.0.0-RC1 ready when P84 closes.

## Scope — the final seal

P84 is the open-core arc closer. After this seal, the only remaining work is human owner action (tag, BYOK smoke, demo video record, posts). 4 parallel agents on disjoint scopes; one wave; final regression at ≥685.

## 4 parallel agents

### A1 — Release artifacts
**Owns:**
- `CHANGELOG.md` (NEW; ≤350 LOC) — full v1.0.0-RC1 changelog. Group by phase family (P15-P22 foundation; P23-P38 sprints A-F; P39-P53 sprints G-J; P54-P57 moat sprints K-N; P58-P60 RC/QA; P61-P83 OC arc). Honest known-limitations section (Tier-2 deferrals enumerated).
- `CONTRIBUTING.md` (EDIT) — surgical update: add sections for "Contributing templates", "Contributing AISP reference implementations", "Bug reports + feature requests"; reference `examples/3rd-party-consumer/` and `docs/aisp-adoption/` from P83. Cap at ≤220 LOC final.
- `SECURITY.md` (EDIT) — surgical update: reflect P83 adoption surface (3rd-party reference impls run stdlib-only; no eval-on-untrusted-input concerns), update "supported versions" to v1.0.0-RC1. Cap at ≤180 LOC final.
- `docs/launch/release-notes-v1.0.0-rc1.md` (NEW; ≤300 LOC) — GitHub release notes draft. Headline + 5 bullet hero capabilities + "What's in" list + "What's deferred" list + "Adoption quickstart" link to README.

**Constraints:** Read each existing file BEFORE editing. Honest deferred-list (hosted share URL, HNSW activation, multi-tenant, full WCAG AAA, native mobile). NO marketing puffery — concrete numbers (671 tests, 108 ADRs, 41 templates, 12 blog posts, 18 section types, 21 themes).

### A2 — Demo + launch assets
**Owns:**
- `docs/launch/demo-video-script.md` (EDIT) — currently 71 LOC. Rewrite to reflect actual P83 state. Cover: Listen mode (PTT mic + transcript), Chat mode (template intelligence triggers), Full-site simulator (`/demo/full-site`), 5 personalities, 41 templates, multi-page demo (add page → switch → edit), AISP atom trace visibility. ≤180 LOC final.
- `docs/launch/show-hn-post.md` (NEW; ≤120 LOC) — HN Show HN draft. Hook: "55% of LLM coding sessions silently produce wrong output" (the 55% problem). Lead with speed story (sub-second response visible via latency badge — Sprint K). AISP as the differentiator (5-atom Crystal Atom architecture; spec layer is the moat). Link to live demo + GitHub. Honest tone, no hype. End with invitation: "Show me where AISP breaks."
- `docs/launch/product-hunt-tagline.md` (NEW; ≤40 LOC) — Product Hunt copy: 60-character tagline + 260-character description + 3-tag suggestion + screenshot list (5 screenshots).

**Constraints:** Use ACTUAL shipped numbers — no inflation. Reference real CLAUDE.md status. Don Miller voice for show-hn (concrete, founder authority).

### A3 — Final quality pass
**Owns:**
- `plans/implementation/phase-84/01-quality-pass.md` (NEW; ≤300 LOC) — surface-by-surface checklist:
  - Marketing site (`/`, `/about`, `/aisp`, `/research`, `/open-core`, `/how-i-built-this`, `/docs`, `/byok`, `/blog`, `/progress`)
  - Demo routes (`/demo/listen`, `/demo/chat`, `/demo/full-site`)
  - Adoption surface (`docs/aisp-adoption/`, `examples/3rd-party-consumer/`)
  - Mobile surfaces (first-run card, listen fullscreen, mobile menu page selector P82)
  - For each surface, mark PASS / DEFER / FIX with file:line on any FIX needed
- ANY surgical fixes required (small-touch only — if the fix would take >50 LOC defer to post-RC carry-forward)
- Final competitive estimate score (vs Lovable 51, Claude Designer 46, Framer 45 baseline; current SOTA target is ~80; project our composite)

**Constraints:** READ-ONLY survey first; surgical fixes second. Do NOT touch CHANGELOG/CONTRIBUTING/SECURITY (A1), demo-video-script/show-hn/product-hunt (A2), ADR-109/EOP/owner-checklist/CLAUDE.md (A4). If you find broken in A1/A2's territory, FILE ONLY in your quality-pass doc — do not edit those files.

### A4 — ADR-109 + owner checklist + master checklist + EOP closer
**Owns:**
- `docs/adr/ADR-109-open-core-rc-architecture.md` (NEW; ≤120 LOC; Status: Accepted; cites ADR-082, ADR-104, ADR-108)
  - The definitive record of what open-core v1.0.0-RC1 IS and ISN'T
  - Decisions: (1) what ships in open-core (full feature inventory citation); (2) what's deferred to Tier-2 commercial (5+ explicit deferrals); (3) AISP RFC process for breaking changes (semver-ish: aisp-1.X minor backward-compat; aisp-2.0 major requires RFC); (4) post-RC owner-only tasks (tag, BYOK smoke, demo video, posts, community engagement)
- `tests/p84-rc-final.spec.ts` (NEW; ≥15 cases; Playwright `test.describe`/`test`):
  - P84.1 ADR-109 file shape (4)
  - P84.2 CHANGELOG.md exists + non-empty (1)
  - P84.3 Release notes exist (1)
  - P84.4 Demo script + Show HN + PH tagline all exist (3)
  - P84.5 Quality pass doc exists (1)
  - P84.6 Owner launch checklist exists (1)
  - P84.7 Master checklist updated (1)
  - P84.8 EOP triplet (3)
- `docs/launch/owner-launch-checklist.md` (NEW; ≤80 LOC) — human-only post-RC tasks:
  - Tag v1.0.0-RC1
  - BYOK smoke test (5 prompts, ~$0.01 budget)
  - Record demo video (script at `docs/launch/demo-video-script.md`)
  - Post Show HN
  - Share with Agentics Foundation beta
  - AISP community outreach (Twitter/X, LinkedIn, Reddit)
- `plans/implementation/mvp-plan/08-master-checklist.md` (EDIT — append OC-arc completion rows P74-P84; mark all sealed)
- `plans/implementation/phase-84/{02-post-review.md, session-log.md, retrospective.md}` (NEW)
- `CLAUDE.md` (EDIT — final sync; bump ADRs 108 → 109; tests anchor → ~1011+; Current Phase to "P84 / OC-18 SEALED — v1.0.0-RC1 READY"; Open Core arc complete)

**Constraints:** ADR ≤120 LOC; tests use `@playwright/test`; ROOT = `process.cwd()`. Coordinate with A1 — do NOT touch CHANGELOG/CONTRIBUTING/SECURITY/release-notes (A1 owns).

## Hard rules
1. NO new dependencies
2. NO Framer Motion / GSAP / Lottie / React Spring / animejs
3. NO touching files outside owned list
4. NO breaking existing routes / blog rendering
5. Honest content — concrete numbers from CLAUDE.md, no marketing inflation
6. NO shell commands inside agents (except tsc + targeted playwright run + grep/wc verification)
7. TypeScript-strict
8. KISS — surgical fixes; everything that needs >50 LOC of code change is post-RC carry-forward

## Acceptance gates
- CHANGELOG.md complete (covers P15-P83)
- Show HN draft + PH tagline ready
- Demo video script reflects actual P83 state
- Quality pass doc identifies + triages all surface checks
- ADR-109 Accepted; AISP RFC process documented
- Owner launch checklist captures all post-RC human tasks
- ≥15 P84 tests GREEN
- Full session OC chain regression (P62-P84) GREEN — ≥685
- tsc strict clean
- Master checklist marks OC arc COMPLETE

## Carry-forwards (post-RC, owner-only)
- Tag v1.0.0-RC1 + push tag
- BYOK smoke ($0.01 spend)
- Record demo video
- Post Show HN
- Agentics Foundation beta release (20-50 users)
- AISP community outreach campaign

## Carry-forwards (post-RC, Tier-2 commercial)
- Hosted share URL (server-backed)
- HNSW vector-DB activation (learning flywheel)
- Multi-tenant org+ACL
- Native mobile apps (iOS/Android)
- Full WCAG AAA compliance
- Localization
