# Hey Bradley — Strategic Architecture & Roadmap

> **Status:** DRAFT (vision plan saved at end of Phase 17 for review at the start of Phase 18).
> **Authority:** Discussion document. Will be re-reviewed and refined at Phase 18 kickoff.
> **Saved:** 2026-04-27 by direction of the project owner.
> **Companion:** `roadmap-sprints-a-to-h.md` (the per-phase execution view).

---

## Core Positioning

> **"The virtual whiteboard that drafts your ideas and delivers enterprise-grade specs for your AI coding system."**

The 55% of software development that happens *before* coding. Not a competitor to Figma, Lovable, or Claude Code — a **prerequisite** to all three.

---

## The Moat (Unique Architecture)

### 1. JSON as the foundational layer
Everything is JSON. LLM responses are fast, predictable, mergeable. Preview updates instantly. No full redraws.

### 2. AISP for precision
- Natural language prose: 40–60% ambiguity
- AI-generated prose specs: 10–15% ambiguity
- AISP: **<2% ambiguity**
- Math-first, 512-symbol language understood natively by all LLMs
- One-shot specs — any LLM implements correctly on first attempt
- AI-only (not human-readable by design)
- Source: `bar181/aisp-open-core` `ai_guide`

### 3. Multi-step LLM pipeline

```
Messy user input
  → Intent extraction (AISP)
  → Structured to-do
  → Template selection (not LLM design from scratch)
  → Template modification
  → JSON merge → Preview update
```

LLM **never designs from scratch**. Always modifies proven templates.

### 4. Specs for humans
Human-readable specs alongside AISP. Fills the critical gap in vibe coding tools — the person understands what is being built before a line of code is written.

### 5. Listen mode
Build your website while talking. Voice → transcript → intent → structured spec → JSON update. The virtual whiteboard in real time.

---

## Three User Modes

| Mode | Status | Description |
|---|---|---|
| **Builder** | Table stakes | Visual drag-and-drop, familiar to any website builder user |
| **Chat** | Current marketplace | Type naturally, LLM updates site |
| **Listen** | Unique differentiator | Talk, site builds itself. Interview mode: LLM asks the questions |

---

## Competitive Position

| Tool | Their lane | Our relationship |
|---|---|---|
| Figma / Claude designer | Best visual design | We come *before* them |
| Lovable / AI Studio | Best vibe coding | We provide the spec they need |
| Claude Code | Best AI coding | We deliver the 55% before they start |
| **Hey Bradley** | **The 55% before coding** | Complements all of the above |

---

## POC Scope & Known Gaps

### POC delivers
- Single-page React landing page (SPA)
- Hey Bradley's own landing page as the output
- Chat + Listen + Builder modes
- AISP specs + human specs
- JSON-driven instant preview

### Known POC limitations
- Single page only
- React SPA only
- No multi-page support
- No complex web apps or dashboards
- No process / implementation steps beyond frontend

These are acceptable for **open-core v1**.

---

## Post-MVP Vision

### Product tier 1 — Open Core
SPA landing pages. Current roadmap. Free tier.

### Product tier 2 — Commercial
- Multi-page sites
- Complex single-page apps (dashboards, web apps)
- Full implementation process steps (not just frontend)
- Upload references (style guide, brand voice, existing codebase)
- Google website builder integration

### Product tier 3 — Agentic Support System (highest long-term value)
- Tool for existing products and codebases
- Design the hard architectural problems
- Help all levels of agentic engineers refine ideas
- The commercial product designs and specs Hey Bradley itself
- Becomes the **meta-tool**: Hey Bradley uses Hey Bradley

---

## Full Sprint Roadmap

| Sprint | Range | Focus |
|---|---|---|
| A | P18-20 | Chat Foundation — POC LLM call → JSON merge → preview update. **P19 sealed Listen mode (Web Speech API)** — Sprint F base pulled forward; original P19 "template library" absorbed into P18. P20 in-flight (MVP close). |
| B | P21-23 | Simple Chat — Natural language input. 2–3 templates. Section targeting (`/hero-1`). Intent translation (messy → structured). |
| C | P24-26 | AISP Chat — AISP instruction layer. Shows human the translation steps. 2-step template selection (pick theme → modify). |
| D | P27-31 | Templates + Content — Template library + creation. Content generation (LLM writes the actual words for hero, articles, bios). Content slots into templates. |
| E | P32-35 | Clarification & Assumptions — Ambiguity detection. LLM shows its assumptions. UX for options (click/confirm/correct). Assumptions persist to project context. |
| F | P36-39 | **Listen Mode Enhancement** — base Listen shipped P19. Sprint F now scoped as enhancements: P25 intent-pipeline integration, review mode (transcript + actions side-by-side), voice/text chat bridge, polish + advanced error states. |
| G | P40-43 | Interview Mode — LLM asks questions (text then voice). Interview → project JSON auto-populated. Interview feeds assumptions engine. |
| H | P44-46 | Post-MVP Upload + References — Style guide upload. Brand voice document. Reference codebase ingestion. Google site builder bridge. |
| I | P47-49 | Builder Mode Enhancement — UX improvements based on user feedback. Best practices from existing builders. Areas-for-improvement surfaced post-MVP. |
| J | P50-52 | Agentic Support System — Existing codebase analysis. Hard architecture problem solver. Multi-level agentic engineer tool. **Meta-product:** Hey Bradley specs Hey Bradley. (Capped at 3 phases per owner directive.) |
| K | P53-55 | Release & Polish — Performance + error handling (P53). Final persona scoring (P54). Open-core RC, public launch (P55). |

---

## The Commercial Product in One Line

> **"Take your vibe-coded POC and turn it into a real product — with the specs your AI coding system needs to actually build it."**

---

## Open Strategic Questions for Phase 18 Review

These shape priorities and need owner alignment before we lock the roadmap.

1. **Do we ship the open-core RC at P46 or earlier?** Sprint H–J (Tiers 2/3) is post-MVP commercial. Could we cut earlier and focus on Tier 1 RC? — **RESOLVED:** OSS RC ships at end of P20 (capstone-aligned). Sprints I/J/K become post-MVP commercial work; original H (P44-46) RC milestone collapses into P20.
2. **Tier 2/3 build vs partner.** Do we build multi-page + commercial features ourselves, or partner with an existing platform (Vercel, Webflow, Framer) and provide *only* the spec layer? — **DEFERRED:** Post-MVP, Q3-2026 owner decision. Not blocking MVP.
3. **Pricing model.** BYOK keeps OSS hosting cost ~zero. Commercial Tier 2 needs a hosted offering — flat subscription, per-project, or per-token markup? — **RESOLVED:** Tier 1 BYOK confirmed (user pays $0 to project, ~$0.001-0.01 per chat to provider; Vercel hobby tier). Tier 2 pricing deferred to post-MVP.
4. **Self-hosting.** Should Tier 2 also be self-hostable, or strictly hosted? (Self-hosting widens the moat against Lovable; hosted is easier to monetize.) — **DEFERRED:** Tier 1 (the MVP) is already self-hostable (SPA, no backend). Tier 2 self-hosting is a Q3-2026 question; not blocking MVP.
5. **Capstone deadline alignment.** Capstone defense May 2026. Which sprints are capstone-presentation-required vs deferrable? — **RESOLVED:** Capstone defense **May 2026**. Capstone-required surface = sealed P15-P20 + Sprints B-C if velocity holds (6-phases-per-day reality). Sprint D onwards is post-defense.
6. **AISP open-core licensing.** AISP is published at `bar181/aisp-open-core`. Confirm Hey Bradley's use is fully clear of any license friction at the OSS RC. — **RESOLVED:** AISP at `bar181/aisp-open-core` is owned by the same author (Bradley Ross). No license friction. Cross-link surfaced in `BlueprintsTab.tsx` AISP sub-tab (P20 Day 6 — C12).

---

This document is a working draft. Re-read at start of P18, refine with the swarm, then lock for execution.
