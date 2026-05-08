# E2E-TEST-2 Sprint — Multi-Scenario Pipeline Validation + DB Logs + Trigger-Word Taxonomy

> **Phase:** E2E-TEST-2 · **Date:** 2026-05-03
> **Predecessor:** P102 + P103 SEALED at `a65126d` (v2.0.0-RC1 RELEASE READY · 133 ADRs · ~1320+ tests)
> **Mandate:** Build 3 NEW scenario sites end-to-end via simulated AgentProxy. Persist per-prompt logs to SQLite `log_events` (NOT just markdown — first sprint to land DB writes from a build sequence). Wire into EXAMPLE_SITES so user can click through onboarding. Document the chat/listen trigger-word taxonomy.

## Why this sprint

User feedback (post-RC sealed): "we will continue with testing using a variety of sites and user commands — from user importing long blogs that need to be summarized, to an agency uploading brand details in a chat, to a conversation in listen mode. for listen and chat mode there should be trigger words to help the llm config (eg hero and article)."

This sprint validates the pipeline against three scenarios the prior E2E-TEST sprint did NOT cover and codifies the trigger-word vocabulary that's been growing implicitly across templates.

## Scenarios

**Site 1 — Long-form blog import**
- User pastes a 2000-word essay into chat ("here's my post about specialty coffee, build me a site for it")
- Pipeline detects long-form input, extracts structure (intro / 4 sections / conclusion), generates hero + article + pull-quote sections
- Trigger words exercised: `article`, `hero`, `pull-quote`, `summarize`, `read-time`
- Output: `src/data/examples/coffee-essay.json`

**Site 2 — Agency brand upload (multi-turn chat)**
- User pastes brand name + 6 colors + 3 voice samples + 4 copy snippets across 7-9 prompts
- Pipeline accumulates brand context, swaps theme palette, applies voice to generated copy
- Trigger words exercised: `brand`, `voice`, `palette`, `tone`, `set-color`, `agency`, `clients`
- Output: `src/data/examples/north-light-agency.json`

**Site 3 — Listen-mode conversation**
- Voice transcript with disfluencies (uh / you know / like) + 8-10 spoken commands
- Pipeline cleans transcript (`cleanTranscript` per ADR-127), extracts trigger words, applies patches
- Trigger words exercised: `hero`, `article`, `pricing`, `team`, `cta`, `make it`, `add a`, `change to`
- Output: `src/data/examples/indie-coffee-roaster.json`

## Persistence (NEW vs prior E2E-TEST sprint)

Prior E2E-TEST sprint logged build steps as markdown only. THIS sprint also persists to SQLite via `comprehensiveLogs.writeLogEvent` (per ADR-126):
- Each prompt → `event_type: 'intent_classification'` row with full `event_data`
- Each patch → `event_type: 'patch_applied'` row
- Each template match → `event_type: 'template_match'` row
- BYOK redaction at every write boundary per ADR-043

**Seed script** (closer owns): `scripts/seed-e2e2-logevents.ts` reads pre-canned fixtures and writes via `writeLogEvent`. User can then open the EXPERT → ConversationLog tab and drill down per-request_id (per ADR-126 + P98/P99 fix-pass).

## Trigger-word taxonomy (closer documents)

Codify the chat + listen trigger-word vocabulary used across templates and existing pipelines into a single doc consumers can reference. Patterns observed:
- **Section types** (18 per ADR-100): `hero`, `article`, `pricing`, `team`, `cta`, `testimonials`, `gallery`, `features`, `value-props`, `faq`, `blog`, `footer`, `header`, `case-study`, `contact-form`, `menu`, `image`, `text`
- **Verb keywords** (DECOMP_ATOM Σ R3 / `decompAtom.ts`): `make it`, `add a`, `add`, `change`, `replace`, `remove`, `forget`, `need`, `create`
- **Tone/style triggers** (per CONTENT_ATOM): `bright`, `bold`, `casual`, `formal`, `playful`, `professional`
- **Brand triggers** (NEW this sprint): `brand`, `voice`, `palette`, `set-color`, `tone-of-voice`

## 4 agents · 2 waves

### Wave 1 — Build sites (3 parallel agents · disjoint scope)

#### C1 — Long-form blog import scenario
**Owns:**
- `src/data/examples/coffee-essay.json` (NEW; ≤400 LOC; ≥6 sections; opinionated copy from 2000-word source)
- `plans/implementation/phase-e2e-test-2/01-site-1-build-log.md` (NEW; ≤300 LOC; per-prompt table with timestamp / request_id / prompt / classified_intent / patches_applied / latency_ms)
- `tests/fixtures/e2e2-coffee-essay-logevents.json` (NEW; pre-canned `log_event` rows)

#### C2 — Agency brand upload scenario
**Owns:**
- `src/data/examples/north-light-agency.json` (NEW; ≤400 LOC)
- `plans/implementation/phase-e2e-test-2/02-site-2-build-log.md` (NEW; ≤300 LOC)
- `tests/fixtures/e2e2-north-light-agency-logevents.json` (NEW)

#### C3 — Listen-mode conversation scenario
**Owns:**
- `src/data/examples/indie-coffee-roaster.json` (NEW; ≤400 LOC)
- `plans/implementation/phase-e2e-test-2/03-site-3-build-log.md` (NEW; ≤300 LOC)
- `tests/fixtures/e2e2-indie-coffee-roaster-logevents.json` (NEW)

### Wave 2 — Wire + verify + document (1 closer)

#### C4 — Closer
**Owns:**
- `src/data/examples/index.ts` (EDIT — append 3 entries to EXAMPLE_SITES; mirror existing pattern)
- `tests/p-e2e-2-load-verify.spec.ts` (NEW; ≥15 cases) — verifies:
  - All 3 NEW JSONs parse against MasterConfig schema
  - EXAMPLE_SITES.length increased by 3 (43 → 46)
  - All 3 sites have ≥6 sections + ≤14 sections
  - Theme palettes are valid hex
  - Each site has ≥1 article OR hero section
  - Trigger-word doc exists at `docs/aisp-adoption/03-trigger-word-taxonomy.md`
  - Seed script exists + has executable shape
  - Build logs reference real prompts + classified intents
  - Log fixtures parse as valid `LogEventInsert[]`
- `scripts/seed-e2e2-logevents.ts` (NEW; ≤120 LOC) — reads 3 fixtures → calls `writeLogEvent` per row → SQLite persistence
- `docs/aisp-adoption/03-trigger-word-taxonomy.md` (NEW; ≤200 LOC) — section-type triggers + verb triggers + tone triggers + brand triggers
- `plans/implementation/phase-e2e-test-2/seal/{02-post-review.md, session-log.md, retrospective.md}` (NEW; ≤120 LOC each)
- `CLAUDE.md` sync (test count delta + EXAMPLE_SITES count 43 → 46; no new ADR)

## Hard rules

1. NO new dependencies
2. NO animation libs
3. JSON sites MUST validate against MasterConfig schema (`src/lib/schemas/masterConfig.ts`)
4. Both tsc strict configs clean after seal
5. Each site ≥6 sections; ≤14 sections
6. Real opinionated copy (no Lorem)
7. Existing 43 templates UNCHANGED; only EXAMPLE_SITES wire is additive
8. Logs are markdown AND SQLite (per ADR-126)
9. BYOK redaction in seed script (no `sk-`/`AIza` shapes in fixtures)
10. KISS — no new ADR (this is validation; ADR-126 covers persistence pattern)

## Acceptance gates

- 3 NEW templates load via onboarding (EXAMPLE_SITES.length: 43 → 46)
- Build logs capture every prompt with classification + patches + latency
- Per-prompt rows persisted to SQLite via seed script (≥30 fixtures across 3 sites)
- Trigger-word taxonomy doc covers ≥18 section triggers + ≥9 verb triggers + ≥6 tone triggers + ≥5 brand triggers
- ≥15 P-E2E-2 tests GREEN
- Both tsc strict configs clean
- Cumulative session OC chain regression GREEN

## What this sprint does NOT do

- No new ADR (this is validation, not architecture)
- No new code paths (uses existing pipeline + log infrastructure)
- No live BYOK calls (sub-agent simulates LLM)
- No new mode features
- No live STT (CF#5 owner-required; transcripts are pre-canned)
