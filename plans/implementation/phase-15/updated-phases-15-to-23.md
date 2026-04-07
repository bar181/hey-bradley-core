
Review the following any only implement as per providing additinal support to the existing flywheel: 

Great question. You've already built the protocol (ADRs 038-043). Now let's look at the friction points that still cost you time and what to do about them.

## Where Your Time Goes Today

```
1. Review agent output in Claude chat        ~30% of your time
2. Write/refine instructions for the swarm   ~25%
3. Take screenshots, identify issues         ~20%
4. Copy-paste between Claude chat and CC     ~10%
5. Remind agents of process they should know ~10%
6. Strategic decisions (pricing, positioning) ~5%
```

The ADRs eliminate #5. Here's how to attack the rest:

## 7 Concrete Improvements

### 1. Create a `SWARM.md` Command File

Instead of writing instructions every session, maintain a single living file the swarm reads first:

```markdown
# SWARM.md — Standing Orders

## Always
- Follow ADR-038 through ADR-043
- Read CLAUDE.md before any code
- Tests are monotonically non-decreasing (ADR-043)
- AISP output must validate at Platinum (5/5)
- No @aisp format anywhere — Crystal Atoms only

## Never
- Skip end-of-phase artifacts
- Push with failing tests
- Add features not in the phase scope
- Estimate > 4 hours for any single task
- Output structured prose as AISP

## Current Phase
Phase: 15
Instruction file: plans/implementation/phase-15/instruction.md
```

You update 3 lines between sessions. The swarm reads it and knows what to do. Your instruction writing drops from 25% to 5%.

### 2. Screenshot → Issue Pipeline

You spend 20% of your time taking screenshots and describing problems. Streamline:

Create a template file `plans/issues/TEMPLATE.md`:
```markdown
## Issue: [title]
Screenshot: [filename]
Location: [page/panel/component]
Expected: [what should happen]
Actual: [what happens]
Priority: P0/P1/P2
```

When you spot something, fill in 5 lines instead of writing 3 paragraphs. The swarm converts these to checklist items automatically per ADR-040.

### 3. Pre-Built Review Checklists

Instead of reviewing agent output by reading code, give the swarm a self-review checklist they execute BEFORE showing you results:

```markdown
# Self-Review Checklist (run before reporting to human)

□ Does the build pass? (npx tsc --noEmit && npx vite build)
□ Do all tests pass? (npx playwright test)
□ Is the test count ≥ previous phase?
□ Load every example — do they all render?
□ Click every button touched in this sprint — do they work?
□ Check SIMPLE mode — any developer jargon visible?
□ Check EXPERT mode — all controls functional?
□ If AISP was changed — run aisp_validate and aisp_tier
□ Screenshot the 3 most impacted views
□ List every file changed with line count
```

This catches 80% of the issues you currently find manually. Your review drops from "check everything" to "check the 20% the swarm couldn't verify."

### 4. Phase Templates

Every phase follows the same structure. Create a generator script:

```bash
# plans/create-phase.sh
#!/bin/bash
PHASE=$1
TITLE=$2
mkdir -p plans/implementation/phase-$PHASE
cat > plans/implementation/phase-$PHASE/README.md << EOF
# Phase $PHASE: $TITLE
**Status:** NOT STARTED
**Prerequisite:** Phase $((PHASE-1)) CLOSED
**Target score:** 80+/100

## Grounding Report
[Auto-generated from CLAUDE.md — see ADR-042]

## Sprint Breakdown
### Sprint 1: [P0 items]
### Sprint 2: [P1 items]
### Sprint 3: Quality pass + close

## ADRs Required
## Testing Plan
## Exit Criteria
EOF

touch plans/implementation/phase-$PHASE/living-checklist.md
touch plans/implementation/phase-$PHASE/session-log.md
echo "Phase $PHASE created: $TITLE"
```

You run `./create-phase.sh 15 "Developer Assistance"` and the skeleton exists. No more creating files from scratch.

### 5. Conversation Continuity Between Claude Chat and Claude Code

Your biggest friction is the context gap between this conversation (strategic decisions, reviews, instructions) and Claude Code (execution). Two improvements:

**A. Session Journal:** After every Claude chat session, I create a structured summary that gets appended to a journal file. The swarm reads this to understand the strategic context:

```markdown
# plans/journal.md

## 2026-04-06 Session
- Reviewed Phase 14 screenshots
- 17 issues identified (see phase14-fix-checklist.md)
- Pricing model finalized: $20/$50/$499, no free hosted, BYOK
- AISP must be Crystal Atoms not @aisp format
- L8 orchestration ADRs created (038-043)
- Open source strategy: expand everything, cut at LLM/DB boundary
```

**B. Decision Log:** Every strategic decision gets a one-liner in `plans/decisions.md`:

```markdown
# Strategic Decisions

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-06 | No free hosted tier | Open source is free. Hosted starts at $20. |
| 2026-04-06 | BYOK for LLM tokens | We don't pay for user tokens |
| 2026-04-06 | Chat/Listen stay in OSS as canned demos | The moat is the intent agents, not the UI |
| 2026-04-06 | Deploy is not a feature | Vercel's job, not ours |
```

The swarm reads this before making any product decision. No more re-explaining "we don't compete with Lovable."

### 6. Batch Your Reviews

Instead of reviewing continuously, adopt a sprint cadence:

```
Morning:   Write instruction.md (10 min) → Swarm executes (2-4 hours)
Midday:    Review results (15 min) → Write corrections.md → Swarm fixes
Evening:   Final review (10 min) → Phase close or carry to tomorrow
```

You touch the project 3 times per day, 35 minutes total of active work. The swarm does 6-8 hours of execution. This is the L7→L8 leverage ratio.

### 7. AISP-Driven Phase Definitions

This is the advanced move. Instead of writing phase READMEs in prose, write them as AISP Crystal Atoms:

```aisp
⟦
  Ω := { complete(Phase15) | tooltips ∧ errorStates ∧ shortcuts ∧ tests ≥ 110 }
  Σ := { Tooltip : 𝕋 := { control: 𝕊, text: 𝕊, placement: Placement },
         ErrorState : 𝕋 := { component: 𝕊, condition: 𝕊, message: 𝕊 },
         Shortcut : 𝕋 := { key: 𝕊, action: 𝕊 } }
  Γ := { R1: ∀ control ∈ builder : hasTooltip(control),
         R2: ∀ emptyState : showsHelpfulMessage(emptyState),
         R3: tests.count ≥ 110,
         R4: persona.agenticEngineer ≥ 80 }
  Λ := { controls := [...], shortcuts := ["Ctrl+S:save", "Ctrl+Z:undo"],
         emptyStates := ["noSections", "noImage", "invalidJSON"] }
  Ε := { V1: VERIFY ∀ c : hover(c) → tooltip.visible,
         V2: VERIFY shortcut("Ctrl+S") → save(),
         V3: VERIFY tests.count ≥ 110 }
⟧
```

The swarm parses this directly. No ambiguity. The Ε block IS the exit criteria. The Γ rules ARE the quality gates. This is AISP being used to orchestrate AISP — the meta-level that makes Hey Bradley's own development methodology its best demo.

## Priority Order for Implementing These

```
TODAY (10 min):     Create SWARM.md with standing orders
THIS WEEK (1 hour): Add journal.md + decisions.md to plans/
NEXT PHASE:         Add self-review checklist to ADR-038
PHASE 16+:          Phase templates script
PHASE 20+:          AISP-driven phase definitions
```

The biggest immediate win is SWARM.md — one file that replaces your repetitive reminders. The biggest long-term win is AISP-driven phase definitions — specs all the way down.


---


# Hey Bradley — Phase Roadmap (15 → 23+)

**Current state:** Phase 14 CLOSED (74/100) | 90 tests | 106K+ lines | 500+ files
**Next major checkpoint:** Phase 22 — everything possible without an LLM call or database
**Capstone defense:** May 2026

---

## THE THREE STAGES

```
┌─────────────────────────────────────────────────────────────────────┐
│  STAGE A: REVIEW + POLISH (Phases 15-19)                           │
│  Goal: Every feature works, every button responds, every spec      │
│  is accurate. The product is audited section by section.           │
│  No new features. Only fix, polish, and prove.                     │
├─────────────────────────────────────────────────────────────────────┤
│  STAGE B: PRE-LLM SIMULATION (Phases 20-22)                       │
│  Goal: Build the entire LLM pipeline with simulated responses.     │
│  When Phase 23 connects the real API, the only change is           │
│  swapping canned data for live calls.                              │
├─────────────────────────────────────────────────────────────────────┤
│  ══════════════ PRE-LLM CHECKPOINT (Phase 22 exit) ═══════════════ │
│  Open-source release candidate. Everything works without LLM/DB.   │
├─────────────────────────────────────────────────────────────────────┤
│  STAGE C: LLM INTEGRATION (Phase 23+)                              │
│  Goal: Real AI. Real STT. Real database. Commercial features.      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## STAGE A: REVIEW + POLISH

### Phase 15: Developer Assistance
**Focus:** Builder UX for developers and power users
**Estimated effort:** 8-10 hours
**ADRs:** None (review phase)

| Sprint | Deliverables |
|--------|-------------|
| 1 | **Test regression fix** — investigate 102→90 drop, restore to 102+, add 10 new tests (target 112+) |
| 2 | **Tooltips** — every button, toggle, slider, and control in the builder gets a tooltip. SIMPLE mode tooltips explain in plain English. EXPERT mode tooltips include technical details. |
| 3 | **Error states** — empty section list, missing images, invalid JSON input, broken URLs all show helpful messages with recovery actions instead of blank screens or console errors |
| 4 | **Keyboard shortcuts** — Ctrl+S (save), Ctrl+Z (undo), Ctrl+Shift+Z (redo), Ctrl+P (preview toggle), Ctrl+E (SIMPLE/EXPERT toggle), Ctrl+/ (shortcut help overlay) |
| 5 | **Developer docs update** — /docs page gets current section reference (16 types with variants), theme reference (12 themes with previews), JSON structure guide, keyboard shortcut reference |
| 6 | **Quality pass + close** — code quality sweep (any `as any` creep, unused imports, console.logs), 112+ tests, persona review, full close protocol per ADR-038 |

**Exit criteria:** Every control has a tooltip. Every error state has a message. Keyboard shortcuts work. /docs is current. 112+ tests. Agentic Engineer persona 82+.

---

### Phase 16: Advanced Features Review
**Focus:** Deep audit of the complex features — effects, site context, specs, Resources tab
**Estimated effort:** 8-10 hours
**ADRs:** None (review phase)

| Sprint | Deliverables |
|--------|-------------|
| 1 | **Image effects audit** — load every section with every effect (13 effects × applicable sections). Verify: Ken Burns animates, parallax scrolls, lightbox opens/closes, gradient renders. Fix any that don't work. Screenshot evidence for each. |
| 2 | **Site context audit** — change purpose/audience/tone for 5 different examples. Verify: specs update to reflect context, content recommendations change, theme suggestions adapt. The site context must VISIBLY affect the output. |
| 3 | **Spec generators audit** — generate all 7 specs (North Star, Architecture, Build Plan, Features, Human Spec, AISP, JSON) for 5 different examples. Verify: no placeholder text, correct section counts, accurate color values, proper AISP Crystal Atoms. Copy a Build Plan into Claude → test reproduction accuracy. |
| 4 | **Resources tab audit** — verify Templates sub-tab lists all JSON templates, AISP Guide explains conversion with working link to repo, Media Library shows 300+ images with filtering, Wiki placeholder is present. |
| 5 | **Quality pass + close** — 115+ tests, persona review, full close protocol |

**Exit criteria:** Every effect renders correctly. Site context visibly affects specs. Build Plan reproduces at 88%+ when pasted into Claude. Resources tab is complete and accurate. 115+ tests.

---

### Phase 17: Feature Review ADR + Pilot
**Focus:** Create the formal review methodology, then pilot it on ONE section type end-to-end
**Estimated effort:** 6-8 hours
**ADRs:** ADR-044 (Feature Review Checklist Methodology)

| Sprint | Deliverables |
|--------|-------------|
| 1 | **Create ADR-044: Feature Review Checklist** — a formal checklist template that can be applied to ANY section type. Covers: rendering (all variants × all themes), editor (SIMPLE controls, EXPERT controls, all toggles work), spec generation (section appears correctly in all 7 specs), image effects (applicable effects render), site context (context values reflected in section copy/style), accessibility (contrast, alt text, keyboard nav), responsive (375px, 768px, 1280px). |
| 2 | **Pilot: Hero section** — execute ADR-044 checklist against the Hero section completely. All 8 variants × 12 themes = 96 combinations. All SIMPLE + EXPERT controls. All applicable effects. Spec accuracy. A11y. Responsive. Document every issue in `phase-17/hero-review.md`. |
| 3 | **Fix all Hero issues found** — the pilot proves the checklist works. Fix every issue. The Hero should score 95/100 after fixes. |
| 4 | **Refine the checklist** — based on what the pilot revealed, update ADR-044. Add any checks that were missing. Remove any that were redundant. The refined checklist is what Phase 18 uses for ALL sections. |
| 5 | **Quality pass + close** — 118+ tests, full close protocol |

**Exit criteria:** ADR-044 checklist exists and is validated by the Hero pilot. Hero section scores 95/100. Checklist refined based on pilot findings. 118+ tests.

---

### Phase 18: Comprehensive Feature Sweep
**Focus:** Execute the ADR-044 checklist against EVERY section type, tab, simulation, and theme
**Estimated effort:** 12-16 hours (largest review phase)
**ADRs:** None (execution of ADR-044)

| Sprint | Deliverables |
|--------|-------------|
| 1 | **Sections 1-4:** Navigation Bar, Columns, Pricing, Action — full ADR-044 checklist per section. Document issues. Fix P0/P1s immediately. |
| 2 | **Sections 5-8:** Quotes, Questions, Numbers, Gallery — same process |
| 3 | **Sections 9-12:** Logos, Team, Image, Divider — same process |
| 4 | **Sections 13-16:** Text, Blog, Footer, Menu variants — same process |
| 5 | **Cross-cutting audit:** Chat mode (all 15+ commands), Listen mode (all 4 demos), onboarding flow, multi-page, ZIP export, preview mode |
| 6 | **Fix all remaining P1/P2 issues** from sprints 1-5 |
| 7 | **Quality pass + close** — 125+ tests (add 1-2 tests per section reviewed), full close protocol |

**Exit criteria:** Every section type reviewed against ADR-044. Every P0 and P1 fixed. Issues documented per section in `phase-18/section-reviews/`. 125+ tests. Composite score 85+.

---

### Phase 19: System-Wide Review
**Focus:** Identify ALL remaining requirements before LLM integration. The "is this done?" audit.
**Estimated effort:** 8-10 hours
**ADRs:** ADR-045 (Pre-LLM Requirements Document)

| Sprint | Deliverables |
|--------|-------------|
| 1 | **Full product walkthrough** — a fresh-eyes agent (no prior context) walks through the entire product from landing page to spec export. Documents every confusion point, broken flow, unclear label, and missing feature. |
| 2 | **Deferred features reconciliation** — review `plans/deferred-features.md` (34 items from Phase 14). For each: is it still needed? Was it done in a later phase? Should it be in the pre-LLM release? Should it wait for post-LLM? Create final disposition for every item. |
| 3 | **Marketing site completeness** — is hey-bradley.com ready for public launch? Story page, AISP page, open core page, about, docs, how I built this. All content current. All links work. All CTAs point to the right places. |
| 4 | **ADR-045: Pre-LLM Requirements** — comprehensive document listing everything the product needs before LLM integration. Organized as: DONE (verified), READY (built but needs LLM), MISSING (must build in Phases 20-22), DEFERRED (post-LLM). |
| 5 | **Open-source release prep** — README.md final pass, CONTRIBUTING.md, LICENSE verification, .env.example for BYOK setup, Docker compose if applicable. The repo should be cloneable and runnable by a stranger. |
| 6 | **Quality pass + close** — 130+ tests, final persona review before LLM stages. Target: Agentic Engineer 85+, Grandma 60+, Capstone 88+. |

**Exit criteria:** ADR-045 documents every pre-LLM requirement. Deferred features all have final disposition. Marketing site is launch-ready. Open-source repo is stranger-cloneable. 130+ tests. This IS the open-source release candidate.

---

## STAGE B: PRE-LLM SIMULATION

### Phase 20: LLM Prompt Templates
**Focus:** Design every prompt the system will send to the LLM — without calling an LLM
**Estimated effort:** 8-10 hours
**ADRs:** ADR-046 (Prompt Architecture), ADR-047 (Response Schema)

| Sprint | Deliverables |
|--------|-------------|
| 1 | **Prompt inventory** — list every user action that will trigger an LLM call. Chat commands (natural language → JSON patch). Listen mode (STT transcript → JSON patch). Content generation (generate copy for a section). Image selection (recommend images from library). Spec enhancement (improve spec quality with AI). |
| 2 | **System prompt design** — the master system prompt that all LLM calls share. Includes: project JSON context, AISP Crystal Atom format, available section types, available themes, JSON patch format, response constraints. |
| 3 | **Per-action prompt templates** — for each action from Sprint 1, create the exact prompt template with variables: `{{current_json}}`, `{{user_input}}`, `{{site_context}}`, `{{available_sections}}`. Store in `src/lib/prompts/`. |
| 4 | **Response schema** — define the exact JSON structure the LLM must return for each action type. The LLM returns JSON patches, NOT code, NOT HTML, NOT prose. Schema validation via Zod. ADR-047 documents every response type. |
| 5 | **Simulated responses** — for each prompt template, create 3-5 canned responses that match the response schema. Store in `src/data/simulated-responses/`. These power the pre-LLM demo. |
| 6 | **Quality pass + close** — 135+ tests (test prompt template generation, response schema validation), full close protocol |

**Exit criteria:** Every LLM-triggering action has a prompt template and response schema. 15+ simulated responses cover the most common actions. System prompt is complete. All response schemas validate via Zod. 135+ tests.

---

### Phase 21: Response Validation Pipeline
**Focus:** Confirm that LLM responses (simulated) parse correctly and produce valid JSON patches
**Estimated effort:** 6-8 hours
**ADRs:** ADR-048 (Response Validation Pipeline)

| Sprint | Deliverables |
|--------|-------------|
| 1 | **Response parser** — `src/lib/llm/responseParser.ts` — takes raw LLM output, validates against Zod schema, extracts JSON patch. Handles: valid response, malformed JSON, missing fields, extra fields, wrong types. |
| 2 | **Patch validator** — `src/lib/llm/patchValidator.ts` — takes a JSON patch and validates it against the current project config. Catches: invalid section types, non-existent component IDs, out-of-range values, type mismatches. |
| 3 | **Error recovery** — when validation fails: show user-friendly error, suggest retry, log the failure for debugging. Never apply an invalid patch. Never crash. |
| 4 | **Test with all simulated responses** — run every simulated response from Phase 20 through the parser + validator pipeline. All must pass. If any fail, fix the response OR fix the parser. |
| 5 | **Quality pass + close** — 140+ tests (heavy on parser/validator unit tests), full close protocol |

**Exit criteria:** Every simulated response parses correctly. Invalid responses produce helpful errors. Patch validator catches all invalid patches. 140+ tests.

---

### Phase 22: JSON Update Pipeline (Pre-LLM Ceiling)
**Focus:** Simulated LLM → JSON patch → preview update — the full loop without a real LLM
**Estimated effort:** 8-10 hours
**ADRs:** ADR-049 (LLM Integration Architecture)

| Sprint | Deliverables |
|--------|-------------|
| 1 | **Replace canned chat handler** — the current keyword matcher is replaced by the prompt template + simulated response pipeline. User types "add a pricing section" → prompt template fills → simulated response returns → parser extracts patch → patch applies → preview updates. The UX is identical to what real LLM will provide. |
| 2 | **Replace canned listen handler** — same pipeline for listen mode. STT transcript (simulated) → prompt template → simulated response → patch → preview. The demo sequences now use the real pipeline with simulated data. |
| 3 | **BYOK settings UI** — `src/pages/Settings.tsx` or modal — "Add your API key" with fields for: Claude API key, OpenAI API key, model selection. Keys stored in localStorage (never sent to server). Show "Using simulated responses" when no key is set. Show "Connected to Claude" when key is valid. |
| 4 | **LLM adapter interface** — `src/lib/llm/adapter.ts` — abstract interface that the chat/listen pipeline calls. Two implementations: `SimulatedAdapter` (returns canned responses, used when no API key) and `ClaudeAdapter` (calls real API, used when key is set). The adapter is the ONLY thing that changes in Phase 23. |
| 5 | **End-to-end integration test** — full flow: type in chat → prompt generated → simulated response → parsed → validated → patch applied → preview updated → spec regenerated. All using simulated responses. |
| 6 | **Quality pass + close** — 150+ tests, persona review, full close protocol |

**Exit criteria:** Chat and listen use the prompt template pipeline (not keyword matching). BYOK UI exists. LLM adapter interface is defined with simulated implementation. Full end-to-end flow works with simulated data. 150+ tests. This is the PRE-LLM CHECKPOINT.

---

## ═══════════ PRE-LLM CHECKPOINT ═══════════

At this point the product:
- Has every feature working without an LLM call
- Has every section type audited against ADR-044
- Has prompt templates for every LLM action
- Has response schemas validated by Zod
- Has a simulated LLM pipeline that mirrors the real one
- Has BYOK UI ready for API key entry
- Has an adapter interface — swap SimulatedAdapter for ClaudeAdapter = done
- Has 150+ tests
- Has marketing site ready for launch
- Has open-source repo ready for strangers to clone
- Scores 85+ on all major personas

**This is the open-source release candidate.**

---

## STAGE C: LLM INTEGRATION

### Phase 23+: Real LLM
**Focus:** Connect real Claude API, real STT, real database
**ADRs:** ADR-050+ (LLM Integration, Database Schema, Auth)

| Milestone | Deliverable |
|-----------|-------------|
| 23a | **Claude API connection** — swap SimulatedAdapter for ClaudeAdapter. Real chat commands produce real JSON patches via Claude. BYOK only. |
| 23b | **Web Speech API / Whisper** — real STT for listen mode. Transcript → prompt → Claude → patch → preview. |
| 23c | **Streaming responses** — typewriter effect with real streamed tokens, not simulated delays |
| 23d | **AISP intent agents** — specialized agents per action type (HeroAgent, PricingAgent, ThemeAgent). AISP Crystal Atoms as the routing protocol. |
| 24 | **Database + Auth** — Supabase. User accounts. Cloud project save. Project sharing. Version history. |
| 25 | **Team features** — workspaces, collaboration, SSO, audit trails |
| 26 | **Open core split** — two-repo architecture, tiered features, commercial branch |

---

## SUMMARY TABLE

| Phase | Stage | Focus | Tests | Key Deliverable |
|-------|-------|-------|-------|-----------------|
| 15 | A | Developer Assistance | 112+ | Tooltips, errors, shortcuts, docs |
| 16 | A | Advanced Features Review | 115+ | Effects, context, specs, resources verified |
| 17 | A | Feature Review ADR + Pilot | 118+ | ADR-044 checklist + Hero pilot at 95/100 |
| 18 | A | Comprehensive Sweep | 125+ | All 16 sections reviewed + fixed |
| 19 | A | System-Wide Review | 130+ | Pre-LLM requirements, OSS release prep |
| 20 | B | LLM Prompt Templates | 135+ | Every prompt designed, simulated responses |
| 21 | B | Response Validation | 140+ | Parser, validator, error recovery |
| 22 | B | JSON Update Pipeline | 150+ | Full simulated LLM loop, BYOK UI, adapter |
| **—** | **—** | **PRE-LLM CHECKPOINT** | **150+** | **Open-source release candidate** |
| 23+ | C | Real LLM | 160+ | Claude API, STT, streaming, intent agents |
| 24 | C | Database + Auth | 170+ | Supabase, accounts, cloud save |
| 25 | C | Teams | 175+ | Workspaces, SSO, collaboration |
| 26 | C | Open Core Split | 180+ | Two repos, tiered features |

---

## ENFORCEMENT

Every phase follows ADR-038 (5-stage protocol):
1. INGEST — read CLAUDE.md + phase README + SWARM.md
2. EXECUTE — tasks in priority order, commit per logical unit
3. VERIFY — tests pass, test count ≥ previous, AISP Platinum
4. CLOSE — all 7 artifacts, honest retrospective
5. HANDOFF — push, verify deploy, summary

Every phase follows ADR-043 (test regression prevention):
- Test count is monotonically non-decreasing
- Phase 15 must restore to 102+ before adding new tests

The swarm reads SWARM.md at session start. No exceptions.