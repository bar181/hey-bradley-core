# Hey Bradley · Agentics Foundation Beta · v1.0.0-RC1

> **Audience:** Agentics Foundation Discord / forum / channel — first 100 beta seats
> **Use:** copy-paste announcement template (the owner posts; the beta participant is the hero)
> **Stamp:** Open core · MIT · `v1.0.0-RC1`

---

## What is Hey Bradley

Hey Bradley is the **whiteboard step before the AI builder**. Roughly 55% of the work in any AI-assisted build is removing ambiguity — picking sections, voice, tone, structure. Lovable, Cursor, v0 all start *after* that work is done. Hey Bradley owns the spec layer: idea in, AISP spec out, then you hand the spec to whichever builder you prefer.

It is the **spec engine that happens to also build**. That order matters.

## Why beta now

We just sealed the four moat priorities and tagged `v1.0.0-RC1`. Hey Bradley is open-core under MIT, and AISP — the math-first symbolic protocol underneath — is itself an open standard at [`bar181/aisp-open-core`](https://github.com/bar181/aisp-open-core). This beta is intentionally for **agentic engineers** — the people who will hand the AISP spec to Claude Code, Cursor, or their own swarm. The capstone defense ships in May 2026; the public RC ships alongside it.

If you build with agents, you are the right reviewer for this product.

## What you get in v1.0.0-RC1

The four moat priorities, each shipped behind a sprint gate:

| Priority | What you see | Sprint | Seal |
|---|---|---|---|
| **1. Speed Visible** | Latency badge on every bradley reply ("Updated in 0.8s") — measured, not claimed | Sprint K (P54) | `44cc36c` |
| **2. Spec Unmissable** | 5-atom AISP trace (PATCH / INTENT / SELECTION / CONTENT / ASSUMPTIONS) renders inline on every turn, default-on, all personalities | Sprint L (P55) | `2944461` |
| **3. Premium Templates** | 3-5 strongly opinionated templates (SaaS founder, indie portfolio, B2B agency, conference, personal brand) with design discipline | Sprint M (P56) | ADR-079 |
| **4. Shareable Output** | Hosted spec URL that survives Slack / DM / email + static HTML export with "Built with Hey Bradley" attribution | Sprint N (P57) | ADR-080 |

Each priority has its own ADR and persona-scored fix-pass. The full provenance is in `plans/strategic-reviews/open-core-moat-roadmap.md`.

## Quick start

```bash
git clone https://github.com/bar181/hey-bradley-core
cd hey-bradley-core
npm install
npm run dev
```

Open `http://localhost:5173` and hold push-to-talk. Describe a site in one sentence. Watch the eight atoms fire. (Mirrors the canonical Quick Start in `README.md`.)

## BYOK providers

Bring your own API key for any of: **Anthropic Claude · Google Gemini · OpenAI · OpenRouter**. All four are wired through the same provider abstraction (ADR-077 series); switch in the EXPERT settings. **Or use AgentProxy** for $0 — it routes to the open path so you can run the full demo without paying for a key.

The BYOK boundary is open core. The hosted-account / OAuth model is explicitly deferred to commercial — see "What's deferred" below.

## What we're looking for

The beta participant is the hero. Concrete asks:

1. **Run the voice → spec → build flow end-to-end.** One sentence in. Spec out. Hand the spec to your own agentic engineer (Claude Code, Cursor, your custom agent). Tell us where the handoff felt unambiguous and where it felt vague.
2. **Share a spec URL.** Use Share Spec; paste the link into a Slack / DM / email with someone who has never seen Hey Bradley. Tell us whether the link survived and whether the recipient understood what they were looking at.
3. **Stress the AISP atom rendering.** Long prompts, ambiguous prompts, multilingual prompts. If a Crystal Atom chip renders wrong (mislabeled, late, not animated, wrong personality variant) — file it.
4. **Tell us where the spec layer is unclear.** This is the moat. If a reviewer cannot see why the spec layer matters within 30 seconds, that is a bug, not a documentation gap.

## Roadmap visible to the community

The full open-core roadmap is in [`plans/strategic-reviews/open-core-moat-roadmap.md`](https://github.com/bar181/hey-bradley-core/blob/main/plans/strategic-reviews/open-core-moat-roadmap.md). It names the four moat priorities, the gates, the sprints that shipped each, and what defers to the commercial track. Public, dated, and source-of-truth.

## What's deferred to commercial

Honest list. None of these are in v1.0.0-RC1; all are sequenced for the commercial track once the open-core arc closes:

- **Multi-page support** (scaffolded, not polished) — nav linking, page templates, route persistence
- **OAuth / hosted accounts** — BYOK is sufficient for open core
- **Tier-2 SaaS dashboard flagship** — the "category" proof point
- **Learning flywheel runtime** — pattern search across sessions, telemetry, Supabase migration
- **Interview Mode (Sprint G)** and **Upload + References (Sprint H)** — both desirable, neither moat-critical
- **Agentic Support System** — research-grade; "Hey Bradley uses Hey Bradley" belongs in a paper, not the RC

We name what we deferred so you know what you are not getting. This is the open-core line — what you get is enough to demonstrate the moat; the commercial track is where the runtime infrastructure lives.

## Where to file feedback

- **Bugs / atom rendering / share-link issues:** [`github.com/bar181/hey-bradley-core/issues`](https://github.com/bar181/hey-bradley-core/issues)
- **AISP protocol questions:** [`github.com/bar181/aisp-open-core/issues`](https://github.com/bar181/aisp-open-core/issues)
- **Beta-cohort discussion:** Agentics Foundation Discord (this thread)

If a beta seat is full when you arrive, you join the waitlist — first 100 cohort is gated to keep telemetry clean for the commercial-track planning loop.

---

**— Bradley Ross**
Harvard ALM, Digital Media Design — capstone, May 2026
[`hey-bradley.com`](https://hey-bradley.com) · [`github.com/bar181/hey-bradley-core`](https://github.com/bar181/hey-bradley-core)
