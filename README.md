# Hey Bradley

**Hey Bradley generates structured AISP specs that AI agents and 3rd-party tools can consume directly. The whiteboard is the demo. The spec layer is the moat.**

[![AISP 5.1](https://img.shields.io/badge/AISP-5.1%20Platinum-e8772e.svg)](https://github.com/bar181/aisp-open-core)
[![Harvard Capstone](https://img.shields.io/badge/Harvard-Capstone%20May%202026-crimson.svg)](https://github.com/bar181)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Release](https://img.shields.io/badge/release-v1.0.0--RC1-2d1f12.svg)](https://github.com/bar181/hey-bradley-core/releases)

> **The 55% framing.** Most software work happens *before* coding — clarifying what to build, scoping it, writing the spec, holding ambiguity. Hey Bradley owns that layer. You talk, click, or type. It builds a live preview *and* emits a deterministic AISP specification behind the scenes that any agentic coding tool can consume.

```
Ideation → Hey Bradley → AISP Bundle → Claude Code / Cursor / Devin / your-tool → Production
```

---

## Adopting AISP in your project

Hey Bradley is designed to be consumed. AISP bundles are open-spec, polyglot, and ship with TypeScript + Python reference parsers. Five steps from zero to integrated:

1. **Get a sample bundle.** Grab [`examples/3rd-party-consumer/sample-bundle.json`](examples/3rd-party-consumer/sample-bundle.json) for an offline copy, or copy a public Share-Spec URL from any Hey Bradley session (the URL pattern is `/spec/<bundle-id>` and resolves to the same JSON shape).
2. **Parse it.** Drop in the reference parser for your stack:
   - TypeScript: [`examples/3rd-party-consumer/parse-aisp-typescript.ts`](examples/3rd-party-consumer/parse-aisp-typescript.ts)
   - Python: [`examples/3rd-party-consumer/parse-aisp-python.py`](examples/3rd-party-consumer/parse-aisp-python.py)
3. **Inspect the 5 atoms.** Every bundle carries a deterministic trace: **INTENT_ATOM**, **ASSUMPTIONS_ATOM**, **SELECTION_ATOM**, **CONTENT_ATOM**, **PATCH_ATOM**, plus the front-of-pipeline **DECOMP_ATOM** when a request decomposes into multiple clauses.
4. **Read the schema reference.** Field-by-field bundle schema with required/optional markers and version semantics: [`docs/aisp-adoption/01-bundle-schema.md`](docs/aisp-adoption/01-bundle-schema.md).
5. **Walk through a full integration.** End-to-end reference walkthrough — fetch, parse, validate, and act on a bundle in your own pipeline: [`docs/aisp-adoption/02-reference-implementation-walkthrough.md`](docs/aisp-adoption/02-reference-implementation-walkthrough.md).

New to AISP? Start with [`docs/aisp-adoption/00-getting-started.md`](docs/aisp-adoption/00-getting-started.md).

---

## The 5-atom AISP Crystal Atom architecture

Every Bradley reply emits a deterministic trace of five typed atoms. Each atom has a fixed `Σ` (signature), a verifier, and an ADR. This is what the trace pane, the EXPORT button, and 3rd-party consumers all read.

| # | Atom | ADR | Σ — what it carries |
|---|---|---|---|
| 1 | **PATCH_ATOM** | [ADR-045](docs/adr/ADR-045-system-prompt-aisp.md) | full JSON-Patch operations applied to the config tree |
| 2 | **INTENT_ATOM** | [ADR-053](docs/adr/ADR-053-aisp-intent-classifier.md) | classified verb + target type + ordinal scope |
| 3 | **SELECTION_ATOM** | [ADR-057](docs/adr/ADR-057-two-step-aisp-template-selection.md) | 2-step template choice (kind → variant) with reasoning |
| 4 | **CONTENT_ATOM** | [ADR-060](docs/adr/ADR-060-content-generators.md) | section-aware generated copy (tone, length, voice) |
| 5 | **ASSUMPTIONS_ATOM** | [ADR-064](docs/adr/ADR-064-assumptions-llm-lift.md) | declared assumptions + proposed clarifications |

Plus **DECOMP_ATOM** ([ADR-099](docs/adr/)) at the front of the pipeline when a request splits into multiple clauses.

AISP itself is an external open-core protocol — the math-first neural-symbolic language at [bar181/aisp-open-core](https://github.com/bar181/aisp-open-core). Same author. 512 symbols. Sub-2% ambiguity by construction.

---

## Why this exists

Vibe-coding is solved. Lovable, v0, and Claude Designer ship working pages from a prompt. Implementation is solved too — Claude Code, Cursor, and Devin write production code from a clean spec all day long.

**The layer between idea and code is not solved.** That is the spec layer: intent capture, ambiguity reduction, assumption tracking, template selection, content generation. Hey Bradley owns it, and exposes it as a consumable artifact every other tool in your stack can read.

---

## The four moat priorities

### 1. Speed visible — Sprint K (P54, ADR-077)

Every successful patch surfaces a latency badge: *"Updated in 0.8s."* P50 chat-pipeline latency is ≤1.2s on the AgentProxy path.

### 2. Spec unmissable — Sprint L (P55, ADR-078)

The 5-atom AISP trace renders on **100%** of Bradley replies, in every personality, not just EXPERT mode. The spec panel auto-opens on the first successful patch.

### 3. Premium templates — Sprint M (P56, ADR-079)

Three to five strongly opinionated templates per vertical. Each output reads as *"a designer made this,"* not *"AI made this."*

### 4. Shareable output — Sprint N (P57, ADR-081)

Static HTML export plus a content-addressable hosted spec URL. *"Built with Hey Bradley"* attribution renders on every shared output — and the hosted URL is what 3rd-party consumers fetch.

---

## Three modes

| Mode | One-liner |
|---|---|
| **Builder** | Click vibes and sections, drag, edit JSON directly. |
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

Public repo, no committed keys. Hosted demos use bring-your-own-key with a build-time guard that aborts the bundle if `VITE_LLM_API_KEY` is non-empty during `npm run build`.

| Provider | Status | Key shape | Notes |
|---|---|---|---|
| **Anthropic Claude** | shipped (P17) | `sk-ant-...` | <https://console.anthropic.com/settings/keys> |
| **Google Gemini** | shipped (P17) | `AIza...` | <https://aistudio.google.com/apikey> |
| **OpenAI** | shipped (P35) | `sk-...` | added with the ASSUMPTIONS_ATOM lift |
| **OpenRouter** | shipped (P18b) | `sk-or-...` | meta-router; raw fetch adapter |
| **AgentProxy** | shipped (P18b) | none | DB-backed deterministic mock — $0, no network |
| **FixtureAdapter** | shipped (P17) | none | replays canned responses for tests |

Per-session USD cap defaults to $1.00 (range $0.10–$20.00). Audit log in `llm_logs` retains prompt-hash, tokens, latency, cost, and status for 30 days.

---

## Open core vs commercial

Everything here is the **open-core MVP**. The commercial track ships post-defense.

| Open core (this repo) | Deferred to commercial |
|---|---|
| Builder + Chat + Listen modes | Multi-page polish (nav linking, route persistence) |
| 5-atom AISP pipeline + DECOMP front-of-pipeline | Supabase auth + hosted accounts (BYOK only here) |
| 18 section types, 12 themes, 41 templates across 8+ verticals | Tier-2 SaaS-dashboard flagship |
| BYOK across 4 real providers + 2 mocks | Agentic Support System |
| Static HTML export + shareable hosted URL | Learning-flywheel runtime / vector-DB pattern search |
| MIT-licensed source for everything above | Interview Mode (voice-led question loop) |

See [`plans/strategic-reviews/open-core-moat-roadmap.md`](plans/strategic-reviews/open-core-moat-roadmap.md) for the canonical line.

---

## Engineering scoreboard

| Metric | Value |
|---|---|
| ADRs Accepted | 107 (range ADR-045 through ADR-107; gaps documented in [`docs/adr/README.md`](docs/adr/README.md)) |
| PURE-UNIT tests cumulative at P82 / OC-CLEANUP seal | ~984 GREEN |
| Sprints sealed in the moat + open-core window | 22+ (Sprint J → OC-CLEANUP) |
| Source lines of TS/TSX | ~28,400 across 227 files |
| Themes / examples / section types | 12 / 41 / 18 |
| Blog posts (per ADR-097 cadence floor of 12) | 12 |
| Crystal Atoms in production | 5 (+ DECOMP front-of-pipeline) |
| Real LLM adapters | 4 (plus 2 mocks) |
| Demo routes (no API key) | `/demo/listen`, `/demo/chat`, `/demo/full-site` |

Every phase carries an ADR, an end-of-phase retrospective, persona scoring, and a brutal-honest review with fix-passes before the next phase opens.

---

## Status

**`v1.0.0-RC1` — public release candidate.** Sprint M and Sprint N sealed. Capstone defense was May 2026.

If demo URLs are still placeholders when you read this, the public RC was just tagged.

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
