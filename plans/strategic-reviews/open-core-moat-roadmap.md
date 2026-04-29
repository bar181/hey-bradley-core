# Open-Core Moat Roadmap — Sprint K → O

> **Date:** 2026-04-29
> **Status:** RATIFIED — replaces original Sprint K (P54-P56) "Release / OSS RC" scope
> **Authority:** Owner strategic reframe + brutal-honest swarm evaluation (`2026-04-29-product-evaluation.md` + `2026-04-29-sprint-j-system-wide/04-performance-and-forward.md`)
> **Window:** Sprint J sealed `644200a` (D2). System-wide review `ef9a421` (D2). 8 days to capstone defense.
> **Pair this with:** `01.north-star.md`, `STATE.md`, `phase-18/roadmap-sprints-a-to-h.md`.

---

## Why this document exists

Sprint J shipped clean (89.75 system-wide composite, capstone-ready 92/100). The system-wide review and the prior product evaluation converge on the same conclusion: **the current roadmap is optimized for capstone, not for the moat.** The original P54-P56 was generic "Release / OSS RC" polish. That sequence stays, but it ships LAST — after the four moat moves that actually make the product defensible against Lovable / Claude Designer / Cursor close-the-gap pressure.

This file is the canonical reframe. All downstream phase preflights cite back here.

---

## The four moat priorities

The strategic review names exactly four things that turn this from "polished open-source artifact" into "category-defining product." Listed in order of leverage:

1. **Speed visible.** Every successful patch surfaces a latency badge on the bradley reply ("Updated in 0.8s"). The user's gut feels the speed; the screenshot proves it. Lovable doesn't show this. Framer doesn't show this. We will.
2. **Spec unmissable.** The 5-atom AISP trace is currently buried in EXPERT mode behind a tab nobody clicks (and partially in Geek personality only). The trace must surface on EVERY bradley reply, by default, in every personality. The moat must be visible to a reviewer or grandma without prompting.
3. **Premium output.** 3-5 strongly opinionated templates ("SaaS founder", "Indie portfolio", "B2B agency", "Conference site", "Personal brand"). Each output reads as "designer made this," not "AI made this." Currently the example library is broad but uneven; opinionated curation beats variety.
4. **Shareable artifact.** The viral mechanic. Sprint J shipped a clipboard data URL — that won't survive Slack / Twitter / email. Replace with a real hosted URL (Vercel KV stub or Supabase read-only row) + "Built with Hey Bradley" attribution. Without this, distribution stays at D+.

---

## What success looks like at open-core RC

| Priority | Measurable outcome | Gate |
|---|---|---|
| 1. Speed visible | P50 chat-pipeline latency ≤1.2s on AgentProxy path; latency badge on every bradley reply with `data-testid="latency-badge"` | observed in screenshot + 1 Playwright assert |
| 2. Spec unmissable | AISP trace chip rendered on 100% of bradley replies (not opt-in); spec panel auto-opens on first successful patch; 5-atom animation visible during pipeline | visibility ratio = 1.0 across 35/35 example_prompts |
| 3. Premium output | 3-5 strongly opinionated templates landed in registry + library; each self-tested via existing example_prompts coverage | coverage ≥ existing 35/35 + new templates |
| 4. Shareable artifact | Hosted URL works in 3+ messengers (Slack / Twitter DM / iMessage); "Built with Hey Bradley" footer renders on shared output | manual paste-test + 1 Playwright clipboard assert |

These four gates ARE the open-core RC. Sprint O ships the public release on top.

---

## What defers to Tier 2 commercial

Explicit list. None of these are needed for the moat to be visible at open-core RC. All can ship in the commercial track.

- Multi-page support (currently scaffolded but Tier-2 polish: nav linking, page templates, route persistence)
- OAuth / hosted account model (BYOK is sufficient for open core)
- Supabase read-write + telemetry runtime (Sprint N's hosted-share is read-only minimum)
- Vector DB / pattern-search runtime (the learning flywheel proper)
- Agentic Support System (originally scoped for Sprint J/K — defers to commercial; "Hey Bradley uses Hey Bradley" is research, not RC)
- Tier-2 flagship proof point (SaaS dashboard) — recommendation #5 from product-evaluation.md
- AISP adoption growth plan (conference talks, dev community engagement)
- Builder Mode UX further polish (Sprint I remainder)
- Interview Mode (Sprint G)
- Upload + References (Sprint H)

The product-evaluation.md and system-wide-review both flag these as desirable but not moat-critical for the May defense or the public open-core RC.

---

## Sprint K → O at a glance

| Sprint | Phase | Moat priority | Headline deliverable | Status |
|---|---|---|---|---|
| **K** | P54 | 1. Speed visible | Latency capture + UI badge + benchmark mode | NEXT |
| **L** | P55 | 2. Spec unmissable (**most important**) | AISP always-on trace + atom animations + spec primary tab | PLANNED |
| **M** | P56 | 3. Premium output | 3-5 strongly opinionated templates + design discipline | PLANNED |
| **N** | P57 | 4. Shareable artifact | Static HTML export + hosted spec URL (post-defense) | PLANNED |
| **O** | P58 | All 4 ratified publicly | Open-core RC: README/CLAUDE final + demo video + public release (post-defense) | PLANNED |

Each phase carries its own preflight at `plans/implementation/phase-{54..58}/preflight/00-summary.md`.

---

## Honest 8-day timeline (capstone defense window)

```
D1   Sprint J sealed (644200a)                                    ✅ done
D2   System-wide review (ef9a421) + this planning sprint          ✅ done
D3   Sprint K (P54) — Make The Speed Visible
D4   Sprint L (P55) — Make The Spec Unmissable      ← most important
D5   Sprint M (P56) — Premium Templates
D6   Defense prep — demo polish, screenshot pass, retrospective
D7   Defense prep — dry runs, persona re-score, slide deck
D8   Capstone defense — May presentation
---  POST-DEFENSE  ----------------------------------------------------
D9+  Sprint N (P57) — Shareable Output (hosted URL)
D10+ Sprint O (P58) — Open Core RC (public release + demo video)
```

At observed velocity (~6 phases/day per CLAUDE.md effort-estimation rule), each of K/L/M is a one-day shift with full quality discipline (ADR, brutal review, fix-pass, persona re-score). N + O ship after the defense to avoid contaminating the demo with inflight infra.

---

## What drops off the original plan

The original `roadmap-sprints-a-to-h.md` Sprint K (P53-P55, "Release / OSS RC") is replaced by the moat sequence above. Specifically deferred to post-MVP / commercial:

- **Sprint I remainder (P48-P50 builder enhancement):** P48-P49 sealed in earlier waves; remaining polish-layer items are not moat-critical.
- **Sprint G (P41-P44 Interview Mode):** voice-led question loop. Excellent feature; not the moat. Ship in commercial.
- **Sprint H (P45-P47 Upload + References):** style-guide upload + reference codebase ingestion. Tier-2 territory.
- **Original Sprint J (Agentic Support System P50-P52):** Sprint J was repurposed mid-arc into the personality + mobile + share + log layer (delivered as P50-P53). The Agentic Support System belongs in research / commercial, not RC.
- **Original Sprint K "Release / OSS RC" (P53-P55):** generic-polish content folded into Sprint O (P58). Replaced by moat-focused K/L/M/N first.

These are not killed — they are sequenced behind the moat. Once K/L/M/N/O ship, the project re-evaluates which of these to pull into commercial.

---

## Connection to the Sprint J system-wide top-10 recommendations

The system-wide review (`2026-04-29-sprint-j-system-wide/04-performance-and-forward.md` §6) ranked 10 forward-looking recs. Each maps cleanly to a Sprint K-O wave:

| # | Recommendation | Where it lands |
|---|---|---|
| 1 | Split `ChatInput.tsx` + `Onboarding.tsx` LOC violations | Sprint K opener fix-pass (sequenced inside P54 prep, surfaces during K execution) |
| 2 | Add Playwright runtime suite (≤10 cases) | Sprint K (P54) test discipline — latency assert + at least 5 runtime cases |
| 3 | Surface AISP trace chip on every bradley reply | **Sprint L (P55) A1** — the spine of L |
| 4 | Replace placeholder hero with branded sample | Sprint M (P56) A2 — premium-output discipline subsumes this |
| 5 | DEV-warn on ConversationLogTab silent fail | Sprint K opener fix-pass (small) |
| 6 | Memo `PersonalityPicker.previewFor` | Sprint M (P56) micro-perf — bundled with template-render perf passes |
| 7 | Re-render personality previews with recent input | Sprint M (P56) live-feel polish |
| 8 | Scaffold learning-flywheel telemetry | **Defers** to Tier 2 commercial (explicit; see "What defers" above). Sprint O ships a stub README note pointing at the commercial track. |
| 9 | Pick Tier-2 flagship (SaaS dashboard) | **Defers** to Tier 2 commercial. Acknowledged in product-evaluation.md as the "category" gate, but not moat-critical for open-core RC. |
| 10 | Hosted Share Spec link | **Sprint N (P57) A2** — the spine of N |

Recs 8 + 9 are explicit defers. The other eight all land somewhere in K/L/M/N/O. The deferred two are flagged as commercial-track work in `09.post-mvp-open-core.md`.

---

## Risk register (delta from product-evaluation.md R1-R5)

- **R1 (Lovable/Claude Designer/Cursor close the spec gap):** Sprint L makes the spec visible by default → narrows the demo gap, doesn't close the runway. Held at 6-12 months.
- **R2 (Tier 3 Agentic Support is research-grade):** explicit defer above. Risk increased; acknowledged.
- **R3 (Engineering rigor outpaces traction):** Sprint O ships publicly. Without launch, R3 stays existential.
- **R4 (AISP adoption is the moat foundation):** Sprint O includes a `bar181/aisp-open-core` cross-link in README. Growth plan deferred to post-launch.
- **R5 (Marketing-site SAM is small):** explicit defer; acknowledged in commercial-track planning.

---

## Verdict

The polish layer is sufficient. Sprint J shipped the personality + mobile + share + log layer cleanly. **The category claim now needs four things to ship in the next five phases:** speed visible, spec unmissable, premium output, shareable artifact. Then the public RC.

If K/L/M/N/O all land at the quality bar Sprint J held, the open-core release is a B+ → A category artifact. If polish ships instead of moat, the project stays a respected open-source artifact that nobody buys.

This roadmap chooses the moat.
