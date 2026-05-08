# Hey Bradley

**Hey Bradley generates structured AISP specs that AI agents and 3rd-party tools can consume directly. The whiteboard is the demo. The spec layer is the moat.**

[![AISP 5.1](https://img.shields.io/badge/AISP-5.1%20Platinum-e8772e.svg)](https://github.com/bar181/aisp-open-core)
[![Harvard Capstone](https://img.shields.io/badge/Harvard-Capstone%20May%202026-crimson.svg)](https://github.com/bar181)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Release](https://img.shields.io/badge/release-v2.0.0--RC1-2d1f12.svg)](https://github.com/bar181/hey-bradley-core/releases)

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
3. **Inspect the 8 atoms.** The AISP suite is COMPLETE at v2.0.0-RC1. Every bundle carries a deterministic trace of the 5 baseline atoms: **INTENT_ATOM**, **ASSUMPTIONS_ATOM**, **SELECTION_ATOM**, **CONTENT_ATOM**, **PATCH_ATOM**, plus the front-of-pipeline **DECOMP_ATOM** when a request decomposes into multiple clauses. Planning + Agentics modes additionally fire **PROCESS_ATOM**, **DDD_ATOM**, and **AGENT_ATOM** — phases / sprints / waves / agents, bounded contexts, and disjoint-ownedFiles agent specs.
4. **Read the schema reference.** Field-by-field bundle schema with required/optional markers and version semantics: [`docs/aisp-adoption/01-bundle-schema.md`](docs/aisp-adoption/01-bundle-schema.md).
5. **Walk through a full integration.** End-to-end reference walkthrough — fetch, parse, validate, and act on a bundle in your own pipeline: [`docs/aisp-adoption/02-reference-implementation-walkthrough.md`](docs/aisp-adoption/02-reference-implementation-walkthrough.md).

New to AISP? Start with [`docs/aisp-adoption/00-getting-started.md`](docs/aisp-adoption/00-getting-started.md).

---

## The 8-atom AISP Crystal Atom architecture

The AISP suite is **COMPLETE** at v2.0.0-RC1 — eight production-wired Crystal Atoms. The five Whiteboard-mode bundle atoms emit on every reply; the three workbench atoms (PROCESS / DDD / AGENT) fire in Planning + Agentics modes. Each atom has a fixed `Σ` (signature), a verifier, and an ADR. This is what the trace pane, the EXPORT button, and 3rd-party consumers all read.

| # | Atom | ADR | Σ — what it carries |
|---|---|---|---|
| 1 | **PATCH_ATOM** | [ADR-045](docs/adr/ADR-045-system-prompt-aisp.md) | full JSON-Patch operations applied to the config tree |
| 2 | **INTENT_ATOM** | [ADR-053](docs/adr/ADR-053-aisp-intent-classifier.md) | classified verb + target type + ordinal scope |
| 3 | **SELECTION_ATOM** | [ADR-057](docs/adr/ADR-057-two-step-aisp-template-selection.md) | 2-step template choice (kind → variant) with reasoning |
| 4 | **CONTENT_ATOM** | [ADR-060](docs/adr/ADR-060-content-generators.md) | section-aware generated copy (tone, length, voice) |
| 5 | **ASSUMPTIONS_ATOM** | [ADR-064](docs/adr/ADR-064-assumptions-llm-lift.md) | declared assumptions + proposed clarifications |
| 6 | **DECOMP_ATOM** | [ADR-099](docs/adr/) | front-of-pipeline multi-clause splitter (conjunction-split + verb / target lookup) |
| 7 | **PROCESS_ATOM** | [ADR-118](docs/adr/) | project description → phases / sprints / waves / agents → ProcessMap (Planning mode) |
| 8 | **DDD_ATOM** | [ADR-119](docs/adr/) | project description → bounded contexts + 4-kind relationships → DomainModelSVG (Planning mode) |
| 9 | **AGENT_ATOM** | [ADR-120](docs/adr/) | wave context → ordered AgentSpec[] with disjoint ownedFiles + DoD checklists (Agentics mode) |

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

The AISP trace renders on **100%** of Bradley replies, in every personality, not just EXPERT mode. The spec panel auto-opens on the first successful patch. The full 8-atom suite (5 baseline + DECOMP + PROCESS + DDD + AGENT) surfaces across Whiteboard / Planning / Agentics modes per ADR-110.

### 3. Premium templates — Sprint M (P56, ADR-079)

Three to five strongly opinionated templates per vertical. Each output reads as *"a designer made this,"* not *"AI made this."*

### 4. Shareable output — Sprint N (P57, ADR-081)

Static HTML export plus a content-addressable hosted spec URL. *"Built with Hey Bradley"* attribution renders on every shared output — and the hosted URL is what 3rd-party consumers fetch.

---

## Three modes

Three first-class product modes routed at v2.0.0-RC1 per [ADR-116](docs/adr/) — all live, all persisted.

| Mode | Route | One-liner |
|---|---|---|
| **Whiteboard** | `/` | Visual website builder. Click vibes and sections, drag, edit JSON, or chat / listen — the AISP pipeline turns prompts into typed patches. Byte-equivalent to v1.0.0-RC1. |
| **Planning** | `/planning` | Type a project description; PROCESS_ATOM emits phases / sprints / waves / agents and renders a Process Map. Toggle to domain view; DDD_ATOM emits bounded contexts + relationships. Same chat bar drives both atoms. |
| **Agentics** | `/agentics` | Multi-agent coordination with full AISP spec exposure. SpecWorkbench (3-tab Human / AISP / ADR), TDD scaffold generator, KISS reviewer (PASS = zero P1), Seal Panel for end-of-phase artifacts, Export Claude Code button. |

AppShell layout is route-derived (single source of truth is the URL, not the store). All three modes read and write the same Zustand config store. The Whiteboard interior preserves the original Builder / Chat / Listen input modes.

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
| Whiteboard + Planning + Agentics modes (3 routed) | Multi-tenant org + ACL |
| 8-atom AISP suite COMPLETE (PATCH + INTENT + SELECTION + CONTENT + ASSUMPTIONS + DECOMP + PROCESS + DDD + AGENT) | Supabase auth + hosted accounts (BYOK only here) |
| 18 section types, 21 themes, 51 templates across 9+ verticals | Tier-2 SaaS-dashboard flagship |
| BYOK across 4 real providers + 2 mocks | Agentic Support System |
| Static HTML export + Markdown spec bundle (Claude Code consumable) | Learning-flywheel runtime / vector-DB pattern search (HNSW) |
| MIT-licensed source for everything above | Interview Mode (voice-led question loop) |

See [`plans/strategic-reviews/open-core-moat-roadmap.md`](plans/strategic-reviews/open-core-moat-roadmap.md) for the canonical line.

---

## Engineering scoreboard

| Metric | Value |
|---|---|
| ADRs Accepted | 128 files on disk (IDs run ADR-001 — ADR-137 with documented gaps; gaps documented in [`docs/adr/README.md`](docs/adr/README.md)) |
| Tests at P109 anchor (as-of P109 / FINAL-CLEANUP) | 237 cumulative regression GREEN / ~1491+ cumulative session GREEN |
| Phases sealed | 109 (P11 → P109) + 5-PROJECTS + FINAL-CLEANUP |
| Source lines of TS/TSX | ~28,400 across 227 files |
| Themes / examples / section types | 21 / 51 / 18 |
| Blog posts (per ADR-097 cadence floor of 12) | 12 |
| Crystal Atoms in production | 8 — **AISP suite COMPLETE** (PATCH + INTENT + SELECTION + CONTENT + ASSUMPTIONS + DECOMP + PROCESS + DDD + AGENT) |
| Real LLM adapters | 4 (plus 2 mocks) |
| Demo routes (no API key) | `/demo/listen`, `/demo/chat`, `/demo/full-site` |
| Persona scores (P102 / ADR-132) | Grandma 86 / Framer 86 / Lars 88 |
| SOTA composite (P103 / ADR-133) | 86.7 / 100 vs Lovable 80 / 100 |

Every phase carries an ADR, an end-of-phase retrospective, persona scoring, and a brutal-honest review with fix-passes before the next phase opens.

---

## Status

**`v2.0.0-RC1` — Agentic Workbench RC.** Three modes (Whiteboard / Planning / Agentics) routed; 8-atom AISP suite COMPLETE; markdown spec bundle export; comprehensive SQLite log infrastructure. Boundary recorded in [ADR-133](docs/adr/). v1.0.0-RC1 (P11 — P83) closed the original four moat priorities; v2.0.0-RC1 (P85 — P109) adds the workbench arc + final cleanup. Capstone defense was May 2026.

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
