# P85 — AISP Integration Audit (Preflight)

> **Phase:** P85 · **Sprint:** AISP Visibility Audit · **Date:** 2026-05-01
> **Predecessor:** P84 sealed at `fc86f3c` (~1011+ GREEN, 109 ADRs, v1.0.0-RC1 ready)
> **Cross-refs:** ADR-053 (INTENT_ATOM), ADR-082 (Open Core RC), ADR-091 (Canonical Component Quality), ADR-099 (DECOMP_ATOM), ADR-104 (Page-Aware Pipeline)

## Mandate

Confirm AISP is used everywhere appropriate; dual-view where UX allows; never sacrifice UX for AISP visibility.

**Encoded principle (ADR-110):**
- IF AISP adds precision without UX cost → use AISP only
- IF AISP would confuse a non-technical user → show both (dual-view)
- IF choice is forced → always choose UX (option A)

## 4 agents · 2 waves

### Wave 1 (parallel) — A1 + A3 + A4

#### A1 — Codebase AISP surface audit (READ-ONLY)
**Owns:**
- `plans/strategic-reviews/2026-05-01-aisp-integration-audit.md` (NEW; ≤300 LOC) — surface inventory:
  - **AISP-visible** (already user-facing): chat reply collapsible AISP trace (P55), spec panel AISP tab, EXPERT mode atom traces
  - **Internal-only-correct** (UX would suffer): templateApplier internals, rule-based parser internals
  - **Dual-view candidates** (would benefit from surfacing without UX cost):
    - Template matcher: confidence + selected name in chat reply
    - DECOMP: show decomposed Todo list to user before executing
    - Error states: AISP error code in EXPERT mode (alongside human message)
    - Onboarding (Agentics mode): one developer-focused AISP explainer card
    - Blog post template: AISP code block snippet pattern
  - Score table: surface | category | rationale | recommendation
**Constraints:** READ-ONLY; doc artifact only; cite file:line for every claim.

#### A3 — Developer AISP onboarding card
**Owns:**
- `src/components/onboarding/AISPDeveloperCard.tsx` (NEW; ≤140 LOC) — small dismissable card surfaced to developers in **Agentics mode** (NOT Whiteboard / Planning):
  - 4-line explanation of Crystal Atom structure (INTENT, ASSUMPTIONS, SELECTION, CONTENT, PATCH)
  - One real example showing an INTENT atom Σ shape
  - "Learn more" link to `https://github.com/bar181/aisp-open-core`
  - Dismiss button → localStorage flag `hb-aisp-card-dismissed-v1`; never shown again after dismiss
  - Token-derived spacing/colors per ADR-091; `data-testid="aisp-developer-card"` + `data-testid="aisp-card-dismiss"`
- Integration point: Add to whichever component renders the Agentics mode landing — find it via `grep -rn "agentics" src/components/ | grep -i mode | head`. Likely `ModeSelectorCard.tsx` is the entry; the card should render on Agentics mode select OR in an Agentics-mode-only landing surface.
- If no clear Agentics landing exists yet, the card stands alone as an unmounted component this sprint and gets wired in P94 when Agentics mode lands.

**Constraints:** Surgical; no animation libs; ADR-091 token compliance.

#### A4 — ADR-110 + tests + EOP
**Owns:**
- `docs/adr/ADR-110-aisp-visibility-standard.md` (NEW; ≤120 LOC; Status: Accepted; cites ADR-053 + ADR-082 + ADR-091)
  - Encodes the 3-line principle above
  - Decisions: (1) UX trumps AISP visibility when forced; (2) dual-view = human primary + AISP collapsible secondary; (3) the 5 dual-view candidates surfaced this sprint; (4) developer onboarding card pattern in Agentics mode
- `tests/p85-aisp-integration.spec.ts` (NEW; ≥15 cases; Playwright `test.describe`/`test`):
  - P85.1 ADR-110 file shape (4)
  - P85.2 AISP audit doc landed (1)
  - P85.3 AISP developer card exists + has 4 testids/dismiss/link (3)
  - P85.4 Template matcher confidence surface (1) — verify A2 wired confidence text into chat reply OR confidence appears in pipeline result type
  - P85.5 DECOMP user-visible todo list (1) — verify A2 surfaced decomp.todos with user-facing render
  - P85.6 KISS — no animation libs in P85 source (1)
  - P85.7 EOP triplet (3)
- `plans/implementation/phase-85/{02-post-review.md, session-log.md, retrospective.md}`
- `CLAUDE.md` sync (ADRs 109 → 110; tests +15; capabilities entry)

**Constraints:** ADR ≤120 LOC; tests use `@playwright/test`; ROOT = `process.cwd()`. existsSync guards on A2's surfaces (P85.4 + P85.5) for skip-friendliness in case Wave 2 hits unexpected.

### Wave 2 (sequential after Wave 1) — A2

#### A2 — Dual-view implementation (reads A1 audit FIRST)
**Owns:**
- `src/components/shell/ChatThread.tsx` OR closest chat-reply renderer (EDIT — surface template-match confidence chip when matcher fired; "Selected `<theme>` (confidence X.XX)" — collapsible/inline based on personality)
- `src/components/shell/ChatThread.tsx` OR adjacent (EDIT — when DECOMP fires with ≥2 todos, render user-visible todo summary "I found N things to do: 1. … 2. …"; behind the existing trace surface OR as a new pre-execute message)
- `src/contexts/intelligence/chatPipeline.ts` (EDIT — surface confidence/match name + decomp todo array on the result envelope so renderers can consume; surgical type widening only)
- Either `src/lib/mapChatError.ts` or the error-render component (EDIT — append AISP error code suffix in EXPERT mode only; defer in default UX)

**Constraints:** Reads A1 audit findings BEFORE writing — implements ONLY the surfaces A1 marks as `dual-view-candidate`. KISS — no UX rewrites; surgical inserts. tsc clean. No animation libs. Backward-compat — existing chat-reply tests must remain GREEN.

## Hard rules
1. NO new dependencies
2. NO Framer Motion / GSAP / Lottie / React Spring / animejs
3. NO touching files outside owned list
4. UX > AISP visibility — when in doubt, hide AISP
5. NO shell commands inside agents (except tsc + targeted playwright run)
6. TypeScript-strict
7. KISS — surgical edits; complex UX rewrites are post-RC

## Acceptance gates
- AISP integration audit doc landed; surface table populated
- 5 dual-view candidates surfaced (or explicitly deferred with rationale)
- AISP developer card component exists; dismissable; testid in place
- ADR-110 Accepted citing ADR-053 + ADR-082 + ADR-091
- ≥15 P85 tests GREEN
- Full session OC chain regression (P62-P85) GREEN — ≥700
- tsc strict clean

## Carry-forwards
- Wire AISPDeveloperCard into Agentics mode landing → P94 (when Agentics mode ships)
- Geek-personality demo flow showing AISP trace prominently → P89 candidate
- Blog template AISP code-block macro → P89 candidate
