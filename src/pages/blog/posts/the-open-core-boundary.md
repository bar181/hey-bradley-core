---
title: "The Open-Core Boundary: What Ships Free, What's Tier-2"
slug: "the-open-core-boundary"
date: "2026-05-01"
excerpt: "Open-core only works when the boundary is honest. Here is the line between Hey Bradley's MVP and the commercial track — every deferred feature, by name, with the rationale."
tags: ["open-core", "strategy", "tier-2", "boundaries"]
---

# The Open-Core Boundary: What Ships Free, What's Tier-2

Most "open core" pitches dodge the actual question. They wave at a free tier, gesture at "premium features," and trust nobody will read the fine print. The fine print is where the trust lives. If a contributor cannot tell from the README which features will eventually move behind a paywall, they cannot make an informed decision about whether to commit hours to the project. So this is the README I wish more open-core projects shipped: every feature in Hey Bradley's MVP today, every feature deferred to the commercial Tier-2 track, and the rationale for each line.

The principle is simple. The MVP exists to prove the AISP spec layer is the moat. Anything that proves the moat ships free. Anything that monetizes the moat — at scale, at multi-tenant, with a runtime that learns from your data — ships in Tier-2. The boundary is not "fancy features cost money." The boundary is "the thesis is open; the operations are commercial."

## What ships free in the MVP, today

The full open-core repo at `bar181/hey-bradley-core` ships the parts that make the spec-layer thesis defensible:

- **The 5-atom AISP architecture in production.** PATCH, INTENT, SELECTION, CONTENT, ASSUMPTIONS. Closed schemas, deterministic state machine, sub-2% ambiguity by construction against the test corpus. ADR-053, ADR-055, ADR-056, ADR-057, ADR-060, ADR-064.
- **The full template intelligence layer.** 21 themes, 15 section arrangements, 15 content styles, all 51 entries carrying `exampleQueries` ready for HNSW activation. ADR-098, P72 / OC-TI, P73 / OC-TPL-AUDIT.
- **41 curated, on-brand templates** across healthcare, creator, dev-tools, and the four agentic-product verticals shipped in P80 / OC-15. ADR-096, ADR-105.
- **The page-aware chat pipeline.** Multi-page MVP (ADR-103, P78), page-scoped patches (ADR-104, P79), and the deferred-to-P82 carry-forward list documented in plain English in the phase retros.
- **BYOK with five providers.** Claude, Gemini, OpenRouter, Haiku, and the Sonnet/Opus tier. You paste your own key. We never see it. P17, P18, P18b.
- **Static HTML export.** Every spec produces a self-contained HTML bundle. Run it on any static host. ADR-081, ADR-101.
- **Web Speech STT for listen-mode.** Push-to-talk in the browser, no server round-trip, no transcript leaving the device. ADR-065, P19.
- **The full test corpus and persona scoring.** 954+ pure-unit green at P80 seal. 280-entry prompt corpus from P59. 50-entry personality matrix and 80-entry LLM matrix from P60. ADR-083, ADR-084.
- **107 accepted ADRs on disk.** Every architectural decision is reviewable. ADR-105 was added the day this post went up. The numbering has documented gaps; the trail is intact.

If you fork the repo today, you can run the entire spec engine, hand the AISP envelope to Claude Code, and ship a real site without a Hey Bradley account. That is the point. The thesis works at zero cost.

## What is deferred to Tier-2 (commercial), and why

This is the honest list. Each item has a one-line "why it ships behind a paywall" so you can decide whether the boundary is reasonable.

- **Hosted shareable spec URLs.** The MVP exports a static HTML file. Tier-2 hosts the spec at a stable URL with version history, view counts, and team-readable comments. *Why commercial:* the moat is the spec; the operation is multi-tenant CDN, observability, and abuse prevention. Hosting is the part that costs money to run, not the part that proves the thesis.
- **Vector DB learning runtime (HNSW activation).** The MVP ships ruvector as a manually-curated static snapshot — 126 entries, search via SQL `LIKE`, HNSW index present but not active. Tier-2 turns on HNSW re-indexing and an auto-write hook on every agent run, which makes the spec engine *learn* from prior sessions. *Why commercial:* the learning loop requires per-tenant data isolation, embedding cost management, and cross-session retention guarantees. The static snapshot proves the architecture; the runtime proves the operating cost.
- **OAuth + Supabase persistence.** The MVP stores everything in IndexedDB on the user's device. Tier-2 adds login, multi-device sync, and team workspaces. *Why commercial:* identity, multi-tenant data, and account recovery are the commercial-grade ops surface. Local-first persistence is enough to ship; multi-device is enough to bill.
- **Tier-2 flagship dashboard / SaaS app templates.** The MVP includes 41 templates across the marketing-site category. Tier-2 adds opinionated dashboard, admin, and SaaS-app starters with auth wiring, role-based access, and Stripe integration. *Why commercial:* these templates require ongoing maintenance against shifting auth and billing APIs; a static MIT template would rot in six months.
- **The Agentic Support System (originals from Sprints J/K/L).** The MVP shipped a personality engine and AISP-visibility moat instead. Tier-2 picks up the original Sprint J vision: an in-product support agent that reads the user's spec, the user's logs, and the AISP atom history to answer "why did the model do that?" *Why commercial:* the agent needs to reason over private session data, which requires the persistence and identity surface that is itself Tier-2.
- **Multi-tenant collaboration on a single spec.** Two builders editing the same spec at the same time, with merge resolution at the atom level. *Why commercial:* CRDTs, server reconciliation, and presence are an operational surface, not an architectural one. The single-user experience is the MVP; the multi-user experience is the product.

That is the full list. No surprises hiding in the second half of a future blog post.

## What the boundary is *not*

A few things that *could* have been moved behind a paywall and were deliberately left in the open core:

- **The AISP open standard** at `github.com/bar181/aisp-open-core`. The moat is the product that produces the spec, not the format. Closing the format would close the ecosystem.
- **The persona scoring rubric and brutal-honest review process** in `plans/strategic-reviews/`. Methodology is methodology. We do not gate it.
- **Every phase retrospective.** Keep / drop / reframe on disk for every sealed phase. Hiding failures would defeat the trust contract.
- **The full ADR ledger.** All 107 accepted ADRs, the 11 documented numbering gaps, the supersedence chains.

If the moat is the architecture, the architecture has to be readable. We did the readable part first.

## The trust contract, restated

Open-core is a contract. Hey Bradley's contract: every feature that proves the spec-layer thesis is in the open repo today, MIT-licensed, no asterisks. Every feature deferred to commercial is named in this post, in CLAUDE.md "Deferred to Commercial (Tier-2)", and in `plans/strategic-reviews/open-core-moat-roadmap.md`. The list does not get longer in private. If a feature moves from MVP to Tier-2, an ADR documents it and the next phase retro declares it.

The spec engine is open. The runtime that monetizes the spec engine is commercial. The line between them is named, in writing, in this post. We are not optimizing for the surprise upsell. We are optimizing for the contributor who reads the fine print before they commit hours.

The fine print is reasonable. That is the point.

Read the open-core moat roadmap →
