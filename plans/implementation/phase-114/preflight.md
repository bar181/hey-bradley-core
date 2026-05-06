# P114 — Feature Audit + Fix

> **Phase:** P114 · **Sprint:** FEATURE-AUDIT + FIX · **Date:** 2026-05-04
> **Branch:** swarm/p114-feature-audit-fix
> **Predecessor:** P113 sealed at `f6004ba` + persistence-eval flagged 8 gaps

## Mandate

Two-part:
1. **Audit every major feature surface** — persistence + slug recall + image selector + spec creation + BYOK + LLM matrix + chat/listen/builder + ConversationLog + retention + quality UX
2. **Fix the gaps** — wave 2 implementation; wave 3 closer

Persistence is the load-bearing fix:
- `saveProject()` has zero UI callers
- Welcome has no recent-projects card
- No slug-based URL recall (e.g. `/p/<slug>` to reload a saved project)

The user wants comprehensive — not just persistence — so we audit every feature, then fix in priority order.

## Audit waves

### Wave 1 — 4 parallel audit agents (research only)

#### A1 — Persistence + slug + recall path
- Verify saveProject() callers (zero today per persistence-verify audit)
- Document slug generation for new projects
- Design slug recall: `/p/<slug>` route OR query param `?project=<slug>`
- Welcome.tsx recent-projects card surface
- TopBar markSaved() integration
- Owned files: `plans/implementation/phase-114/audit-A1-persistence.md`

#### A2 — Image selector + spec creation + content generation
- Image library (300 in catalog per CLAUDE.md)
- Image-effect system (13 effects: 8 core + 5 wow-factor)
- How a user selects an image
- Spec generators (north star / SADD / impl plan / process map)
- 8 Crystal Atom generation paths
- Owned files: `plans/implementation/phase-114/audit-A2-content-creation.md`

#### A3 — BYOK + LLM matrix + chat/listen pipeline + auth
- BYOK key entry + storage (sessionStorage vs localStorage)
- 5 LLM providers (Claude / Gemini / OpenRouter / OpenAI / Cohere)
- Real chat pipeline path (post-P105 cleanTranscript wire + post-P113 voice extraction)
- Listen mode pipeline + STT calibration (CF#5)
- AgentProxy contract for sub-agent simulation
- Owned files: `plans/implementation/phase-114/audit-A3-byok-llm-pipeline.md`

#### A4 — Quality UX across major surfaces
- ChatInput (738 LOC; ADR-095 ≤750 cap)
- Builder mode (whiteboard at /builder)
- Preview rendering of 18 section types
- ConversationLog drill-down (P98+P99 fix-pass)
- EXPERT mode (5 center tabs: Preview / Blueprints / Resources / Data / Pipeline)
- Mobile UX (375/390/428 viewports per ADR-090)
- Onboarding flow (handleStartNew / handleThemeSelect / handleExampleSelect)
- Welcome page front door
- Owned files: `plans/implementation/phase-114/audit-A4-quality-ux.md`

### Wave 2 — Fix dispatch (parallel; based on audit findings)

After audit lands, dispatch implementation agents in priority order:

1. **P1 (load-bearing): saveProject UI wire + slug recall + Welcome recent-projects** (~50-70 LOC)
2. **P1: TopBar markSaved() integration** (~10 LOC)
3. **P2: BYOK boundary fixes if any flagged**
4. **P2: Image selector polish if gaps**
5. **P3: ConversationLog / EXPERT polish**

### Wave 3 — Closer

- ADR-142 (Feature Audit + Persistence Fix Standard)
- tests/p114-feature-audit-fix.spec.ts (≥15 cases)
- EOP triplet
- CLAUDE.md sync

## Hard rules

1. RESEARCH FIRST — Wave 1 is read-only; no source modifications
2. Wave 2 dispatch only AFTER Wave 1 audit landed
3. Each fix must cite the audit finding it closes
4. tsc strict CLEAN both configs after each wave
5. EOP triplet at phase root

## Acceptance gates

- 4 audit docs landed at `plans/implementation/phase-114/audit-A{1-4}-*.md`
- Master fix list with priority + LOC estimate
- ADR-142 Accepted
- ≥15 P114 tests GREEN
- Cumulative regression preserved
