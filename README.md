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

| Layer | Technology |
|-------|-----------|
| Framework | Vite + React 18 + TypeScript |
| Styling | Tailwind CSS 3 + shadcn/ui |
| State | Zustand (configStore, uiStore, chatStore) |
| Schemas | Zod (runtime validation, type inference) |
| Panels | react-resizable-panels |
| Icons | Lucide React |
| Drag/Drop | @dnd-kit/core + sortable |
| Auth (planned) | Supabase |
| LLM (planned) | Anthropic Claude API |
| Voice (planned) | Web Speech API / Whisper |

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
| **L1** | Core Builder (Shell, Hero, JSON loop, Listen visual) | 🔄 In Progress |
| **L2** | Full Site Builder (8 sections, CRUD, vibe onboarding) | 📅 Planned |
| **L3** | Specification Engine (auto-generated pillar docs) | 📅 Planned |
| **L4** | Auth & Database (Supabase, project persistence) | 📅 Planned |
| **L5** | LLM Chat (text → JSON patches, copy suggestions) | 📅 Planned |
| **L6** | Voice Mode (STT, Listen mode, virtual whiteboard) | 📅 Planned |
| **L7** | Enterprise Specs (AISP mode, change logs, AI-first export) | 📅 Planned |

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

Hey Bradley covers **~60-70% of marketing websites** with 8 section types:

Hero · Features · Pricing · CTA · Footer · Testimonials · FAQ · Value Props

**In scope:** SaaS landing pages, agency sites, product launches, service businesses, personal brands, startup marketing, consulting firms, event pages.

**Out of scope:** E-commerce, blogs, dashboards, web apps.

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


