# P61 Launch Plan — End-of-Open-Core to Public Release

> **Phase:** P61 Launch Planning · **Date:** 2026-04-30
> **Predecessor signals:** `01-third-party-feedback-2026-04-30.md` +
> `tests/p60-competitive-analysis.md` + `docs/launch/reviewer-impression-audit.md` +
> Explore-agent survey of original post-MVP scope (`plans/initial-plans/09.post-mvp-open-core.md`).
> **Window:** 2-3 weeks of execution post-defense → public RC.

---

## End-of-open-core milestone — the new definition

Open core is publicly launchable when **all six** are true:

1. Visual-polish floor ≥ 7/10 across the entire template library (not just flagship)
2. Onboarding routes Grandma + senior-dev to first patch in ≤ 60 seconds
3. ≥ 40 templates covering 8+ verticals; starter packs auto-populate appropriate sections
4. Mobile UX is single-mode (chat with listen toggle) — no tri-pane on phones
5. Multi-page MVP shipped — page selector wires through to per-page AISP spec
6. Marketing site is mobile-first, SEO-credible, and a 30-second visitor understands what HB does

P60 ships #0 (the spec moat). The 14-sprint OC arc closes 1-6.

---

## Brutal-honest review of each milestone (the 14 sprints, regrouped)

Format: **(grade) — what's good · what's brittle · concrete gate**.
Grades reflect strategic importance × implementation risk, not effort.

### MVP launch-blocking (P1)

**OC-1 — Visual Polish Floor (B+)**
What's good: highest-leverage reviewer-impression lift; replaces the floor that drags HB visual polish from 6→8. What's brittle: scope creep — "library-wide design pass" balloons. **Gate:** floor ≥ 7/10 measured against `tests/p60-competitive-analysis.md` rubric; no Lorem strings in any registered template (grep gate).

**OC-2 — Onboarding Redesign (A−)**
What's good: directly closes Grandma 7→9 gap; 3-choice fork is the right cognitive load. What's brittle: the fork itself ("build / explore / spec") needs UX copy that survives both personas. Sr-Dev wants speed-to-template-gallery; Grandma wants speed-to-listen-mode. **Gate:** Grandma persona score ≥ 85/100; Sr-Dev ≥ 92/100; both in ≤ 60s to first patch.

**OC-3 — Templates Round 1, 40+ total (B)**
What's good: matches reviewer's "need 40+" call; doubles current 17. What's brittle: quality vs. quantity tension — 40 mediocre templates beats 17 great ones for vertical coverage but lowers the ceiling. **Gate:** 8+ verticals (SaaS, agency, blog, portfolio, local-business, e-commerce, restaurant, AI-engineer); each template scores ≥ 7/10 in P60-style audit.

**OC-4 — Templates Round 2 + Search (B−)**
What's good: discoverability matters at 40+; edge cases (legal, medical, dev portfolio variations) deepen library. What's brittle: search itself is non-trivial UI work; edge-case templates often have lower reuse. **Gate:** template browser has search + 4-vertical-tag filter; ≤ 200ms search latency.

**OC-5 — Mobile UX Overhaul (A)**
What's good: closes the largest competitive gap (Lovable 9 vs HB 7); reviewer explicitly called for "single mode + listen toggle." What's brittle: this is NOT what Sprint J P53 shipped (3-tab nav). True single-mode-with-toggle is a redesign, not a polish. Marketing site mobile audit is unbounded. **Gate:** mobile shows one mode (chat) with listen-toggle FAB + preview-strip; no tri-pane below `md` breakpoint; all 4 marketing pages pass mobile-Lighthouse ≥ 90.

**OC-6 — Listen-Mode 50-Prompt Scenarios (B)**
What's good: voice surface is under-tested; 50 scenarios per `tests/examples/personality-responses.json` already at P60; needs end-to-end coverage. What's brittle: Web-Speech reliability varies by browser + mic. **Gate:** 50/50 prompts complete listen→spec round-trip in AgentProxy; ≥ 40/50 in real browser smoke.

**OC-7 — Section-Type Gap Closure (B)**
What's good: 16 → 19 section types; closes restaurant/case-study/contact gaps that currently force `columns` workarounds. What's brittle: each new section type needs schema + renderer + chat/listen recognition; cumulative blast radius. **Gate:** menu, case-study, contact-form section types ship with ≥ 1 template each.

**OC-8 — Clean UI Pass (B+)**
What's good: design discipline thread per `plans/implementation/phase-60/post-seal-roadmap.md`; raises floor everywhere. What's brittle: subjective; "clean" is observer-dependent. **Gate:** design tokens unified (no hard-coded hex outside theme files); empty/loading/error states audited; motion budget ≤ 200ms.

**OC-9 — Spec Quality + Export Polish (C+)**
What's good: deepens the moat HB already wins on (10/10). What's brittle: mostly cosmetic — bundle UI is downstream of the actual spec quality. NO real URL (open-core scope rule). **Gate:** export modal redesigned; "Built with Hey Bradley" footer typography polished; static HTML hash-stub UX clearer.

**OC-10 — Performance + Accessibility (B)**
What's good: a11y baseline = launch-blocker for credibility; perf budget sets ceiling for OC-3..-7 sprawl. What's brittle: a11y audits often surface 50+ items; cap scope. **Gate:** axe-core 0 critical; LCP ≤ 2.0s on AgentProxy fixture; keyboard-only nav reaches every interactive element.

**OC-11 — Multi-Page MVP (A)**
What's good: only product in the competitive set with per-page AISP; ADR-035 50% scaffolded so most foundation is done; differentiator. What's brittle: page-aware spec generation is non-trivial; chat/listen need to know which page is "active." **Gate:** add-page button + 2 pages renderable; per-page spec exports as separate AISP atom; chat command "edit page X hero" works.

**OC-CLEANUP — Sub-Phase: Stake Docs + Archive (B)**
What's good: ruvector + CLAUDE/README/wiki realignment is overdue; pruning old phase files reduces orientation cost for future agents. What's brittle: easy to spend 2 days here for invisible value; cap at 1-2 days. **Gate (full detail in §Cleanup Sub-Phase below):** every phase folder has at minimum `preflight/`, `session-log.md`, `retrospective.md`; ruvector entries reflect P60+P61 deltas; CLAUDE.md/README current; wiki audited; `plans/archive/` populated.

### P2 — advanced, ship if time before public RC

**OC-12 — Live LLM Testing (B+)** · gated on API keys; 5 prompts × Haiku/Claude/Gemini ≈ $0.05 spend. Closes the "AgentProxy fixture only" credibility gap.

**OC-13 — Blog Expansion, 12+ posts (A−)** · content marketing IS the moat for AISP adoption; 4 → 12 posts including 3 process posts (see §Blog Content Prompts).

**OC-14 — Process Pages POC, CONTENT version (B+)** · novel concept; ship the content-type version (a "process page" template that documents user stories + phase methodology). Tier-2 ships the runtime version (live agents).

**OC-15 — Agentic-Process Templates (B)** · template library extension: "AI agent landing page", "dashboard SaaS marketing site", "developer-tool homepage" — TEMPLATES not running agents. Open-core compatible.

**OC-16 — Prompt Library 500+ entries (C+)** · extends P59 corpus; internal tooling value; user-invisible.

**OC-17 — AISP Adoption Push (A+)** · the 12-month strategic moat. `bar181/aisp-open-core` README + 3 third-party reference impls + demo notebook. Per `tests/p60-competitive-analysis.md` §"12-month outlook," this is the SINGLE highest-leverage post-defense investment.

**OC-18 — Public Launch RC Final (A)** · tag + release notes + demo video v2 + Agentics Foundation push. Triggered only after all P1 sprints close.

---

## Multi-page support — the answer

ADR-035 has the data model; UI + spec generation are the gap. Open-core
ships **MVP multi-page (OC-11)**: page selector in the left panel,
add/remove/reorder pages, per-page section editing, per-page AISP spec
export (5 atoms × N pages). NOT in scope for open-core: page-level access
control, hosted multi-page sites, server-side routing.

---

## Process pages + agentic-process pages — split decision

The owner's vision conflates two ideas. Honest split:

**(a) Process pages as a CONTENT TYPE — open-core (OC-14)**
A new template category that documents a methodology: user stories, phase
processes, agentic-engineering patterns. Static content. No runtime. Same
section types apply (hero / columns / quotes / numbers / blog) — needs
maybe 1-2 new section types ("user-story-card", "phase-step"). Ships in
open-core because it's static.

**(b) Agentic processes as RUNTIME — Tier-2 only**
Live LLM agents + database + backend + dashboards running inside the
generated site. Requires: server, auth, rate limits, key custody. Open-core
cannot ship this credibly. **Decision: defer to Tier-2 commercial.**

What CAN ship in open-core: **agentic-process TEMPLATES (OC-15)** — site
templates for products that USE agents (AI agent landing pages, dashboard
SaaS marketing pages, dev-tool sites). The site is a marketing site for
an agentic product; it isn't itself agentic. That preserves open-core
scope while extending the template library to higher-value verticals.

---

## Cleanup Sub-Phase — scope

**Goal:** stake docs + ruvector + filesystem coherent for a future agent
opening this codebase cold.

| Step | Action | Acceptance |
|---|---|---|
| 1 | Audit every `plans/implementation/phase-N/` folder | Each has ≥ preflight + session-log + retrospective |
| 2 | Move stale files (deep-dives, fix-pass-N notes superseded by later phases, persona-N reports) into `plans/archive/phase-N/` | `git mv`; preserves history |
| 3 | Update ruvector: 95 entries → reflect P60+P61 deltas (3 new ADRs/notes, P60.5 quick win, OC sprint plan) | `npx @claude-flow/cli memory store` for each delta |
| 4 | Update `CLAUDE.md`: Current Phase → P61 OPEN; ADR count if ADRs land in cleanup; sprint roadmap link to this file | Diff committed |
| 5 | Update `README.md`: ensure `v1.0.0-RC1` referenced; competitive 61/80 score in headline | Diff committed |
| 6 | Wiki review: `docs/wiki/*` cross-checked against ADR-077..ADR-084 + P60.5 | Stale entries archived; current entries phase-pinned ≥ P60 |
| 7 | Marketing site audit (see next section) | Audit doc lands at `plans/strategic-reviews/2026-05-01-marketing-site-audit.md` |

Effort: 1-2 days.

---

## Marketing site audit — what to evaluate

The 4 pages (About / Open Core / How I Built This / Docs) plus blog.
Owner-supplied lens: *engagement, interest for new visitors, SEO, UI,
"do people understand what the site does?"*

Questions to answer (1-line each, with citation):

1. **30-second test.** Hero copy + first viewport: can a visitor say what HB is in 1 sentence?
2. **Persona match.** Does the landing pitch the right person (capstone reviewer? OSS dev? founder shopping for a builder?)
3. **Mobile responsive.** Lighthouse mobile ≥ 90 across 4 pages
4. **SEO basics.** Each page has unique `<title>`, meta description, OG tags, structured data; sitemap.xml present
5. **CTAs.** Primary CTA above fold ("Try Hey Bradley" → BYOK or AgentProxy); secondary CTA ("Read the AISP spec" → blog)
6. **Trust signals.** Open-source badge, MIT license link, GitHub stars, "Built with Hey Bradley" self-reference
7. **Blog discoverability.** RSS, share buttons, related posts, tag taxonomy
8. **Engagement instrumentation.** Plausible/Umami event hooks for primary CTAs (no PII; privacy-respecting)

Output: a graded audit doc + a Quick-Wins list folded into OC-1 / OC-5 / OC-13.

---

## Blog content prompts — for OC-13

Owner-supplied direction: "prompt some to the blog section." 8 candidate
posts in priority order (4 already shipped per CLAUDE.md status; need 8
more to hit 12+):

1. **"The 5-Atom AISP Architecture, Explained"** — INTENT/ASSUMPTIONS/SELECTION/CONTENT/PATCH walked through with screenshots; targets capstone reviewers
2. **"Why Hey Bradley Beats Lovable + Framer + Claude Designer (61/80)"** — competitive matrix made public; high SEO value
3. **"Building an Open-Core SaaS in 2 Days: 100× Velocity Postmortem"** — process content, links to phase logs
4. **"From Prose Spec to Crystal Atoms: Reducing Ambiguity from 60% to 2%"** — AISP advocacy; cross-post to `bar181/aisp-open-core`
5. **"Mobile-First Without a Native App: How HB Compresses Tri-Pane to One"** — design narrative for OC-5
6. **"BYOK is the Open-Core Test"** — argues why server-backed "open-core" tools aren't really open
7. **"Claude Code Hand-off: Why Your Spec is Your Compiler"** — positions HB as the front-end of an agentic dev pipeline
8. **"What Open-Core CAN'T Do (Yet): The Honest Tier-2 Roadmap"** — transparency post; deepens trust

Each post: 600-1,200 words. Owner writes; agent helps with research /
fact-checks against ADRs. Three of these (3, 5, 8) are also "process
posts" per OC-14 cross-reference.

---

## MVP vs Priority 2 — final split

| MVP (P1, launch-blocking) | Priority 2 (advanced, fold-in if time) |
|---|---|
| OC-1 Visual Polish | OC-12 Live LLM Testing |
| OC-2 Onboarding 2.0 | OC-13 Blog Expansion |
| OC-3 Templates Round 1 | OC-14 Process Pages POC |
| OC-4 Templates Round 2 | OC-15 Agentic-Process Templates |
| OC-5 Mobile UX Overhaul | OC-16 Prompt Library 500+ |
| OC-6 Listen 50-prompt | OC-17 AISP Adoption Push |
| OC-7 Section-Type Closure | |
| OC-8 Clean UI Pass | |
| OC-9 Spec/Export Polish | |
| OC-10 Perf + a11y | |
| OC-11 Multi-Page MVP | |
| OC-CLEANUP | |
| OC-18 Public Launch | |

Total MVP estimate: 14-18 working days at observed velocity → ~2-3 weeks
post-defense. P2 adds another 1-2 weeks if all five fold in.

---

## What is intentionally OUT of scope

Hard Tier-2 boundary; do NOT smuggle into open-core:
- Real hosted share URL (server)
- OAuth + Supabase persistence
- Multi-device continuity
- Hosted ruvector learning runtime
- Real backend deployment for agentic processes
- Team workspaces / client view / spec branching
- SaaS dashboard / flagship app
- Original Sprint J Agentic Support System

Reviewer wishlist items to **explicitly defer** to Tier-2 (for now):
team workspaces, client read-only view, git-style spec branching,
multi-language i18n on the public site.

Reviewer wishlist items worth **adding to open-core P2 backlog**:
undo/redo for patches (low effort, high UX), section reorder by drag
on mobile (folds into OC-5), "Explain this spec" plain-English button
(folds into OC-9), version history (medium effort but high trust value).

---

## Bottom line

Defense-ready today. Public-RC-ready in 2-3 working weeks if MVP P1 sprints
hold. **OC-1, OC-2, OC-5 are the three reviewer-impression accelerants;
OC-11 is the differentiator; OC-17 is the 12-month moat.** Cleanup and
marketing audit are launch-credibility gates. Process / agentic-process
ideas split cleanly: content-type version ships open-core; runtime version
waits for Tier-2.
