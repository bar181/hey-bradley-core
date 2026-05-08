# v1.0.0-RC1: Hey Bradley + AISP Open Core

**Release date:** 2026-05-01
**Tag:** `v1.0.0-RC1`
**Branch sealed at:** P83 / OC-17 (`b61fce6`)

---

## Hero

Hey Bradley is a **spec-first AI website builder** that ships a self-describing AISP Crystal Atom bundle alongside every generated site, so any downstream agent can read the design intent — not just the rendered HTML.

Five things that make this RC worth installing:

- **Spec-first AI website builder.** Every generated site emits a machine-readable AISP bundle (`bundle.aisp`) with the same structural fidelity as the live preview. The spec is a first-class output, not a side effect.
- **5-atom Crystal Atom architecture.** SELECTION + CONTENT + INTENT + ASSUMPTIONS + AISP-instruction atoms, plus DECOMP_ATOM as a front-of-pipeline multi-clause splitter (6 atoms total in production). See ADRs 053, 057, 060, 064, 099.
- **Multi-page support.** Per-page bundle emission, page-aware chat pipeline with `scopeRoot` routing, static-HTML `<nav class="hb-page-nav">`. Single-page mode preserved byte-equivalent. ADRs 103-104.
- **41 vertical-positioned templates** across 21 themes, 15 section arrangements, 15 content styles. All 51 Template-Intelligence entries carry `exampleQueries` — LLM-training-ready.
- **3 BYOK providers + Web Speech listen mode.** Claude (Anthropic), Gemini (Google AI Studio), OpenRouter. Push-to-talk Web Speech STT. Zero backend; zero analytics; zero key egress beyond the chosen provider.

---

## What's in

- **84 phases** sealed (P11 → P83) across foundation, Sprints A — F, Sprints G — J, moat Sprints K — N, RC + QA arc (P58 — P60), and the OC arc (P61 — P83).
- **108 ADRs** Accepted on disk (range ADR-045 — ADR-108).
- **5-atom Crystal Atom AISP** in production with DECOMP_ATOM front-of-pipeline.
- **Multi-page** wired end-to-end: `activePageId` in store; PageSelector tabs in left panel; per-page `bundle.pages[]` emission; page-aware pipeline; static-HTML page navigation.
- **18 section types** (hero, features, testimonials, pricing, gallery, faq, cta, blog, case-study, contact-form, …).
- **21 themes** including the P73 audit-fix additions (`dark-feminine`, `industrial-modern`, `cozy-maximalist`).
- **41 templates** including the P80 / OC-15 agentic-product family (`ai-agent-marketplace`, `ai-coding-copilot`, `ai-workflow-platform`, `ai-support-copilot`).
- **12 blog posts** with read-time + share + tag filtering; RSS stub. Voice + length + cadence + distribution standards codified in ADR-097.
- **Spec export quality** (ADR-101): canonical export-modal CTAs, valid HTML5 static export, versioned AISP filename pattern, ≥3-heading spec generators.
- **Performance + accessibility baseline** (ADR-102): route-level `React.lazy + Suspense`, `<img loading="lazy">` with explicit dimensions, aria-labels on icon-only buttons, bundle gzip cap ≤800 KB.
- **500-entry prompt corpus** (ADR-106) for AgentProxy + live-LLM testing arc; multi-page + template-triggers + agentic-product + DECOMP multi-clause + listen-mode transcripts.
- **AISP adoption surface** (ADR-108): README rewrite + `docs/aisp-adoption/` guide tree + `examples/3rd-party-consumer/` polyglot reference implementations (TypeScript + Python, stdlib-only).
- **5-atom AISP demo** at `/demo/full-site` (FullSiteSimulator 10-step coffee-subscription scripted listen-mode flow).
- **Local-first persistence** (sql.js + IndexedDB; ADRs 040-041) with 30-day `llm_logs` retention auto-pruned at every `initDB`.
- **Husky pre-commit secret-shape guard** + Vite build-time `VITE_LLM_API_KEY` assertion. Production deployments ship NO key.

---

## What's deferred

Honest list — these are **not** in v1.0.0-RC1 and are deliberately deferred to a later track:

- **Hosted share URL.** Content-addressable share-spec URL is a stub. Hosted serving deferred to Tier-2 commercial.
- **HNSW vector-DB activation.** Ruvector is a manually-curated static snapshot (126 entries; 0 indexed vectors). HNSW re-index + auto-write per agent run deferred to Tier-2 learning runtime.
- **Multi-tenant + OAuth.** Open-core is single-user single-browser. Supabase auth + multi-tenant persistence in the commercial repo.
- **Native mobile apps.** Responsive-web only (ADR-090).
- **Full WCAG AAA.** Open-core ships a WCAG 2.1 AA-leaning baseline; AAA contrast everywhere not guaranteed.
- **Localization.** English only.
- **Live-LLM evaluation harness.** Prompt corpus runs against AgentProxy mock; live-LLM matrix execution deferred.
- **Tier-2 SaaS-dashboard flagship.** Separate repo, post-MVP.
- **External community engagement** (1 — 2 weeks marketing / advocacy / conferences). Owner-led post-RC.
- **AISP RFC process** for breaking-change `aisp-2.0+` schema bumps. Slated for P84 / OC-18.

---

## Adoption quickstart

Five steps from the README to integrate AISP into any consumer:

1. **Read the bundle schema** — `docs/aisp-adoption/01-bundle-schema.md` documents the canonical `bundle.json` shape (sections, theme, content, navigation, AISP atoms).
2. **Pick a reference implementation** — `examples/3rd-party-consumer/parse-aisp-typescript.ts` (Node 20+ stdlib) or `parse-aisp-python.py` (Python 3.10+ stdlib). Both zero-dependency; no `package.json`; no `requirements.txt`.
3. **Parse a sample bundle** — `examples/3rd-party-consumer/sample-bundle.json` is a minimal valid AISP-1.0 fixture. The reference impls each include a `main` block that loads it and prints atoms.
4. **Walk the atoms** — `docs/aisp-adoption/02-reference-implementation-walkthrough.md` annotates the parser line by line; explains each Crystal Atom in the bundle (SELECTION, CONTENT, INTENT, ASSUMPTIONS, DECOMP).
5. **Validate against your own consumer** — write a tiny unit test that round-trips your bundle through one of the reference impls. The bundle parsing surface is stable across `aisp-1.X` minor versions.

Full guide: [`docs/aisp-adoption/00-getting-started.md`](../aisp-adoption/00-getting-started.md).

---

## Stats

- **84 phases** sealed (P11 → P83)
- **108 ADRs** Accepted on disk
- **671 tests** GREEN across the session OC chain (P62 — P83); ~996+ cumulative pure-unit GREEN at the curated seal-gate subset
- **41 templates**; **21 themes**; **18 section types**; **15 section arrangements**; **15 content styles**
- **12 blog posts**
- **6 atoms** in production (5-atom Crystal Atom AISP + DECOMP_ATOM front-of-pipeline)
- **5 EXPERT center tabs**; **7 Blueprint sub-tabs**
- **3 BYOK providers** + simulated + AgentProxy mock + DEV-only fixture (6 LLM modes total)
- **300 images** in media library; **13 image effects**
- **126 ruvector entries** (manually curated; HNSW deferred)

---

## Thanks

The **AISP open spec** lives at [`bar181/aisp-open-core`](https://github.com/bar181/aisp-open-core). Same author (Bradley Ross). The math-first symbolic protocol is independent of this builder; this RC is one consumer of the spec, and the polyglot reference implementations in `examples/3rd-party-consumer/` exist to make adoption mechanical.

If you ship an AISP consumer in another language (Go, Rust, Swift, Java, …), please open a PR — see `CONTRIBUTING.md` "Contributing AISP reference implementations".

— Bradley Ross
2026-05-01
