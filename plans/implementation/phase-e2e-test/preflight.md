# E2E Test Sprint — Chat + Listen Mode End-to-End Validation

> **Phase:** E2E-TEST · **Date:** 2026-05-01
> **Mandate:** Validate the full chat + listen pipeline by building 2 complete sites end-to-end. Capture per-prompt log (SQLite-shape). Verify onboarding-load works. Brutal-honest score.

## Scenario

**Site 1 — Executive AISP overview**
- Audience: C-suite + non-technical decision-makers
- Theme: professional, clean, minimalist
- Content: what AISP is + benefits + how it works + ROI
- Voice: confident, evidence-backed, no jargon

**Site 2 — Developer AISP + Agentic Workflow**
- Audience: developers + engineering managers (technical but want quick read)
- Theme: retro, monospace, terminal-inspired, dark mode default
- Content: AISP essentials + 7-step methodology + Hey Bradley agentic workflow
- Voice: opinionated, dry humor, founder-authority Don-Miller style

## Constraint — no live LLM keys

This environment has no BYOK keys. Approach: an Agent (Claude Code subscription) plays the role of the LLM via the existing AgentProxy stub pattern. Each prompt → sub-agent receives exact prompt → returns realistic JSON-Patch-shaped response → applied to project config.

Timing captured per prompt (mock click-to-respond duration based on prompt complexity).

## Persistence

Sites saved as static JSON in `src/data/examples/` + wired into `EXAMPLE_SITES` so onboarding "load example" surfaces them. The full prompt-by-prompt build log saved as markdown (proxies the SQLite `log_events` table that P100 W2 will eventually persist).

## 4 agents · 3 waves

### Wave 1 — Scenario design (1 agent)

#### A1 — Scenario design + exact prompt sequences
**Owns:** `plans/implementation/phase-e2e-test/01-scenarios.md` (NEW; ≤400 LOC)

Produce for EACH of the 2 sites:
- Persona profile (1 paragraph)
- Theme + tone targets
- 8-12 prompt sequence covering both **chat mode** (text input) and **listen mode** (voice transcript-style input with disfluencies)
- Each prompt: input text + expected pipeline classification (which atom routes; INTENT verb/target; expected template match if any) + expected patches at high level

Mix the prompt types:
- 2-3 simple patches ("make the hero brighter", "add a pricing section")
- 2-3 multi-clause DECOMP prompts ("change the theme to professional and add testimonials and tighten the hero copy")
- 2-3 listen-mode realistic transcripts (with "uhh", false starts, etc. — 2-stage capture per P100/A1 audit)
- 1-2 page-aware prompts ("add a how-it-works page", "edit page 2 hero")
- 1-2 content-generation prompts ("regenerate the value props with stronger language")

Include estimated processing time per prompt (rules-based ~50ms; DECOMP ~150ms; LLM-enriched ~800-2000ms; matcher ~100ms).

### Wave 2 — Build sites (2 agents parallel)

#### A2 — Build Site 1 (Executive AISP)
**Owns:**
- `src/data/examples/aisp-executive.json` (NEW; ≤400 LOC) — final MasterConfig produced by following A1's site-1 prompt sequence
- `plans/implementation/phase-e2e-test/02-site-1-build-log.md` (NEW; ≤300 LOC) — per-prompt log entry: timestamp / request_id / prompt / classified_intent / patches_applied / latency_ms

Process:
1. Read A1's scenario doc for site-1 prompts
2. For each prompt, simulate the pipeline:
   - Classify (rules-based per intentClassifier patterns)
   - DECOMP if multi-clause (per decompAtom patterns)
   - Apply patches OR template match (mirror chatPipeline behavior)
3. Build the JSON config incrementally
4. Write log entry per prompt (markdown table format mirroring SQLite log_events shape)
5. Final state = `aisp-executive.json`; log = `02-site-1-build-log.md`

#### A3 — Build Site 2 (Developer AISP retro)
**Owns:**
- `src/data/examples/aisp-developer-retro.json` (NEW; ≤400 LOC)
- `plans/implementation/phase-e2e-test/03-site-2-build-log.md` (NEW; ≤300 LOC)

Same process as A2, scoped to site-2 prompts from A1's doc.

### Wave 3 — Wire + verify + score (1 agent)

#### A4 — Onboarding wire + tests + brutal review + closer
**Owns:**
- `src/data/examples/index.ts` (EDIT — append 2 new entries to EXAMPLE_SITES; mirror existing pattern)
- `tests/p-e2e-load-verify.spec.ts` (NEW; ≥10 cases) — verifies:
  - Both new JSONs parse against MasterConfig schema
  - EXAMPLE_SITES.length increased by 2
  - Onboarding source has the load-example handler
  - Both sites have ≥6 sections (MasterConfig minimum)
  - Theme palettes are valid hex
- `plans/implementation/phase-e2e-test/seal/04-brutal-review.md` (NEW; ≤300 LOC) — score both sites:
  - Design quality (1-10)
  - Vertical positioning clarity (1-10)
  - Copy quality (1-10)
  - ADR-091 token compliance (1-10)
  - Audience-fit (executive site → C-suite; dev site → engineers) (1-10)
  - Composite score
  - Time-to-build analysis (sum of latency from logs)
  - Honest gaps + carry-forwards
- `plans/implementation/phase-e2e-test/seal/{02-post-review.md, session-log.md, retrospective.md}`
- `CLAUDE.md` sync (test count delta only — no new ADR; this is a validation sprint)

## Hard rules

1. NO new dependencies
2. NO animation libs
3. JSON sites must validate against MasterConfig schema (`src/lib/schemas/masterConfig.ts`)
4. Both tsc strict configs clean after seal
5. Each site ≥6 sections; ≤14 sections
6. Real opinionated copy (no Lorem)
7. Existing 41 templates UNCHANGED; only EXAMPLE_SITES wire is additive
8. Logs are markdown (SQLite write deferred to P100 W2)
9. KISS — A4 closer is single agent (not 3); skip ADR for validation sprint

## Acceptance gates

- 2 NEW templates load via onboarding (EXAMPLE_SITES.length: 41 → 43)
- Build logs capture every prompt with classification + patches + latency
- ≥10 P-E2E tests GREEN
- Brutal-honest review composite ≥8.0 per site (validation; lower acceptable if honest gaps documented)
- Both tsc strict configs clean
- Cumulative session OC chain regression GREEN

## Note on time-to-create

Per CLAUDE.md velocity rule (multi-hour shifts not multi-day):
- Site 1 expected: 8-10 simulated prompts × ~600ms avg = ~5-6 sec sim time
- Site 2 expected: 8-10 simulated prompts × ~600ms avg = ~5-6 sec sim time

Real wall-clock for THIS test sprint: ~30-45 min at observed velocity.

## What this sprint does NOT do

- No new ADR (this is validation, not architecture)
- No new code paths (uses existing pipeline patterns)
- No live BYOK calls (sub-agent simulates LLM)
- No SQLite write (P100 W2 ships that; logs are markdown for now)
- No new mode features (uses existing chat + listen)
