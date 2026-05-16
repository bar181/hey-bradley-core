# Hey Bradley

> **A Harvard ALM capstone project by Bradley Ross — May 2026.**
> The applied interface for the AI Symbolic Protocol (AISP). Describe a website by voice, chat, or builder controls; a working prototype appears in seconds, while the system emits a deterministic math-first AISP specification that any AI agent can execute directly.

[![AISP 5.1](https://img.shields.io/badge/AISP-5.1%20Platinum-e8772e.svg)](https://github.com/bar181/aisp-open-core)
[![Harvard Capstone](https://img.shields.io/badge/Harvard-Capstone%20May%202026-crimson.svg)](https://github.com/bar181)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Live demo](https://img.shields.io/badge/Live-hey--bradley--core.vercel.app-blue.svg)](https://hey-bradley-core.vercel.app)
[![AISP Ambig 0%](https://img.shields.io/badge/AISP%20Ambig(D)-0%25-brightgreen.svg)](#aisp--the-protocol-under-the-hood)

**Live:** <https://hey-bradley-core.vercel.app> · **AISP open-core:** <https://github.com/bar181/aisp-open-core> · **Author:** Bradley Ross · **Contact:** [bar181@yahoo.com](mailto:bar181@yahoo.com)

---

## Table of contents

1. [Capstone summary](#1-capstone-summary)
2. [Abstract](#2-abstract)
3. [The problem Hey Bradley solves](#3-the-problem-hey-bradley-solves)
4. [Core value props](#4-core-value-props)
5. [AISP — the protocol under the hood](#5-aisp--the-protocol-under-the-hood)
6. [Novel ideas + core concepts](#6-novel-ideas--core-concepts)
7. [Three modes](#7-three-modes)
8. [How developers can use the open core](#8-how-developers-can-use-the-open-core)
9. [Wiki guides + phase-level details](#9-wiki-guides--phase-level-details)
10. [Engineering scoreboard](#10-engineering-scoreboard)
11. [— Getting started —](#11--getting-started-)
12. [BYOK providers + cost discipline](#12-byok-providers--cost-discipline)
13. [Self-hosting](#13-self-hosting)
14. [Contributing + project process](#14-contributing--project-process)
15. [License + author + contact](#15-license--author--contact)

---

## 1. Capstone summary

**Hey Bradley is a Harvard Extension School ALM in Digital Media Design capstone (DGMD E-599, May 2026).** Bradley Ross is the author and sole engineer.

The capstone tests a single hypothesis: **the idea-to-specification phase is the unsolved 55% of software work, and mathematics — not prose — is the only notation precise enough to drive agentic execution at scale.**

The capstone deliverable is two-fold:

- **AISP — the AI Symbolic Protocol.** A 512-symbol, math-first notation published openly under MIT license at [bar181/aisp-open-core](https://github.com/bar181/aisp-open-core). Cross-provider testing confirmed major LLMs (Claude, GPT, Gemini, Llama) parse AISP natively without instruction. AISP specifications hold structurally bounded ambiguity `Ambig(D) < 0.02`. In the current end-to-end pipeline, observed `Ambig(D) = 0.000` across three independent test sites.
- **Hey Bradley — the applied interface.** This repository. A JSON-driven website spec platform with voice / chat / builder input, sub-second live preview via RFC-6902 JSON-Patch, and a 7-document spec bundle (AISP / North Star / Features / Architecture / CSS / Build Plan / Human Spec) emitted on demand. Built in public, open-source, MIT-licensed.

**The methodology validates itself.** Hey Bradley was specified in AISP before being built. The supporting ecosystem now exceeds two million lines of code across the flywheel repos (Hey Bradley + AISP + RuVector + RuFlo). The defense was May 2026.

---

## 2. Abstract

Software is no longer written. It is specified. Primary research with leading agentic engineers measured the idea-to-specification phase at over **55% of development time**, with expert prose prompts carrying **40% ambiguity** and structured prompts reaching only **15%**. At those rates, multi-step agentic workflows compound small misreadings into systemic failure. Natural language cannot carry the precision agentic execution requires.

I hypothesized that mathematics could. `1 + 1 = 2` has one meaning. *"Make it beautiful"* has unlimited ones. I tested this by building a symbolic language and measuring whether it held under real use.

After months of iteration and testing, the result is the **AI Symbolic Protocol (AISP)**, a 512-symbol, math-first notation. Cross-provider testing confirmed that major LLMs parse AISP natively without additional instruction. AISP specifications hold structurally bounded ambiguity below 2%. AISP is published openly under MIT license. A group of leading agentic engineers have been testing AISP with applications in healthcare, financial services, and scientific knowledge encoding.

**Hey Bradley is the applied interface for AISP.** Users at any technical level describe an idea by voice, chat, or builder controls; a working prototype appears in seconds, with a JSON-patch architecture delivering live updates in under a second. The prototype is the secondary artifact. The primary output is an AISP specification, designed for direct execution by AI agents.

The methodology validates itself. Hey Bradley was specified in AISP before being built, and the supporting ecosystem now exceeds two million lines of code. The Hey Bradley system was built in public and open source following the AI-first documentation system this capstone presents.

Multiple tracks follow. The first extends AISP across the full agentic engineering lifecycle, mirroring the process by which Hey Bradley was created. The second is continued research and formal peer review.

Full abstract: [`ABSTRACT.md`](ABSTRACT.md).

---

## 3. The problem Hey Bradley solves

Vibe-coding is solved. Lovable, v0, and Claude Designer ship working pages from a prompt. Implementation is solved too — Claude Code, Cursor, and Devin write production code from a clean spec all day long.

**The layer between idea and code is not solved.** That is the spec layer: intent capture, ambiguity reduction, assumption tracking, template selection, content generation. Hey Bradley owns it, and exposes it as a consumable artifact every other tool in your stack can read.

```
Ideation → Hey Bradley → AISP Bundle → Claude Code / Cursor / Devin / your-tool → Production
```

The bundle is the moat. A prose brief is interpretable in dozens of ways. An AISP atom is interpretable in one.

---

## 4. Core value props

1. **A spec bundle every coding agent can execute.** Hey Bradley emits 7 documents per site — AISP, North Star, Features, Architecture, CSS tokens, Build Plan, Human Spec. AISP carries `Ambig(D) < 0.02`. End-to-end verification has reached 100% reproduction efficacy: a fresh LLM given the AISP alone rebuilds the source MasterConfig with zero drift.
2. **Sub-second iteration.** RFC-6902 JSON-Patch on a typed config tree. P50 chat-pipeline latency ≤ 1.2 s on the AgentProxy path. Every successful patch surfaces a latency badge — *"Updated in 0.8 s."*
3. **Voice, chat, or visual builder — same engine.** Three input modes, one Zustand store, one renderer. Switch input mid-session without losing state.
4. **Math-first, not vibes-first.** The spec is the source of truth. The preview is a side-effect. Every reply traces through the 8-atom AISP pipeline; you can read it, fork it, replay it.
5. **Open core, MIT, no lock-in.** Everything in this repo runs locally. Bring-your-own-key for live LLMs (Anthropic / OpenAI / Gemini / OpenRouter). Zero-cost demo path via the AgentProxy mock adapter.
6. **Designed for AI consumers.** Sample bundles, TypeScript + Python reference parsers, schema docs, end-to-end integration walkthrough. Drop the AISP into Claude Code and it runs.

---

## 5. AISP — the protocol under the hood

**AISP (AI Symbolic Protocol) is the math-first specification language Hey Bradley emits and consumes.** It is published as an independent open-core project at [github.com/bar181/aisp-open-core](https://github.com/bar181/aisp-open-core). Same author. MIT license.

### Why a new language

Prose ambiguity at 40% breaks multi-step agent pipelines. Mathematics doesn't. AISP uses 512 carefully selected glyphs across category-theoretic ranges (Ω, Γ, ∀, Δ, 𝔻, Ψ, ⟦⟧, ∅) and constrains every spec document to the form:

```
𝔸<version>@<date>
γ ≜ <namespace>
ρ ≜ ⟨<top-level keys>⟩

⟦Ω:Objective⟧    { ... }    — purpose, audience, invariants
⟦Σ:Glossary⟧     { ... }    — types, literal values, brand strings, palette hex
⟦Γ:Constraints⟧  { ... }    — structural shape, ordering, uniqueness
⟦Δ:Content⟧      { ... }    — per-component literal props (text, urls, tags)
⟦Λ:Parameters⟧   { ... }    — thresholds, capacities, counts
⟦Ε:Verification⟧ { ... }    — decision procedures, contrast/LCP/AA checks
```

`≜` defines. `⊢` proves. `∀ x ∈ S. P(x)` quantifies. The document parses identically across providers.

### Measured guarantees

- **`Ambig(D) < 0.02`** by construction. Operationalized as: ≥98% of concrete source facts (palette hex, brand strings, every section id, every component prop) appear literally in the spec.
- **100% reproduction efficacy** on the three independent test sites (blog / portfolio / marketing). A fresh LLM given the AISP rebuilds the source MasterConfig without seeing it.
- **Math-first density** — observed prose density 0% in the verified pipeline (every line either symbolic or a literal quoted value).

### The 8-atom architecture

The AISP suite is **COMPLETE** at v2.0.0-RC1. Eight production-wired Crystal Atoms. The five Whiteboard-mode bundle atoms emit on every reply; the three workbench atoms (PROCESS / DDD / AGENT) fire in Planning + Agentics modes.

| # | Atom | ADR | Σ — what it carries |
|---|---|---|---|
| 1 | **PATCH_ATOM** | [ADR-045](docs/adr/ADR-045-system-prompt-aisp.md) | full JSON-Patch operations applied to the config tree |
| 2 | **INTENT_ATOM** | [ADR-053](docs/adr/ADR-053-aisp-intent-classifier.md) | classified verb + target type + ordinal scope |
| 3 | **SELECTION_ATOM** | [ADR-057](docs/adr/ADR-057-two-step-aisp-template-selection.md) | 2-step template choice (kind → variant) with reasoning |
| 4 | **CONTENT_ATOM** | [ADR-060](docs/adr/ADR-060-content-generators.md) | section-aware generated copy (tone, length, voice) |
| 5 | **ASSUMPTIONS_ATOM** | [ADR-064](docs/adr/ADR-064-assumptions-llm-lift.md) | declared assumptions + proposed clarifications |
| 6 | **DECOMP_ATOM** | [ADR-099](docs/adr/) | multi-clause splitter (conjunction-split + verb/target lookup) |
| 7 | **PROCESS_ATOM** | [ADR-118](docs/adr/) | project description → phases / sprints / waves / agents (Planning mode) |
| 8 | **DDD_ATOM** | [ADR-119](docs/adr/) | bounded contexts + 4-kind relationships (Planning mode) |
| 9 | **AGENT_ATOM** | [ADR-120](docs/adr/) | wave context → ordered AgentSpec[] with disjoint ownedFiles (Agentics mode) |

The pipeline that turns a MasterConfig into the 7-document spec bundle is documented in [ADR-156](docs/adr/ADR-156-spec-update-pipeline.md). Verification methodology in `scripts/p127-aisp-verifier.mjs`.

---

## 6. Novel ideas + core concepts

| Concept | What it is | Where it lives |
|---|---|---|
| **AISP** | A 512-symbol math-first protocol; LLMs parse it natively; `Ambig(D) < 0.02` by construction | [aisp-open-core](https://github.com/bar181/aisp-open-core) |
| **Crystal Atom** | A typed unit of AISP output with a signature (Σ), verifier, and ADR. 8 atoms wired across 3 modes | [`docs/adr/ADR-045`](docs/adr/) |
| **JSON-Patch as the contract** | Sub-second updates via RFC-6902 ops against a typed config — preview redraws in <1 s | [`src/contexts/intelligence/applyPatches.ts`](src/contexts/intelligence/applyPatches.ts) |
| **2-step AISP template selection** | Step 1 picks a template kind via Σ-restricted Crystal Atom; step 2 chooses variant. Confidence-gated fallback to rule-based path | [ADR-057](docs/adr/ADR-057-two-step-aisp-template-selection.md) |
| **Spec-update pipeline** | Ordered 7-spec emission with deterministic preprocessing, AISP first, two-step AISP quality recheck, CSS-vs-content split, validation gates, corrective retry | [ADR-156](docs/adr/ADR-156-spec-update-pipeline.md) |
| **8-reviewer brutal-honest pass** | Parallel agent reviewers (UX / prompt-fidelity / JSON / copy / render / cross-site / engine) gate every spec template ≥80/100 before UI exposure | [`plans/hitl/phase-128-agentics-ui/`](plans/hitl/phase-128-agentics-ui/) |
| **AI-first documentation** | Every phase produces preflight + session-log + retrospective. The repository IS the case study | [`plans/hitl/`](plans/hitl/) |
| **Atom-pure boundary** | `src/contexts/intelligence/aisp/*` cannot import from `src/components/*`. Atoms stay logic-only — enforced by ARCH invariant | [ADR-134](docs/adr/) |
| **BYOK trust boundary** | API keys live in `localStorage` only; never cross persistence boundary into log_events / migrations / exports. Build-time guard aborts bundles containing keys | [ADR-043](docs/adr/) + [ADR-153](docs/adr/) |

---

## 7. Three modes

| Mode | Route | One-liner |
|---|---|---|
| **Whiteboard** | `/` | Visual website builder. Click vibes and sections, drag, edit JSON, or chat / listen. The AISP pipeline turns prompts into typed patches. |
| **Planning** | `/planning` | Type a project description; PROCESS_ATOM emits phases / sprints / waves / agents and renders a Process Map. Toggle to domain view; DDD_ATOM emits bounded contexts + relationships. |
| **Agentics** | `/agentics` | Multi-agent coordination with full AISP spec exposure. SpecWorkbench (3-tab Human / AISP / ADR), TDD scaffold generator, KISS reviewer, Seal Panel for end-of-phase artifacts, Export Claude Code button. |

AppShell layout is route-derived (URL is the single source of truth). All three modes read and write the same Zustand config store. The Whiteboard interior preserves the original Builder / Chat / Listen input modes.

---

## 8. How developers can use the open core

Hey Bradley is designed to be consumed. AISP bundles are open-spec, polyglot, and ship with TypeScript + Python reference parsers. Five steps from zero to integrated:

1. **Get a sample bundle.** Grab [`examples/3rd-party-consumer/sample-bundle.json`](examples/3rd-party-consumer/sample-bundle.json) for an offline copy, or copy a public Share-Spec URL from any Hey Bradley session (URL pattern `/spec/<bundle-id>` resolves to the same JSON shape).
2. **Parse it.**
   - TypeScript: [`examples/3rd-party-consumer/parse-aisp-typescript.ts`](examples/3rd-party-consumer/parse-aisp-typescript.ts)
   - Python: [`examples/3rd-party-consumer/parse-aisp-python.py`](examples/3rd-party-consumer/parse-aisp-python.py)
3. **Inspect the 8 atoms.** Every bundle carries a deterministic trace.
4. **Read the schema reference.** [`docs/aisp-adoption/01-bundle-schema.md`](docs/aisp-adoption/01-bundle-schema.md).
5. **Walk a full integration.** [`docs/aisp-adoption/02-reference-implementation-walkthrough.md`](docs/aisp-adoption/02-reference-implementation-walkthrough.md).

New to AISP? Start with [`docs/aisp-adoption/00-getting-started.md`](docs/aisp-adoption/00-getting-started.md).

**Run the spec pipeline against your own config:**

```bash
node scripts/p127-spec-updater.mjs   # 7 specs × 3 example sites in <90 s, ~$0.07
node scripts/p127-aisp-verifier.mjs  # 4-axis quality gate (ambig, reproduction, prose, atoms)
```

Templates are JSON files under `plans/hitl/phase-127-spec-update/templates/` — owner-editable, no script change required.

---

## 9. Wiki guides + phase-level details

### Wiki (`wiki/` — 30+ HTML guides)

Self-contained HTML walkthroughs for non-technical and technical readers alike. Index at [`wiki/index.html`](wiki/index.html).

Highlights:
- [`02-hey-bradley-vision.guide.html`](wiki/02-hey-bradley-vision.guide.html) — the founding thesis
- [`01-agentic-development.guide.html`](wiki/01-agentic-development.guide.html) — what changed in the agentic-engineering shift
- [`capstone-showcase.html`](wiki/capstone-showcase.html) — Harvard defense materials
- [`aisp-explainer.html`](wiki/aisp-explainer.html) — visual AISP primer
- [`hey-bradley-story.html`](wiki/hey-bradley-story.html) — narrative history
- [`30-for-founders.guide.html`](wiki/30-for-founders.guide.html) — non-technical audience entry point
- Phase walkthroughs `03-phase-1-core-builder` through `22-phase-15-developer-assistance` — one HTML guide per major phase
- `21-ruvector-standalone.guide.html` and `23-ruflo-compact-hooks.guide.html` — flywheel-repo deep-dives

### Phase-level details (`plans/hitl/`)

Every phase produces a triplet: `preflight.md` + `session-log.md` + `retrospective.md`. The session-log is the primary source any later agent uses to understand a phase.

- **P121–P125** — visual overhaul + LLM-live integration (composite 90.5/100 across 8 surfaces)
- **P126** — go-live ([`plans/hitl/phase-126-go-live/`](plans/hitl/phase-126-go-live/)): chat history, BYOK panel, specs card, low-confidence handling, multi-site eval (90.2% composite, 3 sites at 100% checklist)
- **P127** — spec-update pipeline ([`plans/hitl/phase-127-spec-update/`](plans/hitl/phase-127-spec-update/)): backend pipeline with template-driven AISP/North Star/Features/Architecture/CSS/Build Plan/Human Spec. 12/12 AISP quality gates pass; `Ambig(D) = 0.000` and reproduction efficacy 100% across 3 sites
- **P128** — template quality lift ([`plans/hitl/phase-128-agentics-ui/`](plans/hitl/phase-128-agentics-ui/)): all 6 non-AISP templates lifted from baseline composite 53.8 → 84.7, every spec ≥80/100 on brutal-honest review
- **ADRs** — 156 + filed; [`docs/adr/README.md`](docs/adr/README.md) is the ledger

### Strategic reviews

Cross-phase deep dives live in [`plans/strategic-reviews/`](plans/strategic-reviews/).

---

## 10. Engineering scoreboard

| Metric | Value |
|---|---|
| ADRs Accepted | 156 (ADR-001 → ADR-156 with documented gaps; see [`docs/adr/README.md`](docs/adr/README.md)) |
| Phases sealed | 128+ (P11 → P128) |
| Source lines of TS/TSX | ~28,400 across 227 files |
| Themes / examples / section types | 21 / 51 / 18 |
| Crystal Atoms in production | 8 — **AISP suite COMPLETE** |
| Real LLM adapters | 4 (Anthropic, OpenAI, Gemini, OpenRouter) + 2 mocks |
| Persona scores (P102 / ADR-132) | Grandma 86 / Framer 86 / Lars 88 |
| SOTA composite (P103 / ADR-133) | 86.7 / 100 vs Lovable 80 / 100 |
| P126 multi-site eval | 90.2% composite across 3 sites (blog / portfolio / marketing) |
| P127 AISP quality | `Ambig(D) = 0.000` · reproduction efficacy 100% · math-first density 0% prose · 12/12 gates pass |
| P128 spec-template lift | composite 53.8 → 84.7 across 3 loops, all 6 specs ≥80 |
| Build entry chunk gzip | 793.32 kB ≤ 800 kB ARCH.1 cap |
| ARCH invariants | 12/12 PASS |

Every phase carries an ADR, an end-of-phase retrospective, persona scoring, and a brutal-honest review with fix-passes before the next phase opens.

---

## 11. — Getting started —

This is the practical half. The first half is "what and why." This half is "how to run it."

### Quick start (no API key required)

```bash
git clone https://github.com/bar181/hey-bradley-core.git
cd hey-bradley-core
npm install
npm run dev
```

Opens at <http://localhost:5173>. No keys required to try Builder mode or the FixtureAdapter (zero-cost demo path).

### Try a live chat or listen session

You'll need a BYOK key. The hosted demo at <https://hey-bradley-core.vercel.app> also supports BYOK — keys never leave `localStorage`.

1. Open the app
2. Click the **API key** indicator in the top-right (or in the status bar)
3. Paste an Anthropic / Gemini / OpenAI / OpenRouter key — the modal runs a smoke-test ping
4. Switch input mode to **Chat** or **Listen** and describe an edit

The chat history persists in `localStorage` under the key `hey-bradley-session-log`. Open `/agentics` → Chat History tab to review the trace.

### Run the spec-update pipeline locally

```bash
# Generate 7 specs for each of the 3 example sites (blog / portfolio / marketing)
node scripts/p127-spec-updater.mjs

# Verify AISP quality (4 axes: ambig, reproduction, prose density, symbol coverage)
node scripts/p127-aisp-verifier.mjs

# Generate the multi-site eval (3 sites × <15-word prompts × 5-reviewer brutal-honest pass)
node scripts/p126-multi-site-eval.mjs
```

Outputs land under `plans/hitl/phase-127-spec-update/runs/` and `plans/hitl/phase-126-go-live/multi-site-eval/output/`.

### Build + verify

```bash
npm run build         # Vite + tsc strict
npm test              # Playwright suite
npm run lint          # ESLint + Prettier
npm run check:gates   # ARCH 12/12 + ADR-lint
bash scripts/check-secrets.sh   # Pre-commit secrets guard
```

---

## 12. BYOK providers + cost discipline

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

Per ADR-043 + ADR-153: API keys live in `localStorage` only, are redacted via `redactKeyShapes` at every persistence boundary, and never appear in IndexedDB / log_events / migrations / exports.

---

## 13. Self-hosting

Hey Bradley is a static React app — host it anywhere that serves a SPA.

```bash
npm install
npm run build
# dist/ contains the production bundle (entry chunk ~793 kB gzip)
```

**Recommended targets:** Vercel (default), Cloudflare Pages, Netlify, GitHub Pages. The repo includes `vercel.json` for SPA-rewrite handling.

**Environment:**
- No env vars required for the build itself (BYOK keys live in user `localStorage`)
- Do NOT set `VITE_LLM_API_KEY` — the build will abort. The owner pre-commit guard exists for exactly this case.

**Production smoke checklist:**

```bash
curl -I https://<your-domain>/         # expect 200
curl -I https://<your-domain>/builder  # expect 200
```

---

## 14. Contributing + project process

Hey Bradley is built with discipline: every change rides a phase with preflight + session-log + retrospective + ADR. The process is itself the case study for the capstone.

- **Phase template:** `plans/hitl/phase-N-*/{preflight, session-log, retrospective}.md`
- **ADR ledger:** [`docs/adr/README.md`](docs/adr/README.md) — every architectural decision is documented before code lands
- **Brutal-honest reviewers:** Major phases run a multi-agent parallel review (UX / fidelity / JSON / copy / render / cross-site / engine) and gate the work behind explicit numeric scores
- **AI-first documentation:** session-logs are the primary source any later agent uses; the repository is meant to be read by agents, not just humans

To propose a change:

1. Open an issue describing the phase scope
2. Author a `preflight.md` with feature roster, ADR plan, DoD
3. Cut `swarm/p<N>-<topic>` from `main`
4. Implement; keep `session-log.md` current as you go
5. Seal with `retrospective.md` (composite score, carry-forwards, plan correction)
6. Open the PR; CI must be green (`npm run build` + `check:gates` + secrets-guard)

Subject-matter advisors on the open-core arc: **Reuven Cohen**, **Bence Csernak**.

---

## 15. License + author + contact

[MIT](LICENSE). Copyright © 2026 Bradley Ross.

### Author

**Bradley Ross.** Harvard ALM Digital Media Design capstone (DGMD E-599, May 2026). Director and Education Lead at the Agentics Foundation. CS50 Teaching Fellow (10+ terms). 25+ years enterprise architecture.

- Email: [bar181@yahoo.com](mailto:bar181@yahoo.com)
- LinkedIn: <https://linkedin.com/in/bradaross>
- GitHub: <https://github.com/bar181>
- Bradley Academy: <https://bradley.academy>

### Contact for next steps + applications

**Hey Bradley and AISP are open core — contact Bradley directly for:**

- Applications of AISP beyond websites (healthcare, financial services, scientific knowledge encoding are already in progress with leading agentic engineers)
- Custom AISP tooling, parsers, or integrations for your stack
- Capstone-related questions or peer-review interest
- Commercial extensions (multi-tenant, hosted accounts, learning-flywheel runtime, vector-DB pattern search — the deferred tier-2 track)
- Speaking, advising, or research collaboration

Reach out at [bar181@yahoo.com](mailto:bar181@yahoo.com).

---

*Built with warm precision. Powered by [AISP](https://github.com/bar181/aisp-open-core). Designed for AI agents and the humans who orchestrate them.*
