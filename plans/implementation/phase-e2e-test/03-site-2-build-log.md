# E2E Test — Site 2 Build Log (Developer AISP + Agentic Workflow Retro)

> **Phase:** E2E-TEST · **Wave 2 / A3** · **Date:** 2026-05-02
> **Owns:** `plans/implementation/phase-e2e-test/03-site-2-build-log.md` (this file) + `src/data/examples/aisp-developer-retro.json`
> **Reads:** `01-scenarios.md` §3 verbatim (10-prompt sequence) + §4 pipeline expectations + §5 timing model
> **Hand-off:** A4 closer reviews this log against `01-scenarios.md` §3 prompt-by-prompt; consumes JSON output as the canonical Site 2 example.

## §1 Pipeline simulation table

Each row = one prompt entering the chat/listen pipeline. Columns mirror the SQLite `log_events` shape per A1 §6 carry-forward. `request_id` is monotonically incrementing simulated UUID-suffix; timestamps are simulated wall-clock anchored to `2026-05-02T14:00:00Z`. `atom_path` lists every Crystal Atom traversed, in order. `latency_ms` tracks per-prompt total per A1 §5 timing model.

| # | timestamp | request_id | mode | prompt | classified_intent | atom_path | patches_applied | latency_ms |
|---|---|---|---|---|---|---|---|---|
| 1 | 14:00:00.000 | req-s2-001 | chat | "build me a dev-focused site about Hey Bradley's agentic workflow" | verb=add, target.type=undefined (whole-site bootstrap) | INTENT → SELECTION (templateLibrary scan; matches `cli-tool` shape) | scaffold MasterConfig + 6 default sections (menu/hero/columns/numbers/action/footer); site.audience=developer, purpose=marketing, tone=technical | 150 |
| 2 | 14:00:00.310 | req-s2-002 | chat | "use a dark terminal style with monospace headings and amber accents" | verb=change, target.type=text (theme keywords route design path) | INTENT → SELECTION (themeLibrary `industrial-modern` match via "terminal"+"amber"+"monospace" exampleQueries) | theme.preset=industrial-modern, mode=dark, palette → near-black (#0a0a0a) + cream (#e8e3d8) + CRT amber (#ffb000) + terminal green (#22c55e); typography.headingFamily=JetBrains Mono | 130 |
| 3 | 14:00:00.580 | req-s2-003 | listen | "make the headline something like… your AI builds the wrong site fifty-five percent of the time. and it's confidently wrong." | (post-STT-clean) verb=change, target.type=hero, target.index=1 | STT-clean (2-stage; "fifty-five percent" → "55%", strip filler "something like…") → INTENT → CONTENT_ATOM (tone=dry-humor) | sections[hero].components[headline].props.text="Your AI builds the wrong site 55% of the time."; subheading="And it's confidently wrong about it. AISP fixes that." | 1000 |
| 4 | 14:00:01.280 | req-s2-004 | chat | "add a methodology section with the 7 steps and a stats grid showing 1162 tests and 122 ADRs and a quote from a developer" | DECOMP → 3 todos: (a) verb=add, target.type=columns; (b) verb=add, target.type=numbers; (c) verb=add, target.type=quotes | INTENT → DECOMP_ATOM (3 conjunction splits via " and ") → 3× (SELECTION → CONTENT_ATOM) → PATCH | insert columns(7-step methodology cards: Phase exec / EOP / Brutal review / Persona score / Carry-forward / KISS-cut / Seal); insert numbers (1,162+ tests / 122 ADRs / 8 atoms); insert quotes (1 dev testimonial — supplanted at prompt 9 by case-study) | 1900 |
| 5 | 14:00:03.180 | req-s2-005 | chat | "add a methodology page with detail on each of the 7 steps" | verb=add, target.type=text (page-create branch in intentAtom.ts pageId regex) | INTENT (page-create branch) → CONTENT_ATOM batch (per-step expansion) | bundle.pages[] push {id:'methodology', title:'7-Step Methodology', slug:'methodology', sections:[hero, columns(7-detail), action, footer]}; uiStore.activePageId=methodology | 1300 |
| 6 | 14:00:04.480 | req-s2-006 | chat | "on page 2, add an FAQ section at the bottom" | verb=add, target.type=questions, target.pageId=methodology | pageIterator.getActivePage(config, 'methodology') → INTENT → SELECTION (sectionLibrary `questions` accordion variant) → CONTENT (placeholder 4-card pre-regen) | pages.methodology.sections[] append questions section (4 default Q/A placeholders pre-regen); scopeRoot="pages.methodology." prefixed via prefixPatchPaths per ADR-104 | 1100 |
| 7 | 14:00:05.580 | req-s2-007 | chat | "regenerate the FAQ with opinionated answers and a bit of dry humor" | verb=change, target.type=questions, target.index=1, target.pageId=methodology | INTENT → CONTENT_ATOM (tone override: opinionated + dry-humor; voiceAttributes from site config propagated) | rewrite 4 FAQ items: (1) "Why not just use ChatGPT?" → "ChatGPT writes code. Hey Bradley writes the spec ChatGPT will then implement correctly." (2) "Is AISP another framework?" → "AISP is 512 symbols every frontier LLM already understands natively." (3) "Will this work with my codebase?" → "If your codebase has tests + an ADR habit, yes." (4) "Why should I trust the math?" → "Don't. Read the ADRs. Run the tests." Patches scoped under pages.methodology.sections[questions]. Mirrored to home-page faq-home for first-touch parity (pre-page-2 navigation). | 1300 |
| 8 | 14:00:06.880 | req-s2-008 | listen | "uhh, can we... add a numbers section above the methodology with like, the test count and adr count? and make it look kinda terminal-y." | (post-STT-clean) DECOMP → 2 todos: (a) verb=add, target.type=numbers (positional hint "above methodology"); (b) verb=change, target.type=text (theme="terminal-y" → industrial-modern reinforce) | STT-clean (strip "uhh", "...", "like", "kinda") → INTENT → DECOMP_ATOM (2 splits via " and ") → SELECTION (numbers-section dedup-check vs prompt-4 stats-01) + design-confirm (no-op; theme already industrial-modern) → PATCH | DECOMP detects duplicate numbers section already inserted at prompt 4 (matches by section.type + value pattern); todo-1 status=deferred (duplicate); todo-2 status=skipped (theme already matches industrial-modern). Net patches applied: 0 (both deferred/skipped). Conversation log records both deferred reasons per ADR-099 batch-execute fallback. | 1200 |
| 9 | 14:00:08.080 | req-s2-009 | chat | "add a case study about Hey Bradley building itself — meta, but honest" | verb=add, target.type=case-study | INTENT → SELECTION (sectionLibrary `case-study` single-narrative variant) → CONTENT_ATOM (tone=opinionated; voiceAttributes propagated) | insert case-study section between methodology(7-step) and questions(faq-home); 1 narrative card "Hey Bradley built Hey Bradley" with metrics (122 ADRs / 96 phases / 1,162+ tests / ~28,400 LOC / 227 source files) + 3-paragraph honest narrative. Replaces dev-testimonial quotes from prompt 4 todo-3 (consolidated into case-study at owner discretion per AISP visibility ladder ADR-110). | 1400 |
| 10 | 14:00:09.480 | req-s2-010 | listen | "okay last thing — make the call-to-action say like 'read the source on github' and link it to the open-core repo" | (post-STT-clean) verb=change, target.type=action, target.index=1 | STT-clean (strip "okay last thing", "like") → INTENT → CONTENT_ATOM (tone=opinionated) | sections[action].components[cta-button].props.text="Read the source on GitHub"; props.url="https://github.com/bar181/hey-bradley-core"; cta-sub.props.text="It builds itself. Honestly. MIT-licensed open core. ~28K lines of TypeScript. 122 ADRs you can argue with." | 1000 |

**Total simulated wall-clock:** 10,480 ms (~10.5 sec; below A1 §5 estimate of ~12.5 sec because prompt-8 dedup short-circuited 2 todos to deferred/skipped status, saving ~1.7s of SELECTION + CONTENT regen that didn't fire).

---

## §2 Per-prompt narrative

### Prompt 1 — bootstrap
Whole-site scaffold via INTENT → SELECTION. Matcher fired against templateLibrary `cli-tool` shape (the closest dev-tool exemplar). 6 default sections placed; `tone=technical` and `audience=developer` propagated to MasterConfig from prompt keyword "dev-focused".

### Prompt 2 — theme
Theme keywords ("terminal", "amber", "monospace") matched the `industrial-modern` theme preset via `exampleQueries` arrays per ADR-098 / P73 audit. Palette resolved to near-black + cream + CRT amber + terminal green. `borderRadius` set to "4px" for the retro/sharp-edge aesthetic. JetBrains Mono headings + Inter body — the canonical dev-tone pair from `ai-engineer-personal` exemplar.

### Prompt 3 — listen-mode hero with humor
Two-stage capture. Raw STT transcript: "make the headline something like… your AI builds the wrong site fifty-five percent of the time. and it's confidently wrong." Stage-1 cleaner stripped filler ("something like…"); stage-2 normalizer rewrote "fifty-five percent" → "55%" for headline-display fidelity. INTENT classified verb=change, target.type=hero, target.index=1. CONTENT_ATOM regenerated with `tone=dry-humor` (from site.voiceAttributes ["technical","opinionated","dry-humor"]). Latency 1000ms = 50 STT-clean + 950 CONTENT.

### Prompt 4 — DECOMP multi-clause
Three coordinating conjunctions in one utterance ("and"×3). DECOMP_ATOM split into 3 Todos with confidence ≥0.7 (rules-based deterministic ladder per ADR-099). Each Todo independently flowed through INTENT → SELECTION → CONTENT_ATOM. Latency 1900ms = 50 INTENT + 100 DECOMP + 600 (3× SELECTION @200ms) + 1100 (CONTENT batch) + 50 PATCH. The 7-step methodology columns and the 1,162+/122/8 stats grid are the single highest-LOC artifacts on the home page.

### Prompt 5 — page-aware methodology page
Page-create keyword "add a methodology page" routed via the `pageId` regex in `intentAtom.ts` (page-detection branch). Triggers `bundle.pages[]` push with id=`methodology`, slug=`methodology`, title="7-Step Methodology", isHome=false, and a 5-section default scaffold (hero, columns(7-detail), questions, action, footer). `uiStore.activePageId` switches to the new page so prompts 6+ scope correctly. Per-step CONTENT batch fires for the 7 expanded methodology cards (1200ms LLM-equivalent).

### Prompt 6 — page-2 FAQ add
`pageIterator.getActivePage(config, 'methodology')` resolves scopeRoot="pages.methodology.". INTENT → SELECTION → CONTENT for the questions section (placeholder 4-card pre-regen). Patches prefixed via `prefixPatchPaths(patches, 'pages.methodology.')` per ADR-104. Single-page byte-equivalent behavior preserved on the home-page side (no scopeRoot bleed).

### Prompt 7 — FAQ regen with humor
Continued page-2 scope (activePageId=methodology). CONTENT_ATOM regen with explicit tone override: `tone=opinionated`+`dry-humor`. Voice attributes from site config drove the answer-pattern (short, opinionated, names-files-where-possible). Mirrored to the home-page `faq-home` section for first-touch parity since visitors landing on home will see the same FAQ before they navigate to /methodology — the JSON output reflects this dual-mount per the AISP visibility ladder ADR-110.

### Prompt 8 — listen DECOMP with disfluencies + dedup
Heavy disfluency input ("uhh, can we... add", "with like", "kinda"). STT cleaner stripped 4 filler tokens. DECOMP split into 2 Todos. Todo-1 (add numbers above methodology) hit the dedup-check: a `numbers` section already exists at home-page index 1 from prompt 4. DECOMP_ATOM Γ R-dedup-on-same-page heuristic flagged duplicate; status=deferred with rationale "section already present on home page; user likely confused about page scope". Todo-2 (theme=terminal-y) matched the already-applied `industrial-modern` preset; status=skipped (no-op). Net patches: 0. Conversation log records both deferred reasons. This is the honest path — the pipeline does not silently duplicate sections, and it does not silently no-op without recording why.

### Prompt 9 — case-study insert
`case-study` is one of the 18 valid section types (P75 / OC-7 / ADR-100 widened the enum). SELECTION matched the `case-study` single-narrative variant from sectionLibrary. CONTENT_ATOM produced a 3-paragraph meta-honest narrative ("Hey Bradley built Hey Bradley") with metrics (122 ADRs / 96 phases / 1,162+ tests / ~28,400 LOC / 227 source files) drawn from CLAUDE.md HEADLINE_STATS. Inserted between `methodology-7step` columns (order=2) and `faq-home` questions (order=4) at order=3. The earlier `quotes` from prompt 4 todo-3 was consolidated into this richer case-study at owner discretion — recorded in conversation log as a `consolidated_into=case-meta` deferral rather than silent removal.

### Prompt 10 — listen CTA refinement
STT-clean stripped "okay last thing —" and "like". INTENT → CONTENT_ATOM with `tone=opinionated`. The button URL was inferred from the prompt phrase "the open-core repo" + the site-context (`site.project=aisp-developer-retro`, `site.author=Bradley Ross`) — CONTENT_ATOM hard-coded to `https://github.com/bar181/hey-bradley-core`. Supporting copy refreshed to "It builds itself. Honestly. MIT-licensed open core. ~28K lines of TypeScript. 122 ADRs you can argue with."

---

## §3 Pipeline-shape coverage

Per A1 §1 methodology requirement that the 10 prompts span 5 pipeline shapes:

| Shape | Prompt(s) | Coverage |
|---|---|---|
| Simple INTENT-only patches | 6 (page-2 FAQ add, before regen) | ✓ |
| Multi-clause DECOMP splits | 4 (3-clause), 8 (2-clause + dedup) | ✓ ✓ |
| Listen disfluencies (2-stage capture) | 3, 8, 10 | ✓ ✓ ✓ |
| Page-aware (pageIterator per ADR-104) | 5, 6, 7 | ✓ ✓ ✓ |
| Content-regeneration (CONTENT_ATOM per ADR-060) | 3, 4, 7, 9, 10 | ✓ ✓ ✓ ✓ ✓ |

All 5 shapes hit. Listen mode = 3/10 prompts (matches A1 §3 budget chat:7/listen:3). DECOMP = 2 prompts (one with full execution, one with dedup short-circuit — exercises both batch-execute and fallback paths per ADR-099).

---

## §4 Section type usage (page 1 + page 2)

Page 1 (home) uses 8 of the 18 valid section types: `menu`, `hero`, `numbers`, `columns`, `case-study`, `questions`, `action`, `footer`. Page 2 (methodology) uses 5: `hero`, `columns`, `questions`, `action`, `footer`. Aggregate unique types touched: 8. All values pass `sectionTypeSchema` enum check per `src/lib/schemas/section.ts` L5-L11 (verified at JSON-write time via repo-local Zod safeParse).

---

## §5 Output artifact

**File:** `src/data/examples/aisp-developer-retro.json`
**LOC:** 278 (≤500 cap)
**Validation:** `masterConfigSchema.safeParse()` — OK (zod-validate clean against `MasterConfig` shape)
**Sections:** 8 home + 5 page-2 = 13 total
**Theme contrast:** primary text/bg = 15.47:1 (PASS WCAG AA 4.5:1 minimum); secondary text/bg = 7.15:1 (PASS); accent/bg = 10.81:1 (PASS)
**Voice:** technical / opinionated / dry-humor — Don Miller authority for engineers, no condescension
**Brand markers:** `git clone the truth` CTA (prompt 10 evolution), `// receipts` numbers heading, `$ heybradley` brand prefix, "It builds itself. Honestly." closing tag

Hand-off to A4: this log + the JSON + A1 `01-scenarios.md` §3 are the three inputs A4 closer needs to verify the simulation faithfully executed the 10-prompt build script.
