# ADR-156: Spec-Update Pipeline — LLM-driven 7-document spec bundle from MasterConfig

**Status:** Accepted
**Date:** 2026-05-16
**Phase:** P127 / Spec Update Pipeline
**Supersedes:** none (extends ADR-072 spec generation; ADR-072 generators are pure-deterministic; this ADR adds an LLM-enhanced path on top)

## Context

Every site built in Hey Bradley produces a `MasterConfig`. From that one source-of-truth, the platform should produce a hand-off-ready spec bundle that any downstream coding agent can implement.

Today's `src/lib/specGenerators/` ships pure-deterministic generators (config → string). They produce structurally correct but flavor-light output — no narrative voice for the North Star, no AISP-formal symbolic content, no design-token JSON tuned for the actual palette. The owner directive (P127) is to add an LLM-enhanced pipeline that produces richer, validated specs while keeping cost and latency bounded.

## Decision

A 7-spec pipeline runs in priority order, each step driven by a dedicated prompt template, gated by structural validation, and chunked when content exceeds the LLM's effective window.

### Spec order (priority)

1. **AISP** (two-step: format → quality)
2. **North Star** (uses AISP Ω block + brand strings)
3. **Features**
4. **Architecture (SADD)** (uses AISP Γ block)
5. **CSS / Design tokens** (JSON-shaped — palette + typography + spacing)
6. **Build Plan** (uses Features list)
7. **Human Spec** (compressed-narrative summary of all prior outputs)

AISP runs first because every downstream spec can pull from its formal Ω (objective) and Γ (constraints/structure) blocks, eliminating drift between specs.

### Two-step AISP

AISP is a formal symbolic protocol with `Ambig(D) < 0.02`. A naive single-call often produces prose-heavy output that fails the math-first rule. We split into:

- **Step 1 — format:** the LLM emits content in AISP shape, including ⟦Ω⟧⟦Σ⟧⟦Γ⟧⟦Λ⟧⟦Ε⟧ blocks.
- **Step 2 — quality:** a second LLM call (same model) sees the Step-1 output + the AISP guide excerpt, rewrites any prose-bloated sections into the Σ_512 symbol set, and confirms all 5 required blocks are present.

### CSS vs content separation

Design tokens (palette, typography, spacing) live in a discrete `css.md` JSON code block. The North Star spec is narrative content (elevator pitch, audience, win condition). Conflating them in one prompt produces lukewarm output for both — distinct prompts produce sharp output for each.

### Chunking strategy

- Default: one call per spec.
- AISP step 1: if the structural summary exceeds 2KB AND the response is expected to exceed 4KB, chunk by AISP block group (⟦Ω⟧⟦Σ⟧ in one call, ⟦Γ⟧⟦Λ⟧⟦Ε⟧ in a second). AISP step 2 then sees both.
- North Star: chunk by section (elevator → audience → win condition) only if the LLM's structural summary input exceeds 4KB.

### Deterministic preprocessing

The MasterConfig is parsed by a small set of deterministic functions before any LLM call. The parsers extract:
- Brand strings (site.title, brandName, tagline, author)
- Theme palette hex + typography names
- Section types + counts + IDs
- Component-level signal (counts by type; no raw text body unless ≤200 chars)

This compressed structural summary (capped at 4KB) is what each prompt template injects. Raw long-form content (blog post bodies, marketing copy paragraphs) is never sent to the LLM — the LLM works from the structural shape, not the prose.

### Template-driven prompts

Every spec has a JSON template at `plans/hitl/phase-127-spec-update/templates/<spec>.json`:

```json
{
  "specType": "<id>",
  "priority": <int>,
  "systemPrompt": "<role + format rules + allowed sections>",
  "userPromptTpl": "<template with {{structuralSummary}} and {{aispRefs}} placeholders>",
  "exampleOutput": "<one mini few-shot>",
  "validation": {
    "mustContain": ["<regex 1>", "<regex 2>"],
    "mustNotContain": ["<regex 1>"],
    "maxWords": <int|null>,
    "minSections": <int|null>
  },
  "allowedSections": ["<key 1>", "<key 2>"]
}
```

The script reads the template at runtime, builds the prompt, calls the LLM, validates the response. If validation fails, the script retries once with a corrective addendum ("Your previous response was missing X — fix and resend"). Two failures = mark spec STALE and continue; the UI badge stays yellow.

### Output layout per site

```
plans/hitl/phase-127-spec-update/runs/<site>/
├── index.md            ← per-site report: 7 specs, status, costs, timing
├── specs/
│   ├── aisp.md
│   ├── north-star.md
│   ├── features.md
│   ├── architecture.md
│   ├── css.md
│   ├── build-plan.md
│   └── human-spec.md
├── chat-history.jsonl  ← every LLM call with wall-clock timestamp
├── timing.json         ← per-spec ms
├── cost.json           ← per-spec USD
└── validation.json     ← per-spec PASS/FAIL + reasons
```

### Cost / budget

Estimated spend per full 3-site run:
- 7 specs × 3 sites = 21 base calls
- AISP step 2 × 3 sites = 3 quality recheck calls
- Optional validation retries: ≤6
- Total: ≤30 calls × ~$0.005 each = ~$0.15

Owner-locked $10 phase budget. Headroom: 65× expected spend.

### Validation gates (hard fail per spec)

| Spec | Must contain | Hard fail if missing |
|---|---|---|
| AISP | `⟦Ω`, `⟦Σ`, `⟦Γ`, `⟦Λ`, `⟦Ε` blocks | any block absent |
| North Star | "elevator pitch:" + "audience:" + "win condition:"; ≤30 lines | any header missing or >30 lines |
| Features | 5–15 numbered items with name + description + priority | <5 items or no priority |
| Architecture | "bounded contexts" + "data flow" sections; ≥3 contexts | either section missing |
| CSS | JSON code block with `palette` + `typography` + `spacing` | non-JSON or missing key |
| Build Plan | markdown table with ≥3 phases (phase / scope / DoD) | <3 rows |
| Human Spec | ≤300 words prose, no `⟦⟧` symbols | over 300 words or contains AISP symbols |

## Consequences

### Positive

- One MasterConfig produces a coherent 7-document bundle aligned by the AISP-first ordering.
- Each spec is independently validated → UI can confidently flip the badge from yellow→green only after PASS.
- Templates are owner-editable JSON files; no script edit required to tune voice.
- Deterministic preprocessing keeps token cost predictable.
- Two-step AISP forces the LLM into the symbolic Σ_512 set instead of drifting toward prose.

### Negative

- Adds a script layer parallel to the existing pure-deterministic generators. The two paths must stay in sync (this ADR documents the split; ADR-072 generators remain the offline-safe fallback).
- LLM cost is non-zero (~$0.05/site for a full bundle). Not free anymore.
- Validation retries can slow a single spec; capped at 1 retry per spec.

### Neutral

- The Agentics UI card (next phase) consumes `validation.json` + `timing.json` to render green/yellow badges + progress bar. The pipeline is UI-agnostic; it ships independently.

## Alternatives considered

- **Single big LLM call** — generates all 7 specs in one shot. Rejected: outputs blur together, AISP gets prose-bloated, validation can only mark whole-bundle pass/fail (no per-spec badge).
- **No LLM, deterministic-only** — already what ADR-072 ships. Rejected as a P127 update because the owner directive explicitly asks for richer, brief-aware specs (AISP-formal, narrative North Star, copy-matched CSS).
- **Streaming partial outputs** — would let the UI show incremental progress within a single spec. Deferred — current per-spec granularity (7 progress steps) is already plenty for the badge UI.

## References

- AISP guide: `plans/initial-plans/00.aisp-reference.md` + [bar181/aisp-open-core](https://github.com/bar181/aisp-open-core)
- Pure-deterministic generators: `src/lib/specGenerators/` (ADR-072)
- P127 preflight: `plans/hitl/phase-127-spec-update/preflight.md`
- Owner directive (this session): "use adr, create any templates for prompts or examples as required, plan, implement, verify, optimize, then finally run the spec update process for the 3 examples already available from the phase 126 examples"

---

## Mini-ADR addenda — P128 template quality lift (2026-05-16)

Owner gate (P128 Step 3): all 6 non-AISP templates must score ≥80/100 on brutal-honest reviewer rubric before UI work proceeds. Audience: capable developer or AI agent (not junior). 3 iteration loops authorized.

**Result:** All 6 templates cleared ≥80 (composite 84.7/100, up from 53.8/100 baseline) across 1 full loop + 2 targeted loops on Human Spec.

### Addendum 1 — `north-star.json` (51.7 → 84.0, +32.3)

- Required 4 sections (Elevator pitch / Audience / Win condition / Differentiator).
- Audience must be a named persona archetype (role + stage + trigger); reject "general users", "businesses", "creators".
- Win condition must contain a measurable verb tied to a CTA from the structural summary.
- Differentiator must name a real competitor (Squarespace, Medium, Linktree, etc.).

### Addendum 2 — `features.json` (58.0 → 84.0, +26.0)

- Required per-feature `Section: #<id>` + `Depends: <#id,#id|none>`.
- Force-rank cap: max 4 P0s; P0 may only depend on P0.
- Reject layout-as-feature padding ("Compelling Hero Section").
- Mermaid `flowchart LR` dependency graph at end (quality > quantity).

### Addendum 3 — `architecture.json` (38.0 → 82.0, +44.0 — biggest single-template lift)

- Site-class branching as first line: `## Site class: static-brochure | content-driven | interactive-app`.
- DDD bounded-contexts block RESERVED for `interactive-app` only (kills cargo-cult on static sites).
- Required sections: Stack (with pinned versions) / Routing / Hosting / Integrations (named services + fallbacks) / Runtime states / Quality budgets / SEO & social / Data flow.
- Mermaid `flowchart LR` data-flow diagram required.

### Addendum 4 — `css.json` (69.0 → 88.0, +19.0 — highest absolute score)

- Both `palette.light` and `palette.dark` variants always (6 keys each).
- 2026 responsive breakpoints: `sm:480 / md:768 / lg:1024 / xl:1280 / 2xl:1536`.
- `motion.default` + `motion.reduced` for WCAG 2.3.3 compliance.
- All hex must include `#` prefix + 6 chars; `_warnings` array for mode/luminance contradictions.

### Addendum 5 — `build-plan.json` (40.3 → 84.7, +44.4 — tied biggest lift)

- Required columns: `Phase | Scope | Depends on | Effort | DoD`.
- Effort budget formula: 0.25–0.5 day per static section + 0.5/integration + 1 a11y/Lighthouse + 0.5 deploy.
- DoD must include a measurable threshold (Lighthouse score / HTTP 2xx / contrast / breakpoint check / bundle KB / LCP ms). Banned tautologies.
- Phase 1 names the stack, hosting, and third-party services.
- Mermaid `gantt` chart visualizing phases and dependencies.
- `Total effort: N–M day(s)` line required.

### Addendum 6 — `human-spec.json` (66.0 → 85.7, +19.7) — required 3 loops

- **Loop 1** (66.0 → 75.3): Banned vocabulary list; competitor must be a real brand; if `site.tagline` empty say so.
- **Loop 2** (75.3 → 76.7): Competitor allowlist (Squarespace, Webflow, Framer, Medium, Substack, Toptal, etc.); reject vague placeholders.
- **Loop 3** (76.7 → 85.7): **Programmatic CTA extraction.** Pipeline pulls hero `primaryCta.props.text` and injects as `{{exactCta}}` template variable; template requires literal double-quoted match in paragraph 3. Theme-mode mismatch also pre-computed (only fires on genuine `theme.mode` vs palette luminance contradiction; no more tautological "declared dark, observed dark" noise).

### Engine changes (`scripts/p127-spec-updater.mjs`)

- Added `exactCta` extraction: walks sections to find the hero CTA (or first button/CTA component); injects as template variable for the human-spec stage.
- Added `themeModeNote` pre-computation: compares `theme.mode` to `bgPrimary` luminance (`r*0.299 + g*0.587 + b*0.114`); emits a `Note:` line only on contradiction.
- These two are the only spec-specific extras the engine computes; everything else remains template-driven.
