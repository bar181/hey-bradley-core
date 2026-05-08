# Hey Bradley — Capstone Comparison: Original Concept vs Final Product

> **Date:** 2026-05-04 · **Phase:** MVP-RETRO · **Branch:** swarm/mvp-retrospective
> **For:** Harvard ALM Capstone defense
> **Predecessor:** Pre-Launch Sprint sealed at `e506913` · v2.0.0-RC1 sealed at P103

---

## Executive summary

The original North Star (v3.0.0, 2026-03-27, `plans/initial-plans/01.north-star.md`) framed Hey Bradley as a **"whiteboard that listens, builds what you describe in real-time, and secretly writes enterprise specs behind the scenes"** — a 7-level builder roadmap (Levels 1-7) climbing from a single-page hero to enterprise AISP specs. The final shipped product (v2.0.0-RC1 + connections layer + pre-launch sprint) preserves the original PMF triple (Builder + Listen + Specs) but **reframes the product around the design-stage / dev-stage bridge**, expands AISP from 5 atoms to 8, adds two new product modes (Planning + Agentics) the P11 plan never named, and grows a connections funnel layer (plugin / MCP / NPX / Rust crate) that did not exist in the original roadmap. The biggest reframe: Hey Bradley is no longer "a builder that secretly writes specs" — it is a **spec factory whose markdown bundle (ADR-122) IS the canonical output**, with the builder as one of three lenses on the same JSON.

---

## 1. The original North Star (P11 era)

### 1.1 Original concept

Verbatim from `plans/initial-plans/01.north-star.md` line 10 (v3.0.0, 2026-03-27):

> "A whiteboard that listens, builds what you describe in real-time, and secretly writes enterprise specs behind the scenes."

> "Hey Bradley is a JSON-driven marketing website specification platform. It produces two outputs simultaneously: a live visual preview the user interacts with, and enterprise-grade AISP specification documents the user exports. It is **not** a website builder competitor — it is a specification platform that feeds builders, dev tools, and agentic pipelines." (line 12)

The original PMF formula (line 22-25):

```
PMF ≜ Builder Mode + Listen Mode + Spec Documents
      (all three required — none alone is sufficient)
```

### 1.2 Original audience hypothesis

Four personas, ordered by priority (line 48-53 of `01.north-star.md`):

| User | Persona | Mode | Primary Value |
|------|---------|------|---------------|
| **Grandson** | Non-technical, shows grandma her cookie site | DRAFT + BUILD | Click vibes, see website |
| **Framer User** | Power user who thinks in JSON | EXPERT + BUILD | Direct property editing |
| **Dad** | Some coding ability, needs specs for Claude Code | EXPERT + BUILD | Exports pillar docs → agentic system |
| **Enterprise** | Needs AISP-grade precision | EXPERT + LISTEN | < 2% ambiguity |

### 1.3 Original scope

Marketing sites only — explicitly NOT e-commerce, blogs, dashboards, web apps, or community sites (line 73-74). Coverage estimated at 60-70% of marketing sites with 8 core sections: Hero, Features, Pricing, CTA, Footer, Testimonials, FAQ, Value Props (line 78-87). 3 vibes shipped (Warm / Ocean / Forest, line 226-230).

### 1.4 Original methodology

7-level linear progression in `plans/initial-plans/03.implementation-plan.md`:

| Level | Focus | Day budget |
|-------|-------|------------|
| L1 | Core Builder (4 phases, hero + JSON + tabs + polish) | Days 1-5 |
| L2 | Full Site Builder (vibes + 8 sections + polish) | Day-budget unspecified |
| L3 | Specification Engine (pillar docs + per-section specs) | — |
| L4 | Auth + Database (Supabase) | — |
| L5 | LLM Functionality (chat → patches) | — |
| L6 | Voice Mode (STT + listen task queue + virtual whiteboard) | — |
| L7 | Enterprise Specs (AISP mode + change logs + AI-first export) | — |

Two-axis UI: BUILD↔LISTEN × DRAFT↔EXPERT producing 4 composite states (`02.architecture.md` line 42-69). Center canvas had 4 tabs: REALITY, DATA, XAI DOCS, WORKFLOW (line 75-80).

The plan named 11 ADRs at the outset (ADR-001 through ADR-011 in `02.architecture.md` line 263-306). It said **nothing about "phases" as multi-day discrete sprints** — the word was used for the L1.0 / L1.1 / L1.2 / L1.3 micro-segments inside Level 1.

---

## 2. The final product (v2.0.0-RC1 + connections + pre-launch)

### 2.1 What shipped

Per `CLAUDE.md` Project Status section + `docs/launch/release-notes-v2.0.0-rc1.md`:

- **3 product modes** routed at `/`, `/planning`, `/agentics` (ADR-116, P90)
- **8 Crystal Atoms** in production (PATCH + INTENT + SELECTION + CONTENT + ASSUMPTIONS + DECOMP + PROCESS + DDD + AGENT) — AISP suite COMPLETE
- **128 ADR files** on disk (ADR-001..ADR-137 + connections ADR-C01..C07; documented gaps + 3 stub-then-superseded duplicates)
- **237-test cumulative regression** at P109 anchor (most recent seal); ~1491+ pure-unit GREEN total
- **51 example sites** · **18 section types** · **21 themes** · **15 section arrangements** · **15 content styles** · **12 blog posts** · **300 images / 13 effects**
- **Connections layer** (`connections/`): plugin + MCP + NPX + Rust crate; 7 connection ADRs; 18 AISP specs at `connections/docs/specs/aisp/`
- **Markdown spec bundle export** (ADR-122): single `.md` with `# === FILE: <path> ===` markers; ≥6 logical files; bundle IS canonical Hey Bradley output

### 2.2 Final audience map

Per `plans/strategic-reviews/2026-05-04-design-dev-bridge-positioning.md`:

- **Group 1 — Design Stage (idea → spec):** founders, designers, PMs. Listen mode + Whiteboard + Planning mode + Don Miller copy.
- **Group 2 — Dev Stage (spec → execution):** L2-L9 developers.
  - **L2-L3:** plugin + NPX (take spec, hand to Claude Code, ship)
  - **L3-L5 PRIMARY:** Cursor power users (persistent context — stop re-explaining every session)
  - **L5-L7:** Wave coordination + AISP (spec drift detection; swarm dispatch)
  - **L8-L9:** build the tools (credibility partners; AISP RFC participants)

### 2.3 Final positioning

> "messy ideas → enterprise specs, instantly" (current launch copy; aligned with the bridge framing per `2026-05-04-design-dev-bridge-positioning.md` line 116-117).

The "spec is the shared artifact between two stages that previously had no handoff" thesis replaces the original "specs as a side-effect of building" framing.

---

## 3. Major changes (what shifted)

### 3.1 Audience reframe

**Original:** four single-user personas (Grandson / Framer / Dad / Enterprise).
**Final:** two-stage market segmentation (Design Stage = Group 1; Dev Stage = Group 2 with L2-L9 tier ladder); L3-L5 Cursor power users named **primary market** post-MVP.
**Where:** `2026-05-04-design-dev-bridge-positioning.md` line 14-42.

The Grandson persona survives as "Grandma" in the persona-scoring rubric (ADR-094 / P67b); the Enterprise persona survives as "Lars" in the same rubric. Framer + Dad collapsed into the Dev Stage tier ladder.

### 3.2 Product surface reframe

**Original:** single builder with 2-axis toggles (BUILD↔LISTEN × DRAFT↔EXPERT) and 4 center tabs (REALITY / DATA / XAI DOCS / WORKFLOW).
**Final:** three top-level modes (Whiteboard / Planning / Agentics) routed at distinct URLs (ADR-116, P90); the original 2-axis toggle survives **inside Whiteboard mode only**. Planning mode is brand-new (process map + domain model + chat bar). Agentics mode is brand-new (SpecWorkbench + Export Claude Code + KISS reviewer + Seal Panel).

### 3.3 The 7-step methodology emerged from execution

**Original implementation plan** (L1-L7) was a linear product-feature roadmap, not a methodology.
**Final methodology** (per release notes + ADRs P82+): **Research → Decompose → Architect → Spec → Plan → Build → Reflect** — codified post-P82 from the actual Standard Phase Process (preflight + execution + EOP triplet + review + fix-pass) the swarm sprints used through 109 phases. The original plan had no equivalent.

### 3.4 AISP suite expansion (5 → 8 atoms)

**Original** (north-star v3.1 patch line 148): "5-atom AISP Crystal Atom architecture (INTENT/ASSUMPTIONS/SELECTION/CONTENT/PATCH)".
**Final** at v2.0.0-RC1: 8 atoms.
- 5 baseline atoms shipped P26-P35 (Sprint C + D + E)
- **DECOMP** added P74 / OC-DECOMP / ADR-099 (multi-clause front-of-pipeline splitter)
- **PROCESS** added P92 / AW-PROCESS-ATOM / ADR-118 (Agentic Workbench arc)
- **DDD** added P93 / AW-DDD-ATOM / ADR-119
- **AGENT** added P94 / AW-AGENT-ATOM / ADR-120 (final atom; suite closed)

**SELECTION_ATOM was SUPERSEDED in implementation** by `templateMatcher.ts` per ADR-134 / P106 (the original ADR-057 LLM-driven 2-step pipeline file remains on disk for record but is functionally inert).

### 3.5 Connections layer (NEW — not in P11 plan)

`connections/` directory ships post-RC: `plugin/` + `mcp/` + `npx/` + Rust crate scope. 7 ADRs (ADR-C01..C07). 18 AISP specs at `connections/docs/specs/aisp/`. Reframed mid-build from "co-equal product" to **"top-of-funnel discovery surface"** (per `connections/README.md`):

> "The plugin is intentionally incomplete. The plugin generates specs. It does not preview them. Visualization, iteration, and the Builder/Listen modes live at heybradley.app — that is by design."

This entire layer was absent from the original P11 plan and from the v3.1 north-star patch.

### 3.6 Three-mode product architecture (P90 / ADR-116)

**Original** was builder-only (mode = BUILD↔LISTEN × DRAFT↔EXPERT inside one shell).
**Final** is three modes routed at distinct URLs with route-derived AppShell layout. AISP visibility ladder per mode (ADR-110): Whiteboard hides AISP / Planning shows dual-view / Agentics surfaces AISP prominently.

---

## 4. Missing portions from original plan

### 4.1 Multi-tenant team workspaces

Deferred to Tier-2 per ADR-114 / ADR-115 (P89 TIER2-FOUNDATION). Supabase scaffolding archived to `plans/tier-2/` after P89b cleanup; open-core src/ has zero Supabase refs.

### 4.2 Hosted share URL (commercial path)

Originally promised in L4 "Auth + Database" + L7.2 "Change Logs". Final state: scaffolded but **inert** at v2.0.0-RC1 — clipboard share via ADR-081 only; hosted URL deferred.

### 4.3 HNSW vector-DB activation

Ruvector exists at 126 entries (manually-curated static snapshot per `plans/implementation/phase-61/03-ruvector-state.md`). Both indexes show **0 vectors — HNSW NOT INDEXED**. Auto-write hook on agent runs deferred to commercial Tier-2 learning runtime.

### 4.4 Live LLM eval harness

500-entry prompt corpus exists (P81 / ADR-106). Live eval runs are **post-RC owner task** per `docs/launch/owner-launch-checklist.md` (CF#4 BYOK smoke; budget ~$0.05).

### 4.5 Mobile-native apps

Original `01.north-star.md` line 136: "Mobile builder UI — Out of scope, Desktop-only tool". Final state: responsive web at 375/390/428px (ADR-090 / P69 + ADR-112 / P87 marketing-mobile) — but **no native iOS/Android**, deferred to Tier-2.

### 4.6 Localization

English-only. i18n scaffolded but deferred (named in ADR-109 Tier-2 list).

### 4.7 Live cross-tab persistence

BroadcastChannel pattern noted as P101 carry-forward; not implemented at v2.0.0-RC1.

### 4.8 Original "Workflow" tab as live LLM pipeline

`02.architecture.md` line 79-80 promised the WORKFLOW tab to show "LLM pipeline: Voice Capture → Intent Parsing → AISP Gen → Schema Validation → Reality Render → Edge Deploy, live stream output log". Final WORKFLOW surface is the **Pipeline tab in EXPERT center tabs** showing simulated stages; the live-stream events ladder shipped via the ConversationLog drill-down (P100 W2 / ADR-126) instead. The WORKFLOW name itself was retired; the function lives in two surfaces (Pipeline + ConversationLog).

### 4.9 Spec round-trip validation

`09.post-mvp-open-core.md` line 65-69 promised "Spec → Claude API → HTML → compare; target 90%+ structural fidelity". Not implemented at v2.0.0-RC1; deferred to post-RC live-LLM eval.

---

## 5. New functionality (emerged during build)

### 5.1 Listen mode + cleanTranscript pipeline (P19 + ADR-127)

The voice path was in the P11 plan (L6) but the **disfluency-stripping `cleanTranscript` module wired pre-classifier** (ADR-127 / P100 W2 FMT) emerged from observed listen-mode quality gaps. P105 closed the wire from listen-mode-only to all 14 classifier consumers.

### 5.2 Brutal-honest review pattern + persona scoring rubric (ADR-094)

Originated from P19 fix-pass. Became core process artifact: 4-reviewer parallel deep-dives (UX / Functionality / Security / Architecture) with recursive ≤3 passes; persona re-score against Grandma / Framer / Capstone (later Lars) rubric. Codified in CLAUDE.md "Standard Phase Process" steps 5-6.

### 5.3 The 8 Crystal Atoms full suite (especially PROCESS / DDD / AGENT)

Agentic Workbench arc P85-P101 added 3 atoms beyond the v3.1 patch's 5-atom architecture. PROCESS_ATOM (project description → phases / sprints / waves / agents), DDD_ATOM (project description → bounded contexts + relationships), AGENT_ATOM (wave context → AgentSpec[] with disjoint ownedFiles + DoD).

### 5.4 Spec Workbench (P95 / ADR-121)

Tabbed Human / AISP / ADR view; first AGENT_ATOM consumer; not in the P11 plan. Sprint cards expandable; clipboard primary for AISP.

### 5.5 Markdown spec bundle export (P96 / ADR-122)

The bridge artifact. Reframed Hey Bradley as **spec factory not code generator**: "bundle IS the canonical Hey Bradley OUTPUT — downstream consumer reads bundle and writes implementation in their own repo." Single `.md` file with `# === FILE: <path> ===` markers. Original P11 plan promised ZIP export; final is markdown bundle (Q2 owner answer at P95 planning sprint).

### 5.6 KISS reviewer (P98 / ADR-129) + Seal Panel (P99 / ADR-130)

Methodology surfaces for the **Reflect** step. KISS reviewer = pure-module rules-based gate (6 categories × 3 severity tiers; PASS = zero P1). Seal Panel = 3-card markdown EOP layout in Agentics. Neither in original plan.

### 5.7 Comprehensive logging (P100 W2 / ADR-126) + 100% event_type coverage (P107 / ADR-135)

Forensic trail for every LLM interaction. log_events + edit_history SQLite tables; 15 event types (CHECK enum); BYOK redaction at every write boundary per ADR-043; 3-level ID hierarchy (session → request → event). P107 closed the last 5 dead enum slots — coverage 10/15 → 15/15 = 100%.

### 5.8 Connections layer (the entire post-RC1 work)

Plugin + MCP + NPX as **funnel discovery surface** for Claude Code / Cursor / any MCP client users. 7 ADRs + 18 AISP specs. Not in P11 plan; not in v3.1 north-star patch. Emerged from owner strategic memo on the design-dev bridge.

### 5.9 The "intentionally incomplete" plugin framing

Strategic clarity that emerged during pre-launch sprint: the plugin generates specs but does not preview them; the web app at heybradley.app remains THE product (`connections/README.md`). This is the explicit positioning that turns the connections layer from product-cannibalization risk into top-of-funnel acquisition.

### 5.10 Three-mode product architecture (ADR-116)

Whiteboard / Planning / Agentics as distinct routed modes. Original `02.architecture.md` had two binary toggles inside one shell. The mode reframe (P90) unblocked the Agentic Workbench arc — Planning + Agentics needed dedicated layouts the original 2-axis toggle could not express.

### 5.11 BYOK trust boundary discipline (ADR-043 + ADR-114 D3)

Original plan had Supabase auth + server-side proxy with no client-side keys (`02.architecture.md` line 387). Final BYOK pattern: keys live in localStorage only; never cross to Supabase; redacted at every log-write boundary via `redactKeyShapes`. Codified as a hard architectural invariant tested in P89.6 + P107.8.

### 5.12 ADR-100 section-enum drift regression guard (P109 / ADR-137)

`tests/p109-section-enum-drift-guard.spec.ts` reads 5 sources of section-type truth (sectionTypeSchema Zod + VALID_SECTION_TYPES helper + PATCH_ATOM AISP enum + INTENT_ATOM ALLOWED_TARGET_TYPES + intentTargetTypeSchema) and asserts mutual consistency on canonical 18. **Adding a 19th section type now requires touching 5 source files + the test in lock-step** — concrete forcing function for ADR-100 discipline.

---

## 6. What the capstone defends

### 6.1 The shipped artifact

v2.0.0-RC1 + connections layer + pre-launch sprint = **launch-ready open-core product**. 3 modes + 8 atoms + 51 templates + 128 ADRs + 237-test seal regression. Live at heybradley.app pending owner deploy + tag (per `docs/launch/owner-launch-checklist.md`).

### 6.2 The methodology

7-step (Research / Decompose / Architect / Spec / Plan / Build / Reflect) + 8 Crystal Atoms + EOP triplet (preflight + session-log + retrospective per phase) + brutal-honest review with persona re-scoring. **Reproducible at multi-hour velocity**: observed 6 phases sealed per day through P19 (CLAUDE.md "Effort Estimation Rule"). Original 4-6-day-per-phase budgets ran 10-50× conservative.

### 6.3 The discipline at scale

128 ADRs / 237-test seal regression / **0 new dependencies from P104 baseline** / pure-module atom-view discipline (ADR-134: atoms MUST NOT import from `src/components/`) / BYOK trust boundary preserved across 109 phases / both tsc strict configs clean at every seal.

### 6.4 The honest gaps named

Per ADR-131 / ADR-133 / ADR-109 carry-forward registry + design-dev bridge positioning memo:

- **CF#4 BYOK smoke** (owner-required; ~$0.05 budget; live LLM)
- **CF#5 STT calibration** (owner-required; real microphone)
- **Level 2 web app specs** (entities / flows / integrations) — deferred per pre-launch sprint
- **MCP standalone surface** — connections layer scaffolded; runtime live-test deferred
- **Wave 4 Rust crate enhancements** (ADR-C07) — scoped, not shipped
- **Agentic IDE v0** (persistent context across sessions for L3-L5 Cursor users) — deferred until L3-L5 signal post-launch

Classified by **signal-driven activation** (per design-dev bridge memo line 5): "Ship MVP. Watch L3-L5 signal. Build Agentic IDE v0 *after* user data confirms the primary market."

### 6.5 What this proves

1. **idea → spec → AI handoff is achievable as a workflow product** — the markdown bundle (ADR-122) is the bridge artifact between two previously-disconnected stages.
2. **swarm-driven discipline scales to a 109-phase build** — disjoint-scope parallel agents, single-wave dispatch, EOP triplet at every seal, ADR-per-architecture-decision, persona re-score per major phase.
3. **AISP discipline produces measurable spec quality** — Ambig < 0.02 hard gate; SOTA composite 79-84/100 vs Lovable 80/100 baseline (per ADR-127 honest revision after P100 W2 FMT-VERIFY revealed prior 88/100 was optimistic).

---

## 7. Honest verdict — original to final

The final product **fulfills the original PMF gate** (Builder + Listen + Specs all three present and functional) and exceeds it on the v3.1 patch's expanded gate (Builder + Listen + Spec + MultiPage + Mobile). Where it **overshot**: the AISP suite (5 → 8 atoms), the three-mode architecture, the markdown bundle as canonical output, the connections layer, and the methodology codification — none of these were promised in P11. Where it **fell short**: hosted share URL, live LLM eval, Agentic IDE v0, multi-tenant workspaces, native mobile, localization, HNSW activation — all named honestly as Tier-2 deferrals or post-RC owner tasks rather than papered over. The reframe from "builder that secretly writes specs" to "spec factory whose markdown bundle IS the output" is the single largest semantic shift; it is also the reframe that makes the Harvard ALM defense coherent: the artifact under defense is not a website builder but a **bridge between the design stage and the dev stage**, with the spec as the shared handoff that previously did not exist.
