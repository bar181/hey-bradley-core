# E2E Test Sprint — Scenario Design + Prompt Sequences (A1)

> **Phase:** E2E-TEST · **Wave 1 / A1** · **Date:** 2026-05-02
> **Owns:** `plans/implementation/phase-e2e-test/01-scenarios.md` (this file)
> **Hand-off:** A2 (Site 1) and A3 (Site 2) consume §2 + §3 verbatim; A4 reviews vs §4–§6.

## §1 Methodology

Each site is built incrementally via 8–10 prompts mixing **chat-mode** (typed text) and **listen-mode** (voice transcript with disfluencies). Prompts span 5 pipeline shapes: simple INTENT-only patches, multi-clause DECOMP splits, listen disfluencies (2-stage capture), page-aware (`pageIterator` per ADR-104), and content-regeneration (CONTENT_ATOM per ADR-060). Per-prompt entry fields:

- **input** — verbatim text the user types or speaks
- **mode** — `chat` | `listen`
- **expected_intent** — `verb` ∈ {hide, show, change, remove, add, reset} + `target.type` ∈ ALLOWED_TARGET_TYPES (`intentAtom.ts` Γ R3 / lines 53–60: hero, blog, footer, features, pricing, cta, testimonials, faq, value-props, gallery, image, team, columns, action, quotes, questions, numbers, divider, text, logos, menu, case-study, contact-form) + optional `target.index` (1-based) + `pageId`
- **expected_route** — `design` | `content` | `structure` | `multi`
- **expected_atom_path** — `INTENT` only / `INTENT+DECOMP` / `INTENT+SELECTION+CONTENT` / `INTENT+PATCH`
- **expected_patches** — high-level: section add/modify/delete + theme/typography fields touched
- **expected_latency_ms** — rules ~50 / DECOMP +100 / matcher +100–300 / CONTENT (LLM) +500–1500 / patch apply +20

All section types must be in the 18-member enum from `src/lib/schemas/section.ts` (the 22 values in `ALLOWED_TARGET_TYPES` are a superset; `divider`, `text`, `logos`, `menu`, `image` are valid section types but rarely user-spawned — used implicitly in templates).

---

## §2 Site 1 — AISP Executive Overview

### Persona profile

A VP of Product or CFO at a 200–800-person mid-market SaaS company is evaluating AI tooling for their engineering org. They are non-technical, time-poor, and skeptical: they've watched their team burn three months on ChatGPT-driven rebuilds that produced confidently wrong results 55% of the time. They land on this site and have ~30 seconds to decide whether AISP is worth a 30-minute conversation. They care about ROI in concrete numbers, reduction in AI rework cycles, and whether this constitutes a defensible competitive moat — not about prompt engineering, agents, or atoms.

### Theme + tone

- **Theme preset:** `corporate-clean` (themeLibrary.ts L128) — adjusted to dark-navy palette via prompt 2
- **Palette target:** `bgPrimary` deep navy `#0f1e3d`, `bgSecondary` `#162a52`, `textPrimary` warm cream `#f5efe2`, `accentPrimary` `#7fb3c9`, `accentSecondary` `#e8c897`
- **Typography:** Inter (body) + Fraunces (headings) — same pair as `clinic.json` canonical
- **Tone:** confident, evidence-backed, ZERO jargon. Numbers + outcomes only.
- **Voice attributes:** `["trustworthy", "executive", "specific"]`

### Site structure target (~7–8 sections)

`menu` → `hero` → `value-props` (3-col columns) → `numbers` (ROI stats) → `case-study` (1 card) → `quotes` (1 testimonial) → `action` (CTA strip) → `footer`. Page 2 (`how-it-works`) added at prompt 6.

### Prompt sequence (9 prompts; chat:7 / listen:2)

#### Prompt 1 — Initial site creation
- **Mode:** chat
- **Input:** "build me an AISP overview site for executives"
- **Expected intent:** verb=`add`, target.type=undefined (whole-site bootstrap)
- **Expected route:** structure
- **Expected atom path:** INTENT → SELECTION (whole-site template scan)
- **Expected patches:** scaffold MasterConfig with `corporate-clean` baseline; 6 default sections (menu/hero/columns/numbers/action/footer); site.purpose=`marketing`, audience=`enterprise`
- **Expected latency_ms:** ~150 (rules + matcher cold path)

#### Prompt 2 — Theme dark navy
- **Mode:** chat
- **Input:** "use a professional dark navy theme with warm cream text"
- **Expected intent:** verb=`change`, target.type=`text` (theme-target keyword routes to design path)
- **Expected route:** design
- **Expected atom path:** INTENT → SELECTION (themeLibrary `corporate-clean` + palette override)
- **Expected patches:** `theme.preset=corporate-clean`, `theme.mode=dark`, palette → navy/cream pair above
- **Expected latency_ms:** ~120 (rules + theme matcher)

#### Prompt 3 — Hero copy on the 55% problem
- **Mode:** chat
- **Input:** "make the headline focus on the 55% problem — your AI builds the wrong thing more than half the time"
- **Expected intent:** verb=`change`, target.type=`hero`, target.index=1
- **Expected route:** content
- **Expected atom path:** INTENT → CONTENT_ATOM
- **Expected patches:** `sections[hero].components[heading].props.text` → "Your AI builds the wrong thing 55% of the time."; subheading → "AISP cuts that to under 2%."
- **Expected latency_ms:** ~900 (rules + CONTENT regen)

#### Prompt 4 — Listen-mode value-props with disfluencies
- **Mode:** listen
- **Input:** "uhh, add three benefits — like, ROI, less rework, and uh, competitive moat"
- **Expected intent:** verb=`add`, target.type=`value-props` (post-clean → "add three benefits ROI less rework competitive moat")
- **Expected route:** content
- **Expected atom path:** STT-clean → INTENT → SELECTION (sectionLibrary `value-props` 3-col) → CONTENT_ATOM
- **Expected patches:** insert `columns` section variant=`value-props`; 3 cards: "ROI you can defend" / "Less rework, more shipping" / "A moat your competitors can't copy"
- **Expected latency_ms:** ~1200 (STT clean +50 / DECOMP skip / SELECTION +200 / CONTENT +900)

#### Prompt 5 — DECOMP multi-clause
- **Mode:** chat
- **Input:** "add a stats section with ROI numbers and a customer quote and tighten the hero subhead"
- **Expected intent:** DECOMP into 3 todos:
  1. verb=`add`, target.type=`numbers` (DECOMP target=`section`)
  2. verb=`add`, target.type=`quotes` (DECOMP target=`section`)
  3. verb=`change`, target.type=`hero` (DECOMP target=`content`)
- **Expected route:** multi
- **Expected atom path:** INTENT → DECOMP → 3× (SELECTION | CONTENT) → PATCH
- **Expected patches:** insert `numbers` (3 stats: "55% → <2% error rate" / "$340K avg yearly rework saved" / "3.1× faster spec-to-prod"); insert `quotes` (1 testimonial); rewrite hero subhead tighter
- **Expected latency_ms:** ~1700 (rules +50 / DECOMP +100 / 2× SELECTION +400 / CONTENT +900 / patch +20)

#### Prompt 6 — Page-aware add page
- **Mode:** chat
- **Input:** "add a how-it-works page"
- **Expected intent:** verb=`add`, target.type=`text` (page-add keyword routes via pageIterator per ADR-104)
- **Expected route:** structure
- **Expected atom path:** INTENT (page-detection branch in `intentAtom.ts` `pageId` regex)
- **Expected patches:** `bundle.pages[]` push `{id:'how-it-works', label:'How it works', sections:[hero, columns, action, footer]}`; `uiStore.activePageId` switches to new page
- **Expected latency_ms:** ~80 (rules + page-create)

#### Prompt 7 — Page-2 hero edit
- **Mode:** chat
- **Input:** "on page 2, change the hero to step 1 of 3"
- **Expected intent:** verb=`change`, target.type=`hero`, target.pageId=`how-it-works`
- **Expected route:** content
- **Expected atom path:** pageIterator.getActivePage → INTENT → CONTENT_ATOM (scopeRoot=`pages.how-it-works.`)
- **Expected patches:** `pages.how-it-works.sections[hero].components[heading].props.text` → "Step 1 of 3 — Bring your spec"; subheading → "AISP atoms turn ambiguous prose into a typed contract."
- **Expected latency_ms:** ~950 (page-scope +50 / CONTENT +900)

#### Prompt 8 — Content regen with CFO language
- **Mode:** chat
- **Input:** "regenerate the value props with stronger CFO language"
- **Expected intent:** verb=`change`, target.type=`value-props`, target.index=1
- **Expected route:** content
- **Expected atom path:** INTENT → CONTENT_ATOM (tone override `executive`+`specific`)
- **Expected patches:** rewrite 3 columns: "Defensible cost reduction" / "Eliminate the 55% rework tax" / "Audit-ready spec lineage"
- **Expected latency_ms:** ~1100 (CONTENT regen with tone)

#### Prompt 9 — Listen-mode CTA polish
- **Mode:** listen
- **Input:** "okay, um, change the call-to-action to say something like 'book a 30-minute roi review' — make it specific."
- **Expected intent:** verb=`change`, target.type=`action`, target.index=1
- **Expected route:** content
- **Expected atom path:** STT-clean → INTENT → CONTENT_ATOM
- **Expected patches:** `sections[action].components[button].props.text` → "Book a 30-minute ROI review"; supporting copy → "We'll model your rework cost in real numbers."
- **Expected latency_ms:** ~1050 (STT +50 / CONTENT +1000)

---

## §3 Site 2 — Developer AISP + Agentic Workflow Retro

### Persona profile

A senior engineer or engineering manager (8–15 years experience) lands on this site after seeing it shared on Hacker News or in a developer Slack. They are technically deep, familiar with TDD/DDD/ADR conventions, and allergic to marketing fluff. They appreciate dry humor, opinionated takes, and specific code references — and they will close the tab inside 10 seconds if they smell a "transform your AI workflow" generic SaaS pitch. They want to know: what's the actual mechanism, what does the code look like, and is the author someone who has shipped real systems. They will read footnotes. They will check the GitHub.

### Theme + tone

- **Theme preset:** `industrial-modern` (themeLibrary.ts L537) — closest match for retro/terminal aesthetic; monospace headings, amber accents
- **Mode:** dark default
- **Palette target:** `bgPrimary` near-black `#0a0a0a`, `bgSecondary` `#141414`, `textPrimary` `#e8e3d8`, `accentPrimary` amber `#ffb000` (CRT amber), `accentSecondary` `#22c55e` (terminal green)
- **Typography:** JetBrains Mono (headings) + Inter (body) — monospace heading is the retro tell
- **Tone:** opinionated, dry humor, founder-authority Don-Miller style. Specific. Names files. No condescension.
- **Voice attributes:** `["technical", "opinionated", "dry-humor"]`

### Site structure target (~8–10 sections)

`menu` → `hero` (retro tagline) → `numbers` (1162+ tests / 122 ADRs / 8 atoms) → `columns` (7-step methodology) → `case-study` (1 card: Hey Bradley building itself) → `questions` (FAQ) → `action` (GitHub CTA) → `footer`. Page 2 (`methodology`) added at prompt 5; FAQ moved to page 2 at prompt 6.

### Prompt sequence (10 prompts; chat:7 / listen:3)

#### Prompt 1 — Initial dev-focused site
- **Mode:** chat
- **Input:** "build me a dev-focused site about Hey Bradley's agentic workflow"
- **Expected intent:** verb=`add`, target.type=undefined (whole-site bootstrap)
- **Expected route:** structure
- **Expected atom path:** INTENT → SELECTION (templateLibrary scan; matches `cli-tool` or `api-docs-landing` shape)
- **Expected patches:** scaffold MasterConfig; 6 default sections (menu/hero/columns/numbers/action/footer); site.audience=`developer`, purpose=`marketing`
- **Expected latency_ms:** ~150 (rules + matcher)

#### Prompt 2 — Dark terminal theme
- **Mode:** chat
- **Input:** "use a dark terminal style with monospace headings and amber accents"
- **Expected intent:** verb=`change`, target.type=`text` (theme keywords route design path)
- **Expected route:** design
- **Expected atom path:** INTENT → SELECTION (themeLibrary `industrial-modern`)
- **Expected patches:** `theme.preset=industrial-modern`, mode=dark, palette → near-black + amber + green; typography.headingFamily=`JetBrains Mono`
- **Expected latency_ms:** ~130 (rules + theme matcher)

#### Prompt 3 — Listen-mode hero with humor
- **Mode:** listen
- **Input:** "make the headline something like… your AI builds the wrong site fifty-five percent of the time. and it's confidently wrong."
- **Expected intent:** verb=`change`, target.type=`hero`, target.index=1
- **Expected route:** content
- **Expected atom path:** STT-clean → INTENT → CONTENT_ATOM (tone=`dry-humor`)
- **Expected patches:** `sections[hero].components[heading].props.text` → "Your AI builds the wrong site 55% of the time."; subheading → "And it's confidently wrong about it. AISP fixes that."
- **Expected latency_ms:** ~1000 (STT +50 / CONTENT +950)

#### Prompt 4 — DECOMP multi-clause methodology + stats + quote
- **Mode:** chat
- **Input:** "add a methodology section with the 7 steps and a stats grid showing 1162 tests and 122 ADRs and a quote from a developer"
- **Expected intent:** DECOMP into 3 todos:
  1. verb=`add`, target.type=`columns` (7-step methodology)
  2. verb=`add`, target.type=`numbers` (stats grid)
  3. verb=`add`, target.type=`quotes` (developer testimonial)
- **Expected route:** multi
- **Expected atom path:** INTENT → DECOMP → 3× (SELECTION → CONTENT) → PATCH
- **Expected patches:** insert `columns` (7 cards: Phase exec / EOP / Brutal review / Persona score / Carry-forward / KISS-cut / Seal); insert `numbers` (3 stats: "1,162+ tests GREEN" / "122 ADRs sealed" / "8 AISP Crystal Atoms"); insert `quotes` (1 dev testimonial)
- **Expected latency_ms:** ~1900 (rules +50 / DECOMP +100 / 3× SELECTION +600 / CONTENT +1100 / patch +50)

#### Prompt 5 — Page-aware methodology page
- **Mode:** chat
- **Input:** "add a methodology page with detail on each of the 7 steps"
- **Expected intent:** verb=`add`, target.type=`text` (page-add)
- **Expected route:** structure
- **Expected atom path:** INTENT (page-create branch) → CONTENT (per-step expansion)
- **Expected patches:** `bundle.pages[]` push `{id:'methodology', label:'7-Step Methodology', sections:[hero, columns(7-detail), action, footer]}`; activePageId switches
- **Expected latency_ms:** ~1300 (page-create +80 / CONTENT batch +1200)

#### Prompt 6 — Page-2 FAQ add
- **Mode:** chat
- **Input:** "on page 2, add an FAQ section at the bottom"
- **Expected intent:** verb=`add`, target.type=`questions`, target.pageId=`methodology`
- **Expected route:** structure
- **Expected atom path:** pageIterator.getActivePage → INTENT → SELECTION (sectionLibrary `questions`) → CONTENT
- **Expected patches:** `pages.methodology.sections[]` append `questions` section with 4 default FAQ cards (placeholder pre-regen)
- **Expected latency_ms:** ~1100 (page-scope +50 / SELECTION +200 / CONTENT +850)

#### Prompt 7 — Content regen FAQ with humor
- **Mode:** chat
- **Input:** "regenerate the FAQ with opinionated answers and a bit of dry humor"
- **Expected intent:** verb=`change`, target.type=`questions`, target.index=1, target.pageId=`methodology`
- **Expected route:** content
- **Expected atom path:** INTENT → CONTENT_ATOM (tone=`opinionated`+`dry-humor`)
- **Expected patches:** rewrite 4 FAQ items: "Why not just use ChatGPT?" / "Is AISP another framework?" / "Will this work with my codebase?" / "Why should I trust the math?"
- **Expected latency_ms:** ~1300 (CONTENT with tone override)

#### Prompt 8 — Listen-mode DECOMP with disfluencies
- **Mode:** listen
- **Input:** "uhh, can we... add a numbers section above the methodology with like, the test count and adr count? and make it look kinda terminal-y."
- **Expected intent:** STT-clean → DECOMP into 2 todos:
  1. verb=`add`, target.type=`numbers` (target=section, with positional hint "above methodology")
  2. verb=`change`, target.type=`text` (target=theme, "terminal-y" → industrial-modern reinforce)
- **Expected route:** multi
- **Expected atom path:** STT-clean → INTENT → DECOMP → SELECTION + design-confirm → PATCH
- **Expected patches:** insert `numbers` section before columns(7-step) on page 1 (already exists from prompt 4 — DECOMP detects duplicate, skips with deferred status); reaffirm theme (no-op patch)
- **Expected latency_ms:** ~1200 (STT +50 / DECOMP +100 / dedup-check +50 / patch +20)

#### Prompt 9 — Case-study insert
- **Mode:** chat
- **Input:** "add a case study about Hey Bradley building itself — meta, but honest"
- **Expected intent:** verb=`add`, target.type=`case-study`
- **Expected route:** content
- **Expected atom path:** INTENT → SELECTION (sectionLibrary `case-study`) → CONTENT_ATOM
- **Expected patches:** insert `case-study` section between case-study slot and questions; 1 card: "Hey Bradley built Hey Bradley" with metrics (122 ADRs / 96 phases / 1,162+ tests) + 3-paragraph narrative
- **Expected latency_ms:** ~1400 (SELECTION +250 / CONTENT +1100)

#### Prompt 10 — Listen-mode CTA refinement
- **Mode:** listen
- **Input:** "okay last thing — make the call-to-action say like 'read the source on github' and link it to the open-core repo"
- **Expected intent:** verb=`change`, target.type=`action`, target.index=1
- **Expected route:** content
- **Expected atom path:** STT-clean → INTENT → CONTENT_ATOM
- **Expected patches:** `sections[action].components[button].props.text` → "Read the source on GitHub"; `props.href` → `https://github.com/bar181/hey-bradley-core`; supporting copy → "It builds itself. Honestly."
- **Expected latency_ms:** ~1000 (STT +50 / CONTENT +950)

---

## §4 Common pipeline expectations

Cross-cutting invariants A2 + A3 must honor when simulating the pipeline:

- **Page-aware (ADR-104):** every prompt referencing "page N" or "on page X" triggers `pageIterator.getActivePage(config, activePageId)` BEFORE intent classification; resulting patches are prefixed via `prefixPatchPaths(patches, scopeRoot)` where `scopeRoot = "pages." + activePageId + "."`. Single-page mode (default) keeps `scopeRoot=""` for byte-equivalent behavior.
- **DECOMP_ATOM (ADR-099):** any utterance containing 2+ coordinating conjunctions (` and `, `, `, `; `, ` then `, ` also `) triggers DECOMP_ATOM split BEFORE matcher. Each Todo independently flows through INTENT → matcher; `confidence ≥ 0.7` gate must hold for batch-execute, else fallback to single-clause path.
- **Template intelligence (ADR-098):** theme keywords ("dark navy", "terminal", "amber", "monospace", "professional") match against `themeLibrary.ts` `exampleQueries` arrays; section keywords ("stats", "ROI numbers", "FAQ", "case study") match against `sectionLibrary.ts`; tone keywords ("CFO", "dry humor", "opinionated") match against `contentLibrary.ts`.
- **CONTENT_ATOM (ADR-060):** content-regen prompts route through `generateContent` with `tone` and `voiceAttributes` from site config; LLM-enriched in production, simulated by sub-agent here.
- **Listen mode (2-stage capture):** STT raw transcript with disfluencies feeds `webSpeechAdapter`-style cleaner first; cleaned utterance then enters chat pipeline. The raw transcript is logged to `conversationLog` per ADR-075; cleaned form is what intent classification sees.
- **Section type enum:** all `target.type` values must be in the 18-member `sectionTypeSchema` (`src/lib/schemas/section.ts` L5–11) for valid patches.

## §5 Timing model

Per-prompt latency assumptions for build-log entries (rules-based pipeline; LLM portions simulated by sub-agent acting as model):

| Stage | Latency (ms) | Notes |
|---|---|---|
| INTENT classify (rules-only) | ~50 | regex + verb/target lookup |
| INTENT classify (LLM-enriched) | ~800 | Claude/Gemini round-trip; not used in this sprint (no BYOK) |
| DECOMP_ATOM split | +100 | conjunction-split + per-clause verb/target lookup |
| SELECTION_ATOM template match | +100–300 | per template kind; 21 themes / 15 sections / 15 content styles |
| CONTENT_ATOM regen | +500–1500 | LLM-equivalent; sub-agent here |
| PATCH_ATOM apply | +20 | JSON-patch over MasterConfig |
| pageIterator scope-prefix | +50 | path-prefix only when scopeRoot ≠ "" |
| STT clean (listen mode) | +50 | disfluency strip + cleaned-form normalize |

**Site 1 expected total wall-clock simulated:** ~9.3 sec (sum of 9 prompt latencies).
**Site 2 expected total wall-clock simulated:** ~12.5 sec (sum of 10 prompt latencies; 3 listen + 1 DECOMP + 1 page-create-with-content drives higher mean).

## §6 Carry-forward to A2 + A3

What each Wave 2 agent inherits from this doc:

**A2 (Site 1 — Executive AISP) needs:**
- §2 prompt sequence (9 prompts) verbatim as build script
- §4 pipeline expectations as classification building blocks
- §5 timing model for build-log latency entries
- Final JSON output target: `src/data/examples/aisp-executive.json` (≤400 LOC; validates against `MasterConfig` schema)
- Build log target: `plans/implementation/phase-e2e-test/02-site-1-build-log.md` (≤300 LOC; per-prompt markdown table mirroring SQLite `log_events` shape: timestamp / request_id / prompt / classified_intent / patches_applied / latency_ms)

**A3 (Site 2 — Developer Retro) needs:**
- §3 prompt sequence (10 prompts) verbatim as build script
- §4 pipeline expectations as classification building blocks
- §5 timing model for build-log latency entries
- Final JSON output target: `src/data/examples/aisp-developer-retro.json` (≤400 LOC; validates against `MasterConfig` schema)
- Build log target: `plans/implementation/phase-e2e-test/03-site-2-build-log.md` (≤300 LOC; same shape as A2's log)

**Both agents:** real opinionated copy (no Lorem); ≥6 sections per site; existing 41 templates UNCHANGED; theme palettes valid hex; voice attributes from §2/§3 propagated to `site.voiceAttributes` in MasterConfig.
