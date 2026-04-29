# Hey Bradley

**A whiteboard that listens, builds what you describe in real-time, and secretly writes enterprise specs behind the scenes.**

[![AISP 5.1](https://img.shields.io/badge/AISP-5.1%20Platinum-e8772e.svg)](https://github.com/bar181/aisp-open-core)
[![Harvard Capstone](https://img.shields.io/badge/Harvard-Capstone%20May%202026-crimson.svg)](https://github.com/bar181)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Release](https://img.shields.io/badge/release-v1.0.0--RC1-2d1f12.svg)](https://github.com/bar181/hey-bradley-core/releases)

> **The 55% framing.** Most software work happens *before* coding — clarifying what to build, scoping it, writing the spec, holding ambiguity. We own that layer. The whiteboard is the demo. The spec is the moat.

---

## Why this exists

Vibe-coding is solved. Lovable, v0, and Claude Designer can take a prompt and ship a working page. Implementation is solved too — Claude Code, Cursor, and Devin will write production code from a clean spec all day long.

**The layer between idea and code is not solved.** That is the spec layer: intent capture, ambiguity reduction, assumption tracking, template selection, content generation — all the messy pre-coding work that determines whether the implementation phase succeeds or thrashes.

Hey Bradley owns that layer. You talk, click, or type. It builds a live preview *and* emits a deterministic AISP specification behind the scenes that any agentic coding tool can consume. The preview is what users feel. The spec is what AI agents read.

```
Ideation → Hey Bradley → Specs + JSON → Claude Code / Cursor / Devin → Production Site
```

---

## The four moat priorities

The strategic reframe at the top of this RC names four things that turn a polished open-source artifact into a category-defining product. All four shipped before this release:

### 1. Speed visible — Sprint K (P54, ADR-077)

Every successful patch surfaces a latency badge on Bradley's reply: *"Updated in 0.8s."* The user's gut feels the speed; the screenshot proves it. P50 chat-pipeline latency is ≤1.2s on the AgentProxy path. Lovable does not show this. Framer does not show this. We do, by default, on every reply.

### 2. Spec unmissable — Sprint L (P55, ADR-078)

The 5-atom AISP trace renders on **100%** of Bradley replies, in every personality, not just EXPERT mode. The spec panel auto-opens on the first successful patch. Atom animations play during the pipeline. A reviewer or a non-technical user sees the moat without prompting. This is the most important sprint of the moat sequence.

### 3. Premium templates — Sprint M (P56, ADR-079)

Three to five strongly opinionated templates ship in the registry: SaaS founder, indie portfolio, B2B agency, conference site, personal brand. Each output reads as *"a designer made this,"* not *"AI made this."* Opinionated curation beats variety. Coverage holds at the existing 35/35 example_prompts plus the new templates.

### 4. Shareable output — Sprint N (P57, ADR-081)

Static HTML export plus a content-addressable hosted spec URL. Survives Slack, Twitter DMs, iMessage. *"Built with Hey Bradley"* attribution renders on every shared output. Without this, distribution stayed at D+. With this, the artifact carries itself.

---

## The 5-atom AISP Crystal Atom architecture

Every Bradley reply emits a deterministic trace of five typed atoms. Each atom has a fixed `Σ` (signature), a verifier, and an ADR. This is what the trace pane and the EXPORT button both read.

| # | Atom | ADR | Σ — what it carries |
|---|---|---|---|
| 1 | **PATCH_ATOM** | [ADR-045](docs/adr/ADR-045-system-prompt-aisp.md) | full JSON-Patch operations applied to the config tree |
| 2 | **INTENT_ATOM** | [ADR-053](docs/adr/ADR-053-aisp-intent-classifier.md) | classified verb + target type + ordinal scope |
| 3 | **SELECTION_ATOM** | [ADR-057](docs/adr/ADR-057-two-step-aisp-template-selection.md) | 2-step template choice (kind → variant) with reasoning |
| 4 | **CONTENT_ATOM** | [ADR-060](docs/adr/ADR-060-content-generators.md) | section-aware generated copy (tone, length, voice) |
| 5 | **ASSUMPTIONS_ATOM** | [ADR-064](docs/adr/ADR-064-assumptions-llm-lift.md) | declared assumptions + proposed clarifications |

AISP itself is an external open-core protocol — the math-first neural-symbolic language at [bar181/aisp-open-core](https://github.com/bar181/aisp-open-core). Same author. 512 symbols. Sub-2% ambiguity by construction.

---

## Three modes

| Mode | One-liner |
|---|---|
| **Builder** | Click vibes and sections, drag, edit JSON directly — for grandsons and Framer users alike. |
| **Chat** | Type natural language; the 5-atom pipeline turns it into typed patches. Real LLMs, BYOK. |
| **Listen** | Push-to-talk with Web Speech STT; voice → same chat pipeline; review-first card UX. |

All three modes read and write the same Zustand config store. Mode switching changes controls, never data.

---

## Quick start

```bash
git clone https://github.com/bar181/hey-bradley-core.git
cd hey-bradley-core
npm install
npm run dev
```

Opens at <http://localhost:5173>. No keys required to try Builder mode or the FixtureAdapter (zero-cost demo path).

---

## BYOK providers

This is a public repo. No API keys are committed. Hosted demos use bring-your-own-key with a build-time guard that aborts the bundle if `VITE_LLM_API_KEY` is non-empty during `npm run build`.

| Provider | Status | Key shape | Notes |
|---|---|---|---|
| **Anthropic Claude** | shipped (P17) | `sk-ant-...` | <https://console.anthropic.com/settings/keys> |
| **Google Gemini** | shipped (P17) | `AIza...` | <https://aistudio.google.com/apikey> |
| **OpenAI** | shipped (P35) | `sk-...` | added with the ASSUMPTIONS_ATOM lift |
| **OpenRouter** | shipped (P18b) | `sk-or-...` | meta-router; raw fetch adapter |
| **AgentProxy** | shipped (P18b) | none | DB-backed deterministic mock — $0, no network |
| **FixtureAdapter** | shipped (P17) | none | replays canned responses for tests |

Per-session USD cap defaults to $1.00 (range $0.10–$20.00). Audit log in `llm_logs` retains prompt-hash, tokens, latency, cost, and status for 30 days. See [ADR-040](docs/adr/) and [ADR-043](docs/adr/) for the trust-boundary rules.

---

## Open core vs commercial

Everything in this repo is the **open-core MVP**. The commercial track ships post-defense.

| Open core (this repo) | Deferred to commercial |
|---|---|
| Builder + Chat + Listen modes | Multi-page polish (nav linking, route persistence) |
| 5-atom AISP pipeline | Supabase auth + hosted accounts (BYOK only here) |
| 16 section types, 12 themes, 17 examples | Tier-2 SaaS-dashboard flagship |
| BYOK across 4 real providers + 2 mocks | Agentic Support System (Hey Bradley uses Hey Bradley) |
| Static HTML export + shareable hosted URL | Learning-flywheel runtime / vector-DB pattern search |
| MIT-licensed source for everything above | Interview Mode (voice-led question loop) |

See [`plans/strategic-reviews/open-core-moat-roadmap.md`](plans/strategic-reviews/open-core-moat-roadmap.md) for the canonical line between the two tracks.

---

## Engineering scoreboard

| Metric | Value |
|---|---|
| ADRs Accepted | 80 (ADR-001 → ADR-081, with documented numbering gaps; see [`docs/adr/README.md`](docs/adr/README.md)) |
| PURE-UNIT tests cumulative at RC | ~298 GREEN |
| Sprints sealed in the moat window | 7 (Sprint J → Sprint O) over ~2 working days |
| Source lines of TS/TSX | ~28,400 across 227 files |
| Themes / examples / section types | 12 / 17 / 16 |
| Crystal Atoms in production | 5 |
| Real LLM adapters | 4 (plus 2 mocks) |

Velocity discipline kept the brake on: every phase carries an ADR, an end-of-phase retrospective, persona scoring against the rubric, and a brutal-honest review with fix-passes before the next phase opens.

---

## Status

**`v1.0.0-RC1` — public release candidate.** Sprint M and Sprint N sealed. Sprint O is this RC. Capstone defense was May 2026.

- Demo URL: *(owner-deploy placeholder — set after first hosted environment lands)*
- Agentics Foundation beta: *(signup form placeholder — first 100-user cohort gated)*
- Demo video (Hey Bradley vs Lovable, ~90s): *(published with Sprint O Agent O3)*

If any of those slots are still placeholders when you read this, the public RC was just tagged and the assets are landing under [`plans/launch/p58/`](plans/launch/) over the next few hours.

---

## License

[MIT](LICENSE). Copyright © 2026 Bradley Ross.

---

## Author

**Bradley Ross.** Harvard ALM Digital Media Design capstone, May 2026. Director and Education Lead at Agentics Foundation. CS50 Teaching Fellow (10+ terms). 25+ years enterprise architecture.

Email: bar181@yahoo.com · [LinkedIn](https://linkedin.com/in/bradaross) · [GitHub](https://github.com/bar181) · [bradley.academy](https://bradley.academy)

Subject-matter advisors on the open-core arc: **Reuven Cohen**, **Bence Csernak**.

---

*Built with warm precision. Powered by [AISP](https://github.com/bar181/aisp-open-core). Designed for AI agents and the humans who orchestrate them.*
