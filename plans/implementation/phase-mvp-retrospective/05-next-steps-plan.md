# Hey Bradley — Next-Steps Plan (Pending Human Review)

> Date: 2026-05-04 · Phase: MVP-RETRO
> Status: Action-oriented; ≤2-5 future phases anticipated · Signal-driven activation
> Cites: `01-process-retrospective.md` · `02-market-positioning.md` · `04-capstone-comparison.md` · `plans/strategic-reviews/2026-05-04-design-dev-bridge-positioning.md` · `docs/launch/owner-launch-checklist.md`

## Executive summary

The MVP is launch-ready: v2.0.0-RC1 sealed at P103 + connections layer + funnel CTAs + pre-launch sprint at `ee460b1` (per `01-process-retrospective.md` §1.8). What's owner-gated next is the 17-item publish sequence in `docs/launch/owner-launch-checklist.md` — tag, deploy, BYOK smoke, Show HN, marketplace listings, beta dispatch — none of which is swarm work. What waits on user signal is the next 2-5 phases of product investment, scoped per the design/dev bridge memo's hard rule: ship MVP, watch L3-L5 signal, build Agentic IDE v0 *after* data confirms the primary market hypothesis (per bridge doc §"Hard rule — no pre-emptive Agentic IDE work").

## 1. Owner-required publish sequence (Week 1)

Per `docs/launch/owner-launch-checklist.md` (17 items consolidated below). All owner-only; zero swarm dispatch.

1. **CF#4 BYOK live LLM smoke** — 5 prompts × 3 providers (Claude / Gemini / OpenRouter); ~$0.05 budget; verify schema rejection / latency / Crystal Atom compliance / cost cap with real Haiku (per ADR-131 carry-forward).
2. **`git tag v2.0.0-RC1 && git push --tags`** — release-day immediate.
3. **GitHub release** — paste from `docs/launch/release-notes-v2.0.0-rc1.md`.
4. **heybradley.app deploy** — production push of the open-core build.
5. **Plugin → Claude Code marketplace** — `bar181/hey-bradley` repo listing per connections layer P3 framing.
6. **NPX → npm publish** — `cd connections/npx && npm publish` (note: standalone MCP publish blocked on G5 ESM `.js`-extension fix per `01-process-retrospective.md` §4.5; CN-1..CN-8 carry-forwards in `connections/docs/seal/retrospective.md`).
7. **Show HN post** — Tuesday/Wednesday 9am ET; draft at `docs/launch/show-hn-post.md`.
8. **Product Hunt launch** — copy at `docs/launch/product-hunt-tagline.md`.
9. **Reddit r/programming + r/SideProject + r/LocalLLaMA** — per checklist § Community engagement.
10. **LinkedIn long-form post** — Don Miller voice; founder authority; three-mode workbench framing.
11. **Twitter/X thread** — 55% problem + AISP 8-atom suite.
12. **Agentics Foundation beta dispatch** — ~20-50 invitees per checklist § Distribution.
13. **AISP open-spec repo announcement** — `github.com/bar181/aisp-open-core` link.
14. **CF#5 STT calibration** — real microphone + browser test.
15. **Lighthouse audit** — ≥85 mobile (per ADR-112 declared standard).
16. **Cross-browser visual regression** — Firefox / Safari beyond chromium-only test floor.
17. **Screen-reader audit + WCAG AA contrast verification** — NVDA / VoiceOver pass; demo video record.

## 2. Watch-for signals (Week 2-3 post-launch)

Per design/dev bridge memo §"Post-launch sequencing — DO NOT pre-build" — three signals before next-phase scope locks:

- **Volume signal** — Are L3-L5 Cursor / Claude Code users the dominant cohort hitting `/spec-init` and `/spec-export` (the plugin commands)? Confirms primary market hypothesis (per `02-market-positioning.md` §2.3).
- **Pain signal** — Is "I can't keep my project context across sessions" the most-cited friction in user feedback? Confirms Agentic IDE v0 demand.
- **Conversion signal** — Are L3-L5 users completing the Plugin → heybradley.app → back-to-Claude-Code loop? Or dropping at the handoff?

If all three positive → Phase A (Agentic IDE v0). If mixed → review primary-market hypothesis; design stage may be load-bearing instead. If silent → marketing problem, not product problem; awareness investment before more building.

## 3. Likely future phases (signal-driven; 2-5 anticipated)

### 3.1 Phase A — Agentic IDE v0 (Priority 2 per bridge doc)

**Trigger:** All 3 watch-for signals positive (L3-L5 dominant + context-loss top friction + conversion completing).
**Mandate:** 2 capabilities only — persistent project context across sessions + session scope (per bridge doc §"Agentic IDE v0 — minimum viable surface").
**Scope:** Builds on existing SessionStart hook primitive (per ADR-C03); makes that hook a product surface. Capability 1 loads spec automatically across sessions; Capability 2 enforces ownedFiles + gate conditions ("you own src/auth/, you do not touch src/billing/").
**Cap:** ~3 sprints / 1 month at observed velocity.
**NOT included:** AISP discipline · wave-gate coordination · drift detection · Crystal Atoms (those land in Phases C+ per bridge doc §"Priority stack").

### 3.2 Phase B — Web app Level 2 expansion

**Trigger:** "I can't spec web app entities" cited as top complaint by ≥30% of design-stage feedback (per `04-capstone-comparison.md` §6.4 carry-forward).
**Mandate:** Expand MasterConfig schema with entities / flows / integrations (currently L1 marketing-site coverage only per `01.north-star.md` line 73-74 original scope).
**Scope:** New Σ blocks for Level 2 specs · Builder mode supports entity-relationship diagrams · QuickAdd new categories · CLAUDE.md export sections for data model + integration map. Reuses existing PROCESS_ATOM (ADR-118) + DDD_ATOM (ADR-119) shapes.
**Cap:** ~3 sprints / 1 month.

### 3.3 Phase C — Whiteboard executive ideation focus

**Trigger:** Founders / PMs (Group 1 Design Stage per `02-market-positioning.md` §2.1) report Whiteboard mode is the primary surface they use; design-stage signal exceeds dev-stage volume.
**Mandate:** Executive-grade ideation tooling — drag-to-rearrange phase reordering · multi-layout templates · Don Miller pitch-slide generator from spec.
**Scope:** Whiteboard mode upgrades; uses existing PROCESS_ATOM + DDD_ATOM. No new atoms. Activates the founder/PM tier of the L2-L9 ladder by giving them an executive-ready output (currently the markdown bundle per ADR-122 is the only export path).
**Cap:** ~2 sprints / 2 weeks.

### 3.4 Phase D — L4+ agentic dev support (Wave coordination + AISP visibility)

**Trigger:** L5-L7 power users cited as second-largest cohort; "I want disjoint-ownedFiles enforcement" requested explicitly; AISP RFC participation begins.
**Mandate:** Promote AGENT_ATOM disjoint-ownedFiles from convention to runtime gate · spec drift detection · CI integrations (GitHub Actions reading spec bundle + comparing to disk).
**Scope:** Phase 4+ from priority stack (per bridge doc §"Priority stack"); matches Wave 4 Rust crate enhancements (deferred per ADR-C07 D7 — currently scaffolded, not shipped per `04-capstone-comparison.md` §6.4).
**Cap:** ~4 sprints / 5-6 weeks.

### 3.5 Phase E — MCP standalone publish (deferred per pre-launch sprint decision)

**Trigger:** Cursor users explicitly request standalone MCP outside the plugin path; or Claude Desktop users hit MCP discovery friction.
**Mandate:** Fix G5 ESM publish-blocker (NodeNext + explicit `.js` imports per `01-process-retrospective.md` §4.5) · publish hey-bradley-mcp to npm · Cursor `.cursor/mcp.json` examples.
**Scope:** ~3 LOC tsconfig change + npm publish + docs. Smallest of the proposed phases; could land same-day if signal arrives early.
**Cap:** ~1 sprint / 1 week.

## 4. Phase prioritization matrix (signal-conditional)

| Phase | Trigger | Reward | Risk-if-wrong | Sequence-hint |
|---|---|---|---|---|
| **A — Agentic IDE v0** | All 3 signals positive | Captures primary L3-L5 market | Cursor / Anthropic builds it natively (Risk 1+2 per `02-market-positioning.md` §8) | After Week 4 if signal converges |
| **B — Level 2 web-app specs** | "I can't spec entities" ≥30% of feedback | Activates L3-L5 building real products | Premature — adds schema complexity before signal | Mid-Phase A if same cohort overlaps |
| **C — Whiteboard executive** | Design Stage ≥ Dev Stage volume | Activates founder/PM TAM (larger long-tail per §3.4) | Diverts from L3-L5 primary market | Only if dev-stage signal is silent |
| **D — L4+ agentic dev** | AISP RFC participation begins | L5-L7 credibility loop · enterprise lead-gen | Academic over-investment if L3-L5 signal still building | After Phase A ships and stabilizes |
| **E — MCP standalone publish** | Cursor user request volume | Closes G5 publish-blocker; broadens distribution | Nominal — small scope, low risk | Same-day if signal arrives early |

Anti-patterns to avoid (per bridge memo §"Hard rule"): pre-emptive Agentic IDE scaffolding · session-scope enforcement before user request · persistent-context architecture research · wave-gate coordination pre-build. None of these starts before signal data arrives.

## 5. What stays deferred indefinitely

Per `release-notes-v2.0.0-rc1.md` §"Known limitations" + `01-process-retrospective.md` §6 carry-forward registry + `04-capstone-comparison.md` §4:

- **Multi-tenant teams** — Tier-2 / ADR-114 (Supabase architecture decision; archived to `plans/tier-2/` after P89b boundary correction).
- **Supabase persistence** — Tier-2 / ADR-115 (build-time feature flag scaffolded; runtime install deferred).
- **HNSW vector-DB activation** — currently 0 indexed vectors; ruvector is manually-curated 126-entry static snapshot per `plans/implementation/phase-61/03-ruvector-state.md`.
- **Native mobile apps (iOS/Android)** — original `01.north-star.md` line 136 explicitly out-of-scope; responsive web at 375/390/428px is the floor.
- **Localization** — English-only; i18n scaffolded but deferred per ADR-109 Tier-2 list.
- **AI-powered review (LLM-judge)** — beyond rule-based KISS reviewer (ADR-129); requires live AgentProxy round-trip.
- **Live cross-tab persistence** — BroadcastChannel pattern noted as P101 carry-forward; not implemented.
- **Real-time observability dashboard / cross-session analytics / ML anomaly detection** — Tier-2 commercial.
- **Live-LLM eval harness** — 500-entry corpus exists (P81 / ADR-106); live runs are owner CF#4 task only.
- **Build-time EOP pre-bake** — Tier-2 explicit per ADR-130 D3.
- **Soft-pass `existsSync` systematic prune** — 1,038 calls across 131 specs; not single-fix; Track D13 documented carry-forward (per `01-process-retrospective.md` §3.4).

## 6. Honest review questions (for owner before next-phase commit)

1. **Is the L3-L5 primary-market hypothesis right?** Per `02-market-positioning.md` §9 — the launch IS the experiment; await Month 1-6 cohort data before committing Phase A budget.
2. **Should Phase A or Phase C come first if signal is mixed?** Mixed signal means dev-stage hypothesis didn't dominate; design-stage may be load-bearing audience. Phase C (Whiteboard executive) is faster-to-ship (~2 weeks) and serves a TAM-larger long-tail per `02-market-positioning.md` §3.4.
3. **What's the budget for owner-only marketing time (Week 2-3)?** 17 items in the launch checklist plus 1-2 weeks AISP campaign per ADR-133 § Owner-required tasks. Marketing problem vs product problem is determined by whether awareness drives traffic — silent signal needs awareness investment before more building.
4. **Is the Tier-2 commercial path active or paused indefinitely?** ADR-114 / ADR-115 archived to `plans/tier-2/` per P89b. Reactivation requires sustained enterprise-team inquiry signal (per checklist § Follow-up "Triage Tier-2 commercial inquiries").
5. **Does the AISP open-core + Hey Bradley dual-repo strategy need formalization?** AISP open spec at `github.com/bar181/aisp-open-core`; Hey Bradley at `bar181/hey-bradley-core`. RFC process mentioned in ADR-109 § 3 + checklist Follow-up but not codified — first breaking-change proposal forces the formalization.

## 7. The honest verdict on what comes next

The recommendation under uncertainty: **do nothing scoped beyond the 17-item owner publish sequence until L3-L5 signal arrives.** The bridge memo's hard rule is the right rule — pre-emptive Agentic IDE work risks wrong-direction sunk cost when the actual signal might say "design stage is load-bearing" or "marketing problem, not product problem." The phases above are conditional commitments, not a roadmap; each one has a named trigger that must fire before scoping begins. Update path: when Month 1 cohort data lands, re-run this doc with concrete trigger-state entries (signal yes/no/silent) and convert one of Phase A-E from "anticipated" to "scoped" with a preflight at `plans/implementation/phase-N+1/` per the standard EOP-triplet pattern (per `01-process-retrospective.md` §2.2).
