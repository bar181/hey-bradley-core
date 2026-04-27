# hey-bradley-core
Hey Bradley - Open Core Version.  Harvard University capstone backed by AISP (ai symbolic protocol) for deterministic AI

## Subject Matter Expert Advisors
Reuven Cohen 
Bence Csernak 

## Intial Open Core version
ALM Digital Media Design Capstone May 2026 
Bradley Ross

---

# Hey Bradley

**A whiteboard that listens, builds what you describe in real-time, and secretly writes enterprise specs behind the scenes.**

[![AISP 5.1](https://img.shields.io/badge/AISP-5.1%20Platinum-e8772e.svg)](https://github.com/bar181/aisp-open-core)
[![Harvard Capstone](https://img.shields.io/badge/Harvard-Capstone%20Project-crimson.svg)](https://github.com/bar181)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Built with Vite](https://img.shields.io/badge/Built%20with-Vite%20%2B%20React-646CFF.svg)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Styled%20with-Tailwind%20CSS-06B6D4.svg)](https://tailwindcss.com)

---

## What is Hey Bradley?

Hey Bradley is a **JSON-driven marketing website specification platform** that produces two outputs simultaneously:

1. **A live visual preview** the user interacts with (Reality tab)
2. **Enterprise-grade AISP specification documents** the user exports (XAI Docs tab)

It is not a website builder. It is a **specification platform** that feeds builders, dev tools, and agentic pipelines.

```
Ideation → Hey Bradley → Specs + JSON → Claude Code / Agentic System → Production Site
```

### The 30-Second Demo

1. **Pick a vibe** → website appears instantly (DRAFT mode)
2. **Toggle to EXPERT** → full property inspector reveals (same data, more control)
3. **Toggle to LISTEN** → theatrical dark mode, pulsing red AI orb
4. **Click DATA tab** → see the JSON driving everything
5. **Click XAI DOCS** → see AISP specs auto-generated
6. **Click WORKFLOW** → watch the AI pipeline process in real-time

---

## Architecture

### Two-Mode UI

Hey Bradley has **two independent toggle axes** producing four composite UI states:

| | **BUILD** (manual editing) | **LISTEN** (AI voice capture) |
|---|---|---|
| **DRAFT** (grandma) | Vibe picker, section list, simplified controls | Dark overlay, pulsing red orb |
| **EXPERT** (Framer user) | Property inspector, project explorer, full CSS control | Dark overlay, pulsing red orb |

Both modes read and write to the **same Zustand config store**. Mode switching changes controls, never data.

### Four Center Tabs

| Tab | Purpose |
|-----|---------|
| **REALITY** | Live preview of website sections with click-to-select |
| **DATA** | Full JSON with syntax highlighting, editable, COPY + EXPORT |
| **XAI DOCS** | Auto-generated specs in HUMAN or AISP format |
| **WORKFLOW** | LLM pipeline: Voice Capture → Intent Parsing → AISP Gen → Schema Validation → Reality Render |

### JSON as Single Source of Truth

Everything derives from one JSON object. The UI is a renderer. The builder is a JSON editor. The LLM is a JSON transformer. The specs are JSON interpreters.

```json
{
  "spec": "aisp-1.2",
  "page": "index",
  "version": "1.0.0-RC1",
  "sections": [
    {
      "type": "hero",
      "id": "hero-01",
      "layout": { "display": "flex", "direction": "column", "align": "center", "gap": "24px", "padding": "64px" },
      "content": { "heading": { "text": "Build with voice.", "level": 1, "size": "48px", "weight": 700 }, "subheading": "Ship in minutes.", "cta": { "text": "Get Started", "url": "#pricing" } },
      "style": { "background": "#faf8f5", "color": "#2d1f12", "fontFamily": "Inter", "borderRadius": "8px" }
    }
  ]
}
```

---

## AISP Integration

Hey Bradley uses [AISP 5.1 Platinum](https://github.com/bar181/aisp-open-core) for precision specification generation. AISP reduces ambiguity from 40-65% (natural language) to under 2%.

```aisp
⟦
  Ω := { Define Hey Bradley site configuration }
  Σ := { Site:{spec:"aisp-1.2", page:𝕊, version:𝕊, sections:[Section]}, Section:{type:SectionType, id:𝕊, layout:Layout, content:Content, style:Style} }
  Γ := { R1: ∀ s∈sections : unique(s.id), R2: ∀ s : s.type∈SectionType, R3: ∀ array_items : ∀ item : exists(item.id) }
  Λ := { spec_version:="aisp-1.2", max_sections:=20 }
  Ε := { V1: VERIFY JSON.parse(export)∈Site, V2: VERIFY Ambig(spec)<0.02 }
⟧
```

The XAI DOCS tab generates both human-readable specs and AISP-formatted specs from the current JSON state:

```
@aisp 1.2
@page index
@version 1.0.0-RC1

@section hero hero-01 {
    @layout flex column center
    @gap 24px
    @padding 64px

    @heading[1] "Build with voice." {
        @size 48px
        @weight 700
    }

    @subheading "Ship in minutes."
    @cta "Get Started" → #pricing
}
```

---

## Tech Stack

| Layer | Technology | Status |
|-------|-----------|--------|
| Framework | Vite + React 19 + TypeScript | ✅ shipped |
| Styling | Tailwind CSS + shadcn/ui | ✅ shipped |
| State | Zustand (configStore, intelligenceStore, listenStore, projectStore, chatStore) | ✅ shipped |
| Schemas | Zod (runtime validation, type inference, JSON-patch validator) | ✅ shipped |
| Persistence | sql.js + IndexedDB (cross-tab Web Locks + BroadcastChannel) | ✅ P16 |
| LLM providers | Anthropic Claude SDK + Google Gemini SDK + OpenRouter (raw fetch) + FixtureAdapter + AgentProxyAdapter (DB-backed mock) | ✅ P17/P18/P18b |
| Voice / STT | Web Speech API (push-to-talk) | ✅ P19 |
| BYOK | In-memory by default; optional IndexedDB persist; husky pre-commit + Vite build-time guards (9 key-shape patterns) | ✅ P17 |
| Cost cap | Per-session USD ceiling, default $1.00, range $0.10–$20 | ✅ P17 (P20 wires CostPill UI) |
| Audit / observability | `llm_logs` table with prompt-hash + tokens + latency + cost + status enum (30-day retention) | ✅ P18b |
| Panels | react-resizable-panels | ✅ shipped |
| Icons | Lucide React | ✅ shipped |
| Drag/Drop | @dnd-kit/core + sortable | ✅ shipped |
| Auth (post-MVP) | Supabase | 📅 Sprint H+ |
| Whisper STT (post-MVP) | Whisper API or local model | 📅 Sprint F enhancement |

---

## Quick Start

```bash
# Clone
git clone https://github.com/bar181/hey-bradley-core.git
cd hey-bradley-core

# Install
npm install

# Run
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Setting Up the LLM (Phase 17 — BYOK)

> **This is a public repo. No API keys are committed. Hosted demos use Bring-Your-Own-Key.**
>
> Per ADR-043 (Trust Boundaries) and ADR-040 (`SENSITIVE_KV_KEYS` strip on export), the deployed bundle ships **no** key. You supply your own at runtime.

### Two paths

| Path | When to use | Where the key lives |
|---|---|---|
| **A — Settings panel (BYOK, recommended)** | Production, any deployed instance, casual local development | Browser memory only by default. Optionally persisted to local IndexedDB if you tick *"Remember on this device"*. **Stripped from `.heybradley` exports automatically.** |
| **B — Dev `.env.local`** | Active LLM-feature development on your own machine only | Bundled into the dev server only. **Never deploy a build with this set** — `vite.config.ts` aborts the build if `VITE_LLM_API_KEY` is non-empty during `npm run build`. |

### Path A — BYOK via Settings (production / shared instances)

1. Run `npm run dev` (or visit your deployed URL).
2. Open the **Settings** drawer (cog icon, top right).
3. In the **AI provider** section: pick a provider (Claude / Gemini), paste your key, optionally tick *Remember on this device*, click **Save** then **Test connection**.
4. Get keys from:
   - Claude / Anthropic: <https://console.anthropic.com/settings/keys> (key shape `sk-ant-...`)
   - Gemini / Google AI Studio: <https://aistudio.google.com/apikey> (key shape `AIza...`)
5. Per-session USD cap defaults to `$1.00`; adjustable in Settings (range $0.10–$20).

### Path B — `.env.local` for dev only

```bash
cp .env.example .env.local
# edit .env.local and add your key — ONLY for npm run dev
```

`.env.local` is in `.gitignore` and **must never be committed**.

### Things you must NOT commit to this repo

- `.env.local` or any `.env.*` file containing a real key (`.env.example` is the only env file that's tracked).
- Hard-coded API keys anywhere in `src/**/*.ts` / `*.tsx`.
- Real keys in test fixtures (use synthetic strings — `tests/llm-adapter.spec.ts` shows the pattern with `sk-ant-FAKE…`).
- Real keys in any committed log, screenshot, prompt, or comment.

### How the repo enforces this

| Layer | Mechanism | Files |
|---|---|---|
| Pre-commit | `.husky/pre-commit` runs `scripts/check-secrets.sh` against staged diff; rejects 9 key-shape patterns (Anthropic, OpenAI, Google, HuggingFace, GitHub PAT, Groq, xAI). | `.husky/pre-commit`, `scripts/check-secrets.sh` |
| Build-time | `vite.config.ts` callback throws if `VITE_LLM_API_KEY` is set during `command === 'build'`. | `vite.config.ts` |
| Runtime (export) | `.heybradley` zip strips `byok_*` rows from the `kv` table and nulls `llm_calls.error_text` on export. | `src/contexts/persistence/exportImport.ts` |
| Runtime (logging) | `redactKeyShapes()` redacts SDK error messages before they reach `llm_calls.error_text`. | `src/contexts/intelligence/llm/keys.ts` |

### Secrets that DO live outside the repo

These configuration values are operator-supplied; they live only in your local `.env.local` for development, in the BYOK input field for end users, or in a deploy host's environment variables for hosted demos:

- `VITE_LLM_PROVIDER` — `claude` | `gemini` | `simulated` (this one is OK to deploy publicly)
- `VITE_LLM_MODEL` — optional override (also public-safe)
- `VITE_LLM_API_KEY` — **must be empty in any deployed build** (build-time guard catches non-empty)
- `VITE_LLM_MAX_USD` — per-session USD cap (public-safe)

If you need a hosted demo *with* a default key (no BYOK prompt for visitors), the recommended path post-MVP is a Supabase Edge Function or similar serverless adapter behind the existing `LLMAdapter` interface — keep the key server-side, never bundle it.

### Verifying your setup

```bash
# Type-check + build
npx tsc --noEmit
npm run build

# Run the LLM-adapter tests (uses simulated path; no key needed)
npx playwright test tests/llm-adapter.spec.ts --reporter=line

# Verify pre-commit guard works
bash scripts/check-secrets.sh
```

If any of those fail, the LLM setup is wrong; do not deploy.

---

## Project Structure

```
hey-bradley/
├── src/
│   ├── store/                    # Zustand stores (configStore, uiStore)
│   ├── lib/schemas/              # Zod schemas (masterConfig, sections)
│   ├── lib/deepMerge.ts          # JSON merge (objects deep, arrays replace)
│   ├── components/
│   │   ├── shell/                # AppShell, TopBar, ModeToggle, StatusBar
│   │   ├── left-panel/           # DraftPanel, ExpertPanel, VibeCards
│   │   ├── center-canvas/        # RealityTab, DataTab, XAIDocsTab, WorkflowTab
│   │   ├── right-panel/          # DraftContext, ExpertContext
│   │   └── listen-mode/          # ListenOverlay, RedOrb, Typewriter
│   ├── templates/                # Section renderers (hero/, features/, pricing/, etc.)
│   ├── contexts/                 # DDD bounded contexts (intelligence/, specification/, persistence/)
│   └── presets/                  # Vibe configs (warm.json, ocean.json, forest.json)
├── tailwind.config.ts            # Extended with Hey Bradley design tokens
└── package.json
```

---

## Build Phases

| Level | Phase | Status |
|-------|-------|--------|
| **L1** | Core Builder (Shell, Hero, JSON loop, Listen visual) | ✅ Sealed (P11-P14) |
| **L2** | Full Site Builder (16 section types, CRUD, vibe onboarding, multi-page, ZIP export) | ✅ Sealed (P11-P15) |
| **L3** | Specification Engine (AISP Crystal Atom auto-generated; Blueprints tab) | ✅ Sealed (P12-P15) |
| **L4** | Local Persistence (sql.js + IndexedDB; cross-tab Web Locks; `.heybradley` exports) | ✅ Sealed (P16) |
| **L5** | LLM Chat — text → JSON patches; 5-provider matrix (Claude / Gemini / OpenRouter / Simulated / AgentProxy mock); BYOK; cost cap; audit log | ✅ Sealed (P17-P18b) |
| **L6** | Voice Mode (Web Speech STT, push-to-talk, voice → same chat pipeline) | ✅ Sealed (P19) |
| **L7** | Enterprise Specs + MVP Close (cost-cap pill, Vercel deploy, persona reviews, SECURITY.md) | 🔄 In Flight (P20) |
| **Sprint B** | Simple Chat (natural language input, 2-3 real templates, section targeting, intent translation) | 📅 P21-P23 |
| **Sprint C** | AISP Chat (instruction layer, intent pipeline, 2-step template selection) | 📅 P24-P26 |
| **Sprint D-K** | Templates + Content / Clarification / Listen Enhancement / Interview / Post-MVP / Builder / Agentic / Release | 📅 P27-P55 (post-capstone) |

---

## Design System: "Warm Precision"

Hey Bradley's visual language is **warm, editorial minimalism with engineering credibility.** Warm cream backgrounds, orange accents, monospace uppercase labels, generous whitespace.

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#faf8f5` | Warm off-white page bg |
| Surface | `#f5f0eb` | Cards, panels, inputs |
| Accent | `#e8772e` | Active tabs, CTAs, selected states |
| Text Primary | `#2d1f12` | Warm dark brown headings |
| Text Secondary | `#8a7a6d` | Descriptions, hints |
| Listen BG | `#0a0a0f` | Listen mode dark overlay |
| Orb | `#ef4444` | Pulsing red AI presence |

**Fonts:** DM Sans (UI) + JetBrains Mono (labels, code, status)

---

## Target Users

| User | Mode | Value |
|------|------|-------|
| **Grandson** | DRAFT + BUILD | Click vibes and sections, see a website in seconds |
| **Framer User** | EXPERT + BUILD | Direct CSS property editing, JSON import/export |
| **Dad** | EXPERT + BUILD | Export specs → paste into Claude Code → get production site |
| **Enterprise** | EXPERT + LISTEN | AISP-grade specification documents, < 2% ambiguity |

---

## Coverage

Hey Bradley covers **~70-80% of marketing websites** with **16 section types** (post-P19):

Hero · Features · Pricing · CTA · Footer · Testimonials · FAQ · Value Props · Blog · About · Team · Gallery · Contact · Stats · Process · Hours

Plus: 12 themes · 17 examples (incl. blog-standard, kitchen-sink, capstone) · 300 image-library entries · 13 image effects · 4 website pages (About, Open Core, How I Built This, Docs) · 15+ chat commands · 4 listen demos · 6 spec generators · 7 blueprint sub-tabs · 5 EXPERT center tabs · multi-page support · ZIP export · AISP Crystal Atom output · 5-provider real LLM matrix · Web Speech STT (push-to-talk).

**In scope (P19-sealed MVP):** SaaS landing pages, agency sites, product launches, service businesses, personal brands, startup marketing, consulting firms, event pages, **blogs** (added P15).

**Out of scope (post-MVP):** E-commerce, complex dashboards, full web apps.

**Quality (P19 personas):** Grandma 70 / Framer 84 / Capstone 88 (composite **88/100**).

---

## Documentation

The complete specification is in the `/docs` directory:

| Document | Purpose |
|----------|---------|
| [Doc 1: North Star](docs/FINAL-doc1-north-star.md) | Vision, positioning, success criteria |
| [Doc 2: Architecture](docs/FINAL-doc2-architecture.md) | Data model, ADRs, DDD contexts, import firewall |
| [Doc 3: Implementation Plan](docs/FINAL-doc3-implementation-plan.md) | 21 phases, deliverables, acceptance criteria |
| [Doc 4: Design Bible](docs/FINAL-doc4-design-bible.md) | Colors, typography, component specs, motion, references |
| [Doc 5: Swarm Protocol](docs/FINAL-doc5-swarm-protocol.md) | Agent rules, state laws, execution sequence, cardinal sins |
| [Doc 6: File Structure & AISP](docs/FINAL-doc6-file-structure-ddd-aisp.md) | Directory tree, domain events, configStore contract, AISP examples |

---

## Academic Foundation

Hey Bradley is the product deliverable for Bradley Ross's **Harvard University** Master's capstone project (ALM Digital Media Design, May 2026). The research demonstrates:

- **Specification-driven development** using AISP for < 2% ambiguity in AI-to-AI communication
- **Dual-mode UI architecture** serving both non-technical users and power users with the same underlying data model
- **Voice-first AI interaction** with real-time website generation and invisible documentation
- **Agentic engineering** workflow: specification → Claude Code → production site

---

## Related Projects

| Project | Description |
|---------|-------------|
| [AISP Open Core](https://github.com/bar181/aisp-open-core) | AI Symbolic Protocol v5.1 — the assembly language for AI cognition |
| [Savant AI](https://github.com/bar181/savant-ai-results) | Savant agent testing — 56% quality improvement over standard LLM |
| [BAR Agents](https://github.com/bar181/bar-agents) | Persona-driven agents for evaluation and production workflows |
| [Agentic Lab AI](https://github.com/bar181/agentic-lab-ai) | Teaching repo for rapid webapp creation with AI |

---

## Author

**Bradley Ross**

- 🎓 Harvard University — Master's in Digital Media Design (4.0 GPA, Capstone May 2026)
- 👨‍🏫 CS50 Teaching Fellow / Course Assistant — 10+ terms
- 🏢 Agentics Foundation — Director & Education Lead (100K+ weekly reach)
- 💻 25+ years enterprise architecture and software engineering
- 🔬 Research: Agentic engineering, AGI, neural-symbolic languages (AISP)

📧 [LinkedIn](https://linkedin.com/in/bradaross) · [GitHub](https://github.com/bar181) · [bradley.academy](https://bradley.academy)

---

## License

MIT License — see [LICENSE](LICENSE) for details.

Copyright (c) 2026 Bradley Ross

---

## Citation

```bibtex
@misc{ross2026heybradley,
  author = {Ross, Bradley},
  title = {Hey Bradley: A Voice-First Specification Platform for Marketing Websites},
  year = {2026},
  publisher = {GitHub},
  howpublished = {\url{https://github.com/bar181/hey-bradley-core}},
  note = {Harvard ALM Capstone Project. Built with AISP 5.1.}
}
```

---

*Built with warm precision at Harvard. Powered by [AISP](https://github.com/bar181/aisp-open-core). Designed for AI agents and the humans who orchestrate them.*

---

## Hey Bradley — Full Milestone Schedule

**Velocity: 4 phases/day | Today: Day 1**

| Day | Phases | Key Milestone | Sprint |
|---|---|---|---|
| 1 | P20-P23 | MVP sealed + Vercel live + real templates + intent translation | A-B |
| 2 | P24-P27 | AISP dual-view live + template library | B-C-D |
| 3 | P28-P31 | Content generation — LLM writes actual copy | D |
| 4 | P32-P35 | Assumptions engine + 3-button clarification UX | E |
| 5 | P36-P39 | Listen mode enhanced + review mode | F |
| 6 | P40-P43 | Interview mode POC + voice Q&A loop | G |
| 7 | P44-P46 | Upload references + brand voice ingestion | H |
| 8 | — | **🎯 PRESENTATION PREP — no coding** | — |
| 9 | — | **🎯 REHEARSAL + BUFFER — no coding** | — |
| **10** | — | **🎓 PRESENTATION DAY** | — |
| 11 | P47-P50 | Builder UX enhancements + feedback integration | I |
| 12 | P51-P54 | Agentic support system POC | J |
| 13 | P55-P58 | Performance + error handling + final persona scoring | K |
| 14 | — | **📝 SUBMISSION PREP — no coding** | — |
| 15 | — | **📝 SUBMISSION PREP — no coding** | — |
| 16 | — | **📝 FINAL REVIEW — no coding** | — |
| **17** | — | **📬 FINAL SUBMISSION** | — |
| 18 | P59-P62 | Open-core RC — public repo, README, license, contributing guide | RC |
| 19 | P63-P66 | Open-core beta — Agentics Foundation 20-50 testers | RC |
| 20 | P67-P70 | Open-core feedback integration + polish | RC |
| **21** | — | **🚀 OPEN-CORE PUBLIC RELEASE** | — |
| 25 | — | Multi-page site support begins | Commercial |
| 28 | — | Supabase Edge Function — hosted demo (no BYOK required) | Commercial |
| 30 | — | Complex SPA support (dashboards, web apps) | Commercial |
| 35 | — | Agentic support system — existing codebase analysis | Commercial |
| 40 | — | Commercial tier 1 launch (Starter $20/mo, Pro $50/mo) | Commercial |
| 50 | — | Enterprise tier (AISP specs, $499/seat/mo) | Commercial |
| 60 | — | Hey Bradley specs Hey Bradley (meta-product moment) | Vision |

---

## Critical Path to Presentation (Day 10)

**Must be live by Day 7:**
- AISP dual-view (P24-25) — core thesis made visible
- Listen mode enhanced (P36-39) — the demo differentiator
- 3-button clarification UX (P32-33) — shows AISP intent pipeline

**Submission adds:**
- Interview mode POC (P40-43)
- Upload references (P44-46)
- Full persona re-score

**Open-core release (~Day 21) is the first major post-submission milestone.** Everything after is commercial velocity.

---

*Master schedule reflects observed velocity post-P19 (4 phases/day; originally estimated at 4-6 days per phase). Re-budget at end of each phase. Sprint A (P18-P20) sealed Day 1; remaining sprints scheduled accordingly.*


